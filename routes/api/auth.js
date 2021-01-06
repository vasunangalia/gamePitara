const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
//const auth = require('../../middleware/auth');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

const User = require('../../models/User');




// @route    GET api/auth/verify
// @desc     verify phone details
// @access   Public

router.post('/verify', async (req, res) => {
 const {verification} = req.body;
 
 try {
   let user = await User.findOne({verification})
   if (!user) {
    return res
      .status(400)
      .json({ errors: [{ msg: 'code not match' }] });
  }
  // else {
  //   res.send("sucess");
  // }
  res.send("corret verification code");

  user.verification = 000000
  await user.save();

 // console.log (user.verification)

 } catch (err) {
  console.error(err.message);
  res.status(500).send('Server error');
}



});


// @route    GET api/auth
// @desc     Test route
// @access   Public
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/auth
// @desc     Authenticate user
// @access   Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      if (user.verification == 000000) {
        res.json(user);
      }
      else {
        res
        .status(400)
        .json({ errors: [{ msg: 'code not match' }] });}
      

      res.send("success");

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.post('/reset-password',(req,res)=>{  
      User.findOne({email:req.body.email})
      .then(user=>{
          if(!user){
              return res.status(422).json({error:"User dont exists with that email"})
          }
     //     user.resetToken = token
       //   user.expireToken = Date.now() + 3600000
          user.save().then((result)=>{
              transporter.sendMail({
                  to:user.email,
                  from:"",
                  subject:"password reset",
              })
              res.json({message:"check your email"})
          })

      })
 
})


module.exports = router;