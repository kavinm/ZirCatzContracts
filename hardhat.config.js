require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();

const { ZIRCUIT_PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.20",
  networks: {
    zircuit: {
      url: `https://zircuit1.p2pify.com`,
      accounts: [ZIRCUIT_PRIVATE_KEY],
    },
  },

  etherscan: {
    apiKey: {
      zircuit: "AA0376546C0DDB76B4155C8C4C164F62ED",
    },
    customChains: [
      {
        network: "zircuit",
        chainId: 48899,
        urls: {
          apiURL: "https://explorer.zircuit.com/api/contractVerifyHardhat",
          browserURL: "https://explorer.zircuit.com",
        },
      },
    ],
  },
};
