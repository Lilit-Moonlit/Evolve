import { useState, useEffect } from "react";
import { FeatureFlags, DEFAULT_FLAGS, loadFeatureFlags } from "@evolve/config";

const REMOTE_FLAGS_URL =
  "https://raw.githubusercontent.com/Lilit-Moonlit/Evolve/main/public/feature-flags.json";

export function useFeatureFlags(): FeatureFlags {
  const [flags, setFlags] = useState<FeatureFlags>(DEFAULT_FLAGS);

  useEffect(() => {
    let isMounted = true;
    loadFeatureFlags(REMOTE_FLAGS_URL).then((loaded) => {
      if (isMounted) {
        setFlags(loaded);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return flags;
}
