// TODO(mihaip): Start using Plovr

goog.require('goog.dom');
goog.require('goog.net.XhrIo');

function updateCheckinsForOtherUser(otherUserId, indicatorNode, successCallback) {
  updateCheckinsInternal(
      {
        extraParams : '?other_external_id=' + encodeURIComponent(otherUserId),
        pronoun : 'their '
      },
      indicatorNode,
      successCallback);
}

function updateCheckins(indicatorNode, successCallback) {
  updateCheckinsInternal(
      {
        extraParams: '',
        pronoun: 'your '
      },
      indicatorNode,
      successCallback);
}

function updateCheckinsInternal(params, indicatorNode, successCallback) {
  indicatorNode.innerText = 'Loading ' + params.pronoun + 'checkins...';
  goog.dom.classes.addRemove(indicatorNode, 'faded-out', 'faded-in');

  goog.net.XhrIo.send(
      '/checkins/update' + params.extraParams,
      function() {
        setTimeout(goog.partial(
            updateProgress, params, indicatorNode, successCallback),
            1000);
      });
}

function updateProgress(params, indicatorNode, successCallback) {
  goog.net.XhrIo.send(
      '/checkins/update/state' + params.extraParams,
      function(event) {
        var json = event.target.getResponseJson();

        if (json.is_updating) {
          indicatorNode.innerText =
              'Loading ' + params.pronoun + 'checkins (got ' +
                  json.checkin_count + ' so far)...';
          setTimeout(goog.partial(
              updateProgress, params, indicatorNode, successCallback),
              1000);
        } else {
          indicatorNode.innerText =
              'OK, ' + params.pronoun + json.checkin_count +
                  ' checkins are now all loaded.';
          successCallback();
        }
      });
}

function loadIntersections(externalId, successCallback) {
  goog.net.XhrIo.send(
      '/checkins/intersect/data?external_id=' + encodeURIComponent(externalId),
      function(event) {
        successCallback(event.target.getResponseText());
      });
}

function fetchRecentIntersections(successCallback) {
 goog.net.XhrIo.send(
      '/checkins/intersect/recent',
      function(event) {
        successCallback(event.target.getResponseText());
      });
}

function toggleEmail() {
   goog.net.XhrIo.send(
      '/toggle-email',
      undefined,
      'POST')
}

function printEmail(opt_anchorText) {
  var a = [109, 105, 104, 97, 105, 64, 112, 101, 114, 115, 105, 115, 116,
      101, 110, 116, 46, 105, 110, 102, 111];
  var b = [];
  for (var i = 0; i < a.length; i++) {
    b.push(String.fromCharCode(a[i]));
  }
  b = b.join('');
  document.write('<' + 'a href="mailto:' + b + '">' +
                 (opt_anchorText || b) +
                 '<' + '/a>');
};
