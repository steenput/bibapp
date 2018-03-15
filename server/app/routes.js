const authCont = require('./controllers/authentication');
const bookCont = require('./controllers/books');
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

    /**
     * @api {post} /auth/login Login
     *
     * @apiName Login
     * @apiGroup auth
     * @apiVersion 0.1.0
     *
     * @apiDescription Login and get a JWT
     *
     * @apiHeader {String} Content-Type application/x-www-form-urlencoded
     *
     * @apiParam {String} email Email for login
     * @apiParam {String} password Password for login
     *
     * @apiSuccess {String} token A token, formated like this : "JWT <token>"
     * @apiSuccess {Object} user The user
     * @apiSuccess {String} user._id The id of user in MongoDB
     * @apiSuccess {String} user.email Email of user
     * @apiSuccess {String} user.role The role of user, "admin" or "librarian"
     *
     * @apiError {String} error A message error
     *
     * @apiHeaderExample {header} Header-Example:
     * {
     *   "Content-Type": "application/x-www-form-urlencoded"
     * }
     *
     * @apiParamExample {x-www-form-encoded} Request-Example:
     * {
     *   "email": "test@mail.com",
     *   "password": "1234"
     * }
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *   "token": "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWEwMjM4OGVjNmNkNTMyMWRhNTllYmMiLCJlbWFpbCI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTIwNzgyNDU1LCJleHAiOjE1MjA4MTEyNTV9.ZzjbVLCcCrgcI2M5rxx2urV52kva_yooCgPUIPepMTY",
     *   "user": {
     *     "_id": "5aa02388ec6cd5321da55ebc",
     *     "email": "test@mail.com",
     *     "role": "admin"
     *   }
     * }
     *
     * @apiErrorExample {json} Unauthorized
     * HTTP/1.1 401 Unauthorized
     * {
     *   "error": "Login failed. Please try again."
     * }
     */
    authRoutes.post('/login', reqLogin, authCont.login);

    /**
     * @api {post} /auth/register Register
     *
     * @apiName Register
     * @apiGroup auth
     * @apiVersion 0.1.0
     *
     * @apiDescription Register and get a JWT
     *
     * @apiHeader {String} Content-Type application/json
     * @apiHeader {String} Authorization A JSON Web Token (JWT). Only admin can add users
     *
     * @apiParam {String} email Email of user
     * @apiParam {String} password Password of user
     * @apiParam {String} role Role of user
     *
     * @apiSuccess {String} token A token, formated like this : "JWT <token>"
     * @apiSuccess {Object} user The user
     * @apiSuccess {String} user._id The id of user in MongoDB
     * @apiSuccess {String} user.email Email of user
     * @apiSuccess {String} user.role The role of user, "admin" or "librarian"
     *
     * @apiError {String} error Message of error
     *
     * @apiHeaderExample {header} Header-Example:
     * {
     *   "Content-Type": "application/json",
     *   "Authorization": "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWEwMjM4OGVjNmNkNTMyMWRhNTllYmMiLCJlbWFpbCI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTIwNzgzNDk1LCJleHAiOjE1MjA4MTIyOTV9.L06CDC0esOfn40uyPyE_gI7unkDzkxqe4sBVetijiQA"
     * }
     *
     * @apiParamExample {json} Request-Example:
     * {
     *   "email": "test@mail.com",
     *   "password": "1234",
     *   "role": "admin"
     * }
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 201 OK
     * {
     *   "token": "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWEwMjM4OGVjNmNkNTMyMWRhNTllYmMiLCJlbWFpbCI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTIwNzgyNDU1LCJleHAiOjE1MjA4MTEyNTV9.ZzjbVLCcCrgcI2M5rxx2urV52kva_yooCgPUIPepMTY",
     *   "user": {
     *     "_id": "5aa02388ec6cd5321da55ebc",
     *     "email": "test@mail.com",
     *     "role": "admin"
     *   }
     * }
     *
     * @apiErrorExample {json} No Email
     * HTTP/1.1 422 Unprocessable entity
     * {
     *   "error": "You must enter an email address"
     * }
     *
     * @apiErrorExample {json} No User
     * HTTP/1.1 422 Unprocessable entity
     * {
     *   "error": "No user found."
     * }
     *
     * @apiErrorExample {json} Unauthorized
     * HTTP/1.1 401 Unauthorized
     * {
     *   "error": "You are not authorized to view this content"
     * }
     *
     * @apiErrorExample {json} No Password
     * HTTP/1.1 422 Unprocessable entity
     * {
     *   "error": "You must enter a password"
     * }
     *
     * @apiErrorExample {json} Email already used
     * HTTP/1.1 422 Unprocessable entity
     * {
     *   "error": "That email address is already in use"
     * }
     */
    authRoutes.post('/register', reqAuth, authCont.roleAuthorization(['admin']), authCont.register);

    /**
     * @api {get} /auth/protected Protected
     *
     * @apiName Protected
     * @apiGroup auth
     * @apiVersion 0.1.0
     *
     * @apiDescription An URL to test if a token is valid.
     *
     * @apiHeader {String} Authorization A JSON Web Token (JWT).
     *
     * @apiSuccess {String} content "Success" if success
     *
     * @apiHeaderExample {header} Header-Example:
     * {
     *   "Authorization": "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWEwMjM4OGVjNmNkNTMyMWRhNTllYmMiLCJlbWFpbCI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTIwNzgzNDk1LCJleHAiOjE1MjA4MTIyOTV9.L06CDC0esOfn40uyPyE_gI7unkDzkxqe4sBVetijiQA"
     * }
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 201 OK
     * {
     *   "content": "Success"
     * }
     *
     */
    authRoutes.get('/protected', reqAuth, function(req, res) {
        res.json({ content: 'Success' });
    });

    // Book Routes
    router.use('/book', bookRoutes);

    /**
     * @api {get} /book/:id/ GetBook
     *
     * @apiName GetBook
     * @apiGroup book
     * @apiVersion  0.1.0
     *
     * @apiDescription Get book available at Hepia and Lullier librairies by ISBN or ISSN.
     * Note that all fields returned can be null, empty or undefined.
     *
     * @apiParam {String} id ISBN or ISSN of book
     *
     * @apiSuccess {Boolean}  error True if error, false otherwise
     * @apiSuccess {String}   date Current date (format YYYY-MM-DDThh:mm:ss.msZ)
     * @apiSuccess {Object}   book The book requested
     * @apiSuccess {String}   book.title Document's title
     * @apiSuccess {String}   book.author Document's author
     * @apiSuccess {String}   book.type Document's type
     * @apiSuccess {String}   book.isbn Document's isbn
     * @apiSuccess {String}   book.isbnFull Document's isbn full (from Nebis)
     * @apiSuccess {String}   book.issn Document's issn
     * @apiSuccess {String}   book.issnFull Document's issn full (from Nebis)
     * @apiSuccess {String}   book.creationdate Document's creationdate
     * @apiSuccess {String}   book.publisher Document's publisher
     * @apiSuccess {String}   book.edition Document's edition
     * @apiSuccess {String}   book.description Document's description
     * @apiSuccess {String}   book.language Document's language
     * @apiSuccess {String}   book.format Document's format
     * @apiSuccess {String[]} book.keywords Document's keywords
     * @apiSuccess {String[]} book.availability Document's availability. If fast is undefined.
     * @apiSuccess {String}   book.availability.library At which library the book can be founded (Hepia or Lullier)
     * @apiSuccess {String}   book.availability.callNo The internal library's code
     * @apiSuccess {String}   book.availability.status Status of book (available, etc.)
     * @apiSuccess {String}   book.comment Document's comment
     * @apiSuccess {String}   book.favourite Document's favourite
     * @apiSuccess {String}   book.review Document's review
     *
     * @apiError {Boolean} error True if error, false otherwise
     * @apiError {String} date Current date (format YYYY-MM-DDThh:mm:ss.msZ)
     * @apiError {String} message Message of error
     *
     * @apiParamExample  {json} Request-Example:
     * {
     *   "id": "2-7440-6694-X"
     * }
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *   "error": false,
     *   "date": "2018-03-11T13:35:19.837Z",
     *   "book": {
     *      "title": "Hacker's guide",
     *      "author": "Éric Charton, 1966-",
     *      "type": "book",
     *      "isbn": "2-7440-6694-X",
     *      "isbnFull": "2-7440-6694-X",
     *      "creationdate": "2017",
     *      "publisher": "Montreuil (Seine-Saint-Denis) : Pearson",
     *      "edition": "5e édition",
     *      "description": "La 4e de couverture porte : \"Comprendre les dernières techniques de hacking pour agir et se protéger ! Quelles sont les techniques des hackers pour asservir votre ordinateur, usurper votre identité, pirater vos mots de passe, vos données stockées dans le cloud, ou encore pénétrer dans l'intranet de votre entreprise ? Comment protéger votre smartphone, votre tablette ou votre PC de façon efficace et durable ? Grâce à cet ouvrage, vous découvrirez comment procèdent les hackers et saurez appliquer les contre-mesures appropriées. Cette nouvelle édition vous livre les plus récentes informations sur les dernières techniques des pirates comme sur les outils de sécurité. Elle vous présente les logiciels d'anonymat, les coffres-forts numériques et vous apprend à sécuriser vos données dans le cloud. Vous apprendrez enfin à vous prémunir de la « pollution virale » et des intrusions dans vos réseaux. Grâce au Hacker's Guide, vous allez : Étudier les types de piratage informatique les plus courants (reniflage, défaçage, destruction de contenu, etc.). Comprendre tous les enjeux de l'évolution de l'identité numérique, ses dangers et les solutions pour continuer à se protéger. Prendre la mesure de la vulnérabilité d'iOS et d'Android pour mieux protéger vos tablettes et smartphones. Protéger vos données personnelles sur les réseaux Wifi . Apprendre les techniques de l'ingénierie sociale pour mieux vous en prémunir. Utiliser les outils à même de détecter les chevaux de Troie. Vous prémunir contre le décodage de mots de passe, qu'il s'agisse d'un ordinateur isolé, d'un serveur, d'un micro-réseau familial, ou de PME. Recourir à des logiciels de cryptage de données pour renforcer la sécurité de votre ordinateur.\"",
     *      "language": "fre",
     *      "format": "348 pages : illustrations ; 24 x 17 cm",
     *      "keywords": [
     *        "SÉCURITÉ ET PROTECTION DES DONNÉES (SYSTÈMES D'EXPLOITATION): 004*04*06*06",
     *        "Systèmes informatiques -- Mesures de sûreté -- Guides pratiques et mémentos"
     *      ],
     *      "availability": [
     *        {
     *          "library": "HEPIA (Genève)",
     *          "callNo": "004.49 CHA",
     *          "status": "disponible"
     *        }
     *      ]
     *      "comment": "Super hack",
     *      "favourite": "Coup de coeur pour hacker's guide",
     *      "review": "Revue pour hacker's guide edit"
     *   }
     * }
     *
     * @apiErrorExample {json} Internal error
     * HTTP/1.1 404 Not Found
     * {
     *   "error": true,
     *   "date": "2018-03-11T13:35:19.837Z",
     *   "message": "An error has occured"
     * }
     *
     */
    bookRoutes.get('/:id', bookCont.getBook);

    /**
     * @api {post} /book/comment PostComment
     *
     * @apiName PostComment
     * @apiGroup book
     * @apiVersion 0.1.0
     *
     * @apiDescription Create or update a comment for a book.
     *
     * @apiHeader {String} Content-Type application/x-www-form-urlencoded
     * @apiHeader {String} Authorization A JSON Web Token (JWT).
     *
     * @apiParam {String} id ISBN or ISSN of book
     * @apiParam {String} content New content
     *
     * @apiSuccess {String} _id MongoDB id
     * @apiSuccess {String} id ISBN or ISSN
     * @apiSuccess {String} updatedAt Date
     * @apiSuccess {String} content The content
     * @apiSuccess {String} __v MongoDB version
     * @apiSuccess {String} createdAt Date
     *
     * @apiError {String} error Message of error
     *
     * @apiHeaderExample {header} Header-Example:
     * {
     *   "Content-Type": "application/x-www-form-urlencoded",
     *   "Authorization": "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWEwMjM4OGVjNmNkNTMyMWRhNTllYmMiLCJlbWFpbCI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTIwNzgzNDk1LCJleHAiOjE1MjA4MTIyOTV9.L06CDC0esOfn40uyPyE_gI7unkDzkxqe4sBVetijiQA"
     * }
     *
     * @apiParamExample {json} Request-Example:
     * {
     *   "id": "2-7440-6694-X",
     *   "content": "New content"
     * }
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 201 OK
     * {
     *   "_id": "5a9ef409c7912b8d2a1202c2",
     *   "id": "2-7440-6694-X",
     *   "updatedAt": "2018-03-06T20:03:21.287Z",
     *   "content" : "New content",
     *   "__v": 0,
     *   "createdAt": "2018-03-06T20:03:21.287Z"
     * }
     *
     * @apiErrorExample {json} No User
     * HTTP/1.1 422 Unprocessable entity
     * {
     *   "error": "No user found."
     * }
     *
     * @apiErrorExample {json} Unauthorized
     * HTTP/1.1 401 Unauthorized
     * {
     *   "error": "You are not authorized to view this content"
     * }
     *
     * @apiErrorExample {json} Internal error
     * HTTP/1.1 500 Internal error
     * {
     *   "error": true,
     *   "date": "2018-03-11T13:35:19.837Z",
     *   "message": "An error has occured"
     * }
     */
    bookRoutes.post('/comment', reqAuth, authCont.roleAuthorization(['librarian', 'admin']), bookCont.setComment);

    /**
     * @api {post} /book/favourite PostFavourite
     *
     * @apiName PostFavourite
     * @apiGroup book
     * @apiVersion 0.1.0
     *
     * @apiDescription Create or update a favourite for a book.
     *
     * @apiHeader {String} Content-Type application/x-www-form-urlencoded
     * @apiHeader {String} Authorization A JSON Web Token (JWT).
     *
     * @apiParam {String} id ISBN or ISSN of book
     * @apiParam {String} content New content
     *
     * @apiSuccess {String} _id MongoDB id
     * @apiSuccess {String} id ISBN or ISSN
     * @apiSuccess {String} updatedAt Date
     * @apiSuccess {String} content The content
     * @apiSuccess {String} __v MongoDB version
     * @apiSuccess {String} createdAt Date
     *
     * @apiError {String} error Message of error
     *
     * @apiHeaderExample {header} Header-Example:
     * {
     *   "Content-Type": "application/x-www-form-urlencoded",
     *   "Authorization": "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWEwMjM4OGVjNmNkNTMyMWRhNTllYmMiLCJlbWFpbCI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTIwNzgzNDk1LCJleHAiOjE1MjA4MTIyOTV9.L06CDC0esOfn40uyPyE_gI7unkDzkxqe4sBVetijiQA"
     * }
     *
     * @apiParamExample {json} Request-Example:
     * {
     *   "id": "2-7440-6694-X",
     *   "content": "New content"
     * }
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 201 OK
     * {
     *   "_id": "5a9ef409c7912b8d2a1202c2",
     *   "id": "2-7440-6694-X",
     *   "updatedAt": "2018-03-06T20:03:21.287Z",
     *   "content" : "New content",
     *   "__v": 0,
     *   "createdAt": "2018-03-06T20:03:21.287Z"
     * }
     *
     * @apiErrorExample {json} No User
     * HTTP/1.1 422 Unprocessable entity
     * {
     *   "error": "No user found."
     * }
     *
     * @apiErrorExample {json} Unauthorized
     * HTTP/1.1 401 Unauthorized
     * {
     *   "error": "You are not authorized to view this content"
     * }
     *
     * @apiErrorExample {json} Internal error
     * HTTP/1.1 500 Internal error
     * {
     *   "error": true,
     *   "date": "2018-03-11T13:35:19.837Z",
     *   "message": "An error has occured"
     * }
     */
    bookRoutes.post('/favourite', reqAuth, authCont.roleAuthorization(['librarian', 'admin']), bookCont.setFavourite);

    /**
     * @api {post} /book/review PostReview
     *
     * @apiName PostReview
     * @apiGroup book
     * @apiVersion 0.1.0
     *
     * @apiDescription Create or update a review for a book.
     *
     * @apiHeader {String} Content-Type application/x-www-form-urlencoded
     * @apiHeader {String} Authorization A JSON Web Token (JWT).
     *
     * @apiParam {String} id ISBN or ISSN of book
     * @apiParam {String} content New content
     *
     * @apiSuccess {String} _id MongoDB id
     * @apiSuccess {String} id ISBN or ISSN
     * @apiSuccess {String} updatedAt Date
     * @apiSuccess {String} content The content
     * @apiSuccess {String} __v MongoDB version
     * @apiSuccess {String} createdAt Date
     *
     * @apiError {String} error Message of error
     *
     * @apiHeaderExample {header} Header-Example:
     * {
     *   "Content-Type": "application/x-www-form-urlencoded",
     *   "Authorization": "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWEwMjM4OGVjNmNkNTMyMWRhNTllYmMiLCJlbWFpbCI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTIwNzgzNDk1LCJleHAiOjE1MjA4MTIyOTV9.L06CDC0esOfn40uyPyE_gI7unkDzkxqe4sBVetijiQA"
     * }
     *
     * @apiParamExample {json} Request-Example:
     * {
     *   "id": "2-7440-6694-X",
     *   "content": "New content"
     * }
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 201 OK
     * {
     *   "_id": "5a9ef409c7912b8d2a1202c2",
     *   "id": "2-7440-6694-X",
     *   "updatedAt": "2018-03-06T20:03:21.287Z",
     *   "content" : "New content",
     *   "__v": 0,
     *   "createdAt": "2018-03-06T20:03:21.287Z"
     * }
     *
     * @apiErrorExample {json} No User
     * HTTP/1.1 422 Unprocessable entity
     * {
     *   "error": "No user found."
     * }
     *
     * @apiErrorExample {json} Unauthorized
     * HTTP/1.1 401 Unauthorized
     * {
     *   "error": "You are not authorized to view this content"
     * }
     *
     * @apiErrorExample {json} Internal error
     * HTTP/1.1 500 Internal error
     * {
     *   "error": true,
     *   "date": "2018-03-11T13:35:19.837Z",
     *   "message": "An error has occured"
     * }
     */
    bookRoutes.post('/review', reqAuth, authCont.roleAuthorization(['librarian', 'admin']), bookCont.setReview);

    /**
     * @api {delete} /book/comment/:id DeleteComment
     *
     * @apiName DeleteComment
     * @apiGroup book
     * @apiVersion 0.1.0
     *
     * @apiDescription Delete a comment for a book.
     *
     * @apiHeader {String} Authorization A JSON Web Token (JWT).
     *
     * @apiParam {String} id ISBN or ISSN of book
     *
     * @apiSuccess {String} _id MongoDB id
     * @apiSuccess {String} id ISBN or ISSN
     * @apiSuccess {String} updatedAt Date
     * @apiSuccess {String} content The content
     * @apiSuccess {String} __v MongoDB version
     * @apiSuccess {String} createdAt Date
     *
     * @apiError {String} error Message of error
     *
     * @apiHeaderExample {header} Header-Example:
     * {
     *   "Authorization": "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWEwMjM4OGVjNmNkNTMyMWRhNTllYmMiLCJlbWFpbCI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTIwNzgzNDk1LCJleHAiOjE1MjA4MTIyOTV9.L06CDC0esOfn40uyPyE_gI7unkDzkxqe4sBVetijiQA"
     * }
     *
     * @apiParamExample {json} Request-Example:
     * {
     *   "id": "2-7440-6694-X"
     * }
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 201 OK
     * {
     *   "_id": "5a9ef409c7912b8d2a1202c2",
     *   "id": "2-7440-6694-X",
     *   "updatedAt": "2018-03-06T20:03:21.287Z",
     *   "content" : "Content",
     *   "__v": 0,
     *   "createdAt": "2018-03-06T20:03:21.287Z"
     * }
     *
     * @apiErrorExample {json} No User
     * HTTP/1.1 422 Unprocessable entity
     * {
     *   "error": "No user found."
     * }
     *
     * @apiErrorExample {json} Unauthorized
     * HTTP/1.1 401 Unauthorized
     * {
     *   "error": "You are not authorized to view this content"
     * }
     *
     * @apiErrorExample {json} Internal error
     * HTTP/1.1 500 Internal error
     * {
     *   "error": true,
     *   "date": "2018-03-11T13:35:19.837Z",
     *   "message": "An error has occured"
     * }
     */
    bookRoutes.delete('/comment/:id', reqAuth, authCont.roleAuthorization(['librarian', 'admin']), bookCont.deleteComment);

    /**
     * @api {delete} /book/favourite/:id DeleteFavourite
     *
     * @apiName DeleteFavourite
     * @apiGroup book
     * @apiVersion 0.1.0
     *
     * @apiDescription Delete a favourite for a book.
     *
     * @apiHeader {String} Authorization A JSON Web Token (JWT).
     *
     * @apiParam {String} id ISBN or ISSN of book
     *
     * @apiSuccess {String} _id MongoDB id
     * @apiSuccess {String} id ISBN or ISSN
     * @apiSuccess {String} updatedAt Date
     * @apiSuccess {String} content The content
     * @apiSuccess {String} __v MongoDB version
     * @apiSuccess {String} createdAt Date
     *
     * @apiError {String} error Message of error
     *
     * @apiHeaderExample {header} Header-Example:
     * {
     *   "Authorization": "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWEwMjM4OGVjNmNkNTMyMWRhNTllYmMiLCJlbWFpbCI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTIwNzgzNDk1LCJleHAiOjE1MjA4MTIyOTV9.L06CDC0esOfn40uyPyE_gI7unkDzkxqe4sBVetijiQA"
     * }
     *
     * @apiParamExample {json} Request-Example:
     * {
     *   "id": "2-7440-6694-X"
     * }
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 201 OK
     * {
     *   "_id": "5a9ef409c7912b8d2a1202c2",
     *   "id": "2-7440-6694-X",
     *   "updatedAt": "2018-03-06T20:03:21.287Z",
     *   "content" : "Content",
     *   "__v": 0,
     *   "createdAt": "2018-03-06T20:03:21.287Z"
     * }
     *
     * @apiErrorExample {json} No User
     * HTTP/1.1 422 Unprocessable entity
     * {
     *   "error": "No user found."
     * }
     *
     * @apiErrorExample {json} Unauthorized
     * HTTP/1.1 401 Unauthorized
     * {
     *   "error": "You are not authorized to view this content"
     * }
     *
     * @apiErrorExample {json} Internal error
     * HTTP/1.1 500 Internal error
     * {
     *   "error": true,
     *   "date": "2018-03-11T13:35:19.837Z",
     *   "message": "An error has occured"
     * }
     */
    bookRoutes.delete('/favourite/:id', reqAuth, authCont.roleAuthorization(['librarian', 'admin']), bookCont.deleteFavourite);

    /**
     * @api {delete} /book/review/:id DeleteReview
     *
     * @apiName DeleteReview
     * @apiGroup book
     * @apiVersion 0.1.0
     *
     * @apiDescription Delete a review for a book.
     *
     * @apiHeader {String} Authorization A JSON Web Token (JWT).
     *
     * @apiParam {String} id ISBN or ISSN of book
     *
     * @apiSuccess {String} _id MongoDB id
     * @apiSuccess {String} id ISBN or ISSN
     * @apiSuccess {String} updatedAt Date
     * @apiSuccess {String} content The content
     * @apiSuccess {String} __v MongoDB version
     * @apiSuccess {String} createdAt Date
     *
     * @apiError {String} error Message of error
     *
     * @apiHeaderExample {header} Header-Example:
     * {
     *   "Authorization": "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWEwMjM4OGVjNmNkNTMyMWRhNTllYmMiLCJlbWFpbCI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTIwNzgzNDk1LCJleHAiOjE1MjA4MTIyOTV9.L06CDC0esOfn40uyPyE_gI7unkDzkxqe4sBVetijiQA"
     * }
     *
     * @apiParamExample {json} Request-Example:
     * {
     *   "id": "2-7440-6694-X"
     * }
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 201 OK
     * {
     *   "_id": "5a9ef409c7912b8d2a1202c2",
     *   "id": "2-7440-6694-X",
     *   "updatedAt": "2018-03-06T20:03:21.287Z",
     *   "content" : "Content",
     *   "__v": 0,
     *   "createdAt": "2018-03-06T20:03:21.287Z"
     * }
     *
     * @apiErrorExample {json} No User
     * HTTP/1.1 422 Unprocessable entity
     * {
     *   "error": "No user found."
     * }
     *
     * @apiErrorExample {json} Unauthorized
     * HTTP/1.1 401 Unauthorized
     * {
     *   "error": "You are not authorized to view this content"
     * }
     *
     * @apiErrorExample {json} Internal error
     * HTTP/1.1 500 Internal error
     * {
     *   "error": true,
     *   "date": "2018-03-11T13:35:19.837Z",
     *   "message": "An error has occured"
     * }
     */
    bookRoutes.delete('/review/:id', reqAuth, authCont.roleAuthorization(['librarian', 'admin']), bookCont.deleteReview);

    // News Routes
    router.use('/news', newsRoutes);

    /**
     * @api {get} /news/:year?/:month? GetNews
     *
     * @apiName GetNews
     * @apiGroup news
     * @apiVersion  0.1.0
     *
     * @apiDescription Return new books arrived at Hepia and Lullier librairies for the year and month given.
     * Return by default the news of current month.
     * Note that all fields returned can be null, empty or undefined.
     *
     * @apiParam {String} year Optional. Desidered year. Must be on 4 digits
     * @apiParam {String} month Optional. Desidered month. Must be on 2 digits (like "03" for March)
     *
     * @apiSuccess {Boolean}  error True if error, false otherwise
     * @apiSuccess {String}   date Current date (format YYYY-MM-DDThh:mm:ss.msZ)
     * @apiSuccess {Number}   size Size of array of documents
     * @apiSuccess {Object[]} documents Array of documents
     * @apiSuccess {String}   documents.title Document's title
     * @apiSuccess {String}   documents.author Document's author
     * @apiSuccess {String}   documents.type Document's type
     * @apiSuccess {String}   documents.isbn Document's isbn
     * @apiSuccess {String}   documents.isbnFull Document's isbn full (from Nebis)
     * @apiSuccess {String}   documents.issn Document's issn
     * @apiSuccess {String}   documents.issnFull Document's issn full (from Nebis)
     * @apiSuccess {String}   documents.creationdate Document's creationdate
     * @apiSuccess {String}   documents.publisher Document's publisher
     * @apiSuccess {String}   documents.edition Document's edition
     * @apiSuccess {String}   documents.description Document's description
     * @apiSuccess {String}   documents.language Document's language
     * @apiSuccess {String}   documents.format Document's format
     * @apiSuccess {String[]} documents.keywords Document's keywords
     * @apiSuccess {String[]} documents.availability Document's availability
     * @apiSuccess {String}   documents.id Document's id
     * @apiSuccess {String}   documents.comment Document's comment
     * @apiSuccess {String}   documents.favourite Document's favourite
     * @apiSuccess {String}   documents.review Document's review
     *
     * @apiError {Boolean} error True if error, false otherwise
     * @apiError {String} date Current date (format YYYY-MM-DDThh:mm:ss.msZ)
     * @apiError code Stricode ng} Code of error
     *
     * @apiParamExample  {json} Request-Example:
     * {
     *   "year": "2018",
     *   "month": "03"
     * }
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *   "error": false,
     *   "date": "2018-03-11T13:35:19.837Z",
     *   "size": 41,
     *   "documents": [
     *     {
     *       "title": "Hacker's guide",
     *       "author": "Éric Charton, 1966-",
     *       "type": "book",
     *       "isbn": "2-7440-6694-X",
     *       "isbnFull": "2-7440-6694-X",
     *       "creationdate": "2017",
     *       "publisher": "Montreuil (Seine-Saint-Denis) : Pearson",
     *       "edition": "5e édition",
     *       "description": "La 4e de couverture porte : \"Comprendre les dernières techniques de hacking pour agir et se protéger ! Quelles sont les techniques des hackers pour asservir votre ordinateur, usurper votre identité, pirater vos mots de passe, vos données stockées dans le cloud, ou encore pénétrer dans l'intranet de votre entreprise ? Comment protéger votre smartphone, votre tablette ou votre PC de façon efficace et durable ? Grâce à cet ouvrage, vous découvrirez comment procèdent les hackers et saurez appliquer les contre-mesures appropriées. Cette nouvelle édition vous livre les plus récentes informations sur les dernières techniques des pirates comme sur les outils de sécurité. Elle vous présente les logiciels d'anonymat, les coffres-forts numériques et vous apprend à sécuriser vos données dans le cloud. Vous apprendrez enfin à vous prémunir de la « pollution virale » et des intrusions dans vos réseaux. Grâce au Hacker's Guide, vous allez : Étudier les types de piratage informatique les plus courants (reniflage, défaçage, destruction de contenu, etc.). Comprendre tous les enjeux de l'évolution de l'identité numérique, ses dangers et les solutions pour continuer à se protéger. Prendre la mesure de la vulnérabilité d'iOS et d'Android pour mieux protéger vos tablettes et smartphones. Protéger vos données personnelles sur les réseaux Wifi . Apprendre les techniques de l'ingénierie sociale pour mieux vous en prémunir. Utiliser les outils à même de détecter les chevaux de Troie. Vous prémunir contre le décodage de mots de passe, qu'il s'agisse d'un ordinateur isolé, d'un serveur, d'un micro-réseau familial, ou de PME. Recourir à des logiciels de cryptage de données pour renforcer la sécurité de votre ordinateur.\"",
     *       "language": "fre",
     *       "format": "348 pages : illustrations ; 24 x 17 cm",
     *       "keywords": [
     *         "SÉCURITÉ ET PROTECTION DES DONNÉES (SYSTÈMES D'EXPLOITATION): 004*04*06*06",
     *         "Systèmes informatiques -- Mesures de sûreté -- Guides pratiques et mémentos"
     *       ],
     *       "availability": [],
     *       "id": "2-7440-6694-X",
     *       "comment": "Super hack",
     *       "favourite": "Coup de coeur pour hacker's guide",
     *       "review": "Revue pour hacker's guide edit"
     *     }, ...
     *   ]
     * }
     *
     * @apiErrorExample {json} Internal error
     * HTTP/1.1 404 Not Found
     * {
     *   "error": true,
     *   "date": "2018-03-11T13:35:19.837Z",
     *   "code": "An error has occured"
     * }
     *
     */
    newsRoutes.get('/:year?/:month?', bookCont.getNews);

    // Favourites Routes
    router.use('/favourites', favouritesRoutes);

    /**
     * @api {get} /favourites GetFavourites
     *
     * @apiName GetFavourites
     * @apiGroup favourites
     * @apiVersion  0.1.0
     *
     * @apiDescription Return the favourites books.
     * Note that all fields returned can be null, empty or undefined.
     *
     * @apiSuccess {Boolean}  error True if error, false otherwise
     * @apiSuccess {String}   date Current date (format YYYY-MM-DDThh:mm:ss.msZ)
     * @apiSuccess {Number}   size Size of array of documents
     * @apiSuccess {Object[]} documents Array of documents
     * @apiSuccess {String}   documents.title Document's title
     * @apiSuccess {String}   documents.author Document's author
     * @apiSuccess {String}   documents.type Document's type
     * @apiSuccess {String}   documents.isbn Document's isbn
     * @apiSuccess {String}   documents.isbnFull Document's isbn full (from Nebis)
     * @apiSuccess {String}   documents.issn Document's issn
     * @apiSuccess {String}   documents.issnFull Document's issn full (from Nebis)
     * @apiSuccess {String}   documents.creationdate Document's creationdate
     * @apiSuccess {String}   documents.publisher Document's publisher
     * @apiSuccess {String}   documents.edition Document's edition
     * @apiSuccess {String}   documents.description Document's description
     * @apiSuccess {String}   documents.language Document's language
     * @apiSuccess {String}   documents.format Document's format
     * @apiSuccess {String[]} documents.keywords Document's keywords
     * @apiSuccess {String[]} documents.availability Document's availability
     * @apiSuccess {String}   documents.id Document's id
     * @apiSuccess {String}   documents.comment Document's comment
     * @apiSuccess {String}   documents.favourite Document's favourite
     * @apiSuccess {String}   documents.review Document's review
     *
     * @apiError {Boolean} error True if error, false otherwise
     * @apiError {String} date Current date (format YYYY-MM-DDThh:mm:ss.msZ)
     * @apiError code Stricode ng} Code of error
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *   "error": false,
     *   "date": "2018-03-11T13:35:19.837Z",
     *   "size": 41,
     *   "documents": [
     *     {
     *       "title": "Hacker's guide",
     *       "author": "Éric Charton, 1966-",
     *       "type": "book",
     *       "isbn": "2-7440-6694-X",
     *       "isbnFull": "2-7440-6694-X",
     *       "creationdate": "2017",
     *       "publisher": "Montreuil (Seine-Saint-Denis) : Pearson",
     *       "edition": "5e édition",
     *       "description": "La 4e de couverture porte : \"Comprendre les dernières techniques de hacking pour agir et se protéger ! Quelles sont les techniques des hackers pour asservir votre ordinateur, usurper votre identité, pirater vos mots de passe, vos données stockées dans le cloud, ou encore pénétrer dans l'intranet de votre entreprise ? Comment protéger votre smartphone, votre tablette ou votre PC de façon efficace et durable ? Grâce à cet ouvrage, vous découvrirez comment procèdent les hackers et saurez appliquer les contre-mesures appropriées. Cette nouvelle édition vous livre les plus récentes informations sur les dernières techniques des pirates comme sur les outils de sécurité. Elle vous présente les logiciels d'anonymat, les coffres-forts numériques et vous apprend à sécuriser vos données dans le cloud. Vous apprendrez enfin à vous prémunir de la « pollution virale » et des intrusions dans vos réseaux. Grâce au Hacker's Guide, vous allez : Étudier les types de piratage informatique les plus courants (reniflage, défaçage, destruction de contenu, etc.). Comprendre tous les enjeux de l'évolution de l'identité numérique, ses dangers et les solutions pour continuer à se protéger. Prendre la mesure de la vulnérabilité d'iOS et d'Android pour mieux protéger vos tablettes et smartphones. Protéger vos données personnelles sur les réseaux Wifi . Apprendre les techniques de l'ingénierie sociale pour mieux vous en prémunir. Utiliser les outils à même de détecter les chevaux de Troie. Vous prémunir contre le décodage de mots de passe, qu'il s'agisse d'un ordinateur isolé, d'un serveur, d'un micro-réseau familial, ou de PME. Recourir à des logiciels de cryptage de données pour renforcer la sécurité de votre ordinateur.\"",
     *       "language": "fre",
     *       "format": "348 pages : illustrations ; 24 x 17 cm",
     *       "keywords": [
     *         "SÉCURITÉ ET PROTECTION DES DONNÉES (SYSTÈMES D'EXPLOITATION): 004*04*06*06",
     *         "Systèmes informatiques -- Mesures de sûreté -- Guides pratiques et mémentos"
     *       ],
     *       "availability": [],
     *       "id": "2-7440-6694-X",
     *       "comment": "Super hack",
     *       "favourite": "Coup de coeur pour hacker's guide",
     *       "review": "Revue pour hacker's guide edit"
     *     }, ...
     *   ]
     * }
     *
     * @apiErrorExample {json} Internal error
     * HTTP/1.1 404 Not Found
     * {
     *   "error": true,
     *   "date": "2018-03-11T13:35:19.837Z",
     *   "code": "An error has occured"
     * }
     *
     */
    favouritesRoutes.get('/', bookCont.getFavourites);

    // Reviews Routes
    router.use('/reviews', reviewsRoutes);

    /**
     * @api {get} /reviews GetReviews
     *
     * @apiName GetReviews
     * @apiGroup reviews
     * @apiVersion  0.1.0
     *
     * @apiDescription Return the reviews books.
     * Note that all fields returned can be null, empty or undefined.
     *
     * @apiSuccess {Boolean}  error True if error, false otherwise
     * @apiSuccess {String}   date Current date (format YYYY-MM-DDThh:mm:ss.msZ)
     * @apiSuccess {Number}   size Size of array of documents
     * @apiSuccess {Object[]} documents Array of documents
     * @apiSuccess {String}   documents.title Document's title
     * @apiSuccess {String}   documents.author Document's author
     * @apiSuccess {String}   documents.type Document's type
     * @apiSuccess {String}   documents.isbn Document's isbn
     * @apiSuccess {String}   documents.isbnFull Document's isbn full (from Nebis)
     * @apiSuccess {String}   documents.issn Document's issn
     * @apiSuccess {String}   documents.issnFull Document's issn full (from Nebis)
     * @apiSuccess {String}   documents.creationdate Document's creationdate
     * @apiSuccess {String}   documents.publisher Document's publisher
     * @apiSuccess {String}   documents.edition Document's edition
     * @apiSuccess {String}   documents.description Document's description
     * @apiSuccess {String}   documents.language Document's language
     * @apiSuccess {String}   documents.format Document's format
     * @apiSuccess {String[]} documents.keywords Document's keywords
     * @apiSuccess {String[]} documents.availability Document's availability
     * @apiSuccess {String}   documents.id Document's id
     * @apiSuccess {String}   documents.comment Document's comment
     * @apiSuccess {String}   documents.favourite Document's favourite
     * @apiSuccess {String}   documents.review Document's review
     *
     * @apiError {Boolean} error True if error, false otherwise
     * @apiError {String} date Current date (format YYYY-MM-DDThh:mm:ss.msZ)
     * @apiError code Stricode ng} Code of error
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *   "error": false,
     *   "date": "2018-03-11T13:35:19.837Z",
     *   "size": 41,
     *   "documents": [
     *     {
     *       "title": "Hacker's guide",
     *       "author": "Éric Charton, 1966-",
     *       "type": "book",
     *       "isbn": "2-7440-6694-X",
     *       "isbnFull": "2-7440-6694-X",
     *       "creationdate": "2017",
     *       "publisher": "Montreuil (Seine-Saint-Denis) : Pearson",
     *       "edition": "5e édition",
     *       "description": "La 4e de couverture porte : \"Comprendre les dernières techniques de hacking pour agir et se protéger ! Quelles sont les techniques des hackers pour asservir votre ordinateur, usurper votre identité, pirater vos mots de passe, vos données stockées dans le cloud, ou encore pénétrer dans l'intranet de votre entreprise ? Comment protéger votre smartphone, votre tablette ou votre PC de façon efficace et durable ? Grâce à cet ouvrage, vous découvrirez comment procèdent les hackers et saurez appliquer les contre-mesures appropriées. Cette nouvelle édition vous livre les plus récentes informations sur les dernières techniques des pirates comme sur les outils de sécurité. Elle vous présente les logiciels d'anonymat, les coffres-forts numériques et vous apprend à sécuriser vos données dans le cloud. Vous apprendrez enfin à vous prémunir de la « pollution virale » et des intrusions dans vos réseaux. Grâce au Hacker's Guide, vous allez : Étudier les types de piratage informatique les plus courants (reniflage, défaçage, destruction de contenu, etc.). Comprendre tous les enjeux de l'évolution de l'identité numérique, ses dangers et les solutions pour continuer à se protéger. Prendre la mesure de la vulnérabilité d'iOS et d'Android pour mieux protéger vos tablettes et smartphones. Protéger vos données personnelles sur les réseaux Wifi . Apprendre les techniques de l'ingénierie sociale pour mieux vous en prémunir. Utiliser les outils à même de détecter les chevaux de Troie. Vous prémunir contre le décodage de mots de passe, qu'il s'agisse d'un ordinateur isolé, d'un serveur, d'un micro-réseau familial, ou de PME. Recourir à des logiciels de cryptage de données pour renforcer la sécurité de votre ordinateur.\"",
     *       "language": "fre",
     *       "format": "348 pages : illustrations ; 24 x 17 cm",
     *       "keywords": [
     *         "SÉCURITÉ ET PROTECTION DES DONNÉES (SYSTÈMES D'EXPLOITATION): 004*04*06*06",
     *         "Systèmes informatiques -- Mesures de sûreté -- Guides pratiques et mémentos"
     *       ],
     *       "availability": [],
     *       "id": "2-7440-6694-X",
     *       "comment": "Super hack",
     *       "favourite": "Coup de coeur pour hacker's guide",
     *       "review": "Revue pour hacker's guide edit"
     *     }, ...
     *   ]
     * }
     *
     * @apiErrorExample {json} Internal error
     * HTTP/1.1 404 Not Found
     * {
     *   "error": true,
     *   "date": "2018-03-11T13:35:19.837Z",
     *   "code": "An error has occured"
     * }
     *
     */
    reviewsRoutes.get('/', bookCont.getReviews);

    // Search Routes
    router.use('/search', searchRoutes);

    /**
     * @api {get} /search/:str Search
     *
     * @apiName Search
     * @apiGroup search
     * @apiVersion  0.1.0
     *
     * @apiDescription Return the books that match with search.
     * Note that all fields returned can be null, empty or undefined.
     *
     * @apiParam {String} str The given search
     *
     * @apiSuccess {Boolean}  error True if error, false otherwise
     * @apiSuccess {String}   date Current date (format YYYY-MM-DDThh:mm:ss.msZ)
     * @apiSuccess {Number}   size Size of array of documents
     * @apiSuccess {Object[]} documents Array of documents
     * @apiSuccess {String}   documents.title Document's title
     * @apiSuccess {String}   documents.author Document's author
     * @apiSuccess {String}   documents.type Document's type
     * @apiSuccess {String}   documents.isbn Document's isbn
     * @apiSuccess {String}   documents.isbnFull Document's isbn full (from Nebis)
     * @apiSuccess {String}   documents.issn Document's issn
     * @apiSuccess {String}   documents.issnFull Document's issn full (from Nebis)
     * @apiSuccess {String}   documents.creationdate Document's creationdate
     * @apiSuccess {String}   documents.publisher Document's publisher
     * @apiSuccess {String}   documents.edition Document's edition
     * @apiSuccess {String}   documents.description Document's description
     * @apiSuccess {String}   documents.language Document's language
     * @apiSuccess {String}   documents.format Document's format
     * @apiSuccess {String[]} documents.keywords Document's keywords
     * @apiSuccess {String[]} documents.availability Document's availability
     * @apiSuccess {String}   documents.id Document's id
     * @apiSuccess {String}   documents.comment Document's comment
     * @apiSuccess {String}   documents.favourite Document's favourite
     * @apiSuccess {String}   documents.review Document's review
     *
     * @apiError {Boolean} error True if error, false otherwise
     * @apiError {String} date Current date (format YYYY-MM-DDThh:mm:ss.msZ)
     * @apiError code Stricode ng} Code of error
     *
     * @apiParamExample {json} Request-Example:
     * {
     *   "str": "2-7440-6694-X"
     * }
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *   "error": false,
     *   "date": "2018-03-11T13:35:19.837Z",
     *   "size": 1,
     *   "documents": [
     *     {
     *       "title": "Hacker's guide",
     *       "author": "Éric Charton, 1966-",
     *       "type": "book",
     *       "isbn": "2-7440-6694-X",
     *       "isbnFull": "2-7440-6694-X",
     *       "creationdate": "2017",
     *       "publisher": "Montreuil (Seine-Saint-Denis) : Pearson",
     *       "edition": "5e édition",
     *       "description": "La 4e de couverture porte : \"Comprendre les dernières techniques de hacking pour agir et se protéger ! Quelles sont les techniques des hackers pour asservir votre ordinateur, usurper votre identité, pirater vos mots de passe, vos données stockées dans le cloud, ou encore pénétrer dans l'intranet de votre entreprise ? Comment protéger votre smartphone, votre tablette ou votre PC de façon efficace et durable ? Grâce à cet ouvrage, vous découvrirez comment procèdent les hackers et saurez appliquer les contre-mesures appropriées. Cette nouvelle édition vous livre les plus récentes informations sur les dernières techniques des pirates comme sur les outils de sécurité. Elle vous présente les logiciels d'anonymat, les coffres-forts numériques et vous apprend à sécuriser vos données dans le cloud. Vous apprendrez enfin à vous prémunir de la « pollution virale » et des intrusions dans vos réseaux. Grâce au Hacker's Guide, vous allez : Étudier les types de piratage informatique les plus courants (reniflage, défaçage, destruction de contenu, etc.). Comprendre tous les enjeux de l'évolution de l'identité numérique, ses dangers et les solutions pour continuer à se protéger. Prendre la mesure de la vulnérabilité d'iOS et d'Android pour mieux protéger vos tablettes et smartphones. Protéger vos données personnelles sur les réseaux Wifi . Apprendre les techniques de l'ingénierie sociale pour mieux vous en prémunir. Utiliser les outils à même de détecter les chevaux de Troie. Vous prémunir contre le décodage de mots de passe, qu'il s'agisse d'un ordinateur isolé, d'un serveur, d'un micro-réseau familial, ou de PME. Recourir à des logiciels de cryptage de données pour renforcer la sécurité de votre ordinateur.\"",
     *       "language": "fre",
     *       "format": "348 pages : illustrations ; 24 x 17 cm",
     *       "keywords": [
     *         "SÉCURITÉ ET PROTECTION DES DONNÉES (SYSTÈMES D'EXPLOITATION): 004*04*06*06",
     *         "Systèmes informatiques -- Mesures de sûreté -- Guides pratiques et mémentos"
     *       ],
     *       "availability": [],
     *       "id": "2-7440-6694-X",
     *       "comment": "Super hack",
     *       "favourite": "Coup de coeur pour hacker's guide",
     *       "review": "Revue pour hacker's guide edit"
     *     }
     *   ]
     * }
     *
     * @apiErrorExample {json} Internal error
     * HTTP/1.1 404 Not Found
     * {
     *   "error": true,
     *   "date": "2018-03-11T13:35:19.837Z",
     *   "code": "An error has occured"
     * }
     *
     */
    searchRoutes.get('/:str', bookCont.search);
    
    // Images Routes
    router.use('/images', imagesRoutes);
    imagesRoutes.get('/add', imagesCont.addImage);

    /**
     * @api {get} /images/:id GetImage
     *
     * @apiName GetImage
     * @apiGroup images
     * @apiVersion  0.1.0
     *
     * @apiDescription Get image by ISBN or ISSN.
     * Note that all fields returned can be null, empty or undefined.
     *
     * @apiParam {String} id ISBN or ISSN of book
     *
     * @apiSuccess {File} file The image
     *
     * @apiParamExample  {json} Request-Example:
     * {
     *   "id": "2-7440-6694-X"
     * }
     *
     * @apiSuccessExample {File} Success-Response:
     * HTTP/1.1 200 OK
     *
     */
    imagesRoutes.get('/:id', imagesCont.getImage);

    /**
     * @api {post} /images PostImage
     *
     * @apiName PostImage
     * @apiGroup images
     * @apiVersion 0.1.0
     *
     * @apiDescription Create or update an image for a book.
     *
     * @apiHeader {String} Authorization A JSON Web Token (JWT).
     *
     * @apiParam {File}   image New image
     * @apiParam {String} id ISBN or ISSN of book
     *
     * @apiSuccess {String} message A message
     *
     * @apiError {String} error Message of error
     *
     * @apiHeaderExample {header} Header-Example:
     * {
     *   "Authorization": "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWEwMjM4OGVjNmNkNTMyMWRhNTllYmMiLCJlbWFpbCI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTIwNzgzNDk1LCJleHAiOjE1MjA4MTIyOTV9.L06CDC0esOfn40uyPyE_gI7unkDzkxqe4sBVetijiQA"
     * }
     *
     * @apiParamExample {form} Request-Example:
     * {
     *   "image": File
     *   "id": "2-7440-6694-X",
     * }
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *   "message": "Image uploaded"
     * }
     *
     * @apiErrorExample {json} No User
     * HTTP/1.1 422 Unprocessable entity
     * {
     *   "error": "No user found."
     * }
     *
     * @apiErrorExample {json} Unauthorized
     * HTTP/1.1 401 Unauthorized
     * {
     *   "error": "You are not authorized to view this content"
     * }
     *
     * @apiErrorExample {json} Internal error
     * HTTP/1.1 500 Internal error
     * {
     *   "error": true,
     *   "date": "2018-03-11T13:35:19.837Z",
     *   "message": "An error has occured"
     * }
     */
    imagesRoutes.post('/', reqAuth, authCont.roleAuthorization(['librarian', 'admin']),
        imagesCont.images.single('image'), imagesCont.setImage);

    /**
     * @api {delete} /images/:id DeleteImage
     *
     * @apiName DeleteImage
     * @apiGroup images
     * @apiVersion 0.1.0
     *
     * @apiDescription Delete an image for a book.
     *
     * @apiHeader {String} Authorization A JSON Web Token (JWT).
     *
     * @apiParam {String} id ISBN or ISSN of book
     *
     * @apiSuccess {String} message A message
     *
     * @apiError {String} error Message of error
     *
     * @apiHeaderExample {header} Header-Example:
     * {
     *   "Authorization": "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWEwMjM4OGVjNmNkNTMyMWRhNTllYmMiLCJlbWFpbCI6ImFkbWluQG1haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTIwNzgzNDk1LCJleHAiOjE1MjA4MTIyOTV9.L06CDC0esOfn40uyPyE_gI7unkDzkxqe4sBVetijiQA"
     * }
     *
     * @apiParamExample {json} Request-Example:
     * {
     *   "id": "2-7440-6694-X"
     * }
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *   "message": "Image deleted"
     * }
     *
     * @apiErrorExample {json} No User
     * HTTP/1.1 422 Unprocessable entity
     * {
     *   "error": "No user found."
     * }
     *
     * @apiErrorExample {json} Unauthorized
     * HTTP/1.1 401 Unauthorized
     * {
     *   "error": "You are not authorized to view this content"
     * }
     *
     * @apiErrorExample {json} Internal error
     * HTTP/1.1 500 Internal error
     * {
     *   "error": true,
     *   "date": "2018-03-11T13:35:19.837Z",
     *   "message": "An error has occured"
     * }
     */
    imagesRoutes.delete('/:id', reqAuth, authCont.roleAuthorization(['librarian', 'admin']), imagesCont.deleteImage);

    // Set up routes
    app.use('/', router);
    app.all('*', function(req, res) {
        res.status(404).json({error: '404 Page not found.'});
    });
}
