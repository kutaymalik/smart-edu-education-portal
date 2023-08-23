import express from 'express';
import nodemailer from 'nodemailer';

const getAboutPage = (req, res) => {
    res.status(200).render('about', {
        pageName: 'about',
    });
};

const getIndexPage = (req, res) => {
    console.log(req.session.userID);
    res.status(200).render('index', {
        pageName: 'index',
    });
};

const getRegisterPage = (req, res) => {
    res.status(200).render('register', {
        pageName: 'register',
    });
};

const getLoginPage = (req, res) => {
    res.status(200).render('login', {
        pageName: 'login',
    });
};

const getContactPage = (req, res) => {
    res.status(200).render('contact', {
        pageName: 'contact',
    });
};

const sendEmail = async (req, res) => {
    try {
        const outputMessage = `
    
        <h1>Mail Details</h1>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
        </ul>

        <h1>Message</h1>
        <p>${req.body.message}</p>
        `;

        let testAccount = await nodemailer.createTestAccount();

        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: forwarder.email, // gmail account
                pass: forwarder.pass, // gmail password
            },
        });

        let info = await transporter.sendMail({
            from: '"Smart EDU Contact Form" <kutaymalikt@gmail.com> ', // sender address
            to: req.body.email, // list of receivers
            subject: 'Smart EDU Contact Form New Message',
            html: outputMessage,
        });

        console.log('Message sent: %s', info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        req.flash('success', 'We received your message succesfully');

        res.status(200).redirect('contact');
    } catch (err) {
        req.flash('error', `Something happened! ${err}`);
        res.status(200).redirect('contact');
    }
};

export {
    getAboutPage,
    getIndexPage,
    getRegisterPage,
    getLoginPage,
    getContactPage,
    sendEmail,
};
