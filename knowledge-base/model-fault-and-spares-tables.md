# Model Fault-Code & Spares Tables — Round 2 (19 Oct 2026)

Fetched/parsed 19 Oct 2026 (Europe/London). Sources are the official installation/service manual PDFs below unless stated. Where a manual could not be fetched/parsed, that is said — do not fill the gap from memory. Gas Safe note from README applies throughout: these tables are for parts identification, engineer work is Gas Safe.

**Spares-number reality check:** most current manufacturer manuals no longer print a full numbered spares list — they route to a parts portal (Ideal, Baxi, Vaillant/Glow-worm). Where the manual *does* print numbers (Intergas, Viessmann positions), they are reproduced. Otherwise the short list is `manual prints no part numbers — use DHS appliance page / PartsArena (see dhs-lookup-worked-examples.md)`.

---

## 1. Baxi 600 Combi 2 (also covers 400/800 Combi 2 family in same manual series)
Manual fetched & parsed: Baxi 600 Combi 2 Installation and Service Manual — https://edge.sitecorecloud.io/bdrthermea1-platform-production-864a/media/Project/BaxiUK/BaxiUK/Files/Product-Literature/Boilers/Combi-boilers/Baxi-600-Combi-2/baxi-600-combi-2-installation-manual.pdf ; combined 400/600/800/Assure manual — https://edge.sitecorecloud.io/bdrthermea1-platform-production-864a/media/Project/BaxiUK/BaxiUK/Files/Product-Literature/Boilers/Combi-boilers/Baxi-600-Combi-2/baxi-b-basic-combi-installation-manuals.pdf

> **Critical generation change:** this range does **not** use the old E119/E133/E110 codes. It uses grouped codes `A.xx / H.xx / E.xx` (specific code after the dot). Quoting E133 at a customer with a Combi 2 will send everyone down the wrong path.

Selected permanent faults (Tab.33, §11.2):
| Code | Meaning (manual) | Manual check / likely part |
|---|---|---|
| A.02.06 | Low water pressure | Check/restore system pressure, expansion vessel pressure, leaks |
| H.00.42 | Pressure sensor open/faulty | Pressure sensor / connection |
| H.01.05 / H.01.08 / H.01.14 / H.01.18 | Insufficient circulation / max flow temp / no circulation (temporary) | Circulation, manual venting, pump operation, exchanger cleanliness, temperature sensors |
| E.01.17 | No water circulation (permanent) | As above — pump, circulation, sensors |
| E.01.20 | Max flue gas temperature | Exchanger flue-side cleanliness |
| E.02.17 | Permanent gas-valve-to-PCB communication failure | Check electromagnetic interference, replace main PCB (manual wording) |
| E.04.01 / E.04.02 | Flow sensor shorted / disconnected | Sensor/PCB connection, sensor operation |
| E.04.03 / E.04.08 | Max flow temp / max safe temperature | Circulation, venting, safety thermostat connection/operation |
| E.04.10 | Burner failed to ignite after 4 attempts | Gas supply pressure, gas valve connection/calibration/operation, electrode connections/condition, fan operation, flue blockage |
| E.04.12 | Ignition failure — parasitic flame monitoring | Check ground circuit, power supply voltage |
| E.04.13 | Fan blade blocked | PCB–fan connection; manual: replace air-gas unit if confirmed |
| E.04.17 / E.04.54 | Gas valve control circuit fault | Wiring on gas valve; replace gas valve or PCB (manual) |

Spares: no numbered short parts list extracted from this manual — route: Baxi Genuine Parts / PartsArena, or DHS appliance page for exact model/output.

