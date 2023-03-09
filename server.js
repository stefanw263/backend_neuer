const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')

const app = express()
const port = 3000

const connectionString = 'mongodb+srv://stefan:dehbwfhb3z38237zfedhwhefbh323zfaf@justin-dhbw-projekt.7ktjk7n.mongodb.net/test'
const client = new MongoClient(connectionString);

let db


/* ------------------------------------------------- */


app.use(express.json())

app.get('/contacts', async (req,res) => {
  let collection = await db.collection("Contacts");
  let results = await collection.find({}).toArray();

  res.send(results).status(200);

})

app.get('/contacts/search/:name', async (req,res) => {

  const query = {
    '$or': [
      { 'firstname': req.params.name }, 
      { 'lastname': req.params.name }
    ]
  }

  let collection = await db.collection("Contacts");
  let results = await collection.find(query).toArray();

  res.send(results).status(200);

})

app.post('/contacts', async (req,res) => {
  let newContact = req.body;
  
  let collection = await db.collection("Contacts");
  let result = await collection.insertOne(newContact);

  res.send(result).status(204);
})

app.put('/contacts/:id', async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) }

  console.log(req.body)

  const updates = { $set: req.body }

  const collection = db.collection('Contacts');
  let result = await collection.updateOne(query, updates);

  res.send(result).status(200)
})

app.delete('/contacts/:id', async (req, res) => {
  console.log(req.params.id)
  const query = { _id: new ObjectId(req.params.id) }

  const collection = db.collection('Contacts');
  let result = await collection.deleteOne(query)

  res.send(result).status(200)
})


app.post('/auth', async (req, res) => {

  const query = {username: req.body.username}

  let collection = await db.collection("Users");
  let result = await collection.findOne(query);

  console.log(result)

  if(result && req.body.passwd == result.passwd)
    res.send(200, result._id)
  
  else 
    res.send(401, 'wrong email or password')

} )


/* ------------------------------------------------- */


app.listen(port, async () => {
  let connection

  try 
  {
    connection = await client.connect();
  } catch(error) {
    console.error(error);
  }
  
  db = connection.db("ContactList");

  console.log(`Example app listening on port ${port}`)
})