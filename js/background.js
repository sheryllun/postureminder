var app = {};

app.global = {
  systemState1: 'active',
  systemState2: 'active',
  firefoxCompat: false
};

/* Firefox does not implement getPermissionLevel, so return "granted" permissions by default */
if (!('getPermissionLevel' in chrome.notifications)) {
  chrome.notifications.getPermissionLevel = function(callback) {
    callback("granted");
  };

  app.global.firefoxCompat = true;
}

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
      userPreferences.init(15, 60, 20);
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
    if(prefs.enabledOption != 'checked') {
      userPreferences.disableQuestions(true);
      return;
    } else {
      this.timedReminder(time);
    }
   // enable walk reminder
    if(prefs.walkOption == 'checked') {
      this.timedWalkReminder(prefs.walkTimeOption);
    } else {
      chrome.alarms.clear('walk');
    }
  },
  timedWalkReminder: function(time) {
    chrome.alarms.create('walk', {
      delayInMinutes: parseInt(time),
      periodInMinutes: parseInt(time)
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
    var prefs = userPreferences.getPreferences();
    var fullMessage;
    var messages = ['Straighten up', 'Shoulders back', 'Check your posture', 'Sit up straight', 'Check yourself', 'Stop slumping', 'Posture Reminder', 'Stop slouching', 'Posture check', 'Improve your posture', 'Mind your posture'];
    
    if (prefs.snarkinessOption == 'checked') {
      var snarkyBeginning = messages.concat(['How\'s your posture', 'No hunchbacks', 'At attention', 'Mother told you not to slouch', 'Sit up', 'Posture police', 'Back straight', 'Dump the slump', 'No bent spines']);
      snarkyEnd = ['young grasshopper', 'buddy', 'amigo', 'Quasimodo', 'boss', 'partner', 'chap', 'pal', 'soldier', 'chum', 'mate', 'friend', 'comrade', 'cuz', 'homie'],
      begInt = Math.floor(Math.random() * snarkyBeginning.length),
      endInt = Math.floor(Math.random() * snarkyEnd.length);
      fullMessage = `${snarkyBeginning[begInt]}, ${snarkyEnd[endInt]}.`;
    } else {
      var msgInt = Math.floor(Math.random() * messages.length);
      fullMessage = `${messages[msgInt]}.`;
    }
    console.log(fullMessage);
    return fullMessage;
  },
  displayMessage: function() {
      var prefs = userPreferences.getPreferences();
      var fadeTime = parseInt(prefs.fadeTimeOption) * 1000;
      var notificationSound = new Audio('/../audio/notification.mp3');
      var opt = {
        type: 'basic',
        title: 'Your PostureMinder',
        message: this.renderMessage(),
        iconUrl: 'img/spine.png',
        requireInteraction: false
      };

      // remove property for compatibility with Firefox
      if (app.global.firefoxCompat) {
        delete opt.requireInteraction;
        Object.freeze(opt);
      }

      chrome.notifications.getPermissionLevel(function(permission) {
        if(permission === "granted") {
            if(prefs.closeOption == 1) {
                opt.requireInteraction = false;
                setTimeout(function() {
                  chrome.notifications.clear('sitNotification');
                }, fadeTime);
              } else {
                opt.requireInteraction = true;
              }

              chrome.notifications.create('sitNotification', opt);
              if(prefs.soundOption === 'checked') {
                notificationSound.play();
              }
          } else {
              $('#notification').text('Desktop notifications must be allowed in order for this extension to run.');
              return false;
            }
      });

  },
  displayWalkMessage: function() {
    var prefs = userPreferences.getPreferences();
    var opt = {
      type: 'basic',
      title: 'Your Walk Reminder',
      message: 'Time to get up and stretch! Take a break.',
      iconUrl: 'img/spine2.png',
      requireInteraction: false
    };

    // remove property for compatibility with Firefox
    if (app.global.firefoxCompat) {
      delete opt.requireInteraction;
      Object.freeze(opt);
    }

    if(prefs.closeOption == 1) {
      opt.requireInteraction = false;
      setTimeout(function() {
        chrome.notifications.clear('walkNotification');
      }, parseInt(prefs.fadeTimeOption) * 1000);
    } else {
      opt.requireInteraction = true;
    }

    chrome.notifications.create('walkNotification', opt);
  }
};

//if user decides to disable reminders, disable all other options
$('input[name="default"]').click(function() {
  var bool = false;

  if(!$(this).prop('checked')) {
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

$('#walk').change(function() {
  $('#walkTime').prop('disabled', !this.checked);
});

$('input[name="close"]').change(function() {
  $('#fadeTime').prop('disabled', $(this).val() != 1);
});

app.init();

//Make sure event listeners are set after extension is added or updated
chrome.runtime.onInstalled.addListener(function () {
  chrome.alarms.onAlarm.removeListener(app.reminder.walkListener);
  chrome.alarms.onAlarm.removeListener(app.reminder.sitListener);
  chrome.alarms.onAlarm.addListener(app.reminder.walkListener);
  chrome.alarms.onAlarm.addListener(app.reminder.sitListener);
  app.reminder.run();
});

chrome.runtime.onStartup.addListener(function() {
  chrome.alarms.onAlarm.removeListener(app.reminder.walkListener);
  chrome.alarms.onAlarm.removeListener(app.reminder.sitListener);
  chrome.alarms.onAlarm.addListener(app.reminder.walkListener);
  chrome.alarms.onAlarm.addListener(app.reminder.sitListener);
  app.reminder.run();
});