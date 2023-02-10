// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "base64-sol/base64.sol";

contract Mintathon001 is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    string IMGURL = "https://sekerfactory.mypinata.cloud/ipfs/QmedVqgziYhAbYES7n2kmRGJK91JZk2QXb2CYYkso4T1kb";
    bool public canMint = true;
    uint256 public maxFreeMints = 3;
    uint256 public price = 0.01 ether;
    mapping(address => uint256) public minted;

    constructor() ERC721("Seker Factory DAO Mintathon 001", "SFD Mintathon 001") {}

    function mint() public payable {
        require(canMint, "Mintathon 001: Mintathon is over");

        if(minted[msg.sender] >= maxFreeMints) {
            require(msg.value == price, "Incorrect eth amount");
        }

        minted[msg.sender]++;
        uint256 newNFT = _tokenIds.current();
        _safeMint(msg.sender, newNFT);
        _tokenIds.increment();
    }

    function updatePrice(uint256 _newPrice) public onlyOwner {
        price = _newPrice;
    }

    function updateMaxFreeMints(uint256 _newMax) public onlyOwner {
        maxFreeMints = _newMax;
    }

    function updateTokenURI(string memory _newURI) public onlyOwner {
        IMGURL = _newURI;
    }

    function toggleMintathon() public onlyOwner {
        canMint = !canMint;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721URIStorage)
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "Mintathon 001: URI query for nonexistent token"
        );
        return generateCardURI(tokenId);
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    function generateCardURI(uint256 _id) public view returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"Seker Factory DAO Mintathon 001",',
                                '"description":"Commemorates the first Seker Factory DAO live stream on koop.xyz. This mint helped continue the stream and make history as the first ever streaming mintathon in web3.",',
                                '"attributes": ',
                                "[",
                                '{"trait_type":"Mintathon 001 Supporter","value":"',
                                Strings.toString(_id+1),
                                "/",
                                Strings.toString(_tokenIds.current()),
                                '"}',
                                "],",
                                '"image":"',
                                IMGURL,
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    // Withdraw
    function withdraw(address payable withdrawAddress)
        external
        payable
        onlyOwner
    {
        require(
            withdrawAddress != address(0),
            "Withdraw address cannot be zero"
        );
        require(address(this).balance >= 0, "Not enough eth");
        (bool sent, ) = withdrawAddress.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }
}
