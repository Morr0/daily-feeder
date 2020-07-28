"use strict"

const aws = require("aws-sdk");
const fetch = require("node-fetch");

require("dotenv").config();
const {
    LATITUDE,
    LONGITUDE,
    WEATHER_API_KEY,
    EXCLUDES,
    SNS_ARN
} = process.env;

const snsClient = new aws.SNS({
    region: "ap-southeast-2"
});


exports.handler = async function (event, context){
    function wait(){
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve("hello"), 2000)
        });
    }

    const data = await getWeatherNow();
    snsClient.publish({
        TopicArn: SNS_ARN,
        Message: data
    },(error, data) => {
        context.succeed(`Error: ${error}\nData: ${data}`);
    });

    // To force lambda wait for SNS callback
    console.log(await wait());
    console.log(await wait());
}

async function getWeatherNow(){
    const res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${LATITUDE}&lon=${LONGITUDE}&appid=${WEATHER_API_KEY}&exclude=${EXCLUDES}&units=metric`)
    if (res.status === 200){
        const data = await res.json();
        console.log(data);
        return `Temp: ${data.current.temp}C\nFeels: ${data.current.feels_like}C\nHumidity: ${data.current.humidity}%\nCloudness: ${data.current.clouds}%`;
    }
}