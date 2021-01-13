const express = require('express');
const app = new express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
    console.log('client connected');

    socket.on('chat message', msg => {
        socket.broadcast.emit('chat message', msg);
    })

    console.log(socket);

})


http.listen(3000, () => {
    console.log('listening on *:3000');
});