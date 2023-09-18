import { Router } from "express";
import productModel from "../models/products.models.js";

const productRouter = Router({ caseSensitive: false });

// Get products by passing several optional filters:
productRouter.get("/", async (req, res) => {
  const { limit, page, sort, query, direction, category, stock } = req.query; //Optional query params

  // Convert limit and page to number
  const limitNumber = Number(limit) || 10; // Default limit is 10
  const pageNumber = Number(page) || 1; // Default page is 1

  // Define sort object based on sort query
  let sortObject;
  const sortDirection = direction === 'desc' ? -1 : 1; // Ascending order by default
  switch (sort) {
    case 'price':
      sortObject = { price: sortDirection };
      break;
    case 'quantity':
      sortObject = { quantity: sortDirection };
      break;
    default:
      sortObject = {}; // Default is no sorting
  }

  // Define filter object based on query
  let filterObject = query ? { title: { $regex: query, $options: 'i' } } : {}; // Case insensitive search in title
  if (category) {
    filterObject = { ...filterObject, category: category }; // Add category to filter object if it exists
  }
  if (stock) {
    filterObject = { ...filterObject, stock: { $gt: 0 }}
  }

  try {
    const options = {
      page: pageNumber,
      limit: limitNumber,
      sort: sortObject
    };

    const products = await productModel.paginate(filterObject, options);
    res.status(200).send({ status: "success", message: products });
  } catch (error) {
    res.status(400).send({ status: `Error checking for products: ${error}` });
  }
});

productRouter.get("/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    const product = await productModel.findById(pid);

    if (product) {
      res.status(200).send({ result: "Ok", message: product });
    } else {
      res.status(404).send({ result: "Not found" });
    }
  } catch (error) {
    res.status(500).send({ error: `Error checking for product: ${error}` });
  }
});

productRouter.post("/", async (req, res) => {
  const { title, description, category, price, stock, code } = req.body;

  try {
    // Creo el nuevo usuario, igual al metodo insertOne() de mongo.
    const response = await productModel.create({
      title,
      description,
      category,
      price,
      stock,
      code,
    });

    // Lo envio
    res
      .status(200)
      .send({ result: "Product created succesfully", message: response });
  } catch (error) {
    res.status(400).send({ error: `Error creating product: ${error}` });
  }
});

productRouter.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const { title, description, category, price, stock, code, status } = req.body;

  try {
    const response = await productModel.findByIdAndUpdate(pid, {
      title,
      description,
      category,
      price,
      stock,
      code,
      status,
    });

    if (response) {
      res.status(200).send({ result: "Ok", message: response });
    } else {
      res.status(404).send({ result: "Not found" });
    }
  } catch (error) {
    res.status(500).send({ error: `Error updating product: ${error}` });
  }
});

productRouter.delete("/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    const response = await productModel.findByIdAndDelete(pid);

    if (response) {
      res.status(200).send({ result: "Ok", message: response });
    } else {
      res.status(404).send({ result: "Not found" });
    }
  } catch (error) {
    res.status(500).send({ error: `Error deleting product: ${error}` });
  }
});

export default productRouter;
