var userPreferences = {
  enableQuestion: $('#default'),
  timeQuestion: $('#time'),
  closeQuestion: $('input[name="close"]'),
  walkQuestion: $('#walk'),
  walkTimeQuestion: $('#walkTime'),
  fadeTimeQuestion: $('#fadeTime'),
  soundQuestion: $('#sound'),
  snarkinessQuestion: $('#snarkiness'),

  init: function(time, walkTime, fadeTime) {
    localStorage.setItem('enabled', 'checked');
    localStorage.setItem('time', time);
    localStorage.setItem('walkTime', walkTime);
    localStorage.setItem('fadeTime', fadeTime);
    localStorage.setItem('close', '1');
    localStorage.setItem('walk', 'not checked');
    localStorage.setItem('saved', 'true');
    localStorage.setItem('sound', 'not checked');

    this.enableQuestion.prop('checked', true);
    this.timeQuestion.val(time);
    this.walkTimeQuestion.val(walkTime);
    this.fadeTimeQuestion.val(fadeTime);
    this.closeQuestion.filter('[value="1"]').attr('checked', 'checked');
    this.walkQuestion.prop('checked', false);
    this.walkTimeQuestion.prop('disabled', true);
    this.snarkinessQuestion.prop('disabled', true);
  },

  getPreferences: function() {
    var allPrefs = {
      enabledOption: localStorage.enabled,
      timeOption: localStorage.time,
      walkTimeOption: localStorage.walkTime,
      fadeTimeOption: localStorage.fadeTime,
      closeOption: localStorage.close,
      walkOption: localStorage.walk,
      soundOption: localStorage.sound,
      snarkinessOption: localStorage.snarkiness
    };
    return allPrefs;
  },

  loadDom: function() {
    var preferences = this.getPreferences();
    if(preferences.enabledOption === 'checked') {
      this.enableQuestion.prop('checked', 'checked');
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
    if(preferences.soundOption == 'checked') {
      this.soundQuestion.prop('checked', 'checked');
    }
    if(preferences.snarkinessOption == 'checked') {
      this.snarkinessQuestion.prop('checked', 'checked');
    }
  },

  disableQuestions: function(bool) {
      this.timeQuestion.prop('disabled', bool);
      this.closeQuestion.prop('disabled', bool);
      this.walkQuestion.prop('disabled', bool);
      this.soundQuestion.prop('disabled', bool);
      this.walkTimeQuestion.prop('disabled', bool);
      this.fadeTimeQuestion.prop('disabled', bool);
      $('li:not(.primary)').toggleClass('gray', bool);
      this.snarkinessQuestion.prop('disabled', bool);
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

      if(this.soundQuestion.is(':checked')) {
        localStorage.setItem('sound', 'checked');
      } else {
        localStorage.setItem('sound', 'not checked');
      }
      
      if(this.snarkinessQuestion.is(':checked')) {
        localStorage.setItem('snarkiness', 'checked');
      } else {
        localStorage.setItem('snarkiness', 'not checked');
      }

      updateStatus();
      setTimeout(function() { checkStatus(); }, 1000);
    },

  validateTime: function() {
    $('.settime').hide();
    $('input').removeClass('error-highlight');
    var postureTimeVal = this.timeQuestion.val();
    var fadeTimeVal = this.fadeTimeQuestion.val();
    var walkTimeVal = this.walkTimeQuestion.val();
    var validation = true;

    if(!postureTimeVal.match(/\d/) || postureTimeVal <= 0 || postureTimeVal > 59) {
      this.timeQuestion.addClass('error-highlight');
      validation = false;
    } 
    if(!fadeTimeVal.match(/\d/) || fadeTimeVal <= 0 || fadeTimeVal > 59) {
      this.fadeTimeQuestion.addClass('error-highlight');
      validation = false;
    }
     if(!walkTimeVal.match(/\d/) || walkTimeVal <= 0) {
      this.walkTimeQuestion.addClass('error-highlight');
      validation = false;
    } 
    
    if(!validation) {
      $('.settime').show();
      return false;
    } else {
      return true;
    }
  }
};

function updateStatus() {
  $('#notification').html('Options saved');
}

function checkStatus() {
  var currentStatus = localStorage.enabled;
  if(currentStatus == 'not checked') {
    $('#notification').html('Reminders are currently <strong>disabled</strong>');
  } else {
    $('#notification').html('Reminders are currently <strong>enabled</strong>');
  }
}