const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const shortid = require('shortid');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)
// Set some defaults (required if your JSON file is empty)
db.defaults({ users: []})
  .write()
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', (req, res) => res.render('index', {
    name: 'dev'
}));
app.get('/users', (req, res) => res.render('users/index', {
    users: db.get('users').value()
}));

app.get('/users/search', (req, res) => {
    const  q = req.query.q;
    const matchUser = db.get('users').value().filter(user =>  user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1)
    res.render('users/index', {
        users: matchUser
    })
});
app.get('/users/create', (req, res) => {
    res.render('users/create');
})
app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    console.log(typeof id);
    const user = db.get('users').find({id: id}).value();
    console.log(user);
    res.render('users/view', {
        user: user
    })
});
app.post('/users/create', (req, res) => {
    req.body.id = shortid.generate();
  db.get('users').push(req.body).write();
    res.redirect('/users');
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`));