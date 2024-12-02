const express = require('express');
const router = express.Router();
const User = require('../models/User');
const sendToken = require('../utils/jwt');

router.post('/', async (req, res) => {
    const { username , password } = req.body;
    if(!username || !password){
        return res.status(400).json({message : "Please enter valid user name or password!"});
    }

    //finding the user from DB
    const user = await User.findOne({username}).select('+password');
    if(!user){
        return res.status(401).json({ message : "Invalid email or password!"});
    }

    if(!await user.isValidPassword(password)){
        return res.status(401).json({ message : "Invalid email or password!"});
    }

    sendToken(user,201,res);
})

router.get('/logout' ,async(req,res)=> {
    res.cookie('token',null,{
        expires : new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({message : "Logged Out!"})
})

module.exports = router;