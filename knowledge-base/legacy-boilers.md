# Legacy Boilers — still on repair rounds (Round 3, 19 Oct 2026)

Identification rule is doubled for legacy: many have had case/PCB swaps over 20+ years. **GC number + serial from the data plate is the only reliable key** — DHS appliance pages are organised exactly that way. Spares caution: listings mix current, superseded ('NOW USE …') and obsolete/no-replacement parts. Always read the product title in full.

## Potterton Suprima (30-100, L models) — heat-only, cast-iron era successor
- Verified GCs (search/DHS): Suprima 50 **41-607-77** (DHS page fetched, round 3 worked examples); range GCs 41-607-75 (30) to 41-607-82 (100) per trade listings — verify per output on badge.
- Typically fails: **PCB is the famous one** — DHS lists Potterton **5111603 Suprima PCB Kit 30-100** as the current kit (fetched on Suprima 50 page). Also on that page: gas valve 402550, fan 40958801, thermistor 404516, overheat thermostat 404517, electrode 407754.
- Caution: PCB kit is an *upgrade kit* (L models included in listings) — follow kit instructions; original single-board numbers may not order directly. Combustion-chamber insulation (5000537 front etc.) still listed — fragile on strip-down, order before opening.
- Source: https://www.dhsspares.co.uk/category/gas-boiler-uk/brand/potterton/appliance/potterton-suprima-50-pot338

## Potterton Profile / Prima, Baxi Solo — NOT deep-verified this round
- No manual/DHS page fetched for Profile/Prima/Solo in round 3. One verified sighting: 'Baxi 238295 Pilot Solenoid Solo 2 PF' appears as a cross-listed part on the DHS Suprima 50 page (fetched) — pilot-era Solo parts still catalogue-listed, but availability must be checked live per part.
- Route: DHS brand → Potterton/Baxi → exact model + GC. Do not claim typical-failure lists for these from memory. `unverified — check DHS/manual`.

## Ideal Classic (FF/RS, Mexico-era relatives)
- Round 1 verified DHS example (Ideal Classic FF 350, GC 41-391-96) with fan 171461, gas valve 171441, electrode 171442 etc. — see part-number-identification.md. Classic is the poster child for GC importance: FF/RS/SE/NF variants share names, parts differ (fan kits split 30-80 vs 30-60 on that page).
- Typical legacy pattern (from that fetched listing only): fans, gas valves, ignition electrodes, limits/thermostats and casing seals dominate the listing — heat-only, so no diverter/plate faults; DHW complaints on a Classic install are system/cylinder-side, not boiler spares.

## Worcester 24i/28i Junior & Greenstar CDi classic
- Round 3/2 verified DHS: Greenstar 28i Junior FSN NG **GC 47-311-87**, 267 parts listed (search) — fan 8716118443, electrodes 87161163810, flow sensor 8716122562 on fetched page (round 2 worked examples).
- CDi classic uses **letter codes (EA etc.)** — round 1 official manual extraction. The numeric 2000/4000/8000 system (round 3 §18/19) must not be applied to CDi/Junior-era boilers, and vice versa.
- Caution: Junior/CDi parts numbers are long Bosch numbers with generation splits (FSN suffix matters — it denotes a variant on the DHS appliance name itself).

## Vaillant TurboMAX / CombiCompact (VCW, 1988-95 era)
- Verified: CombiCompact VCW 282 E (88-95) **GC 47-044-18**, DHS page fetched round 3 (worked examples) with sub-diagrams including **Water Valve (to 04/95) vs (from 05/95)** — build-date split inside one model name.
- Obsolete evidence (search-verified, Heating Spare Parts listings): Vaillant 082745 listed 'OBSOLETE gas shut-off valve', 075549 'OBSOLETE covering plate' for this era — i.e. some parts are genuinely NLA; a DHS listing existing does not guarantee supply. Check live and prepare the customer for obsolete outcomes on gas-section parts.
- TurboMAX spare catalogue exists as a manufacturer document (heatingspares host, search-listed) — use via Vaillant/DHS cross-check, `host flagged`.

## Glow-worm CXi / HXi / Ultimate (pre-Energy)
- Verified DHS CXi 38 **GC 47-047-27** (fetched): PCB **2000802731** 'XI Range PCB Replacement' (also HXI/SXI), fan 801645, thermistor 801722, electrode kit 0020152564, pressure sensor S5720500 (Saunier Duval cross-listing — Vaillant-group sibling brand appearing in Glow-worm listings is normal here).
- **Supersession examples verified in search:** Glow-worm 801673 disconnector 'NOW USE 2000802600 filling loop'; 2000802658 interface card 'NOW USE 0020027897'. And a no-replacement example: S210188 rear combustion insulation listed with no known replacement (search summary) — obsolete can mean fabricate-or-condemn discussions for the engineer, not a counter sale.
- Ultimate (original/CXi-era): manuals via Glow-worm legacy page (round 1); Ultimate3 is the current generation (model file §23) — do not mix.

## Ferroli DOMI / older Modena-era
- Modena HE fault system is in model file §10 (round 2). DOMIproject/DOMIcondens generation: **no manual fetched round 3** — route Ferroli documentation (round 1) / DHS by GC. Ferroli legacy support in the UK has historically been thinner than Baxi/Vaillant — set delivery expectations only after a live DHS check. `typical failures unverified — do not quote from memory`.

## General legacy rules (all verified by examples above)
1. GC first, always — outputs/variants multiply (Suprima 30-100 = 7 GCs).
2. Read 'NOW USE', 'OBSOLETE', build-date splits (to/from month-year) on every listing.
3. Insulation/seals on strip-down: order the fragile bits (Suprima insulation, CXi door seal 801635) *with* the main part.
4. Heat-only legacy boilers (Suprima, Classic, Solo, Profile) have no combi hydraulics — route DHW faults to system parts.
5. If a gas-section part is NLA, that is an engineer/manufacturer conversation about appliance future — counter should flag early, not keep ordering alternatives.
