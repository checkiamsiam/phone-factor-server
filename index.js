const express = require('express')
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
      await res.send(result);
    })

    //post data from db

    app.post('/products', async (req, res) => {
      const postItem = req.body;
      const result = await productsCollection.insertOne(postItem);
      res.send(result)
    })

    //edit a single data from db

    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const updateItem = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: req.body
      };
      const result = await productsCollection.updateOne(updateItem, updateDoc, options);
      res.send(result)
    })

    //delete one from db

    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const deleteItem = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(deleteItem);
      res.send(result)

    })



  } finally {

  }
}


run().catch(console.log)



app.get('/', (req, res) => {
  res.send('Hello Server site is here!!!')
})


app.listen(port)