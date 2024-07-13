const { ethers } = require("hardhat");

async function main() {
  const [owner] = await ethers.getSigners();

  const ZirCats = await ethers.getContractFactory("ZirCats");
  const zircats = await ZirCats.attach(
    "0xD3b647A7b76c8251260662D956001943b0A669A8"
  ); // Use the deployed contract address

  const svgContent = `
    <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
      <!-- Ears -->
      <rect x="18" y="10" width="10" height="10" fill="#D2B48C" shape-rendering="crispEdges"/>
      <rect x="36" y="10" width="10" height="10" fill="#D2B48C" shape-rendering="crispEdges"/>
      <rect x="20" y="12" width="6" height="6" fill="#FFDEAD" shape-rendering="crispEdges"/>
      <rect x="38" y="12" width="6" height="6" fill="#FFDEAD" shape-rendering="crispEdges"/>
      
      <!-- Head -->
      <rect x="16" y="20" width="32" height="24" fill="#D2B48C" shape-rendering="crispEdges"/>
      
      <!-- Eyes -->
      <rect x="22" y="26" width="8" height="8" fill="#FFFFFF" shape-rendering="crispEdges"/>
      <rect x="34" y="26" width="8" height="8" fill="#FFFFFF" shape-rendering="crispEdges"/>
      <rect x="24" y="28" width="4" height="4" fill="#000000" shape-rendering="crispEdges"/>
      <rect x="36" y="28" width="4" height="4" fill="#000000" shape-rendering="crispEdges"/>
      
      <!-- Nose -->
      <rect x="30" y="34" width="4" height="4" fill="#FF69B4" shape-rendering="crispEdges"/>
      
      <!-- Mouth -->
      <rect x="28" y="38" width="2" height="4" fill="#000000" shape-rendering="crispEdges"/>
      <rect x="34" y="38" width="2" height="4" fill="#000000" shape-rendering="crispEdges"/>
      <rect x="30" y="40" width="4" height="2" fill="#000000" shape-rendering="crispEdges"/>
      
      <!-- Body -->
      <rect x="20" y="44" width="24" height="16" fill="#D2B48C" shape-rendering="crispEdges"/>
      <rect x="20" y="54" width="24" height="2" fill="#8B4513" shape-rendering="crispEdges"/>
      
      <!-- Legs -->
      <rect x="22" y="60" width="8" height="4" fill="#8B4513" shape-rendering="crispEdges"/>
      <rect x="34" y="60" width="8" height="4" fill="#8B4513" shape-rendering="crispEdges"/>
    </svg>
    `;

  const base64Svg = Buffer.from(svgContent).toString("base64");
  const tokenURI = `data:image/svg+xml;base64,${base64Svg}`;

  const tx = await zircats.safeMint(owner.address, tokenURI);
  await tx.wait();

  console.log("NFT minted with tokenURI:", tokenURI);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
