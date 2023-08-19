var axios = require('axios');
var FormData = require('form-data');
const express = require("express");
// const twilio = require("twilio");
const app = express();

async function postLogin() {
    try {
        const response = await fetch('https://notify.eskiz.uz/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: '***REMOVED***',
                password: '***REMOVED***'
            })
        });
        const result = await response.json();
        console.log('Response:', result);
        return result.data.token;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
async function sendSMSCode(token) {
    try {
        const response = await fetch('https://notify.eskiz.uz/api/message/sms/send-global', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                mobile_phone: '789994246982',
                message: 'salom 15478',
                from: '4546'
            })
        });
        const result = await response.json();
        console.log('Response:', result);
        return result.data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
async function reLogin(token) {
    try {
        const response = await fetch('https://notify.eskiz.uz/api/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Token': token
            }
        });
        const result = await response.json();
        console.log('Response:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}
async function sendSMS() {
    let token = await postLogin();
    console.log(token);
    sendSMSCode(token);
}



app.listen(3008, async() => {
    sendSMS()
    console.log("twilio uchun server ishladi!");
})