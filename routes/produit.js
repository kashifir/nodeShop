let express = require("express"), produit = express.Router();

let db = require("../database/db");


//resgister new produit
produit.post("/new", (req, res) => {
    db.produit.create(req.body)
        .then(produit => {

                res.status(200).json({produit: produit})
        })
        .catch(err => {
            res.status(400).send("error" + err)
        })
});


produit.put("/update/:id", (req, res) => {
    db.produit.update(req.body, {
            where: {id: req.params.id}
        }
    )
        .then(produit => {
            res.status(200).json(produit);
        })
        .catch(err => {
            res.status(400).json(err);
        })
});

produit.get("/all", (req,res) => {
    db.produit.findAll({
        include:[{
            model: db.img
        }]
    })
        .then(reponse => {
            res.status(200).json({produit: reponse})
        })
        .catch(err => {
            res.json(err)
        })
})


module.exports = produit;


