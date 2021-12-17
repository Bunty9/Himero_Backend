const mongoose = require("mongoose");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: String,
        email: String,
        password: String,
        house: [
            {
                housename: String,
                houseid: mongoose.Schema.Types.ObjectId,
                room: [
                    {
                        roomname: String,
                        device: [
                            {
                                devicename: String,
                            },
                        ],
                    },
                ],
            },
        ],
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role",
            },
        ],
    })
);

module.exports = User;
