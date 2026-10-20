# Testing Values — from the manuals parsed in Round 2 (19 Oct 2026)

Every value below is tied to its manual/model. **Values differ by brand and sensor type — never transfer a table between brands.** Engineer (Gas Safe) work; counter staff use this to understand what the engineer is checking, not to talk householders through internal tests.

## Ideal Logic Combi2 — UIN 237662 A01, §4
Source: https://downloads.ctfassets.net/sj902orc9wh4/4X6bKmLPXojsPZKjAt1fpB/926f9cd5b9f20e6c80191d4ac0e1146b/Logic__Combi2_Installation___Servicing_-_10.2023_UIN_237662_A01.pdf
- **Flow & return thermistors (same table, §4.2/4.8/4.9):** 25°C = 9.7–10.3 kΩ; 60°C = 2.4–2.6 kΩ; 85°C = 1.0–1.1 kΩ, measured disconnected across thermistor pins.
- **Ignition lockout flowchart (§4.3):** gas pressure available at boiler inlet **>18 mbar** required; approx **24 Vdc** supply at gas valve; unplugged gas valve resistance **between outside pins 4 kΩ (±2)** — if not, manual says replace gas valve; if wiring/PCB supply absent, replace PCB after continuity proven. Then spark generator, electrode, condensate blockage in that order.
- **Fan fault (§4.7):** wiring continuity first; **230 VAC at blue/brown on fan 3-way connector** — present = replace fan, absent = replace PCB (manual sequence).
- **Low water pressure (§4.5):** gauge 1–1.5 bar, connections on water pressure switch secure, else replace switch.
Lesson: Ideal gives *decision values*, not just codes — ask the engineer which step failed.

## Intergas Combi Compact HRE — §13.1, §11
Source (mirror of Intergas manual, see model file §7): https://theintergasshop.co.uk/intergas-boiler-manuals/intergas-compact-hre-ov-installation-service-and-user-instructions.pdf
- **NTC 12 kΩ sensor table:** 0°C 36,130 Ω; 10°C 22,800; 20°C 14,770; **25°C 12,000**; 30°C 9,805; 40°C 6,653; 50°C 4,609; 60°C 3,253; 70°C 2,337; 80°C 1,707; 90°C 1,266; 100°C 952 Ω. (Full -15 to 100 table in manual.)
- **Spark gap:** approx **4.5 mm** (§11.2.2, ignites noisily).
- Compare Ideal above: Ideal 25°C ≈10 kΩ vs Intergas 12 kΩ — same temperature, different sensor. This is why generic tables are dangerous.

## Viessmann Vitodens 100-W — 5677 216 GB
Source: https://viessmanndirect.co.uk/files/461be7f2-8610-4b7f-a942-a9d1010d8602/Vitodens%20100-W%20B1HA%20B1KA%20Installation%20and%20Service%20Manual.pdf
- **Sensors:** NTC **10 kΩ** type (B1KF sensor pages state 'Sensor type: NTC 10 kΩ', curve in manual). Method: disconnect, measure resistance, compare with manual curve; **replace if severe deviation >10 %**.
- Note parts list specifies outside sensor as **NTC 5 K** (Pos 0011) — different sensors in the same boiler can be different base resistances. Position matters.
- **Flame proving:** ionisation current builds **above 2 µA** in sequence (else F4). Gas train control voltage **230 V** (§ sequence). Ignition cable specified **5 kΩ** (Pos 0006).
- **Specification page:** temperature limiter setting **100°C fixed**; fuse backup 3A (spec) / control fuse 2.5A slow (parts Pos 0010) — do not conflate the two fuses.
- Sensor check pages are graphical curves, not numeric tables — I have not invented numbers off the graph; use the curve in the manual.

## Vokera Easi-Heat Plus Ci — §7.7/7.9
Source: https://www.vokera.co.uk/wp-content/uploads/2026/10/Easi-Heat-Plus-25-29-32Ci-DEF_20158260_0.pdf
- **Component values table (§7.9):** Fan 230Vac; Pump 230Vac; Valve actuator 230Vac; Ignition transformer 230Vac; Gas valve 230Vac; Room thermostat connection 24Vdc; **NTC thermistor (dry contact) 10Kohm; NTC (wet contact) 10Kohm** (base value as printed — temperature table not reproduced in manual extraction, `check manual curve`).
- **Polarity/supply checks (§7.7.3):** L–N ≈230Vac, L–E ≈230Vac, N–E approx 0–15Vac = polarity correct.
- **Limits (printed values):** high limit thermostat 105°C, flow NTC max 90°C, flue NTC max 125°C, max differential 35°C; ignition attempts before lockout 5, re-ignition after flame loss 5.

