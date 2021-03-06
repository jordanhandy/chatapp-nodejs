const http = require('http');
const express = require('express');
const Filter = require('bad-words');
const path = require('path');
const socketio = require('socket.io')
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const {getUser,getUsersInRoom,addUser,removeUser} = require("./utils/users");

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

    socket.on('join',({username, room},callback)=>{
        const {error,user} = addUser({
            id:socket.id,
            username,
            room
        })
        if(error){
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message',generateMessage("Chatbot","Welcome"))
        // send to all users
        socket.broadcast.to(user.room).emit('message',generateMessage("Chatbot",`${user.username} has joined the chat`)); // send to all users except the current connection
        // name of data to send, data to send
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)

        })
        callback();
    
    })

    //! On changes
    socket.on('messageSend',(message,callback)=>{
        const user = getUser(socket.id)
        const filter = new Filter();
        if(filter.isProfane(message)){
            return callback("Profanity is not allowed");  //? only sending callback data if profane
        }
        io.to(user.room).emit('message',generateMessage(user.username,message))
        callback(); //? otherwise, send no callback data
    })
    socket.on('sendLocation',(coords,callback)=>{
        const user = getUser(socket.id)
        // When the location string is sent, output a GMaps link
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback(); //! ACKNOWLEDGE
        // Back to client
    })

    //! Send to all users when another user leaves
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit('message',generateMessage("Chatbot",`${user.username} has left the chat`));
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
    })
})

app.get("/",(req,res)=>{
    res.render("index")
})

server.listen(PORT,()=>{ //* Call the listen function with the newly declared server
    console.log("Listening on port " + PORT);
})