const express = require('express');
const app = express();
const api = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const uuid = require('uuid');
const path = require('path');

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.resolve(__dirname, 'front/dist/front')));

let sessions = [];

api
  .post('/login', (req, res) => {
    const sessionId = uuid.v4();

    sessions.push({
      email: req.body.email,
      password: req.body.password,
      sessionId,
    });

    setTimeout(() => res.json({ sessionId }), 2000);
  })
  .post('/otp', (req, res) => {
    const sessionId = req.body.sessionId || '';
    const code = req.body.code || '';
    console.log(sessionId, code, sessions);

    const isValidSessionId = sessions
      .map((session) => session.sessionId)
      .includes(sessionId);

    if (!isValidSessionId) {
      res
        .status(401)
        .json({ errorMsg: 'Invalid session' });
      return;
    }

    console.log(code);
    const isValidOtp = code.startsWith('5');

    if (!isValidOtp) {
      res
        .status(400)
        .json({ errorMsg: 'Invalid OTP' });
      return;
    }

    const prevSession = sessions.find((session) => session.sessionId === sessionId);
    sessions = sessions.filter((session) => session.sessionId !== sessionId);

    const newSessionId = uuid.v4();
    sessions.push({
      ...prevSession,
      sessionId: newSessionId,
    });

    setTimeout(() => {
      res
        .status(200)
        .json({ sessionId: newSessionId });
    }, 2000);
  });

app.use('/api', api);

app.get('**', (req, res) => {
  res.sendFile(
    path.resolve(__dirname, 'front/dist/front/index.html')
  );
});

app.listen(3000, () => console.log('Server is running on localhost:3000'));
