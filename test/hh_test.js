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
      //approve the tokens so the contract can transfer them
      var approveResult1 = await hardhatnft1.connect(owner).approve(hardhatLLtoken.address,142);
      var approveResult2 = await hardhatnft2.connect(owner).approve(hardhatLLtoken.address,87);
      //then make the deposits
      var deposit1 = await hardhatLLtoken.createDeposit(hardhatLLtoken.address, hardhatnft1.address, 142);
      var deposit2 = await hardhatLLtoken.createDeposit(hardhatLLtoken.address, hardhatnft2.address, 87);
      var balanceLL = await hardhatLLtoken.balanceOf(owner.address);
      console.log(balanceLL);
      expect(balanceLL).to.equal(2);
    });

    it("should add nfts to a linked list", async function() {
      var addedOne = await hardhatLLtoken.addLinkedListEntry(0);
      var addedTwo = await hardhatLLtoken.addLinkedListEntry(1);
      await addedOne.wait();
      await addedTwo.wait();
  
      expect(addedOne.value).to.equal(0);
      expect(addedTwo.value).to.equal(0);
    });

    it("should get the current head of the user", async function() {
      var head = await hardhatLLtoken.connect(owner).getHeadString(owner.address);
      await head.wait();
      console.log(head);
      expect(head).to.not.equal(null);
    });

    /*
    it("should traverse the list and get the last item", async function() {
      var lastIdInternal = await hardhatLLtoken.traverseUntil(1);
      var result = await hardhatLLtoken.getTokenById(lastIdInternal);
      //console.log(result);
      expect(lastIdInternal).to.equal(1);
    });
    */


  });

});
