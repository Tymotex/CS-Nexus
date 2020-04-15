const https = require("https");
BASE_URL = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`;

https.get(BASE_URL, (res) => {
    let data = "";

    res.on("data", (chunk) => {
        data += chunk;
    });

    res.on("end", () => {
        results = JSON.parse(data);
        console.log(results);
        
    });

}).on("error", (err) => {
    console.log(err);
});


