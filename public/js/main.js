//imports will always go at the top
import ChatMsg from './components/ChatMessage.js';
const socket = io();

//untility functions for socket
function setUserID({ sID }) {
    //debugger;
    //save our unique ID generated by socket on the server side - this is how we track individual connections to the chat service
    vm.socketID = sID;
};

function saveNewMessage({ message }){
    vm.messages.push(message);
}

function handleUserTyping (user) {
    console.log('somebody is typing something');
}





socket.on('sideMsg', sidebar => {
    //console.log(message);
    outputMessage(sidebar);
})

function outputMessage(sidebar) {
    const div = document.createElement('div');
    //div.classList.add('message');
    div.innerHTML = `<p>${sidebar}</p>`;
    document.getElementById('users').appendChild(div);
}






const { createApp } = Vue

const vm = createApp({

    el: '#app',

    data() {
      return {
        socketID: '',
        message: '',
        messages: [],
        nickname:'',
        //state: 0
      }
    },
    

    methods: {
        dispatchMessage() {
            socket.emit('chat_message', {
                content: this.message,
                name: this.nickname || 'anonymous',
                id: this.socketID
            })

            this.message = "";
        },


        catchTextFocus() {
            //emit a typing event and broadcast it to the server
            socket.emit('user_typing', {
                name: this.nickname || 'anonymous'
                //id: this.socketID
            })
        }
    },


    components: {
        newmsg: ChatMsg
    }
  }).mount('#app')

  socket.addEventListener('connected',setUserID);
  socket.addEventListener('new_message', saveNewMessage);
  socket.addEventListener('typing', handleUserTyping);