import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("LiquidityLockerModule", (m) => {
  const owner = m.getParameter("owner");
  const unlockTime = m.getParameter("unlockTime");

  const liquidityLocker = m.contract("LiquidityLocker", [owner, unlockTime]);

  return { liquidityLocker };
});
