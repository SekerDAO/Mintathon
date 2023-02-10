// import { expect } from "chai";
// import hre, { deployments, waffle, ethers } from "hardhat";
// import "@nomiclabs/hardhat-ethers";

// const ZeroState =
//   "0x0000000000000000000000000000000000000000000000000000000000000000";
// const ZeroAddress = "0x0000000000000000000000000000000000000000";
// const FirstAddress = "0x0000000000000000000000000000000000000001";
// const etherValue = ethers.utils.parseEther("0.15");
// const etherValueBatch = ethers.utils.parseEther("1");
// const etherValueBatchHigh = ethers.utils.parseEther("1.2");
// const etherValueLow = ethers.utils.parseEther("0.19");

// describe("ClearanceCard001", async () => {
//   const baseSetup = deployments.createFixture(async () => {
//     await deployments.fixture();

//     const ClearCard = await hre.ethers.getContractFactory("ClearanceCard001");
//     const clearanceCard = await ClearCard.deploy();

//     return { ClearCard, clearanceCard };
//   });

//   const [user1, user2] = waffle.provider.getWallets();

//   describe("NFT", async () => {
//     it("should mint NFT with correct URI", async () => {
//       const { clearanceCard } = await baseSetup();
//       await clearanceCard.mint(1, {value: etherValue})
//       const uri = await clearanceCard.tokenURI(0);
//       expect(uri).to.equal("data:application/json;base64,eyJuYW1lIjoiU2VrZXIgRmFjdG9yeSAwMDEgLSBEQU8gTWVtYmVyIiwiZGVzY3JpcHRpb24iOiJNZW1iZXJzaGlwIHRvIHRoZSBTZWtlciBGYWN0b3J5IDAwMSBEQU8uIEhvbGRpbmcgdGhpcyBjYXJkIHNlY3VyZXMgeW91ciBtZW1iZXJzaGlwIHN0YXR1cyBhbmQgb2ZmZXJzIHZvdGluZyByaWdodHMgb24gY2VydGFpbiBwcm9wb3NhbHMgcmVsYXRlZCB0byB0aGUgMDAxIExvcyBBbmdlbGVzIEZhY3RvcnkuIExldmVsIHVwIHRoaXMgY2FyZCB0byByZWNlaXZlIG1vcmUgcGVya3MgYW5kIGdvdmVybmFuY2UgcmlnaHRzIHdpdGhpbiB0aGUgMDAxIERBTy4iLCJhdHRyaWJ1dGVzIjogW3sidHJhaXRfdHlwZSI6IkxldmVsIiwidmFsdWUiOiIwIn0seyJ0cmFpdF90eXBlIjoiTWVtYmVyc2hpcCBOdW1iZXIiLCJ2YWx1ZSI6IjAvMTAwMCJ9XSwiaW1hZ2UiOiJodHRwczovL3Nla2VyZmFjdG9yeS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtVWt1eXh5TFI5VXNraWhCY0tCcGt4SFY1UHV6bXVDTndwMWpQdHk4MTFQd1EiLCJhbmltYXRpb25fdXJsIjoiaHR0cHM6Ly9zZWtlcmZhY3RvcnkubXlwaW5hdGEuY2xvdWQvaXBmcy9RbVVrdXl4eUxSOVVza2loQmNLQnBreEhWNVB1em11Q053cDFqUHR5ODExUHdRIn0=");
//     });

//     it("can't mint if value too low", async () => {
//       const { clearanceCard } = await baseSetup();
//       await expect(clearanceCard.mint(1, {value: etherValueLow})).to.be.revertedWith("ncorrect eth amount")
//     });

//     it("can mint batch", async () => {
//       const { clearanceCard } = await baseSetup();
//       await clearanceCard.mint(5, {value: etherValueBatch})
//       const balance = await clearanceCard.balanceOf(user1.address);
//       expect(balance).to.equal(5);
//     });

