require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {
      forking: {
        url: process.env.ALCHEMY_GOERLI_RPC_URL,
      },
    },
  },
  solidity: "0.8.9",
};
