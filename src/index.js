const http = require('http');
const express = require('express');
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
    socket.emit('message','Welcome');
    socket.on('messageSend',(message)=>{
        io.emit('message',message)
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