$(document).ready(function() {
  if(!('Notification' in window)) {
    $('#notification').text('Sorry, your browser does not support the Web Notifications API.');
  }

  if(localStorage.saved) {
    userPreferences.load();
    checkStatus();
  } else {
    userPreferences.init();
  }

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

var userPreferences = {

  enableQuestion: $('input[name="default"]'),
  timeQuestion: $('input[name="time"]'),
  closeQuestion: $('input[name="close"]'),
  walkQuestion: $('input[name="walk"]'),

  init: function() {
    this.enableQuestion.filter('[value="1"]').prop('checked', true);
    this.timeQuestion.val('6');
    this.closeQuestion.filter('[value="1"]').attr('checked', 'checked');
    this.walkQuestion.prop('checked', false);
  },

  load: function() {
    var enabledOption = localStorage.enabled;
    var timeOption = localStorage.time;
    var closeOption = localStorage.close;
    var walkOption = localStorage.walk;

    $.each(this.enableQuestion, function() {
      if($(this).val() == enabledOption) {
        $(this).attr('checked', 'checked');
      }
    });

    this.timeQuestion.val(timeOption);

    $.each(this.closeQuestion, function() {
      if($(this).val() == closeOption) {
        $(this).attr('checked', 'checked');
      }
    });

    if(walkOption == 'checked') {
      this.walkQuestion.prop('checked', 'checked');
    }
  },

  save: function() {
      localStorage.setItem('enabled', $('input[name="default"]:checked').val());
      localStorage.setItem('time', $('input[name="time"]').val());
      localStorage.setItem('close', $('input[name="close"]:checked').val());

      if($('#walk').is(':checked')) {
        localStorage.setItem('walk', 'checked');
      } else {
        localStorage.setItem('walk', 'not checked');
      }
      
      updateStatus();
      setTimeout(function() {
        checkStatus();
      }, 1000);

      console.log(localStorage.enabled + " " + localStorage.time + " " + localStorage.close + " " + localStorage.walk);
    }
};

  function updateStatus() {
    $('#notification').html('Options saved.');

  }

  function checkStatus() {
    var currentStatus = localStorage.enabled;
    if(currentStatus == 0) {
      $('#notification').html('Reminders are currently <strong>disabled</strong>.');
    } else {
      $('#notification').html('Reminders are currently <strong>enabled</strong>.');
    }
  }




  $('#message').click(function() {
    displayMessage();
  });

  $('#submit').click(function(e) {
    e.preventDefault();
    localStorage.setItem('saved', 'true');
    userPreferences.save();
  });


