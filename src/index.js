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
import viewsRouter from './routes/views.routes.js';
import cartsModel from './models/carts.models.js';
import userModel from './models/user.models.js';

// Set app and HTTP server
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
app.use(express.json()); // parse json files
app.use(express.urlencoded({ extended: true })); // parse extended urls
app.engine('handlebars', engine({})); // start views engine
app.set('view engine', 'handlebars'); // set handlebars as view engine
app.set('views', path.resolve(__dirname, './views')); // set relative path to the views folder
app.use(session({ // Create a session upon login
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_DB,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 90 // tiempo de duracion de la sesion.
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use((req, res, next) => { // Middleware para chequear datos de sesion
    if (req.session.user) {
        // En caso de que exista un usario en la sesion actual, se devuelve un mensaje personalizado para usarse en otras rutas.
        const user = req.session.user;
        if(user.rol === 'admin') {
            res.locals.welcomeMessage = `Welcome, ${user.first_name} ${user.last_name}! You are admin!`;
        } else {
            res.locals.welcomeMessage = `Welcome, ${user.first_name} ${user.last_name}!`;
        }
    }
    next();
});

// Socket
const io = new Server(httpServer);

io.on('connection', (socket) => {
    console.log('Conexión con Socket.io');

    // Cuando recibo productos de la vista de productos busco el carrito por su id y añado el producto
    socket.on('add-to-cart', async (productData) => {
        let cart = await cartsModel.findOne({active: true})

        if (!cart) {
            cart = await cartsModel.create({ products: [], active: true })
        }
 
        cart.products.push({
            id_prod: productData._id,
            quantity: 1
        })
 
        await cart.save()
        console.log('Product added to cart:', productData)
    })

}); 

// Serve static files from the "public" folder
app.use('/static', express.static(path.join(__dirname, '/public')));

// Routes
app.use('/api/users', userRouter);
app.use('/api/session', sessionRouter)
app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter)
app.use('/api/messages', messageRouter)
app.use('/static', viewsRouter)