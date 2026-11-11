#!/usr/bin/env python3
"""Build public/finder/finder-data.json from Mits verified data (all-models.json)."""
import json
import re
from pathlib import Path

SRC = Path('/workspace/mits-data/all-models.json')
OUT = Path('/workspace/quiz-app/public/finder/finder-data.json')

IMAGES = {
    'rvr-2026': '/finder/img/rvr.png',
    'rvr-2027': '/finder/img/rvr.png',
    'eclipse-cross-2026': '/finder/img/eclipse-cross.png',
    'outlander-2026': '/finder/img/outlander.png',
    'outlander-2027': '/finder/img/outlander.png',
    'outlander-phev-2026': '/finder/img/outlander-phev.png',
    'eclipse-sportback-2027': '/finder/img/eclipse-sportback.png',
}
FAMILY = {
    'rvr-2026': 'rvr',
    'rvr-2027': 'rvr',
    'eclipse-cross-2026': 'eclipse-cross',
    'outlander-2026': 'outlander',
    'outlander-2027': 'outlander',
    'outlander-phev-2026': 'outlander-phev',
    'eclipse-sportback-2027': 'eclipse-sportback',
}
# AutoTrader Tricity Mitsubishi (seller 47941112) new listings, Nov 11, 2026 (America/Dawson_Creek).
# tricitymits.com inventory was blocked by bot protection.
STOCK = {
    'rvr-2026': True,
    'rvr-2027': True,
    'eclipse-cross-2026': True,
    'outlander-2026': True,
    'outlander-2027': True,
    'outlander-phev-2026': True,
    'eclipse-sportback-2027': True,
}
STOCK_COUNTS = '2026 Eclipse Cross (31), 2026 Outlander (40), 2026 Outlander PHEV (59), 2026 RVR (13), 2027 Eclipse Sportback EV (3), 2027 Outlander (7), 2027 RVR (21)'

# Confirmed on Tricity Convertus inventory links: /vehicles/new/?view=grid&sc=new&md=Outlander (etc.).
# yr and tr are Convertus VMS filter params (API uses yr, mk, md, tr, sc). Year/trim could not be
# live-clicked because tricitymits.com is behind Cloudflare.
LINKS = {
    "inventory": {
        "base": "https://www.tricitymits.com/vehicles/new/",
        "modelParam": "md",
        "yearParam": "yr",
        "trimParam": "tr",
        "params": {"view": "grid", "sc": "new", "mk": "Mitsubishi"},
        "note": "Convertus inventory SRP. Path /vehicles/new/ plus view=grid&sc=new&md={model} is confirmed on Tricity pages (md values: Outlander, Outlander PHEV, Eclipse Cross, RVR). mk, yr and tr match the Convertus VMS filter API. Trim-level filtering could not be live-verified (Cloudflare). Use the model+year URL for the main button; optional per-trim links add tr=."
    },
    "buildAndPrice": {
        "provider": "mitsubishi-motors.ca",
        "base": "https://www.mitsubishi-motors.ca/en/buy/configure-your-mitsubishi/configurator",
        "note": "No model-specific Build & Price deep links were found on tricitymits.com. Official Mitsubishi Canada configurator URLs (vehicle + year) are used instead. All seven were fetched as HTTP 200 on 2026-11-11."
    }
}
INVENTORY_MODEL = {
    "outlander-2026": "Outlander",
    "outlander-2027": "Outlander",
    "outlander-phev-2026": "Outlander PHEV",
    "eclipse-cross-2026": "Eclipse Cross",
    "eclipse-sportback-2027": "Eclipse Sportback",
    "rvr-2026": "RVR",
    "rvr-2027": "RVR",
}
BUILD_AND_PRICE = {
    "eclipse-sportback-2027": "https://www.mitsubishi-motors.ca/en/buy/configure-your-mitsubishi/configurator?vehicle=60kewf344deo3rsmnuok7j&year=2027",
    "outlander-phev-2026": "https://www.mitsubishi-motors.ca/en/buy/configure-your-mitsubishi/configurator?vehicle=xoiookxoaw0tizqht2jf3z&year=2026",
    "outlander-2027": "https://www.mitsubishi-motors.ca/en/buy/configure-your-mitsubishi/configurator?vehicle=bjp0e8elcw88ozs2ddv17l&year=2027",
    "outlander-2026": "https://www.mitsubishi-motors.ca/en/buy/configure-your-mitsubishi/configurator?vehicle=bjp0e8elcw88ozs2ddv17l&year=2026",
    "eclipse-cross-2026": "https://www.mitsubishi-motors.ca/en/buy/configure-your-mitsubishi/configurator?vehicle=ohiwuwrgvyma9ez12a1eq&year=2026",
    "rvr-2027": "https://www.mitsubishi-motors.ca/en/buy/configure-your-mitsubishi/configurator?vehicle=vde9y7wnb1d9d8xdyjo67r&year=2027",
    "rvr-2026": "https://www.mitsubishi-motors.ca/en/buy/configure-your-mitsubishi/configurator?vehicle=vde9y7wnb1d9d8xdyjo67r&year=2026",
}

