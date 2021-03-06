const io = require('socket.io');
const users = require('./users');
/**
 * Initialize when a connection is made
 * @param {SocketIO.Socket} socket
 */

function initSocket(socket){
    let id;
    console.log("line1")
    socket.on('init', async() => {
        id = await users.create(socket);
        console.log("id", id)
        socket.emit('init', { id });
    })
    .on('request', (data) => {
        const receiver = users.get(data.to);
        if(receiver){
            receiver.emit('request', {from: id});
        }
    })
    .on('call', (data) => {
        const receiver = users.get(data.to);
        if(receiver){
            receiver.emit('call', {...data, from: id});
        }else{
            socket.emit('failed');
        }
    })
    .on('end', (data)=>{
        const receiver = users.get(data.to);
        if(receiver){
            receiver.emit('end');
        }
    })
    .on('disconnect', () => {
        users.remove('id');
        console.log(id, 'disconnected');
    })
}

module.exports = (server) => {
    console.log("___________")
    io({path: '/bridge', serveClient: false})
    .listen(server, {log: true})
    .on('connection', initSocket);
};
