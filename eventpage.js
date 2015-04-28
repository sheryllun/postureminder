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
  }

});

  // $('#notification').on('click', 'span', function() {
  //   Notification.requestPermission();
  // });

var reminder = {

  run: function() {
    var prefs = userPreferences.getPreferences();
    var time = prefs.timeOption;
    if(prefs.enabledOption == 0) {
      chrome.alarms.clear('timer');
      return;
    } else {
        this.timedReminder(time);
      }
  },

  timedReminder: function(time) {
    chrome.alarms.clear('timer');
    chrome.alarms.onAlarm.addListener(reminder.displayMessage);
    chrome.alarms.create('timer', {
      delayInMinutes: parseFloat(time)
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
            icon: 'img/spine.png'
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
    
  }

};



  $('#message').click(function() {
    reminder.displayMessage();
  });

  $('#submit').click(function(e) {
    e.preventDefault();
    localStorage.setItem('saved', 'true');
    userPreferences.save();
    reminder.run();
  });

reminder.run();


