const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const ObjectId = require("mongodb").ObjectId;
const db = require("../models");
const User = db.user;

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/all", controller.allAccess);

    app.post("/api/user", [authJwt.verifyToken], function (req, res) {
        const userid = req.body.userid;
        User.findOne(ObjectId(userid)).exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }
            return res.status(200).json(user.house);
            // res.send("Admin data");
            // houseid
            //find house and structure housedata
            //send house data
        });
    });

    app.post(
        "/api/admin",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.adminBoard
    );
};
