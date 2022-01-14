const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const db = require("../models");
const House = require("../models/house.model");
const User = db.user;
const Room = db.room;

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

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
                const roomIDS = house.map((house) => house.room).flat();
                // data.push(house);
                if (house.length > 0) {
                    data.push(house);
                }
                var rooms = [];
                for (j = 0; j < roomIDS.length; j++) {
                    const room = await Room.find()
                        .where("_id")
                        .in(roomIDS[j])
                        .exec();
                    rooms.push(room[0]);
                    // if (room.length > 0) {
                    //     const devices = room.map((room) => room.device).flat();
                    //     if (devices.length > 0) {
                    //         // console.log(devices);
                    //     }
                    // }

                    // if (parseInt(room.length) > 0) {
                    //     data.house.push(room);
                    // }
                    console.log(rooms);
                }
                data[i].push(rooms);
            }
            // console.log(data);
            // const room = await Room.find().where("_id").in(house.room).exec();
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
