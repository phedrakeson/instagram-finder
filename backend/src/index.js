//Importing files
const express = require('express');
require('dotenv/config');

const controller = require('./controller');

const app = express();

//Add router to espress
app.get('/instagram/:username', controller.findByUserName);
app.get('/instagram', controller.searchQuery);

//Starting server
app.listen(process.env.port, () => {
  console.log(`Server running in the port ${process.env.port} 🚀`)
})