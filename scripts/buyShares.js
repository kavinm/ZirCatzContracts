const { ethers } = require("hardhat");

async function main() {
  // Define the contract address and ABI
  const contractAddress = "0x52efc82b54E9EFD38865Ed5572fb35bfFd16e87d"; // Replace with your ZirCatNip contract address
  const contractABI = [
    "function buyShares(uint256 amount) public payable",
    "function calculateBuyPrice(uint256 amount) public view returns (uint256)",
    "function protocolFeePercent() public view returns (uint256)",
  ];

  // Connect to the provider and get the signer
  const [signer] = await ethers.getSigners();

  // Create a contract instance
  const zirCatNip = new ethers.Contract(contractAddress, contractABI, signer);

  // Define the amount of shares you want to buy
  const amount = 1; // Example: 1 share

  // Calculate the price for the shares
  const price = await zirCatNip.calculateBuyPrice(amount);
  console.log(`Price for ${amount} shares: ${ethers.formatEther(price)} ETH`);

  // Get the protocol fee percentage
  const protocolFeePercent = await zirCatNip.protocolFeePercent();
  const protocolFee =
    (price * BigInt(protocolFeePercent)) / BigInt(ethers.parseUnits("1", 18));
  const totalPrice = price + protocolFee + BigInt(100000);
  console.log(
    `Total Price (including protocol fee): ${ethers.formatEther(
      totalPrice
    )} ETH`
  );

  // Buy the shares
  const tx = await zirCatNip.buyShares(amount, { value: totalPrice });
  console.log("Transaction sent:", tx.hash);

  // Wait for the transaction to be confirmed
  await tx.wait();
  console.log("Shares bought successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
