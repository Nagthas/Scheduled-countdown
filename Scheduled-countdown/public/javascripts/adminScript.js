var startTimeArray = [];
var startTitleArray = [];
var cueLengthArray = [];
var offsetTimejson = [];
var offsetTimeInit = [];
var scheduledTimesArrayGlobal = [];
var scheduledTimesArrayBuffer = [];
var nowTopRow = document.getElementById("nowTopRow");
var cueTimeText = document.getElementById("cueTime");
var setTimeoutTime = 150;
var myIpArrayBool = 0;

var myLocalip = document.getElementById("myLocalip").textContent;
var myLocalipAndPort = myLocalip
console.log(myLocalipAndPort);

//------
var scheduledTimesPath_Local        = [];
var scheduledTimesBackupPath_Local  = [];
var variables_Local                 = [];
var myip_Local                      = [];
//------

const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
var offsetTime = document.getElementById("offsetTime");


//--------------------------------------------------
// - getscheduledTimes
//--------------------------------------------------
function getscheduledTimes() {
  const request = async () => {
    const response = await fetch(scheduledTimesPath_Local);
    console.log("scheduledTimesPath_Local in -> getscheduledTimes: ------");
    console.log(scheduledTimesPath_Local);
    const json = await response.json();
    scheduledTimesArray = json;
    //console.log(scheduledTimesArray.profiles[0].title);
    //----------------------------------------
    var i;
    var a;
    var b;
    var c;
    startTimeArray = [];
    startTitleArray = [];
    cueLengthArray = [];
    for (i = 0; i < scheduledTimesArray.profiles.length; i++) {
      a = scheduledTimesArray.profiles[i].title;
      startTitleArray.push(a);
      b = scheduledTimesArray.profiles[i].startTime;
      startTimeArray.push(b);
      c = scheduledTimesArray.profiles[i].cueLength;
      cueLengthArray.push(c);
      //----------------------------------------
    }
  }

  request();
};
//getscheduledTimes();
//--------------------------------------------------

//--------------------------------------------------
// - deleteIndexInScheduledTimes
//--------------------------------------------------
function deleteIndexInScheduledTimes(index) {
  const request = async () => {
    const response = await fetch(scheduledTimesPath_Local);
    const json = await response.json();
    scheduledTimesArray = json;
    console.log("deleteIndexInScheduledTimes");
    console.log(scheduledTimesArray.profiles[index]);
    scheduledTimesArray.profiles.splice(index, 1);

    //----------------------------------------
    var i;
    var a;
    var b;
    var c;
    startTimeArray = [];
    startTitleArray = [];
    cueLengthArray = [];
    for (i = 0; i < scheduledTimesArray.profiles.length; i++) {
      a = scheduledTimesArray.profiles[i].title;
      startTitleArray.push(a);
      b = scheduledTimesArray.profiles[i].startTime;
      startTimeArray.push(b);
      c = scheduledTimesArray.profiles[i].cueLength;
      cueLengthArray.push(c);
    }
    //----------------------------------------
    console.log("here i am");
    sendDB_To_Socket_On_Delete();
  }

  request();
};
//deleteIndexInScheduledTimes();
//--------------------------------------------------

//--------------------------------------------------
// - getOffsetTime
//--------------------------------------------------
function getOffsetTime() {
  const request = async () => {
    const response = await fetch(variables_Local);
    const json = await response.json();
    offsetTimejson = json;
    //console.log("Get offsetTime: "+offsetTimejson.offsetTime);
    offsetTimeInit = offsetTimejson.offsetTime;
  }

  request();
};
//getOffsetTime();
//--------------------------------------------------

//--------------------------------------------------
var socket = io.connect(myLocalipAndPort);
//---------- My sockets
socket.emit("start", {});

sleep(1000).then(() => {
  //console.log(startTitleArray);
  //console.log(startTimeArray);
  socket.emit("sendDB_To_Socket", {
    startTitleArray: startTitleArray,
    startTimeArray: startTimeArray,
    cueLengthArray: cueLengthArray
  });
});
//--------------------------------------------------

