require("dotenv").config();

import HDWalletProvider from "truffle-hdwallet-provider";
import path from "path";
import Web3 from "web3";

const web3 = new Web3(new HDWalletProvider(process.env.MNEMONIC, process.env.WEB3_PROVIDER_ADDRESS));
const abi = require(path.resolve("artifacts", process.env.ABI_NAME));
const address = process.env.CONTRACT_ADDRESS;
const contract = web3.eth.contract(abi).at(address);

export const updateWeather = ({ weatherDescription, temperature, humidity, visibility, windSpeed, windDirection, windGust }) => {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((err, accounts) => {
      contract.updateWeather(weatherDescription, temperature, humidity, visibility, windSpeed, windDirection, windGust,
        { from: accounts[0] }, (error, res) => {
          if (error === null) {
            resolve(res);
          } else {
            reject(error);
          }
        }
      );
    });
  });
};

export const weatherUpdate = (callback) => {
  contract.WeatherUpdate((error, result) => callback(error, result));
}
