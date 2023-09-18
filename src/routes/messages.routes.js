import { Router } from "express";
import messageModel from "../models/message.models.js";

const messageRouter = Router({ caseSensitive: false });

messageRouter.get('/', async (req, res) => {
  const { limit } = req.query;

  try {
    const messages = await messageModel.find().limit(limit)
    if (messages) {
      res.status(200).send({messages: messages});
    } else {
      res.status(404).send({error: 'Not found'});
    }
  } catch (error) {
    res.status(500).send({error: `Internal server error: ${error}`});
  }
})

messageRouter.post('/', async (req, res) => {
	const { email, message } = req.body;

	try {
		const respuesta = await messageModel.create({
			email,
			message,
		});
    if (respuesta) {
      res.status(200).send({ message: respuesta });
    } else {
      res.status(400).send({ error: `Error al crear producto: ${error}` });
    }
	} catch (error) {
    res.status(500).send({error: `Internal server error: ${error}`});
	}
});

export default messageRouter;