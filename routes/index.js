var express = require('express');
var router = express.Router();
var Admin = require('../models/admin');
var Institution = require('../models/institution');
var Event = require('../models/event');


/* GET users listing. */
router.get('/admin', function(req, res, next) {
    Admin.find().exec(function(err, result) {
        res.send(result);
    })
});

router.get('/institution', function(req, res, next) {
    Admin.findOne().exec(function(err, result) {
        res.send(result);
    })
});

router.post('/admin', function(req, res, next) {
    var obj = {
        email: 'em@gmail.com',
        name: 'Chack Norris',
        dateOfBirthday: '25/11/1970'
    };
    var admin = new Admin(obj);
    admin.save(function(err) {
        if (err) return next(err);
        res.send('saved')
    })
});

router.post('/institution', function(req, res, next) {
    var obj = {
        name: 'Kumpel',
        address: {
            street: 'Chornovola',
            number: 22,
            city: 'Lviv'
        },
        type: 'restaurant',
        admin: '571682326b47fe2a2cbd3903'
    };
    var venue = new Institution(obj);
    venue.save(function(err, result) {
        if (err) return next(err);
        Admin.findOne('571682326b47fe2a2cbd3903').exec(function(err, existingAdmin) {
            existingAdmin.manages.push(result._id);
            existingAdmin.save(function(err, updatedAdmin) {
                res.send({ venue: result, Admin: updatedAdmin })
            })
        })
    })
});
router.get('/event', function(req, res, next) {
    Event.find().exec(function(err, result) {
        res.send(result);
    })
});

router.post('/event', function(req, res, next) {
    var obj = {
        name: 'Disco in da house',
        price: '50uah',
        sex: 'mix',
        type: 'dance'
    };
    var event = new Event(obj);
    event.save(function(err, result) {
        if (err) return next(err);
        res.send(result)
    })
});

router.post('/createall', function(req, res, next) {
    var obj = {
        email: 'em@gmail.com',
        name: 'Viktor Kis',
        dateOfBirthday: '05/11/1993'
    };
    var admin = new Admin(obj);
    admin.save(function(err, adminResult) {
        if (err) return next(err);
        var obj = {
            name: 'Hubble Babble',
            address: {
                street: 'Valova',
                number: 19,
                city: 'Lviv'
            },
            type: 'hookah',
            admin: adminResult._id
        };
        var venue = new Institution(obj);
        venue.save(function(err, venueResult) {
            if (err) return next(err);
            var obj = {
                name: 'Dirty Apple',
                price: 'free',
                sex: 'mix',
                type: 'chillout',
                institution: venueResult._id
            };
            var event = new Event(obj);
            event.save(function(err, eventResult) {
                if (err) return next(err);
                Admin.findOne(venueResult.admin).exec(function(err, existingAdmin) {
                    existingAdmin.manages.push(venueResult._id)
                    existingAdmin.save(function(err) {
                        res.send({ adminResult: adminResult, venueResult: venueResult, eventResult: eventResult })
                    })
                })
            })
        })
    })
});

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/all', function(req, res, next) {
    Admin.find().populate('manages').exec(function(err,admins){
        Institution.find().populate('admin').exec(function(err,institutions){
            Event.find().populate('institution').exec(function(err,events){
                res.send({admins:admins,institutions:institutions,events:events})
            })
        })
    })
});

router.post('/institution/wh/:id', function (req, res) {
    Institution.findOne({ _id:req.params.id }).exec(function (err, Institution) {
        if(err) res.send('There is no institution with this id');

        Institution.working_hours.push({
            day: 'Friday',
            open_time: '18:00',
            close_time: '00:00'
        });
        Institution.save(function (err) {
            if(err) {res.send('Can`t save changes to db')}
            res.send('Working hours added successfully');
        })
    })
});

router.put('/event/beginning', function (req, res) {
    req.query.start = req.query.start || '18:00';
    Event.findOne({ name: req.query.name }).exec(function (err, event) {
       if(err) res.send('There is no event with this name');
        event.start_time = req.query.start;
        event.save(function (err) {
            if(err) res.send('Can`t save changes to db');
            res.send('Start time was successfully added');
        });
    });
});

router.get('/allevents', function (req, res) {
    Event.find({},{name: 1, start_time: 1, _id:0 }).exec(function (err, events) {
       if(err) res.send('There is no event`s');
        res.send(events);
    });
});

module.exports = router;
