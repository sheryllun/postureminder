var userPreferences = {
  enableQuestion: $('input[name="default"]'),
  timeQuestion: $('input[name="time"]'),
  closeQuestion: $('input[name="close"]'),
  walkQuestion: $('input[name="walk"]'),

  init: function(time) {
    localStorage.setItem('enabled', '1');
    localStorage.setItem('time', time);
    localStorage.setItem('close', '1');
    localStorage.setItem('walk', 'not checked');
    localStorage.setItem('saved', 'true');

    this.enableQuestion.filter('[value="1"]').prop('checked', true);
    this.timeQuestion.val(time);
    this.closeQuestion.filter('[value="1"]').attr('checked', 'checked');
    this.walkQuestion.prop('checked', false);
  },

  getPreferences: function() {
    var allPrefs = {
      enabledOption: localStorage.enabled,
      timeOption: localStorage.time,
      closeOption: localStorage.close,
      walkOption: localStorage.walk
    };
    return allPrefs;
  },

  loadDom: function() {
    var preferences = this.getPreferences();

    $.each(this.enableQuestion, function() {
      if($(this).val() == preferences.enabledOption) {
        $(this).attr('checked', 'checked');
      }
    });

    this.timeQuestion.val(preferences.timeOption);

    $.each(this.closeQuestion, function() {
      if($(this).val() == preferences.closeOption) {
        $(this).attr('checked', 'checked');
      }
    });

    if(preferences.walkOption == 'checked') {
      this.walkQuestion.prop('checked', 'checked');
    }
  },

  disableQuestions: function(bool) {
    if(bool === true) {
      $('input[name="time"]').prop('disabled', true);
      $('input[name="close"]').prop('disabled', true);
      $('input[name="walk"]').prop('disabled', true);
    } else {
      $('input[name="time"]').prop('disabled', false);
      $('input[name="close"]').prop('disabled', false);
      $('input[name="walk"]').prop('disabled', false);
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
    },

  validateTime: function() {
    $('.settime').hide();
    var enteredTime = $('#time').val();
    if(!enteredTime.match(/\d/) || enteredTime <= 0 || enteredTime > 59) {
      $('.settime').show();
      return false;
    }
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