**Models not separately parsed this round:** Baxi 800 Combi 2 manual URL verified (https://mediacdn.baxi.co.uk/-/media/websites/baxiuk/files/product-literature/baxi-800-combi-2/baxi-800-combi-2-installation-service-manual.pdf) but not parsed — the combined manual above covers the family; verify code table against the 800 manual before quoting. Duo-tec / Platinum: official manual PDF **not fetched this round** (search failed once) — do not use Combi 2 codes for Duo-tec; older Duo-tec/Platinum generations use the older Baxi code family. Route: Baxi literature library (round 1) + DHS example in worked examples file. Potterton Promax/Titanium & Main Eco Compact: **not parsed this round** — Baxi-group, but code system differs by generation; check the exact manual, `unverified`.

## 2. Vaillant ecoTEC Plus / Pro
Manual fetch **FAILED this round**: official ecoTEC pro PDF (https://professional.vaillant.co.uk/downloads/product-manuals/ecotec-pro-1/ecotec-pro-24-28-combi-installation-and-maintenance-instructions-2055535.pdf) returned HTTP 500 via WebFetch and 'Request Rejected' via direct download. Round 1 search-index extraction from that same manual gave F.28/F.29/F.32 (see brands-and-manuals.md). 
**Do not substitute the Glow-worm table below for Vaillant** — same group, similar style, different product tables. Route: Vaillant Literature Finder https://professional.vaillant.co.uk/for-installers/literature-finder/ (filter: Spare parts manual). ecoFIT pure: not parsed — same route.
Spares for an older ecoTEC Plus are worked through DHS in the worked-examples file (ecoTEC Plus 831, GC 47-044-32).

## 3. Glow-worm Energy7 combi (Vaillant Group)
Manual fetched & parsed: Energy7 Installation and maintenance instructions 0020300875_01 — https://www.glow-worm.co.uk/glow-worm/product-manuals/energy-3/combi-8/energy7-combi-installation-and-maintenance-instructions-1948938.pdf (Appendix E, p.51-53)
| Code | Meaning | Possible cause (manual) |
|---|---|---|
| F.00 / F.01 | Flow / return temp sensor fault | NTC plug loose, PCB plug, harness break, NTC defective |
| F.10 / F.11 | Flow / return sensor short circuit | NTC defective, harness short |
| F.20 | Overheat safety shutdown | Earth connection, flow/return NTC loose, stray spark via ignition lead/plug/electrode |
| F.22 | Low water / water deficiency | No/insufficient water, water pressure sensor defective, cable to pump/sensor loose |
| F.23 / F.24 | Temp spread too great / rise too fast | Pump blocked/low output, air, NTCs swapped (F.23), low pressure, non-return valve (F.24) |
| F.28 | Ignition unsuccessful | Gas meter/pressure, air in gas, low flow pressure, condensate siphon blocked, wrong injector or spare gas valve, ignition system, ionisation interrupted, earthing, electronics |
| F.29 | Flame loss in operation | Gas stopped, flue recirculation, earthing, ignition transformer spark failure, condensate blocked |
| F.32 | Fan speed outside tolerance | Fan plug, PCB plug, harness, fan blocked, Hall sensor, electronics |
| F.61 / F.62 | Gas valve control / switch-off delay | Harness short to earth, gas valve coils, electronics / leaking gas valve |
| F.64 / F.65 / F.67 / F.68 | Electronics/NTC / electronics temp / flame signal / unstable flame | NTC short, electronics overheating/defective, air in gas, ionisation interruption |
| F.73 / F.74 / F.75 | Water pressure sensor interruption/short / electrical fault / pressure sensor | Sensor/harness; **F.75 listed in this manual simply as 'Pressure switch defective'** — compare Vaillant F.75 multi-cause list (round 1) — same code, different manual wording. Model manual wins. |
| F.83 / F.84 / F.85 | Dry fire / flow-return implausible / sensors on wrong pipe | Low water, sensor position, sensors inverted |
Note in manual: 'the code table is used for various products, some codes may not be visible for the product in question.'
Spares: manual §12.3 — original spares only, contact address in manual; no printed numbers. Route: Glow-worm spareCHECK / DHS.
Glow-worm Compact / Ultimate (other generations): not parsed — route to Glow-worm literature (round 1 brands file).

## 4. Ideal Logic Combi (Logic / Logic+ / Logic Combi2)
Manual fetched & parsed: Logic Combi2 Installation & Servicing 10.2023 UIN 237662 A01 — https://downloads.ctfassets.net/sj902orc9wh4/4X6bKmLPXojsPZKjAt1fpB/926f9cd5b9f20e6c80191d4ac0e1146b/Logic__Combi2_Installation___Servicing_-_10.2023_UIN_237662_A01.pdf (Section 4 Fault Finding p.55-61, flowcharts not a single code table)
Fault-finding sections (manual headings): 4.2 Overheat Lockout, 4.3 Ignition Lockout, 4.4 Flame On Before Gas Valve On, 4.5 Low Water Pressure, 4.6 Flame Loss, 4.7 Fan Fault, 4.8 Flow Thermistor, 4.9 Return Thermistor, 4.10 Outside Sensor, 4.11 No CH but DHW OK, 4.12 No DHW but CH OK, 4.13 No Display, 4.14 DHW Thermistor.
User-display codes cross-ref (official Ideal guide, round 1): F1 low pressure, F2 flame loss, F3 fan, F4/L4 flow thermistor, F5/L5 return thermistor — display codes send the engineer to these flowcharts.
Key flowchart decisions reproduced in testing-values.md (gas valve resistance, fan voltage, thermistor table).
Spares: manual §5 (p.62) prints **no part numbers** — directs to idealparts.com, parts team 01482 498665, and asks for model + GC + serial. That is Ideal's own instruction — follow it.
Vogue / Esprit: not parsed this round — separate manuals via Ideal user-guides hub; Logic flowcharts must not be assumed to apply.

## 5. Worcester Greenstar 4000 combi
Official literature page verified: https://www.worcester-bosch.co.uk/professional/support/literature/greenstar-4000-combi-installation-manual (versions by manufacture date — pick by FD date). Table content below transcribed from the manual's §10.1.2 Operating/Fault Code Table p.71 via ManualsLib host (not Worcester's server — treat the *page* as transcription, confirm in the official PDF): https://www.manualslib.com/manual/4268257/Worcester-Bosch-Greenstar-4000.html?page=71
| Code | Type | Meaning | Remedy (manual) |
|---|---|---|---|
| 200-204, 208 | Operating | Heating/DHW/anti-cycle/standby/temp above setpoint/chimney sweep | Not faults |
| 214 | V | Fan shut down during safety time | Check fan plug and lead |
| 224 | B/V | Max flue gas or heat-exchanger thermostat activated | Safety limiter lead/continuity, flow temp, system pressure, air, pump seized, blockage |
| 227 | V | No flame signal after ignition | Gas supply/inlet pressure, gas valve voltage/inlet filter, air intake, condensate siphon blocked/frozen, flue, heat exchanger, burner, spark electrode/lead (ceramic insulator tip), flame sense, rectification earth |
| 228 | V | Flame signal without flame | Replace/check flame sense + lead, earth tags, siphon |
| 232 | B | Locked by external switching contact | Not used in UK per manual |
| 233 | V | Boiler identification module / electronics faulty | Replace control/burner control unit (manual) |
Spares: no numbers reproduced here — Worcester Spares catalogue (round 1) / DHS. Greenstar 2000 / 8000 / CDi: different generations/code sets — CDi letter codes (EA etc.) are in round 1; **do not mix numeric 4000 codes with CDi letter codes.**

## 6. Viessmann Vitodens 100-W (B1HA/B1KA manual; B1HC/B1KC similar)
Manual fetched & parsed: Vitodens 100-W Installation and Service Manual 5677 216 GB via Viessmann Direct host — https://viessmanndirect.co.uk/files/461be7f2-8610-4b7f-a942-a9d1010d8602/Vitodens%20100-W%20B1HA%20B1KA%20Installation%20and%20Service%20Manual.pdf (official ViBooks route: https://www.viessmann.co.uk/en/support/manuals.html)
Sequence logic (manual): heat demand → fan starts (else F9 after ~1 min) → ignition (F4) → gas train opens, 230V control (F4) → ionisation >2 µA (F4) → burner runs.
| Code | Cause (manual) | Measure |
|---|---|---|
| 10 / 18 | Outside sensor short / lead break | Check sensor + lead |
| 30 / 38 | Boiler water temp sensor short / lead break | Check sensor |
| 50/58, 51/59, 52/5A | Cylinder / outlet / flow sensor short or lead break | Check sensor/leads, replace if required |
| b0 / b8 | Flue gas temp sensor short / lead break | Check sensor |
| E3 | Safety chain fault | Temperature limiter + cables; control unit |
| F0 | Internal fault | Replace control unit |
| F1 | Max flue gas temp exceeded | Fill level, circulation pump, vent |
| F2 | Temperature limiter responded | Fill, pump, vent, limiter + cables, reset |
| F3 | Flame signal present at start | Ionisation electrode + cable |
| F4 | No flame signal | Ignition/ionisation electrode + cables, gas pressure, gas train, ignition module, condensate drain |
| F8 / F9 / FA / FC | Gas valve closes late / fan speed low at start / fan idle not reached / fan control faulty | Gas train; fan, cables, power, control |
| Fd / FF | Burner control unit fault | Ignition electrodes/cables, EMC interference, reset, control unit |
Spares in manual: parts lists give **diagram positions + descriptions, not order numbers** (e.g. control unit assembly: 0004 Control unit VBC113-C11.xx, 0006 Ignition cable 5 kΩ, 0010 Fuse 2.5A slow, 0011 Outside temp sensor NTC 5K; hydraulics: 0012/0021 Circulation pump motor UPM3 15-75, 0017 Gasket set plate HEX, 0022 Plate heat exchanger, 0013/0023 Safety valve 3 bar). Order route per Viessmann: Spare Parts App by serial number (round 1). Vitodens 050: not parsed — ViBooks by serial.

## 7. Intergas Combi Compact HRE (24/18, 28/24, 36/30 family)
Manual: official Intergas PDF direct download was blocked; parsed copy is the same Intergas Heating Ltd manual hosted at theintergasshop.co.uk — https://theintergasshop.co.uk/intergas-boiler-manuals/intergas-compact-hre-ov-installation-service-and-user-instructions.pdf (§11 p.33, §13.1 p.38, §14 Short Spares List p.39). Treat host as mirror, content as manufacturer manual; re-verify against intergasheating.co.uk / Intergas downloads (round 1) if a number is critical.
| Display | Fault | Solution (manual) |
|---|---|---|
| 10-14 | Sensor S1 fault | Wiring break, replace S1 |
| 20-24 | Sensor S2 fault | Wiring break, replace S2 |
| 0 | Sensor fault after self-check | Replace S1 and/or S2 |
| 1 | Temperature too high | Air, pump not running, insufficient flow, flow switch sticking |
| 2 | S1/S2 interchanged | Cable loom, replace S1 or S2 |
| 4 | No flame signal | Gas tap closed, ignition gap, gas pressure low, gas valve/ignition unit not powered |
| 5 | Poor flame signal | Condensate drain blocked, gas valve adjustment |
| 6 | Flame detection fault | Ignition cable + spark plug cap, ignition unit, boiler controller |
| 8 | Incorrect fan speed | Fan catching casing, wiring, replace fan |
| 29/30 | Gas valve relay faulty | Replace boiler controller |
**Short spares list printed in manual (§14) — actual article numbers:** Boiler controller 074277; Fan 074397; Temperature sensor (heat exchanger) 200117; Ignition/ionisation electrode 209367; Ignition cable 221357; Gas valve Siemens 801467; Ignition module 801477; Condensate trap 844187; Condensate collector 847037. (Plus seals/O-rings list in manual.)
Note design point: HRE combi has no conventional diverter valve in the CH/DHW sense used on other combis — the manual's DHW-cylinder discussion is for indirect cylinders. Don't sell a diverter for an HRE without checking the exact variant.
Intergas Rapid: not parsed — Intergas downloads route.

## 8. Alpha E-Tec 28/33
Manual parsed: Alpha E-Tec Installation and Servicing Instructions (hosted copy: https://kb.jungleproperty.co.uk/wp-content/uploads/2018/02/Alpha-E-Tec-Installation-and-Servicing-Instructions.pdf ; Alpha's own manuals page: https://www.alpha-innovation.co.uk/brochures-and-manuals/instruction-and-user-manuals) §9 p.46-48. Selected codes:
| Code | Fault | Possible causes (manual) |
|---|---|---|
| 01 | Ignition failure | Gas supply, ignition/sensing electrode, ignition generator/lead, gas valve, PCB/connections, flue restriction |
| 02 | Overheat lockout | Pump/restricted flow, blocked exchanger, air |
| 03 | High flue temperature | Restricted primary flow, exchanger airflow blocked, flue restriction, flue sensor |
| 04 | Gas valve electrical fault | Lead, gas valve, PCB |
| 05 / 06 / 12 | CH flow / DHW / DHW inlet sensor fault | Sensor resistance incorrect — wiring or sensor |
| 10 | Primary pressure low | Expansion vessel (manual notes check 1 bar), leak, relief valve operated, pressure switch |
| 16 | Fan fault (table truncated in extraction — check manual) | `verify in manual` |
| 38 / 43 | Loss of flame rectification | Sensing electrode/lead, flue recirculation/termination, gas valve, gas supply/pressure, combustion, burner earth. 43 = repeated; can occur in high wind, shown as E38 in history |
| 47 | Reduced burner output (flue 110°C sensed) | Air, restricted flow, flue restriction, sensor, pump — precursor to E03 lockout |
| 60 / 61 | Pump fault / air in pump | Free pump shaft, wiring, replace pump / purge, valves open, pressure |
| 70 / 75 / 76 | Return/flow sensor exchange or fault | Wiring, sensor resistance |
Spares: manual instructs genuine Alpha spares only; no numbered list reproduced — Alpha/DHS route.

## 9. Vokera Easi-Heat Plus Ci (25/29/32)
Manual fetched & parsed: official Vokera PDF — https://www.vokera.co.uk/wp-content/uploads/2026/10/Easi-Heat-Plus-25-29-32Ci-DEF_20158260_0.pdf (§3.6 fault visualisations, §7 checks/fault finding)
| Code | Cause (manual table) | Type |
|---|---|---|
| A01 | ACF lockout module / ACF electronics / fumes exhaust-air intake obstruction | Definitive lockout |
| A02 | Limit thermostat fault | Definitive lockout |
| A03 | Fan tacho signal fault | Definitive lockout |
| A04 | Insufficient system water pressure | Definitive lockout |
| A06 | DHW thermistor fault | Signal |
| A07 | Primary flow thermistor fault / over-temperature / differential | Temporary → definitive |
| A08 | Return thermistor fault / over-temperature / inverted differential | Temporary → definitive |
| A09 | Flue thermistor / flue counter fault, flue over-temperature | Temporary / definitive |
| A11 | False flame | Temporary stop |
| A77 | Low temperature thermostat fault | Temporary stop |
| ADJ / ACO | Calibration / chimney sweep | Signal (not faults) |
Spares: 'always use manufacturer's specified spare part' (§7.9 area); no numbers reproduced — Vokera/DHS route. Component electrical values are in testing-values.md.

## 10. Ferroli Modena HE (S system version parsed; C combi shares fault system)
Manual parsed: MODENA S HE cod. 3541C364 Rev.00 12/2012, Ferroli manual hosted at freeboilermanuals.com — https://www.freeboilermanuals.com/assets/pdf/ferroli/Modena-HE-18s-25s-32s-Manual1.pdf (Table 6 List of faults). Official Ferroli documentation route: https://www.ferroli.com/uk/installers/toolbox/documentation — re-verify there for combi 27c/32c edition.
A = permanent shutdown (reset after cause fixed), F = temporary (auto-reset).
Selected: **A01** no burner ignition (no gas, electrode position/deposits, gas valve, inlet pressure, siphon obstructed); **A02** flame detected with burner off (electrode, PCB); **A03** high-limit (flow sensor position, pump/circulation, bypass); **A04** flue gas fault (F07 x3 in 24h); **A05** fan problem (tachometer signal interrupted ≥1h); **A06** no flame after ignition 6x in 4 min (electrode, unstable flame, gas valve offset, flue obstructed, siphon); **A41/A42** flow sensor disconnected/damaged; **F07** high fume temp; **F10/F11/F13/F14/F52** flow/return/exchanger sensor faults; **F15** fan problem; **F34/F35** supply voltage/frequency; **F37** system pressure low/sensor; **F43** exchanger protection (no circulation/air — pump, vent); **A61-A64** controller ABM03 / gas valve communication.
Spares: no numbers reproduced — Ferroli/DHS route.

## Superseded by Round 3
Round 2's not-covered list is worked below (§11 onwards). Remaining gaps after round 3 are listed at the end.



---

# ROUND 3 ADDITIONS (19 Oct 2026, evening)

## 11. Vaillant ecoTEC plus (VU/VUW ..6/5-5) — RETRY SUCCEEDED
Attempts documented: round 2 URL (ecotec-pro-24-28…2055535.pdf) returned Request Rejected / HTTP 500. Round 3 succeeded with a different official file: Installation and maintenance instructions ecoTEC plus 0020244997_07 — https://professional.vaillant.co.uk/downloads/product-manuals/ecotec-plus-1/ecotec-plus-combi-and-system-installation-instructions-2422739.pdf (fetched & parsed, Appendix E p.60-62). This replaces round-2 §2's 'failed' status for ecoTEC plus. ecoTEC Pro of that generation shares the manual family — verify document number on the appliance's own manual before applying.
Selected codes (manual: Code/meaning | Possible cause | Measure):
| Code | Meaning | Manual measure (essence) |
|---|---|---|
| F.00/F.01 | Flow/return sensor interruption | Check sensor, plug, harness, PCB |
| F.10/F.11 | Flow/return NTC short | NTC plug, harness, housing, PCB, NTC |
| F.20 | Safety switch-off: temperature limiter | Flow sensor thermal connection, harness, purging |
| F.22 | Low water pressure | Plug/cable to pump or pressure sensor, sensor, pump; purge programme P.0 |
| F.23/F.24 | Temp spread too large / rise too fast | Circulation, air, sensors inverted, strainer in hydraulic block, pump, non-return valve |
| F.26 | Fuel valve not working | Gas valve stepper motor plug/cable/voltage, multiple plug, harness |
| F.27 | Flame simulation | Gas pressure at test point, monitoring electrode, PCB, gas solenoid valve |
| F.28 | Start-up ignition unsuccessful | Gas stopcock, flow pressure, gas valve, air intake, condensate route blocked, plugs/harness, ignition transformer/cable/plug/electrode, monitoring electrode, electronics, earthing, CO2 setting |
| F.29 | Re-ignition unsuccessful | Flue recirculation, condensate blocked, earthing, loose connections to gas valve/electrode |
| F.32 | Fan fault | Plug, harness, fan blockage/speed, Hall sensor, PCB, flue route |
| F.53/F.54 | Gas valve mass flow unexpected / no gas inlet pressure at start | Flow pressure, Venturi filter wet/blocked, Venturi pressure point (no lubricant on O-ring), gas valve regulation; with F.28/F.29 check stopcock/valve/plug |
| F.57 | Measuring programme fault | Corroded ignition electrode, PCB |
| F.61/F.62 | Fuel valve actuation / switch-off delay | Harness, plug, gas valve, PCB |
| F.68 | Flame signal unstable | Air ratio, gas flow pressure, condensate, injector, ionisation, flue recirculation |
| F.70 | Invalid Device Specific Number | If display+PCB both replaced, set DSN under D.93; coding resistor |
| F.73/F.74 | Water pressure sensor too weak / too strong | Pressure, earth, cable, plug, sensor (short to GND) / drain & check sensor |
| **F.75** | **Pump/water shortage: insufficient pressure jump at pump start** | **Check water pressure sensor, heating pump (blockage), heating circuit (air, water volume), adjustable bypass, external expansion vessel on return; activate P.0. If low-loss header or >1½" pipes: replace ¾" seal in flow with a screen; if required install the F.75 service set.** |
| F.83/F.84/F.85 | NTC gradient too small / implausible / fitted incorrectly | Sensor function/thermal connection, water volume, sensors inverted |
| F.92/F.93 | Wrong gas type / combustion quality out of range | Coding resistor, gas family check, injector for gas group, Venturi pressure point |
Newer-generation additions vs older ecoTEC tables: F.52-F.57, F.80-F.94 (actoSTOR/cylinder, CO sensor, mass-flow) exist in this manual — older ecoTEC code lists will not show them. Generation matters again.
Spares: §13.5.1 original spares only, no printed numbers — Vaillant spare parts manual via Literature Finder / DHS (worked example: ecoTEC Plus 831 round 2).

## 12. Vaillant ecoFIT pure combi (825-835)
Manual fetched & parsed: ecoFIT pure Installation and maintenance instructions 0020230531_07 — https://professional.vaillant.co.uk/downloads/product-manuals/ecofit-pure-1/combi-5/ecofit-pure-combi-installation-and-maintenance-instructions-1943272.pdf (Appendix D p.44-45)
Fault table is **near-identical in structure to Glow-worm Energy7** (round 2 §3): F.00/F.01 sensor interruption, F.10/F.11 shorts, F.20 overheat, F.22 low water, F.23/F.24 spread/rise, F.28/F.29 ignition/flame loss, F.32 fan, F.49 eBUS, F.61/F.62 gas valve, F.64/F.65 electronics/NTC, F.67/F.68 flame signal, F.70 DSN, F.71-F.74 sensors/pressure sensor, **F.75 'Fault: Pressure sensor — Pressure switch defective'**, F.76 primary HEX safety cut-out, F.77 condensate/smoke (flue non-return flap), F.83-F.85 dry fire/sensor position, plus ecoFIT-specific: F.86 underfloor contact, F.87 electrodes not/incorrectly connected, F.88 gas valve not/incorrectly connected, F.89 pump not/incorrectly connected, F.97 main PCB self-test failed, 'Connection' = no comms main PCB to user interface.
> Counter warning now triple-sourced: **F.75 has three different manual wordings** — ecoTEC plus (detailed pump/pressure-jump + service set, §11), ecoFIT pure ('pressure switch defective'), Glow-worm Energy ('pressure switch defective'), Ultimate3 ('pressure sensor or pump defective or water deficiency', §17). Never quote F.75's meaning without the product name.

## 13. Baxi Duo-tec 2 Combi GA (24/28/33/40) — includes Platinum 2 sibling parts
Manual fetched & parsed: Duo-tec 2 Installation & Servicing (Baxi Heating UK 2014), hosted at freeboilermanuals.com (manufacturer manual, third-party host — flagged) — https://www.freeboilermanuals.com/assets/pdf/baxi/Duo_tec_2.pdf (§16 Short Parts List p.44, §17 Fault Finding p.45+). GCs (DHS/search): 24 GA 47-075-54, 28 47-075-55, 33 47-075-56, 40 47-075-57.
Display codes are flashing numbers preceded by a symbol; Baxi's public FAQ renders the family as E-codes (E133 etc., round 1) — presentation differs, numbers are the manual's:
09 gas valve connection cable; 15 gas valve fault; 20 CH NTC; 28 flue NTC; 40 CH return NTC; 55 calibration required (after R.D.S. replacement); 109 pre-circulation; 110 safety thermostat/overheat; 117 pressure >2.7 bar; 118 pressure <0.5 bar; 125 circulation (primary — manual defines two circulation signatures: no 1°C change 15-30s after lighting, or twice exceeding set temp by 30° in 10 min); 128 flame failure; 130 flue NTC operated; 133 interruption of gas supply or flame failure; 134 elapsed time gas valve open without gas; 135 interruption of gas supply (internal); 154 flow/return sensor temp test; 160 fan/fan wiring; 270 circulation dry fire; 321 hot water NTC; 384 false flame. Initial checks: preferred min gas pressure 20 mbar NG / 37 mbar LPG (manual §17.1).
**Short Parts List printed in manual (§16) — manufacturer numbers (Key | Part | No.):**
A Fan 720768101; B Burner 24/28/33 720767901 (40: 720785201); C Spark ignition electrode 720767301; D Flame sensing electrode 720767101; E Gas valve 720752301; G Hall effect sensor 720788001; I Plate HEX 24&28 720852401 (33&40: 720852601); J Diverter valve motor 720788601; K Pump 720787401; M Heating flow/return sensor 720747101; N DHW NTC sensor 720789201; O Pump AAV 720787601; P Hydraulic pressure sensor 720789001; Q Pressure gauge 720787201; R Flue sensor 720851401; S PCB only 720878202; T R.D.S. unit by output/fuel (24 720843201, 28 720843501, 33 720843801, 40 720844101; LPG variants 720844401-5301); U Injector washer by output (Ø4.4-5.8, 720751701-86601); V Air/gas venturi by output (720768301-85601).
Cross-check vs DHS DuoTec 2 page (worked examples): DHS lists PCB as 720878202 — **matches manual S**. Spark electrode 720767301 — **matches manual C**. Note R.D.S. = the output/fuel coding device; code 55 after replacing it means calibration required. Earlier Duo-tec HE (non-2) is a different generation — round-2 DHS example, do not mix lists.

## 14. Potterton Promax Ultra Combi (24/28/33/40)
Manual fetched & parsed: official Potterton PDF — https://mediacdn.potterton.co.uk/-/media/websites/pottertonuk/files/technical-advice/722409701installultrapdf.pdf (§16 Short Parts List p.46 — present in manual, not extracted here; §17 p.47)
Error table is **the same numeric system as Duo-tec 2** (09,15,20,28,40,55,109,110,117,118,125,128,130,133,134,135,154,160,270,321,384 with identical descriptions in the extracted pages). That is a Baxi-group platform sharing — verified by parsing both manuals, not assumed. Spares: use manual §16 / DHS by GC; platform sharing does not prove every part number is identical — check the §16 list for the Potterton branded list before ordering a Baxi-numbered part.
Potterton Titanium: **not separately parsed** — Promax-family; route to its manual, `unverified`.

## 15. Main Eco Compact Combi (25/30)
Manual fetched & parsed: official Baxi/Main PDF — https://edge.sitecorecloud.io/bdrthermea1-platform-production-864a/media/Project/BaxiUK/BaxiUK/Files/Product-Literature/Boilers/Combi-boilers/Baxi-Main-Eco-Compact-Combi/Main-Eco-Compact-Combi-Installation-Guide.pdf (§10.1 p.66, §13.1 Short parts list p.74)
Same numeric code family again (09,15,20,28,40,83 communication error [Main adds 83],109,110,118,125,128,130,133,135,154,160,270,321,384). Min gas pressure at meter **19 mbar** (§10.1.1 — note Duo-tec manual says preferred 20 mbar at §17.1; quote the model in hand).
**Short parts list printed (§13.1, Tab.24):** A Safety thermostat 7763085; B Detection/spark electrode 7686344; C Flow & return sensor 720747101 (note: same number as Duo-tec 2 'M' — platform part, verified in both manuals); D NTC flue sensor 7662034; E Diverter valve motor 7216534 (note: different from Duo-tec 2's 720788601 — platform does NOT mean identical); F Auto air vent 7762745; G Burner/door assembly 7686323; K Pump assembly 7684006; L Expansion vessel 7683801; M Plate HEX 7683965; N Hall effect sensor 720788001 (same as Duo-tec 2 G); O Hydraulic pressure switch 5114748; P Gas valve 7683968; Q Fan 7683926; R Pump head 7686336.

## 16. Baxi 800 family
Baxi 800 Combi 2 manual URL verified round 2; the Combi 2 combined manual (round 2 §1) covers 400/600/800/Assure — code system is the A/H/E.xx type, **not** the Duo-tec numeric system. Two current Baxi combi platforms with incompatible code languages are on sale in the same showroom era: ask 'Combi 2 or Duo-tec/Platinum?' before discussing any code. Baxi 800 (original, non-2): not parsed — literature library route.

## 17. Ideal Vogue Max Combi (C26/C32/C40)
Manual fetched & parsed: Vogue MAX Combi Installation & Servicing 09.2023 UIN 222378 A08 — https://downloads.ctfassets.net/sj902orc9wh4/ebbEq1SePkXlDmvTFC60o/71ff37b2ee013f8dbabdab4c4f5633b2/Vogue_MAX_Combi_Installation___Servicing_-_09.2023__UIN_222378_A08_.pdf (§4 p.67-72 flowchart system like Logic; §5 Spare Parts p.74)
Fault Help menu items (manual): Overheat, Ignition Lockout, Flame Loss, Thermal Fuse Lockout (§4.5 — Vogue adds a thermal fuse flowchart Logic Combi2 doesn't list), Flow/Outside/Return Thermistor, Fan, Low Water Pressure, No Water Flow, No Connection to Primary PCB, No CH but DHW OK etc.
Key difference from Logic: ignition flowchart (§4.3) gas valve test is **'resistance between pins between 1kΩ and 10kΩ'** (a range), where Logic Combi2 specifies 4 kΩ (±2). Gas inlet >18 mbar and 24Vdc at valve in both. See testing-values round 3.
Spares §5: no numbers in extracted pages — idealparts.com / 01482 498665 with model+GC+serial (as Logic).
Ideal Esprit Eco: **not fetched** — Ideal literature route; do not apply Vogue/Logic tables.

## 18. Worcester Greenstar 2000
Manual: official literature page https://www.worcester-bosch.co.uk/professional/support/literature/greenstar-2000-installation-instructions ; parsed PDF (Greenstar 2000 – 6 721 820 552 (2021/02)) hosted at mphmerchant.co.uk (Worcester manual, merchant host — flagged) — https://www.mphmerchant.co.uk/wp-content/uploads/2022/08/Greenstar_2000_Installation_Instructions.pdf (§11.2 p.74)
Uses the **numeric Bosch system shared with 4000/8000**: 200-208 operating (not faults), 212 temp rise too fast, 214/215 fan shutdown in safety time (215: replace fan), 224 safety limiter, 227 no flame after ignition (same long check list as 4000 incl. ceramic insulator tip, condensate frozen, rectification ground), 228 flame without flame, 229 flame failed in operation (incl. LPG tank check), 232 external switching contact (not UK). Pressure-related codes are 4-digit in this Worcester generation (e.g. low-pressure code family — confirm exact code in table for the FD date; round-2 search summary noted 2971 low pressure for 2000, `verify in official PDF for your version`).
Spares: Worcester original only — Spares catalogue/DHS.

## 19. Worcester Greenstar 8000 Life/Style
Manual fetched & parsed: official Worcester PDF via literature download — https://www.worcester-bosch.co.uk/support/literature/download/release/6720883864/37279 (Greenstar 8000 Style – 6720883864 (2019/06), §10.1.2 p.66)
Selected: 200-208 operating; 224 safety limiter tripped; 227 no flame (remedy list is parts-replacement oriented: control unit, ignition electrode, monitoring electrode, ignition/ionisation cables, air/gas ratio valve, burner setting); 228 flame without flame; 306 flame after closing fuel supply; 815 low-loss header sensor; 1017 water pressure too low (top up/vent, replace pressure sensor); 1021 DHW temp sensor; 1065 pressure sensor defective/not connected; 1073/1074 flow sensor short/no signal; 1075/1076 heating-block sensor; 2927 flame failed in operation (gas line, PCB signal evaluation, ionisation electrode, PE connection, ignition cable). Categories: O operating, B blocking, V locking, W maintenance/warning (as printed).
Note remedy style difference: 8000 table often says 'replace X' where 2000/4000 tables say 'check harness first' — follow the table for the model in hand, cheapest check first in practice.
Greenstar CDi (letter-code generation): round 1/legacy file.

## 20. Viessmann Vitodens 050-W (BPJD)
Manual fetched & parsed: Vitodens 050-W Installation and Service 5513 085 GB via Viessmann Direct host (official static.viessmann.com URL also verified: https://static.viessmann.com/resources/technical_documents/GB/en/VMA/5675991VMA00011_1.pdf for 5675991 edition) (§ fault display p.46-48)
Code system **same family as Vitodens 100-W round 2**: 10/18 outside sensor, 30/38 boiler sensor, 51/59 outlet, 52/5A flow, b0/b8 flue gas, E3 safety chain, F0 internal (replace control unit), F1 flue temp max, F2 temperature limiter, F3 flame at start, F4 no flame, F8 fuel valve late, F9 fan speed low at start, FA fan idle not reached. Sequence/ionisation method as Vitodens 100 (testing-values round 2). Spares route: Viessmann Spare Parts App by serial (round 1/2). So 050 vs 100 is a safe *family* pairing for code language — still check the BPJD manual edition.

## 21. Intergas Rapid / Xclusive — PARTIAL, flagged
- Xclusive: official Intergas PDF (https://www.intergasheating.co.uk/app/uploads/2021/01/Installation-manual-Xclusive-IGH-84010403.pdf) **blocked by captcha on direct fetch**; ManualsLib page blocked by bot check. Search-index of Intergas's own parameter sheet states F000–F031 range with S0 heat exchanger, S1 CH flow, S3 DHW, S5 flue gas, S6 outdoor sensor faults — **search-level only, table NOT reproduced**. Do not quote Xclusive codes beyond that until the manual is obtained (Intergas downloads helpline / DHS manual copy).
- Rapid: **not fetched**. Both route: https://intergasstore.co.uk/downloads (round 1) + DHS Intergas page. HRE tables (round 2 §7) must not be assumed for Rapid/Xclusive — different display/code architecture (F-codes vs HRE numeric).

## 22. Alpha E-Tec Plus NX (28/33/38)
Manual fetched & parsed: E-Tec Plus NX Instructions 2023 hosted at snhtradecentre (Alpha manual, merchant host — flagged; Alpha product page https://www.alpha-innovation.co.uk/products/e-tec-nx) §10 p.61-63, §11 Short Parts List p.64.
Codes largely carry from E-Tec (round 2 §8) with differences: 01 ignition, 02 overheat, 03 high flue, 04 gas valve electrical (manual: if not gas valve, replace PCB after reset fails), 05 CH flow NTC, 06 DHW NTC (boiler continues DHW 'not optimal'), 08 max resets (5 consecutive, then 1 hr inhibit; power cycle restores attempts — manual detail), 10 insufficient pressure (**check gauge 1-1.2 bar cold** — Alpha-specific figure in this manual), 15 configuration, 16 fan anomaly, 20 parasite flame, 23 return NTC, 27 insufficient circulation (pump blocked — free it), 29 flue sensor, 37 low supply voltage, 38 flame signal loss, 43 block after repeated 38, 44 gas valve open too long, 45 ΔT high, 47 burner power limitation, plus 31/36/46/48 control/bus/system variants.
**Short parts list printed (§11) — Alpha Pt Nos (selected):** Diverter cartridge 3.025230; Flow/Return sensor 1.039476; DHW sensor 1.039477; Electrode 1.046654; DHW flow switch 1.035365; Pump head motor 28: 1.047247, 33-38: 1.046466; Diverter motor 1.045321; Primary pressure sensor 1.047598; DHW HEX with seals 28: 3.034535, 33: 3.034536, 38: 3.034538; Main PCB 1.046236; Safety valve 3 bar 1.028561; Gas valve 1.047483; Expansion vessel 1.044389; Fan 28-33: 3.027699, 38: 3.031017; Complete boiler seal kit 3.034541; Hydraulic seal kit 3.025323.
Alpha Evoke: not fetched — Alpha manuals page route.

## 23. Glow-worm Ultimate3 combi
Manual fetched & parsed: official Glow-worm PDF — https://www.glow-worm.co.uk/glow-worm/product-manuals/ultimat/combi-9/ultimate3-combi-installation-and-maintenance-instructions-1948951.pdf (Appendix E p.45)
Table aligns with Energy7/ecoFIT family (F.00-F.97 structure). Confirmed in extraction: F.28 ignition unsuccessful (same cause list), **F.75 'Fault: Pressure sensor — Pressure sensor or pump defective or water deficiency'** (third wording variant — see §12 warning). Spares: original only, spareCHECK/DHS.
Glow-worm Compact: **not parsed** — Glow-worm literature route; family style likely but `unverified`.

## 24. Heatline Monza 24/28 (Capriz route note)
Manual fetched & parsed: Heatline Monza 24/28 Installation & Servicing hosted at cdn.boilermanuals.com (manufacturer manual, manuals-host — flagged) — https://cdn.boilermanuals.com/heatline/Heatline-monza-24-28-ISIM.pdf (fault table p.29-30). GCs from manual listings: Monza 24 47-157-21, 28 47-157-22 (search-verified).
Vaillant-family F-codes with Heatline wording: F00/F01 flow/return sensor open, F10/F11 shorted, F20 overheating (safety device 97°C stated), F22 water pressure <0.3 bar (pump disconnected/leak listed), F23 max temp difference, F24 circulation (pump malfunction, rapid rise), F26 gas valve motor, F27 flame detection abnormal, F28 ignition (no/insufficient gas, valve adjustment, electrode/igniter), F29 loss of flame, F32 incorrect air pressure (incorrect fan speed), F49 eBUS, F61/F62 gas valve command/closure, F63-F67 main board/sensors/flame signal, F68 flame fluctuation, F70 product code/DSN mismatch, F71-F74 sensor/pressure sensor, **F76 thermal fuse (manual: check fuse — defective thermal fuse: 'Replace the heat exchanger')**, F83 no water/temp not increasing. Note F20/F22 thresholds printed (97°C, <0.3 bar) are Monza-specific — do not transfer.
Heatline Capriz: **not parsed** — DHS Heatline manuals page (round 1); expect Vaillant-family style, `unverified`.

## 25. Keston Combi 2 (C30/C35)
Manual fetched & parsed: Keston Combi 2 Installation & Servicing (Ideal group), hosted at freeboilermanuals (flagged; official Keston literature page round 1, Ideal download qsg-236276) §4 p.56+ — **flowchart system identical in structure to Ideal Logic**: Fault Help menu (Low Water Pressure, Ignition Lockout, Overheat Lockout…), thermistor table **25°C 9.7-10.3kΩ / 60°C 2.4-2.6 / 85°C 1.0-1.1** (same as Ideal Logic — verified in both PDFs), ignition flowchart gas inlet >18 mbar (extraction begins §4.3). Spares: Ideal parts team route printed (Spares 01482 498665 on menu screen). Keston System/Heat 2: literature page route, not parsed.

## 26. Morco GB combis — FAILED to fetch manual
Morco manuals index verified round 1 (https://morcoproducts.co.uk/manuals/, some technical manuals sign-in). A guessed direct PDF URL returned HTML (not a manual) — **no Morco fault table claimed**. Route: Morco manuals page + official spares shop https://morcoproducts.co.uk/boiler-spares/ , phone with model/GC. Park-home/water-heater variants common — confirm appliance type first.

## 27. Ariston Clas ONE (Clas/Genus family route)
Manual parsed: Clas One Installation Manual hosted at mphmerchant (Ariston manual, merchant host — flagged; official Ariston UK library route https://library.ariston.co.uk/clas-one-installation-manual/65189044/38 also verified in search) — error summary table.
Ariston uses **digit-group codes (display shows e.g. '1 01', '5 01')**: 101 overheat; 103-107/1P1-1P4 insufficient circulation; 108 insufficient water (fill request); 109 pressure >3 bar; 110 CH flow probe open/short; 112 CH return probe; 114 external sensor; 118 delivery probe problem; 205 DHW inlet probe (solar); 301 EEPROM; 302 communication error; 303/305-307 main PCB errors; 304 >5 resets in 15 min; **501 no flame detected; 5P1 first ignition failed; 5P2 second ignition failed; 5P3 flame cut-off; 502 flame detected with gas valve closed; 504 flame lift**; 610 main HEX overheat; 612 insufficient fan speed; 7xx zone sensors/overheat. Max 5 resets in 15 min, 6th locks until power disconnected (manual).
This is a completely different code language from every other brand here — never guess Ariston codes from Baxi/Vaillant patterns. Genus: same Ariston family route via Ariston library by exact model, `verify edition`.

## Still not covered after round 3
Ideal Esprit Eco, Glow-worm Compact, Intergas Rapid (and Xclusive full table), Alpha Evoke, Heatline Capriz, Morco GB (manual sign-in), Baxi 800 original & Platinum dedicated manual, Potterton Titanium, Keston System/Heat. All routed above/in brands file.
