const https = require("https");
BASE_URL = "https://hacker-news.firebaseio.com/v0/";

https.get(BASE_URL + "topstories.json", (res) => {
    let data = "";

    res.on("data", (chunk) => {
        data += chunk;
    });

    res.on("end", () => {
        topStories = JSON.parse(data);
        for (let i = 0; i < 10; i++) {
            https.get(BASE_URL + `item/${topStories[i]}.json?print=pretty`, (res2) => {
                let data = "";

                res2.on("data", (chunk) => {
                    data += chunk;
                });

                res2.on("end", () => {
                    parsedData = JSON.parse(data);
                    console.log(parsedData.title);
                    console.log(parsedData.url);
                });
            });
        }
        
    });

}).on("error", (err) => {
    console.log(err);
});


