// Typed help terms mapping for InfoProposalIcons and other components

export interface HelpTerm {
  term: string; // The identifier used in code (e.g., "home.filters.skinColor")
  titleKey: string; // i18n key for the title
  bodyKey: string; // i18n key for the explanation body
}

// All help terms that will be displayed via InfoProposalIcons
// Keys must match the term prop passed to the component
export const HELP_TERMS: HelpTerm[] = [
  {
    term: "home.filters.skinColor",
    titleKey: "help.home.filters.skinColor.title",
    bodyKey: "help.home.filters.skinColor.body",
  },
  {
    term: "home.filters.lookingFor",
    titleKey: "help.home.filters.lookingFor.title",
    bodyKey: "help.home.filters.lookingFor.body",
  },
  {
    term: "home.filters.testingPreference",
    titleKey: "help.home.filters.testingPreference.title",
    bodyKey: "help.home.filters.testingPreference.body",
  },
  {
    term: "home.filters.gender",
    titleKey: "help.home.filters.gender.title",
    bodyKey: "help.home.filters.gender.body",
  },
  {
    term: "chat.proposals",
    titleKey: "help.chat.proposals.title",
    bodyKey: "help.chat.proposals.body",
  },
  {
    term: "mode2.dashboard",
    titleKey: "help.mode2.dashboard.title",
    bodyKey: "help.mode2.dashboard.body",
  },
  {
    term: "mode3.dashboard",
    titleKey: "help.mode3.dashboard.title",
    bodyKey: "help.mode3.dashboard.body",
  },
  {
    term: "profile.sections.lab",
    titleKey: "help.profile.sections.lab.title",
    bodyKey: "help.profile.sections.lab.body",
  },
  {
    term: "profile.sections.modeSelector",
    titleKey: "help.profile.sections.modeSelector.title",
    bodyKey: "help.profile.sections.modeSelector.body",
  },
  {
    term: "profile.sections.profileEdit",
    titleKey: "help.profile.sections.profileEdit.title",
    bodyKey: "help.profile.sections.profileEdit.body",
  },
];

/** Find a help term by its identifier */
export function getHelpTerm(term: string): HelpTerm | undefined {
  return HELP_TERMS.find((t) => t.term === term);
}

/** Check if a term is known (for UI conditional rendering) */
export function isKnownHelpTerm(term: string): boolean {
  return HELP_TERMS.some((t) => t.term === term);
}
