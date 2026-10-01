import { STRProfile } from "../store/AppContext";

export interface DNAComparisonResult {
  locusMatches: {
    locus: string;
    profile1: number;
    profile2: number;
    isMatch: boolean;
  }[];
  matchPercentage: number;
  conclusion: string;
}

export const compareDNA = (
  profile1: STRProfile,
  profile2: STRProfile,
): DNAComparisonResult => {
  const markers1 = profile1.markers ?? {};
  const markers2 = profile2.markers ?? {};
  const loci = Object.keys(markers1);
  const locusMatches: DNAComparisonResult["locusMatches"] = [];
  let totalMatches = 0;

  loci.forEach((locus) => {
    const allele1 = markers1[locus];
    const allele2 = markers2[locus];

    if (allele2 !== undefined) {
      const isMatch = allele1 === allele2;
      if (isMatch) totalMatches++;

      locusMatches.push({
        locus,
        profile1: allele1,
        profile2: allele2,
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
