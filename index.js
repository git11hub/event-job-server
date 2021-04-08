const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
require('dotenv').config()

const port = process.env.PORT || 8080

app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);

app.get('/', (req, res) => {
    res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eftco.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("connection err khaisire", err);
    const jobCollection = client.db("event-job").collection("job-list");

    app.get('/job-list', (req, res) => {
        jobCollection.find()
        .toArray((err, items) => {
            res.send(items);
            // console.log('from database hoho', items);
        })
    })
    
    app.post('/addEvent', (req, res) => {
        const newEvent = req.body;
        console.log(newEvent);
        console.log('adding new event', newEvent);
        jobCollection.insertOne(newEvent)
        .then(result => {
            console.log('inserted count', result.insertedCount);
            res.send(result.insertedCount > 0)
        })
    })

    // client.close();
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})