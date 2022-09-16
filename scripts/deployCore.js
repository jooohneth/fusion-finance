const { ethers, network } = require("hardhat");

const main = async () => {
  console.log(`Deploying on ${network.name}`);

  let baseAsset;

  ///@dev uncomment the code below to deploy MOCK on Hardhat network.
  /*
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  baseAsset = await MockERC20.deploy("Mock Asset", "MOCK");
  console.log(`Base asset mock address: ${baseAsset.address}`);
  */

  const FusionToken = await ethers.getContractFactory("FusionToken");
  const fusionToken = await FusionToken.deploy();
  console.log(
    `Fusion Token  address: ${fusionToken.address}, deployer: ${fusionToken.signer.address}`
  );

  if (!baseAsset) {
    baseAsset = "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C";
  } else {
    baseAsset = baseAsset.address;
  }

  const FusionCore = await ethers.getContractFactory("FusionCore");
  const fusionCore = await FusionCore.deploy(baseAsset, fusionToken.address);
  console.log(
    `Fusion Core address: ${fusionCore.address}, deployer: ${fusionCore.signer.address}`
  );

  await fusionToken.transferOwnership(fusionCore.address);
  console.log(
    `Fusion Token ownership transferred from ${fusionToken.signer.address} to ${fusionCore.address}`
  );
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
