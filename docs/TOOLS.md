# Tools & Resources page (/tools)

Four funnels, all ending at the free consultation form on the page (#quote), the phone, or a text.

| Tool | Where | Funnel | Events |
|---|---|---|---|
| 1. Water Quality Report Locator | `components/tools/WaterReportTool.tsx`, `lib/waterProfiles.ts` | ZIP -> area report card -> Schedule Your Free Consultation, call/text, flagship plan link | tool_start, tool_result (area) |
| 2. True Cost Calculator | `components/tools/CostCalculator.tsx`, `lib/costModel.ts` | Inputs -> annual cost vs ours -> See Your Custom Quote (flagship pricing) | tool_start, tool_result (saves / no_savings, dollars) |
| 3. Am I Wasting Money? | `components/tools/SavingsDiagnostic.tsx`, `lib/costModel.ts` | 7 yes/no -> score and estimate -> email and SMS opt-in (lead saved) -> schedule a call or text | tool_start, tool_result (tier, dollars), lead_form_submission (diagnostic_capture) |
| 4. Water Quality Quiz | `/quiz` | Quiz card -> /quiz -> recommendation -> contact form | quiz_cta_click (element_source tool_quiz), then quiz_* |

Clicks on call, text, schedule and quiz links carry `element_source` = `tool_report`, `tool_cost`, `tool_diagnostic`, `tool_quiz` or the `_result` variants, so GA4 and the CRM Site activity tab show which tool produced them.

## Where the numbers come from

- **Tool 1** shows how each area is supplied and what homeowners there should check. It is not a lab test of anyone's tap. For Tacoma it also shows the measured results from the Tacoma Water 2025 Water Quality Report next to the legal limits. To add another utility, copy its published report table into a `measured` block in `lib/waterProfiles.ts` and cite the report.
- **Tools 2 and 3** use typical-cost assumptions in `lib/costModel.ts`. The calculator shows them and lets the visitor change them. Health costs are not priced.
- No countdown timers or "24 hours only" offers. The price is fixed (see `docs/PRICING.md`).

## Leads

The diagnostic saves a lead with `service_type = water-diagnostic` and the score, estimate, tier, answers and SMS consent in `leads.quiz` and the notes. SMS opt-in is an unchecked box with consent wording. Do not text anyone who did not tick it.

## EWG data

EWG has no public API. Their data can be requested in writing (their request-for-permission form, reviewed case by case). Until EWG grants permission, this site links to EWG's ZIP lookup instead of copying their numbers. Their health guidelines are far stricter than legal limits, so a "ratio to guideline" display reads much scarier than the legal picture. Primary sources that are free: each utility's annual report, EPA's UCMR monitoring data downloads, and EPA's Envirofacts and ECHO data services for system details and violations.
