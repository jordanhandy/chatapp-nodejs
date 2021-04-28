const socket = io();  // initiate the socket
socket.on('message',(messageData)=>{
    console.log(messageData)
})
document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = e.target.elements.message.value
    socket.emit('messageSend',message);
})

// socket.on('countUpdated',(count)=>{ // listen for countUpdated
//     console.log("The count has been updated",count) // print a message with the socket param
// })
// // Event listener for click
// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log("Clicked!")
//     // when the button is clicked, send an increment emitter back to socket
//     socket.emit('increment')
// })