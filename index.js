const http = require('http');
const fs = require("fs");
var requests = require("requests");
const homeFile =  fs.readFileSync("home.html", "utf-8");
const replaceVal = (tempVal , orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%temp_min%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%temp_max%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    return temperature;
}
//console.log(replaceVal);
const server = http.createServer((req, res)=> {
    console.log("server started");
    if(req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=pune&appid=cb398e3698c134811a3eeb0250c632f6")
        .on("data", (chunk) => {
            const objdata = JSON.parse(chunk);
            const arrData = [objdata];
            const realTimeData = arrData.map((val) => replaceVal(homeFile , val))
            .join("");
            res.write(realTimeData);
        }) 
        .on("end", (err) => {
            if(err) return console.log("connection closed", err);
            res.end();
        });
    } else {
            res.end("file not found");
        }
    });
    server.listen(8000, "127.0.0.1");