//     it("can't mint batch of more than 5", async () => {
//       const { clearanceCard } = await baseSetup();
//       await expect(clearanceCard.mint(6, {value: etherValueBatchHigh})).to.be.revertedWith("can only mint 5 at a time");
//     });

//     it.only("owner can level up card with correct URI", async () => {
//       const { clearanceCard } = await baseSetup();
//       await clearanceCard.mint(1, {value: etherValue})
//       await clearanceCard.levelUpCard(0, 1);
//       let level = await clearanceCard.cardLevels(0);
//       expect(level).to.equal(1);
//       let uri = await clearanceCard.tokenURI(0);
//       expect(uri).to.equal("data:application/json;base64,eyJuYW1lIjoiU2VrZXIgRmFjdG9yeSAwMDEgLSBEQU8gTWVtYmVyIiwiZGVzY3JpcHRpb24iOiJNZW1iZXJzaGlwIHRvIHRoZSBTZWtlciBGYWN0b3J5IDAwMSBEQU8uIEhvbGRpbmcgdGhpcyBjYXJkIHNlY3VyZXMgeW91ciBtZW1iZXJzaGlwIHN0YXR1cyBhbmQgb2ZmZXJzIHZvdGluZyByaWdodHMgb24gY2VydGFpbiBwcm9wb3NhbHMgcmVsYXRlZCB0byB0aGUgMDAxIExvcyBBbmdlbGVzIEZhY3RvcnkuIExldmVsIHVwIHRoaXMgY2FyZCB0byByZWNlaXZlIG1vcmUgcGVya3MgYW5kIGdvdmVybmFuY2UgcmlnaHRzIHdpdGhpbiB0aGUgMDAxIERBTy4iLCJhdHRyaWJ1dGVzIjogW3sidHJhaXRfdHlwZSI6IkxldmVsIiwidmFsdWUiOiIxIn0seyJ0cmFpdF90eXBlIjoiTWVtYmVyc2hpcCBOdW1iZXIiLCJ2YWx1ZSI6IjAvMTAwMCJ9XSwiaW1hZ2UiOiJodHRwczovL3Nla2VyZmFjdG9yeS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtZlFGVDY3cmVXemQ5REtvaHRtQzhFZmRuclFGRW03TjRjSFNDWVQ5c0h1WkMiLCJhbmltYXRpb25fdXJsIjoiaHR0cHM6Ly9zZWtlcmZhY3RvcnkubXlwaW5hdGEuY2xvdWQvaXBmcy9RbWZRRlQ2N3JlV3pkOURLb2h0bUM4RWZkbnJRRkVtN040Y0hTQ1lUOXNIdVpDIn0=");
//       await clearanceCard.levelUpCard(0, 1);
//       level = await clearanceCard.cardLevels(0);
//       expect(level).to.equal(2);
//       uri = await clearanceCard.tokenURI(0);
//       expect(uri).to.equal("data:application/json;base64,eyJuYW1lIjoiU2VrZXIgRmFjdG9yeSAwMDEgLSBEQU8gTWVtYmVyIiwiZGVzY3JpcHRpb24iOiJNZW1iZXJzaGlwIHRvIHRoZSBTZWtlciBGYWN0b3J5IDAwMSBEQU8uIEhvbGRpbmcgdGhpcyBjYXJkIHNlY3VyZXMgeW91ciBtZW1iZXJzaGlwIHN0YXR1cyBhbmQgb2ZmZXJzIHZvdGluZyByaWdodHMgb24gY2VydGFpbiBwcm9wb3NhbHMgcmVsYXRlZCB0byB0aGUgMDAxIExvcyBBbmdlbGVzIEZhY3RvcnkuIExldmVsIHVwIHRoaXMgY2FyZCB0byByZWNlaXZlIG1vcmUgcGVya3MgYW5kIGdvdmVybmFuY2UgcmlnaHRzIHdpdGhpbiB0aGUgMDAxIERBTy4iLCJhdHRyaWJ1dGVzIjogW3sidHJhaXRfdHlwZSI6IkxldmVsIiwidmFsdWUiOiIyIn0seyJ0cmFpdF90eXBlIjoiTWVtYmVyc2hpcCBOdW1iZXIiLCJ2YWx1ZSI6IjAvMTAwMCJ9XSwiaW1hZ2UiOiJodHRwczovL3Nla2VyZmFjdG9yeS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtUUZIV0pIRmpZTW9ndGk0WEVxOUJBTGJ1b3Nqa2RYVEs1akd5a2RDS29IVXQiLCJhbmltYXRpb25fdXJsIjoiaHR0cHM6Ly9zZWtlcmZhY3RvcnkubXlwaW5hdGEuY2xvdWQvaXBmcy9RbVFGSFdKSEZqWU1vZ3RpNFhFcTlCQUxidW9zamtkWFRLNWpHeWtkQ0tvSFV0In0=");
//       await clearanceCard.levelUpCard(0, 1);
//       level = await clearanceCard.cardLevels(0);
//       expect(level).to.equal(3);
//       uri = await clearanceCard.tokenURI(0);
//       expect(uri).to.equal("data:application/json;base64,eyJuYW1lIjoiU2VrZXIgRmFjdG9yeSBDbGVhcmFuY2UgQ2FyZCAwMDEiLCJkZXNjcmlwdGlvbiI6Ik1lbWJlcnNoaXAgdG8gdGhlIFNla2VyIEZhY3RvcnkgMDAxIERBTy4iLCJhdHRyaWJ1dGVzIjogW3sidHJhaXRfdHlwZSI6IkxldmVsIiwidmFsdWUiOiIzIn1dLCJpbWFnZSI6Imh0dHBzOi8vc2VrZXJmYWN0b3J5Lm15cGluYXRhLmNsb3VkL2lwZnMvUW1TVEMyZ1RpcHVXVFBCeER2RVJaeXAxQXhvaTd2Z1dQbnJDWDV5ckh4VG1LcCJ9");    
//       await clearanceCard.levelUpCard(0, 1);
//       level = await clearanceCard.cardLevels(0);
//       expect(level).to.equal(4);
//       uri = await clearanceCard.tokenURI(0);
//       expect(uri).to.equal("data:application/json;base64,eyJuYW1lIjoiU2VrZXIgRmFjdG9yeSBDbGVhcmFuY2UgQ2FyZCAwMDEiLCJkZXNjcmlwdGlvbiI6Ik1lbWJlcnNoaXAgdG8gdGhlIFNla2VyIEZhY3RvcnkgMDAxIERBTy4iLCJhdHRyaWJ1dGVzIjogW3sidHJhaXRfdHlwZSI6IkxldmVsIiwidmFsdWUiOiI0In1dLCJpbWFnZSI6Imh0dHBzOi8vc2VrZXJmYWN0b3J5Lm15cGluYXRhLmNsb3VkL2lwZnMvUW1VMVhXSHdTTXg5NWRZVHlZeHg2SmFVMWk4MVREemNXRkdZRllOVTJCMVFWSCJ9");    
//       await clearanceCard.levelUpCard(0, 1);
//       level = await clearanceCard.cardLevels(0);
//       expect(level).to.equal(5);
//       uri = await clearanceCard.tokenURI(0);
//       expect(uri).to.equal("data:application/json;base64,eyJuYW1lIjoiU2VrZXIgRmFjdG9yeSBDbGVhcmFuY2UgQ2FyZCAwMDEiLCJkZXNjcmlwdGlvbiI6Ik1lbWJlcnNoaXAgdG8gdGhlIFNla2VyIEZhY3RvcnkgMDAxIERBTy4iLCJhdHRyaWJ1dGVzIjogW3sidHJhaXRfdHlwZSI6IkxldmVsIiwidmFsdWUiOiI1In1dLCJpbWFnZSI6Imh0dHBzOi8vc2VrZXJmYWN0b3J5Lm15cGluYXRhLmNsb3VkL2lwZnMvUW1UUG1FQk5KVFZmRGtBSzdlREVaY2VxWHpRMzdjbzNRTTFFc3NaS2ExeGRpQiJ9");    
//       await clearanceCard.levelUpCard(0, 1);
//       level = await clearanceCard.cardLevels(0);
//       expect(level).to.equal(6);
//       uri = await clearanceCard.tokenURI(0);
//       expect(uri).to.equal("data:application/json;base64,eyJuYW1lIjoiU2VrZXIgRmFjdG9yeSBDbGVhcmFuY2UgQ2FyZCAwMDEiLCJkZXNjcmlwdGlvbiI6Ik1lbWJlcnNoaXAgdG8gdGhlIFNla2VyIEZhY3RvcnkgMDAxIERBTy4iLCJhdHRyaWJ1dGVzIjogW3sidHJhaXRfdHlwZSI6IkxldmVsIiwidmFsdWUiOiI2In1dLCJpbWFnZSI6Imh0dHBzOi8vc2VrZXJmYWN0b3J5Lm15cGluYXRhLmNsb3VkL2lwZnMvUW1XaWk2VGRtVkpBaWM1YjVxZVVyMnVYRGJkNWl6ZEFEOEVZazkzODJFdzdjQiJ9");     
//       await clearanceCard.levelUpCard(0, 1);
//       level = await clearanceCard.cardLevels(0);
//       expect(level).to.equal(7);
//       uri = await clearanceCard.tokenURI(0);
//       expect(uri).to.equal("data:application/json;base64,eyJuYW1lIjoiU2VrZXIgRmFjdG9yeSBDbGVhcmFuY2UgQ2FyZCAwMDEiLCJkZXNjcmlwdGlvbiI6Ik1lbWJlcnNoaXAgdG8gdGhlIFNla2VyIEZhY3RvcnkgMDAxIERBTy4iLCJhdHRyaWJ1dGVzIjogW3sidHJhaXRfdHlwZSI6IkxldmVsIiwidmFsdWUiOiI3In1dLCJpbWFnZSI6Imh0dHBzOi8vc2VrZXJmYWN0b3J5Lm15cGluYXRhLmNsb3VkL2lwZnMvUW1OWUtUR3hlTVdvNjRLVDh5elh6WkxoTVMyRlI1ZEdRdEx4a2trVEhBSmFnaSJ9");    
//       await clearanceCard.levelUpCard(0, 1);
//       level = await clearanceCard.cardLevels(0);
//       expect(level).to.equal(8);
//       uri = await clearanceCard.tokenURI(0);
//       expect(uri).to.equal("data:application/json;base64,eyJuYW1lIjoiU2VrZXIgRmFjdG9yeSBDbGVhcmFuY2UgQ2FyZCAwMDEiLCJkZXNjcmlwdGlvbiI6Ik1lbWJlcnNoaXAgdG8gdGhlIFNla2VyIEZhY3RvcnkgMDAxIERBTy4iLCJhdHRyaWJ1dGVzIjogW3sidHJhaXRfdHlwZSI6IkxldmVsIiwidmFsdWUiOiI4In1dLCJpbWFnZSI6Imh0dHBzOi8vc2VrZXJmYWN0b3J5Lm15cGluYXRhLmNsb3VkL2lwZnMvUW1lZ0ZoYUV3cGlvS2J1R1ZvM2NiUUd2b2M2RmF1TWFLeWN6RkVmWHF0V0F5aiJ9");    
//       await clearanceCard.levelUpCard(0, 1);
//       level = await clearanceCard.cardLevels(0);
//       expect(level).to.equal(9);
//       uri = await clearanceCard.tokenURI(0);
//       expect(uri).to.equal("data:application/json;base64,eyJuYW1lIjoiU2VrZXIgRmFjdG9yeSBDbGVhcmFuY2UgQ2FyZCAwMDEiLCJkZXNjcmlwdGlvbiI6Ik1lbWJlcnNoaXAgdG8gdGhlIFNla2VyIEZhY3RvcnkgMDAxIERBTy4iLCJhdHRyaWJ1dGVzIjogW3sidHJhaXRfdHlwZSI6IkxldmVsIiwidmFsdWUiOiI5In1dLCJpbWFnZSI6Imh0dHBzOi8vc2VrZXJmYWN0b3J5Lm15cGluYXRhLmNsb3VkL2lwZnMvUW1Ya2FON0R1WFNGMlgyaEdGN3RTRXlUbkR5TW9DaU1tdnFMcHZqaDFaU0dFViJ9");
//       await clearanceCard.levelUpCard(0, 1);
//       level = await clearanceCard.cardLevels(0);
//       expect(level).to.equal(10);
//       uri = await clearanceCard.tokenURI(0);
//       expect(uri).to.equal("data:application/json;base64,eyJuYW1lIjoiU2VrZXIgRmFjdG9yeSBDbGVhcmFuY2UgQ2FyZCAwMDEiLCJkZXNjcmlwdGlvbiI6Ik1lbWJlcnNoaXAgdG8gdGhlIFNla2VyIEZhY3RvcnkgMDAxIERBTy4iLCJhdHRyaWJ1dGVzIjogW3sidHJhaXRfdHlwZSI6IkxldmVsIiwidmFsdWUiOiIxMCJ9XSwiaW1hZ2UiOiJodHRwczovL3Nla2VyZmFjdG9yeS5teXBpbmF0YS5jbG91ZC9pcGZzL1FtUjZ3UldIOU4zc05odXJvQkdGWk1SMzdHNE1FODVxMjV0VFlaZnZhejNSeE0ifQ==");    
//     });

