let express = require("express"), command = express.Router(), bcrypt = require("bcrypt");

let db = require("../database/db");

//resgister new command
command.post("/new", (req, res) => {
                db.command.create({clientId:req.body.clientId, Status:1})
                    .then(command => {
                        console.log(command)
                        if(command.id !== 0){
                            for (let i = 0; i < req.body.panier.length ; i++) {
                                db.contien.create({
                                    prix: req.body.panier[i].soustotal,
                                    qtn: req.body.panier[i].quantite,
                                    commandId: command.id,
                                    produitId: req.body.panier[i].produitId
                                })
                                    .then(resp => {
                                        res.json(resp)
                                    })
                                    .catch(err => {
                                        res.json(err)
                                    })

                            }
                            res.status(200).json({command: command})
                        }
                        else {
                            res.status(400).json("errror")
                        }
                    })
                    .catch(err => {
                        res.status(400).send("error" + err)
                    })
        });


command.put("/update/:id", (req, res) => {
    db.command.update(req.body, {
            where: {id: req.params.id}
        }
    )
        .then(command => {
            res.status(200).json(command);
        })
        .catch(err => {
            res.status(400).json(err);
        })
});
module.exports = command;


