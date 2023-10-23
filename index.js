const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const myCartCollection = client.db('carDb').collection('myCart');


    app.get('/car', async(req, res)=>{
        const cursor = carCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      })
    app.get('/car/:id', async(req, res)=>{
        const id= req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await carCollection.findOne(query);
        res.send(result);
      })

    app.post('/car', async(req, res)=>{
        const newCar = req.body;
        const result = await carCollection.insertOne(newCar) ;
        res.send(result)
    })

    app.put('/car/:id', async(req, res)=>{
      const id =req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updatedCar = req.body;
      const car ={
        $set:{
          name: updatedCar.name, 
          brandName: updatedCar.brandName, 
          price: updatedCar.price, 
          category: updatedCar.category, 
          rating: updatedCar.rating, 
          description: updatedCar.description, 
          photo: updatedCar.photo
        }
      }
      const result = await carCollection.updateOne(filter, car, options);
      res.send(result);
    })

    app.get('/carBrand', async(req, res)=>{
        const cursor = brandCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      })

    app.post('/carBrand', async(req, res)=>{
        const newBrand = req.body;
        const result = await brandCollection.insertOne(newBrand) ;
        res.send(result)
    })

    app.get('/myCart', async(req, res)=>{
        const cursor = myCartCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      })

    app.post('/myCart', async(req, res)=>{
        const newCart = req.body;
        const result = await myCartCollection.insertOne(newCart) ;
        res.send(result)
    })

    app.delete('/myCart/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: id};
      const result = await myCartCollection.deleteOne(query);
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