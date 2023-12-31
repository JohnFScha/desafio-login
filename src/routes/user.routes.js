import { Router } from "express";
import userModel from '../models/user.models.js';

const userRouter = Router({caseSensitive: false});

// Get users
userRouter.get('/', async (req, res) => {
	try {
		const users = await userModel.find()

		if(users) {
			res.status(200).send({status: 'success', users: users})
		} else {
			res.status(404).send({status: 'error', message: 'Not found'})
		}
	} catch (error) {
		res.status(500).send({Error: `Internal server error: ${error}`})
	}
})


// Crear user
userRouter.post('/', async (req, res) => {
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
			if	(newUser.email === 'adminCoder@coder.com' && newUser.password === 'ADMIN4862') {
				newUser.rol = 'admin'
				await newUser.save();
				req.session.user = newUser
				res.redirect('/static/login')	
			} else {
				newUser.rol = 'usuario'
				await newUser.save();
				req.session.user = newUser
				res.redirect('/static/login')
			}
		} else {
			res.status(403).send({message: 'forbidden.'})
		}
	} catch (error) {
		res.status(500).send({message: `Internal server error: ${error}.`})
	}
})

userRouter.delete('/', async (req, res) => {
	const { email } = req.params;
	const updatedUsers = await userModel.findOneAndDelete({email});

	try {
		if(updatedUsers) {
			res.status(200).send({message: 'User deleted successfully'})
		} else {
			res.status(404).send({error: 'User not found'})
		}
	} catch (error) {
		res.status(500).send({error: `Internal server error: ${error}`})
	}
})

export default userRouter;