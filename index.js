require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const stripe = require("stripe")(process.env.STRIPE_SECRET)

const jwt = require('jsonwebtoken')
const port = process.env.PORT || 5000

//using middleware
app.use(cors())
app.use(express.json())


function verifyJWt(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'Unauthorized Access' })
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' })
        }
        req.decoded = decoded;
        next()
    })
}



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7tamy9s.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const categoryCollection = client.db('bookish').collection('category');
        const productsCollection = client.db('bookish').collection('products');
        const bookingsCollection = client.db('bookish').collection('bookings');
        const paymentsCollection = client.db('bookish').collection('payments');
        const advertisedCollection = client.db('bookish').collection('advertise');
        const usersCollection = client.db('bookish').collection('users');


        async function verifyAdmin(req, res, next) {
            const decodedEmail = req.decoded.email;
            const query = { userEmail: decodedEmail };
            const user = await usersCollection.findOne(query);

            if (user?.role !== 'admin') {
                return res.status(403).send({ message: 'Forbidden access' })
            }

            next()
        }

        async function verifySeller(req, res, next) {
            const decodedEmail = req.decoded.email;
            const query = { userEmail: decodedEmail };
            const user = await usersCollection.findOne(query);

            if (user?.role !== 'Seller') {
                return res.status(403).send({ message: 'Forbidden access' })
            }

            next()
        }




        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { userEmail: email };
            const user = await usersCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, {
                    expiresIn: '1h'
                })
                return res.send({ accessToken: token })
            }
            res.status(403).send({ accessToken: '' })
        })

        app.get('/category', async (req, res) => {
            const query = {};
            const category = await categoryCollection.find(query).toArray();
            res.send(category)
        })

        app.get('/category/:id', verifyJWt, async (req, res) => {
            const id = req.params.id;
            const query = { categoryId: id };
            const products = await productsCollection.find(query).toArray();
            res.send(products)
        })

        app.get('/bookings', verifyJWt, async (req, res) => {
            const email = req.query.email;
            const query = { userEmail: email };
            const bookings = await bookingsCollection.find(query).toArray();
            res.send(bookings)
        })

        app.get('/bookings/:id', verifyJWt, async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const booking = await bookingsCollection.findOne(query);
            res.send(booking)
        })

        app.get('/products', verifyJWt, verifySeller, async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const products = await productsCollection.find(query).toArray();
            res.send(products)
        })

        app.get('/reportedProducts',verifyJWt, verifyAdmin, async(req, res)=>{
            const query = { reported : true};
            const result = await productsCollection.find(query).toArray();
            res.send(result)
        })

        app.delete('/reportedProducts/:id', verifyJWt,verifyAdmin, async(req, res)=>{
            const id = req.params.id
            const query = { _id: ObjectId(id)};
            const result = await productsCollection.deleteOne(query);
            res.send(result)
        })

        app.post('/products', verifyJWt, verifySeller, async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.send(result)
        })

        app.put('/products/:id',verifyJWt, async(req, res)=>{
            const id = req.params.id;
            const query ={ _id : ObjectId(id)};
            const updatedDoc = {
                $set : {
                    reported : true
                }
            }
            const reported = await productsCollection.updateOne(query, updatedDoc);
            res.send(reported)
        })

        app.post('/bookings', verifyJWt, async (req, res) => {
            const bookingInfo = req.body;
            const result = await bookingsCollection.insertOne(bookingInfo);
            res.send(result)
        })


        app.post('/create-payment-intent', async (req, res) => {
            const booking = req.body;
            const price = booking.price;
            const amount = price * 100;

            // Create a PaymentIntent with the order amount and currency
            const paymentIntent = await stripe.paymentIntents.create({

                currency: "usd",
                amount: amount,
                "payment_method_types": [
                    "card"
                ]
            });

            res.send({
                clientSecret: paymentIntent.client_secret,
            });
        });

        app.post('/payments', async (req, res) => {
            const payment = req.body;
            const result = await paymentsCollection.insertOne(payment);
            const id = payment.bookingId;
            const filter = { _id: ObjectId(id) };
            const updatedDoc = {
                $set: {
                    paid: true,
                    transactionId: payment.transactionId
                }
            }

            const productId = payment.productID;
            const productFilter = { _id: ObjectId(productId) }

            const productUpdate = await productsCollection.updateOne(productFilter, updatedDoc)

            const updatedResult = await bookingsCollection.updateOne(filter, updatedDoc)
            res.send(updatedResult)
        })

        app.post('/addUser', async (req, res) => {
            const user = req.body;
            const email = { userEmail: user.userEmail };
            const isUser = await usersCollection.findOne(email)
            const users = await usersCollection.insertOne(user);
            res.send(users)
            // if (!isUser._id) {
            //     const users = await usersCollection.insertOne(user);
            //     res.send(users)
            // }
            // res.send({ message: 'User already exists in database!' })

        })

        app.get('/users/buyers', verifyJWt, verifyAdmin, async (req, res) => {
            const query = { role: "Buyer" };
            const buyers = await usersCollection.find(query).toArray();
            res.send(buyers)
        })

        app.get('/users/sellers', verifyJWt, verifyAdmin, async (req, res) => {
            const query = { role: "Seller" };
            const sellers = await usersCollection.find(query).toArray();
            res.send(sellers)
        })

        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email }
            const admin = await usersCollection.findOne(query);
            res.send({ isAdmin: admin?.role === 'admin' })
        })
        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email }
            const admin = await usersCollection.findOne(query);
            res.send({ isSeller: admin?.role === 'Seller' })
        })


        app.put('/products/:id', verifyJWt, verifySeller, async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const updatedDoc = {
                $set: {
                    paid: false
                }
            }

            const result = await productsCollection.updateOne(query, updatedDoc);
            res.send(result)
        })



        app.get('/product-advertise', async (req, res) => {
            const query = {
                advertise: true,
                isSold: false
            }
            const advertisedItems = await productsCollection.find(query).toArray();
            res.send(advertisedItems)
        })


        app.put('/product-advertise/:id', verifyJWt, verifySeller, async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const updatedDoc = {
                $set: {
                    advertise: true
                }
            }
            const advertised = await productsCollection.updateOne(query, updatedDoc);
            res.send(advertised)
        })

        app.put('/users/verify-seller/:userName', verifyJWt, verifyAdmin, async (req, res) => {
            const name = req.params.userName;
            const query = { userName: name }
            const updatedDoc = {
                $set: {
                    isVerifiedSeller: true
                }
            }

            const verifiedUser = await usersCollection.updateOne(query, updatedDoc)
            const filter = {
                sellerName: name
            }

            const result = await productsCollection.updateOne(filter, updatedDoc)
            res.send(verifiedUser)
        })

        app.delete('/products/:id', verifyJWt, verifySeller, async (req, res) => {
            const id = req.params.id
            const productQuery = { _id: ObjectId(id) };
            const bookingQuery = { productID: id }
            const productDelete = await productsCollection.deleteOne(productQuery)
            const bookingDelete = await bookingsCollection.deleteOne(bookingQuery)
            res.send(bookingDelete)
        })

        app.delete('/users/buyers/:id', verifyJWt, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const deleteBuyer = await usersCollection.deleteOne(filter);
            res.send(deleteBuyer)
        })
        app.delete('/users/sellers/:id', verifyJWt, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const deleteSeller = await usersCollection.deleteOne(filter);
            res.send(deleteSeller)
        })




    }
    finally { }
}

run().catch(console.log)


app.get('/', (req, res) => {
    res.send('Bookish server is running.')
})

app.listen(port, () => {
    console.log(`Bookish server is running on port: ${port}`)
})