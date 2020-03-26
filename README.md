# CS-Nexus [WIP]
Built with Bootstrap 4, jQuery, Node.js, Express, MongoDB with Mongoose and Passport.js for authentication.

### Planned Features:
- Set up OAuth tokens with passport.js
- Sending POST requests to Hydroponix routes should require authentication
- Implement pagination for blogs, comments and Hydroponix data snapshots 
- Set up parallax background scrolling effect
- Unsplash API for changing background image

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
