const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const db = require("../models");
const House = require("../models/house.model");
const User = db.user;
const Device = db.device;

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/all", controller.allAccess);

    app.post("/api/user", [authJwt.verifyToken], controller.userAccess);

    app.post("/api/admin", [authJwt.verifyToken], controller.adminBoard);
};
