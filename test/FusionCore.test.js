const { expect } = require("chai");
const { ethers } = require("hardhat");

//Tests for FusionCore.sol contract
describe("Fusion Core", () => {
  //Setting constant variables
  let owner;
  let alice;
  let bob;
  let fusionCore;
  let fusionToken;
  let mockUsdc;

  const usdcAmount = ethers.utils.parseEther("25000");
  const provider = ethers.provider;

  //Runs before individual tests. Deploying contracts, minting usdc.
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

  //Deployment test
  describe("Initialize", async () => {
    it("should deploy successfully", async () => {
      expect(await mockUsdc).to.be.ok;
      expect(await fusionToken).to.be.ok;
      expect(await fusionCore).to.be.ok;
    });
  });

  //Lending funcionality tests
  describe("Lend", async () => {
    it("should lend USDC", async () => {
      let lendAmount = ethers.utils.parseEther("100");

      await mockUsdc.connect(alice).approve(fusionCore.address, lendAmount);

      expect(await fusionCore.isLending(alice.address)).to.eq(false);

      expect(await fusionCore.connect(alice).lend(lendAmount)).to.be.ok;
      expect(await mockUsdc.balanceOf(fusionCore.address)).to.eq(lendAmount);

      expect(await fusionCore.isLending(alice.address)).to.eq(true);
      expect(await fusionCore.lendingBalance(alice.address)).to.eq(lendAmount);
    });

    it("should lend USDC multiple times", async () => {
      let lendAmount = ethers.utils.parseEther("100");

      await mockUsdc.connect(bob).approve(fusionCore.address, lendAmount);
      expect(await fusionCore.connect(bob).lend(lendAmount)).to.be.ok;

      await mockUsdc.connect(bob).approve(fusionCore.address, lendAmount);
      expect(await fusionCore.connect(bob).lend(lendAmount)).to.be.ok;

      expect(await fusionCore.lendingBalance(bob.address)).to.eq(
        ethers.utils.parseEther("200")
      );
    });

    it("should lend USDC for multiple users", async () => {
      let lendAmount = ethers.utils.parseEther("100");

      await mockUsdc.connect(alice).approve(fusionCore.address, lendAmount);
      await mockUsdc.connect(bob).approve(fusionCore.address, lendAmount);

      expect(await fusionCore.connect(alice).lend(lendAmount)).to.be.ok;
      expect(await fusionCore.connect(bob).lend(lendAmount)).to.be.ok;

      expect(await fusionCore.lendingBalance(alice.address)).to.eq(lendAmount);
      expect(await fusionCore.lendingBalance(bob.address)).to.eq(lendAmount);
    });

    it("should revert with 0 lend amount", async () => {
      await expect(fusionCore.connect(alice).lend(0)).to.be.revertedWith(
        "Can't lend amount: 0!"
      );
    });

    it("should revert with insufficient funds", async () => {
      let lendAmount = ethers.utils.parseEther("25001");

      await mockUsdc.connect(bob).approve(fusionCore.address, lendAmount);

      await expect(fusionCore.connect(bob).lend(lendAmount)).to.be.revertedWith(
        "Insufficient balance!"
      );
    });

    it("should revert with insufficient allowance!", async () => {
      let lendAmount = ethers.utils.parseEther("100");

      await expect(
        fusionCore.connect(alice).lend(lendAmount)
      ).to.be.revertedWith("ERC20: insufficient allowance");
    });
  });

  //Withdraw USDC functionality tests
  describe("Withdraw Lend", async () => {
    beforeEach(async () => {
      let lendAmount = ethers.utils.parseEther("100");

      await mockUsdc.connect(bob).approve(fusionCore.address, lendAmount);
      await fusionCore.connect(bob).lend(lendAmount);
    });

    it("should withdraw lend amount", async () => {
      let withdrawAmount = ethers.utils.parseEther("100");

      await fusionCore.connect(bob).withdrawLend(withdrawAmount);

      let balance = await fusionCore.lendingBalance(bob.address);
      expect(Number(balance)).to.eq(0);

      expect(await fusionCore.isLending(bob.address)).to.eq(false);
    });

    it("should withdraw lend amount multiple times", async () => {
      let lendAmount = ethers.utils.parseEther("100");
      let firstAmount = ethers.utils.parseEther("70");
      let secondAmount = ethers.utils.parseEther("30");

      await fusionCore.connect(bob).withdrawLend(firstAmount);

      let balance = await fusionCore.lendingBalance(bob.address);
      expect(Number(balance)).to.eq(lendAmount - firstAmount);
      expect(await fusionCore.isLending(bob.address)).to.eq(true);

      await fusionCore.connect(bob).withdrawLend(secondAmount);

      balance = await fusionCore.lendingBalance(bob.address);
      expect(Number(balance)).to.eq(0);
      expect(await fusionCore.isLending(bob.address)).to.eq(false);
    });

    it("should revert with insufficient lending balance", async () => {
      let withdrawAmount = ethers.utils.parseEther("101");

      await expect(
        fusionCore.connect(bob).withdrawLend(withdrawAmount)
      ).to.be.revertedWith("Insufficient lending balance!");
    });
  });

  //Claim yield ($FUSN) functionality and arithmetics tests
  describe("Claim Yield", async () => {
    beforeEach(async () => {
      let lendAmount = ethers.utils.parseEther("10");

      await fusionToken.transferOwnership(fusionCore.address);
      await mockUsdc.connect(alice).approve(fusionCore.address, lendAmount);
      await fusionCore.connect(alice).lend(lendAmount);
    });

    it("should return time elapsed", async () => {
      let time = 31536000;
      let startingTime = await fusionCore.startTime(alice.address);
      expect(Number(startingTime)).to.be.greaterThan(0);

      await ethers.provider.send("evm_increaseTime", [time]);
      await ethers.provider.send("evm_mine");

      expect(await fusionCore.calculateYieldTime(alice.address)).to.eq(time);
    });

    it("should claim correct amount of tokens", async () => {
      let time = 31536000;
      await ethers.provider.send("evm_increaseTime", [time]);
      await ethers.provider.send("evm_mine");

      let lendDuration = await fusionCore.calculateYieldTime(alice.address);
      let lendAmount = await fusionCore.lendingBalance(alice.address);
      let earnRate = lendDuration / time;
      let balance = ethers.utils.formatEther(
        (lendAmount * earnRate).toString()
      );
      let expectedToEarn = Number.parseFloat(balance).toFixed(3);

      await fusionCore.connect(alice).claimYield();

      let rawEarnedAmount = await fusionToken.balanceOf(alice.address);
      let earnedAmount = Number.parseFloat(
        ethers.utils.formatEther(rawEarnedAmount)
      )
        .toFixed(3)
        .toString();

      expect(expectedToEarn).to.eq(earnedAmount);
    });

    it("should save yield earned after lending again", async () => {
      let time = 31536000;
      let lendAmount = ethers.utils.parseEther("5");

      await mockUsdc.connect(alice).approve(fusionCore.address, lendAmount);

      await ethers.provider.send("evm_increaseTime", [time]);
      await ethers.provider.send("evm_mine");

      await fusionCore.connect(alice).lend(lendAmount);

      let rawBalance = await fusionCore.fusionBalance(alice.address);
      let balance = Number(ethers.utils.formatEther(rawBalance));

      expect(balance).to.be.closeTo(10, 0.001);
    });

    it("should save yield earned after withdrawing", async () => {
      let time = 31536000;
      let withdrawAmount = ethers.utils.parseEther("5");

      await ethers.provider.send("evm_increaseTime", [time]);
      await ethers.provider.send("evm_mine");

      await fusionCore.connect(alice).withdrawLend(withdrawAmount);

      let rawBalance = await fusionCore.fusionBalance(alice.address);
      let balance = Number(ethers.utils.formatEther(rawBalance));

      expect(balance).to.be.closeTo(10, 0.001);
    });
  });

  //Collateralize ETH funcionality tests
  describe("Collateralize ETH", async () => {
    it("should colltaeralize ether", async () => {
      let collatAmount = ethers.utils.parseEther("1");

      await fusionCore.connect(bob).collateralize({ value: collatAmount });

      expect(await fusionCore.collateralBalance(bob.address)).to.eq(
        collatAmount
      );
      expect(await provider.getBalance(fusionCore.address)).to.eq(collatAmount);
    });

    it("should collateralize ether multiple times", async () => {
      let collatAmount = ethers.utils.parseEther("1");

      await fusionCore.connect(alice).collateralize({ value: collatAmount });
      await fusionCore.connect(bob).collateralize({ value: collatAmount });
      await fusionCore.connect(alice).collateralize({ value: collatAmount });

      expect(await fusionCore.collateralBalance(alice.address)).to.eq(
        ethers.utils.parseEther("2")
      );
      expect(await fusionCore.collateralBalance(bob.address)).to.eq(
        collatAmount
      );
      expect(await provider.getBalance(fusionCore.address)).to.eq(
        ethers.utils.parseEther("3")
      );
    });

    it("should revert with amount 0 can't be collateralized", async () => {
      await expect(
        fusionCore.connect(bob).collateralize({ value: 0 })
      ).to.be.revertedWith("Can't collaterlize ETH amount: 0!");
    });
  });

  //Withdraw Collateral functionality tests
  describe("Withdraw Colleteral", async () => {
    beforeEach(async () => {
      let collatAmount = ethers.utils.parseEther("3");

      await fusionCore.connect(bob).collateralize({ value: collatAmount });
    });

    it("should withdraw collateral", async () => {
      let withdrawAmount = ethers.utils.parseEther("1");
      let expectedResult = ethers.utils.parseEther("2");
      let rawBeforeBalance = await provider.getBalance(bob.address);
      let beforeBalance = Number(ethers.utils.formatEther(rawBeforeBalance));

      await fusionCore.connect(bob).withdrawCollateral(withdrawAmount);

      expect(await fusionCore.collateralBalance(bob.address)).to.eq(
        expectedResult
      );
      expect(await provider.getBalance(fusionCore.address)).to.eq(
        expectedResult
      );

      let rawAfterBalance = await provider.getBalance(bob.address);
      let afterBalance = Number(ethers.utils.formatEther(rawAfterBalance));

      expect(afterBalance).to.be.closeTo(beforeBalance + 1, 0.0001);
    });

    it("should withdraw collateral multiple times", async () => {
      let firstAmount = ethers.utils.parseEther("1");
      let secondAmount = ethers.utils.parseEther("2");

      await fusionCore.connect(bob).withdrawCollateral(firstAmount);

      expect(await fusionCore.collateralBalance(bob.address)).to.eq(
        ethers.utils.parseEther("2")
      );

      await fusionCore.connect(bob).withdrawCollateral(secondAmount);

      expect(await fusionCore.collateralBalance(bob.address)).to.eq(0);
    });

    it("should revert with not enough collateral to withdraw", async () => {
      let withdrawAmount = ethers.utils.parseEther("4");

      await expect(
        fusionCore.connect(bob).withdrawCollateral(withdrawAmount)
      ).to.be.revertedWith("Not enough collateral to withdraw!");
    });
  });
});
