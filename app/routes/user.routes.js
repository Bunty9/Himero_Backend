const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const db = require("../models");
const House = require("../models/house.model");
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

    app.post(
        "/api/user",
        [authJwt.verifyToken],
        async function (req, res, next) {
            console.log(req.body);
            console.log(req.user.house);
            const houses = req.user.house;
            const data = await House.find()
                .where("_id")
                .in(houses)
                .lean()
                .populate("room")
                .exec();

            console.log(data);
            res.send(data).status(200);
            next();
        }
    );

    app.post(
        "/api/admin",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.adminBoard
    );
};
