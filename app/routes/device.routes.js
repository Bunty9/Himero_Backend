const db = require("../models");
const User = db.user;
const House = db.house;
const Room = db.room;

module.exports = function ({ app, io }) {
    // app.use(function (req, res, next) {
    //     res.header(
    //         "Access-Control-Allow-Headers",
    //         "x-access-token, Origin, Content-Type, Accept"
    //     );
    //     next();
    // });

    app.post("/api/newhome", function (req, res) {
        console.log(req.body);
        const user = req.body.userid;
        const house = new House({
            userid: req.body.userid,
            housename: req.body.homeName,
        });
        house.save((err) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            } else {
                User.updateOne(
                    { _id: user },
                    { $addToSet: { house: { _id: house._id } } },
                    function (err) {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        } else {
                            res.send("House Successfully created").status(200);
                        }
                    }
                );
            }
        });
    });

    app.post("/api/newroom", function (req, res) {
        console.log(req.body);
        const room = new Room({
            roomname: req.body.roomName,
        });
        House.updateOne(
            { housename: req.body.homeName },
            { $addToSet: { room: { _id: room._id } } },
            function (err) {
                if (err) {
                    console.log(err);
                    res.status(500).send({ message: err });
                    return;
                }
            }
        );

        room.save((err) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            } else {
                res.send("Room Successfully created").status(200);
            }
        });
    });

    app.post("/api/newdevice", async function (req, res) {
        console.log(req.body);
        const user = await User.findById(req.body.userid).exec();
        // console.log(user.house);
        const house = await House.find({ housename: req.body.homeName })
            .where("_id")
            .in(user.house)
            .exec();
        // console.log(house);
        // console.log(house[0].room);
        await Room.updateOne(
            { roomname: req.body.roomName },
            {
                $addToSet: {
                    device: {
                        deviceid: req.body.deviceId,
                        devicename: req.body.deviceName,
                        devicestatus: false,
                    },
                },
            }
        )
            .where("_id")
            .in(house[0].room)
            .exec();
        // console.log(room);

        res.status(200).send("adding device");
    });

    app.post("/api/flip", function (req, res) {
        const data = {
            deviceid: req.body.device_id,
            status: req.body.status,
        };
        io.emit("test", data);
        console.log(req.body);
        Room.updateOne(
            { _id: req.body.roomid, "device._id": req.body.device_id },
            { $set: { "device.$.devicestatus": req.body.status } },
            { new: true }
        ).then(res.status(200).send("turn on emitted"));
        // console.log(device);
    });

    app.post("/api/sharehome", async function (req, res) {
        console.log(req.body);
        const user = await User.findById(req.body.userid).exec();
        const house = await House.find({ housename: req.body.homeName })
            .where("_id")
            .in(user.house)
            .exec();
        // console.log(house);
        if (house.length == 0) {
            res.send("House doesnot exist or you dont own this house").status(
                200
            );
        } else {
            const shareto = User.find({
                username: req.body.userName,
            }).exec((err) => {
                if (err) {
                    res.send(err);
                }
            });
            if (!shareto) {
                res.send("user does not exist").status(404);
            } else {
                console.log(shareto);
                await User.updateOne(
                    { _id: shareto._id },
                    { $addToSet: { shared: { _id: house._id } } },
                    function (err) {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        } else {
                            res.send("House Successfully Shared").status(200);
                        }
                    }
                );
            }
        }
    });
};
