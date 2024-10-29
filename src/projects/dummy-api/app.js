const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())

app.get("/", (req, res) => {
  res.json([
    {
      "id": 1,
      "content": "Dummy content has"
    },
    {
      "id": 2,
      "content": "Some more dummy content"
    },
    {
      "id": 3,
      "content": "Much more dummy content"
    }
  ])
})


app.listen(5500, () => {
  console.log('listening for requests on port 5500')
})
