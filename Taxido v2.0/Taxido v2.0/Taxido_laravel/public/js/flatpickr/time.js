// time
function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    // var s = today.getSeconds();
    var ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    m = checkTime(m);
    // s = checkTime(s);
    // document.getElementById('txt').innerHTML =
    //     h + ":" + m + ' ' + ampm;
    var t = setTimeout(startTime, 500);
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i
    }; // add zero in front of numbers < 10
    return i;
}


// Current time

var span = document.getElementById('current-time');

function time() {
  var d = new Date();
//   var s = d.getSeconds();
  var m = d.getMinutes();
  var h = d.getHours();
  span.textContent = 
    // ("0" + h).substr(-2) + ":" + ("0" + m).substr(-2) + ":" + ("0" + s).substr(-2);
    ("0" + h).substr(-2) + ":" + ("0" + m).substr(-2);
}

setInterval(time, 1000);