require("dotenv").config();

import request from "request-promise-native";

import { updateWeather } from "./ethereum";

const options = { uri: process.env.WEATHER_URL, json: true };

const start = () => {
  request(options)
  .then(parseData)
  .then(updateWeather)
  .then(restart)
  .catch(error);
};

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
      windGust = (body.wind.gust || 0).toString();
    } catch(error) {
      reject(error);
      return;
    }
    resolve({ weatherDescription, temperature, humidity, visibility, windSpeed, windDirection, windGust });
  });
};

const restart = () => {
  wait(process.env.TIMEOUT).then(start);
};

const wait = (milliseconds) => {
  return new Promise((resolve, reject) => setTimeout(() => resolve(), milliseconds));
};

const error = (error) => {
  console.error(error);
  restart();
};

export default start;
