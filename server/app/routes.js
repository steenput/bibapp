const authController = require('./controllers/authentication');
const bookController = require('./controllers/book');
const imagesController = require('./controllers/images');
const express = require('express');
const passportService = require('../config/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireLogin = passport.authenticate('local', {session: false});

module.exports = function(app) {
    const router = express.Router();
    const authRoutes = express.Router();
    const bookRoutes = express.Router();
    const imagesRoutes = express.Router();

    // Auth Routes
    router.use('/auth', authRoutes);
    authRoutes.post('/register', authController.register);
    // TODO: restrict admin only to create new accounts
    // authRoutes.post('/register', authController.roleAuthorization(['admin']), authController.register);
    authRoutes.post('/login', requireLogin, authController.login);
    authRoutes.get('/protected', requireAuth, function(req, res) {
        res.json({ content: 'Success' });
    });

    // Book Routes
    router.use('/', bookRoutes);
    bookRoutes.get('/book/:id', bookController.getBook);
    bookRoutes.get('/news/:year/:month', bookController.getNews);
    bookRoutes.post('/news', requireAuth, authController.roleAuthorization(['librarian', 'admin']), bookController.setComment);
    // newsRoutes.delete('/:news_id', requireAuth, authController.roleAuthorization(['librarian', 'admin']), newsController.deleteTodo);

    // Images Routes
    router.use('/images', imagesRoutes);
    imagesRoutes.get('/:id', imagesController.getImage);
    imagesRoutes.post('/:id', requireAuth, authController.roleAuthorization(['librarian', 'admin']), 
        imagesController.images.single('image'), imagesController.setImage);

    // Set up routes
    app.use('/', router);
    app.all('*', function(req, res) {
        res.status(404).json({error: '404 Page not found.'});
    });
}
