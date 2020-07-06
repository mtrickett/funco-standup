let standupConatiner = document.createElement('div');
let clubhouseHeader = document.getElementById('app-root');

fetch(chrome.runtime.getURL('standup/app.html'))
  .then(response => response.text())
  .then(data => {
    document.body.insertBefore(standupConatiner, clubhouseHeader);
    document.body.firstChild.id = 'standupContainer';
    document.body.firstChild.innerHTML = data;
    
    let wrapper = document.getElementById('wrapper');
    let pickAtRandom = document.getElementById('thrillMe');
    let pickedName = document.getElementById('picked');
    let timerReset = document.getElementById('timerReset');
    let endStandup = document.getElementById('endStandup');

    chrome.storage.sync.get('activeParticipants', function(data) {
      let activeParticipantsList = data.activeParticipants;

      pickAtRandom.onclick = function() {
        if (activeParticipantsList.length > 0) {
          let pickedParticipant = activeParticipantsList[Math.floor(Math.random() * activeParticipantsList.length)];
          let allAvatars = document.querySelectorAll('[data-model="Profile"]');
          let participantAvatars = document.querySelectorAll('[alt*="' + pickedParticipant + '"]');
          pickedName.innerHTML = pickedParticipant;
          
          for (let i = 0; i < allAvatars.length; i++) {
            allAvatars[i].style.border = "";
          }

          if (participantAvatars.length > 0) {
            for (let i = 0; i < participantAvatars.length; i++) {
              participantAvatars[i].style.border = "30px solid #13ae47";
            }
          }
  
          const index = activeParticipantsList.indexOf(pickedParticipant);
          if (index > -1) {
            activeParticipantsList.splice(index, 1);
          }
        } else {
          wrapper.innerHTML = '<div class="parking">Post-standup parking lot in progress.</div>';
        }
      }      
    });

    chrome.storage.sync.get('timerAmount', function(data) {
      let timeSetting = data.timerAmount;
      let timeDisplay = document.getElementById('timerCountdown');
      var existingIntervalId = 0;

      function startTimer(duration, display) {
        timeDisplay.style.color = '#333';

        var start = Date.now(),
            diff,
            minutes,
            seconds;
        function timer() {
            diff = duration - (((Date.now() - start) / 1000) | 0);
            minutes = (diff / 60) | 0;
            seconds = (diff % 60) | 0;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            display.textContent = minutes + ":" + seconds; 

            if (diff <= 0) {
              start = Date.now() + 1000;
            }

            if (minutes == 0 && seconds == 0) {
              clearInterval(existingIntervalId);
              timeDisplay.style.color = '#ce2333';
            }
        }

        timer();
        existingIntervalId = setInterval(timer, 1000);
      }

      document.getElementById('pickedReset').onclick = function(){
        clearInterval(existingIntervalId);
        startTimer(timeSetting, timeDisplay);
      }

      timerReset.onclick = function(){
        clearInterval(existingIntervalId);
        startTimer(timeSetting, timeDisplay);
      }
    });

    endStandup.onclick = function() {
      location.reload();
    }

  }).catch(err => {
      console.error(err);
  });