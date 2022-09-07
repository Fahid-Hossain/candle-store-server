const express = require('express')
const app = express()
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
const port = 5000

//Middleware

//cors -- cros platform handle
app.use(cors())

// body parser
app.use(express.json());


// user : candle-store-db
// pass : 0qwXmNTaCwjfY3n9

// From Mongodb Database
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://candle-store-db:0qwXmNTaCwjfY3n9@cluster0.w2qch.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


client.connect(err => {
  const userCollection = client.db("candle-store").collection("users");
  console.log("hitting the database");


  // POST api from client side to database
  app.post("/users",(req, res)=>{
    const newUser = req.body;
    const result = userCollection.insertOne(newUser)
    .then(() => {
      console.log("insert success",newUser);
    })

    res.json(result);
    
  })

  // Get api from database to client side` (async await function needed)
  app.get("/users", async(req, res)=>{
    const cursor = userCollection.find({});
    const users = await cursor.toArray();
    console.log(users);
    res.send(users);
  })

  // Get api dynamic single user load from db 
  app.get('/users/:id', async (req, res)=>{
    const userId = req.params.id;
    const matchedUser = {_id: ObjectId(userId)};
    const user = await userCollection.findOne(matchedUser);
    res.send(user);


  })


  // Delete api from database and client side
  app.delete('/users/:id', async(req,res)=>{
    const userId = req.params.id;
    console.log("deleting user",userId);
    const query = { _id: ObjectId(userId) };
    const result = await userCollection.deleteOne(query);
    console.log("deleted user result",result);
    res.json(result);

  })




  // perform actions on the collection object
  // client.close();
});


app.get('/', (req, res) => {
  res.send('Hello World! from candle store server with with nodemon.')
})

//fake data
const datas = [
  { id: 0, name: 'John', email: 'abc@gmail.com' },
  { id: 1, name: 'elon', email: 'eko@gmail.com' },
  { id: 2, name: 'fuad', email: 'moi@gmail.com' },
]

//Get data in route
app.get("/data", (req, res) => {
  //Get data with search query
  const search = req.query.search;
  if (search) {
    const seachResult = datas.filter(data => data.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
    res.send(seachResult)
  } else {

    res.send(datas)
  }
})

//Dynamic Data in route
app.get("/data/:id", (req, res) => {
  const userId = (req.params.id);
  const matchedUser = datas[userId];
  res.send(matchedUser);
})

// Post api request
app.post("/userFeedbacks", (req, res) => {
  console.log("Hitting the post api", req.body);
  const userFeedback = req.body;
  res.send(JSON.stringify(userFeedback));
})


app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})