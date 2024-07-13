const { ethers } = require("hardhat");

async function main() {
  // Get the contract to deploy
  const ZirCats = await ethers.getContractFactory("ZirCats");

  // Deploy the contract, passing the initial owner address
  const initialOwner = "0x708de64588509408315714ACe7768B4cF0E25c24";
  const zircats = await ZirCats.deploy(initialOwner);

  console.log("ZirCats deployed to:", zircats.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
