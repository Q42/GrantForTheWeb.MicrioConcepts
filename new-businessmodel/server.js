const express = require('express');
const app = express();
app.use(express.json());

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// https://expressjs.com/en/starter/basic-routing.html
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/admin', (request, response) => {
  response.sendFile(__dirname + '/views/admin.html');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(
    'Your app is listening on http://localhost:' + listener.address().port
  );
});
