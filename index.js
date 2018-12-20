const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//app.use(pino);

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});


app.post('/api/saveKnitData', (req, res) => {
  console.log("***** Data: " + JSON.stringify(req.body))
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify({message: "success"}))
})

const port = process.env.PORT || 5000;

app.listen(port, () =>
    console.log('Express server is listening on port ' + port)
);
