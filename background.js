window.addEventListener('load', function() {
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
            $('#notification').text('Desktop notifications must be activated in order for this extension to run.');
            return;
          }
      });
    }
  }



  $('#message').click(function() {
    displayMessage();
  });


