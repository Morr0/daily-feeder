const aws = require("aws-sdk");
const fetch = require("node-fetch");

require("dotenv").config();
const {
    WEATHER_API_KEY,
    LATITUDE,
    LONGITUDE,
    SNS_TOPIC
} = process.env;

const snsClient = new aws.SNS({
    region: "ap-southeast-2"
});

module.exports = async function (){
    console.log(JSON.stringify(
        {
            latitude: LATITUDE,
            longitude: LONGITUDE
        }
    ));

    const weatherOfNowAndTheDay = await getWeatherNow();

    return snsClient.publish({
        TopicArn: SNS_TOPIC,
        Message: weatherOfNowAndTheDay
    }).promise();
}

async function getWeatherNow(){
    let numOfRequests = 3;
    const res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${LATITUDE}&lon=${LONGITUDE}&appid=${WEATHER_API_KEY}&units=metric&exclude=minutely,hourly`);
    while (numOfRequests > 0){
        if (res.status === 200){
            const data = await res.json();
            console.log(data);

            console.log("Writing current weather");
            // Current weather
            let now = `Now:\n\nTemp: ${data.current.temp}C\nFeels: ${data.current.feels_like}C\nHumidity: ${data.current.humidity}%\nCloudness: ${data.current.clouds}%\n\n`;
            
            // Get the daily, grab first element of the array representing today
            const todayData = data.daily[0];
            let today = `Today:\n\nTemp: ${todayData.temp.day}C\nLow: ${todayData.temp.min}C\nHigh: ${todayData.temp.max}C\nHumidity: ${todayData.humidity}%\nCloudness: ${todayData.clouds}%\nWind: ${todayData.wind_speed}km/hr`;

            return now + today;
        }

        await delay(2000);
        numOfRequests--;
    }

    console.log("Failed request");
}

function delay(timeMs){
    return new Promise((r) => {
        setTimeout(r, timeMs);
    });
}