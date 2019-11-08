var express = require("express"), client = express.Router(), bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
var db = require("../database/db");

process.env.SECRET_KEY = 'secret';

//resgister new client


    client.post("/register", (req, res) => {
        // find is client exist or not
        db.client.findOne({
            where: {email: req.body.email}
        })
        // if not exists so  then do that
            .then(itemclient => {
                if (!itemclient) {
                    // make hash of password in bcrypt, salt 10
                    password = bcrypt.hashSync(req.body.password, 10);
                    db.client.create({
                        email: req.body.email,
                        password: password
                    })
                        .then(client => {
                            let token = jwt.sign(client.dataValues, process.env.SECRET_KEY, {
                                expiresIn: 1440
                            });
                            res.status(200).json({token: token})
                        })
                        .catch(err => {
                            res.send(err)
                        })
                }
                // show error message client exists
                else {
                    res.json({
                        error: "client alredy exists"
                    })
                }
            })
    });

    client.get("/profile/:id", (req, res) => {
        db.client.findOne({
            where: {id: req.params.id}
        })
            .then(itemclient => {
                if (itemclient) {
                    res.send(itemclient);
                } else {
                    res.send({error: 'error'})
                }
            }).catch(err => {
            res.send(err);
        })

    });

    client.put("/update/:id", (req, res) => {
        console.log(req.body)
        db.client.findOne({
            where: {id: req.params.id}
        })
            .then(user => {
                user.update(req.body)
                    .then(useritem => {
                        db.client.findOne({
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



    client.post("/login", (req, res) => {
        console.log(req.body);
        db.client.findOne({
            where: {email: req.body.email}
        })
            .then(itemclient => {
                console.log(itemclient);
                if (itemclient) {
                    if (bcrypt.compareSync(req.body.password, itemclient.password)) {
                        let token = jwt.sign(itemclient.dataValues, process.env.SECRET_KEY, {
                            expiresIn: 1440
                        });
                        res.status(200).json({token: token})
                    } else {
                        res.status(520).json('error mail or error password')
                    }
                } else {
                    return res.status(520).send({
                        error: 'client not fond'
                    });
                }
            })
            .catch(err => {
                res.send('error' + err)
            })
    });









module.exports = client;


