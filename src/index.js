const http = require('http');
const express = require('express');
const Filter = require('bad-words');
const path = require('path');
const socketio = require('socket.io')

const app = express();
const server = http.createServer(app); // create server with low-level http core module
const io = socketio(server); // this lets us pass it to socket to create it

const PORT = process.env.PORT || 3000;

// Define path for Express config
const publiDirPath= path.join(__dirname,'../public');


// Setup static directory to serve
app.use(express.static(publiDirPath));

// let count = 0;
io.on('connection',(socket)=>{  //? The socket parameter holds information about the socket connection
    console.log("new web socket connection");
    socket.emit('message','Welcome'); // send to all users
    socket.broadcast.emit('message','A new User has joined the chat'); // send to all users except the current connectio
    
    //! On changes
    socket.on('messageSend',(message,callback)=>{
        const filter = new Filter();
        if(filter.isProfane(message)){
            return callback("Profanity is not allowed");  //? only sending callback data if profane
        }
        io.emit('message',message)
        callback(); //? otherwise, send no callback data
    })
    socket.on('sendLocation',(coords,callback)=>{
        // When the location string is sent, output a GMaps link
        io.emit('message', `Find me here: https://google.com/maps?q=${coords.latitude},${coords.longitude}`);
        callback(); //! ACKNOWLEDGE
        // Back to client
    })

    //! Send to all users when another user leaves
    socket.on('disconnect',()=>{
        io.emit('message',"A user has left the chat");
    })
    // socket.emit('countUpdated',count) // Send socket event from server
    
    // // server listens for increment, and passes back the count
    // socket.on('increment',()=>{
    //     count++;
    //     //socket.emit('countUpdated',count)  //! Emits event to single connection
    //     io.emit('countUpdated',count) //! Emits event to all clients
    // })
})

app.get("/",(req,res)=>{
    res.render("index")
})

server.listen(PORT,()=>{ //* Call the listen function with the newly declared server
    console.log("Listening on port " + PORT);
})