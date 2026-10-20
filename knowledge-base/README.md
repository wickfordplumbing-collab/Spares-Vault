# Boiler Spares Knowledge Base — Wickford Plumbing Supplies

Created: 19 Oct 2026 (Europe/London) — first trawl, not exhaustive.
Purpose: help counter / phone staff identify the right boiler spare, find the correct manufacturer part number, and understand what a Gas Safe engineer is likely to need — without diagnosing gas work for DIY fitting.

## How to use this knowledge base

1. Start here for the workflow, then:
2. `brands-and-manuals.md` — where the official manual / spares diagram for that make lives, and how its model / GC / serial numbers work.
3. `fault-diagnosis.md` — symptom first, then brand fault-code system. Use it to narrow to *likely* part(s), not to declare a part faulty.
4. `parts-glossary.md` — what each part does, typical failure symptoms, common confusions (e.g. diverter valve body vs motor vs cartridge).
5. `part-number-identification.md` — the checklist to run before ordering anything.
6. `dhs-and-suppliers.md` — DHS (Direct Heating Spares) lookup, PartsArena, and merchant cross-checks.
7. `forums-and-resources.md` — professional forums / helplines, and their access limits.
8. `model-fault-and-spares-tables.md` — (Round 2) per-model fault tables + spares notes from manuals actually fetched.
9. `testing-values.md` — (Round 2) NTC tables, voltages and resistances stated in those manuals, per model.
10. `dhs-lookup-worked-examples.md` — (Rounds 2-3) ten live DHS appliance lookups with GC, listing numbers and MPNs as displayed.
11. `model-fault-and-spares-tables.md` §11-27 — (Round 3) Vaillant retry, Duo-tec 2/Promax/Main platform, Vogue, Greenstar 2000/8000, Vitodens 050, Alpha NX, Ultimate3, Heatline Monza, Keston Combi 2, Ariston Clas.
12. `legacy-boilers.md` — (Round 3) Suprima, Classic, Junior/CDi, TurboMAX/CombiCompact, CXi legacy identification, obsolete/supersession cautions.
13. `cross-brand-equivalents.xlsx` + `.csv` — (deep pass, Dan's part-number chaining) Verified cross-brand = **19 truly cross-company rows**; separate same-company sheets: Baxi Heating 17 rows, Vaillant Group 6 rows (both NOT cross-brand, not counted); 14 probable. New 'Also listed as / chain' column shows every number matched together per row (diverter motor, diverter valve, flow turbine, pressure sensor, PRV, AAV, NTC, APS chains).
14. `cross-brand-equivalents.md` — method, group/OEM logic, traps (178985 collision, coding plugs, 24V vs 230V valves), counter verification workflow.

## Safety / legal note — read first

- Work on gas appliances, flues, combustion, gas valves, burners and sealed combustion chambers in the UK must be done by a **competent person**; anyone carrying out gas work for payment must be **Gas Safe registered** for that appliance type. Sources: Gas Safety (Installation and Use) Regulations 1998 reg.3 — https://www.legislation.gov.uk/uksi/1998/2451/regulation/3 ; HSE L56 — https://www.hse.gov.uk/pUbns/priced/l56.pdf ; Gas Safe Register — https://www.gassaferegister.co.uk/
- This knowledge base is for **parts identification and counter advice only**. It does not make a householder competent to open a boiler, and we should not talk a non-registered person through gas-side, flue or combustion repairs.
- Safe customer-level checks we *can* mention are those in the manufacturer's user guide: system pressure (typically re-pressurise to 1–1.5 bar where the user guide says so), condensate pipe frozen outside, gas meter credit / supply on, controls / thermostat calling, reset **once** as the user guide instructs. If it recurs — Gas Safe engineer.
- Use only manufacturer-approved spares. Baxi makes this point explicitly, including liability for copy/refurbished parts: https://www.baxi.co.uk/professional/services/spare-parts

## Quick fault-to-part diagnostic workflow

```
1. IDENTIFY THE APPLIANCE EXACTLY
   - Photo of the DATA BADGE / data plate (not just the front logo)
   - Make, full model, output (kW), GC number (format 00-000-00), serial number, fuel (NG/LPG), combi/system/heat-only
   - Front badges lie: a case swapped or a range name (e.g. "Logic") covers many variants.

2. GET THE SYMPTOM IN PLAIN WORDS
   - No heating AND no hot water? Heating only fails? DHW only fails? Intermittent? Noise? Leak? Lockout?
   - When does it happen (from cold, after 10 mins, only on DHW draw-off, in cold weather)?

3. READ THE FAULT CODE EXACTLY AS DISPLAYED
   - Letters matter: F / L / E / EA etc., flashing or solid, any second code alternating.
   - Photograph the display. Note if the code changes after reset.

4. CONFIRM IN THE MANUAL FOR *THAT* MODEL
   - Fault-code tables differ by model/generation within the same brand. Check the
     installation & servicing instructions for that appliance, not a generic blog list.
   - List what the manual says the code means AND its listed causes — most codes have 3-6 causes.

5. ISOLATE BEFORE ORDERING A PART
   - Cheap/external causes first: pressure, air, frozen/blocked condensate, gas supply,
     controls calling, pump running, system sludge/blockage, condensate, flue terminal.
   - Engineer tests (Gas Safe): supply voltages, sensor resistance vs the manual's table,
     fan operation, ignition sequence stage reached.

6. CROSS-CHECK THE PART NUMBER
   - Exploded diagram + position number -> manufacturer part number -> supersessions
   - See part-number-identification.md checklist (voltage, gas type, seals included?, kit contents)

7. ORDER WITH THE FULL ID ON THE NOTE
   - "Make + model + GC + serial + part number + diagram position" on every order/enquiry.
```

### The ignition sequence (why "which stage did it reach?" locates the part)
A modern condensing boiler normally runs: call for heat → pump/fan pre-purge → fan proven (air pressure / fan speed feedback) → ignition spark → gas valve opens → flame detected (rectification/ionisation) → modulation. Where it stops points to the family of parts: no fan = fan/PCB/power; fan runs, no spark = ignition/PCB/ APS on older types; spark, no flame = gas/ignition position/condensate/flue; flame lights then drops = rectification electrode/lead/earth/condensate. This is generic method only — the manual for the model governs.

## Our stock — pending

**No boiler-spares stock list was found on the box on 19 Oct 2026.** I checked `/workspace` (including `stock_existing*.txt`, `price-file-index.md`, `/workspace/intact/`, `/workspace/vaillant/`). What exists is:
- `/workspace/vaillant/sp.pdf` / `sp.txt` — a Vaillant *spare parts catalogue* (ecoTEC plus 824/831/837 etc., doc 0020010870.05 GB 10/2008) — a manufacturer's catalogue, **not** Wickford stock.
- `/workspace/price-file-index.md` — an index of supplier price files on a shared drive, mentioning e.g. an Intergas price list (Sept 2022, marked old) and STC "Baxi January 24.pdf" — not a stockholding list.

**To match "what do we hold" I need one of:**
- An Intact / Xline stock export (CSV or Excel) filtered to boiler spares / heating spares, ideally with: our SKU, description, manufacturer part number, brand, stock qty, location; **or**
- A simple product list / shelf list from the spares bay (photo or spreadsheet).

Once supplied, the parent agent can cross-reference it against the part categories in `parts-glossary.md` and build a "usually-in-stock vs order-in" list. Do not assume any part is in stock until that export is seen.

## Limits of this first trawl
- Prioritises current/common UK domestic combi, system and heat-only boilers and *method* + common faults. Legacy / commercial / oil coverage is signposted, not deep.
- No part number, fault code or resistance value is included unless it came from a fetched official/manual source, cited next to it. Anything else is marked `unverified — check manual`.


## Round 2 additions (19 Oct 2026, evening)
- Added model-level fault tables for: Baxi 600 Combi 2, Glow-worm Energy7, Ideal Logic Combi2, Worcester Greenstar 4000, Viessmann Vitodens 100-W, Intergas Combi Compact HRE, Alpha E-Tec 28/33, Vokera Easi-Heat Plus Ci, Ferroli Modena HE — each cited to its fetched manual. Vaillant ecoTEC manual fetch failed (HTTP 500/rejected) and is routed, not reproduced; several requested models remain uncovered and are listed honestly in the model file § 'Not covered'.
- Added testing-values.md: Ideal thermistor table + flowchart voltages/resistances, Intergas 12k NTC table + 4.5mm spark gap, Viessmann NTC 10k curve method (>10% deviation), ionisation >2 µA, Vokera §7.9 component values — all per-manual, with brand-transfer warnings.
- Added six DHS worked examples (Ideal Logic 30, Vaillant ecoTEC Plus 831, Baxi DuoTec HE 28, Worcester 28i Junior, Glow-worm Betacom 30C, Intergas HRE 28/24) fetched 19 Oct 2026. Prices/stock are live — re-check at order.
- Forums/fault files extended with two fully-fetched UK Plumbers Forums threads (Vaillant F.75; Ideal Logic diverter) and the generation-code trap.
- Stock position unchanged: still no Intact/Xline spares export seen (see 'Our stock — pending').


## Round 3 additions (19 Oct 2026, late evening)
- **Vaillant retry succeeded** with a different official manual file (ecoTEC plus 0020244997_07); ecoFIT pure combi also fetched. F.75 now documented in four different manual wordings — model name is mandatory.
- Added model sections §11-27: Duo-tec 2 (with its printed Short Parts List — real Baxi numbers, cross-checked against DHS), Promax Ultra & Main Eco Compact (same numeric code platform, *selectively* shared part numbers — flow sensor shared, diverter motor not), Baxi Combi 2 vs Duo-tec platform warning, Ideal Vogue Max (gas-valve test range differs from Logic: 1-10kΩ vs 4kΩ±2), Worcester Greenstar 2000 & 8000 (numeric Bosch system), Vitodens 050-W (100-W family), Alpha E-Tec Plus NX (printed short parts list), Glow-worm Ultimate3, Heatline Monza (Vaillant-family, own thresholds), Keston Combi 2 (Ideal thermistor table — verified identical), Ariston Clas ONE (unique digit-group codes 501 etc.).
- Failed/partial, documented not invented: Intergas Xclusive official PDF captcha-blocked (F000-F031 search-level only), Rapid not fetched, Morco manual direct fetch failed (sign-in manuals page route), Esprit/Compact/Evoke/Capriz/Titanium not parsed.
- New file legacy-boilers.md: Suprima (PCB kit 5111603), CombiCompact VCW (GC 47-044-18, obsolete-era parts), CXi supersessions ('NOW USE' examples, one no-replacement part), Classic/Junior/CDi notes.
- DHS examples now 10 (added DuoTec 2 GA 24 — 3 of 4 manual cross-checks pass, diverter motor differs; Suprima 50; CombiCompact; CXi 38).
- fault-diagnosis.md gains a 10-row counter quick-reference.
- Stock: **still pending** — no Intact/Xline spares export has been supplied; nothing in these files claims Wickford stock.


## Cross-brand equivalents (19 Oct 2026)
- **Exhaustive 14-family sweep (night): Verified 27 (was 19), Baxi same-company 17, Vaillant 9, Other groups 2, Probable 75.** New 'Coverage' sheet + cross-brand-coverage.csv. 14 single-retailer rows moved Verified→Probable (Dan's rule). Riello/Vokera are now Ariston Group (Jul 2026), and Alpha is Immergas Group. See the 'Exhaustive family sweep' section in cross-brand-equivalents.md. Stock is still pending the Intact/Xline export; Gas Safe note applies.
- Added cross-brand-equivalents.xlsx/.csv and cross-brand-equivalents.md. **Corrections per Dan: Baxi/Main/Potterton = Baxi Heating (one company); Vaillant/Glow-worm/Saunier Duval = Vaillant Group (one company).** Both sets moved to their own 'Same company — NOT cross-brand' sheets. **Deep pass (Dan's chaining method): Verified cross-brand is now 12 truly cross-company rows** — diverter motor Elbi chain (7216534=997147=BI1101102=0020118640…), diaphragm diverter valve (998069=BI1011503=500601), flow turbine (65100541=JJJ000619050=BI1271501), pressure sensor (0020059717=87186510420, moved up from Vaillant sheet), Caleffi PRV, AAV/Grundfos 59200320, NTC 10027351, Huba APS 65100716, plus the original pump head, Honeywell valve and 2 vessels. Same-company: Baxi 17, Vaillant 5. Probable 12. Ideal's Grundfos turbine kit (176473=59200311) has no cross link, **but Dan's screenshot challenge on the brass Fugas cartridges was right**: Ideal 175660/61/62 and Baxi 7663533/35/7798983 are the same Fugas cartridge family at different litres/min ratings — 2 verified rating-matched Ideal↔Baxi rows added (12L strong, 8L compatible-maker), 10L pairing in Probable due to a rating conflict (175662 called 12L in the UK, 10LT by the Turkish maker). Verified now 14, Probable 13. **AAV pass (same evening): +5 verified AAV rows** — Caleffi AV.235 head (104521=BI1212107=7828557=10025485=1.022102=174894=65104703…), AV.230 head (248043=S1005600=6013101), AV.170 (1.010771=5130570), 3/8in Caleffi 502030 vent (87161405000=061707=075452), AV.250B (720777601=175804, conflicts with AV.250's Baxi leg — flagged); AV.250 chain deepened. Verified now **19**, Vaillant same-company 6, Probable 14. Most boiler AAVs are standard Caleffi vents in brand bags — thread (3/8 vs 1/2) and head-vs-complete are the traps. Stock still pending Intact export.
- **Gap passes A/B + final audit (19 Oct 2026): Verified 33, Vaillant 16, Baxi 18, Other groups 4, Probable 67.** 12 promoted on second independent sources (9 in pass A, 3 in pass B); 6 single-source Verified rows demoted; 6 same-group rows moved out of Probable; 8 new rows from the Ravenheat/Halstead/Heatline categories. The Euro PCB section has only 55 products, all already scanned. Intergas/Morco: no cross-references found. OEM catalogues (Zilmet/Elbi/Huba) carry no boiler-brand codes. See the Coverage sheet. Stock is still pending the Intact/Xline export; Gas Safe note applies.
