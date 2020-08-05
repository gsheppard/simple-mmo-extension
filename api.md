# Heal API
```js
POST https://web.simple-mmo.com/api/healer/heal
- json
- body: { _token: csrfToken, data: true }

fetch('/api/healer/heal', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        _token: getToken(),
        data: true
    })
})
```

# Earn Steps API
```js
fetch(`/addstepsapi`, {
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
```

# Earn Quest Points API
```js
fetch(`/addqpapi`, {
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
```

# Earn Key API
```js
fetch(`/addkeyapi`, {
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
```

# Travel API
```js
fetch("/api/travel/perform", {
    method: "POST",
    headers: {
        'x-csrf-token': getToken(),
    },
    body: JSON.stringify({
        '_token': getToken(),
        api_token: API_TOKEN,
        testdata: 'testdatacontent',
        d_1: 0,
        d_2: 0,
        hash_fj8n3u7: 'gjf83k48jf'
    })
});
```


# Generate Monster API
```js
fetch("/api/battlearena/generate", {
    method: "POST",
    body: JSON.stringify({
        '_token': getToken(),
        api_token: API_TOKEN,
    })
});
```

# Attack API
```js
fetch(`/api/npcs/attack/${monsterId}`, {
    method: 'POST',
    headers: {
        'x-csrf-token': getToken(),
    },
    body: {
        '_token': getToken(),
        api_token: API_TOKEN,
        special_attack: false,
    },
});
```

# Quest API
```js
fetch(`/api/quest/${questId}`, {
    method: 'POST',
    body: {
        api_token: API_TOKEN,
    },
});
```

# Diamond Store API
```js
$.ajax({
    url: "/api/diamondstore/stripe/confirm",
    type:"POST",
    data: {
        '_token': getToken(),
        intent : paymentIntent
    },
    success: function(data){
        console.log('success')
    },
    error: function() {
        console.error('ERROR')
    }
});
```

# Open Chest API
```js
/api/openchest/silver/1

fetch(`/api/openchest/silver/1`, {
    method: 'POST',
    body: {
        '_token': getToken(),
    },
});
```

# Collectable Chest API
```js
fetch("/api/collectable/chest", {
    method: "POST",
    headers: {
        "content-type": "application/json",
    },
    body: JSON.stringify({
        "_token": getToken(),
        type: "sprites",
    }),
});
```

# Level Up API
```js
fetch(`/api/user/upgrade/${stat}`, {
    method: "POST",
    headers: {
        "content-type": "application/json",
    },
    body: JSON.stringify({
        "_token": getToken(),
        amount: amount,
    }),
});
```