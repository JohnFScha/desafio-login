import { Router } from "express";
import userModel from "../models/user.models.js";

const sessionRouter = Router({ caseSensitive: false });

sessionRouter.post('/login', async (req, res) => {
    const { email, password } = req.body

    if (req.session.login) {
        res.redirect('/static/products')
    } else {
        try {
            const user = await userModel.findOne({ email: email })

            if (user) {
                if (user.password === password) {
                    // login
                    req.session.login = true
                    res.redirect('/static/products')
                } else {
                    res.status(401).send({ error: 'Invalid password.' })
                }
            } else {
                res.status(404).send({ error: 'User not found.' })
            }
        } catch (error) {
            res.status(500).send({ error: `Internal server error: ${error}.` })
        }
    }
})

sessionRouter.get('/logout', (req, res) => {
    if (req.session.login) {
        req.session.destroy()
    }
    req.status(200).send({ info: 'Logged out.' })
})

export default sessionRouter;