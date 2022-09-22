require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

module.exports = {
  networks: {
    hardhat: {
      forking: {
        //Comment the first line and uncomment the second line to test on polygon mainnet
        url: process.env.GOERLI_RPC,
        //url: process.env.POLYGON_RPC,
      },
      chainId: 1337,
    },
    goerli: {
      url: process.env.GOERLI_RPC,
      gasPrice: 50000000000,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 5,
    },
    polygon: {
      url: process.env.POLYGON_RPC,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 137,
    },
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY,
      polygon: process.env.POLYGONSCAN_API_KEY,
    },
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
