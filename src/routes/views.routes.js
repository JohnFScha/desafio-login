import { Router } from 'express';
import cartsModel from '../models/carts.models.js';
import productModel from '../models/products.models.js';

const viewsRouter = Router({caseSensitive: false});

// Define the routes
viewsRouter.get('/register', async (req, res) => {
    res.render('register', {
        pathJS: 'register',
        pathCSS: 'register'
    });
});

viewsRouter.get('/login', async (req, res) => {
    res.render('login', {
        pathJS: 'login',
        pathCSS: 'login'
    });
});

viewsRouter.get('/productsViews', async (req, res) => {
    const cart = await cartsModel.findOne({active: true});

    const cleanData = {
        products: cart.products.map(product => ({
            title: product.id_prod.title,
            description: product.id_prod.description,
            price: product.id_prod.price,
            quantity: product.quantity
        }))
    };

    if (cart) {
        const message = res.locals.welcomeMessage;
        res.render('productsViews', {
            message: message,
            products: cleanData.products,
            pathJS: 'productsViews',
            pathCSS: 'productsViews'  
        });
    }
});

viewsRouter.get('/products', async (req, res) => {
    const products = await productModel.find();
    
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
        pathCSS: 'products',
        pathJS: 'products'
    });
});

export default viewsRouter;