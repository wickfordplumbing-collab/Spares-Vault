# Cross-Brand Equivalents — method, traps, counter verification

> **Correction (19 Oct 2026, per Dan): Baxi, Main and Potterton are the SAME company (Baxi Heating, BDR Thermea). They are NOT separate cross-brand entities.** All Baxi/Main/Potterton same-number rows have been removed from the Verified cross-brand sheet/count and moved to a separate sheet: **'Same company — Baxi Heating (Baxi / Main / Potterton) — NOT cross-brand'** (17 rows). That information is still useful at the counter (one bin serves the three badges), but it is never counted or presented as cross-brand.
> **Second correction (19 Oct 2026, per Dan): Vaillant, Glow-worm and Saunier Duval are the SAME company — Vaillant Group — so they are NOT cross-brand either.** All 4 Vaillant-group rows have been moved off the Verified cross-brand sheet to their own sheet: **'Same company — Vaillant Group (Vaillant / Glow-worm / Saunier Duval) — NOT cross-brand'**.
> **Exhaustive family sweep (19 Oct 2026, night): Verified cross-brand is 27 (was 19)**. Same-company: Baxi Heating 17, Vaillant Group 9, Other groups 2 (Riello group; Ariston/Chaffoteaux/Ecoflam). Probable: 75. A new **Coverage** sheet (also exported as cross-brand-coverage.csv) records, for each family, the seeds tried, chains found, brands with no equivalence and blocked sources. Consistency fix: 14 rows that rested on one retailer's page were moved from Verified to Probable, in line with Dan's rule. Older text below this line describes the earlier passes.

