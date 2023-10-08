const connecToMongo=require('./database');
const express = require('express')
let cors = require('cors')
connecToMongo();

const app = express()
const port = 5000

app.use(cors())

app.use(express.json());

  app.use('/api/auth',require('./routes/auth'))
  app.use('/api/notes',require('./routes/notes'))
  
app.listen(port, () => {
  console.log(`EastNotes listening on port http://localhost:${port}`)
})


