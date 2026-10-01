import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SmartAccountFactoryModule = buildModule("SmartAccountFactoryModule", (m) => {
  const accountImpl = m.contract("EvolveSmartAccount");
  const factory = m.contract("EvolveSmartAccountFactory", [accountImpl]);
  return { accountImpl, factory };
});

export default SmartAccountFactoryModule;
