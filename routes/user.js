var express = require("express"), router = express.Router();
var    bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
var db = require("../database/db");

process.env.SECRET_KEY = 'secret';

//resgister new user


    router.post("/register", (req, res) => {
        // find is user exist or not
        db.user.findOne({
            where: {email: req.body.email}
        })
        // if not exists so  then do that
            .then(user => {
                if (!user) {
                    // make hash of password in bcrypt, salt 10
                    password = bcrypt.hashSync(req.body.password, 10);
                    db.user.create({
                        email: req.body.email,
                        password: password
                    })
                        .then(user => {
                            let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                                expiresIn: 1440
                            });
                            res.status(200).json({token: token})
                        })
                        .catch(err => {
                            res.status(400).send("error" + err)
                        })
                }
                // show error message user exists
                else {
                    res.json({
                        error: "user alredy exists"
                    })
                }
            })
    });

    router.get("/profile/:id", (req, res) => {
        db.user.findOne({
            where: {id: req.params.id}
        })
            .then(user => {
                if (user) {
                    res.send(user);
                } else {
                    res.send({error: 'error'})
                }
            }).catch(err => {
            res.send(err);
        })

    });

    router.put("/update/:id", (req, res) => {
        console.log(req.body)
        db.user.findOne({
            where: {id: req.params.id}
        })
            .then(user => {
                user.update(req.body)
                    .then(useritem => {
                        db.user.findOne({
                            where: {id: req.params.id}
                        }).then(user => {
                            let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                                expiresIn: 1440
                            });
                            res.send({token: token})
                        }).catch(err => {
                            res.json(err)
                        });
                    })
                    .catch(err => {
                        res.json(err)
                    })
            })
            .catch(err => {
                res.status(400).json(err);
            })
    });

// login



    router.post("/login", (req, res) => {
        console.log(req.body);
        db.user.findOne({
            where: {email: req.body.email}
        })
            .then(user => {
                if (user) {
                    console.log(bcrypt.compareSync(req.body.password, user.password));
                    if (bcrypt.compareSync(req.body.password, user.password)) {
                        let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                            expiresIn: 1440
                        });
                        res.status(200).json({token: token})
                    } else {
                        res.status(520).json('error mail or error password')
                    }
                } else {
                    return res.status(404).send({
                        error: 'user not fond'
                    });
                }
            })
            .catch(err => {
                res.send('error' + err)
            })
    });









module.exports = router;


