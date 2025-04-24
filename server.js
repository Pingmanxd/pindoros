require('dotenv').config({ path: '/var/www/Pingmanxd.env' });
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const DiscordStrategy = require('passport-discord').Strategy;
const session = require('express-session');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();

// MongoDB Bağlantısı
mongoose.connect('mongodb://localhost:27017/valorantdb')
    .then(() => console.log('MongoDB bağlantısı başarılı'))
    .catch(err => console.error('MongoDB bağlantı hatası:', err));

// User Model
const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}));

// Middleware'ler
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://your-frontend-url'],
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 86400000 }
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport Serialization
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI,
    passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
    profile.isRegister = req.query.state === 'register';
    done(null, profile);
}));

// Discord Strategy
passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_REDIRECT_URI,
    scope: ['identify', 'email'],
    passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
    profile.isRegister = req.query.state === 'register';
    done(null, profile);
}));

// API Routes
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'Kullanıcı kaydedildi' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;  // Artık "usernameOrEmail" alıyoruz

        // Kullanıcıyı email VEYA username ile ara (case-insensitive)
        const user = await User.findOne({
            $or: [
                { email: { $regex: new RegExp(`^${usernameOrEmail}$`, 'i') } },
                { username: { $regex: new RegExp(`^${usernameOrEmail}$`, 'i') } }
            ]
        });

        if (!user) {
            return res.status(400).json({ error: 'Kullanıcı adı/email veya şifre hatalı' });
        }

        // Şifre kontrolü
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Kullanıcı adı/email veya şifre hatalı' });
        }

        // Oturum aç
        req.login(user, (err) => {
            if (err) return res.status(500).json({ error: 'Oturum açma hatası' });
            return res.json({ message: 'Giriş başarılı', user });
        });

    } catch (error) {
        res.status(500).json({ error: 'Sunucu hatası: ' + error.message });
    }
});
// OAuth Routes
app.get('/api/auth/google', (req, res) => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${process.env.GOOGLE_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(process.env.GOOGLE_REDIRECT_URI)}` +
        `&response_type=code` +
        `&scope=profile%20email` +
        `&state=${req.query.register === 'true' ? 'register' : 'login'}`;
    res.json({ url: authUrl });
});

app.get('/api/auth/discord', (req, res) => {
    const authUrl = `https://discord.com/api/oauth2/authorize?` +
        `client_id=${process.env.DISCORD_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(process.env.DISCORD_REDIRECT_URI)}` +
        `&response_type=code` +
        `&scope=identify%20email` +
        `&state=${req.query.register === 'true' ? 'register' : 'login'}`;
    res.json({ url: authUrl });
});

// Callbacks
app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/?auth=google_failed',
    successRedirect: 'http://localhost:5500/kasaacma/spin.html'
}));

app.get('/auth/discord/callback',
    passport.authenticate('discord', {
      failureRedirect: '/?auth=discord_failed',
      successRedirect: 'http://localhost:5500/kasaacma/spin.html' // Tam yol belirtin
    })
  );

// Sunucuyu Başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sunucu http://localhost:${PORT} üzerinde çalışıyor`));
console.log("Uygulama başladı!");