const socket = io(); // initiate the socket

// elements
const $messageForm = document.querySelector("#message-form")
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('#send');
const $locationButton = document.querySelector('#location');

socket.on("message", (messageData) => {
  console.log(messageData);
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $messageFormButton.setAttribute('disabled','disabled') // disables form button when message sent
  const message = e.target.elements.message.value;
  if(message===''){
      console.log("Message is empty!  Type something first");
      $messageFormButton.removeAttribute('disabled');
      $messageFormInput.value ='';
      return
  }
  socket.emit("messageSend", message,(error)=>{
      $messageFormButton.removeAttribute('disabled');
      $messageFormInput.value = '';
      $messageFormInput.focus();
      if(error){ //? if the function param was received, then the message was prfane
          return console.log(error)
      }
      console.log("The message was delivered!");
  });
});

// Get the location button click
document.querySelector("#location").addEventListener("click", () => {
    $locationButton.setAttribute('disabled','disabled');
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
    },()=>{
        //! Receive acknowledgement and do something
        console.log("Location shared!");
        $locationButton.removeAttribute('disabled');
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
