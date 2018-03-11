const axios = require('axios');
const fs = require('fs');
const Log = require('log');
// const log = new Log('debug', fs.createWriteStream('wrapper.log'));
const log = new Log('debug');
const cors = require('cors');
const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(cors());

const baseUrlNebis = 'http://www.library.ethz.ch/rib/v1/primo/documents';
const hepiaCode = 'E41';
const lullierCode = 'E67';
const bulksize = '500'; // maximum authorized by API

function getByCode(code, year, month) {
    return axios.get(baseUrlNebis, {
        params: {
            q: code + year + month,
            // aleph_items: true, // no need of availability to construct the list
            lang: 'fr',
            bulksize: bulksize,
        }
    });
}

function extractIsxn(isxn) {
    if (isxn === undefined) return;
    if (isxn !== null) {
        return isxn.split(' ')[0];
    }
}

function computeDocuments(documents, result) {
    if (result.hits.totalhits != 0) {
        result.document.forEach(d => {
            let availability = [];
            if (d.availability.itemList) {
                d.availability.itemList.forEach(i => {
                    if (i['z30-sub-library-code'] === hepiaCode || i['z30-sub-library-code'] === lullierCode) {
                        let a = {
                            library: i['z30-sub-library'],
                            callNo: i['z30-call-no'],
                            status: i.status === null ? 'disponible' : i.status
                        }
                        availability.push(a);
                    }
                });
            }
            let bib = d.biblioData;
            let doc = {
                title: bib.title,
                author: bib.creator,
                type: bib.type,
                isbn: bib.identifier !== null ? extractIsxn(bib.identifier.ISBN) : undefined,
                issn: bib.identifier !== null ? extractIsxn(bib.identifier.ISSN) : undefined,
                isbnFull: bib.identifier !== null ? bib.identifier.ISBN : undefined,
                issnFull: bib.identifier !== null ? bib.identifier.ISSN : undefined,
                creationdate: bib.creationdate,
                publisher: bib.publisher,
                edition: bib.edition,
                description: bib.description,
                language: bib.language,
                format: bib.format,
                keywords: bib.keywords,
                availability: availability
            };
            documents.push(doc);
        });
    }
    return documents;
}

/**
 * @api {get} /news/:year/:month GetNews
 *
 * @apiName GetNews
 * @apiGroup news
 * @apiVersion  0.1.0
 *
 * @apiDescription Return new books arrived at Hepia and Lullier librairies for the year and month given.
 * Note that all fields returned can be null, empty or undefined.
 *
 * @apiParam {String} year Desidered year. Must be on 4 digits
 * @apiParam {String} month Desidered month. Must be on 2 digits (like "03" for March)
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
 *       "availability": []
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
app.get('/news/:year/:month', function(req, res) {
    const year = req.params.year;
    const month = req.params.month;

    axios.all([getByCode(hepiaCode, year, month), getByCode(lullierCode, year, month)])
    .then(axios.spread((hepia, lullier) => {
        log.debug(hepia.data.result.search, hepia.data.result.hits);
        log.debug(lullier.data.result.search, lullier.data.result.hits);

        let documents = [];
        documents = computeDocuments(documents, hepia.data.result);
        documents = computeDocuments(documents, lullier.data.result);

        res.status(200).json({
            error: false,
            date: new Date(),
            size: documents.length,
            documents: documents
        });
    }))
    .catch(error => {
        log.error(error);
        res.status(404).json({
            error: true,
            date: new Date(),
            code: error.code
        });
    });
});

/**
 * @api {get} /search/:by/:keywords/:fast? SearchBook
 *
 * @apiName SearchBook
 * @apiGroup books
 * @apiVersion  0.1.0
 *
 * @apiDescription Search books available at Hepia and Lullier librairies for criteria given.
 * Note that all fields returned can be null, empty or undefined.
 *
 * @apiParam {String} by Criteria of search. Can be "all", "title", "creator", "isbn", "issn" or "cdate"
 * @apiParam {String} keywords The search her-self
 * @apiParam {String} fast Optional parameter. If equal to "fast", send infos whitout availability.
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
 * @apiSuccess {String[]} documents.availability Document's availability. If fast is undefined.
 * @apiSuccess {String}   documents.availability.library At which library the book can be founded (Hepia or Lullier)
 * @apiSuccess {String}   documents.availability.callNo The internal library's code
 * @apiSuccess {String}   documents.availability.status Status of book (available, etc.)
 *
 * @apiError {Boolean} error True if error, false otherwise
 * @apiError {String} date Current date (format YYYY-MM-DDThh:mm:ss.msZ)
 * @apiError {String} code Code of error
 *
 * @apiParamExample  {json} Request-Example:
 * {
 *   "by": "isbn",
 *   "keywords": "2-7440-6694-X"
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
 *       "availability": [
 *         {
 *           "library": "HEPIA (Genève)",
 *           "callNo": "004.49 CHA",
 *           "status": "disponible"
 *         }
 *       ]
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
app.get('/search/:by/:keywords/:fast?', function(req, res) {
    const by = req.params.by;
    const keywords = req.params.keywords;
    const fast = req.params.fast === undefined;

    axios.get(baseUrlNebis, {
        params: {
            q: keywords,
            searchfield: by,
            aleph_items: fast,
            lang: 'fr',
            bulksize: 100,
        }
    })
    .then(search => {
        log.debug(search.data);

        let documents = [];
        documents = computeDocuments(documents, search.data.result);

        res.status(200).json({
            error: false,
            date: new Date(),
            size: documents.length,
            documents: documents
        });
    })
    .catch(error => {
        log.error(error);
        res.status(404).json({
            error: true,
            date: new Date(),
            code: error.code
        });
    });
});

/**
 * @api {get} /book/:id/:fast? GetBook
 *
 * @apiName GetBook
 * @apiGroup books
 * @apiVersion  0.1.0
 *
 * @apiDescription Get book available at Hepia and Lullier librairies by ISBN or ISSN.
 * Note that all fields returned can be null, empty or undefined.
 *
 * @apiParam {String} id ISBN or ISSN of book
 * @apiParam {String} fast Optional parameter. If equal to "fast", send infos whitout availability.
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
 *
 * @apiError {Boolean} error True if error, false otherwise
 * @apiError {String} date Current date (format YYYY-MM-DDThh:mm:ss.msZ)
 * @apiError {String} code Code of error
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
 *   }
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
app.get('/book/:id/:fast?', function(req, res) {
    const id = req.params.id;
    const searchUrl = 'http://localhost:8081/search/';
    const fast = req.params.fast ? '/fast' : '';

    axios.all([axios.get(searchUrl + 'isbn/' + id + fast), axios.get(searchUrl + 'issn/' + id + fast)])
    .then(results => {
        let book = {};
        results.forEach(r => {
            if (r.data.size > 0) {
                book = r.data.documents[0];
            }
        });
        res.status(200).json({
            error: false,
            date: new Date(),
            book: book
        });
    })
    .catch(error => {
        log.error(error);
        res.status(404).json({
            error: true,
            date: new Date(),
            code: error.code
        });
    });
});

app.all('*', function(req, res) {
    log.error('Requested:', req.url, req.params);
	res.status(404).json({
        error: true,
        date: new Date(),
        code: '404 Page not found.'
    });
});

app.listen(8081);
console.log('wrapper listen on port 8081');
