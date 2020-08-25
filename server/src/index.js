const express = require('express');

const bodyParser = require('body-parser');
const cors = require('cors');

const db = require('./database');

const app = express(); 
app.use(bodyParser.json());
app.use(cors());

const port = 3000;

app.get('/', (req, res) => { 
    res.status(200).send("Testing only");
})

app.post('/', (req, res) => { 
    let query = req.body.query

    db.any({ 
        text: query
    })
        .then( data => { res.status(200).send(data)})
        .catch( error => res.status(400).send("ERROR: " + error.message || error))

})


app.listen(port, () => { 
    console.log(`Server started on port: ${port}`)
}) 