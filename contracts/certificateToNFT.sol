// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract certificateToNFT is ERC721, ERC721URIStorage{
    uint256 private _nextTokenId;
    address private institute;

    mapping(address => uint256) private addressTotokenId;

    mapping(address => bool) public isCertificateNFTAlreadyExists;

    modifier onlyInstiute() {
      require(msg.sender == institute, "Permisson Denied");
      _;
    }

    constructor(address _institute, string memory name, string memory symbol)
        ERC721(name, symbol){
           institute = _institute;
        }

    function safeMint(address _studentAddress, string memory ipfs_hash) external onlyInstiute {

        require(!isCertificateNFTAlreadyExists[_studentAddress], "Student Certificate NFT Already Exists");

        uint256 tokenId = _nextTokenId++;
        _safeMint(_studentAddress, tokenId);
        _setTokenURI(tokenId, ipfs_hash);

        addressTotokenId[_studentAddress] = tokenId;

        isCertificateNFTAlreadyExists[_studentAddress] = true;

    }

    function getIpfsHash(address _studentAddress) public view returns (string memory ipfs_hash , address student){
         require(isCertificateNFTAlreadyExists[_studentAddress], "Student Certificate NFT not Issued");
         uint256 tokenId = addressTotokenId[_studentAddress];
         string memory ipfsHash = tokenURI(tokenId);
         return (ipfsHash,_studentAddress);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }



    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
