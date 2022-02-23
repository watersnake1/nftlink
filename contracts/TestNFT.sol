pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TestNFT is ERC721 {

 constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
 }

 function setupTestTokens(uint i) public returns (bool) {
   _mint(msg.sender, i);
   return true;
 }


} 
