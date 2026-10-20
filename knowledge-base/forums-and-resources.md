# Forums & Professional Resources — verified, with access limits

Access warning up front: good boiler-repair discussion is deliberately gated. Gas-side fault-finding shared with the public would be unsafe and, for paid work, Gas Safe is a legal requirement. Expect Gas Safe-verified areas to require a registration number; do not quote forum posts to customers as instructions.

## Verified resources

### UK Plumbers Forums — https://ukplumbersforums.co.uk/
- Large UK trade/community forum. Verified structure: public plumbing/boiler advice areas plus a **Gas Safe Register-only area** (registration details required; forum threads discuss minimum requirements). Good for: real-world "this model does X" pattern recognition, which parts fail on which ranges, merchant/supplier experience.
- Use: search before asking; treat solutions as leads to verify in the manual, not as authority. Public posts vary in quality.

### National Gas Engineers — https://nationalgasengineers.co.uk/
- Positioned (per its site, found via search) as a learning app for UK gas engineers with trade forum / fault-code knowledge base for verified engineers. `Access/verification details unverified beyond its own homepage claims — check before recommending.`

### Gas Safe Register — https://www.gassaferegister.co.uk/
- Official register: check an engineer/business, gas safety guidance. Not a forum — the authority for "is this person legal for this appliance".

### Manufacturer technical support (often better than any forum)
- Baxi technical support + error codes: https://www.baxi.co.uk/professional/services/technical-support/error-codes (tech support hours Mon–Fri 8–6, Sat 8:30–2 per Baxi search result)
- Vaillant homeowner fault list / engineer booking line and installer literature@vaillant.co.uk (Literature Finder page): https://professional.vaillant.co.uk/for-installers/literature-finder/
- Worcester Fault Finder inside the Worcester Bosch professional app (enter code → meaning + spares link): https://www.worcester-bosch.co.uk/professional/installers-choice/trade-tips/fault-finder
- Ideal fault-code FAQ: https://idealheating.com/support/faqs/boiler-fault-codes
- DHS technical phone help 0330 123 3707 (parts identification, 7 days per FAQ): https://www.dhsspares.co.uk/frequently-asked-questions

## Not verified / use with care
- Generic fault-code blogs, YouTube teardowns, and retailer "what does code X mean" pages were deliberately **not** built into the fault tables. The recurring failure mode online is copying a code table from a different model generation. If a source doesn't name the exact model + manual edition, mark it `unverified — check manual`.
- Reddit / DIY forums: useful for "householder symptom wording" (how customers describe noises), never for gas-side procedure.

## Recurring diagnostic lessons (from official manuals/FAQs, not forum lore)
1. **Frozen/blocked condensate** is a manufacturer-listed ignition-failure cause (Vaillant F.28, Worcester EA guidance, Ideal L02 guidance) — first check in a cold snap, and the one check user guides allow householders.
2. **Low pressure** accounts for a large share of "boiler dead" calls (Baxi E119, Ideal F01, Vaillant F.75 family) — teach the filling-loop conversation.
3. **Codes with many causes** (Vaillant F.28 lists 6+, F.75 lists 4) are the norm; single-part answers online are a red flag.
4. **Earth/rectification faults** mimic gas valve/PCB failures: dirty ionisation probe or poor earth drops a lit flame in seconds.
5. **Air + sludge explain more "failed parts" than parts do**: F.75-type and overheat codes often clear with pressure/air/circulation sorted; pumps and sensors get condemned for system problems.
6. **The part that failed is often the victim**: PRVs pass because vessels fail; PCBs die because pumps/fans short. Sell the cause, not just the casualty.

## Round 2 additions — accessible forum threads actually read (19 Oct 2026)

### Vaillant ecoTEC F.75 thread — UK Plumbers Forums (public thread, fetched in full)
- Thread: https://ukplumbersforums.co.uk/threads/vaillant-ecotec-f-75.94133/
- What engineers in the thread actually do: check standing pressure and whether the display shows ~**0.2 bar rise when the pump starts**; isolate/depressurise and see if the readout zeroes (if not, sensor is lying); check the filter behind the pressure sensor for blockage; check rubber hoses ('squeeze — if solid, replace', one poster upgrades to copper when renewing the pump); pump next; PCB 'only once'. One names the sensor: Vaillant 0020059717 (matches DHS Example 2 in dhs-lookup-worked-examples.md).
- Lesson for counter: F.75 = sensor + pump + blockage + hoses as a *system*. Selling just the sensor first is common, but warn it may be hoses/filter/pump. This matches Vaillant's own multi-cause manual list — forum and manual agree here.

### Ideal Logic 'No Hot Water' thread — UK Plumbers Forums (fetched in full)
- Thread: https://ukplumbersforums.co.uk/threads/no-hot-water-fixed-and-broken-again-ideal-logic-24.132805/
- Story: DHW cold/barely warm (better when heating off/cold). Over time: flow cartridge, flow sensor, manifold, diverter cartridge + actuator changed, plate inspected 'very good' — fixed for 4 days, then failed again. Removing actuator and manually pressing the diverter restores hot water.
- Lessons: (1) manually moving the diverter proving DHW is a genuine diagnostic split (actuator/drive vs valve travel); (2) repeated part-swapping without finding why travel fails wastes money; (3) note the thread's moderation: first replies ask 'are you Gas Safe registered?' and limit help if not — public threads will often stop at the gas/combustion boundary. That gatekeeping is visible in the fetched thread, not assumed.

### Frozen condensate threads (search-indexed, not all fetched in full)
- 'Frozen condense' https://ukplumbersforums.co.uk/threads/frozen-condense.15193/ ; 'Condense pipe frozen?' https://ukplumbersforums.co.uk/threads/condense-pipe-frozen.101297/ ; 'Vokera condensing boiler — froze, thawed, now not working' https://ukplumbersforums.co.uk/threads/volkera-condensing-boiler-froze-thawed-now-not-working.15984/
- Recurring pattern (per search summaries — marked as summary-level, not full-thread verified): thaw external pipe, check trap, reset once; if water backed up, ignition/flame parts may have suffered — engineer. Consistent with manufacturer user-guide advice (round 1).

### Gas Safe-only areas — inaccessible, not summarised
UK Plumbers Forums' Gas Safe area and similar verified-engineer spaces require registration credentials I do not have. Their contents are **not** described here. Do not ask staff to relay credentials or scrape them.
