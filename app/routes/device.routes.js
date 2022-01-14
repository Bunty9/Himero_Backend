//handle crud home,room, device routes and update to database
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

    app.post("/api/turnon", function (req, res) {
        io.emit("test", req.body);
        console.log(req.body);
        res.status(200).send("turn on emitted");
    });
};
