const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`this is the ${process.env.LANG} greeting service` );
  console.log(`Example app listening at http://localhost:${port} inside of the docker container!`)
})