//     it("owner can level up card batch", async () => {
//       const { clearanceCard } = await baseSetup();
//       await clearanceCard.mint(5, {value: etherValueBatch})
//       await clearanceCard.levelUpCardBatch([0,1,2,3,4], [1,1,1,1,1]);
//       let level = await clearanceCard.cardLevels(0);
//       expect(level).to.equal(1);
//       level = await clearanceCard.cardLevels(1);
//       expect(level).to.equal(1);
//       level = await clearanceCard.cardLevels(2);
//       expect(level).to.equal(1);
//       level = await clearanceCard.cardLevels(3);
//       expect(level).to.equal(1);
//       level = await clearanceCard.cardLevels(4);
//       expect(level).to.equal(1);
//     });

//     it("only owner can level up card", async () => {
//       const { clearanceCard } = await baseSetup();
//       await clearanceCard.connect(user2).mint(1, {value: etherValue})
//       await expect(clearanceCard.connect(user2).levelUpCard(0, 1)).to.be.revertedWith("Ownable: caller is not the owner");
//     });

//     it("owner can mint cards from reserve", async () => {
//       const { clearanceCard } = await baseSetup();
//       await clearanceCard.mintDAO(200);
//     });

//     it("only owner can mint cards from reserve", async () => {
//       const { clearanceCard } = await baseSetup();
//       await expect(clearanceCard.connect(user2).mintDAO(1)).to.be.revertedWith("Ownable: caller is not the owner");
//     });

