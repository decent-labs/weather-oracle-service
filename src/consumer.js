require("dotenv").config();

import HDWalletProvider from "truffle-hdwallet-provider";
import path from "path";
import Web3 from "web3";

const web3 = new Web3(new HDWalletProvider(process.env.MNEMONIC, process.env.WEB3_PROVIDER_ADDRESS));

const consume = () => {
  const abi = require(path.resolve("artifacts", process.env.ABI_NAME));
  const address = process.env.CONTRACT_ADDRESS;
  const contract = web3.eth.contract(abi).at(address);

  contract.WeatherUpdate((error, result) => {
    console.log("NEW WEATHER DATA EVENT ON SMART CONTRACT");
    console.log("BLOCK NUMBER: ");
    console.log("  " + result.blockNumber)
    console.log("WEATHER DATA: ");
    console.log(result.args);
    console.log("\n");
  });
}

export default consume;
