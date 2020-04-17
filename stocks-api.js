// first reference required modules
const path = require('path');
const parser = require('body-parser');
const express = require('express');

// create an express app
const app = express();

// tell node to use json and HTTP header features in body-parser
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));

const provider = require('./scripts/data-provider.js');
provider.retrieveCompanies(app);

// handle requests for static resources
app.use('/static', express.static((path.join(__dirname,'public'))));
app.use('/socket.io', express.static(path.join(__dirname, '/node_modules/socket.io-client/dist/')));

// Use express to listen to port
let port = 8080;
app.listen(port, () => {
 console.log("Server running at port= " + port);
});

// listen for socket communication on port 4000
const server = require('socket.io');
const io = new server(4000);

//create user list for side bar
let userList = [];

io.on('connection', socket => {
    console.log('new connection made with client');

    //create random id for img
    const id = Math.floor((Math.random() * 70) + 1);

    // client has sent a new user has joined message
    socket.on('username', msg => {
        //Add user to list of users
        userList.push({
            name: msg,
            id: id
        });
        console.log('username: ' + msg);
        // attach passed username with this communication socket
        socket.username = msg;
        // broadcast message to all connected clients
        const obj = { user: msg, id: id, userList: userList };
        io.emit('user joined', obj);
    }); 

    // client has sent a chat message ... broadcast it
    socket.on('chat from client', msg => {
        socket.broadcast.emit('chat from server', { user: socket.username, message: msg } );
    });

    socket.on('user left', msg => {      
        //remove user
        userList = userList.filter(x => {
            console.log("id: " + x.id);
            return x.id != msg.id;
        })

        console.log("new user list: " + JSON.stringify(userList, null, 4));

        const obj = { user: msg.user, id: msg.id, userList: userList };

        io.emit('user has left', obj);
    });
});
