const fetch = require("node-fetch");

module.exports = async function (){
    const res = await fetch("https://api.adviceslip.com/advice");
    // console.log((await res.json()).slip.advice);
    return `\nAdvice: ${(await res.json()).slip.advice}`;
}
// ();