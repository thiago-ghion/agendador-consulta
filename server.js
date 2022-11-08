const path = require('path');
const express = require('express');

const app = express();

app.use(express.static(path.join(__dirname, 'build')));
app.get('/trocaSenhaPaciente', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
})
app.get('/trocaSenhaColaborador', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
})

app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), function() {
  console.log('listening on port ', server.address().port);
});