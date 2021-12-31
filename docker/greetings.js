const express = require('express')
const app = express()
const port = 3000

const greetings = {
  'EN': 'Hello, Friend',
  'ES': 'Hola, Amigo',
  'FR': 'Bonjour, Ami',
};

app.get('/', (req, res) => {

  if (greetings[process.env.LANG]) {
    res.send(greetings[process.env.LANG]);
    return;
  }

  res.send(greetings['EN']);

})

app.listen(port, () => {
  console.log(`this is the ${process.env.LANG} greeting service` );
  console.log(`Example app listening at http://localhost:${port} inside of the docker container!`)
})
