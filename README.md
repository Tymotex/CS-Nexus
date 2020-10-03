# CS-Nexus
This is a personal portfolio site built from scratch with Node.js, Express, MongoDB (with Mongoose), Passport.js, Bootstrap 4 and jQuery. Includes an implementation for a RESTful blog posting API, comments and image/data snapshots for the companion Raspberry Pi project <a href="https://github.com/Tymotex/Hydroponix">here</a>. Also includes an authentication system and authorisation levels for managing blog posts. 

![Home-preview](/public/cs-home-preview.gif)

![Site-preview](/public/cs-nexus-preview.gif)

### Startup:
Inside the project root directory, run:
```
npm install
sudo npm install forever -g
forever start app.js
```
To view running processes and stop specific forever process, run:
```
forever list
forever stop <foreverProcessID>
```
