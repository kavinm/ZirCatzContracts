const { ethers } = require("hardhat");

async function main() {
  // Address of the already deployed ZirCats contract
  const zirCatsAddress = "0xD3b647A7b76c8251260662D956001943b0A669A8";

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
