const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

const port = process.env.PORT || 3000;

//tell express where to find static web files
app.use(express.static('public'));

//app.get is a route handler the / is the route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

server.listen(port, () => {
  console.log(`listening on ${port}`);
});

//socket.io stuff goes here
io.on('connection', (socket) => {
  console.log('a user connected, socket');
  socket.emit('connected',{sID: socket.id, message: 'new connection'});

  //lisyrn for incoming messages from ANY one connected to the chat service
  //and then see what that message is
  socket.on('chat_message', function(msg) { //step one is receve the message
    console.log(msg);
    //step 2 is show everyone what was just send through - send the message to everyone connected to the service
    io.emit('new_message', {message: msg});
  })

  //listen for a typing event and broadcast  to all
  socket.on('user_typing', function(user){
    console.log(user);

    io.emit('typing', {currentlytyping: user})
  })
});