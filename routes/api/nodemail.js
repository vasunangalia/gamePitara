

// code not in use 
const nodemailer = require("nodemailer");


async function main() {
  
    let transporter = await nodemailer.createTransport({
      service:'gmail',
      auth: {
        user: 'warpathforke@gmail.com', 
        pass: '', //
      },
    });
  
    // send mail with defined transport object
    const mailOptions = {
      from: 'warpathforke@gmail.com', // sender address
      to: "warpathforke@gmail.com", // list of receivers
      subject: "Hello ", // Subject line
      text: "Hello world?", // plain text body
    };
  
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
  
  main().catch(console.error);