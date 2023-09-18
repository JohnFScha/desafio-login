import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import { __dirname } from './path.js';
import path from 'path';
import productRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import messageRouter from './routes/messages.routes.js';
import sessionRouter from './routes/session.routes.js';
import userRouter from './routes/user.routes.js';
import productModel from './models/products.models.js';
import cartsModel from './models/carts.models.js';

const app = express();
const PORT = 4000;
const httpServer = app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`)
});

// Connect to DB
mongoose.connect(process.env.MONGO_DB)
    .then(() => console.log('Connection to DB'))
    .catch((error) => console.log(error))

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_DB,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 90 // tiempo de duracion de la sesion.
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

// Socket
const io = new Server(httpServer);

io.on('connection', async (socket) => {
    console.log('Conexión con Socket.io');

    const products = await productModel.find();
    socket.emit('products', products);

    socket.on('add-to-cart', async (productData) => {
        console.log(productData)
        let cart = await cartsModel.findOne({ _id: "64f8fbb6d998a951bcb2774e" })
        if (!cart) {
            cart = await cartsModel.create({ products: [] })
        }

        cart.products.push({
            product: productData._id,
            quantity: 1
        })

        await cart.save()
        console.log('Product added to cart:', productData)
    })
});

// // Serve static files from the "public" folder
app.use('/static', express.static(path.join(__dirname, '/public')));

app.get('/static/products', async (req, res) => {
    const products = await productModel.find()

    const cleanData = {
        products: products.map(product => ({
            title: product.title,
            description: product.description,
            category: product.category,
            price: product.price,
            stock: product.stock,
            _id: product._id
        }))
    };

    res.render('products', {
        products: cleanData.products,
        pathCSS: 'productPs',
        pathJS: 'products'
    });
});

app.get('/static/login', async (req, res) => {
    res.render('login')
})


// Routes
app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter)
app.use('/api/messages', messageRouter)
app.use('/api/session', sessionRouter)
app.use('/api/users', userRouter);