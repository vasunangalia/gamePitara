const express = require("express");
const axios = require('axios').default;
const router = express.Router();
const bcrypt = require('bcrypt');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

const User = require('../../models/User');

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
      check('number','Number is required')
      .isLength({ min: 10 }),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, number, email, password  } = req.body;
    try {
      let user = await User.findOne({ number });
      if (user && user.verification == 0) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      if (user && user.verification !=0 ) {
        await user.remove();
        console.log("deleted")
      }

      let verification = await Math.floor ( Math.random() * (999999-100000) + 100000 );

      await axios({
        method:'POST',
        url:'http://priority.muzztech.in/sms_api/sendsms.php?',
        params: {
          username:"justshope",
          password:"muzztech",
          mobile:number,
          sendername:"JSHOPE",
          message:`Congratulations on joining Game Pitara. Your OTP for registration is  ${verification} `
        }
      })

      user = new User({
        name,
        number,
        email,
        password,
        verification
      });


     const salt = await bcrypt.genSalt(10);

     user.password = await bcrypt.hash(password, salt);

     await user.save();
      
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }

    res.send("user route");
  }
);

module.exports = router;