const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("LiquidityLockerModule", (m) => {
  const owner = m.getParameter("owner");
  const unlockTime = m.getParameter("unlockTime");

  const liquidityLocker = m.contract("LiquidityLocker", [owner, unlockTime]);

  return { liquidityLocker };
});
