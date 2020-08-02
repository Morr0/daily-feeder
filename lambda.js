"use strict"

exports.handler = async function (event, context){
    console.log(event);
    function wait(){
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve("hello"), 2000)
        });
    }

    await require("./app")(context);

    // To force lambda wait for SNS callback
    console.log(await wait());
    console.log(await wait());
}