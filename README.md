# BibApp Hepia

Web app and native app for school library to add content about books and news. Build with Node.js, MongoDB and Ionic.

# Install
**Note : you have to register to [RIB API](https://dinkum.ethbib.ethz.ch/display/RIB/Home) to run wrapper properly.**

*All of this next commands are tested on a Linux Mint OS.*

First, you need to install [Node.js](https://nodejs.org/en/) (tested with version 8.9.4) and [MongoDB](https://www.mongodb.com/) 
(tested with version 2.6.10). You need to install [Ionic](https://ionicframework.com/) with this command (maybe you will need `sudo`) :

```shell
npm install -g ionic cordova
```

Next, clone this repository and in terminal, move in `ionic` folder and enter :

```shell
ionic build
```

Enter 'Y' when asked to install `node_modules`. This command will generate a `www` folder (in the current ionic folder) that 
contain all files needed to deploy the web app. You need to put this `www` folder in your web server (tested on Apache 2.4.18) 
to serve clients.

You must also add at least an admin user to mongo. To generate a hash of 
your password, you can use `server/app/pass.js` to generate a hashed password to add to your user :

```shell
node pass.js yourPassword
```

Run `mongo bibapp` command and type this (with hashed password) :

```shell
db.users.insert({ email: 'testadmin@mail.com', password: '$2a$10$swh1PhPP6vm2K7g/1KHOTeBCyOncIFgB2doubyPpQHKc8zcddUjV6', role: 'admin' })
```

Finally, in two separate terminals, move in `server` and `wrapper` folders and run this two commands :

```shell
npm install
npm start
```

Server and wrapper will listen on ports 8081 and 8082 respectively. You can use 
[forever](https://www.npmjs.com/package/forever) for more convenience.