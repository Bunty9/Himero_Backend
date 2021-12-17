//handle crud home,room, device routes and update to database
const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const ObjectId = require("mongodb").ObjectId;
const db = require("../models");
const User = db.user;
const House = db.house;
const { checkDuplicateHouse } = require("../middlewares");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    //read
    app.get(
        "/api/devices/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        async function (req, res) {
            const user = req.params.id;
            User.findOne(ObjectId(userid)).exec((err, user) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                if (!user) {
                    return res.status(404).send({ message: "User Not found." });
                }
                return res.status(200).send(user.username);
                // get user devices
                //send structured device data
            });
        }
    );

    // create
    app.post(
        "/api/devices/new",
        [authJwt.verifyToken, authJwt.isAdmin],
        async function (req, res) {
            const user = req.body.userid;
            User.findOne(ObjectId(user)).exec((err, user) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                if (!user) {
                    return res.status(404).send({ message: "User Not found." });
                }
                // return res.status(200).send(user.username);
                // get house id
                House.findOne(ObjectId(house)).exec((err, house) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    if (!house) {
                        return res
                            .status(404)
                            .send({ message: "House Not found." });
                    }
                });
            });
        }
    );

    //update
    app.put(
        "/api/devices/update",
        [authJwt.verifyToken, authJwt.isAdmin],
        async function (req, res) {
            const user = req.body.userid;
            User.findOne(ObjectId(user)).exec((err, user) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                if (!user) {
                    return res.status(404).send({ message: "User Not found." });
                }
                return res.status(200).send(user.username);
                // get user devices
                //send structured device data
            });
        }
    );

    //delete
    app.delete(
        "/api/devices/update",
        [authJwt.verifyToken, authJwt.isAdmin],
        async function (req, res) {
            const user = req.body.userid;
            House.findByIdAndDelete(id)
                .then(() => res.json("Requested house/room/device deleted."))
                .catch((err) => res.status(400).json("Error: " + err));
        }
    );

    app.post("/api/newhome", checkDuplicateHouse, function (req, res) {
        console.log(req.body);
        User.findById(req.body.userid).exec((err, user) => {
            if (err) {
                res.send({ message: err }.status(500));
                return;
            }

            if (!user) {
                return res.send({ message: "User Not found." }).status(404);
            }
            user.updateOne({
                $addToSet: { house: { housename: req.body.homeName } },
            }).then(res.send("New House added").status(200));
        });
    });
    
    app.post("/api/newroom", function (req, res) {
        console.log(req.body);
        res.status(200).send("data received");
    });
    app.post("/api/newdevice", function (req, res) {
        console.log(req.body);
        res.status(200).send("data received");
    });
};
