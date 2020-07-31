/*
    UTILS
*/
const simulateClick = function (elem) {
	// Create our event (with options)
	var evt = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
		view: window
	});
	// If cancelled, don't dispatch our event
	var canceled = !elem.dispatchEvent(evt);
};

const getCurrentResource = (resource) => {
    return parseInt(document.getElementById(`current_${resource}`).innerText, 10);
}

const getResourcePercentage = (resource) => {
    const current = getCurrentResource(resource);
    const max = parseInt(document.getElementById(`max_${resource}`).innerText, 10);
    return Math.round((current / max) * 100);
};

const getModalButton = (btnText, idx = 0) => {
    return Array.from(
        document.getElementsByClassName('swal2-actions')[0]?.getElementsByTagName('button') || []
    ).find(b => b.innerText === btnText);
}

const isModalOpen = () => {
	const modal = document.getElementsByClassName('swal2-container');
	const levelupBtn = getModalButton('Yes, I want to assign my points!');

	if (levelupBtn) {
        // todo: put dismissal of the levelup modal here to fix attack bug
        simulateClick(getModalButton('Later'));
        return false;
	}
	return modal.length >= 1;
}

/*
    APP
*/
const battleArena = () => {
    const generateEnemyBtn = document.getElementsByClassName('kt-callout--diagonal-bg')[0].getElementsByTagName('button')[0];
    const confirmBtn = getModalButton('Yes, generate a enemy');
    const attackBtn = getModalButton('Attack');
    if (isModalOpen()) {
        if (confirmBtn) {
            simulateClick(confirmBtn);
        } else if (attackBtn) {
            simulateClick(attackBtn);
        }
    } else {
        simulateClick(generateEnemyBtn);
    }
};
const attack = () => {
    const attackBtn = document.getElementById('attackButton');
    const doneBtn = getModalButton('OK');
    const successAlert = document.getElementById('success-killed');
    const successGoBack = successAlert?.getElementsByTagName('a')[0];

    if (isModalOpen()) {
        if (doneBtn) {
            simulateClick(doneBtn);
        }
    } else if (successAlert.style.display !== 'none') {
        simulateClick(successGoBack);
    } else {
        simulateClick(attackBtn);
    }
}
const travel = () => {
    const stepBtn = document.getElementsByClassName('stepbuttonnew')[0];
    const monsterBtn = document?.getElementsByClassName('div-travel-text')[0]?.getElementsByClassName('cta')[0];
    const hasMonster = monsterBtn?.innerText === ' Attack';

    if (hasMonster) {
        monsterBtn.click();
    } else if (!stepBtn.disabled) {
        simulateClick(stepBtn);
    }
}
const quest = () => {
    if (!isModalOpen()) {
        const uncompletedQuests = Array.from(document.getElementsByClassName('kt-widget5__item')).filter((e) => { return e.getElementsByClassName('label-success').length <= 0 });
        const quest = uncompletedQuests[uncompletedQuests.length - 1];

        // const allQuests = Array.from(document.getElementsByClassName('kt-widget5__item'));
        // const quest = allQuests.find(e => e.getElementsByClassName('kt-widget5__title')[0].innerText === 'Help a blind man and his dog')
        simulateClick(quest.getElementsByTagName('button')[0]);
    } else {
        const performBtn = getModalButton('Perform quest') || getModalButton('Perform Quest');
        const preparingQuest = getModalButton('Preparing quest...');
        const repeatBtn = getModalButton('Repeat quest');
        const error = document.getElementById('swal2-validation-message')?.innerText;

        if (error) {
            window.location.replace('/');
        }

        if (performBtn || preparingQuest) {
            if (performBtn) {
                simulateClick(performBtn);
            }
        } else if (repeatBtn) {
            simulateClick(repeatBtn);
        }
    }
}
const jobs = () => {
    const btn = Array.from(document.getElementsByClassName('btn-success')).find(b => 
        b.innerText === 'Go to your job' || b.innerText === 'Start working'
    );

    if (isModalOpen()) {
        const jobRange = document.getElementsByClassName('swal2-range')[0]
        jobRange.value = '2'; // doesn't work
        const startBtn = getModalButton('Start the job');
        simulateClick(startBtn);
    } else if (btn) {
        simulateClick(btn);
    }
}
const isJobActive = () => {
    return !!Array.from(document.querySelectorAll('a.btn')).find(e => e.innerText === 'Go to your job area' || e.innerText === 'You are currently working');
}

