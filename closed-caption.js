;'use strict';

/**
  Creates a new ClosedCaption.
  @param {HTMLSpanElement} element The SPAN element to initialize as a new ClosedCaption.
  @constructor
*/
var ClosedCaption = function ClosedCaption(element) {
  this.element = element;
  element.closedCaption = this;
  var $element = this.$element = $(element);
  this.clearCurrentState();
};

ClosedCaption.prototype = {
  /**
    Clears the ClosedCaption's currentState. The currentState is used to 
    keep track of when each closed caption text is supposed to be shown.
  */
  clearCurrentState: function() {
    this.currentState = {
      timeouts: [],
      elapsedTime: 0,
      totalElapsedTime: 0
    };
  },

  /**
    Sets the captions.
    @param {Array} captions Each caption object should have a 'startTime' and 'html' properties,
    and an optional 'endTime' property.
  */
  setCaptions: function(captions) {
    this.captions = captions;
  },

  /**
    Toggles the play of the closed captions.  It is used to either pause or play the captions.
  */
  togglePlay: function() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  },

  /**
    Plays the captions.
  */
  play: function() {
    if (!this.captions.length) return;

    this.isPlaying = true;
    this.currentState.startTime = Date.now();

    // Set a timeout for each caption
    var captions = this.captions;
    for (var i = 0, length = captions.length; i < length; i++) {
      this.setTimeoutForCaption(captions[i]);
    }
  },

  /**
    Sets a timeout to show the caption.
  */
  setTimeoutForCaption: function(caption) {
    var startTime = caption.startTime - (this.currentState.elapsedTime || 0);
    var endTime = (caption.endTime ? caption.endTime - (this.currentState.elapsedTime || 0) : null);

    var self = this;

    // Set a timeout to show the caption
    if (startTime >= 0) {
      this.currentState.timeouts.push({
        time: caption.startTime,
        timeout: window.setTimeout(function() {
          self.$element.html(caption.html);
          self.$element.css('visibility','visible');
        }, startTime)
      });
    }

    // Set a timeout to hide the caption
    if (endTime && endTime >= 0) {
      this.currentState.timeouts.push({
        time: caption.endTime,
        timeout: window.setTimeout(function() {
          self.$element.css('visibility','hidden');
        }, endTime)
      });
    }
  },

  /**
    Pauses the captions.
  */
  pause: function() {
    if (!this.isPlaying) return;
    this.isPlaying = false;

    var currentState = this.currentState;
    currentState.elapsedTime = Date.now() - currentState.startTime + (currentState.elapsedTime || 0);

    var timeouts = currentState.timeouts;
    for (var i = 0, length = timeouts.length; i < length; i++) {
      window.clearTimeout(timeouts[i].timeout);
    }

    currentState.timeouts = [];
  },

  /**
    Stops playing the captions.
  */
  stop: function() {
    this.pause();
    this.clearCurrentState();
    this.$element.css('visibility','hidden');
  }

}

// For IE8 and earlier.
if (!Date.now) {
  /**
    Defines the Date.now method if the browser does not already support it (IE8 and below).
  */
  Date.now = function() {
    return new Date().valueOf();
  }
}