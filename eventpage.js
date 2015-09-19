var app = {};

app.global = {
  systemState: 'awake'
};

app.init = function() {
  app.reminder.init();
};

app.reminder = {
  init: function() {
    if(!window.Notification) {
      if(!('Notification' in window)) {
        $('#notification').text('Sorry, your browser does not support the Web Notifications API.');
      } else {
        Notification.requestPermission(function(result) {
          if(result === 'default') {
            $('#notification').html('Desktop notifications must be allowed in order for this extension to run.');
          } else if (result === 'denied') {
            $('#notification').html('Desktop notifications must be allowed in order for this extension to run. Please allow notifications in Chrome Settings.');
          }
        });
      }
    }
    if(localStorage.saved) {
      userPreferences.loadDom();
      checkStatus();
    } else {
      userPreferences.init();
      userPreferences.save();
    }
    this.run();
  },

  run: function() {
    var prefs = userPreferences.getPreferences();
    var time = prefs.timeOption;
    console.log('run function ' + app.global.systemState);
    this.checkSystemState();
    //clear all pre-existing alarms so they won't overlap
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
    chrome.alarms.clear('walk');
    chrome.alarms.onAlarm.addListener(function(alarm) {
      if(alarm.name === 'walk') {
        chrome.idle.queryState(300, function(newState) {
          if(newState === 'active') {
            console.log('walk msg ' + newState);
            app.reminder.displayWalkMessage();
          } else {
            console.log('walk cancelled ' + newState);
          }
        });
      }
    });
    chrome.alarms.create('walk', {
      delayInMinutes: 61,
      periodInMinutes: 61
    });
  },

  timedReminder: function(time) {
    var queryTime;
    if(time > 5) {
      queryTime = (time * 60) - ((time * 60) - 240);
    } else {
      queryTime = 50;
    }
    chrome.alarms.clear('situp');
    chrome.alarms.onAlarm.addListener(function(alarm) {
      if(alarm.name === 'situp') {
        chrome.idle.queryState(queryTime, function(newState) {
          if(newState === 'active') {
            console.log('situp msg ' + newState);
            app.reminder.displayMessage();
          } else {
            console.log('situp cancelled ' + newState);
          }
        });
      }
    });
    chrome.alarms.create('situp', {
      delayInMinutes: parseInt(time),
      periodInMinutes: parseInt(time)
    });
  },

  checkSystemState: function() {
    chrome.idle.setDetectionInterval(60);
    chrome.idle.onStateChanged.addListener(function(newState) {
      if(newState === 'idle') {
        app.global.systemState = 'idle';
        console.log('state: idle');
      } else if(newState === 'locked') {
          app.global.systemState = 'locked';
          console.log('state: locked');
       } else {
        app.global.systemState = 'awake';
        console.log('state: awake');
      }
    });
  },

  renderMessage: function() {
    var postureBeginning =['Straighten up, ', 'Shoulders back, ', 'How\'s your posture, ', 'Beep, posture please, ', 'Check your posture, ', 'Sit up straight, ', 'Check yourself, ', 'No hunchbacks, ', 'At attention, ', 'Stop slumping, ', 'Mother always told you not to slouch, ', 'Sit up, ', 'Posture Reminder, ', 'Posture police, '],
       postureEnd = ['young grasshopper.', 'buddy.', 'amigo.', 'Quasimodo.', 'boss.', 'partner.', 'chap.', 'pal.', 'babe.'],
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
              }, 10000);
            }
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission(function(permission){
            if(permission === 'granted')  {
              var notification = new Notification(title, {
                      body: messageBody,
                      icon: 'img/spine.png'
                    });
              if(prefs.closeOption == 1) {
                  setTimeout(function() {
                    notification.close();
                  }, 10000);
                }
              } else {
                $('#notification').text('Desktop notifications must be allowed in order for this extension to run.');
                return;
              }
         });
       }
  },

  displayWalkMessage: function() {
    var title = 'Your Walk Reminder';
    var walkNotification = new Notification(title, {
      body: 'Get up! Take a walk, stretch!',
      icon: 'img/spine2.png',
      tag: 'Walk Reminder'
    });
    setTimeout(function() {
      walkNotification.close();
    }, 5000);
  }
};

//if user decides to disable reminders, disable all other options
$('input[name="default"]').mouseup(function() {
  if($('input[name="default"]:checked').val() == 1) {
    $('input[name="time"]').prop('disabled', true);
    $('input[name="close"]').prop('disabled', true);
    $('input[name="walk"]').prop('disabled', true);
  } else {
    $('input[name="time"]').prop('disabled', false);
    $('input[name="close"]').prop('disabled', false);
    $('input[name="walk"]').prop('disabled', false);
  }
});

$('#submit').click(function(e) {
  e.preventDefault();
  if(userPreferences.validateTime() === false) {
    return;
  } else {
    localStorage.setItem('saved', 'true');
    userPreferences.save();
    app.reminder.run();
  }
});

app.init();

