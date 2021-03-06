var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost:27017/nodeblog');

router.get('/show/:category', function(req, res, next) {
    var posts = db.get('posts');

    posts.find({category:req.params.category},{}, function (err, posts) {
        res.render('index', {
            'title': req.params.category,
            'posts': posts
        });
    });
});

router.get('/add', function(req, res, next) {
    res.render('addcategory', {
        'title': 'Add Category'
    });
});

router.post('/add', function(req, res, next) {
    // Get the form values
    var name = req.body.name;

    // Form validations
    req.checkBody('name', 'Name field is required').notEmpty();

    // Check errors
    var errors = req.validationErrors();
    if (errors) {
        res.render('addcategory',{
            "errors": errors
        });
    } else {
        var categories = db.collection('categories');
        categories.insert({
            "name": name
        }, function (err, post) {
            if (err) {
                res.send(err);
            } else {
                req.flash('success', 'Category Added');
                res.location('/');
                res.redirect('/');
            }
        });
    }
});

module.exports = router;
