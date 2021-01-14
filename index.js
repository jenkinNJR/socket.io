const express = require('express');
const { disconnect } = require('process');
const app = new express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

let connectedUsers = [];


io.on('connection', socket => {

    console.log(socket.id);
    socket.on('chat message', msg => {
        socket.to(msg.to).emit('sendmessage', msg.name + " : " + msg.text);
        console.log(msg);
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


http.listen(3000, () => {
    console.log('listening on *:3000');
});