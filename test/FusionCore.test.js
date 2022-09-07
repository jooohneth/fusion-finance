const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@openzeppelin/test-helpers");

describe("Fusion Core", () => {
  let owner;
  let alice;
  let bob;
  let fusionCore;
  let fusionToken;
  let mockUsdc;
  let result;

  const usdcAmount = ethers.utils.parseEther("25000");

  beforeEach(async () => {
    const FusionCore = await ethers.getContractFactory("FusionCore");
    const FusionToken = await ethers.getContractFactory("FusionToken");
    const MockUsdc = await ethers.getContractFactory("MockERC20");

    mockUsdc = await MockUsdc.deploy("Mock USDC", "mUSDC");

    [owner, bob, alice] = await ethers.getSigners();

    await Promise.all([
      mockUsdc.mint(owner.address, usdcAmount),
      mockUsdc.mint(bob.address, usdcAmount),
      mockUsdc.mint(alice.address, usdcAmount),
    ]);

    fusionToken = await FusionToken.deploy();
    fusionCore = await FusionCore.deploy(mockUsdc.address, fusionToken.address);
  });

  describe("Initialize", async () => {
    it("should deploy successfully", async () => {
      expect(mockUsdc).to.be.ok;
      expect(fusionToken).to.be.ok;
      expect(fusionCore).to.be.ok;
    });
  });
});
