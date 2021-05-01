const express = require('express');
const app = new express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: '*' }, allowEIO3: true });
const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/chat', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(console.log('connected to db'))
//     .catch(e => console.log(e));

const chatSchema = mongoose.Schema({
    name: String,
    text: String,
    to: String
});

const Chat = new mongoose.model("chats", chatSchema);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

let connectedUsers = [];


io.on('connection', socket => {

    console.log(socket.id);
    socket.on('chat message', msg => {
        socket.to(msg.to).emit('sendmessage', msg.name + " : " + msg.text);


//         chatSave(msg).then(
//             (value) => console.log(value),
//             (err) => console.log(err)
//         );
//         console.log(msg);
    })

    socket.on('newuser', (name) => {
        connectedUsers.push(name);
        io.emit('render', connectedUsers);
        console.log(connectedUsers);
    })


    socket.on('disconnect', () => {
        /*    var index = connectedUsers.indexOf(s);
            console.log(s);
            connectedUsers.splice(index, 1);
            console.log(connectedUsers);
            */
        connectedUsers.find((us, index) => {
            if (us.id == socket.id) {
                connectedUsers.splice(index, 1);
            }
        })
        io.emit('render', connectedUsers);
        console.log(connectedUsers);
    })

})

async function chatSave(data) {
    const chatMessage = new Chat(data);
    return await chatMessage.save();
}

http.listen(3000, () => {
    console.log('listening on *:3000');
});
