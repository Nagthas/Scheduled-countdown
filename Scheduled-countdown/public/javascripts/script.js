"use strict";
//--------------------------------------------------
// - Variables & Booleans
//--------------------------------------------------
var myLocalip = document.getElementById("myLocalip").textContent;
var myLocalipAndPort = myLocalip
console.log(myLocalipAndPort);
//--------------------------------------------------
var nowText = document.getElementById("now");
var nowTopRow = document.getElementById("nowTopRow");
var titleText = document.getElementById("title");
var startText = document.getElementById("start");
//--------------------------------------------------
var offsetTimeInit = 0;
var sendMin_To_countDownBoole = 0;
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
var socket = io.connect(myLocalipAndPort);
var playButton = document.querySelector('#play');
var countDownTimeInMS = "";
//--------------------------------------------------
function hideNowClock() {
  document.getElementById("centerNowText").style.display = "none";
  document.getElementById("titleContentBox").style.display = "block";
}
function ShowNowClock() {
  document.getElementById("centerNowText").style.display = "block";
  document.getElementById("titleContentBox").style.display = "none";
}
//--------------------------------------------------
//--------------------------------------------------

playButton.hidden = false
function startPlayback() {
  return document.querySelector('.countDownSound').play();
}
startPlayback().then(function() {
  //console.log('The play() Promise fulfilled! Rock on!');
}).catch(function(error) {
  //console.log('The play() Promise rejected!');
  //console.log('Use the Play button instead.');
  console.log(error);
  // The user interaction requirement is met if
  // playback is triggered via a click event.
  playButton.addEventListener('click', startPlayback);
});
$("#play").on('click', function () {
  playButton.hidden = true;
});


socket.on("centerTextContent", function(data){
  nowText.textContent   = data.newCurrentTime,
  nowTopRow.textContent = data.newCurrentTime,
  titleText.textContent = data.startTitleHolder,
  startText.textContent = data.countDownString,
  countDownTimeInMS     = data.countDownTimeInMS,
  offsetTimeInit        = data.offsetTimeInit

    if (data.showNowClock === true) {
      ShowNowClock();
    }else{
      hideNowClock();
    }
        // Audio Alarms
        //--------------------------------------------------
        var timeBuffer    = 1*1000
        var sixMinuteMs  = (6*1000*60);
        var fiveMinuteMs  = (5*1000*60);
        var fourMinuteMs  = (4*1000*60);
        var threeMinuteMs = (3*1000*60);
        var twoMinuteMs   = (2*1000*60);
        var oneMinuteMs   = (1*1000*60);
        countDownTimeInMS += offsetTimeInit


        //  6larm
        if (countDownTimeInMS > sixMinuteMs && countDownTimeInMS < (sixMinuteMs + timeBuffer)) {
          document.getElementById('musiclong6').play();
        }
        // 5min Alarm
        if (countDownTimeInMS > fiveMinuteMs && countDownTimeInMS < (fiveMinuteMs + timeBuffer)) {
          document.getElementById('music5').play();

          if (sendMin_To_countDownBoole != 5){
            sendMin_To_countDownBoole = 5;
            socket.emit("fiveMinPageLoad_To_Socket",{countDownTime: sendMin_To_countDownBoole});

          };
        }
        // 4min Alarm
        if (countDownTimeInMS > fourMinuteMs && countDownTimeInMS < (fourMinuteMs + timeBuffer)) {
          document.getElementById('musiclong4').play();

          if (sendMin_To_countDownBoole != 4){
            sendMin_To_countDownBoole = 4;
            socket.emit("fiveMinPageLoad_To_Socket",{countDownTime: sendMin_To_countDownBoole});
          };
        }
        // 3min Alarm
        if (countDownTimeInMS > threeMinuteMs && countDownTimeInMS < (threeMinuteMs + timeBuffer)) {
          document.getElementById('music3').play();

          if (sendMin_To_countDownBoole != 3){
            sendMin_To_countDownBoole = 3;
            socket.emit("fiveMinPageLoad_To_Socket",{countDownTime: sendMin_To_countDownBoole});

          };
        }
        // 2min Alarm
        if (countDownTimeInMS > twoMinuteMs && countDownTimeInMS < (twoMinuteMs + timeBuffer)) {
          document.getElementById('musiclong2').play();

          if (sendMin_To_countDownBoole != 2){
            sendMin_To_countDownBoole = 2;
            socket.emit("fiveMinPageLoad_To_Socket",{countDownTime: sendMin_To_countDownBoole});

          };
        }
        // 1min Alarm
        if (countDownTimeInMS > oneMinuteMs && countDownTimeInMS < (oneMinuteMs + timeBuffer)) {
          document.getElementById('music1').play();

          if (sendMin_To_countDownBoole != 1){
            sendMin_To_countDownBoole = 1;
            socket.emit("fiveMinPageLoad_To_Socket",{countDownTime: sendMin_To_countDownBoole});

          };
        }
        // 0min Alarm
        if (countDownTimeInMS > 0 && countDownTimeInMS < (0 + timeBuffer)) {;

          if (sendMin_To_countDownBoole != 0){
            sendMin_To_countDownBoole = 0;
            socket.emit("fiveMinPageLoad_To_Socket",{countDownTime: sendMin_To_countDownBoole});

          };
        }
        //--------------------------------------------------


});
