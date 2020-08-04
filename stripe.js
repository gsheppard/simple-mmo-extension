const secret = "pi_1HCHFaFHshS21ZYsOf0Q1vLH_secret_baJ4opMFtYQ1B383U562YYR3f";
const [_, clientId, clientSecret] = secret.match(/(.*)(\_secret.*)/);

{
    "id": "pi_1HCHHjFHshS21ZYsFLuiFM8I",
    "object": "payment_intent",
    "amount": 404,
    "canceled_at": null,
    "cancellation_reason": null,
    "capture_method": "automatic",
    "client_secret": "pi_1HCHHjFHshS21ZYsFLuiFM8I_secret_XLzBqUixxYFzfaYWcqdT7wgLn",
    "confirmation_method": "automatic",
    "created": 1596513475,
    "currency": "usd",
    "description": null,
    "last_payment_error": null,
    "livemode": true,
    "next_action": null,
    "payment_method": "pm_1HCHIOFHshS21ZYsRFOX2z5U",
    "payment_method_types": [
      "card"
    ],
    "receipt_email": null,
    "setup_future_usage": null,
    "shipping": null,
    "source": null,
    "status": "succeeded"
  }
  

$.ajax({
    url: "/api/diamondstore/stripe/confirm",
    type:"POST",
    data: {
        '_token': document.querySelectorAll('meta[name="csrf-token"]')[0].getAttribute('content'),
        intent : paymentIntent
    },
    success: function(data){
        console.log('success')
    },
    error: function() {
        console.error('ERROR')
    }
});


fetch("https://web.simple-mmo.com/api/diamondstore/stripe/confirm", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "x-csrf-token": "1EIuWF344bP75CPWr2mR4esRwXC9SehPzcfbmiAS",
    "x-requested-with": "XMLHttpRequest"
  },
  "referrer": "https://web.simple-mmo.com/diamondstore/diamonds/purchase/custom/25",
  "referrerPolicy": "no-referrer-when-downgrade",
  "body": "_token=1EIuWF344bP75CPWr2mR4esRwXC9SehPzcfbmiAS&intent%5Bid%5D=pi_1HCHHjFHshS21ZYsFLuiFM8I&intent%5Bobject%5D=payment_intent&intent%5Bamount%5D=404&intent%5Bcanceled_at%5D=&intent%5Bcancellation_reason%5D=&intent%5Bcapture_method%5D=automatic&intent%5Bclient_secret%5D=pi_1HCHHjFHshS21ZYsFLuiFM8I_secret_XLzBqUixxYFzfaYWcqdT7wgLn&intent%5Bconfirmation_method%5D=automatic&intent%5Bcreated%5D=1596513475&intent%5Bcurrency%5D=usd&intent%5Bdescription%5D=&intent%5Blast_payment_error%5D=&intent%5Blivemode%5D=true&intent%5Bnext_action%5D=&intent%5Bpayment_method%5D=pm_1HCHIOFHshS21ZYsRFOX2z5U&intent%5Bpayment_method_types%5D%5B%5D=card&intent%5Breceipt_email%5D=&intent%5Bsetup_future_usage%5D=&intent%5Bshipping%5D=&intent%5Bsource%5D=&intent%5Bstatus%5D=succeeded",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});


fetch("https://web.simple-mmo.com/api/diamondstore/stripe/confirm", {
  "headers": {
    "x-csrf-token": "1EIuWF344bP75CPWr2mR4esRwXC9SehPzcfbmiAS",
  },
  "referrer": "https://web.simple-mmo.com/diamondstore/diamonds/purchase/custom/25",
  "referrerPolicy": "no-referrer-when-downgrade",
  "body": "_token=1EIuWF344bP75CPWr2mR4esRwXC9SehPzcfbmiAS&intent%5Bid%5D=pi_1HCHHjFHshS21ZYsFLuiFM8I&intent%5Bobject%5D=payment_intent&intent%5Bamount%5D=404&intent%5Bcanceled_at%5D=&intent%5Bcancellation_reason%5D=&intent%5Bcapture_method%5D=automatic&intent%5Bclient_secret%5D=pi_1HCHHjFHshS21ZYsFLuiFM8I_secret_XLzBqUixxYFzfaYWcqdT7wgLn&intent%5Bconfirmation_method%5D=automatic&intent%5Bcreated%5D=1596513475&intent%5Bcurrency%5D=usd&intent%5Bdescription%5D=&intent%5Blast_payment_error%5D=&intent%5Blivemode%5D=true&intent%5Bnext_action%5D=&intent%5Bpayment_method%5D=pm_1HCHIOFHshS21ZYsRFOX2z5U&intent%5Bpayment_method_types%5D%5B%5D=card&intent%5Breceipt_email%5D=&intent%5Bsetup_future_usage%5D=&intent%5Bshipping%5D=&intent%5Bsource%5D=&intent%5Bstatus%5D=succeeded",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});