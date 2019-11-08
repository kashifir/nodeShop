let express = require("express");
let bodyParser = require("body-parser");


// require routes



let cors = require("cors");

let port = 3000;

let app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static("public"));

// diefind prifix for route

app.use("/user",require('./routes/user'));
app.use("/client",require('./routes/client'));
app.use("/produit",require('./routes/produit'));
app.use("/command",require('./routes/command'));



app.listen(port, function () {
    console.log("server start on " + port)
});
