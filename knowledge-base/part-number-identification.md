# Part-Number Identification — get the exact spare, first time

## The identity pack (collect ALL of this before searching)
- [ ] Photo of **data badge**: make, full model, kW output, **GC number (00-000-00)**, serial number, fuel type
- [ ] Boiler type: combi / system / heat-only; open-vent or sealed
- [ ] Fault code photographed + symptom in plain words + "what stage does it reach?"
- [ ] Engineer's test result that condemns the part (not just the code)

## Step-by-step method
1. **GC number first.** It pins the exact appliance variant. Search DHS Spares Finder / PartsArena by GC where possible — DHS appliance pages print the GC and only list parts for that appliance (verified example below). GC format/source: https://myboiler.com/what-is-a-gc-number/
2. **Open the exploded diagram for that appliance** (manufacturer spare parts manual, PartsArena, Viessmann Spare Parts App, DHS appliance page). Find the component visually — position matters because similar parts sit side by side (flow vs return NTC; diverter body vs motor).
3. **Diagram position → manufacturer part number.** Record both, plus diagram number/edition. Superseded numbers: manufacturer lists and DHS product pages show "fits / replaces" relationships — if a number has been superseded, order the current number and note the old one it replaces. `Never merge two numbers without a stated supersession source.`
4. **Variant checks before ordering:**
   - NG vs LPG (injectors, gas valves, restrictors, some burners)
   - Voltage / connector variant (fans, pumps, motors differ by generation)
   - Output variant (24/30/35kW models in one range often use different fans/gas valves/exchangers)
   - Left/right hand, flow/return, inlet/outlet size on hydraulics
   - **Seals included or not?** Check kit contents on the diagram/product page vs the separate O-ring/gasket position numbers. Order the seal kit the same visit.
   - Kit vs single part: many modern spares are kits (e.g. "Fan Assembly Kit") — check what's in the kit before also ordering its components separately.
   - PCB configuration: some replacement PCBs need setting up for the appliance (Ideal F09 = unconfigured PCB in Logic guidance); check manual notes so the engineer expects to configure it.
   - Genuine vs alternative/refurbished: DHS labels these options; for gas/combustion parts prefer genuine (see README/Baxi liability note).
5. **Cross-check in a second source** (manufacturer list vs DHS vs PartsArena). If two sources give different numbers for the same position — stop, phone manufacturer tech or DHS (0330 123 3707) with GC + serial.
6. **Write the full identity on the order**: make, model, GC, serial, part number, diagram position, fuel. This is what saves the return trip when a range spans 15 years of variants.

## Worked example (verified from a live DHS appliance page, 19 Oct 2026)
- Appliance page: Ideal Classic FF 350 — DHS states **GC Number: 41-391-96** for it.
- The page lists, for that appliance, e.g. "Ideal 171461 Fan Assembly Kit - Classic FF 30-80", "Ideal 171441 Gas Valve Kit", "Ideal 079662 Manifold Gasket Set" with the manufacturer part number first in each description.
- Source: https://www.dhsspares.co.uk/category/gas-boiler-uk/brand/ideal-domestic/appliance/ideal-classic-ff-350-ide226
- Lesson to copy (not the numbers — the *method*): GC pinned the appliance; manufacturer numbers came from the appliance-specific list; note how two different fan kits appear for different output sub-ranges (FF 30-80 vs FF 30-60 listings) — output variant check, step 4, is not optional.
- Do not copy prices/stock from that page into quotes — they are live.

## Second worked example — old catalogue on the box
- `/workspace/vaillant/sp.pdf` is Vaillant's spare parts catalogue 0020010870.05 (GB 10/2008) for ecoTEC plus 824/831/837 & 612–637, organised by exploded sections (04 Burner, 06 Heat exchanger, 08 Casing…).
- Use it to learn diagram layout only. A 2008 catalogue number **must** be checked for supersession in the current Literature Finder / DHS before ordering: https://professional.vaillant.co.uk/for-installers/literature-finder/

## Serial / date codes
- Formats are brand- and generation-specific. Worcester uses an FD factory-date code; Vaillant long serials encode production info — secondary explanation: https://www.trustapart.co.uk/how-old-is-my-boiler/ (`unverified against a manufacturer document — confirm with the manufacturer when age matters, e.g. warranty`).
- Safest practice: record serial verbatim, photograph it, and let the manufacturer/DHS decode it.

## Pre-order checklist (tape this to the counter)
```
[ ] Data badge photo (GC + serial legible)
[ ] Fault code photo + symptom + sequence stage
[ ] Diagram position AND manufacturer part number agree in 2 sources
[ ] Output / fuel / voltage variant checked
[ ] Supersession checked
[ ] Seals/gaskets for the job — included or added
[ ] Kit contents checked (not double-ordering kit components)
[ ] Genuine vs alternative stated to customer/engineer
[ ] Full identity written on order notes
```
