# Fault Diagnosis — symptom first, then brand codes

How to use: (1) match the plain-English symptom, work the "checks before replacing" column; (2) then match the brand code in the model's own manual. **A code lists causes, not a verdict.** Codes below are only those verified from official sources in this trawl (see `brands-and-manuals.md` for citations) — for any other code: `check manual`.

## By generic symptom

### No heating AND no hot water
- Checks first: power/display on? Pressure ~1–1.5 bar cold? Controls calling (room stat, timer, receiver)? Fault code shown? Frozen condensate in cold snap? Gas supply on / meter credit?
- Likely families: power/PCB/fuse, pump, fan/ignition sequence failure, low pressure (sensor/switch), gas supply.
- Parts implicated only after proving supply & demand: PCB, pump, fan, pressure sensor.

### Heating works, NO hot water (combi)
- Does the boiler *register* a DHW demand when a hot tap opens?
  - No demand registered → DHW flow sensor/turbine, its filter, harness.
  - Demand registered, boiler fires, water lukewarm → plate heat exchanger scaled/blocked, DHW thermistor, diverter not travelling fully.
  - Demand registered, boiler doesn't fire → diverter motor, PCB input, thermistor out of range.
- Classic: diverter valve cartridge/motor family. Confirm which sub-part before ordering (body / cartridge kit / motor).

### Hot water works, NO heating
- Checks: room thermostat/timer/receiver calling? Zone valves (system boilers)? Diverter stuck in DHW position (combi)? Pump/valves to heating circuit?
- Likely: external controls first (not a boiler spare), diverter stuck, zone valve motor on system installs.

### Ignition failure / lockout (boiler tries, then stops, reset needed)
- Sequence question: fan runs? Spark clicks? Flame lights at all? Lights then drops in seconds?
- Checks (user level, per user guides): gas on at meter, other gas appliances, prepayment credit, frozen/blocked condensate outside, flue terminal visibly blocked. Reset once only.
- Engineer families: ignition electrode/lead, gas valve (Gas Safe only), rectification probe + earth, condensate trap blocked internally, fan/APS proving, PCB.
- Verified anchors: Vaillant **F.28/F.29**, Ideal **L02/F2**, Worcester **EA**, Baxi-family **E133** — all mean "flame not detected/proven", none of them means "replace part X" on its own.

### Low pressure / keeps losing pressure
- User: re-pressurise to the user-guide figure (commonly 1–1.5 bar cold) via filling loop; bleed radiators, re-check.
- If pressure falls repeatedly: leak on system, expansion vessel flat/split (pressure swings high hot / low cold, PRV discharging), PRV passing after lifting, pressure sensor lying vs gauge.
- Parts: vessel, PRV, sensor, gauge — diagnose the *cause* of loss, don't just sell a sensor for a leaking system.

### DHW temperature swings / goes cold mid-shower
- Plate heat exchanger scale/blockage, DHW thermistor, flow sensor hunting at low flow, combi undersized/too-high flow. Check flow rate and inlet filter first.

### Noisy boiler
- Kettling (rumbling): scale/sludge in main exchanger, poor circulation, pump speed. Banging on ignition: delayed ignition — engineer. Whining: fan bearings or pump. Gurgling: air or condensate.

### Leaks from boiler
- Identify fluid & point: condensate (clear, from trap/pipe), primary water (from pump/AAV/PRV/valve joints, often rusty), DHW. Dye/corrosion trails point uphill to source. Order seals with the part.

### Intermittent / cold-weather only
- Frozen condensate (very common), APS tubes/flue wind effects on older boilers, sticking fan, marginal rectification (dirty probe/poor earth), low gas pressure at peak demand (engineer/supplier issue, not a spare).

## By brand fault-code system (verified examples only)

> Full tables live in each model's installation & servicing instructions. These anchors show the *system*, so counter staff recognise what they're being quoted.

### Baxi / Main / Potterton (BDR Thermea) — E-codes
Official list: https://www.baxi.co.uk/professional/services/technical-support/error-codes
- **E110** overheat (primary water/flue) · **E119** low pressure · **E133** ignition/flame/gas supply. Source: Baxi FAQ cited in brands file.
- Flag: the same E-number can carry different detail across ranges/generations — `check manual for that range`.

### Vaillant / Glow-worm family — F. codes
Official list: https://www.vaillant.co.uk/service/boiler-fault-codes/ and ecoTEC pro manual (PDF cited in brands file).
- **F.28** ignition unsuccessful (6+ listed causes incl. condensate, ignition, ionisation, earth, electronics) · **F.29** flame lost in operation · **F.32** fan · **F.61/F.62** gas valve actuation/shut-off delay · **F.64** flow/return NTC short · **F.75** no pressure rise at pump start (sensor/pump/air/low pressure).
- Flag: F.75 is the textbook "code ≠ one part" example — four different causes in Vaillant's own list.

### Ideal — F and L codes (Logic family presentation varies)
Official: https://idealheating.com/support/faqs/boiler-fault-codes ; Logic System2 user guide.
- **F01** low pressure · **F02** flame loss · **F03** fan · **F04/F05** flow/return thermistor · **F09** unconfigured PCB / gas valve short (as listed) · **L01** overheat/no flow · **L02** ignition lockout · **L06** false flame.
- Flag: older Logic displays flash letter + number separately — get a photo/video of the display.

### Worcester Bosch — letter/number codes
Official manual example (Greenstar CDi) via literature search https://www.worcester-bosch.co.uk/professional/support/literature ; Fault Finder app feature https://www.worcester-bosch.co.uk/professional/installers-choice/trade-tips/fault-finder
- **EA** flame not detected · **C6** fan speed low · **E9** safety temp limiter · **F0** internal error · **F7/FA** flame sensed incorrectly · **Fd** reset pressed by mistake (i.e. not a fault at all).
- Flag: Worcester codes differ between Greenstar generations (CDi vs 4000/8000 etc.) — model first.

