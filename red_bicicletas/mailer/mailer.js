const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

let mailConfig;

if(process.env.NODE_ENV === 'production') {
    const options = {
        auth: {
            api_key: process.env.SENDGRID_API_SECRET
        }
    }
    mailConfig = sgTransport(options);
} else {
    if (process.env.NODE_ENV === 'staging') {
        console.log('XXXXXXXXXXXXXXXXXXXXXX');
        const options = {
            auth: {
                api_key: process.env.SENDGRID_API_SECRET
            }
        }
        mailConfig = sgTransport(options);
    } else {
        // all emails are catched by ethereal.email
        mailConfig = {
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.ethereal_user,
                pass: process.env.ethereal_pwd
            }
        }
    }
}


module.exports = nodemailer.createTransport(mailConfig);