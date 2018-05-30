require("dotenv").config();

import HDWalletProvider from "truffle-hdwallet-provider";
import path from "path";
import request from "request-promise-native";
import Web3 from "web3";

const web3 = new Web3(new HDWalletProvider(process.env.MNEMONIC, process.env.WEB3_PROVIDER_ADDRESS));
const options = { uri: process.env.WEATHER_URL, json: true };

const start = () => {
  request(options)
  .then(parseData)
  .then(updateWeather)
  .then(restart)
  .catch(error);
}

const parseData = (body) => {
  return new Promise((resolve, reject) => {
    let weatherDescription, temperature, humidity, visibility, windSpeed, windDirection, windGust;
    try {
      weatherDescription = body.weather[0].description.toString();
      temperature = body.main.temp.toString();
      humidity = body.main.humidity.toString();
      visibility = body.visibility.toString();
      windSpeed = body.wind.speed.toString();
      windDirection = body.wind.deg.toString();
      windGust = body.wind.gust.toString();
    } catch(error) {
      reject(error);
      return;
    }
    resolve({ weatherDescription, temperature, humidity, visibility, windSpeed, windDirection, windGust });
  });
};

const updateWeather = ({ weatherDescription, temperature, humidity, visibility, windSpeed, windDirection, windGust }) => {
  const abi = require(path.resolve("artifacts", process.env.ABI_NAME));
  const address = process.env.CONTRACT_ADDRESS;
  const contract = web3.eth.contract(abi).at(address);

  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((err, accounts) => {
      return contract.updateWeather(weatherDescription, temperature, humidity, visibility, windSpeed, windDirection, windGust,
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

const restart = () => {
  wait(process.env.TIMEOUT).then(start);
}

const wait = (milliseconds) => {
  return new Promise((resolve, reject) => setTimeout(() => resolve(), milliseconds));
}

const error = (error) => {
  console.error(error);
  restart();
}

export default start;
