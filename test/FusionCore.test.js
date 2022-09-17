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
  let mockBaseAsset;
  let mockCore;

  const baseAssetAmount = ethers.utils.parseEther("25000");
  const provider = ethers.provider;

  //Runs before individual tests. Deploying contracts, minting Base Asset.
  beforeEach(async () => {
    const FusionCore = await ethers.getContractFactory("FusionCore");
    const FusionToken = await ethers.getContractFactory("FusionToken");
    const MockBaseAsset = await ethers.getContractFactory("MockERC20");
    const MockCore = await ethers.getContractFactory("MockCore");

    mockBaseAsset = await MockBaseAsset.deploy("Mock Base Asset", "MOCK");

    [owner, bob, alice] = await ethers.getSigners();

    await Promise.all([
      mockBaseAsset.mint(owner.address, baseAssetAmount),
      mockBaseAsset.mint(bob.address, baseAssetAmount),
      mockBaseAsset.mint(alice.address, baseAssetAmount),
    ]);

    fusionToken = await FusionToken.deploy();
    fusionCore = await FusionCore.deploy(
      mockBaseAsset.address,
      fusionToken.address
    );
    mockCore = await MockCore.deploy(
      mockBaseAsset.address,
      fusionToken.address
    );
  });

  //Deployment test
  describe("Initialize", async () => {
    it("should deploy successfully", async () => {
      expect(await mockBaseAsset).to.be.ok;
      expect(await fusionToken).to.be.ok;
      expect(await fusionCore).to.be.ok;
    });
  });

  //Lending funcionality tests
  describe("Lend", async () => {
    it("should lend Base Asset", async () => {
      let lendAmount = ethers.utils.parseEther("100");

      await mockBaseAsset
        .connect(alice)
        .approve(fusionCore.address, lendAmount);

      expect(await fusionCore.isLending(alice.address)).to.eq(false);

      expect(await fusionCore.connect(alice).lend(lendAmount)).to.be.ok;
      expect(await mockBaseAsset.balanceOf(fusionCore.address)).to.eq(
        lendAmount
      );

      expect(await fusionCore.isLending(alice.address)).to.eq(true);
      expect(await fusionCore.lendingBalance(alice.address)).to.eq(lendAmount);
    });

    it("should lend Base Asset multiple times", async () => {
      let lendAmount = ethers.utils.parseEther("100");

      await mockBaseAsset.connect(bob).approve(fusionCore.address, lendAmount);
      expect(await fusionCore.connect(bob).lend(lendAmount)).to.be.ok;

      await mockBaseAsset.connect(bob).approve(fusionCore.address, lendAmount);
      expect(await fusionCore.connect(bob).lend(lendAmount)).to.be.ok;

      expect(await fusionCore.lendingBalance(bob.address)).to.eq(
        ethers.utils.parseEther("200")
      );
    });

    it("should lend Base Asset for multiple users", async () => {
      let lendAmount = ethers.utils.parseEther("100");

      await mockBaseAsset
        .connect(alice)
        .approve(fusionCore.address, lendAmount);
      await mockBaseAsset.connect(bob).approve(fusionCore.address, lendAmount);

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

      await mockBaseAsset.connect(bob).approve(fusionCore.address, lendAmount);

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

  //Withdraw Base Asset functionality tests
  describe("Withdraw Lend", async () => {
    beforeEach(async () => {
      let lendAmount = ethers.utils.parseEther("100");

      await mockBaseAsset.connect(bob).approve(fusionCore.address, lendAmount);
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
      await mockBaseAsset
        .connect(alice)
        .approve(fusionCore.address, lendAmount);
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

      await mockBaseAsset
        .connect(alice)
        .approve(fusionCore.address, lendAmount);

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

  describe("Chainlink Price Feed", () => {
    it("Should be able to successfully get price of ETH", async function () {
      let ethPrice = await fusionCore.getEthPrice();
      expect(ethPrice).not.be.null;

      //console.log(`Price of Ether: ${Number(ethPrice)}`);
    });
  });

  describe("Borrow Base Asset", () => {
    beforeEach(async () => {
      let collatAmount = ethers.utils.parseEther("1");

      await fusionCore.connect(alice).collateralize({ value: collatAmount });

      await mockBaseAsset.mint(fusionCore.address, baseAssetAmount);
    });

    it("should calculate borrow limit", async () => {
      let rawEthPrice = await fusionCore.getEthPrice();
      let ethPrice = Number(rawEthPrice);
      let rawCollatBalance = await fusionCore.collateralBalance(alice.address);
      let collatBalance = Number(ethers.utils.formatEther(rawCollatBalance));
      let expectedResult = ethPrice * collatBalance * 0.7;

      let rawResult = await fusionCore.calculateBorrowLimit(alice.address);
      let result = Number(ethers.utils.formatEther(rawResult));

      //closeTo +- 1 to account for ETH price fluctuations
      expect(result).to.closeTo(expectedResult, 1);
    });

    it("should borrow Base Asset", async () => {
      let rawBorrowLimit = await fusionCore.calculateBorrowLimit(alice.address);
      let borrowLimit = ethers.utils.formatEther(rawBorrowLimit);
      let borrowAmount = ethers.utils.parseEther((borrowLimit / 2).toString());
      let beforeBalance = await mockBaseAsset.balanceOf(alice.address);

      expect(await fusionCore.connect(alice).borrow(borrowAmount)).to.be.ok;

      expect(await fusionCore.isBorrowing(alice.address)).to.eq(true);

      let borrowBalance = await fusionCore.borrowBalance(alice.address);
      expect(borrowBalance).to.eq(borrowAmount);

      let afterBalance = await mockBaseAsset.balanceOf(alice.address);
      expect(afterBalance).to.eq(beforeBalance.add(borrowAmount));
    });

    it("should borrow multiple times", async () => {
      let firstAmount = ethers.utils.parseEther("500");
      let secondAmount = ethers.utils.parseEther("300");

      await fusionCore.connect(alice).borrow(firstAmount);
      expect(await fusionCore.borrowBalance(alice.address)).to.eq(firstAmount);

      await fusionCore.connect(alice).borrow(secondAmount);
      expect(await fusionCore.borrowBalance(alice.address)).to.eq(
        firstAmount.add(secondAmount)
      );
    });

    it("should deduct borrow fees from collateral", async () => {
      let beforeBalance = await fusionCore.collateralBalance(alice.address);
      let expectedResult = beforeBalance - beforeBalance * 0.003;

      await fusionCore.connect(alice).borrow(1);

      let rawAfterBalance = await fusionCore.collateralBalance(alice.address);
      let afterBalance = Number(rawAfterBalance);

      expect(afterBalance).to.eq(expectedResult);
    });

    it("should revert with no ETH collateralized", async () => {
      await expect(fusionCore.connect(bob).borrow(1)).to.be.revertedWith(
        "No ETH collateralized!"
      );
    });

    it("should revert with borrow amount > borrow limit", async () => {
      let borrowAmount = ethers.utils.parseEther("10000");

      await expect(
        fusionCore.connect(alice).borrow(borrowAmount)
      ).to.be.revertedWith("Borrow amount exceeds borrow limit!");
    });
  });

  describe("Repay Base Asset", async () => {
    beforeEach(async () => {
      let collatAmount = ethers.utils.parseEther("1");
      let borrowAmount = ethers.utils.parseEther("700");

      await mockBaseAsset.mint(fusionCore.address, baseAssetAmount);
      await fusionCore.connect(bob).collateralize({ value: collatAmount });
      await fusionCore.connect(bob).borrow(borrowAmount);
      await mockBaseAsset
        .connect(bob)
        .approve(fusionCore.address, baseAssetAmount);
    });

    it("should repay amount", async () => {
      let repayAmount = ethers.utils.parseEther("500");
      let beforeBalance = await mockBaseAsset.balanceOf(fusionCore.address);

      expect(await fusionCore.connect(bob).repay(repayAmount)).to.be.ok;

      expect(await fusionCore.isBorrowing(bob.address)).to.eq(true);
      expect(await fusionCore.borrowBalance(bob.address)).to.eq(
        ethers.utils.parseEther("200")
      );

      let afterBalance = await mockBaseAsset.balanceOf(fusionCore.address);
      expect(afterBalance).to.eq(beforeBalance.add(repayAmount));
    });

    it("should repay multiple times", async () => {
      let firstAmount = ethers.utils.parseEther("200");
      let secondAmount = ethers.utils.parseEther("300");

      await fusionCore.connect(bob).repay(firstAmount);
      expect(await fusionCore.borrowBalance(bob.address)).to.eq(
        ethers.utils.parseEther("500")
      );

      await fusionCore.connect(bob).repay(secondAmount);
      expect(await fusionCore.borrowBalance(bob.address)).to.eq(
        ethers.utils.parseEther("200")
      );
    });

    it("shoud repay full amount", async () => {
      let repayAmount = ethers.utils.parseEther("700");

      await fusionCore.connect(bob).repay(repayAmount);

      expect(await fusionCore.isBorrowing(bob.address)).to.eq(false);
      expect(await fusionCore.borrowBalance(bob.address)).to.eq(0);
    });

    it("should revert with insufficient funds", async () => {
      let balance = await mockBaseAsset.balanceOf(bob.address);
      await mockBaseAsset.connect(bob).transfer(alice.address, balance);

      await expect(fusionCore.connect(bob).repay(1)).to.be.revertedWith(
        "Insufficient funds!"
      );
    });

    it("should revert with can't repay 0 or more that borrowed", async () => {
      let repayAmount = ethers.utils.parseEther("800");

      await expect(
        fusionCore.connect(bob).repay(repayAmount)
      ).to.be.revertedWith(
        "Can't repay amount: 0 or more than amount borrowed!"
      );

      await expect(fusionCore.connect(bob).repay(0)).to.be.revertedWith(
        "Can't repay amount: 0 or more than amount borrowed!"
      );
    });
  });

  describe("Liquidate", async () => {
    beforeEach(async () => {
      let collatAmount = ethers.utils.parseEther("1");
      let borrowAmount = ethers.utils.parseEther("700");

      await mockBaseAsset.mint(fusionCore.address, baseAssetAmount);
      await mockBaseAsset.mint(mockCore.address, baseAssetAmount);
      await fusionCore.connect(alice).collateralize({ value: collatAmount });
      await fusionCore.connect(alice).borrow(borrowAmount);
      await mockCore.connect(alice).collateralize({ value: collatAmount });
      await mockCore.connect(alice).borrow(borrowAmount);
    });

    it("should return liquidation point", async () => {
      let rawBorrowBalance = await fusionCore.borrowBalance(alice.address);
      let borrowBalance = Number(rawBorrowBalance);
      let expectedResult = borrowBalance + borrowBalance * 0.1;

      let rawResult = await fusionCore.calculateLiquidationPoint(alice.address);
      expect(Number(rawResult)).to.eq(expectedResult);
    });

    it("should liquidate position", async () => {
      let rawBeforeBalance = await provider.getBalance(bob.address);
      let beforeBalance = Number(ethers.utils.formatEther(rawBeforeBalance));
      let rawCollatBalance = await mockCore.collateralBalance(alice.address);
      let collatBalance = Number(ethers.utils.formatEther(rawCollatBalance));
      let expectedResult = beforeBalance + collatBalance * 0.0125;

      expect(await mockCore.connect(bob).liquidate(alice.address)).to.be.ok;

      expect(await mockCore.collateralBalance(alice.address)).to.eq(0);
      expect(await mockCore.borrowBalance(alice.address)).to.eq(0);
      expect(await mockCore.isBorrowing(alice.address)).to.eq(false);

      let rawAfterBalance = await provider.getBalance(bob.address);
      let afterBalance = Number(ethers.utils.formatEther(rawAfterBalance));

      expect(afterBalance).to.closeTo(expectedResult, 0.0001);
    });

    it("should revert with position can't be liquidated", async () => {
      await expect(
        fusionCore.connect(bob).liquidate(alice.address)
      ).to.be.revertedWith("Position can't be liquidated!");
    });
  });
});
