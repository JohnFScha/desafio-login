import { Router } from 'express';
import cartsModel from '../models/carts.models.js';
import productModel from '../models/products.models.js';
import userModel from '../models/user.models.js';

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
    const user = req.session.user
    console.log(user)

    const cleanData = {
        products: cart.products.map(product => ({
            title: product.id_prod.title,
            description: product.id_prod.description,
            price: product.id_prod.price,
            quantity: product.quantity
        }))
    };
    if(!user) {
        res.render('forbidden', {
            pathCSS: 'forbidden',
            pathJS: 'forbidden'
        })
    } else {
        if (cart) {
            const message = res.locals.welcomeMessage;  
            res.render('productsViews', {
                message: message,
                products: cleanData.products,
                pathJS: 'productsViews',
                pathCSS: 'productsViews'  
            });
        }
    }
});

viewsRouter.get('/products', async (req, res) => {
    const products = await productModel.find();
    const user = req.session.user
    console.log(user)

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

    if(!user) {
        res.render('forbidden', {
            pathCSS: 'forbidden',
            pathJS: 'forbidden'
        })
    } else {
        res.render('products', {
            products: cleanData.products,
            pathCSS: 'products',
            pathJS: 'products'
        });
    }
});

viewsRouter.get('/users', async (req, res) => {
    const users = await userModel.find();
    const user = req.session.user
    console.log(req.session)
     
    const cleanData = {
        users: users.map(user => ({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            rol: user.rol
        }))
    }
 
    if(user.rol === 'admin') {
        res.render('users', {
            users: cleanData.users,
            pathCSS: 'users',
            pathJS: 'users'
        })
    } else {
        res.render('forbidden', {
            pathCSS: 'forbidden',
            pathJS: 'forbidden'
        })
    }
})

export default viewsRouter;