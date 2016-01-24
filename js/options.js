var userPreferences = {
  enableQuestion: $('#default'),
  timeQuestion: $('#time'),
  closeQuestion: $('input[name="close"]'),
  walkQuestion: $('#walk'),
  walkTimeQuestion: $('#walkTime'),
  fadeTimeQuestion: $('#fadeTime'),

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
    this.walkTimeQuestion.prop('disabled', true);
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
    } else {
      userPreferences.disableQuestions(true);
    }
    this.timeQuestion.val(preferences.timeOption);
    this.walkTimeQuestion.val(preferences.walkTimeOption);
    this.fadeTimeQuestion.val(preferences.fadeTimeOption);
    $.each(this.closeQuestion, function() {
      if($(this).val() == preferences.closeOption) {
        $(this).attr('checked', 'checked');
      }
    });
    
    this.walkTimeQuestion.prop('disabled', preferences.walkOption != 'checked');
    this.fadeTimeQuestion.prop('disabled', preferences.closeOption != 1);
    if(preferences.walkOption == 'checked') {
      this.walkQuestion.prop('checked', 'checked');
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
      localStorage.setItem('time', this.timeQuestion.val());
      localStorage.setItem('walkTime', this.walkTimeQuestion.val());
      localStorage.setItem('fadeTime', this.fadeTimeQuestion.val());
      localStorage.setItem('close', $('input[name="close"]:checked').val());

      if(this.enableQuestion.is(':checked')) {
        localStorage.setItem('enabled', 'checked');
      } else {
        localStorage.setItem('enabled', 'not checked');
      }

      if(this.walkQuestion.is(':checked')) {
        localStorage.setItem('walk', 'checked');
      } else {
        localStorage.setItem('walk', 'not checked');
      }

      updateStatus();
      setTimeout(function() { checkStatus(); }, 1000);
    },

  validateTime: function() {
    $('.settime').hide();
    var enteredTime = this.timeQuestion.val();
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