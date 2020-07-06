// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

function save_options() {
  let teamMembers = document.getElementById('teamMembers').value.trim();
  let membersArray = teamMembers.split(/\s*,\s*/);
  let toCapitalized = [];
  
  for (let name of membersArray) {
    name = name.charAt(0).toUpperCase() + name.substr(1);
    toCapitalized.push(name);
  }

  membersArray = toCapitalized.sort();

  chrome.storage.sync.set({
    participants: membersArray
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
  chrome.storage.sync.get('participants', function(items) {
    let participantList = items.participants.join(', ');
    document.getElementById('teamMembers').value = participantList;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);