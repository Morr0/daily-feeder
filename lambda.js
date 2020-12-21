"use strict"

exports.handler = async function (event, context){
    console.log(event);

    await require("./app")();
}