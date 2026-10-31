const {io}=require('socket.io-client'),fs=require('fs');const B=process.argv[2]||'http://localhost:3456',PW=fs.readFileSync('data/host_password.txt','utf8').trim();
const H={'content-type':'application/json','x-pw':PW};
(async()=>{const g=await (await fetch(B+'/api/games',{method:'POST',headers:H,body:JSON.stringify({title:'Tricity Mitsubishi Sample Quiz',questions:[
{text:'Which Mitsubishi is a plug-in hybrid SUV?',answers:['Mirage','Outlander PHEV','Eclipse Cross','RVR'],correct:1},
{text:'What colour is the Kahoot-style "triangle" button?',answers:['Red','Blue','Yellow','Green'],correct:0},
{text:'How many seconds per question?',answers:['10','15','20','30'],correct:2}]})})).json();
console.log('game',g.id);
const h=io(B,{transports:['websocket']});const {pin}=await new Promise(r=>h.emit('host:create',{pw:PW,gameId:g.id},r));console.log('pin',pin);
const N=150,ps=[];let joined=0,res=[];const t0=Date.now();
await Promise.all([...Array(N)].map((_,i)=>new Promise(r=>{const s=io(B,{transports:['websocket']});ps.push(s);s.on('connect',()=>s.emit('join',{pin,name:'P'+i},x=>{if(x.ok)joined++;r()}))
 s.on('question',q=>{const d=i%3===0?0:i%3===1?10000:25000;if(d<20000)setTimeout(()=>s.emit('answer',i%2?q.answers.length&&0:{0:1,1:0,2:2}[q.i]),d)});s.on('result',x=>res.push({i,...x}))})));
// note: odd players answer 0 (wrong on q0/q2, right on q1); even players answer correctly
console.log('joined',joined,'in',Date.now()-t0,'ms; full reject:',await new Promise(r=>{const s=io(B,{transports:['websocket']});s.emit('join',{pin,name:'extra'},x=>{r(x.error);s.close()})}));
for(let q=0;q<3;q++){res=[];const rv=new Promise(r=>h.once('reveal',r));const ts=Date.now();h.emit('host:next');const R=await rv;
 console.log(`Q${q+1} reveal after ${Date.now()-ts}ms dist`,R.dist,'top',R.top.slice(0,3));await new Promise(r=>setTimeout(r,500));
 const gain=k=>[...new Set(res.filter(x=>x.i%6===k).map(x=>x.gained))];console.log(' results',res.length,'gains instant-correct',gain(0),'10s-wrongOrRight',gain(1),'none',gain(2),'| 10s even',gain(4))}
const end=new Promise(r=>h.once('end',r));h.emit('host:next');console.log('podium',(await end).top.slice(0,3));process.exit(0)})();
