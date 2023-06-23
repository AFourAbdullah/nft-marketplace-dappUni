// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
contract Marketplace is ReentrancyGuard{
address  payable public immutable feeAccount;
uint public immutable feePercent;
uint public itemCount;
struct NftItem{
    uint itemId;
    IERC721 nft;
    uint tokenId;
    uint price; 
    address payable seller;
    bool isSold;    
 
    
}
mapping(uint=>NftItem) public Items;

//events
event ItemListed(uint itemId,address indexed nft,uint tokenId,uint price,address indexed seller);
event ItemBought(uint itemId,address indexed nft,uint tokenId,uint price,address indexed seller,address indexed buyer);

constructor(uint _feePercent){
feeAccount=payable(msg.sender);
feePercent=_feePercent;
} 
function listNfts(IERC721 _nft,uint _tokenId,uint _price) external nonReentrant(){
require(_price>0,"Price of nft must be greater than zero!!");
itemCount++;
_nft.transferFrom(msg.sender, address(this), _tokenId);
Items[itemCount]=NftItem(
itemCount,_nft,_tokenId,_price,payable(msg.sender),false
);
emit ItemListed(itemCount ,address(_nft), _tokenId, _price, msg.sender);
}
function purchaseNft(uint _itemId) external payable nonReentrant(){
    uint _totalPrice=getTotalPrice(_itemId);
    NftItem storage nftItem=Items[_itemId];
    require(_itemId>0 && _itemId<=itemCount,"item not found");
    require(msg.value>=_totalPrice ,"not enough eth send");
    require(!nftItem.isSold,"item already sold!");
    nftItem.seller.transfer(nftItem.price);
    feeAccount.transfer(_totalPrice-nftItem.price);
    nftItem.isSold=true;
    nftItem.nft.safeTransferFrom(address(this), msg.sender, nftItem.tokenId);

    //emit event
    emit ItemBought(_itemId, address(nftItem.nft), nftItem.tokenId, nftItem.price, nftItem.seller, msg.sender);

}
function getTotalPrice(uint _itemId) public view returns(uint){
return( (Items[_itemId].price*(100+feePercent))/100);
}
}             