BUILD_MODEL_CODES = {
    "outlander-phev-2026": {
        "ES S-AWC": "GN0WXDMHZL3M-NA_C61",
        "SE S-AWC": "GN0WXDXHZL3M-NA_U62",
        "LE S-AWC": "GN0WXDXHZL3M-NA_F61",
        "SEL S-AWC": "GN0WXDXHZL3M-NA_F62",
        "GT S-AWC": "GN0WXDUHZL3M-NA_F63",
        "GT PREMIUM S-AWC": "GN0WXDUHZL3M-NA_F64",
        "GT NOIR S-AWC": "GN0WXDUHZL3M-NA_L61"
    },
    "outlander-2027": {
        "ES S-AWC": "GM2WXTMCZL3M-NA_C71",
        "SE S-AWC": "GM2WXTXCZL3M-NA_C72",
        "LE S-AWC": "GM2WXTXCZL3M-NA_F73",
        "SEL S-AWC": "GM2WXTXCZL3M-NA_F75",
        "GT S-AWC": "GM2WXTUCZL3M-NA_F76",
        "GT PREMIUM S-AWC": "GM2WXTUCZL3M-NA_F77",
        "GT NOIR S-AWC": "GM2WXTUCZL3M-NA_L71"
    },
    "outlander-2026": {
        "ES S-AWC": "GM2WXTMCZL3M-NA_C61",
        "SE S-AWC": "GM2WXTXCZL3M-NA_C62",
        "LE S-AWC": "GM2WXTXCZL3M-NA_F63",
        "SEL S-AWC": "GM2WXTXCZL3M-NA_F65",
        "GT S-AWC": "GM2WXTUCZL3M-NA_F66",
        "GT PREMIUM S-AWC": "GM2WXTUCZL3M-NA_F67",
        "NOIR S-AWC": "GM2WXTUCZL3M-NA_L61"
    },
    "eclipse-cross-2026": {
        "ES S-AWC": "GK1WXTJUZL3M-NA_C61",
        "SE S-AWC": "GK1WXTXUZL3M-NA_C62",
        "NOIR S-AWC": "GK1WXTXUZL3M-NA_L61",
        "GT S-AWC": "GK1WXTXUZL3M-NA_C64"
    },
    "eclipse-sportback-2027": {
        "EV": "00000DEAC2LC-NA_F71",
        "EV + Technology Package": "0000DEAC2LCP-NA_F72",
        "EV Tech Pkg": "0000DEAC2LCP-NA_F72"
    },
    "rvr-2027": {
        "ES FWD": "GA2WXTMHL3M-NA_C71",
        "ES AWC": "GA2WXTMHZL3M-NA_C72",
        "SE AWC": "GA5WXTXHZL3M-NA_C74",
        "SEL AWC": "GA5WXTXHZL3M-NA_C75",
        "NOIR AWC": "GA5WXTXHZL3M-NA_L71",
        "GT AWC": "GA5WXTXHZL3M-NA_C76"
    },
    "rvr-2026": {
        "ES FWD": "GA2WXTMHL3M-NA_C61",
        "ES AWC": "GA2WXTMHZL3M-NA_C62",
        "SE AWC": "GA5WXTXHZL3M-NA_C64",
        "SEL AWC": "GA5WXTXHZL3M-NA_C65",
        "NOIR AWC": "GA5WXTXHZL3M-NA_L61",
        "GT AWC": "GA5WXTXHZL3M-NA_C66"
    }
}


def inventory_trim(name, mid):
    if mid == "eclipse-sportback-2027":
        return "Technology Package" if "Tech" in name or "Technology" in name else "EV"
    # Keep RVR FWD vs AWC; drop S-AWC suffix used on Outlander / Eclipse Cross / PHEV official names
    return re.sub(r"\s+S-AWC$", "", name)


