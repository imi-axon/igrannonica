const express = require('express');
const path = require('path')
const port = 10015;
const app = express()
const cors = require('cors');

app.use(express.static('./app'))
app.use(cors())
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.sendFile('./app/index.html',{root:__dirname})
});

app.get('/', getRoot);
app.get('/*', getUndefined);

app.listen(port, () => {
    console.log("Server is listening on port "+port);
});

function getRoot(request, response) {
   response.sendFile(path.resolve('./app/index.html'));
}

function getUndefined(request, response) {
   response.sendFile(path.resolve('./app/index.html'));
}