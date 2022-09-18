require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

module.exports = {
  networks: {
    hardhat: {
      forking: {
        url: process.env.GOERLI_RPC,
      },
      chainId: 1337,
    },
    goerli: {
      url: process.env.GOERLI_RPC,
      gasPrice: 50000000000,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 5,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
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
