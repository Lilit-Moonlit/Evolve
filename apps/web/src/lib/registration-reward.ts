export interface RewardDeps {
  getUserById: (id: string) => Promise<{ ethAddress?: string | null } | null>;
  claimRegistrationReward: (userId: string) => Promise<boolean>;
  mintEvolveAmount: (to: string, amountWei: bigint) => Promise<string>;
}

export interface RewardResult {
  rewarded: boolean;
  userTx?: string;
  labTx?: string;
}

const REWARD_WEI = 1n * 10n ** 18n;

export async function grantRegistrationReward(
  input: { userId: string; labWallet?: string | null },
  deps: RewardDeps,
): Promise<RewardResult> {
  const claimed = await deps.claimRegistrationReward(input.userId);
  if (!claimed) return { rewarded: false };
  const result: RewardResult = { rewarded: true };
  const user = await deps.getUserById(input.userId);
  if (user?.ethAddress) result.userTx = await deps.mintEvolveAmount(user.ethAddress, REWARD_WEI);
  if (input.labWallet) result.labTx = await deps.mintEvolveAmount(input.labWallet, REWARD_WEI);
  return result;
}
