const authCont = require('./controllers/authentication');
const bookCont = require('./controllers/book');
const imagesCont = require('./controllers/images');
const express = require('express');
const passportService = require('../config/passport');
const passport = require('passport');

const reqAuth = passport.authenticate('jwt', {session: false});
const reqLogin = passport.authenticate('local', {session: false});

module.exports = function(app) {
    const router = express.Router();
    const authRoutes = express.Router();
    const bookRoutes = express.Router();
    const newsRoutes = express.Router();
    const favouritesRoutes = express.Router();
    const reviewsRoutes = express.Router();
    const searchRoutes = express.Router();
    const imagesRoutes = express.Router();

    // Auth Routes
    router.use('/auth', authRoutes);
    authRoutes.post('/register', authCont.register);
    // TODO: restrict admin only to create new accounts
    // authRoutes.post('/register', authController.roleAuthorization(['admin']), authController.register);
    authRoutes.post('/login', reqLogin, authCont.login);
    authRoutes.get('/protected', reqAuth, function(req, res) {
        res.json({ content: 'Success' });
    });

    // Book Routes
    router.use('/book', bookRoutes);
    bookRoutes.get('/:id', bookCont.getBook);
    bookRoutes.post('/comment', reqAuth, authCont.roleAuthorization(['librarian', 'admin']), bookCont.setComment);
    bookRoutes.post('/favourite', reqAuth, authCont.roleAuthorization(['librarian', 'admin']), bookCont.setFavourite);
    bookRoutes.post('/review', reqAuth, authCont.roleAuthorization(['librarian', 'admin']), bookCont.setReview);
    // newsRoutes.delete('/:news_id', requireAuth, authController.roleAuthorization(['librarian', 'admin']), newsController.deleteTodo);
    
    // News Routes
    router.use('/news', newsRoutes)
    newsRoutes.get('/:year?/:month?', bookCont.getNews);

    // Favourites Routes
    router.use('/favourites', favouritesRoutes)
    favouritesRoutes.get('/', bookCont.getFavourites);

    // Reviews Routes
    router.use('/reviews', reviewsRoutes)
    reviewsRoutes.get('/', bookCont.getReviews);

    // Search Routes
    router.use('/search', searchRoutes)
    searchRoutes.get('/:str', bookCont.search);

    // Images Routes
    router.use('/images', imagesRoutes);
    imagesRoutes.get('/:id', imagesCont.getImage);
    imagesRoutes.post('/', reqAuth, authCont.roleAuthorization(['librarian', 'admin']), 
        imagesCont.images.single('image'), imagesCont.setImage);

    // Set up routes
    app.use('/', router);
    app.all('*', function(req, res) {
        res.status(404).json({error: '404 Page not found.'});
    });
}
