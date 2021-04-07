var app = new Vue({
    el: '#app',
    data: {
      message: '00:00'
    }
  })

var socket = io()
//enviando
//setInterval(function(){
//    socket.emit('client/random', Math.random())
//  }, 2000)
//recibiendo
socket.on('server/random', function(num){
    app.message = num;
})

function uploadTime(){
    let time = document.getElementById("timeInput").value + ':00';
    console.log(time);
    //setInterval(function(){
    socket.emit('client/random', time)
  //}, 2000)
//recibiendo
}