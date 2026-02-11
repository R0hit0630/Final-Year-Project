import express from 'express';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import { protect } from '../middleware/auth.js';
const router = express.Router();


//register
router.post ('/register', async(req, res)=>{
    const{username, email, password} = req.body;
    try{
        if(!username|| !email || !nationality|| !password) {
            return res.status(400).json({message: "please fill all the field"})
        }

        const userExist = await User.findOne({email});
        if (userExist){
            return res
            .status(400)
            .json({message:"user already exist"})

        
        }

        const user = await User.create({username,email,nationality,password});
        const token = generateToken(user._id);
        res.status(201).json({
            id: user._id,
            username: user.username,
            email: user.email,
            token,
        })


    } catch (err){
        console.error("REGISTER ERROR:", err);
        res.status(500).json({message:"server error"});

    }
});

//lognin

router.post('/login', async(req,res) => {
    const {username, email, password} = req.body;
    try{
        if(!username|| !email || !password) {
            return res.status(400).json({message: "please fill all the field"})
        }

        const user = await User.findOne({email});

        if(!user || !(await user.matchPassword(password))){
            return res.status(401).json({message: "invalid credentials"});
        }

        const token = generateToken(user._id);
        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            token,
        })

    } catch(err){
        res.status(500).json({message:"server error"});
    }
})

//me
router.get("/me",protect, async (req, res)=>{
    res.status(200).json(req.user);
});

//Generate JWT
const generateToken =(id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn: "30d"})
}

export default router;