// server.js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const PAPARA_API_KEY = 'API_KEY_NIZ';
const PAPARA_MERCHANT_ID = 'MERCHANT_ID_NIZ';

// Kullanıcı bakiye bilgilerini saklamak için basit bir "veritabanı"
let users = {};

// Papara ödeme başlatma endpoint'i
app.post('/api/papara/payment', async (req, res) => {
    const { userId, amount } = req.body;
    
    try {
        const response = await axios.post('https://merchantapi.papara.com/payments', {
            amount,
            referenceId: `VP${Date.now()}`,
            notificationUrl: 'https://siteniz.com/papara-webhook',
            redirectUrl: 'https://siteniz.com/payment-complete',
            turkishNationalId: req.body.tcKimlikNo // KYC için
        }, {
            headers: {
                'ApiKey': PAPARA_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        users[userId] = {
            pendingPayment: {
                amount,
                paymentId: response.data.data.paymentId
            }
        };

        res.json({
            success: true,
            paymentUrl: response.data.data.paymentUrl
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.response?.data?.message || 'Ödeme başlatılamadı'
        });
    }
});

// Papara webhook handler
app.post('/papara-webhook', async (req, res) => {
    const { paymentId, referenceId, status, amount } = req.body;
    
    // Ödeme doğrulama
    try {
        const verifyRes = await axios.get(`https://merchantapi.papara.com/payments?id=${paymentId}`, {
            headers: {
                'ApiKey': PAPARA_API_KEY
            }
        });

        if (verifyRes.data.data.status === 1 && verifyRes.data.data.amount === amount) {
            // Ödeme başarılı, VP yükle
            const userId = findUserByPaymentId(paymentId); // Kendi veritabanınızdan bulun
            users[userId].balance += calculateVP(amount);
            users[userId].pendingPayment = null;
            
            // Kullanıcıya bildirim gönder (socket.io veya email)
            notifyUser(userId, `${calculateVP(amount)} VP yüklendi!`);
        }
    } catch (error) {
        console.error('Ödeme doğrulama hatası:', error);
    }

    res.status(200).end();
});

// VP hesaplama (1 TL = 10 VP gibi)
function calculateVP(amount) {
    return amount * 10;
}

app.listen(3000, () => console.log('Server running on port 3000'));


require('dotenv').config();

const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const DiscordStrategy = require('passport-discord').Strategy;
const session = require('express-session');

// Oturum yapılandırması
app.use(session({
    secret: process.env.SESSION_SECRET,
    name: process.env.SESSION_COOKIE_NAME,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: parseInt(process.env.SESSION_COOKIE_AGE),
        secure: process.env.NODE_ENV === 'production'
    }
}));

// Passport başlatma
app.use(passport.initialize());
app.use(passport.session());

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI
},
function(accessToken, refreshToken, profile, done) {
    // Kullanıcıyı veritabanında bul veya oluştur
    return done(null, profile);
}));

// Discord Strategy
passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_REDIRECT_URI,
    scope: process.env.DISCORD_SCOPES.split(' ')
},
function(accessToken, refreshToken, profile, done) {
    // Kullanıcıyı veritabanında bul veya oluştur
    return done(null, profile);
}));

// Serialize/Deserialize User
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Google Auth Route
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        // Başarılı giriş
        res.redirect('/kasaacma/spin.html');
    });

// Discord Auth Route
app.get('/auth/discord',
    passport.authenticate('discord'));

app.get('/auth/discord/callback',
    passport.authenticate('discord', { failureRedirect: '/login' }),
    function(req, res) {
        // Başarılı giriş
        res.redirect('/kasaacma/spin.html');
    });

app.listen(3000, () => console.log('Server running on port 3000'));