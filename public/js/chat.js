const socket = io(); // initiate the socket

// elements - identify different sections of HTML doc
const $messageForm = document.querySelector("#message-form")
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('#send');
const $locationButton = document.querySelector('#location');
const $messages = document.querySelector('#messages');

// Templates - Mustache
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;

// Options - Rooms
const {username, room} = Qs.parse(location.search,{ ignoreQueryPrefix: true })

// Receive message data from server, and render
socket.on("message", (messageData) => {
  console.log(messageData);
  const html = Mustache.render(messageTemplate,{
      username:messageData.username,
      message:messageData.text,
    createdAt: moment(messageData.createdAt).format('h:mm A')}
      );
  $messages.insertAdjacentHTML('beforeend',html)
});

socket.on('locationMessage',(locationData)=>{
    console.log(locationData);
    const html = Mustache.render(locationTemplate,{
        username:locationData.username,
        locationMessage: locationData.url,
        createdAt: moment(locationData.createdAt).format('h:mm A')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

// Listen for submit button
$messageForm.addEventListener("submit", (e) => {
  e.preventDefault(); // prevent form from refreshing on submit
  $messageFormButton.setAttribute('disabled','disabled') // disables form button when message sent
  const message = e.target.elements.message.value;
  // send the message to server
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

socket.emit('join',{username, room},(error)=>{
    if(error){
        alert(error)
        location.href="/"
    }
});