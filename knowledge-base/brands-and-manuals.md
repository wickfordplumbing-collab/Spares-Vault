# Brands & Manuals — verified official sources

Rule: only URLs fetched/verified in research on 19 Oct 2026 are listed as official. If a brand has no public spares catalogue, that is stated — use DHS / PartsArena instead (see `dhs-and-suppliers.md`).

## How numbers generally work (UK)

- **GC (Gas Council) number:** a 7-digit UK appliance identifier usually printed `00-000-00` on the data plate. It identifies the exact appliance variant, not just the range, and is the best single key for spares lookup. Sources: https://www.tradepartsfinder.co.uk/articles/what-is-the-gc-number-on-a-boiler ; https://myboiler.com/what-is-a-gc-number/
- **Manufacturer part number:** the maker's own number for the spare (format is brand-specific — do not guess it). Always quote it with the appliance GC/model.
- **Serial number:** identifies production date/variant. Formats differ by brand and generation — see per-brand notes; if the manual doesn't decode it, record it verbatim and give it to the supplier/manufacturer tech line.
- **Data badge location:** commonly behind/inside the front panel, on the underside, or under a controls flap (Worcester manuals note GC details under the controls cover flap — source: Worcester Greenstar CDi manual via https://www.worcester-bosch.co.uk/support/literature/download/6720812177/12515 ). Ask the engineer/customer for a photo of the plate itself.

---

## Baxi (BDR Thermea — includes Main & Potterton, see below)
- Manuals (homeowner literature library): https://www.baxi.co.uk/support/literature-library
- Professional literature library: https://www.baxi.co.uk/professional/help-and-advice/literature-library
- Spares / genuine parts + PartsArena pointer: https://www.baxi.co.uk/professional/services/spare-parts
- Error codes (official): https://www.baxi.co.uk/professional/services/technical-support/error-codes
- Verified code examples (official Baxi FAQ https://www.baxi.co.uk/help-and-advice/faqs/what-do-baxi-error-codes-e23-e53-e133-e119-or-e128-mean ): **E119** = low primary water pressure (<0.5 bar on that guidance — re-pressurise ~1–2 bar); **E133** = gas supply interruption / ignition failure / flame not detected; **E110** = primary water / flue overheat. *Always check the list for the exact model — E-codes vary by range.*
- Identification: Baxi ranges are numeric (200/400/600/800, Platinum, Duo-tec etc.) + output. Use GC + serial from data badge; exploded diagrams via PartsArena / approved stockists / DHS.

## Main (Baxi group brand)
- Sold as Baxi-group; manuals/spares via Baxi literature library above and DHS brand "Main Spare Parts" in the DHS Spares Finder: https://www.dhsspares.co.uk/?page=spares-finder
- Fault codes: Main models commonly share Baxi-family E-codes — `unverified for a specific model — check manual` before quoting one.

## Potterton (Baxi group brand)
- Manuals/spares via Baxi literature library above; DHS brand "Potterton Boiler Spares": https://www.dhsspares.co.uk/?page=spares-finder
- Promax etc. user manuals show the same E-code family (E110/E119/E133 above). Model-specific check required.

## Heatline
- No standalone official UK manual library verified in this trawl. DHS hosts Heatline manuals/models page: https://www.dhsspares.co.uk/boiler-manuals/heatline (models listed there include C/Capriz/Compact/Monza/Solaris/Vizo families — as listed by DHS).
- Identification: give DHS the full model + GC; Heatline is a Vaillant Group brand historically — `unverified — check manual / DHS` for spares route per model.

## Vaillant (user said "Valent")
- Installer literature finder (536 documents, filters include "Spare parts manual"): https://professional.vaillant.co.uk/for-installers/literature-finder/
- Homeowner fault-code list: https://www.vaillant.co.uk/service/boiler-fault-codes/
- Verified ecoTEC pro manual fault examples (official PDF https://professional.vaillant.co.uk/downloads/product-manuals/ecotec-pro-1/ecotec-pro-24-28-combi-installation-and-maintenance-instructions-2055535.pdf ): **F.28** unsuccessful ignition (gas supply, condensate blocked, ignition system, ionisation, earthing, electronics listed); **F.29** re-ignition unsuccessful; **F.32** fan fault; **F.75** (homeowner page) = pressure change too low at pump start — causes include pressure <1 bar, air, water pressure sensor, pump, harness. Do not transfer codes between ecoTEC generations without the manual.
- Serial reading: a secondary source (Trust A Part) describes modern Vaillant serials as 28 characters with production year/week in characters 3–6 — `treat as unverified — confirm with Vaillant` for a given appliance: https://www.trustapart.co.uk/how-old-is-my-boiler/
- Spares: original parts only per manual §13.5.1 (same PDF); exploded views in the model's spare parts manual via Literature Finder; also Vaillant Group `spareCHECK` trade app.
- Local file already on box: `/workspace/vaillant/sp.pdf` — Vaillant spare parts catalogue ecoTEC plus 824/831/837, 612–637 (0020010870.05 GB 10/2008), with burner/heat exchanger/casing exploded sections. Old — verify supersessions before ordering from it.

## Glow-worm (Vaillant Group)
- Homeowner literature: https://glow-worm.co.uk/homeowner/repairs-and-servicing/literature/
- Trade hub: https://www.glow-worm.co.uk/trade/
- Legacy (discontinued) ranges page: https://glow-worm.co.uk/trade/products/glow-worm-legacy-products/
- Spares identification: Glow-worm `spareCHECK` (Vaillant Group trade app, exploded views) — Play Store listing verified in search: https://play.google.com/store/apps/details?id=com.vaillant_group.sparecheck.glo
- Fault codes are Vaillant-family style on many models but tables are model-specific — `check manual`.

## Viessmann (user said "Wiesmann")
- Manuals hub / ViBooks: https://www.viessmann.co.uk/en/support/manuals.html — search ViBooks by serial/article number from the type plate; trade partners get 30,000+ documents (installation/service, technical guides).
- ViBooks direct: https://vibooks.viessmann-climatesolutions.com/GB/en
- Spare Parts App for professionals: https://www.viessmann.co.uk/en/support/spare-parts-app.html (Partner Portal account; enter serial/model/barcode for exploded diagrams).
- Schematics browser: https://schematics.viessmann.com/?country=GB&lang=en
- Identification: Viessmann leans on the **serial number** more than GC for spares — always quote it.

## Ideal (Ideal Heating)
- User guides hub: https://idealtouch.idealboilers.com/user-guides
- Fault-code FAQ (official): https://idealheating.com/support/faqs/boiler-fault-codes
- Verified Logic-family examples (official FAQ + Logic System2 user guide UIN 237665): **F01/F1** low water pressure (1–1.5 bar); **F02/F2** flame loss; **F03/F3** fan fault; **F04/F05** flow/return thermistor; **L01** flow overheat / no water flow; **L02** ignition lockout. Code presentation (F vs L, flashing letters/numbers) varies by Logic generation — check the model guide.
- Boilers: Logic / Logic+ / Logic Max, Vogue, i-mini etc. — range name alone is not enough; need output + GC/serial.

## Keston (Ideal group)
- Product literature (current + discontinued, incl. C/K series, Heat 2, Combi/System): https://keston.co.uk/product-literature
- Note Keston's history of twin-flue / long-flue system boilers — flue parts are less interchangeable; always model + serial.

## Morco
- Manuals (current + obsolete; some technical manuals sign-in): https://morcoproducts.co.uk/manuals/
- Official spares shop: https://morcoproducts.co.uk/boiler-spares/
- Morco serves caravan/park-home water heaters & boilers heavily — confirm the appliance type (it may not be a standard domestic combi).

## Worcester Bosch
- Literature search: https://www.worcester-bosch.co.uk/professional/support/literature
- Spare parts (spares catalogue site, 10,000+ parts enquiry system): https://www.worcester-bosch.co.uk/professional/products/spare-parts
- Fault Finder in Worcester professional app: https://www.worcester-bosch.co.uk/professional/installers-choice/trade-tips/fault-finder
- Verified Greenstar CDi examples (official manual): **EA** flame not detected (check gas supply, condensate blocked/frozen, flue blocked, then reset); **C6** fan speed too low; **E9** safety temp limiter tripped; **F7/FA** flame detected when it shouldn't be; **b1** code plug not detected. FD number = Worcester factory-date code (secondary source: https://www.trustapart.co.uk/how-old-is-my-boiler/ — `confirm per model`).
- Identification: model + GC under controls flap (per manual) + FD/serial.

## Alpha
- Instruction & user manuals: https://www.alpha-innovation.co.uk/brochures-and-manuals/instruction-and-user-manuals

## Ariston
- UK installation manuals are published per model (e.g. E-Combi ONE manual PDF via ariston.com, found in search). No central library URL verified in this trawl — search Ariston UK by exact model, or use DHS brand selector.

## Ferroli
- Technical documentation (installer toolbox): https://www.ferroli.com/uk/installers/toolbox/documentation

## Intergas
- Downloads (installation, service, parameters): https://intergasstore.co.uk/downloads
- Note: Intergas designs often have fewer moving parts (e.g. no diverter valve on some models — heat exchanger does both duties). `Verify per model in its manual` before assuming a diverter fault is possible.

## Vokera (Vokèra)
- Manuals & literature (includes GC numbers per model): https://www.vokera.co.uk/trade-professionals/manuals-literature/

## Ravenheat / Biasi
- No official UK library verified in this trawl. Route: DHS Spares Finder brand list includes Ravenheat (verified on DHS homepage brand list https://www.dhsspares.co.uk/ ) and Biasi appears in DHS brand list as "Biasi". Use exact model + GC via DHS; mark any other web source `unverified`.

## Vaillant Group note
Vaillant, Glow-worm (and historically Heatline) sit in Vaillant Group UK; Baxi/Main/Potterton sit in BDR Thermea; Ideal/Keston in Groupe Atlantic / Ideal group. Group family explains shared fault-code *style* and parts-binning, but **never** assume a part is interchangeable across brands without the part number cross-check.
