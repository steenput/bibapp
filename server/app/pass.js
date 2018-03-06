const bcrypt = require('bcrypt-nodejs');

const SALT_FACTOR = 42;

function gen(str) {
    return bcrypt.hashSync(str, bcrypt.genSaltSync(SALT_FACTOR));
}

function compare(attempt, hash) {
    return bcrypt.compareSync(attempt, hash);
}

function test() {
    let hash = gen('hello');
    let test1 = compare('hello', hash);
    let test2 = compare('bob', hash);
    console.log(hash, test1, test2);
}

module.exports = {
    gen,
    compare,
    test
}

process.argv.slice(2).forEach(function (arg) {
    console.log(gen(arg));
});
