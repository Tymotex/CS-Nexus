const mongoose = require("mongoose"),
      Blog = require("./models/blog"),
      Comment = require("./models/comment")

var data = [
    {
        title: "Why coding is great",
        author: "Tim Zhang",
        image: "https://www.economist.com/sites/default/files/images/2015/09/blogs/economist-explains/code2.png",
        content: "Corellia reman x-wing bajoran romulan frak biodamper ord mantell apollo tardis. Warpstar dynatrope inara validium xindi. Gorram hypercube communicator, ice gun ord mantell reavers warpstar light saber picard gaius. Wash lando the ‘verse tardis cloud city, hutt exterminate a new hope grand moff tarkin spock inara photon torpedo. Yavin communicator tardis validium AT-AT gaius. Romulan C-3PO apollo darth sullust psychic paper mccoy reavers, maul time lord AT-AT han solo millenium falcon."
    }, 
    {
        title: "How to become immune to pain",
        author: "David Goggins",
        image: "https://cnet4.cbsistatic.com/img/IDN3V9xy8C25s8j-751trksA-Ag=/2019/12/18/31381079-95e8-493a-9f77-e12ef4662323/wellness-2-stock-11.jpg",
        content: "Ipsum Blaster the empire strikes back river sith data disruptor. Tardis maul jedi mind trick husker dantooine chekov, darth geordi la forge cylon biodamper phaser warpstar. Endor landspeeder return of the jedi river, bajoran worf chekov dooku boomer spock data. Tylium ore dagobah nethersphere nerf herder inara naboo kirk millenium falcon bantha chewbacca jayne jelly babies dalek. Worf wedge palpatine han solo y-wing, edosian antaran riker data FTL galmonging yoda fodder. Protocol droid nanogenes biodamper inara serenity warpstar darth. Chewbacca starship rassilon kirk. Light saber maul bothan R2-D2 speeder lando, boomer cloud city dooku sitrep tie fighter dantooine exterminate. Han solo starship skywalker return of the jedi bothan chewbacca krypter tylium ore jelly babies youngling dooku beam me up cylon bantha. Exterminate jayne y-wing ba’ku cardassian palpatine nanogenes jethrik sulu klingon. Protocol droid jawa tie fighter gaius, boomer frack lando galmonging reman uhura galactica vulcan R2-D2."
    },
    {
        title: "Why you should never be late",
        author: "Jocko Willink",
        image: "https://cdn.labmanager.com/assets/articleNo/5659/iImg/12982/0ae51c99-b694-4bc1-a3d7-c5618ddfdd69-ls-timemanagement-640x360.jpg",
        content: "Luke beam me up a new hope, anakin sarlacc dynatrope ewok dagobah yoda cylon starbuck dantooine. Nanogenes crusher bazoolium worf, antilles x-wing ackbar padawan. Shields husker wedge, apollo sullust lando uhura jelly babies dalek palpatine x-wing. Gorram tie fighter data, uhura geordi la forge droid speeder rassilon wyrwulf. Enterprise starbuck alderaan, klingon picard crazy ivan dagobah xindi darth. Force firefly palpatine river, nethersphere rassilon anakin ferengi boba fett. Dynatrope naboo jelly babies C-3PO gorram tribble wyrwulf."
    }
];

var comments = [
    {
        author: "Techlead",
        text: "Hello and welcome to coffee time with the ex-google ex-facebook ex-husband techlead.",
    }, 
    {
        author: "Joshua Fluke",
        text: "Always a great monday.",
    },
    {
        author: "Elon Musk",
        text: "Where are the genetically engineered cat girls.",
    }
];

function seedDB() {
    Blog.remove({}, function(err) {
        if (err) {
            console.log(err);
        }
        console.log("Wiped all blogs");
        Comment.remove({}, function(err) {
            console.log("Wiped all comments");
            for (let i = 0; i < data.length; i++) {
                Blog.create(data[i], function(err, createdBlog) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Added a blog");
                        Comment.create(comments[i], function(err, newComment) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("Added a new comment");
                                createdBlog.comments.push(newComment);
                                createdBlog.save();
                            }
                        });
                    }
                });
            }
        });
    });
}

module.exports = seedDB;


/*
[ { _id: 5e3935411250161c7113ea6e,
    title: 'My First Blog',
    author: 'Tim',
    image:
     'https://helpx.adobe.com/content/dam/help/en/stock/how-to/visual-reverse-image-search/jcr_content/main-pars/image/visual-reverse-image-search-v2_intro.jpg',
    content:
     'This is my first blog post! And here is an update. And another one <em>and another one</em>\r\nAnd another <strong>one</strong>\r\n',
    timeCreated: 2020-02-04T09:11:29.353Z,
    __v: 0 },
  { _id: 5e3941f79013d11fac0a0fe8,
    title: 'Pretty geography',
    author: 'NASA',
    image:
     'https://www.nasa.gov/sites/default/files/styles/image_card_4x3_ratio/public/thumbnails/image/pia23533.jpg',
    content: 'Look at that pretty geography',
    timeCreated: 2020-02-04T10:05:43.709Z,
    __v: 0 },
  { _id: 5e39e8897ff9f72d3315bdec,
    title: 'Hello Mars',
    author: 'Elon Musk',
    image:
     'https://i.insider.com/5dd8574bfd9db2548a676b45?width=1100&format=jpeg&auto=webp',
    content: 'Um',
    timeCreated: 2020-02-04T21:56:25.784Z,
    __v: 0 } ]
*/