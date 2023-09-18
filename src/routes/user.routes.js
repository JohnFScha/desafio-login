import { Router } from "express";
import userModel from '../models/user.models.js';

const userRouter = Router({caseSensitive: false});


// Crear user
userRouter.post('/api/users', async (req, res) => {
	const {first_name, last_name, age, email, password} = req.body;

	try {
		const newUser = await userModel.create({
			first_name,
			last_name,
			age,
			email,
			password
		})

		if (newUser) {
			res.status(200).send({success: 'User created.'})
		} else {
			res.status(403).send({message: 'forbidden.'})
		}
	} catch (error) {
		res.status(500).send({message: `Internal server error: ${error}.`})
	}
})

export default userRouter;