var express = require('express');
var app = express();

app.use(express.static('./'))

app.get('/', function (req, res) {
  res.send('Hello there');
});

app.listen(8000, function(){
  console.info('Listening on 8000');
});
