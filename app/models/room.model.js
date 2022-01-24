const mongoose = require("mongoose");

const Room = mongoose.model(
    "Room",
    new mongoose.Schema({
        userid: mongoose.Schema.Types.ObjectId,
        roomname: String,
        device: [
            {
                deviceid: String,
                devicename: String,
                devicestatus: Boolean,
            },
        ],
    })
);

module.exports = Room;
