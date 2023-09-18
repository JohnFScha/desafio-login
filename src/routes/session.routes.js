import { Router } from "express";
import userModel from "../models/user.models.js";

const sessionRouter = Router();

sessionRouter.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        if(req.session.login) {
            return res.status(200).send({info: 'Session already ongoing.'})
        }

        const user = await userModel.find({email: email})

        if(user) {
            if (user.password === password) {
                // login
                req.session.login =true
                res.status(200).send({success: 'login successful.'})
            } else {
                res.status(401).send({error: 'Invalid password.'})
            }
        } else {
            res.status(404).send({error: 'User not found.'})
        }
    } catch (error) {
        res.status(500).send({error: `Internal server error: ${error}.`})
    }
})

sessionRouter.get('/logout', (req, res) => {
    if (req.session.login) {
        req.session.destroy()
    }
    req.status(200).send({info: 'Logged out.'})
}) 

export default sessionRouter;