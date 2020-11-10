const router = require('express').Router();
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.post('/register', async (req, res) => {

    // const { error } = registerValidation(req.body)
    // if (error) return res.status(400).send(error.details[0].message)

    //Checking if the user is already in the database
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists');

    //Hash Passwords
    const salt = await bcrypt.genSalt(90);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    //create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    try {
        const savedUser = await user.save();
        res.send({ user: user._id });
    } catch (error) {
        res.status(400).send(error);
    }
});

//LOGIN
router.post('/login', async (req, res) => {
    // const { error } = loginValidation(req.body)
    // if (error) return res.status(400).send(error.details[0].message)

    //Checking if the user is already in the database
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email is not found');

    //Password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).send('Invalid password')

    //create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN)
    res.header('tokens', token).send(token);

    res.send("logged in")
})


module.exports = router;