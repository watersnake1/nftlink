pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Ltoken is ERC721, Ownable {
  using SafeMath for uint;
  // track the deposits
  struct depositedNFT {
    address owner;
    address tokenContract;
    uint tokenId;
    uint internalTokenId;
  }
  depositedNFT currentDeposit;

  // address of this contrat 
  address public a;
  // the current id
  uint private _currentTokenId;

  // total number of deposits per user
  mapping (address => uint) public totalDeposits;
  // an unordered list of all deposits
  mapping (uint => depositedNFT) private _allDeposits; 

  // da linky listy stuff down here
  struct listItem {
    bytes32 next;
    uint internalTokenId;
  }

  // track a user's lists entries
  mapping (address => mapping (bytes32 => listItem)) public userItems;
  mapping (address => uint) public lengths;
  mapping (address => bytes32) public heads;

  constructor() ERC721("Linked List Repo", "LLR") {
  }

  //ll functions
  function addLinkedListEntry(uint _internalTokenId) public returns (bool) {
    //need to first create a head in case the user hasn't started their list
    listItem memory itm = listItem(heads[msg.sender],_internalTokenId);   
    bytes32 id = keccak256(abi.encodePacked(itm.internalTokenId,block.timestamp,lengths[msg.sender]));
    userItems[msg.sender][id] = itm;
    heads[msg.sender] = id;
    lengths[msg.sender] = lengths[msg.sender].add(1);
  }
  // get the token id associated with this entry
  function getEntry(bytes32 _id) public returns (bytes32, uint) {
    return (userItems[msg.sender][_id].next,userItems[msg.sender][_id].internalTokenId);
  }
  // get the tip of the list
  function getHead(address _sender) private returns (bytes32) {
    return heads[_sender];
  }
  // traverse the list
  function traverseUntil(uint _stop) public returns (uint) {
    require(_stop < lengths[msg.sender], "Stopping point beyond maximum length");
    bytes32 head = getHead(msg.sender);
    uint point = 0;
    //begin traversal
    uint internalId = 0;
    while (point < _stop) {
      (head,internalId) = getEntry(head);
      point = point.add(1);
    }
    return internalId;
  } 

      

    

  // set the address of the smart contract
  function setAddress(address _a) onlyOwner public returns (bool) {
    a = _a;
    _currentTokenId = 0;
    return true;
  }

  // get the next token id. private info
  function _getNextId() private returns (uint) {
    uint cti = _currentTokenId;
    _currentTokenId.add(1);
    return cti;
  }

  function createDeposit(address _deployedAddress, address _tokenContract, uint _tokenId) public returns (bool) {
    // transfer the NFT to the vault, (explore the return types and what they should be here)
    IERC721(_tokenContract).approve(_deployedAddress, _tokenId);
    IERC721(_tokenContract).transferFrom(msg.sender, _deployedAddress, _tokenId);
    //(bool success, bytes memory data) = _tokenContract.delegatecall(abi.encodeWithSignature("transferFrom(address, address, uint256)", msg.sender,a,_tokenId)); 
    //require(success, "transfer failed");
    // should we check the balance here just to be safe?
    // track total deposits
    totalDeposits[msg.sender].add(1);
    // need to mint a tracker here?
    uint next = _getNextId();
    currentDeposit = depositedNFT(msg.sender, _tokenContract, _tokenId, next);
    _mint(msg.sender,next); 
    _allDeposits[next] = currentDeposit;
    return true;  
  } 

  // check if the sender is the owner of what they deposit 
  function isDepositOwner(uint _id) public returns (bool) {
    require(ownerOf(_id) == msg.sender, "You are not the owner!");
    require(_allDeposits[_id].internalTokenId == _id, "Token data incorrect");
    return true;
  }

  // get the required info back to read data about the original nft  
  function getTokenById(uint _internalId) public returns (address, address, uint, uint) {
    depositedNFT memory dnft = _allDeposits[_internalId];
    return (dnft.owner, dnft.tokenContract, dnft.tokenId, dnft.internalTokenId);
  }

    
  } 



