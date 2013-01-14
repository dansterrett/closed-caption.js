closed-caption.js
=================

A simple way to overlay closed captions over top a video.  View demo/index.html for an example of how to use it.

The HTML should be structured like this:

    <div class="cc-area">
      <span id="cc-text" class="cc-text"></span>
    </div>

The parent container of `cc-area` must have `position` set to `relative`, `absolute`, or `fixed` for the captions to display properly.

To initialize a new ClosedCaption object, pass the `cc-text` element:

    var closedCaption = new ClosedCaption($('#cc-text')[0]);

Set the caption text:

    closedCaption.setCaptions([
      { html: 'This is caption 1.', startTime: 0, endTime: 1000 },
      { html: 'This is caption 2.', startTime: 2000 },
      { html: 'This is caption 3.', startTime: 4000, endTime: 5000 },
      { html: 'This is caption 4.', startTime: 6000, endTime: 7000 },
      { html: 'This is caption 5.', startTime: 8000, endTime: 9000 }
    ]);

A "caption" object consists of three properties: `html`, `startTime`, and `endTime` (optional).  If no `endTime` is set, then the caption will remain visible until the next caption displays.

To play:

    closedCaption.play();

To pause:

    closedCaption.pause();

To stop:

    closedCaption.stop();

To toggle play:

    closedCaption.togglePlay();