// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let startStandup = document.getElementById('startStandup');
let checklist = document.getElementById('participantChecklist');
let timerSetting = document.getElementById('timerSetting');
let activeParticipants = [];
let selectedTime = "180";

chrome.storage.sync.get('participants', function(data) {
  let checklistNode = '';

  for (let i = 0; i < data.participants.length; i++) {
    let name = data.participants[i];
    checklistNode = checklistNode.concat('', '<li class="checkbox-list"><label class="checkbox-label"><input type="checkbox" class="participant" id="' + name + '" value="' + name + '" name="participants" checked><span class="checkbox"></span><span class="checkbox-text">' + name + '</span></label></li>');
    activeParticipants.push(data.participants[i]);
  }

  checklist.innerHTML = checklistNode;
});

checklist.onclick = function(node) {
  let selected = node.srcElement.checked;
  let name = node.srcElement.value;
  let onList = activeParticipants.includes(name);

  if (selected && !onList) {
    activeParticipants.push(name);
  } else if (!selected && onList) {
    const index = activeParticipants.indexOf(name);
    if (index > -1) {
      activeParticipants.splice(index, 1);
    }
  }
}

timerSetting.onclick = function(node) {
  let selected = node.srcElement.checked;
  let time = node.srcElement.value;

  if (selected) {
    selectedTime = time;
  }
}

startStandup.onclick = function() {
  chrome.storage.sync.set({activeParticipants: activeParticipants});
  chrome.storage.sync.set({timerAmount: selectedTime});

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      {
        file: 'standup/scripts.js'
      }
    );

    chrome.tabs.insertCSS(
      tabs[0].id,
      {
        file: 'standup/styles.css'
      }
    );
  });
  window.close();
};