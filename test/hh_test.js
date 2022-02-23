const { expect } = require("chai");

describe("LinkedList Token", function () {
  // declare initial variables for the senders and contracts
  let LLtoken;
  let hardhatLLtoken;
  let nft1;
  let hardhatnft1;
  let hardhatnft2;
  let addr1;
  let addr2;
  let owner;
  let addrs;
  let mintedOne;
  let mintedTwo;
  let balOne;
  let balTwo;


  // set up some addrs and deploy all three contracts beforeEach
  beforeEach(async function () {
    LLtoken = await ethers.getContractFactory("Ltoken");
    nft1 = await ethers.getContractFactory("TestNFT");
    [owner] = await ethers.getSigners();
    hardhatLLtoken = await LLtoken.deploy();
    hardhatnft1 = await nft1.deploy("NFT1", "NF1");
    hardhatnft2 = await nft1.deploy("NFT2", "NF2");
    mintedOne = await hardhatnft1.setupTestTokens(142);
    mintedTwo = await hardhatnft2.setupTestTokens(87);
    balOne = await hardhatnft1.balanceOf(owner.address);
    balTwo = await hardhatnft2.balanceOf(owner.address);
  });

  // make sure that we can mint an nft out of both contracts
  describe("Full User Flow", function () {
    it("Should mint an NFT for each contract", async function () {
      /*
      var mintedOne = await hardhatnft1.setupTestTokens(142);
      var mintedTwo = await hardhatnft2.setupTestTokens(87);
      var balOne = await hardhatnft1.balanceOf(owner.address);
      var balTwo = await hardhatnft2.balanceOf(owner.address);
      */
      expect(balOne).to.equal(1);
      expect(balTwo).to.equal(1);
    });

    it("should have the same owner for both nft contracts", async function () {
      var hh1 = await hardhatnft1.ownerOf(142);
      var hh2 = await hardhatnft2.ownerOf(87);
      expect(hh1).to.equal(hh2);
      expect(hh1).to.equal(owner.address);
    });

    it("should deposit nfts from both contracts into the linked list contract", async function () {
      var deposit1 = await hardhatLLtoken.createDeposit(hardhatLLtoken.address, hardhatnft1.address, 142);
      var deposit2 = await hardhatLLtoken.createDeposit(hardhatLLtoken.address, hardhatnft2.address, 87);
      var LLBalance1 = await hardhatnft1.balanceOf(hardhatLLtoken.address);
      var LLBalance2 = await hardhatnft2.balanceOf(hardhatLLtoken.address);
      expect(LLBalance1).to.equal(1);
      expect(LLBalance2).to.equal(1);
      //expect(depsoit2).to.equal(true);
    });

  });

});
