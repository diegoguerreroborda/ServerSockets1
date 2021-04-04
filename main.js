const express = require('express')
const socketio = require('socket.io')
const http = require('http')

const app = express()
//creando el server con http y express como handle request
const server = http.createServer(app)
//iniciando el server de socket.io
const io = socketio(server)
const PORT = process.env.PORT || 3000

//middleware de express para archivos estaticos
app.use(express.static('public'))

let currenTime = new Date();

function getDateTime() {
    //var date = new Date(currenTime);
    var hour = currenTime.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = currenTime.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = currenTime.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    
    currenTime.setSeconds(currenTime.getSeconds() + 2);
    return hour + ":" + min + ":" + sec;
}

function convertToDate(currentD){
    var pieces = currentD.split(':')
    if(pieces.length === 3) {
        let hour = parseInt(pieces[0], 10);
        let minute = parseInt(pieces[1], 10);
        let second = parseInt(pieces[2], 10);
        currenTime.setHours(hour)
        currenTime.setMinutes(minute)
        currenTime.setSeconds(second)
    }
}

io.on('connection', function (socket) {
    console.log(`client: ${socket.id}`)
    //enviando al cliente
    setInterval(() => {
        console.log('mensaje enviado')
        socket.emit('server/random', getDateTime())
    }, 2000)
    //recibiendo del cliente
    socket.on('client/random', (currentT) => {
        console.log(currentT)
        convertToDate(currentT)
    })
})

server.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`)
})