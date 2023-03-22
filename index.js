const http=require("http");
const fs=require("fs");
var requests = require('requests');

const homeFile=fs.readFileSync("index.html","utf-8");
const replaceVal=(tempval,orgval)=>
{
    let temperature=tempval.replace("{%tempvalue%}",orgval.main.temp);
        temperature=temperature.replace("{%tempmin%}",orgval.main.temp_min);
        temperature=temperature.replace("{%tempmax%}",orgval.main.temp_max);
        temperature=temperature.replace("{%location%}",orgval.name);
        temperature=temperature.replace("{%country%}",orgval.sys.country);
        return temperature;
}
const server=http.createServer((req,res)=>
{
    if(req.url=="/")
    {
        requests('http://api.openweathermap.org/data/2.5/weather?q=silvassa&appid=ac766e236a3af19ae5278f400b3295d6')
.on('data', (chunk)=> {
    const option =JSON.parse(chunk);
    const arrdata=[option];
    //console.log(arrdata[0].main.temp ); 
    const realdata = arrdata.map((val) =>replaceVal(homeFile,val)).join("");
    
   res.write(realdata);
   
   
   
  
})
.on('end', (err)=> {
  if (err) return console.log('connection closed due to errors', err);
 
  res.end();
});

    }

}); 
 server.listen(8000,"127.0.0.1");