TAGLINES = {
    'rvr-2026': 'Compact 5-seat SUV — the lowest starting MSRP in this lineup.',
    'rvr-2027': 'The newer RVR, still a compact 5-seater.',
    'eclipse-cross-2026': '5-seat compact SUV with Super All-Wheel Control standard.',
    'outlander-2026': '7-passenger family SUV with S-AWC standard.',
    'outlander-2027': 'The newer 7-passenger Outlander, with S-AWC standard.',
    'outlander-phev-2026': "Canada's 7-passenger plug-in hybrid SUV.",
    'eclipse-sportback-2027': 'All-new battery-electric crossover, front-wheel drive.',
}

def parse_apr(s, fallback=None):
    if fallback is not None and not s:
        return fallback
    if isinstance(s, (int, float)):
        return float(s) * (100 if float(s) <= 1 else 1)
    m = re.search(r'[\d.]+', str(s))
    return float(m.group(0)) if m else None

def parse_seats(spec):
    s = str((spec or {}).get('seating') or '')
    m = re.search(r'\d+', s)
    return int(m.group(0)) if m else 5

def powertrain(p):
    p = (p or '').lower()
    if 'plug-in' in p or p == 'phev':
        return 'phev'
    if 'electric' in p or p == 'ev' or 'battery' in p:
        return 'ev'
    return 'gas'

def source_url(sources):
    for s in sources or []:
        if isinstance(s, dict) and s.get('type') == 'vehicle_page' and s.get('url'):
            return s['url']
    for s in sources or []:
        if isinstance(s, dict) and s.get('url') and str(s['url']).startswith('http'):
            return s['url']
    return None

def tags_for(text, drive):
    t = (text or '').lower()
    tags = []
    def add(tag, *needles):
        if any(n in t for n in needles):
            tags.append(tag)
    add('heated-front', 'heated front')
    add('heated-wheel', 'heated steering')
    add('heated-rear', 'heated 2nd', 'heated second', 'heated rear')
    add('sunroof', 'sunroof', 'glass roof', 'panoramic fixed glass', 'panoramic sunroof', 'glass roof with')
    add('leather', 'leather-appointed', 'leather appointed', 'semi-aniline', 'microsuede', 'synthetic leather')
    add('luxury', 'semi-aniline', 'front seat massage', 'gt premium', 'aluminum pedals')
    add('style', 'noir badge', 'black-painted', 'black dynamic', 'black-painted dynamic', 'noir led')
    add('safety', 'forward collision', 'blind spot', 'cross traffic', 'adaptive cruise',
        'lane departure', 'lane keep', 'parking sensor', 'multi view', 'mi-pilot',
        'active blind', 'traffic sign', 'rear aeb')
    add('tech', 'head-up', 'head up display', 'hud', 'embedded navigation', 'siriusxm 360',
        'google built-in', 'google built in', 'wireless charger', 'full digital driver',
        '14.3in display', '14.3-in', '14.3in digital')
    add('audio', 'rockford', 'yamaha', 'bose', '12-speaker', '12 speakers', '10-speaker',
        '10 speakers', '9-speaker', '9 speakers', 'premium 8-speaker', 'premium sound',
        'yamaha premium', 'yamaha ultimate', 'power sound system')
    add('comfort', 'hands-free', 'power liftgate', 'ventilated front', 'front seat massage',
        '3-zone', 'heated steering')
    if drive and drive.upper() not in ('FWD',):
        tags.append('awd')
    # unique, stable order
    seen = set(); out = []
    for x in tags:
        if x not in seen:
            seen.add(x); out.append(x)
    return out

def slug(name):
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')

def why_hints(mid, m, seats, pt, drive_kind, hs):
    hints = {}
    if seats >= 7:
        hints['family'] = 'It seats seven (5+2), including a third row.'
    if drive_kind != 'fwd_only':
        if mid.startswith('rvr'):
            hints['awd'] = 'All-Wheel Control is available (standard on every trim except ES FWD).'
        else:
            hints['awd'] = 'Super All-Wheel Control is standard.'
    if pt == 'ev':
        rng = (hs or {}).get('range_km') or 'Up to 454 km (estimated)'
        hints['ev'] = f'It is Mitsubishi’s battery-electric Eclipse Sportback, with {rng.lower() if not rng.endswith("estimated") else rng[0].lower()+rng[1:]}.'
        hints['range'] = hints['ev']
    if pt == 'phev':
        hints['phev'] = 'Plug in at home and cover many commutes on electric power.'
    if mid.startswith('rvr'):
        hints['budget'] = 'It has the most approachable starting MSRP in this lineup.'
        hints['size'] = 'A compact daily driver when you do not need a third row.'
        hints['city'] = 'Sized for commuting and easier parking.'
    cargo = (hs or {}).get('cargo_L')
    tow = (hs or {}).get('towing')
    if cargo and seats >= 7:
        hints['cargo'] = f'Strong cargo flexibility with the rear seats folded ({cargo.split("/")[-1].strip() if "/" in cargo else cargo}).'
    elif cargo and mid.startswith('eclipse-cross'):
        hints['cargo'] = f'Cargo is listed at {cargo}.'
    if tow:
        hints['cargo'] = ((hints.get('cargo') + ' ') if hints.get('cargo') else '') + f'Towing is listed at {tow}.'
        hints['cargo'] = hints['cargo'].strip()
    return hints

