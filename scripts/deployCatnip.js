const { ethers } = require("hardhat");

async function main() {
  // Address of the already deployed ZirCats contract
  const zirCatsAddress = "0x7D37e8fb2c0AD546DfeF3f8E39d3EEEd9D9ac82C";

  // Get the contract factory for ZirCatNip
  const ZirCatNip = await ethers.getContractFactory("ZirCatNip");

  // Deploy the ZirCatNip contract, passing the address of the deployed ZirCats contract
  const zirCatNip = await ZirCatNip.deploy(zirCatsAddress);

  console.log("ZirCatNip deployed to:", zirCatNip.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
