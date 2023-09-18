import { Router } from "express";
import cartsModel from "../models/carts.models.js";

const cartsRouter = Router({ caseSensitive: false });

// Traer todos los carritos
cartsRouter.get("/", async (req, res) => {
  const { limit } = req.query;

  try {
    const carts = await cartsModel.find().limit(limit);
    res.status(200).send(carts);
  } catch (error) {
    res.status(400).send({ error: `Error checking for carts: ${error}` });
  }
});

// Traer carrito por ID
cartsRouter.get("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartsModel.findOne({_id: cid}, {"products": 1});
    
    if (cart) {
      res.status(200).send(cart);
    } else {
      res.status(404).send({ result: "Not found" });
    }
  } catch (error) {
    res.status(500).send({ error: `Error checking for cart: ${error}` });
  }
});

// Crear carrito vacio
cartsRouter.post("/", async (req, res) => {
  
  try {
    const respuesta = await cartsModel.create({});
    res.status(200).send({ resultado: "OK", message: respuesta });
  } catch (error) {
    res.status(400).send({ error: `Error al crear producto: ${error}` });
  }
});

// Crear nuevo producto en el carrito
cartsRouter.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await cartsModel.findById(cid);
    if (cart) {
      cart.products.push({ id_prod: pid, quantity: quantity });
      const respuesta = await cartsModel.findByIdAndUpdate(cid, cart);
      res.status(200).send({ respuesta: "OK", mensaje: respuesta });
    }
  } catch (e) {
    res.status(400).send({ error: e });
  }
});

cartsRouter.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const products = req.body.products;

  try {
    const cart = await cartsModel.findOne({ _id: cid });

    if (!cart) {
      return res.status(404).send({ error: "Cart not found" });
    }

    products.forEach((newProduct) => {
      const product = cart.products.find(
        (prod) => prod.id_prod._id.toString() === newProduct.id_prod
      );

      if (product) {
        product.quantity = newProduct.quantity;
      } else {
        cart.products.push({
          id_prod: newProduct.id_prod,
          quantity: newProduct.quantity,
        });
      }
    });

    await cart.save();

    res.status(200).send({ resultado: "OK", message: cart });
  } catch (error) {
    res.status(500).send({ error: `Error updating cart: ${error}` });
  }
});

// Actualizar carrito por su ID// Eliminar un producto del carrito por su id
cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await cartsModel.findById(cid);
    
    if (cart) {
      cart.products = cart.products.filter(product => product.id_prod._id .toString() !== pid);
      const respuesta = await cartsModel.findByIdAndUpdate(cid, cart, { new: true });
      res.status(200).send({ respuesta: "OK", mensaje: respuesta });
    } else {
      res.status(404).send({ error: "Cart not found" });
    }
  } catch (e) {
    res.status(400).send({ error: e });
  }
});
cartsRouter.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const cart = await cartsModel.findOne({_id: cid});
    console.log(cart)
    const product = cart.products.find(prod => prod.id_prod._id.toString() === pid)
    console.log(product)

    if(!product) {
      res.status(404).send('Not found')
    } else {
      product.quantity = quantity
      await cart.save()
  
      res.status(200).send({ resultado: "OK", message: cart })
    }
  } catch (error) {
    res.status(400).send({ error: `Error al crear producto: ${error}` });
  }
});

// Borrar carrito por su ID
cartsRouter.delete("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartsModel.findByIdAndUpdate(cid, {
      products: []
    });

    cart
      ? res.status(200).send({ resultado: "OK", message: cart})
      : res.status(404).send({ resultado: "Not Found", message: cart });
  } catch (error) {
    res.status(400).send({ error: `Error al eliminar carrito: ${error}` });
  }
});

// Eliminar un producto del carrito por su id
cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await cartsModel.findById(cid);
    
    if (cart) {
      cart.products = cart.products.filter(product => product.id_prod._id .toString() !== pid);
      const respuesta = await cartsModel.findByIdAndUpdate(cid, cart, { new: true });
      res.status(200).send({ respuesta: "OK", mensaje: respuesta });
    } else {
      res.status(404).send({ error: "Cart not found" });
    }
  } catch (e) {
    res.status(400).send({ error: e });
  }
});

export default cartsRouter;
