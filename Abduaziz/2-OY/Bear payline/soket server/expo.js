const express = require('express');
const bodyParser = require('body-parser');
const {Expo} = require('expo-server-sdk');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/send-push', (req, res) => {
  const { token, title, body } = req.body;

  if (!token || !title || !body) {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  const expo = new Expo();
  const messages = [{
    to: token,
    sound: 'default',
    title: title,
    body: body,
    data: { extraData: 'Some extra data' },
  }];

  expo.sendPushNotificationsAsync(messages)
    .then(response => {
      const receipts = response[0];
      const status = receipts.status;

      if (status === 'ok') {
        res.json({ message: 'Push-bildirishnoma muvaffaqiyatli yuborildi' });
      } else {
        res.status(500).json({ error: 'Push bildirishnoma yuborilmadi' });
      }
    })
    .catch(error => {
      console.error('Push-bildirishnoma yuborishda xatolik yuz berdi:', error);
      res.status(500).json({ error: 'Xatolik yuz berdi' });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
