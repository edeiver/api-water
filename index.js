const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

app.set('port', process.env.PORT || 3000);
app.use(cors())
//app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use(require('./database/route'))
// Starting the server
app.listen(app.get("port"), () => {
    console.log("Server on port", app.get("port"));
  });