def highlights(mid, m, hs, starting, first_trim):
    out = []
    seats = hs.get('seating')
    if seats:
        out.append(f'{seats} seating' if 'passenger' in str(seats).lower() or 'seat' in str(seats).lower() else f'{seats} seats')
    if mid.startswith('outlander-202') or mid == 'outlander-phev-2026':
        # seating already includes 7
        pass
    pt = m.get('powertrain_type')
    if pt:
        pretty = {'gas': 'Gasoline', 'gas mild-hybrid': '1.5L turbo 48V mild hybrid',
                  'plug-in hybrid': 'Plug-in hybrid', 'battery electric': 'Battery electric'}.get(pt, pt)
        if mid.startswith('outlander-202'):
            out.append('1.5L turbo 48V mild hybrid')
        elif mid == 'outlander-phev-2026':
            out.append('Plug-in hybrid')
        elif mid == 'eclipse-sportback-2027':
            out.append('75 kWh battery; up to 454 km estimated range')
        else:
            out.append(pretty)
    drive = hs.get('drivetrain') or ''
    if 'S-AWC' in drive:
        out.append('S-AWC standard')
    elif mid.startswith('rvr'):
        out.append('FWD, or All-Wheel Control from ES AWC')
    elif 'front-wheel' in drive.lower() or 'FWD' in drive:
        out.append('Front-wheel drive')
    cargo = hs.get('cargo_L')
    if cargo and mid.startswith('outlander'):
        out.append(f'Cargo {cargo}')
    elif cargo and mid.startswith('rvr'):
        # keep short; full string is long
        out.append('614 L cargo behind the second row')
    elif cargo and mid.startswith('eclipse-cross'):
        out.append(f'Cargo {cargo}')
    elif cargo and 'sportback' in mid:
        out.append(f'Cargo {cargo}')
    tow = hs.get('towing')
    if tow:
        out.append(f'Towing {tow}')
    if mid == 'outlander-phev-2026':
        # only verified PHEV facts from headline / ES features
        out.append('DC quick-charge port standard')
        out.append('1,500-W household power supply standard')
    if mid == 'eclipse-sportback-2027':
        out.append('NACS DC fast charge up to 150 kW')
        out.append('Front-wheel drive')
    w = m.get('warranty') or {}
    if w.get('new_vehicle'):
        bits = []
        if w.get('new_vehicle'): bits.append(f"{w['new_vehicle']} new-vehicle")
        if w.get('powertrain'): bits.append(f"{w['powertrain']} powertrain")
        if w.get('roadside'): bits.append(f"{w['roadside']} roadside")
        out.append('; '.join(bits) + '. Warranty terms and conditions apply.')
    out.append(f'Starting at ${starting:,} MSRP ({first_trim})')
    # unique
    seen=set(); cleaned=[]
    for x in out:
        if x not in seen:
            seen.add(x); cleaned.append(x)
    return cleaned[:8]

def model_note(mid, m):
    notes = []
    if mid == 'eclipse-sportback-2027':
        notes.append("The 3.49% APR used for this model includes a 1.5% loyalty rate reduction for qualifying customers. The non-loyalty rate was not confirmed in the source files.")
        notes.append('Payments do not include a federal EVAP rebate.')
    if mid == 'outlander-2027':
        notes.append('Features follow the Mitsubishi Canada 2027 Outlander Ordering & Product Sourcebook (supplied Nov 4, 2026), which is the authoritative feature source for this model year.')
        notes.append('This model is offered at 5.89% APR for 60 months — a shorter term than the 2026 Outlander (3.99% / 84 months) — so weekly payments are not directly comparable across those two years.')
    if mid == 'rvr-2027':
        notes.append('For 2027, FAST-Key, push-button start and a heated steering wheel move down to SE; GT uses 6 speakers (no Rockford Fosgate 9-speaker system).')
        notes.append('The RVR is not rated for towing.')
    if mid == 'rvr-2026':
        notes.append('The RVR is not rated for towing.')
    if mid == 'outlander-phev-2026':
        notes.append('Payments do not include a federal EVAP rebate. Mitsubishi Canada does not publish a combined system horsepower for the PHEV.')
    return ' '.join(notes) if notes else None

