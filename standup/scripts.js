let standupConatiner = document.createElement('div');
let clubhouseHeader = document.getElementById('app-root');

fetch(chrome.runtime.getURL('standup/app.html'))
  .then(response => response.text())
  .then(data => {
    // create standup app in dom
    document.body.insertBefore(standupConatiner, clubhouseHeader);
    document.body.firstChild.id = 'standupContainer';
    document.body.firstChild.innerHTML = data;
    
    // dom elements
    const wrapper = document.getElementById('wrapper');
    const pickRandomParticipant = document.getElementById('thrillMe');
    const pickedName = document.getElementById('picked');
    const timeDisplay = document.getElementById('timerCountdown');
    const timerReset = document.getElementById('timerReset');
    const endStandup = document.getElementById('endStandup');

    // timer variables
    let existingIntervalId = 0;

    // global variables
    let participantsList;
    let timeSetting;

    // get values from settings
    chrome.storage.sync.get('activeParticipants', function(data) {
      participantsList = data.activeParticipants;
    });
  
    chrome.storage.sync.get('timerAmount', function(data) {
      timeSetting = data.timerAmount;
    });

    // update dom functions
    const clearAllStyles = (allAvatars) => {
      for (let i = 0; i < allAvatars.length; i++) {
        allAvatars[i].style.cssText = "";
      }
    };

    const setPickedParticipantStyles = (pickedParticipantAvatars) => {
      if (pickedParticipantAvatars.length > 0) {
        const id = pickedParticipantAvatars[0].dataset.id;
        
        document.querySelectorAll('[data-id="' + id + '"]').forEach(node => {
          node.style.cssText = "border: 2px solid #ce2333;";
        });
      }
    };

    const updateParticipantsList = (pickedParticipant, participantsList) => {
      const index = participantsList.indexOf(pickedParticipant);

      if (index > -1) {
        participantsList.splice(index, 1);
      }
    };

    const startParkingLot = () => {
      wrapper.innerHTML = '<div class="parking">Post-standup parking lot in progress.</div>';
    };

    const startTimer = () => {
      let start = Date.now();
      let diff;
      let minutes;
      let seconds;

      timeDisplay.classList = '';

      const timer = () => {
        diff = timeSetting - (((Date.now() - start) / 1000) | 0);
        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        timeDisplay.textContent = minutes + ":" + seconds; 

        if (diff <= 0) {
          start = Date.now() + 1000;
        }

        if (minutes == 0 && seconds == 0) {
          clearInterval(existingIntervalId);
          timeDisplay.classList = 'timer-up';
        }
      }

      timer();
      existingIntervalId = setInterval(timer, 1000);
    }

    // pick participant and start timer
    pickRandomParticipant.onclick = function() {
      if (participantsList.length > 0) {
        let pickedParticipant = participantsList[Math.floor(Math.random() * participantsList.length)];
        let allAvatars = document.querySelectorAll('[data-model="Profile"]');
        let pickedParticipantAvatars = document.querySelectorAll('[alt*="' + pickedParticipant + '"]');
        
        pickedName.innerHTML = pickedParticipant;

        clearInterval(existingIntervalId);
        startTimer();
        clearAllStyles(allAvatars);
        setPickedParticipantStyles(pickedParticipantAvatars);
        updateParticipantsList(pickedParticipant, participantsList);
      } else {
        startParkingLot();
      }
    }

    // reset timer
    timerReset.onclick = function(){
      clearInterval(existingIntervalId);
      startTimer();
    }

    // close the app by refreshing the page
    endStandup.onclick = function() {
      location.reload();
    }

  }).catch(err => {
      console.error(err);
  });