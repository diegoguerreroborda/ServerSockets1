const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.json())
//creando el server con http y express como handle request
const server = http.createServer(app)
//iniciando el server de socket.io
const io = socketio(server)
const PORT = process.argv[2] || 3000

//middleware de express para archivos estaticos
app.use(express.static('public'))

//let currenTime = new Date();
let hourGlobal = new Date();

function getDateTime() {
    //var date = new Date(currenTime);
    var hour = hourGlobal.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = hourGlobal.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = hourGlobal.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    
    hourGlobal.setSeconds(hourGlobal.getSeconds() + 2);
    return hour + ":" + min + ":" + sec;
}

function convertToDate(currentD){
    var pieces = currentD.split(':')
    let currenTime = new Date()
    if(pieces.length === 3) {
        let hour = parseInt(pieces[0], 10);
        let minute = parseInt(pieces[1], 10);
        let second = parseInt(pieces[2], 10);
        currenTime.setHours(hour)
        currenTime.setMinutes(minute)
        currenTime.setSeconds(second)
        return currenTime;
    }
}

//Entra una hora, sale la diferencia.
function getDiference(hourC){
    console.log(hourGlobal.getMinutes(), "***", hourC.getMinutes())
    let dif = hourGlobal.getTime() - hourC.getTime()
    //differences.push(dif)
    console.log('diferencesss', (dif/60000)); 
    return (dif/60000).toFixed();
}

io.on('connection', function (socket) {
    console.log(`client: ${socket.id}`)
    //enviando al cliente
    setInterval(() => {
        socket.emit('server/random', getDateTime())
    }, 2000)
    //recibiendo del cliente
    socket.on('client/random', (currentT) => {
        console.log(currentT)
        hourGlobal = convertToDate(currentT)
    })
})

app.post('/', (req, res) => {
    console.log(req.body.time)
    //getDiference(req.body.time)
    //Resta el que llega de el getDateTime()
    //res.send('sdsd')
    let hourC = convertToDate(req.body.time);
    //console.log('hourC', hourC)
    res.send(getDiference(hourC))
})

app.post('/fixed', (req, res) => {
    console.log('fixed', req.body.time)
    let hourF = convertToDate(req.body.time);
    console.log('Hora que llega')
    console.log(hourF.getHours())
    console.log(hourF.getMinutes())
    console.log(hourF.getSeconds())
    console.log('::::::::::::::::')
    let desface = hourGlobal - hourF;
    //console.log(hourGlobal)
    //console.log(hourF)
    console.log('Desface', desface)
    //console.log(desface/60000)
    hourGlobal.setHours(hourF.getHours())
    hourGlobal.setMinutes(hourF.getMinutes())
    hourGlobal.setSeconds(hourF.getSeconds())
    console.log(hourGlobal.getHours())
    console.log(hourGlobal.getMinutes())
    console.log(hourGlobal.getSeconds())
    //let r = desface/60000;
    //hourGlobal = hourF;
    //restar horas y enviar el desface

    //No permite enviar números
    res.send('Listo perros')

    //console.log('hourC', hourC)
    //res.send(getDiference(hourC))
})

server.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`)
})

//Cuando pasa de una hora a otra se pone una hora mas de lo que es.