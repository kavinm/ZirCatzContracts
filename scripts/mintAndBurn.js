const { ethers } = require("hardhat");

async function main() {
  // Define the contract address and ABI
  const contractAddress = "0x52efc82b54E9EFD38865Ed5572fb35bfFd16e87d"; // Replace with your ZirCatNip contract address
  const contractABI = [
    "function burnShareAndMintNFT(string memory svg) public",
    "function sharesBalance(address account) public view returns (uint256)",
    "function zirCatCost() public view returns (uint256)",
  ];

  // Connect to the provider and get the signer
  const [signer] = await ethers.getSigners();

  // Create a contract instance
  const zirCatNip = new ethers.Contract(contractAddress, contractABI, signer);

  const svgContent = `
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <rect width="32" height="32" fill="#FFCC00"/>
    <rect x="8" y="8" width="16" height="16" fill="#FF0000"/>
  </svg>
  `;

  // Check if the user has enough shares to burn
  const zirCatCost = await zirCatNip.zirCatCost();
  const sharesBalance = await zirCatNip.sharesBalance(signer.address);

  if (sharesBalance < zirCatCost) {
    console.error(
      `Not enough shares to burn. Required: ${zirCatCost}, Available: ${sharesBalance}`
    );
    return;
  }

  // Burn the shares and mint the NFT
  const tx = await zirCatNip.burnShareAndMintNFT(btoa(svgContent));
  console.log("Transaction sent:", tx.hash);

  // Wait for the transaction to be confirmed
  await tx.wait();
  console.log("Shares burned and NFT minted successfully!");
}

function btoa(str) {
  return Buffer.from(str, "binary").toString("base64");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