## Glow-worm Energy7 / Vaillant family
Source: Glow-worm manual in model file §3. No resistance/voltage test table was extracted from this manual — fault table is cause-based (plug/harness/NTC defective). `NTC values: unverified — check manual diagnostics / manufacturer tech.`
Vaillant ecoTEC: manual fetch failed this round (see model file §2) — no values claimed.

## Baxi 600 Combi 2
Source: model file §1. Fault table is cause/check based; no NTC resistance table extracted. `Test values: unverified — check manual diagnostics section for that output.`

## Alpha E-Tec / Ferroli Modena
Both manuals (model file §8/§10) describe sensor faults as 'resistance out of range / check sensor resistance' without a numeric table in the extracted sections. `Values unverified — do not borrow Ideal/Intergas tables.`

## General method (all brands)
1. Isolate, disconnect sensor at plug, measure across pins — never measure resistance on a powered/connected sensor.
2. Measure actual sensor temperature where it sits; compare to *that model's* table/curve at that temperature.
3. Open circuit (OL) or near-zero = failed sensor/lead until proven otherwise; a correct-at-25°C sensor can still fail hot — compare at operating temp if fault is heat-related.
4. Flame sensing is a current (µA) measurement in series, engineer-only, and poor earth/probe position are listed causes in Vaillant/Glow-worm, Worcester and Viessmann manuals alike.
5. Fan/gas valve diagnosis is supply-first: prove the voltage the manual states is arriving before condemning the component (Ideal 230VAC fan / 24Vdc gas valve; Vokera/Viessmann 230Vac gas train/fan).


## Round 3 additions (19 Oct 2026)

### Vaillant ecoTEC plus / ecoFIT pure (0020244997_07 / 0020230531_07)
No numeric NTC resistance table extracted from either manual — fault measures are check-based (plug/harness/sensor/PCB). F.75 measure includes the **F.75 service set / flow screen** note for low-loss-header or >1½" pipe installs (ecoTEC plus §11 model file). `Resistance values unverified — Vaillant diagnostics (D-codes, sensor readings in installer level) per manual.`

### Baxi-group numeric platform (Duo-tec 2 / Promax Ultra / Main Eco Compact)
- Initial checks only: Duo-tec 2/Promax preferred min gas pressure **20 mbar NG / 37 mbar LPG**; Main Eco Compact min at meter **19 mbar**. Electrical 230V~50Hz + earth/polarity checks repeated after fault finding (all three manuals).
- No NTC table extracted from these manuals. Sensor codes (20/28/40/321) = 'possible faulty components' group per manuals — resistance comparison is `check manual fault-finding section D, values unverified here`.

### Ideal Vogue Max vs Logic Combi2 — gas valve resistance DIFFERS (verified in both manuals)
- Logic Combi2 §4.3: unplugged gas valve outside pins **4 kΩ (±2)**.
- Vogue Max §4.3: unplugged gas valve pins **between 1 kΩ and 10 kΩ**.
- Both: gas inlet **>18 mbar**, **24Vdc** at valve during ignition, then spark generator → electrode → condensate, in that flowchart order.
Lesson: even within one brand, a test value is model property. Quote the manual name with the value.

### Keston Combi 2
- Thermistor table **identical to Ideal Logic: 25°C 9.7–10.3 kΩ; 60°C 2.4–2.6; 85°C 1.0–1.1** (verified in Keston §4 extraction). This is the one safe cross-model transfer found — because both Ideal-group manuals print it, not because thermistors are 'usually 10k'.

### Worcester 2000/4000/8000
Fault tables are check/replace lists; no resistance values reproduced. Fan checks are voltage/harness/power-modulation (2000 code 214/215). Gas valve diagnosis = voltage present + inlet filter blockage (227 remedy). `Coil resistance values unverified — Worcester manual for FD date.`

### Viessmann Vitodens 050-W
Same method as 100-W round 2: NTC curve comparison, ionisation sequence, >10% deviation principle applies to the family manual method — the 050 manual's sensor pages were not separately extracted for a numeric table, so `050-specific curve: use BPJD manual graphs`.

### Alpha E-Tec Plus NX
No numeric sensor table in §10 extraction ('board detects anomaly on NTC'). Pressure expectation printed: **system pressure 1–1.2 bar cold** (code 10 solution) — Alpha-specific cold figure vs the generic 1–1.5 bar used elsewhere. Quote Alpha's.

### Heatline Monza
Printed thresholds in fault table: overheat safety **97°C**, F22 at **<0.3 bar**. Model-specific trip points — not test values for other Vaillant-family boilers.
