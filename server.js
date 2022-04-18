const express = require('express');

//start a node server
const app = express();
app.use(express.json())

const routes = require('./router/routes');
app.use('/', routes);

app.listen(3000, () => {
    console.log("server started");
})