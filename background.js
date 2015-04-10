


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
    Notification.requestPermission(function(permission){
      var notification = new Notification(title, {
        body: messageBody
      });
      setTimeout(function(){
        notification.close();
      },2000);
    });
  }





  $('#message').click(function() {
    displayMessage();
  });