### Others (Keston, Intergas, Alpha, Ariston, Ferroli, Vokera, Viessmann, Heatline, Morco, Ravenheat, Biasi)
- No fault-code tables are reproduced here because none were verified from an official manual page in this trawl. Route: model manual (see brands file) → fault table. Viessmann fault messages are in the service instructions via ViBooks; Intergas codes in its service docs via https://intergasstore.co.uk/downloads . Anything quoted from a forum/blog for these brands: `unverified — check manual`.

## Rules for counter staff
1. Never convert a code into a single part on the phone. Say: "On that model that code covers X, Y, Z — your engineer will prove which; the parts for those are…"
2. Ask for: display photo, data-badge photo, and "what does it do from cold?" — those three answer most calls.
3. Sell the seals/kit the diagram pairs with the part (see part-number checklist).
4. PCB last, gas valve never on suspicion — both need engineer's test results.

## Round 2 additions — lessons tied to model tables
- **New-generation code trap:** Baxi Combi 2 uses A/H/E.xx codes (model file §1), Worcester 4000 uses numeric 2xx codes, CDi uses letters (EA). First question on any code call is now 'which generation?' — a code read without the model is worse than no code.
- **F.75 wording differs by manual:** Glow-worm Energy manual lists F.75 as 'Pressure switch defective'; Vaillant ecoTEC guidance lists sensor/pump/air/pressure. Same code string, different depth — quote the product manual in front of you (see forum F.75 system lesson in forums file).
- **Diverter proving (Ideal Logic forum-verified):** if manually pressing the diverter (engineer, actuator removed) restores DHW, the plate is likely fine; suspect actuator drive/valve travel. If DHW demand isn't registered at all, go flow sensor first (see DHW worked examples: Ideal has separate flow/turbine and detection parts, Worcester lists Flow Sensor vs Flow Turbine Adaptor separately).
- **Manual flowchart > code table for Ideal:** Logic sends engineers through decision values (24Vdc at gas valve, 4 kΩ gas valve pins, 230VAC at fan — testing-values.md). Counter version: ask 'did they get voltage at the valve/fan?' before accepting a PCB order.
- **Intergas is the odd one out:** no diverter-based DHW switching on HRE combi in the usual sense, fault display is numeric on a temperature display (0-30), and its sensors are 12 kΩ (not 10 kΩ). Model file §7.


## Counter quick-reference — the 10 faults you're most likely to be asked about (Round 3)
Traceable to tables in model-fault-and-spares-tables.md / testing-values.md. 'First suspect' = most likely *family*, prove-it = the check that separates it. Gas Safe engineer does the proving.

| # | Customer says / code | First part/family to suspect | Check that proves it |
|---|---|---|---|
| 1 | "No heating, no hot water, code for low pressure" (Baxi E118-family/A.02.06, Ideal F1, Vaillant F.22, Worcester 1017) | Actually-low system pressure first — not a part | Gauge vs 1–1.5 bar cold (Alpha NX: 1–1.2); re-pressurise per user guide; if it keeps falling, leak/vessel/PRV — sensor only if gauge and display disagree |
| 2 | "It clicks, tries to light, locks out" (E133/133, F.28, 501, 227, L2) | Ignition/flame-proving family + condensate | Sequence stage reached; condensate frozen/blocked (cold snap first); engineer: >18 mbar at Ideal inlet, electrode condition, gas valve voltage (24Vdc Ideal) |
| 3 | "Hot water cold, heating fine" (combi) | Diverter travel / DHW demand sensing | Does boiler register DHW demand? No = flow sensor/turbine. Yes + fires = plate HEX/diverter travel. Engineer manually pressing diverter (Ideal forum-verified split) |
| 4 | "Heating fine, hot water goes cold mid-shower" | Plate heat exchanger scale/blockage | DHW temp/flow at tap vs boiler output; plate in/out temps; check DHW thermistor reading before condemning plate |
| 5 | Vaillant/Glow-worm F.75 | Water pressure sensor + pump + blockage as a system | Standing pressure, ~0.2 bar rise at pump start (forum), sensor zeroes when depressurised; hoses/filter blocked; ecoTEC plus may need F.75 service set on low-loss headers |
| 6 | "Pressure goes up to 3 when hot, drops when cold, water at outside pipe" | Expansion vessel (PRV is the victim) | Vessel air charge isolated/drained vs manual; water at Schrader = split diaphragm; only then PRV |
| 7 | "Boiler dead, blank display" | Power/fuse/PCB — in that order | Supply at boiler, board fuse, external controls; Vogue flowchart adds <185V mains check. PCB last |
| 8 | "Fan fault code" (F.32, F3, 160, 214/215) | Fan harness/supply before fan | Voltage arriving at fan (Ideal: 230VAC blue/brown present = fan, absent = PCB); fan free to spin, Hall/speed signal |
| 9 | "Overheat / kettling, locks out hot" (110, F.20, 224, L01) | Circulation: pump, air, sludge | Flow/return differential (Ideal/Vogue: >30°C flowchart branch), pump rotating freely, venting; thermistor resistance at temp (9.7–10.3kΩ @25°C Ideal/Keston) |
| 10 | "Works on heating, won't fire for hot water in summer" | DHW flow sensor/turbine or diverter stuck in CH | Demand icon on DHW draw; turbine spins/filter clean (Duo-tec servicing notes DHW filter & turbine clean); actuator movement on demand |

Rule printed under the counter: **code + model + data-badge photo before any part leaves the shelf.**
