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

    app.post(
        "/api/user",
        [authJwt.verifyToken],
        async function (req, res, next) {
            var data = [];
            const user = await User.findById(req.body.userid).exec();
            for (i = 0; i < user.house.length; i++) {
                const house = await House.find()
                    .where("_id")
                    .in(user.house[i])
                    .exec();
                const deviceIDS = house.map((house) => house.device).flat();
                if (house.length > 0) {
                    data.push(house);
                }
                var devices = [];
                for (j = 0; j < deviceIDS.length; j++) {
                    const device = await Device.find()
                        .where("_id")
                        .in(deviceIDS[j])
                        .exec();
                    devices.push(device[0]);

                    console.log(devices);
                }
                data[i].push(devices);
            }
            console.log(data);
            res.send(data).status(200);
            next();
        }
    );

    app.post("/api/admin", [authJwt.verifyToken], controller.adminBoard);
};
