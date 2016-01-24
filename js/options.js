var userPreferences = {
  enableQuestion: $('input[name="default"]'),
  timeQuestion: $('input[name="time"]'),
  closeQuestion: $('input[name="close"]'),
  walkQuestion: $('input[name="walk"]'),
  walkTimeQuestion: $('input[name="walkTime"]'),
  fadeTimeQuestion: $('input[name="fadeTime"]'),

  init: function(time, walkTime, fadeTime) {
    localStorage.setItem('enabled', 'checked');
    localStorage.setItem('time', time);
    localStorage.setItem('walkTime', walkTime);
    localStorage.setItem('fadeTime', fadeTime);
    localStorage.setItem('close', '1');
    localStorage.setItem('walk', 'not checked');
    localStorage.setItem('saved', 'true');

    this.enableQuestion.prop('checked', true);
    this.timeQuestion.val(time);
    this.walkTimeQuestion.val(walkTime);
    this.fadeTimeQuestion.val(fadeTime);
    this.closeQuestion.filter('[value="1"]').attr('checked', 'checked');
    this.walkQuestion.prop('checked', false);
  },

  getPreferences: function() {
    var allPrefs = {
      enabledOption: localStorage.enabled,
      timeOption: localStorage.time,
      walkTimeOption: localStorage.walkTime,
      fadeTimeOption: localStorage.fadeTime,
      closeOption: localStorage.close,
      walkOption: localStorage.walk
    };
    return allPrefs;
  },

  loadDom: function() {
    var preferences = this.getPreferences();
    if(preferences.enabledOption === 'checked') {
      this.enableQuestion.prop('checked', 'checked')
    }
    this.timeQuestion.val(preferences.timeOption);
    this.walkTimeQuestion.val(preferences.walkTimeOption);
    this.fadeTimeQuestion.val(preferences.fadeTimeOption);
    $.each(this.closeQuestion, function() {
      if($(this).val() == preferences.closeOption) {
        $(this).attr('checked', 'checked');
      }
    });
    if(preferences.walkOption == 'checked') {
      this.walkQuestion.prop('checked', 'checked');
    }
    if(preferences.enabledOption != 'checked') {
      userPreferences.disableQuestions(true);
    }
  },

  disableQuestions: function(bool) {
      this.timeQuestion.prop('disabled', bool);
      this.closeQuestion.prop('disabled', bool);
      this.walkQuestion.prop('disabled', bool);
      this.walkTimeQuestion.prop('disabled', bool);
      this.fadeTimeQuestion.prop('disabled', bool);
      $('li:not(.primary)').toggleClass('gray', bool);
  },

  save: function() {
      localStorage.setItem('time', $('input[name="time"]').val());
      localStorage.setItem('walkTime', $('input[name="walkTime"]').val());
      localStorage.setItem('fadeTime', $('input[name="fadeTime"]').val());
      localStorage.setItem('close', $('input[name="close"]:checked').val());

      if($('#default').is(':checked')) {
        localStorage.setItem('enabled', 'checked');
      } else {
        localStorage.setItem('enabled', 'not checked');
      }

      if($('#walk').is(':checked')) {
        localStorage.setItem('walk', 'checked');
      } else {
        localStorage.setItem('walk', 'not checked');
      }
      updateStatus();
      setTimeout(function() { checkStatus(); }, 1000);
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
  $('#notification').html('Options saved');
}

function checkStatus() {
  var currentStatus = localStorage.enabled;
  if(currentStatus == 0) {
    $('#notification').html('Reminders are currently <strong>disabled</strong>');
  } else {
    $('#notification').html('Reminders are currently <strong>enabled</strong>');
  }
}