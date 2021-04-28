const socket = io(); // initiate the socket
socket.on("message", (messageData) => {
  console.log(messageData);
});

document.querySelector("#message-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const message = e.target.elements.message.value;
  socket.emit("messageSend", message);
});
// Get the location button click
document.querySelector("#location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    // if geolocation not supported on browser
    return alert("Geolocation is not supported by your browser");
  }
  navigator.geolocation.getCurrentPosition((position, error) => {
    // Get location
    if (error) {
      return alert("Unable to retrieve your location");
    }
    // Send back location object
    socket.emit("sendLocation", {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  });
});

// socket.on('countUpdated',(count)=>{ // listen for countUpdated
//     console.log("The count has been updated",count) // print a message with the socket param
// })
// // Event listener for click
// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log("Clicked!")
//     // when the button is clicked, send an increment emitter back to socket
//     socket.emit('increment')
// })
