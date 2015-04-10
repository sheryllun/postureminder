// window.addEventListener('load', function() {
//   if (window.Notification && Notification.permission !== "granted") {
//     Notification.requestPermission(function (status) {
//       if (Notification.permission !== status) {
//         Notification.permission = status;
//       }
//     });
//   }
// });


  function renderMessage() {
    var postureBeginning =['Straighten up, ', 'Shoulders back, ', 'How\'s your posture, ', 'Beep, posture please, ', 'Check your posture, ', 'Sit up straight, ', 'Check yourself, ', 'No hunchbacks, ', 'At attention, ', 'Stop slumping, ', 'Mother always told you not to slouch, ', 'Sit up, ', 'Posture Reminder, ', 'Posture police, '],
			 postureEnd = ['young grasshopper.', 'buddy.', 'amigo.', 'Quasimodo.', 'bruh.', 'boss.'],
			 begInt = Math.floor(Math.random() * postureBeginning.length),
			 endInt = Math.floor(Math.random() * postureEnd.length),
			 fullMessage = postureBeginning[begInt] + postureEnd[endInt];
        return fullMessage;
    }

  function displayMessage() {
    console.log('hi');
    var title = 'Your PostureMinder';
    var messageBody = renderMessage();
    if (window.Notification && Notification.permission === "granted") {
      var n = new Notification("Hi!");
    } else if (window.Notification && Notification.permission !== "denied") {
      Notification.requestPermission(function (status) {
        if (Notification.permission !== status) {
          Notification.permission = status;
        }
      });

        if (status === "granted") {
          var n = new Notification("Hi!");
        }
      }




  }

  $('#message').click( function(e) {
    console.log('clicked');
    displayMessage();
  });
