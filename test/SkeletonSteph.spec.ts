import { expect } from "chai";
import hre, { deployments, waffle, ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers";

const ZeroState =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
const ZeroAddress = "0x0000000000000000000000000000000000000000";
const FirstAddress = "0x0000000000000000000000000000000000000001";
const etherValue = ethers.utils.parseEther("0.076");
const etherValueBatch = ethers.utils.parseEther("0.228");
const etherValueTwo = ethers.utils.parseEther("0.152");
const etherValueFour = ethers.utils.parseEther("0.304");
const etherValueBatchHigh = ethers.utils.parseEther("1.2");
const etherValueLow = ethers.utils.parseEther("0.075");
const etherValueTotal = ethers.utils.parseEther("159.6");
const etherValueQuarter = ethers.utils.parseEther("39.9");

describe("SkeletonStephGenesis", async () => {
  const baseSetup = deployments.createFixture(async () => {
    await deployments.fixture();

    const Fanboy = await hre.ethers.getContractFactory("FanboyPass");
    const fanboy = await Fanboy.deploy();

    const Genesis = await hre.ethers.getContractFactory("SkeletonStephGenesis");
    const genesis = await Genesis.deploy();

    await genesis.setFanboyPassAddress(fanboy.address);

    return { Genesis, genesis, Fanboy, fanboy };
  });

  const [user1, user2] = waffle.provider.getWallets();

  describe("NFT", async () => {
    it("should mint NFT with correct URI", async () => {
      const { genesis, fanboy } = await baseSetup();
      await fanboy.mint();
      await fanboy.mint();
      await fanboy.mint();
      const fanboyAddress = await genesis.FanboyPass();
      await genesis.allowlistMint(3, [0,1,2], {value: etherValueBatch})
      const owner = await genesis.ownerOf(2);
      console.log(owner);
      console.log(user1.address);
    });

    it("can't mint in presale", async () => {
      const { genesis } = await baseSetup();
      await expect(genesis.mint(1, {value: etherValue})).to.be.revertedWith("public mint has not begun")
    });

    it("can redeem fanboy", async () => {
      const { genesis, fanboy } = await baseSetup();
      await fanboy.mint();
      await genesis.allowlistMint(1, [0], {value: etherValue})
      const owner = await genesis.ownerOf(0)
      await expect(owner).to.equal(user1.address)
    });

    it("can't redeem fanboy value too low", async () => {
      const { genesis, fanboy } = await baseSetup();
      await fanboy.mint();
      await expect(genesis.allowlistMint(1, [0], {value: etherValueLow})).to.be.revertedWith("incorrect eth amount")
    });

    it("can't redeem fanboy value too high", async () => {
      const { genesis, fanboy } = await baseSetup();
      await fanboy.mint();
      await expect(genesis.allowlistMint(1, [0], {value: etherValueBatchHigh})).to.be.revertedWith("incorrect eth amount")
    });

    it("can redeem multiple fanboy", async () => {
      const { genesis, fanboy } = await baseSetup();
      await fanboy.mint();
      await fanboy.mint();
      await fanboy.mint();
      await fanboy.mint();
      await genesis.allowlistMint(4, [0,1,2,3], {value: etherValueFour})
      const balance = await genesis.balanceOf(user1.address)
      await expect(balance).to.equal(4)
    });

    it("can redeem multiple fanboy out of order", async () => {
      const { genesis, fanboy } = await baseSetup();
      await fanboy.mint();
      await fanboy.mint();
      await fanboy.mint();
      await fanboy.mint();
      await genesis.allowlistMint(2, [1,2], {value: etherValueTwo})
      await genesis.allowlistMint(2, [0,3], {value: etherValueTwo})
      const balance = await genesis.balanceOf(user1.address)
      await expect(balance).to.equal(4)
    });

    it("can't redeem fanboy twice", async () => {
      const { genesis, fanboy } = await baseSetup();
      await fanboy.mint();
      await genesis.allowlistMint(1, [0], {value: etherValue})
      const owner = await genesis.ownerOf(0)
      await expect(owner).to.equal(user1.address)
      await expect(genesis.allowlistMint(1, [0], {value: etherValue})).to.be.revertedWith("id has already been claimed")
    });

    it("can't redeem not owned fanboy", async () => {
      const { genesis, fanboy } = await baseSetup();
      await fanboy.connect(user2).mint();
      await expect(genesis.allowlistMint(1, [0], {value: etherValue})).to.be.revertedWith("minter does not own an id")
    });

    it("only owner can set public", async () => {
      const { genesis, fanboy } = await baseSetup();
      await expect(genesis.connect(user2).startPublicMint()).to.be.revertedWith("Ownable: caller is not the owner")
    });

    it("can mint public", async () => {
      const { genesis, fanboy } = await baseSetup();
      await genesis.startPublicMint()
      await genesis.mint(1, {value: etherValue})
      const owner = await genesis.ownerOf(0)
      await expect(owner).to.equal(user1.address)
    });

    it("can't mint if value too low", async () => {
      const { genesis, fanboy } = await baseSetup();
      await genesis.startPublicMint()
      await expect(genesis.mint(1, {value: etherValueLow})).to.be.revertedWith("Incorrect eth amount")
    });

    it("can't mint if value too high", async () => {
      const { genesis, fanboy } = await baseSetup();
      await genesis.startPublicMint()
      await expect(genesis.mint(1, {value: etherValueBatchHigh})).to.be.revertedWith("Incorrect eth amount")
    });

    it("can't redeem after public set", async () => {
      const { genesis, fanboy } = await baseSetup();
      await genesis.startPublicMint()
      await expect(genesis.allowlistMint(1, [0], {value: etherValue})).to.be.revertedWith("presale has ended")
    });

    it("can mint totalSupply", async () => {
      const { genesis, fanboy } = await baseSetup();
      await genesis.startPublicMint()
      await genesis.mint(525, {value: etherValueQuarter})
      await genesis.mint(525, {value: etherValueQuarter})
      await genesis.mint(525, {value: etherValueQuarter})
      await genesis.mint(525, {value: etherValueQuarter})
      const balance = await genesis.balanceOf(user1.address)
      await expect(balance).to.equal(2100)
      await expect(genesis.mint(1, {value: etherValueQuarter})).to.be.revertedWith("minting has reached its max")
      const total = await genesis.totalSupply()
      expect(total).equal(2100)
    });

    it("owner can mint 37 anytime", async () => {
      const { genesis, fanboy } = await baseSetup();
      await genesis.mintSteph(37, {value: 0})
      const ownerSupply = await genesis.balanceOf(user1.address)
      expect(ownerSupply).equal(37)
      await expect(genesis.mintSteph(1, {value: 0})).to.be.revertedWith("steph reserve fully minted")
    });

    it("only owner can mint reserve", async () => {
      const { genesis } = await baseSetup();
      await expect(genesis.connect(user2).mintSteph(1, {value: 0})).to.be.revertedWith("Ownable: caller is not the owner")
    });

    it("only owner can update metadate before burn", async () => {
      const { genesis } = await baseSetup();
      await genesis.updateTokenURI("test")
      const newURI = await genesis.IMGURL()
      expect(newURI).equal("test")
    });

    it("owner cant update metadata after burn", async () => {
      const { genesis } = await baseSetup();
      await genesis.updateTokenURI("test")
      const newURI = await genesis.IMGURL()
      expect(newURI).equal("test")
      await genesis.burnMetadataUpdate()
      await expect(genesis.updateTokenURI("test")).to.be.revertedWith("metadata updates have been burned")
    });

    it("owner can withdraw", async () => {
      const { genesis } = await baseSetup();
      const provider = waffle.provider;
      await genesis.startPublicMint()
      await genesis.mint(1, {value: etherValue})
      let bal = await provider.getBalance(user1.address)
      let balContract = await provider.getBalance(genesis.address)
      expect(balContract).to.equal(etherValue);
      expect(bal).to.equal("9999903756298700299237");
      await genesis.withdraw(user1.address)
      bal = await provider.getBalance(user1.address)
      balContract = await provider.getBalance(genesis.address)
      expect(balContract).to.equal(0);
      expect(bal).to.equal("9999979710924122879093");
    });

    it("only owner can withdraw", async () => {
      const { genesis } = await baseSetup();
      await genesis.startPublicMint()
      const provider = waffle.provider;
      await genesis.mint(1, {value: etherValue})
      await expect(genesis.withdraw(user2.address)).to.be.revertedWith("can only withdraw to the owner");
      await expect(genesis.connect(user2).withdraw(user2.address)).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