> **Deep pass (19 Oct 2026, Dan's part-number chaining method):** Verified cross-brand sheet = **19 rows, all truly cross-company** (+5 AAV rows this pass, see AAV section below; Vaillant same-company sheet now 6, Probable 14). New chained rows: Elbi/Bitron diverter motor (7216534=997147=BI1101102=0020118640=…), diaphragm diverter valve complete (998069=BI1011503=500601=0020025277), Fugas/Chunhui flow turbine (65100541=JJJ000619050=BI1271501), water pressure sensor (0020059717=87186510420, moved up from Vaillant sheet because the chain spans Bosch), Caleffi PRV (190751=87161424160=075248), AAV (87161064450=176457/Grundfos 59200320), NTC 10027351, Huba APS 65100716. Same-company sheets (not counted): Baxi Heating 17 rows, Vaillant Group 5 rows (fan + flow sensor added; pressure sensor moved out to Verified because its chain spans companies). Probable sheet = 12 rows. A new **'Also listed as / chain'** column in the spreadsheet shows every number matched together per row.

Companion to `cross-brand-equivalents.xlsx` / `.csv`. Fetched 19 Oct 2026. Every Verified row has an evidence URL that was actually fetched in this task (or in rounds 1-3, where stated). Prices/stock never copied — re-check live.

## How the same part ends up with different numbers (3 routes)

### A) Corporate groups share platforms
- **Baxi Heating (Baxi / Main / Potterton / Remeha) — SAME COMPANY, not cross-brand:** Heating Spare Parts' part-number pages list *the same manufacturer code* under the company's badges for sensors (720747101, 720789201), diverter motor (7216534), cartridge (7656807), plate (7223558), pressure switch (5114748), 8L vessel (5114691), PRV (248056), AAV (248043), electrodes (720767301/720767101), gasket (5114755), SIT gas valve kit (720301001), Suprima PCB kit (5111603). This is same-company platform sharing — all 17 such rows live on the 'Same company — Baxi Heating' sheet and are excluded from cross-brand counts. Platform sharing is *selective*, not total — see traps.
- **Vaillant Group (Vaillant / Glow-worm / Saunier Duval / Protherm) — SAME COMPANY (Vaillant Group), not cross-brand:** different *numbers* for the same component is the pattern here — pressure sensor Vaillant 0020059717 = Glow-worm 0020014190/0020079644 = Saunier S5720500/0020023216. Saunier-numbered parts appear on Glow-worm DHS appliance pages (PRV 0020047005, sensor S5720500 on CXi). All 4 such rows live on the 'Same company — Vaillant Group' sheet and are excluded from cross-brand counts — exactly as for Baxi Heating.
- **Ideal Group (Ideal / Keston):** shared *test data* verified (identical thermistor tables in both manuals) — but that does not prove the physical part number is shared; that row sits in Probable.
- **Bosch (Worcester), Ariston, Ferroli, Alpha, Intergas:** cross-brand sharing mostly appears via OEM components (route B) rather than group part-number systems in the sources fetched. Intergas Xclusive/HRE evidence this task was within-brand only. Atlantic/Intergas grouping: `no cross-brand part evidence fetched — do not claim`.

### B) Common OEM makers inside many brands
- **Grundfos-pattern pumps:** one compatible DUCA 15-60 unit is retailer-cross-listed against 30+ brand numbers (Worcester 8716…, Vaillant 1609…/0020136638, Glow-worm, Ideal 175…, Baxi 248042, Vokera, Ariston). Useful — but it's a *compatible*, not proven-genuine, route.
- **Honeywell/Resideo gas valves:** VK4105G (Ideal 075432 = Baxi Heating 245341 — truly cross-company, Ideal vs Baxi Heating) is verified cross-company. VK4105M5108 (5107339) is only evidenced across Baxi Heating's own badges/models, so it moved to the Same-company sheet. The OEM VK code is the real identity; brand number is a label on it.
- **SIT:** 848 Sigma kit as Baxi Heating 720301001 (same-company sheet, not cross-brand evidence).
- **Zilmet-pattern vessels:** compatible 8L/4L units cross-listed against Bosch, Ariston, Ferroli, Ideal, Vaillant numbers (Worimex). Shape and connection rule, not litres alone.
- Not evidenced this task (searched, no fetched tie to specific brand numbers): Giannoni/Sermeta heat exchangers, FIME/ebm-papst fans (search-level only — in Probable), Bertelli, Caleffi as named maker for 248056 (retailer page doesn't state maker — left blank in sheet), Elbi. They stay out of Verified.

### C) Supersessions printed on the listing
- Baxi SIT valve 5119647 → **720301001** (DHS 'has been replaced by', old part discontinued).
- Glow-worm disconnector 801673 → **2000802600 filling loop** (function itself changed).
- Suprima PCB kit 5111603 replaces 5102160/407750/238091 (retailer listing).
- DHS product titles carry 'NOW USE …' — always read the whole title (round-3 CXi lesson).

## Group audit of the remaining 4 verified rows (checked for hidden same-group pairings)
- **Pump head (universal compatible):** its fit list spans Bosch, Ideal Group, Vaillant Group, Baxi Heating, Ariston, Ferroli etc. — cross-company rests on that span. Pairs *inside* the list that are same-group (Vaillant vs Glow-worm; Bosch vs Buderus) are not themselves the claim.
- **Honeywell VK4105G:** Ideal (Ideal Group) ↔ Baxi Heating — different groups. Clean.
- **Zilmet 8L vessel:** Bosch vs Buderus inside the list are one group (Bosch) and are not counted as cross; the row is cross-company because it also spans Ariston, Ferroli and Ideal Group. Annotated in the sheet.
- **Zilmet 4L vessel:** Vaillant vs Protherm inside the list are one group (Vaillant Group) and are not counted as cross; the row is cross-company because it also spans Ferroli, Riello, Hermann, Unical. Annotated in the sheet.
- Probable sheet audited too: CXi PCB/interface rows labelled Vaillant Group same-company; Ideal/Keston row labelled Ideal Group same-group; Baxi 720788001 row labelled Baxi Heating internal; Intergas rows are within-brand conflicts, not cross-brand.

## The big traps (all found in real sources this task / rounds 1-3)

1. **Same number, different part (brand collision): 178985** is a Vaillant 3-bar PRV **and** an Ideal front door panel assembly (both fetched on Heating Spare Parts). A bare number without brand is meaningless.
2. **Same number, conflicting description: 720788001** — Duo-tec 2 manual calls it a Hall effect sensor; the retailer lists it as a drain tap under all three Baxi-group brands. One of them is wrong; do not sell by number until PartsArena/photo confirms.
3. **Coding/R.D.S. and output coding:** Duo-tec 2 R.D.S. units are output+fuel specific (720843201-5301) and fitting one triggers code 55 (calibration). Vaillant DSN/coding resistor (F.70/F.92) — a PCB that 'fits' can still be wrong for the appliance.
4. **24V vs 230V gas valves:** Ideal Logic gas valve is a 24V kit (179032, 24Vdc test); Vokera/Viessmann gas trains are 230Vac. VK model suffixes (VK4105G**1005** vs **1179**, M**5108** vs M**5033** in retailer listings) are different valves wearing one family name.
5. **Diverter trio:** motor (7216534) / cartridge (7656807) / complete valve (7224764-type) — three orders, one symptom. And platform sharing is selective: flow sensor 720747101 is shared Baxi↔Main, diverter motor in Duo-tec 2's manual (720788601) differs from Main's (7216534) while DHS fits 7216534 to Duo-Tec 2 — serial/output check, not faith.
6. **Build-date splits:** Vaillant ecoTEC control box to/from 08-09/07; CombiCompact water valve to/from 04/95; Suprima/Duo Tec fits lists with BEFORE/AFTER serials; Intergas ignition module manual 801477 vs DHS 801537 (unresolved — Probable sheet).
7. **Ratings are model property:** PRV 3 bar (Baxi 248056) vs 3.5 bar (Glow-worm Betacom 0020061610); vessel 8L vs 10L, flat vs round, 3/8 vs M14; plate HEX by plate count/kW.
8. **Seals & kit contents:** combustion gasket 5114755 is itself a shared part — if you sell the shared fan/burner without the shared gasket, the job still fails. Check 'kit' contents (SIT 848 *kit* vs bare valve).
9. **Compatible ≠ genuine:** DUCA pump and Worimex vessels are compatible-pattern parts. For gas/combustion parts, genuine route is the default (Baxi liability note, round 1); compatibles must be sold as compatibles.

## Counter verification workflow (before selling anything as 'equivalent')
```
1. Brand + model + GC + serial from data badge (photo). No badge = no equivalence sale.
2. Find the part on the APPLIANCE's diagram/list first (DHS appliance page / PartsArena / manual short list).
3. Only then cross: does an evidence source (sheet row) tie THAT number to the other brand/number?
   - Same group number under 2+ brands (Heating Spare Parts pattern) = strongest.
   - Different numbers, one retailer cross-list (e.g. a same-group sensor pattern on the same-company sheets) = check plug/thread/photo on both listings; and first check the two brands are actually different companies (see sheet names).
   - OEM code match (VK…, SIT 848) = match the FULL suffix, not the family.
4. Check the trap list: voltage, rating (bar/L/plates), output/fuel, build date, coding device, seals included.
5. Write both numbers on the order ('supplied as X, equivalent to Y per [source]') so returns/credit are traceable.
6. If sources conflict (Intergas ignition, 720788001) — stop, phone manufacturer/DHS. Conflict is data, not a tie-break vote.
```


## Deep pass — Dan's part-number chaining (19 Oct 2026, evening)

Method, exactly as instructed: pick a seed part/number, fetch its product page, harvest **every** alternative/cross-reference/superseded number on that page, search those numbers, harvest the next page, and match the chain together. A row is Verified only where a page explicitly lists the numbers as alternatives for the same part (ideally two independent pages); single-page chains sit in Probable.

### Seeds worked, by family (honest result per family)
- **Diverter motors/actuators — WORKED, big chain found.** Seed: Glow-worm 0020118640 'Diverter Valve Motor 3WV ELBI' (Heating Spare Parts) → Elbi/Bitron motor → Fausto Elbi page (Ariston 997147, Saunier S5720600, Savio BI1351108/1101102, Riello 4365774/4364657, Chaffoteaux 61302483-01, Immergas 1.018064) → Euro DV.550/DV.551 (adds Baxi 7216534/248733/5132452/710188301, Glow 0020061621, Ideal 174813 on DV.551 only) → Worimex Chunhui motor page confirms Ariston/Riello/Biasi/Saunier subset. **This is the diverter motor Dan said was cross-branded — he was right.** TrustAPart's universal Elbi/Bitron actuator (220-240V) independently lists Alpha/Ariston/Biasi/Remeha/Glow-worm/Halstead/Heatline/Ravenheat/Ideal/Saunier/Vokera fits.
- **Diverter valves/cartridges/bodies — WORKED.** Complete diaphragm valve DV.650 chain (Ariston 998069/573121 = Biasi BI1011503 = Halstead 500601 = Protherm 0020025277/S93440070, also-fit Ideal CF80) confirmed on two pages (Euro + TradeBoilerParts, diaphragm BI1011103). Cartridge kit 44-BX-12 (Baxi/Ariston/Biasi title claim) is **Probable** — the fetched YourSpares page supports Baxi only.
- **Flow turbines/sensors — WORKED, with a negative result Dan asked to see.** Seed (Dan's example): Ideal flow turbine. Ideal 176473 = Grundfos 59200311, ABK-prefix onwards; earlier cartridges 175660/175661/175662 (8/12L variants) + sensor 175590. Chasing 59200311 found **no other brand's number** — that Grundfos kit is Ideal-only in every fetched listing, so no cross-brand row was made from it (forcing one would be invention). The cross-company flow chain came from the other direction: Worimex 'Flow Turbine Chunhui' + Ziperone Fugas pages match **Ariston 65100541 = Baxi JJJ000619050/619050 = Biasi BI1271501**. Vaillant ecoFIT flow sensor 0020211945=0020197555=0020213122 is Vaillant-Group-internal (same-company sheet).
- **Fans — chained, no cross-company chain found.** FIME GR01855N = Vaillant 0020020008 (Protherm 0020213171 — same group, moved to Vaillant sheet). Every other fan chain (Baxi Solo FA.180/182, Vaillant FA.151) stayed inside one brand. Do not sell fans cross-brand on wattage.
- **Gas valves — chained, mostly code-specific.** Honeywell VK4105G row stands. SIT 848: Ariston/Chaffoteaux share 0.848.123 (same group — Probable, labelled), Baxi SIT code is 848054, Vaillant 845119 — **different SIT codes are different valves**, not equivalents.
- **PCBs — chained, no cross-company chain found.** Euro PC. codes are all within-brand supersessions. PCBs remain model/coding-specific (see traps) — no row added, deliberately.
- **Pumps/pump heads** — existing universal Grundfos-pattern verified row stands (chain column now lists its 30+ numbers).
- **Pressure sensors/switches — WORKED.** Vaillant 0020059717 chain extended to Worcester 87186510420 (TrustAPart, two product pages) — row **moved from the Vaillant same-company sheet to Verified**, with the Glow-worm/Saunier links annotated as same-group inside. Huba APS 65/50 Pa: Ariston 65100716 (now 65104671-01) cross-listed for Baxi/Westen/Beretta by Ziperone + Worimex.
- **NTC thermistors — WORKED.** 10027351 is a genuine Vokera number (Heating Spare Parts) and the same sensor is cross-listed for Baxi/Westen/Beretta/Ariston (Ziperone). Beretta↔Vokera alone would be Riello same-group; the cross claim rests on Baxi/Ariston.
- **Ignition electrodes — chained, no cross-company chain found.** Euro IE.600/IE.700 are within-brand (Vaillant 090709; Baxi 5114702→720222801). Electrode geometry/lead differs — no row added.
- **Plate heat exchangers — chained, no cross-company row made.** Worimex Era plates are listed per-brand by plate count/spacing (Baxi 156mm 12/14/16/20P; Ideal 145mm) — same spacing is **not** proof of interchangeability, so nothing was forced into Verified.
- **Expansion vessels** — existing two Zilmet-pattern verified rows stand.
- **PRVs — WORKED.** Caleffi SV.130 chain: Vaillant 190751 = Worcester 87161424160 = Ideal 075248 = Ariston 569292/998447 = Halstead 450906 (Euro, original Caleffi part).
- **AAVs — WORKED.** AV.250: Worcester 87161064450 = Ideal 176457 (Grundfos 59200320 in the Heating Spare Parts title) = Ferroli 39818220 = Viessmann 7828750 = Alpha 1.027110. AV.110 Caleffi chain is category-page only → Probable.
- **Burner/insulation — chained, no chain found.** Baxi 5115060 / Vaillant 193595 etc. are brand/position-specific. No row.


### Ideal ↔ Baxi flow turbines — Dan's screenshot claim, tested (19 Oct 2026, late)

**Verdict in plain terms: Dan is substantially right, with one precision.** The Ideal and Baxi brass cartridges in the screenshot are the **same Fugas turbine-cartridge family** — same brass cartridge form, same job (spin a turbine, Hall sensor 175590-type reads it, boiler sees DHW demand). What differs between the numbers is the **flow rating**, which tracks boiler size. So it is category **(b) same body/cartridge family, different rating variant** — not (a) one identical part under two numbers, and not (c) look-alike. A rating-matched cartridge is the cross-brand buy; a wrong-rating one will physically go in but give wrong DHW flow/switching.

**What sets the rating:** the flow regulator/restrictor inside the cartridge housing. Ideal's own Logic manual states it twice: performance table footnote '** In areas of low water pressure the DHW restrictor can be removed' and servicing Frame 66 'the domestic hot water regulator may be removed from the DHW flow turbine cartridge' (manual fetched: downloads.ctfassets.net Ideal Logic Combi Installation & Servicing). No Fugas datasheet/K-factor was found — that mechanism is manual evidence, not an OEM spec sheet, and is recorded as such.

**Ideal range fetched:** 175660 HE24 Fugas 10391 (8L, Logic 24); 175661 HE30 Fugas 10393 (12L per UK retailer + compatible maker); 175662 HE35 Fugas 10394 (12L UK / '10LT' Turkish compatible maker — **conflict, see Probable**); 176139 HE38 Fugas 10.0457; 176876 40kW Vogue ref 10.0575; 176473 ABK-onwards Grundfos 59200311 kit (different system, no Baxi pairing).
**Baxi Heating range fetched:** 7663533 10L (Main Eco Compact 25/Potterton 25); 7663535 12L (Baxi 624/630/825/830, and via inlet 5114710 Duo-tec/Platinum per another retailer — fit lists differ, check GC); 7798983 12L (Duo-tec 2/EcoBlue, DHS); 711633500 → 767486000 10L; 7211822 12L 'flow regulator'.

**Pairings added to the sheet:** Verified — 12L: Ideal 175661/175662 ↔ Baxi 7663535/7798983; Verified (weaker, compatible-maker evidence, no Baxi genuine number) — 8L: Ideal 175660 sold as 'Baxi and Ideal compatible' at 8LT. Probable — 10L pairing, blocked by the 175662 rating conflict. Every turbine row carries 'match the litres/min rating to boiler size'.

**Regulator ≠ turbine cartridge (task 5):** do not conflate them. On ABK-onwards Logic the diagram lists them as separate items: 176470 flow regulator (Grundfos 59200313, item 124) vs 176473 flow sensor/turbine kit (59200311, item 127). On the older Fugas boilers the regulator is an insert *inside* the turbine-cartridge housing (removable per the manual), which is exactly why retailers muddle the names: Baxi 7211822 is called 'Flow Regulator 12L' by Spares-Direct (spring-loaded insert), 'Flow Turbine Cartridge' by Aspares (jointly with 7663535), and appears inside Worimex's turbine chain for JJJ000619050. Same housing, two functions, listings disagree — check the diagram position, not the retailer's title.

### Conflicts/traps found in this pass
- Euro lists **two** diverter-motor codes, DV.550 and DV.551, with overlapping but different number sets — DV.551 adds Ideal 174813 and Glow 0020118640. The 174813 leg is retailer-compatible only; Ideal's newer diverter motor 181018 is a **24V Minebea** kit — a different motor. Voltage (24V vs 220-240V) is the trap inside Dan's own diverter family.
- Worimex flow page lists Baxi 7211822 in the turbine chain, but 7211822 also appears as a Baxi **flow regulator** — description conflict, flagged in the sheet; verify on the appliance diagram.
- SIT gas-valve family names (848/845) hide different codes/coil colours/voltages — never cross on 'SIT 848' alone.
- Same bare number, shared sensor: 10027351 works cross-brand **only** where the manual's resistance curve matches (flue NTCs are often a different curve).


## AAVs / automatic air vents — Dan's hunch, tested (19 Oct 2026, late)

**You were right again: boiler AAVs are heavily cross-branded, and the reason is simple — most of them are standard Caleffi vents in brand packaging.** TradeBoilerParts literally sells the genuine Baxi vent headed 'Baxi 248043 — AAV Original Caleffi Part'. These are boiler-internal automatic air vents (pump manifold / vent body inside the boiler), **not** plumbing Durgo/soil air-admittance valves. Where the boiler part is just a standard heating vent, the rows say so (category c).

**OEM logic:** Caleffi dominates (MINICAL 5020 series: 502030 = 3/8" G, 502040 = 1/2" G, per Caleffi's official page; ROBOCAL/Slimline 5026-type; multifit vent heads). Grundfos/Wilo plastic pump bodies take screw-on vent heads (Euro AV.235/AV.235S). Flamco/Spirotech/Taco/Honeywell: searched, **no fetched tie to a UK boiler brand number** — they stay out of the sheet.

**Chains now on the sheet (all with the thread/form recorded):**
- **AV.250 complete vent (existing row, deepened):** Worcester 87161064450 = Ideal 176457 (Grundfos 59200320) = Ferroli 39818220 = Viessmann 7828750 = Alpha 1.027110 = Baxi 720777601.
- **AV.235 Caleffi HEAD (new):** one screw-on head lists Vaillant 104521→0010033857, Biasi BI1212107, Viessmann 7828557, Vokera 10025485/20035019, Alpha 1.022102, Ideal 174894, Ariston 65104703 (+ Vaillant-group Glow/Saunier/Heatline numbers inside). Category (b): same head, pump body differs.
- **AV.230 Caleffi HEAD (new):** Baxi 248043 (→5114706 complete vent) = Glow/Saunier S1005600/2000801898 = Sime 6013101.
- **AV.170 complete vent (new):** Alpha 1.010771 = Baxi 5130570/Potterton 5122330 (+ Grant MPCBS29 on a compatible listing).
- **AV.110 complete vent, 3/8" (new):** Worcester 87161405000 = Vaillant 061707 = Ideal 075452 = a bog-standard Caleffi 502030. Category (c) in its purest form.
- **AV.250B (new):** Baxi 720777601 = Ideal 175804 (two retailers) — **conflicts** with AV.250's Baxi leg (same Baxi number claimed for both Euro products); flagged in both rows, photo-match before selling.
- **Same-company Vaillant row added:** Vaillant 104521→0010033857 = Glow-worm 0020014161 = Saunier S1024500 (City Plumbing UCP page lists all three for one vent) — same group, not counted. The cross-company action for that vent is at head level (AV.235 via Biasi).
- **Intergas:** their HRE vent 843017 is a **manual** 3/8" air-release valve, not an automatic vent — a standard 3/8" automatic vent is the functional equivalent thread-wise, but no Intergas automatic-vent brand number was found to chain. Recorded here, no row invented.

**Thread/form traps (the whole game with AAVs):**
1. **3/8" vs 1/2":** Caleffi 502030 (3/8") and 502040 (1/2") look alike; Euro AV.110 (3/8") vs AV.120 (1/2", Ravenheat 5015015) vs AV.130 Slimline (3/8") are three different orders. Measure the tapping, not the silhouette.
2. **Head vs complete vent:** AV.235/AV.230/AV.220V are heads that screw onto an existing pump/vent body. A complete-vent number (248043, 104521) will not be fixed by a head if the body/float has failed — and a head is a fraction of the price, so this mistake is common and annoying.
3. **Head length:** AV.235S is a SHORT Grundfos/Wilo multifit head for 0010033857 — same family, different length.
4. **Same brand, different vent:** Ideal 175804 ≠ 176457 ≠ 174894 — three different Ideal vents. Worcester 87161064450 ≠ 87161405000 (complete vs 3/8" CDi-era). One brand badge proves nothing.
5. **Check/shut-off arrangement:** whether there's an isolating cap/check valve under the vent varies by boiler — if the old vent sits on a check fitting, a bare threaded vent changes how the engineer can service it. Compare the whole stack, not just the vent.

## Exhaustive family sweep — 14 families (19 Oct 2026, night)

**Group updates applied:** Riello / Beretta / Vokera / Sylber joined **Ariston Group on 1 Jul 2026** (Riello press release), so Vokera↔Ariston/Chaffoteaux is now same-group. **Alpha is Immergas Group** (Immergas has owned 100% since 2000). Ideal/Keston have been part of **Groupe Atlantic** since 2015. Biasi (Belloni family) and Sime are independent. Remeha/De Dietrich are BDR Thermea (Baxi's parent).

**Rule tightened:** Verified now means the brand↔brand link appears on **at least two independent sites**, or on one site plus a page that ties it to the same OEM code. A link on one retailer only (almost always Euro Boiler Parts) goes to Probable, labelled "explicit cross-listing on ONE retailer only".

| Family | New verified | Highlights | No cross-company found |
|---|---|---|---|
| 1 PRVs | 0 (SV.130 kept) | Vokera 1806→2907 = Beretta R2907 = Riello 4365230 (same group); SV.110 multifit, SV.310 Worcester=Glow-worm, SV.160 Vaillant=Worcester, SV.421 Vokera=Glow-worm, SV.150/155/420/500/530 → Probable | Ravenheat SV.510, Alpha 1.023565, Ariston 573172 |
| 2 Diverters | 0 (Elbi row deepened) | **Elbi OEM code 31650047** confirmed (Fausto Ricambi) + Ferroli 39842120, Fagor, Roca, Beretta R10025304; Ariston 65104314 cartridge = Chaffoteaux/Ecoflam (same group) | **Ideal 24V Minebea 181018 is NOT the Elbi 230V motor**; Vaillant SAIA 178978 |
| 3 Flow | +2 | Ideal 172503 = Biasi BI1091104; Bosch 87186456840 = Biasi BI1441501 (Bitron 20490948); Chunhui turbine row gains Baxi 7211822 + Remeha; Protherm 0020035580 = Baxi 7798983 (Probable) | Ferroli Eltek, Vaillant 178988 |
| 4 Pumps | 0 | Biasi BI1262103 = Ideal Mini 173778 (Probable, Euro only); UPM3 Baxi/Ideal/Vaillant = same family, not proven same part (PWM profile) | Vaillant, Alpha |
| 5 Vessels | +1 | Zilmet 6L flat 3/8in: Biasi BI1172103 = Ariston 998616 (+ Ferroli 39800960, Ideal 172529, Ravenheat on Euro) | Worcester, Vokera |
| 6 Pressure | +1 | Ravenheat 0005PRE03010/0 = Glow-worm 0020038532 (2 retailers); Ideal 176480 = Vokera 10028141 and Baxi 5114748 = Ariston 995903 → Probable | Ideal 075176, Ferroli, Alpha |
| 7 NTCs | 0 | TS.131 Alpha 1.021762 = Baxi 5108265 = Vokera 7022 (Probable); **curve not stated anywhere** | Ideal 175594 |
| 8 APS | 0 | 4 Euro-only chains (Alpha=Baxi C6065F1100; Ravenheat=Saunier Huba 49/34 Pa; Ravenheat=Biasi; Alpha=Sime) → Probable | most single-brand |
| 9 Gas valves | +2 | **SIT 0.845.057**: Ideal 172611/173220 = Biasi BI1093104 = Ariston 65100516 = Vokera 10025074 = Heatline D003200419; **VK4105C1017**: Ferroli 39820600 = Sime 6243815 = Halstead 500569 | Vaillant VK8x15, Worcester VR4601 |
| 10 Plate HEX | 0 | Zilmet 14/16-plate Biasi/Ideal/Glow-worm/Ariston, Alfa Laval Ariston/Heatline/Halstead → Probable (Euro only, dimensions given) | Vaillant, Worcester, Baxi |
| 11 Fans | 0 | Ferroli=Vokera ×2, Vokera=Heatline, Ideal=Biasi motor, Sime=Ariston motor → Probable | No ebm-papst/FIME OEM codes published |
| 12 Electrodes | 0 | — | all single-brand / same-group |
| 13 Small parts | +1 | Ideal 172496 = Biasi BI1001117 screw-in NTC (4 sites); M90 kit, Ariston/Biasi/Vokera kits, Baxi Duo-tec = Ideal Isar HE diverter kit → Probable | filling loops, drain taps, traps, gaskets |
| 14 PCBs | +1 | Ideal 172548 = Biasi BI1305101 ignition PCB (4 sites) | all main PCBs |

**Pattern:** most of the new verified links run **Ideal ↔ Biasi**. The Ideal Mini/Europa/Icon were Biasi-built, and Ideal sells several parts under the Biasi number. The second big tie is the **OEM code** (SIT 845, Honeywell VK41xx, Elbi 31650047, Zilmet, Chunhui/Bitron). Match on that code plus suffix, not on the brand number alone.

**Conflicts recorded (not smoothed over):** Glow-worm 2000801904 on two different PRVs (SV.421 female vs SV.180 male); Ideal 175551 described as both 8L and 10L; Ariston 990685 with 142mm vs 147mm lugs; Sime Format HE on two Honeywell valves; FSC.460 adds Ideal 175660 (8L) to the BI1271501 chain; Euro titles that carry numbers missing from the description (TS.131, AP.109, HE.251, PC.130/610).

**Gaps / blocked:** Worimex product pages need JavaScript (title evidence only); Euro category URLs are mislabelled (e.g. 'temperature-sensors-thermistors-25-c' = low water sensors; 'diverter-valves-motors-cartridges-13-c' = pumps); only the first page of each Euro PCB subcategory was scanned; Watts/Giacomini/RWC/Comap/Sauter/Trafag/Danfoss/Bertelli/ebm-papst/FIME numbers never appeared on boiler cross-lists; Intergas/Morco not reached. Next best step: find second independent pages for the ~45 'ONE retailer' Probable rows. Many would then move up.

## Sources that worked (honest ranking)
- **Heating Spare Parts part-number pages** — best for Baxi Heating same-company identification: one URL explicitly lists the same code under each of the company's badges with GC fits. Useful, but by Dan's correction it is not cross-brand evidence. Pattern: heatingspareparts.com/boiler-spares/partno/<number>.
- **DHS product pages** — best for supersessions ('NOW USE', discontinued notices) and 'This Part Fits' appliance lists; DHS appliance pages surface cross-brand listings (Saunier parts on Glow-worm, Potterton cartridge on Baxi).
- **Retailer compatible cross-lists** (Capital Boiler Parts pump, Euro Boiler Parts Honeywell, Worimex Zilmet, Altoe sensor) — best for OEM route, but they sell compatibles: confidence is in the *fit list*, not in genuine identity.
- **Manufacturer manuals** (rounds 2-3 short parts lists) — ground truth for what the brand itself codes the part; the cross happens when two brands' manuals print the same number (720747101).
- **PartsArena** — account-gated; not directly fetched this task. Use it as the in-shop diagram check (step 2), not as citable evidence here.

## Gaps
No fetched evidence tying: Giannoni/Sermeta exchangers to brand numbers, Elbi vessels, Bertelli components, Worcester↔Bosch (Buderus) UK cross-numbers, Ariston-group (Chaffoteux) UK numbers beyond Worimex compatible list, Ferroli OEM suppliers, Alpha OEM suppliers. Fan OEM cross (ebm-papst/FIME) is search-level only (Probable). Those need OEM catalogues / a PartsArena session — round 4 candidates.
Stock note: nothing here says Wickford holds any of these — Intact export still pending.

## Gap passes A/B + final audit (19 Oct 2026)
Counts: Verified 33 · Vaillant Group 16 · Baxi Heating 18 · Other groups 4 · Probable 67.
- Promoted (12): SV.110; Ideal 176480=Vokera 10028141; Baxi 5114748=Ariston 995903; Ideal 173254=Biasi BI1366103; Sime 6225603=Halstead 862002; Baxi 7656807=Ideal 175411; Biasi BI1011505=Ideal 075419; Alpha 6.5629950=Baxi 248063; Alpha 1.011126=Baxi 241567; Sime 6273608=Baxi 710109100; Ferroli 39826680=Heatline D003200037; Baxi 7798983=Protherm 0020035580.
- Demoted to Probable (single source): VK4105G, Zilmet-pattern 8L and 4L, DV.650, SV.130, AV.230 head.
- New Probable: DV.555 Halstead/Keston, FS.210 Ferroli/Halstead, RK.430 Alpha kit/Ravenheat, TS.133 Baxi/Heatline (CONFLICT with TS.130).
- Unreachable: OEM makers publish no boiler-brand code lists; Intergas/Morco parts are brand-specific.
