;'use strict';

var ClosedCaption = function(element) {
  this.element = element;
  element.closedCaption = this;
  var $element = this.$element = $(element);
  this.clearCurrentState();
};

ClosedCaption.prototype.clearCurrentState = function() {
  this.currentState = {
    timeouts: [],
    elapsedTime: 0,
    totalElapsedTime: 0
  };
};

/**
  Sets the captions.
  @param {Array} captions Each caption object should have a 'startTime' and 'html' properties,
  and an optional 'endTime' property.
*/
ClosedCaption.prototype.setCaptions = function(captions) {
  this.captions = captions;
};

ClosedCaption.prototype.togglePlay = function() {
  if (this.isPlaying) {
    this.pause();
  } else {
    this.play();
  }
};

ClosedCaption.prototype.play = function() {
  if (!this.captions.length) return;

  this.isPlaying = true;
  this.currentState.startTime = Date.now();

  // Set a timeout for each caption
  var captions = this.captions;
  for (var i = 0, length = captions.length; i < length; i++) {
    this.setTimeoutForCaption(captions[i]);
  }
};

ClosedCaption.prototype.setTimeoutForCaption = function(caption) {
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
};

ClosedCaption.prototype.pause = function() {
  if (!this.isPlaying) return;
  this.isPlaying = false;

  var currentState = this.currentState;
  currentState.elapsedTime = Date.now() - currentState.startTime + (currentState.elapsedTime || 0);

  var timeouts = currentState.timeouts;
  for (var i = 0, length = timeouts.length; i < length; i++) {
    window.clearTimeout(timeouts[i].timeout);
  }

  currentState.timeouts = [];
};

ClosedCaption.prototype.stop = function() {
  this.pause();
  this.clearCurrentState();
  this.$element.css('visibility','hidden');
};

// For IE8 and earlier.
if (!Date.now) {
  Date.now = function() {
    return new Date().valueOf();
  }
}