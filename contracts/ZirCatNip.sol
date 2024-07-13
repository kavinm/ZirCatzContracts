// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "./ZirCats.sol";

contract ZirCatNip is Ownable {
    uint256 public constant protocolFeePercent = 0.03 ether; // 3%
    address public protocolFeeDestination;
    uint256 public totalValueDeposited;
    uint256 public zirCatCost = 1;

    ZirCats public zirCats;
    mapping(address => uint256) public sharesBalance;

    event Trade(
        uint256 timestamp,
        address trader,
        bool isBuy,
        uint256 shareAmount,
        uint256 ethAmount,
        uint256 protocolEthAmount,
        uint256 totalSupply,
        uint256 totalValue
    );
    event ShareBurnedAndMintedNFT(
        uint256 timestamp,
        address account,
        uint256 tokenId,
        string tokenURI
    );

    constructor(address zirCatsAddress) Ownable(msg.sender) {
        zirCats = ZirCats(zirCatsAddress);
        protocolFeeDestination = msg.sender;
    }

    function getPrice(
        uint256 supply,
        uint256 amount
    ) public pure returns (uint256) {
        if (supply == 0 || amount == 0) {
            return 0;
        }

        uint256 sum1 = ((supply - 1) * supply * (2 * (supply - 1) + 1)) / 6;
        uint256 sum2 = ((supply + amount - 1) *
            (supply + amount) *
            (2 * (supply + amount - 1) + 1)) / 6;

        if (sum2 <= sum1) {
            return 0;
        }

        uint256 summation = sum2 - sum1;
        return (summation * 1 ether) / 100000000;
    }

    // Function to calculate buyPrice based on amount
    function calculateBuyPrice(uint256 amount) public view returns (uint256) {
        uint256 supply = totalValueDeposited;
        return getPrice(supply, amount);
    }

    function buyShares(uint256 amount) public payable {
        uint256 supply = totalValueDeposited;
        uint256 price = getPrice(supply, amount);
        uint256 protocolFee = (price * protocolFeePercent) / 1 ether;
        require(msg.value >= price + protocolFee, "Insufficient payment");

        sharesBalance[msg.sender] += amount;

        // Update this line
        totalValueDeposited += amount; // Instead of price

        emit Trade(
            block.timestamp,
            msg.sender,
            true,
            amount,
            price,
            protocolFee,
            supply + amount,
            totalValueDeposited
        );

        (bool success1, ) = protocolFeeDestination.call{value: protocolFee}("");
        require(success1, "Unable to send funds");
    }

    function sellShares(uint256 amount) public {
        require(sharesBalance[msg.sender] >= amount, "Insufficient shares");
        require(
            totalValueDeposited >= amount,
            "Not enough shares in circulation"
        );

        uint256 supply = totalValueDeposited;
        uint256 price = getPrice(supply, amount);

        // Add a minimum price for selling shares
        uint256 minPrice = (amount * 1 ether) / 100000000; // 0.00000001 ether per share
        price = price > minPrice ? price : minPrice;

        uint256 protocolFee = (price * protocolFeePercent) / 1 ether;
        uint256 netAmount = price - protocolFee;

        sharesBalance[msg.sender] -= amount;
        totalValueDeposited -= amount;

        emit Trade(
            block.timestamp,
            msg.sender,
            false,
            amount,
            price,
            protocolFee,
            supply - amount,
            totalValueDeposited
        );

        uint256 contractBalance = address(this).balance;

        if (netAmount > contractBalance) {
            netAmount = contractBalance / 2;
        }

        (bool success1, ) = msg.sender.call{value: netAmount}("");
        (bool success2, ) = protocolFeeDestination.call{value: protocolFee}("");
        require(success1 && success2, "Unable to send funds");
    }

    function burnShareAndMintNFT(string memory svg) public {
        require(
            sharesBalance[msg.sender] >= zirCatCost,
            "Insufficient shares to burn"
        );

        sharesBalance[msg.sender] -= zirCatCost;

        string memory encodedSVG = string(
            abi.encodePacked("data:image/svg+xml;base64,", svg)
        );
        uint256 tokenId = IERC721Enumerable(address(zirCats)).totalSupply();
        zirCats.safeMint(msg.sender, encodedSVG);

        emit ShareBurnedAndMintedNFT(
            block.timestamp,
            msg.sender,
            tokenId,
            encodedSVG
        );
    }

    function viewShareBalance(address account) public view returns (uint256) {
        return sharesBalance[account];
    }

    function changeCatNipCost(uint256 newCost) public onlyOwner {
        zirCatCost = newCost;
    }
}
