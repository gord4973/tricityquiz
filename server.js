const express=require('express'),http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto'),QR=require('qrcode');
const app=express(),srv=http.createServer(app),io=require('socket.io')(srv,{cors:{origin:'*'}});
const DATA=path.join(__dirname,'data/games.json'),PWF=path.join(__dirname,'data/host_password.txt');
fs.mkdirSync(path.dirname(DATA),{recursive:true});
if(!process.env.HOST_PIN&&!fs.existsSync(PWF))fs.writeFileSync(PWF,String(crypto.randomInt(100000,999999)),{mode:0o600});
const PW=(process.env.HOST_PIN||fs.readFileSync(PWF,'utf8')).trim();
let games=fs.existsSync(DATA)?JSON.parse(fs.readFileSync(DATA)):{};
if(!Object.keys(games).length){const id='sample';games[id]={id,updated:Date.now(),title:'Tricity Mitsubishi Sample Quiz',questions:[
{text:'Which Mitsubishi is a plug-in hybrid SUV?',answers:['Mirage','Outlander PHEV','Eclipse Cross','RVR'],correct:1},
{text:'What colour is the triangle answer button?',answers:['Red','Blue','Yellow','Green'],correct:0},
{text:'How many seconds per question?',answers:['10','15','20','30'],correct:2}]};setTimeout(save,0)}
const save=()=>{fs.writeFileSync(DATA+'.tmp',JSON.stringify(games,null,1));fs.renameSync(DATA+'.tmp',DATA)};
const QT=20000;
const pts=ms=>Math.max(10,Math.round(100-90*Math.min(ms,QT)/QT));
app.use(express.json({limit:'8mb'}));app.use(express.static(path.join(__dirname,'public')));
const auth=(q,r,n)=>q.get('x-pw')===PW?n():r.status(401).json({error:'bad password'});
app.post('/api/login',(q,r)=>r.json({ok:q.body.pw===PW}));
app.get('/api/games',auth,(q,r)=>r.json(Object.values(games)));
app.post('/api/games',auth,(q,r)=>{const g=q.body;if(!g.id)g.id=crypto.randomUUID();g.updated=Date.now();games[g.id]=g;save();r.json(g)});
app.delete('/api/games/:id',auth,(q,r)=>{delete games[q.params.id];save();r.json({ok:1})});
app.get('/api/qr',async(q,r)=>r.type('svg').send(await QR.toString(String(q.query.u||''),{type:'svg',margin:1})));
app.get(['/j/:pin','/play'],(q,r)=>r.sendFile(path.join(__dirname,'public/play.html')));
app.get('/admin',(q,r)=>r.sendFile(path.join(__dirname,'public/admin.html')));
app.get('/host',(q,r)=>r.sendFile(path.join(__dirname,'public/host.html')));
const rooms={};
function newPin(){let p;do p=String(crypto.randomInt(1000,9999));while(rooms[p]);return p}
const board=R=>Object.values(R.players).sort((a,b)=>b.score-a.score).map(p=>({name:p.name,score:p.score}));
function endQ(R){if(R.state!=='q')return;R.state='reveal';clearTimeout(R.timer);const q=R.game.questions[R.qi];
 const dist=[0,0,0,0];Object.values(R.players).forEach(p=>{const a=p.ans[R.qi];if(a)dist[a.c]++});
 io.to(R.pin).emit('reveal',{correct:q.correct,dist,top:board(R).slice(0,5)});
 Object.values(R.players).forEach(p=>{const a=p.ans[R.qi];io.to(p.sid).emit('result',{correct:!!(a&&a.ok),gained:a?a.pts:0,score:p.score,rank:board(R).findIndex(x=>x.name===p.name)+1})});}
io.on('connection',s=>{
 s.on('host:create',({pw,gameId},cb)=>{if(pw!==PW||!games[gameId])return cb({error:'denied'});const pin=newPin();
  rooms[pin]={pin,game:games[gameId],host:s.id,players:{},qi:-1,state:'lobby'};s.join(pin);s.data.hostPin=pin;cb({pin,title:games[gameId].title,n:games[gameId].questions.length})});
 s.on('host:next',()=>{const R=rooms[s.data.hostPin];if(!R)return;R.qi++;
  if(R.qi>=R.game.questions.length){R.state='end';return io.to(R.pin).emit('end',{top:board(R).slice(0,5)})}
  const q=R.game.questions[R.qi];R.state='q';R.start=Date.now();
  io.to(R.pin).emit('question',{i:R.qi,n:R.game.questions.length,text:q.text,answers:q.answers,image:q.image||null,dur:QT,serverStart:R.start});
  R.timer=setTimeout(()=>endQ(R),QT+300)});
 s.on('host:skip',()=>{const R=rooms[s.data.hostPin];R&&endQ(R)});
 s.on('join',({pin,name},cb)=>{const R=rooms[pin];name=String(name||'').trim().slice(0,20);
  if(!R)return cb({error:'Game not found'});if(!name)return cb({error:'Enter a nickname'});
  if(R.state!=='lobby')return cb({error:'Game already started'});
  if(Object.keys(R.players).length>=150)return cb({error:'Game is full'});
  if(Object.values(R.players).some(p=>p.name.toLowerCase()===name.toLowerCase()))return cb({error:'Nickname taken'});
  R.players[s.id]={sid:s.id,name,score:0,ans:{}};s.join(pin);s.data.pin=pin;cb({ok:1,title:R.game.title});
  io.to(R.host).emit('players',Object.values(R.players).map(p=>p.name))});
 s.on('answer',(c,cb)=>{const R=rooms[s.data.pin];const p=R&&R.players[s.id];if(!p||R.state!=='q'||p.ans[R.qi])return cb&&cb({error:'locked'});
  const el=Date.now()-R.start;if(el>QT)return cb&&cb({error:'locked'});const ok=c===R.game.questions[R.qi].correct,g=ok?pts(el):0;
  p.ans[R.qi]={c,ok,pts:g};p.score+=g;cb&&cb({ok:1});
  const cnt=Object.values(R.players).filter(x=>x.ans[R.qi]).length;io.to(R.host).emit('answered',cnt);
  if(cnt===Object.keys(R.players).length)endQ(R)});
 s.on('disconnect',()=>{const pin=s.data.hostPin;if(pin){clearTimeout(rooms[pin]?.timer);io.to(pin).emit('hostgone');delete rooms[pin]}
  const R=rooms[s.data.pin];if(R&&R.state==='lobby'){delete R.players[s.id];io.to(R.host).emit('players',Object.values(R.players).map(p=>p.name))}});
});
module.exports={pts};
srv.listen(process.env.PORT||3456,()=>console.log('quiz on',process.env.PORT||3456));
