const aws = require("aws-sdk");
const fetch = require("node-fetch");

require("dotenv").config();
const {
    LATITUDE,
    LONGITUDE,
    WEATHER_API_KEY,
    SNS_ARN
} = process.env;

const snsClient = new aws.SNS({
    region: "ap-southeast-2"
});

module.exports = async function (context){
    const data = await getWeatherNow();
    snsClient.publish({
        TopicArn: SNS_ARN,
        Message: data
    },(error, data) => {

        context.succeed(`Error: ${error}\nData: ${data}`);
    });
}

async function getWeatherNow(){
    const res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${LATITUDE}&lon=${LONGITUDE}&appid=${WEATHER_API_KEY}&units=metric&exclude=minutely,hourly`);
    if (res.status === 200){
        const data = await res.json();

        // Current weather
        let now = `Now:\n\nTemp: ${data.current.temp}C\nFeels: ${data.current.feels_like}C\nHumidity: ${data.current.humidity}%\nCloudness: ${data.current.clouds}%\n\n`;
        
        // Get the daily, grab first element of the array representing today
        const todayData = data.daily[0];
        let today = `Today:\n\nTemp: ${todayData.temp.day}C\nLow: ${todayData.temp.min}C\nHigh: ${todayData.temp.max}C\nHumidity: ${todayData.humidity}%\nCloudness: ${todayData.clouds}%\nWind: ${todayData.wind_speed}km/hr`;

        return now + today;
    }
}