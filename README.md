# CSBlog [WIP]
Built with Semantic UI, jQuery, Node.js, Express, MongoDB with Mongoose and Passport.js



### Planned Features:
- Set up OAuth tokens with passport.js
- Sending POST requests to Hydroponix routes should require authentication
- Implement pagination for blogs, comments and Hydroponix data snapshots 
- Set up parallax background scrolling effect

### Using Forever:
Inside the project root directory, run:
```
sudo npm install forever -g
forever start app.js
```
To view running processes and stop specific forever process, run:
```
forever list
forever stop <foreverProcessID>
```