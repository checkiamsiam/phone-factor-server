const express = require('express')
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.ifdur.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    //connection and collection creation
    await client.connect();
    const productsCollection = client.db("Inventory").collection("Products");

    //get data from db

    app.get('/products', async (req, res) => {
      const query = req.query;
      const cursor = await productsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })




  } finally {

  }
}


run().catch(console.log)



app.get('/', (req, res) => {
  res.send('here is your server side')
})


app.listen(port)