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
        // const uncompletedQuests = Array.from(document.getElementsByClassName('kt-widget5__item')).filter((e) => { return e.getElementsByClassName('label-success').length <= 0 });
        // const quest = uncompletedQuests[uncompletedQuests.length - 1];

        const allQuests = Array.from(document.getElementsByClassName('kt-widget5__item'));
        const quest = allQuests.find(e => e.getElementsByClassName('kt-widget5__title')[0].innerText === 'Help a blind man and his dog')
        simulateClick(quest.getElementsByTagName('button')[0]);
    } else {
        const performBtn = getModalButton('Perform quest');
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

let appInterval;
const startInterval = () => {
    appInterval = setInterval(() => {
        const energyRemaining = getCurrentResource('energy');
        const questsRemaining = getCurrentResource('quest_points');
        const healthRemaining = getResourcePercentage('health');
        const stepsRemaining = getCurrentResource('steps');

        // closes levelup modal
        isModalOpen();

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
            if (window.location.pathname !== '/') {
                window.location.replace('/');
            }
        }
    }, 2000);
};

const start = () => {
    const btn = document.getElementById('bot-play');

    const startIt = (e) => {
        console.log('starting...');
        startInterval();
        btn.textContent = 'Stop';
        btn.classList.remove('btn-success');
        btn.classList.add('btn-danger');
        localStorage.setItem('smmo-ext', 'true')
    }
    const stopIt = (e) => {
        console.log('stopping...');
        clearInterval(appInterval);
        appInterval = undefined;
        btn.textContent = 'Start';
        btn.classList.remove('btn-danger');
        btn.classList.add('btn-success');
        localStorage.removeItem('smmo-ext')
    }
    
    btn.onclick = (e) => {
        if (appInterval) {
            stopIt(e);
        } else {
            startIt(e);
        }
    };
    
    if (localStorage.getItem('smmo-ext') === 'true') {
        startIt();
    }
};

const controlDiv = document.createElement('div');
controlDiv.innerHTML = `
<div class="container" style="background-color: white; padding: 15px;">
    <div class="row">
        <div class="col-md-10">
            <h4>SimpleMMO Bot</h4>
        </div>
        <div class="col-md-2">
            <button class="btn btn-info" name="action" id="bot-play">
                Start
            </button>
        </div>
    </div>
</div>
`;
document.body.prepend(controlDiv);


start();
console.log('extension loaded');
