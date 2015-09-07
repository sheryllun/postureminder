$(document).ready(function() {
  //if Chrome Notifications not supported, try the Web Notifications API.
  // if(!chrome.notifications) {
  if(!window.Notification) {
    if(!('Notification' in window)) {
      $('#notification').text('Sorry, your browser does not support the Web Notifications API.');
    } 
    else {
      Notification.requestPermission(function(result) {
        if(result === 'default') {
          $('#notification').html('Desktop notifications must be allowed in order for this extension to run. <span id="request">Allow notifications</span>');
        } else if (result === 'denied') {
          $('#notification').html('Desktop notifications must be allowed in order for this extension to run. Please remove notification blocking from Chrome Settings. ');
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

  reminder.run();

});

var reminder = {

  systemState: 'awake',

  run: function() {
    var prefs = userPreferences.getPreferences();
    var time = prefs.timeOption;
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
        if(reminder.systemState === 'awake') {
          console.log('walk alarm');
          reminder.displayWalkMessage();
        } else {
          console.log('walk message cancelled');
        }
      }
    });

    chrome.alarms.create('walk', {
      delayInMinutes: 60,
      periodInMinutes: 60
    });
  },

  timedReminder: function(time) {
    chrome.alarms.clear('situp');

    chrome.alarms.onAlarm.addListener(function(alarm) {
      if(alarm.name === 'situp') {
        if(reminder.systemState === 'awake') {
          console.log(reminder.systemState + ' situp msg');
          reminder.displayMessage();
        } else {
          console.log('situp message cancelled');
        }
      }
    });

    chrome.alarms.create('situp', {
      when: Date.now() + (time * 60000),
      periodInMinutes: parseInt(time)
    });
  },

  renderMessage: function() {
    var postureBeginning =['Straighten up, ', 'Shoulders back, ', 'How\'s your posture, ', 'Beep, posture please, ', 'Check your posture, ', 'Sit up straight, ', 'Check yourself, ', 'No hunchbacks, ', 'At attention, ', 'Stop slumping, ', 'Mother always told you not to slouch, ', 'Sit up, ', 'Posture Reminder, ', 'Posture police, '],
       postureEnd = ['young grasshopper.', 'buddy.', 'amigo.', 'Quasimodo.', 'boss.'],
       begInt = Math.floor(Math.random() * postureBeginning.length),
       endInt = Math.floor(Math.random() * postureEnd.length),
       fullMessage = postureBeginning[begInt] + postureEnd[endInt];
        return fullMessage;
    },

  displayMessage: function() {
      var prefs = userPreferences.getPreferences();
      var title = 'Your PostureMinder';
      var messageBody = reminder.renderMessage();
      // var options = {
      //   type: 'basic',
      //   title: 'Your PostureMinder',
      //   message: messageBody,
      //   iconUrl: 'img/spine.png',
      //   priority: 0
      // };

      // if(chrome.notifications) {
      //     chrome.notifications.clear('PostureMinder');
      //     chrome.notifications.create('PostureMinder', options);
      // }
      // } else 
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


  // $('#message').click(function() {
  //   chrome.alarms.getAll(function(result) {
  //     chrome.extension.getBackgroundPage().console.log(result);
  //   });
  // });

  $('#submit').click(function(e) {
    e.preventDefault();
    if(userPreferences.validateTime() === false) {
      return;
    } else {
      localStorage.setItem('saved', 'true');
      userPreferences.save();
      reminder.run();
    }
  });

    chrome.idle.setDetectionInterval(15);
    chrome.idle.onStateChanged.addListener(function(newState) {
      if(newState === 'idle' || newState === 'locked') {
        reminder.systemState = 'idle';
      } else {
        reminder.systemState = 'awake';
      }
    });

