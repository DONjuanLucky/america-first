import { EventBriefDTO } from "@/types/perspectives";

export const fallbackPerspectives: EventBriefDTO[] = [
  {
    id: "budget-deal",
    slug: "federal-budget-negotiations",
    event: "Federal Budget Negotiations",
    updatedAt: new Date().toISOString(),
    published: true,
    leftSaying: [
      "Social service safeguards should remain in place during deficit reductions.",
      "Revenue-side adjustments are needed alongside spending controls.",
      "Education and healthcare funding cuts could increase long-term costs.",
    ],
    rightSaying: [
      "Spending caps should be stronger and include enforceable timelines.",
      "Tax increases may slow growth and should not be part of the package.",
      "Debt stabilization requires structural budget reforms now.",
    ],
    factsSoFar: [
      "Both chambers have passed different budget frameworks and entered reconciliation talks.",
      "CBO preliminary estimates show deficit impact varies by amendment set.",
      "No final appropriations package has cleared both chambers yet.",
    ],
    whyLeft:
      "This side generally emphasizes the federal safety net and long-term public investment, especially after past austerity periods where social cuts were linked to higher household strain.",
    whyRight:
      "This side generally prioritizes debt control, spending restraint, and lower tax burden, shaped by a long policy tradition that views fiscal expansion as a risk to inflation and growth stability.",
    historicalContext: [
      "Budget standoffs have repeatedly centered on the same tradeoff: entitlement and discretionary spending levels versus deficit targets.",
      "Past bipartisan deals typically combined caps, selective program protections, and delayed implementation windows.",
    ],
  },
  {
    id: "border-bill",
    slug: "border-security-immigration-bill",
    event: "Border Security and Immigration Bill",
    updatedAt: new Date().toISOString(),
    published: true,
    leftSaying: [
      "Any enforcement expansion should include asylum processing capacity.",
      "Family and humanitarian safeguards must remain in statute.",
      "State-level impacts should be evaluated before implementation.",
    ],
    rightSaying: [
      "Border processing must prioritize enforcement and removal logistics.",
      "Eligibility thresholds should be tightened to reduce system abuse.",
      "Rapid operational authority is needed for high-volume crossings.",
    ],
    factsSoFar: [
      "Committee markup is complete; floor vote scheduling is pending.",
      "DHS and GAO data were cited by both sides in official hearings.",
      "Current text includes both enforcement and adjudication provisions.",
    ],
    whyLeft:
      "This perspective is rooted in due-process and humanitarian policy concerns, especially from prior periods where enforcement-only approaches created legal backlogs and family-separation controversies.",
    whyRight:
      "This perspective is shaped by sovereignty, border-control, and capacity arguments, especially after high-volume crossing periods that strained detention, court, and local support systems.",
    historicalContext: [
      "U.S. immigration legislation has historically alternated between enforcement-led and reform-led coalitions.",
      "Most durable reforms have mixed operational enforcement with process modernization and court capacity funding.",
    ],
  },
];
