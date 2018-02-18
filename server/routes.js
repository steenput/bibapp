const authController = require('./controllers/authentication');
const newsController = require('./controllers/news');
const express = require('express');
const passportService = require('./config/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireLogin = passport.authenticate('local', {session: false});

module.exports = function(app) {
    const router = express.Router();
    const authRoutes = express.Router();
    const newsRoutes = express.Router();

    // Auth Routes
    router.use('/auth', authRoutes);
    authRoutes.post('/register', authController.register);
    // TODO: restrict admin only to create new accounts
    // authRoutes.post('/register', authController.roleAuthorization(['admin']), authController.register);
    authRoutes.post('/login', requireLogin, authController.login);
    authRoutes.get('/protected', requireAuth, function(req, res) {
        res.json({ content: 'Success' });
    });

    // Todo Routes
    router.use('/news', newsRoutes);
    newsRoutes.get('/:year/:month', newsController.getNews);
    newsRoutes.post('/', requireAuth, authController.roleAuthorization(['librarian', 'admin']), newsController.setAbstract);
    // newsRoutes.delete('/:todo_id', requireAuth, authController.roleAuthorization(['librarian', 'admin']), newsController.deleteTodo);

    // Set up routes
    app.use('/', router);
    app.all('*', function(req, res) {
        res.status(404).json({error: '404 Page not found.'});
    });
}