//     it("can't level up card past 10", async () => {
//       const { clearanceCard } = await baseSetup();
//       await clearanceCard.mint(1, {value: etherValueBatch})
//       await clearanceCard.levelUpCard(0, 10);
//       let level = await clearanceCard.cardLevels(0);
//       expect(level).to.equal(10);
//       await expect(clearanceCard.levelUpCard(0, 1)).to.be.revertedWith("max level is 10");
//     });

//     it("owner can level down card", async () => {
//       const { clearanceCard } = await baseSetup();
//       await clearanceCard.mint(1, {value: etherValueBatch})
//       await clearanceCard.levelUpCard(0, 10);
//       await clearanceCard.levelDownCard(0, 3);
//       let level = await clearanceCard.cardLevels(0);
//       expect(level).to.equal(7);
//     });

//     it("owner can level down card batch", async () => {
//       const { clearanceCard } = await baseSetup();
//       await clearanceCard.mint(5, {value: etherValueBatch})
//       await clearanceCard.levelUpCardBatch([0,1,2,3,4], [1,1,1,1,1]);
//       let level = await clearanceCard.cardLevels(0);
//       expect(level).to.equal(1);
//       level = await clearanceCard.cardLevels(1);
//       expect(level).to.equal(1);
//       level = await clearanceCard.cardLevels(2);
//       expect(level).to.equal(1);
//       level = await clearanceCard.cardLevels(3);
//       expect(level).to.equal(1);
//       level = await clearanceCard.cardLevels(4);
//       expect(level).to.equal(1);
//       await clearanceCard.levelDownCardBatch([0,1,2,3,4], [1,1,1,1,1]);
//       level = await clearanceCard.cardLevels(0);
//       expect(level).to.equal(0);
//       level = await clearanceCard.cardLevels(1);
//       expect(level).to.equal(0);
//       level = await clearanceCard.cardLevels(2);
//       expect(level).to.equal(0);
//       level = await clearanceCard.cardLevels(3);
//       expect(level).to.equal(0);
//       level = await clearanceCard.cardLevels(4);
//       expect(level).to.equal(0);
//     });

