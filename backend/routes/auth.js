const express = require('express');
const bcypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fetchuser =require('../Middleware/fetchuser')
const { body, validationResult } = require('express-validator');
const router = express.Router();


let JWT_TOKEN = "poorvnagar"
//Route 1: create a user using :POST "api/auth/createUser" . No login required 
router.post('/createUser', [
    body('name', 'Enter valid name').isLength({ min: 3 }),
    body('email', 'Enter valid emial').isEmail(),
    body('password', 'Enter valid password').isLength({ min: 5 }),
], async (req, res) => {
    let success=false;
    // if there is an error it returns bad request and the errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    //check the user exist or not with same email
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success,error: 'email already exists' })
        }

        let salt = await bcypt.genSalt(10)
        let secretPassword = await bcypt.hash(req.body.password, salt)
        user = await User.create({
            name: req.body.name,
            password: secretPassword,
            email: req.body.email,
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_TOKEN)
        // res.json(user) 
        success=true;
        res.json({ success,authToken })

    } catch (err) {
        // console.log(err.message);
        res.status(500).send('Internal Error Occured')
    }
})


//Route 2: Authenticate a user using : POST "api/auth/login"  

router.post('/login', [
    body('email', 'Enter valid emial').isEmail(),
    body('password', 'Password can not be blank').exists(),
], async (req, res) => {
    let success=false;
    // if there is an error it returns bad request and the errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        
        if (!user) {
            success=false;
            return res.status(400).json({ error: "Please try to login with correct credentials" })
        }

        const passwordComapare = await bcypt.compare(password, user.password)
        if (!passwordComapare) {
            success=false;
            return res.status(400).json({ success,error: "Please try to login with correct credentials" })
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_TOKEN)
        // res.json(user)
        success=true; 
        res.json({ success,authToken })

    } catch (err) {
        // console.log(err.message);
        res.status(500).send('Internal Error Occured')
    }
})


// Route 3: Get logged in users details using:Post "api/auth/getUser"
router.post('/getUser', fetchuser ,async (req, res) => {
    try {
        let UserId=req.user.id;
        const user=await User.findById(UserId).select("-password")
        res.send(user)
    } catch (err) {
        // console.log(err.message);
        res.status(500).send('Internal Error Occured')
    }
})

module.exports = router