def build():
    raw = json.loads(SRC.read_text())
    meta = raw['meta']
    models_out = []
    for m in raw['models']:
        mid = m['id']
        hs = m.get('headline_specs') or {}
        fees = m.get('fees') or {}
        fin = m.get('finance') or {}
        apr = parse_apr(fin.get('apr_percent'), parse_apr(fin.get('apr')))
        term = int(fin.get('term_months'))
        freight = fees.get('freight_pdi', m.get('freight_pdi'))
        ac = fees.get('ac_charge', 100)
        tire = fees.get('tire_duty')
        ehf = fees.get('ehf')
        seats = parse_seats(hs)
        pt = powertrain(m.get('powertrain_type'))
        drives = [(t.get('drivetrain') or '') for t in m['trims']]
        if all(d.upper() == 'FWD' for d in drives):
            drive_kind = 'fwd_only'
            drive_label = 'Front-wheel drive'
        elif any(d.upper() == 'FWD' for d in drives):
            drive_kind = 'awd_optional'
            drive_label = 'FWD or All-Wheel Control'
        else:
            drive_kind = 'awd'
            drive_label = drives[0] if drives else 'S-AWC'

        # cumulative features for tags
        cumulative = []
        trims_out = []
        for t in m['trims']:
            if t.get('headline_features'):
                cumulative = list(t['headline_features'])
            cumulative = cumulative + list(t.get('adds_over_trim_below') or [])
            display = t.get('headline_features') or t.get('adds_over_trim_below') or []
            # drop unresolved parentheticals that are research notes? keep verified text as written.
            name = t.get('full_name') or t.get('name')
            codes = BUILD_MODEL_CODES.get(mid) or {}
            build_code = codes.get(name) or codes.get(t.get('name')) or codes.get(t.get('full_name'))
            trims_out.append({
                'id': slug(name),
                'name': name,
                'msrp': t['msrp'],
                'drive': t.get('drivetrain'),
                'inventoryTrim': inventory_trim(name, mid),
                'buildModelCode': build_code,
                'tags': tags_for(' | '.join(cumulative), t.get('drivetrain')),
                'features': display,
            })

        starting = m['trims'][0]['msrp']
        first_name = m['trims'][0].get('full_name') or m['trims'][0]['name']
        model_fin = {
            'aprPercent': apr,
            'termMonths': term,
            'paymentsCount': fin.get('number_of_payments') or int(term * 52 / 12),
            'freightPdi': freight,
            'acCharge': ac,
            'tireDuty': tire,
            'ehf': ehf,
            'lender': fin.get('lender'),
            'offerStart': m.get('offer_start') or meta.get('offer_start'),
            'offerExpiry': m.get('offer_expiry') or meta.get('offer_expiry'),
        }
        if fin.get('loyalty_rate_note'):
            model_fin['loyaltyNote'] = "The 3.49% APR includes a 1.5% loyalty rate reduction for qualifying customers. The non-loyalty rate was not confirmed."

        item = {
            'id': mid,
            'family': FAMILY[mid],
            'name': m['model'],
            'year': m['year'],
            'yearLabel': str(m['year']),
            'inStock': STOCK[mid],
            'tagline': TAGLINES[mid],
            'seats': seats,
            'powertrain': pt,
            'powertrainLabel': m.get('powertrain_type'),
            'drive': drive_kind,
            'driveLabel': drive_label,
            'startingMsrp': starting,
            'image': IMAGES[mid],
            'source': source_url(m.get('sources')),
            'inventoryModel': INVENTORY_MODEL[mid],
            'buildAndPriceUrl': BUILD_AND_PRICE[mid],
            'highlights': highlights(mid, m, hs, starting, first_name),
            'whyHints': why_hints(mid, m, seats, pt, drive_kind, hs),
            'finance': model_fin,
            'trims': trims_out,
        }
        note = model_note(mid, m)
        if note:
            item['note'] = note
        models_out.append(item)

    data = {
        'dataSource': {
            'primary': '/workspace/mits-data/all-models.json',
            'readme': '/workspace/mits-data/README.md',
            'retrieved': meta.get('retrieved'),
            'assembled': meta.get('created'),
            'note': 'Trim names, MSRPs, features, freight/PDI, fees, and BC offer rates/terms come from the Mits verified data pack (Nov 11, 2026). Weekly payments in the finder are recalculated with one consistent formula and do not copy the guide weeklies (those sometimes deducted employee price adjustments, and they used up to $799 dealer admin instead of Tricity’s $995 documentation fee).'
        },
        'finance': {
            'downPayment': 0,
            'paymentsPerYear': 52,
            'docFee': 995,
            'docFeeNote': 'Tricity default documentation fee. The Mits BC offer all-in figures used up to $799 dealer administration and listed doc_fee as null (no $995 fee in those offer files). This finder uses $995 and does not also add the $799 admin fee. Change docFee here if you want a different amount.',
            'includeEmployeeAdjustment': False,
            'employeeAdjustmentNote': 'Employee price adjustments exist on some models in the Mits files but are NOT deducted here, so weekly comparisons stay consistent across the lineup.',
            'offerStart': meta.get('offer_start'),
            'offerExpiry': meta.get('offer_expiry'),
            'offerWindowLabel': 'November 3–30, 2026',
            'formula': 'PMT = P * i / (1 - (1+i)^-n), i = APR/52, n = termMonths * 52 / 12, $0 down, before taxes. P = MSRP + freight/PDI + A/C charge + tire duty + EHF + docFee.',
            'notes': [
                'Weekly payments are approximate estimates only, for comparison, and are not an offer to finance.',
                'Each model uses its published Mitsubishi Canada BC finance rate and term (valid November 3–30, 2026).',
                'Principal P = official MSRP + freight & PDI + $100 A/C charge + tire duty + $5.24 EHF + the documentation fee in this config (default $995).',
                'Employee price adjustments are not deducted.',
                'Payments are before taxes. Licensing, insurance, registration and other charges are extra.',
                'On approved credit (OAC). Rates, terms and payments vary by customer, model, trim and current programs, and are subject to change — confirm with the dealer.',
                'The 2027 Eclipse Sportback 3.49% APR includes a 1.5% loyalty rate reduction for qualifying customers; the non-loyalty rate was not confirmed.',
                'Federal EVAP is not included in PHEV or Sportback payments.',
                'Dealer may sell for less. Inventory and official pricing can change.',
            ],
        },
        'dealer': {
            'name': 'Tricity Mitsubishi',
            'address': '2060 Oxford Connector, Port Coquitlam, BC V3C 0A4',
            'phone': '(604) 474-4340',
            'phoneHref': 'tel:+16044744340',
            'website': 'https://www.tricitymits.com',
            'inventoryUrl': 'https://www.tricitymits.com/mitsubishi-inventory/',
            'testDriveUrl': 'https://www.tricitymits.com/',
        },
        'links': LINKS,
        'inventoryNote': (
            'Mits research files do not include a current Tricity new-vehicle stock list by trim. '
            'tricitymits.com inventory pages were blocked by the dealership site’s bot protection. '
            'In-stock flags below are based on AutoTrader listings for Tricity Mitsubishi (dealer id 47941112) on November 11, 2026, which showed new examples of: '
            + STOCK_COUNTS +
            '. Set inStock to false on a model in this file to hide it from the finder. Not every official trim is necessarily on the lot at this moment.'
        ),
        'models': models_out,
    }
    OUT.write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n')
    print('Wrote', OUT, 'models', len(models_out))

    # print computed weeklies for the report
    def pmt(P, apr, months, ppy=52):
        n = months * ppy / 12
        i = (apr/100) / ppy
        return P * i / (1 - (1+i)**(-n))
    print('\nComputed weeklies (MSRP+freight+AC+tire+EHF+995, no employee adj):')
    for m in models_out:
        f = m['finance']
        fees = f['freightPdi']+f['acCharge']+f['tireDuty']+f['ehf']+995
        print(f"  {m['id']}  {f['aprPercent']}% / {f['termMonths']} mo  fees={fees:.2f}")
        for t in m['trims']:
            P = t['msrp'] + fees
            w = pmt(P, f['aprPercent'], f['termMonths'])
            print(f"    {t['name']:24s} MSRP {t['msrp']:7d}  P={P:10.2f}  approx ${w:7.2f}/wk  tags={t['tags']}")

if __name__ == '__main__':
    build()
