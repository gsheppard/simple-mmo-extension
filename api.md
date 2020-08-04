POST https://web.simple-mmo.com/api/healer/heal
- json
- { _token: csrfToken, data: true }
fetch('/api/healer/heal', {
    'method': 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        _token: document.querySelectorAll('meta[name="csrf-token"]')[0].getAttribute('content'),
        data: true
    })
})