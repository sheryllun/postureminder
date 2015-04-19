$(document).ready(function() {
  if(!('Notification' in window)) {
    $('#notification').text('Sorry, your browser does not support the Web Notifications API.');
  } else console.log('Web Notifications API supported');
});


  function renderMessage() {
    var postureBeginning =['Straighten up, ', 'Shoulders back, ', 'How\'s your posture, ', 'Beep, posture please, ', 'Check your posture, ', 'Sit up straight, ', 'Check yourself, ', 'No hunchbacks, ', 'At attention, ', 'Stop slumping, ', 'Mother always told you not to slouch, ', 'Sit up, ', 'Posture Reminder, ', 'Posture police, '],
			 postureEnd = ['young grasshopper.', 'buddy.', 'amigo.', 'Quasimodo.', 'bruh.', 'boss.'],
			 begInt = Math.floor(Math.random() * postureBeginning.length),
			 endInt = Math.floor(Math.random() * postureEnd.length),
			 fullMessage = postureBeginning[begInt] + postureEnd[endInt];
        return fullMessage;
    }

  function displayMessage() {
    var title = 'Your PostureMinder';
    var messageBody = renderMessage();

    if(Notification.permission === "granted") {
      var notification = new Notification(title, {
        body: messageBody,
        icon: 'img/spine.png'
      });
      setTimeout(function(){
        notification.close();
      },5000);

    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function(permission){

        if(permission === 'granted')  {
          var notification = new Notification(title, {
                  body: messageBody,
                  icon: 'img/spine.png'
                });
                setTimeout(function(){
                  notification.close();
                },5000);

          } else {
            $('#notification').text('Desktop notifications must be allowed in order for this extension to run.');
            return;
          }
      });
    }
  }

  function savePreferences() {
    localStorage.setItem('enabled', $('input[name="default"]:checked').val());
    localStorage.setItem('time', $('input[name="time"]').val());
    localStorage.setItem('close', $('input[name="close"]:checked').val());

    if($('#walk').is(':checked')) {
      localStorage.setItem('walk', 'checked');
    } else {
      localStorage.setItem('walk', 'not checked');
    }
    updateStatus();
    console.log(localStorage.enabled + " " + localStorage.time + " " + localStorage.close + " " + localStorage.walk);
  }

  function updateStatus() {
    var currentStatus = localStorage.enabled;
    $('#notification').html('Options saved.');
    setTimeout(function() {
      if(currentStatus == 0) {
        $('#notification').html('Reminders are currently <strong>disabled</strong>.');
      } else {
        $('#notification').html('Reminders are currently <strong>enabled</strong>.');
      }
    }, 1000);
  }


  $('#message').click(function() {
    displayMessage();
  });

  $('#submit').click(function(e) {
    e.preventDefault();
    savePreferences();
  });


