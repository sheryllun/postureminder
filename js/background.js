var app = {};

app.global = {
  systemState1: 'active',
  systemState2: 'active',
};

app.init = function() { app.reminder.init(); };

app.reminder = {
  init: function() {
    chrome.alarms.onAlarm.addListener(app.reminder.walkListener);
    chrome.alarms.onAlarm.addListener(app.reminder.sitListener);
    app.reminder.checkSystemState();
    if(localStorage.saved) {
      userPreferences.loadDom();
      checkStatus();
    } else {
      userPreferences.init(15);
    }
    if(localStorage.firstRun === 'done') {
      return;
      } else {
      app.reminder.run();
      localStorage.setItem('firstRun', 'done');
    }
  },
  run: function() {
    var prefs = userPreferences.getPreferences();
    var time = prefs.timeOption;
    chrome.alarms.clearAll();
    //if reminders are disabled, turn it all off. 
    if(prefs.enabledOption == 0) {
      userPreferences.disableQuestions(true);
      return;
    } else {
      this.timedReminder(time);
    }
   // enable walk reminder
    if(prefs.walkOption == 'checked') {
      this.timedWalkReminder();
    } else {
      chrome.alarms.clear('walk');
    }
  },
  timedWalkReminder: function() {
    chrome.alarms.create('walk', {
      delayInMinutes: 61,
      periodInMinutes: 61
    });
  },
  timedReminder: function(time) {
    chrome.alarms.create('situp', {
      delayInMinutes: parseInt(time),
      periodInMinutes: parseInt(time)
    });
  },
  setIdleTime: function() {
    var prefs = userPreferences.getPreferences();
    var time = prefs.timeOption;
    var queryTime = 30; //seconds
    if(time > 5) {
      queryTime = (time * 60) - ((time * 60) - 240); //4 minutes
    }
    return queryTime;
  },
  sitListener: function(alarm) {
    var queryTime = app.reminder.setIdleTime();
    if(alarm.name === 'situp') {
      chrome.idle.queryState(queryTime, function(newState) {
        if(newState === 'active') {
          app.reminder.displayMessage();
        } 
      });
    }
  },
  walkListener: function(alarm) {
    if(alarm.name === 'walk') {
      chrome.idle.queryState(300, function(newState) {
        if(newState === 'active') {
          app.reminder.displayWalkMessage();
        }
      });
    }
  },
  checkSystemState: function() {
    chrome.idle.setDetectionInterval(60);
    chrome.idle.onStateChanged.addListener(function(newState) {
      if(newState === 'idle') {
        app.global.systemState2 = 'idle';
      } else if(newState === 'locked') {
          app.global.systemState2 = 'locked';
       } else {
        app.global.systemState2 = 'awake';
      }
      app.reminder.manageAlarms();
    });
  },
  manageAlarms: function() {
    if(app.global.systemState2 === 'locked') {
      chrome.alarms.clearAll();
    } else if (app.global.systemState2 === 'awake' && app.global.systemState1 === 'locked') {
      this.run();
    }
    app.global.systemState1 = app.global.systemState2;
  },
  renderMessage: function() {
    var postureBeginning =['Straighten up, ', 'Shoulders back, ', 'How\'s your posture, ', 'Check your posture, ', 'Sit up straight, ', 'Check yourself, ', 'No hunchbacks, ', 'At attention, ', 'Stop slumping, ', 'Mother told you not to slouch, ', 'Sit up, ', 'Posture Reminder, ', 'Posture police, ', 'Stop slouching, ', 'Back straight, ', 'Dump the slump, ', 'Posture check, '],
       postureEnd = ['young grasshopper.', 'buddy.', 'amigo.', 'Quasimodo.', 'boss.', 'partner.', 'chap.', 'pal.', 'soldier', 'chum.', 'mate.', 'friend.', 'comrade.', 'cuz.', 'homie.'],
       begInt = Math.floor(Math.random() * postureBeginning.length),
       endInt = Math.floor(Math.random() * postureEnd.length),
       fullMessage = postureBeginning[begInt] + postureEnd[endInt];
      return fullMessage;
    },
  displayMessage: function() {
      var prefs = userPreferences.getPreferences();
      var title = 'Your PostureMinder';
      var messageBody = this.renderMessage();
      if(Notification.permission === "granted") {
          var notification = new Notification(title, {
            body: messageBody,
            icon: 'img/spine.png',
            tag: 'Posture Reminder'
          });
          if(prefs.closeOption == 1) {
              setTimeout(function() {
                notification.close();
              }, 20000);
            }
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission(function(permission){
            if(permission === 'granted')  {
              var sitNotification = new Notification(title, {
                      body: messageBody,
                      icon: 'img/spine.png'
                    });
              if(prefs.closeOption == 1) {
                  setTimeout(function() {
                    sitNotification.close();
                  }, 20000);
                }
              } else {
                $('#notification').text('Desktop notifications must be allowed in order for this extension to run.');
                return;
              }
         });
       }
  },
  displayWalkMessage: function() {
    var prefs = userPreferences.getPreferences();
    var title = 'Your Walk Reminder';
    var walkNotification = new Notification(title, {
      body: 'Time to get up and stretch! Take a break.',
      icon: 'img/spine2.png',
      tag: 'Walk Reminder'
    });
    if(prefs.closeOption == 1) {
      setTimeout(function() {
        walkNotification.close();
      }, 20000);
    }
  }
};

//if user decides to disable reminders, disable all other options
$('input[name="default"]').mouseup(function() {
  var bool = false;
  if($('input[name="default"]:checked').val() == 1) {
    bool = true;
  } 
  userPreferences.disableQuestions(bool);
  $('.savemsg').show();
});

$('#submit').click(function(e) {
  e.preventDefault();
  $('.savemsg').hide();
  if(userPreferences.validateTime() === false) {
    return;
  } else {
    userPreferences.save();
    app.reminder.run();
  }
});

app.init();

chrome.runtime.onStartup.addListener(function() {
  app.reminder.run();
});