let appInterval;
const startInterval = () => {
    appInterval = setInterval(() => {
        const energyRemaining = getCurrentResource('energy');
        const questsRemaining = getCurrentResource('quest_points');
        const healthRemaining = getResourcePercentage('health');
        const stepsRemaining = getCurrentResource('steps');

        // closes levelup modal
        isModalOpen();

        if (isJobActive()) {
            stopIt(true);
            return;
        }

        if (window.location.pathname.match('/npcs/attack')) {
            attack();
        } else if (energyRemaining >= 1 && healthRemaining >= 40) {
            if (window.location.pathname !== '/battlearena') {
                window.location.replace('/battlearena');
            } else {
                battleArena();
            }
        } else if (questsRemaining >= 1) {
            if (window.location.pathname !== '/quests/viewall') {
                window.location.replace('/quests/viewall');
            } else {
                quest();
            }
        } else if (stepsRemaining >= 1) {
            if (window.location.pathname !== '/travel') {
                window.location.replace('/travel');
            } else {
                travel();
            }
        } else {
            if (window.location.pathname.match('/jobs/view')) {
                jobs();
            } else if (window.location.pathname !== '/jobs/viewall') {
                window.location.replace('/jobs/viewall');
            }
        }
    }, 2000);
};

const stopJobInterval = () => {
    const jobsBtn = document.getElementById('bot-jobs');
    const appBtn = document.getElementById('bot-play');
    
    clearInterval(jobInterval);
    jobsBtn.textContent = 'Jobs: Start';
    jobsBtn.classList.remove('btn-danger');
    jobsBtn.classList.add('btn-info');
    appBtn.disabled = false;

    localStorage.removeItem('smmo-ext-jobs');
}

let jobInterval;
const startJobInterval = () => {
    const jobsBtn = document.getElementById('bot-jobs');
    const appBtn = document.getElementById('bot-play');
    jobsBtn.textContent = 'Jobs: Stop';
    jobsBtn.classList.remove('btn-info');
    jobsBtn.classList.add('btn-danger');
    appBtn.disabled = true;
    localStorage.setItem('smmo-ext-jobs', 'true');

    jobInterval = setInterval(() => {
        if (isJobActive()) {
            window.location.reload(false);
        } else {
            stopJobInterval();

            startIt();
        }
    }, 60000);
}

const startIt = () => {
    const btn = document.getElementById('bot-play');
    console.log('starting...');
    startInterval();
    
    btn.textContent = 'Auto: Stop';
    btn.classList.remove('btn-success');
    btn.classList.add('btn-danger');
    localStorage.setItem('smmo-ext', 'true')
}
const stopIt = (turnJobWaitOn) => {
    const btn = document.getElementById('bot-play');
    console.log('stopping...');
    clearInterval(appInterval);
    appInterval = undefined;
    
    btn.textContent = 'Auto: Start';
    btn.classList.remove('btn-danger');
    btn.classList.add('btn-success');
    localStorage.removeItem('smmo-ext');

    if (turnJobWaitOn) {
        startJobInterval();
    }
}

const start = () => {
    const startBtn = document.getElementById('bot-play');
    const jobsBtn = document.getElementById('bot-jobs');
    
    startBtn.onclick = (e) => {
        if (appInterval) {
            stopIt();
        } else {
            startIt();
        }
    };

    jobsBtn.onclick = () => {
        if (jobInterval) {
            stopJobInterval();
        } else {
            startJobInterval();
        }
    }
    
    if (localStorage.getItem('smmo-ext') === 'true') {
        startIt();
    } else if (localStorage.getItem('smmo-ext-jobs') === 'true') {
        startJobInterval();
    }
};

const controlDiv = document.createElement('div');
controlDiv.innerHTML = `
<div class="container" style="background-color: white; padding: 15px;">
    <div class="row">
        <div class="col-md-9">
            <h4>SimpleMMO Bot</h4>
        </div>
        <div class="col-md-3">
            <button class="btn btn-info" name="action" id="bot-jobs">
                Jobs: Start
            </button>
            <button class="btn btn-success" name="action" id="bot-play">
                Auto: Start
            </button>
        </div>
    </div>
</div>
`;
document.body.prepend(controlDiv);


start();
console.log('extension loaded');