//---------- I think i can delete this
//--------------------------------------------------
socket.on("sendDB_TO_Admin", function(data) {
  startTimeArray = data.socketDBArray.startTimeArray;
  startTitleArray = data.socketDBArray.startTitleArray;
  cueLengthArray = data.socketDBArray.cueLengthArray;

  scheduledTimesPath_Local        = data.scheduledTimesPath_Local;
  scheduledTimesBackupPath_Local  = data.scheduledTimesBackupPath_Local,
  variables_Local                 = data.variables_Local,
  myip_Local                      = data.myip_Local,
  console.log(scheduledTimesPath_Local);
  console.log(scheduledTimesBackupPath_Local);
  console.log(variables_Local);
  console.log(myip_Local);
});
//--------------------------------------------------



$("#sorting").on('click', function() {
  socket.emit("sortingButton_To_Socket", {})

});
$("#updateScheduledTimesArray").on('click', function() {
  socket.emit("updatebutton_To_Socket", {})
});
$("#offsetPlus").on('click', function() {
  offsetTimeInit += 1;
  socket.emit('updateOffsetTimePlus', {
    offsetTime: offsetTimeInit
  });
});
$("#offsetMinus").on('click', function() {
  offsetTimeInit -= 1;
  //$("#offsetTime").html(offsetTimeInit);
  socket.emit('updateOffsetTimeMinus', {
    offsetTime: offsetTimeInit
  });
});
$("#offsetReset").on('click', function() {
  offsetTimeInit = 0;
  //$("#offsetTime").html(offsetTimeInit);
  socket.emit('updateOffsetTimeReset', {
    offsetTime: offsetTimeInit
  });
});
$("#loadDefaultArray").on('click', function() {
  console.log("loadDefaultArray");
  socket.emit('loadDefaultToSocket', {
    message: "loadDefaultToSocket: Sent"
  });

  sleep(250).then(() => {
    window.location.reload(true)
  });

});
$("#writeDefaultArray").on('click', function() {
  console.log("writeDefaultArray");

  getElementsToArrays();

  sleep(100).then(() => {
    console.log("AFTER SLEEP: " + startTitleArray);
    socket.emit('writeDefaultToSocket', {
      startTitleArray: startTitleArray,
      startTimeArray: startTimeArray,
      cueLengthArray: cueLengthArray
    });

  });

});
$("#addNewRow").on('click', function() {
  console.log("addNewRow");
  socket.emit("send_addNewRow_To_Socket", {})

  sleep(1500).then(() => {
    //sortscheduledTimes();
    window.location.reload(true)
  });
});
//--------------------------------------------------
//--------------------------------------------------
socket.on("updatebutton_From_Socket", function(data) {
  updateScheduledTimesArray();
})
socket.on("updateDB_From_Socket", function(data) {
  //console.log("updateDB_From_Socket: ");
  startTimeArray = data.startTimeArray;
  startTitleArray = data.startTitleArray;
  cueLengthArray = data.cueLengthArray;
  sleep(100).then(() => {
    printArraysToElements();
  });
});
socket.on("pushGetscheduledTimes", function(data) {
  console.log("pushGetscheduledTimes: ");
  getscheduledTimes();

  sleep(100).then(() => {
    printArraysToElements();
  });

});
socket.on("sortingButton_From_Socket", function(data) {
  console.log("knapp funkar");

  updateScheduledTimesArray();
  sleep(750).then(() => {
    //sortscheduledTimes();
    window.location.reload(true)

    sleep(1000).then(() => {
      //document.location.reload();
    });

  });

})
socket.on("updateOffsetTime_From_Socket", function(data) {
  console.log("updateOffsetTime_From_Socket");
  console.log(data);
  offsetTimeInit = data.offsetTime;
  $("#offsetTime").html(offsetTimeInit);
});
socket.on("getCueTimeString_From_Socket", function(data) {
  cueTimeText.textContent = data.string;
});
socket.on("send_Delete_Button_from_Socket", function(data) {
  console.log(data);
  listIndex = data.listIndex
  console.log("send_Delete_Button_from_Socket: listIndex= " + listIndex);

  document.getElementById(listIndex).remove();
  deleteIndexInScheduledTimes(listIndex);
  sleep(1000).then(() => {
    window.location.reload(true)
  });
})
socket.on("centerTextContent", function(data) {
  nowTopRow.textContent = data.newCurrentTime
});
socket.on("sendIpArrayToAdminPage", function(data){
  // console.log("sendIpArrayToAdminPage");
  // console.log(data.myIpArray);

  var select = document.getElementById("selectNumber");
  var options = data.myIpArray;

  if (myIpArrayBool != 1) {
    for(var i = 0; i < options.length; i++) {
        var opt = options[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
        myIpArrayBool =1;
    }
  }


});
//--------------------------------------------------
//--------------------------------------------------
function updateScheduledTimesArray() {
  console.log("updateScheduledTimesArray");
  for (let i = 0; i < startTitleArray.length; i++) {
    startTitleArray[i] = $("#title" + i).val()
  }
  for (let i = 0; i < startTimeArray.length; i++) {
    startTimeArray[i] = $("#startTime" + i).val()
  }
  for (let i = 0; i < cueLengthArray.length; i++) {
    cueLengthArray[i] = $("#cueLength" + i).val()
  }

  console.log(cueLengthArray);
  //console.log("startTitleArray after: "+startTitleArray + startTimeArray);
  socket.emit("writeToScheduledTimesjson", {
    startTitleArray: startTitleArray,
    startTimeArray: startTimeArray,
    cueLengthArray: cueLengthArray
  });
  socket.emit('updateScheduledTimesArray', {
    startTitleArray: startTitleArray,
    startTimeArray: startTimeArray,
    cueLengthArray: cueLengthArray
  });

  sleep(1000).then(() => {
    getscheduledTimes();
  });
};
function delete_button_click(listIndex) {
  socket.emit("send_Delete_Button_To_Socket", {
    listIndex: listIndex
  });
};
function printArraysToElements() {
  console.log("printArraysToElements");
  console.log(startTitleArray);
  for (let i = 0; i < startTitleArray.length; i++) {
    document.getElementById("title" + i).value = startTitleArray[i]
  };
  for (let i = 0; i < startTimeArray.length; i++) {
    document.getElementById("startTime" + i).value = startTimeArray[i]
  };
  for (let i = 0; i < cueLengthArray.length; i++) {
    document.getElementById("cueLength" + i).value = cueLengthArray[i]
  };


};
function getElementsToArrays() {
  console.log("getElementsToArrays()");
  for (let i = 0; i < startTitleArray.length; i++) {
    startTitleArray[i] = $("#title" + i).val()
  }
  for (let i = 0; i < startTimeArray.length; i++) {
    startTimeArray[i] = $("#startTime" + i).val()
  }
  for (let i = 0; i < cueLengthArray.length; i++) {
    cueLengthArray[i] = $("#cueLength" + i).val()
  }
  console.log(startTimeArray);
};
function sendDB_To_Socket_On_Delete() {
  console.log("sendDB_To_Socket_On_Delete")

  socket.emit("writeToScheduledTimesjson", {
    startTitleArray: startTitleArray,
    startTimeArray: startTimeArray,
    cueLengthArray: cueLengthArray
  });
  socket.emit('updateScheduledTimesArray', {
    startTitleArray: startTitleArray,
    startTimeArray: startTimeArray,
    cueLengthArray: cueLengthArray
  });

};
function saveMyIpTo_myipjson(myChosenIp){
  var e = document.getElementById("selectNumber");
  var strUser = e.options[e.selectedIndex].value;
  console.log("---------------------: "+strUser);

  socket.emit("sendChosenIp_To_Socket",{myChosenIp:strUser})
};
