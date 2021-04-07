const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.json())
const server = http.createServer(app)
const io = socketio(server)
const PORT = process.argv[2] || 3000

app.use(express.static('public'))

//let currenTime = new Date();
let hourGlobal = new Date();

//Los datos para la tabla
let dataTable = []

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

function getHourString(hourC){
    return `${hourC.getHours()}:${hourC.getMinutes()}:${hourC.getSeconds()}`;
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
    //socket.disconnected = true;
    //socket.connected = false;
    console.log(`client: ${socket.id}`)
    console.log(socket)
    //enviando al cliente
    setInterval(() => {
        socket.emit('server/random', getDateTime())
        socket.emit('server/list_data_fixed', dataTable)
    }, 2000)
    //recibiendo del cliente
    socket.on('client/random', (currentT) => {
        console.log(currentT)
        dataTable.push({oldHour: getHourString(hourGlobal), newHour: currentT})
        hourGlobal = convertToDate(currentT)
    })
})

app.post('/', (req, res) => {
    console.log(req.body.time)
    let hourC = convertToDate(req.body.time);
    res.send(getDiference(hourC))
})

app.post('/fixed', (req, res) => {
    console.log('fixed', req.body.time)
    let hourF = convertToDate(req.body.time);
    console.log('Hora que llega')
    console.log(`${hourF.getHours()}:${hourF.getMinutes()}:${hourF.getSeconds()}`)
    let desface = hourGlobal - hourF;
    //hourGlobal
    console.log('Desface', desface/60000)
    dataTable.push({oldHour: getHourString(hourGlobal), ajuste: (desface/60000), newHour: getHourString(hourF)})
    hourGlobal.setHours(hourF.getHours())
    hourGlobal.setMinutes(hourF.getMinutes())
    hourGlobal.setSeconds(hourF.getSeconds())
    console.log(`${hourGlobal.getHours()}:${hourGlobal.getMinutes()}:${hourGlobal.getSeconds()}`)
    res.json(desface/60000)
})

app.get('/list_data', (req, res) => {
    console.log(dataTable)
    res.send(dataTable)
})
/*
app.get('/list_fixed_hour', (req, res) => {
    console.log(tableManualFixed)
    res.send(tableManualFixed)
})
*/

server.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`)
})