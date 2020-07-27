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

(async () => {
    const str1 = await getWeatherNow();
    console.log(str1);
    snsClient.publish({
        TopicArn: SNS_ARN,
        Message: str1,

    }, (error, data) => {
        if (error) return console.log(error);

        console.log("Done str1");
    });
    

})();

async function getWeatherNow(){
    const res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${LATITUDE}&lon=${LONGITUDE}&appid=${WEATHER_API_KEY}&exclude=${EXCLUDES}&units=metric`)
    if (res.status === 200){
        const data = await res.json();
        console.log(data);
        return `Temp: ${data.current.temp}C\nFeels: ${data.current.feels_like}C\nHumidity: ${data.current.humidity}%\nCloudness: ${data.current.clouds}%`;
    }
}