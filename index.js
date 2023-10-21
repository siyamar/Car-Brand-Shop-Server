const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

// carShope
// nLVKZbmhWtrskTKz


const uri = "mongodb+srv://carShope:nLVKZbmhWtrskTKz@cluster0.kbgngea.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const carCollection = client.db('carDb').collection('car');
    const brandCollection = client.db('carDb').collection('carBrand');

    app.get('/car', async(req, res)=>{
        const cursor = carCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      })

    app.post('/car', async(req, res)=>{
        const newCar = req.body;
        console.log(newCar);
        const result = await carCollection.insertOne(newCar) ;
        res.send(result)
    })
    app.get('/carBrand', async(req, res)=>{
        const cursor = brandCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      })

    app.post('/carBrand', async(req, res)=>{
        const newBrand = req.body;
        console.log(newBrand);
        const result = await brandCollection.insertOne(newBrand) ;
        res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('Brand Shop Server is Running')
})

app.listen(port, ()=>{
    console.log(`Brand Shop is Running on port: ${port}`)
})