//     it.skip("can't level down card past 0", async () => {
//       const { clearanceCard } = await baseSetup();
//       await clearanceCard.mint(1, {value: etherValueBatch})
//       await clearanceCard.levelUpCard(0, 10);
//       await clearanceCard.levelDownCard(0, 11);
//       let level = await clearanceCard.cardLevels(0);
//       expect(level).to.equal(9);
//     });

//     it("only owner can level down card", async () => {
//       const { clearanceCard } = await baseSetup();
//       await clearanceCard.mint(1, {value: etherValueBatch})
//       await clearanceCard.levelUpCard(0, 10);
//       await expect(clearanceCard.connect(user2).levelDownCard(0, 1)).to.be.revertedWith("Ownable: caller is not the owner");
//     });

//     it("resets level to 0 on transfer", async () => {
//       const { clearanceCard } = await baseSetup();
//       await clearanceCard.mint(1, {value: etherValueBatch})
//       await clearanceCard.levelUpCard(0, 1);
//       let level = await clearanceCard.cardLevels(0);
//       expect(level).to.equal(1);
//       await clearanceCard.transferFrom(user1.address, user2.address, 0)
//       level = await clearanceCard.cardLevels(0);
//       expect(level).to.equal(0);
//     });

//     it("owner can withdraw", async () => {
//       const { clearanceCard } = await baseSetup();
//       const provider = waffle.provider;
//       await clearanceCard.mint(1, {value: etherValue})
//       let bal = await provider.getBalance(user1.address)
//       let balContract = await provider.getBalance(clearanceCard.address)
//       expect(balContract).to.equal(etherValue);
//       expect(bal).to.equal("9999771806505760915021");
//       await clearanceCard.withdraw(user1.address)
//       bal = await provider.getBalance(user1.address)
//       balContract = await provider.getBalance(clearanceCard.address)
//       expect(balContract).to.equal(0);
//       expect(bal).to.equal("9999971759539273283595");
//     });

//     it("only owner can withdraw", async () => {
//       const { clearanceCard } = await baseSetup();
//       const provider = waffle.provider;
//       await clearanceCard.mint(1, {value: etherValue})
//       await expect(clearanceCard.connect(user2).withdraw(user2.address)).to.be.revertedWith("Ownable: caller is not the owner");
//     });
//   });
// });
