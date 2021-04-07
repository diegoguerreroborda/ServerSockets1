var app = new Vue({
    el: '#app',
    data: {
      message: '00:00'
    }
})

var app2 = new Vue({
  el: '#app-2',
  data: {
      data_hours: []
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

socket.on('server/list_data_fixed', function(data){
  app2.data_hours = [];
  for(let i=0; i <= data.length; i++){
    app2.data_hours.push({localHour: data[i]['oldHour'], ajuste: data[i]['ajuste'], newHour:data[i]['newHour']});
  }
})

function uploadTime(){
    let time = document.getElementById("timeInput").value + ':00';
    console.log(time);
    //setInterval(function(){
    socket.emit('client/random', time)
  //}, 2000)
//recibiendo
}