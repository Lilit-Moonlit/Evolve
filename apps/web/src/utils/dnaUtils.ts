import { STRProfile } from "../store/AppContext";

export interface DNAComparisonResult {
  locusMatches: {
    locus: string;
    profile1: [number, number];
    profile2: [number, number];
    sharedAlleles: number[];
    isMatch: boolean;
  }[];
  matchPercentage: number;
  conclusion: string;
}

export const compareDNA = (
  profile1: STRProfile,
  profile2: STRProfile,
): DNAComparisonResult => {
  const loci = Object.keys(profile1);
  const locusMatches: DNAComparisonResult["locusMatches"] = [];
  let totalMatches = 0;

  loci.forEach((locus) => {
    const alleles1 = profile1[locus];
    const alleles2 = profile2[locus];

    if (alleles2) {
      const shared = alleles1.filter((allele) => alleles2.includes(allele));
      const isMatch = shared.length > 0;
      if (isMatch) totalMatches++;

      locusMatches.push({
        locus,
        profile1: alleles1,
        profile2: alleles2,
        sharedAlleles: shared,
        isMatch,
      });
    }
  });

  const matchPercentage =
    loci.length > 0 ? (totalMatches / loci.length) * 100 : 0;

  let conclusion = "Insufficient data";
  if (matchPercentage > 90) conclusion = "High probability of kinship";
  else if (matchPercentage > 50) conclusion = "Moderate probability of kinship";
  else if (matchPercentage > 0) conclusion = "Low probability of kinship";
  else conclusion = "No kinship detected";

  return {
    locusMatches,
    matchPercentage,
    conclusion,
  };
};
