const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");



const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
    
});

app.post("/", function(req, res){

    const query = req.body.cityName;
    const appId = "9e836b1d600ea1811f42e98e4abceadb";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + appId + "&units=" + unit;
    https.get(url, function(response){
        console.log(response.statusCode);


        response.on("data", function(data){
          const WeatherData = JSON.parse(data);
          const temp = WeatherData.main.temp;
          const description = WeatherData.weather[0].description;
          const humidity = WeatherData.main.humidity;
          const windSpeed = WeatherData.wind.speed;
          const windDeg = WeatherData.wind.deg;
          const icon = WeatherData.weather[0].icon;
          const imageURL = "http://openweathermap.org/img/wn/" + icon +"@2x.png";

         
          res.write("<h1>The temperature of " + query + " is: " + temp + " Degree Celcius</h1>");
          
          res.write("<h3>Humidity = " + humidity + "</h3>");
          res.write("<h3>Wind Speed = " + windSpeed + "</h3>");
          res.write("<h3>Wind Degree = " + windDeg + "</h3>");
          res.write("<h2>The weather is currenly " + description + "</h2>");
          res.write("<img src=" + imageURL + ">");
          res.send();

          if(response.statusCode !== 200){
              res.redirect("/");
          }
        });
    });
});






app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000.");
});