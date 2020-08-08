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

const getToken = () => document.querySelectorAll('meta[name="csrf-token"]')[0].getAttribute('content');

const sleep = m => new Promise(r => setTimeout(r, m))
const getMoreSteps = async (times = 11) => {
    if (times > 0) {
        console.log('getMoreSteps', times);
        await fetch(`/addstepsapi`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-csrf-token': getToken(),
            },
            body: JSON.stringify({
                'license': 'message-me-when-you-find-this'
            })
        });
        await sleep(2000);
        return await getMoreSteps(times - 1);
    } else {
        return true;
    }
}

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
    const healthRemaining = getResourcePercentage('health');

    if (hasMonster && healthRemaining >= 40) {
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
        // const quest = allQuests.find(e => e.getElementsByClassName('kt-widget5__title')[0].innerText === 'Play SimpleMMO')
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
        const jobRange = document.querySelectorAll('.swal2-range')[0].getElementsByTagName('input')[0];
        jobRange.value = '6';
        const startBtn = getModalButton('Start the job');
        simulateClick(startBtn);
    } else if (btn) {
        simulateClick(btn);
    }
}
const isJobActive = () => {
    return !!Array.from(document.querySelectorAll('a.btn')).find(e => e.innerText === 'Go to your job area' || e.innerText === 'You are currently working');
}

const EQUIPMENT_FILTERS = ['weapons', 'armour', 'pets', 'amulets', 'shields', 'boots', 'helmet', 'greaves'];
const RARITY_FILTERS = ['common', 'uncommon', 'rare'];
const defaultInventoryState = () => EQUIPMENT_FILTERS.reduce((nacc, n) => ({
    [n]: RARITY_FILTERS.reduce((xacc, x) => ({ [x]: false, ...xacc }), {}),
    ...nacc,
}), {});
const inventory = () => {
    const invState = localStorage.getItem('smmo-ext-inv-state');
    const inventoryState = invState ? JSON.parse(invState) : defaultInventoryState();
    let activeEquipmentFilter;
    let activeRarityFilter;
    EQUIPMENT_FILTERS.forEach(ef => {
        RARITY_FILTERS.forEach(rf => {
            if (!inventoryState[ef][rf]) {
                activeEquipmentFilter = activeEquipmentFilter || ef;
                activeRarityFilter = activeRarityFilter || rf;
            }
        })
    });

    if (!activeEquipmentFilter && !activeRarityFilter) {
        return true;
    }

    const inventoryUrl = '/inventory/items';
    const searchString = `?rarity=${activeRarityFilter}&type=${activeEquipmentFilter}&minlevel=&maxlevel=&itemname=`;
    if (!window.location.pathname !== inventoryUrl && window.location.search !== searchString) {
        window.location.replace(`${inventoryUrl}${searchString}`);
        return false;
    }

    const getContainer = (title) => {
        return Array.from(
            Array.from(
                document.querySelectorAll('.kt-portlet')
            ).find(p =>
                p.querySelectorAll('.kt-portlet__head-title')?.[0]?.innerText === title
            ).querySelectorAll('a')
        ).filter(p => 
            p.querySelectorAll('.selectableRow')[0]
        )
    }

    const equippedItems = getContainer('Equipped Items').reduce((acc, p) => {
        const [_, statIncrease, stat, equipmentType] = p
            .innerText
            .replace(/[\r\n]+/gm, " ")
            .match(/(\+\d{1,4})\s(str|def|dex)\s(Armour|Weapon|Shield|Pet|Boots|Greaves|Helmet|Amulet)/);

        return {
            [equipmentType.toLowerCase()]: {
                stat,
                statIncrease: parseInt(statIncrease.replace('+', ''), 10),
            },
            ...acc,
        }
    }, {});

    const unequippedItems = getContainer('Items').map(p => {
        try {
            const onclickContents = p
                .getAttribute('onclick')
                .match(/showInventoryItem\(\d+.*\)/)[0]
                .replace('showInventoryItem(', '')
                .replace(')', '')
                .split(',');
            const textContents = p
                .innerText
                .trim()
                .replace(/\n/gm, '')
                .match(/(\d+)x.*\+(\d+)/);

            const [id, _, __, ___, equipmentType, ____, stats, _____, qty] = onclickContents;

            return {
                element: p,
                id: parseInt(id, 10),
                qty: parseInt(qty, 10),
                stat: stats.match(/str|def|dex/)[0],
                statIncrease: parseInt(textContents[2], 10),
                equipmentType: equipmentType.replace(/'/g, '').toLowerCase(),
            };
        } catch (err) {
            return false;
        }
    }).filter(r => r);

    unequippedItems.forEach(uei => {
        const equipped = equippedItems[uei.equipmentType];
        console.log(uei.statIncrease, equipped.statIncrease, uei.statIncrease > equipped.statIncrease)
        if (uei.statIncrease > equipped.statIncrease) {
            console.log('Item Should Equip');
        } else {
            console.log('Item Should Sell');
            fetch(`/api/quicksell/${uei.id}/quantity`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    _token: document.querySelectorAll('meta[name="csrf-token"]')[0].getAttribute('content'),
                    data: `${uei.qty}`,
                })
            });
        }
    });

    inventoryState[activeEquipmentFilter][activeRarityFilter] = true;
    localStorage.setItem('smmo-ext-inv-state', JSON.stringify(inventoryState))

    return false;
}

let appInterval;
const startInterval = () => {
    appInterval = setInterval(async () => {
        const energyRemaining = getCurrentResource('energy');
        const questsRemaining = getCurrentResource('quest_points');
        const healthRemaining = getResourcePercentage('health');
        const stepsRemaining = getCurrentResource('steps');
        const timesRedeemedSteps = parseInt(localStorage.getItem('smmo-ext-steps'), 10) || 0;

        // closes levelup modal
        isModalOpen();

        if (isJobActive()) {
            console.log('job active')
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
            if (timesRedeemedSteps < 2) {
                stopIt();
                await getMoreSteps();
                localStorage.setItem('smmo-ext-steps', timesRedeemedSteps + 1);
                startIt();
            }
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
    localStorage.removeItem('smmo-ext-inv-mng');
    localStorage.removeItem('smmo-ext-inv-state');
    localStorage.removeItem('smmo-ext-steps');
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

    if (!isJobActive()) {
        stopJobInterval();

        startIt();
        return;
    }
    
    let hasManagedInventory = localStorage.getItem('smmo-ext-inv-mng') === 'true';
    
    jobInterval = setInterval(() => {
        if (isJobActive()) {
            if (!hasManagedInventory) {
                hasManagedInventory = inventory();
                localStorage.setItem('smmo-ext-inv-mng', hasManagedInventory);
            } else {
                window.location.reload(false);
            }
        } else {
            stopJobInterval();

            startIt();
        }
    }, hasManagedInventory ? 300000 : 2000);
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

const WHITELIST = ['/user', '/tasks', '/messages', '/leaderboards', '/discussionboards'];
const isWhitelistedPath = WHITELIST.find(pathname => window.location.pathname.match(pathname));
const start = () => {
    if (isWhitelistedPath) return;

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
            <button class="btn btn-info" name="action" id="bot-jobs" ${isWhitelistedPath ? "disabled" : ""}>
                Jobs: Start
            </button>
            <button class="btn btn-success" name="action" id="bot-play" ${isWhitelistedPath ? "disabled" : ""}>
                Auto: Start
            </button>
        </div>
    </div>
</div>
`;
document.body.prepend(controlDiv);


document.addEventListener("DOMContentLoaded", function() {
    console.log(getToken())
    start();
});
console.log('extension loaded');
