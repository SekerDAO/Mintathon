import { expect } from "chai";
import hre, { deployments, waffle, ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers";

const ZeroState =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
const ZeroAddress = "0x0000000000000000000000000000000000000000";
const FirstAddress = "0x0000000000000000000000000000000000000001";
const etherValue = ethers.utils.parseEther("0.01");
const etherValueLow = ethers.utils.parseEther("0.009");
const etherValueHigh = ethers.utils.parseEther("0.011");

describe("MintathonPayable", async () => {
  const baseSetup = deployments.createFixture(async () => {
    await deployments.fixture();

    const Mintathon001 = await hre.ethers.getContractFactory("MintathonPayable");
    const mintathon = await Mintathon001.deploy();

    return { Mintathon001, mintathon };
  });

  const [user1, user2] = waffle.provider.getWallets();

  describe("NFT", async () => {
    it("can't mint more than free amount", async () => {
      const { mintathon } = await baseSetup();
      await mintathon.mint();
      await mintathon.mint();
      await mintathon.mint();
      await expect(mintathon.mint({value: etherValueLow})).to.be.revertedWith("Incorrect eth amount")
      await expect(mintathon.mint({value: etherValueHigh})).to.be.revertedWith("Incorrect eth amount")
      mintathon.mint({value: etherValue})
    });

    it("can update price", async () => {
      const { mintathon } = await baseSetup();
      await expect(mintathon.connect(user2).updatePrice(1)).to.be.revertedWith("Ownable: caller is not the owner")
      const etherValueUpdated = ethers.utils.parseEther("0.02");
      mintathon.updatePrice(etherValueUpdated);
      let test = await mintathon.price()
      expect(test).to.equal(etherValueUpdated);
    });

    it("can update free mints", async () => {
      const { mintathon } = await baseSetup();
      await expect(mintathon.connect(user2).updateMaxFreeMints(1)).to.be.revertedWith("Ownable: caller is not the owner")
      mintathon.updateMaxFreeMints(1);
      let free = await mintathon.maxFreeMints()
      expect(free).to.equal(1);
      await mintathon.mint();
      await expect(mintathon.mint()).to.be.revertedWith("Incorrect eth amount")
    });

    it("owner can withdraw", async () => {
      const { mintathon } = await baseSetup();
      const provider = waffle.provider;
      await mintathon.mint();
      await mintathon.mint();
      await mintathon.mint();
      await mintathon.mint({value: etherValue})
      let bal = await provider.getBalance(user1.address)
      let balContract = await provider.getBalance(mintathon.address)
      expect(balContract).to.equal(etherValue);
      expect(bal).to.equal("9999975891032129345645");
      await mintathon.withdraw(user1.address)
      bal = await provider.getBalance(user1.address)
      balContract = await provider.getBalance(mintathon.address)
      expect(balContract).to.equal(0);
      expect(bal).to.equal("9999985846443612601533");
    });

    it("owner can withdraw to other acc", async () => {
      const { mintathon } = await baseSetup();
      const provider = waffle.provider;
      await mintathon.mint();
      await mintathon.mint();
      await mintathon.mint();
      await mintathon.mint({value: etherValue})
      let bal = await provider.getBalance(user2.address)
      let balContract = await provider.getBalance(mintathon.address)
      expect(balContract).to.equal(etherValue);
      expect(bal).to.equal("10000000000000000000000");
      await mintathon.withdraw(user2.address)
      bal = await provider.getBalance(user2.address)
      balContract = await provider.getBalance(mintathon.address)
      expect(balContract).to.equal(0);
      expect(bal).to.equal("10000010000000000000000");
    });

    it("only owner can withdraw", async () => {
      const { mintathon } = await baseSetup();
      const provider = waffle.provider;
      await mintathon.mint();
      await mintathon.mint();
      await mintathon.mint();
      await mintathon.mint({value: etherValue})
      //await expect(mintathon.withdraw(user2.address)).to.be.revertedWith("can only withdraw to the owner");
      await expect(mintathon.connect(user2).withdraw(user2.address)).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
