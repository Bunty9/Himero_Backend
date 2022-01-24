const mongoose = require("mongoose");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: String,
        email: String,
        password: String,
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role",
            },
        ],
        house: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "house",
            },
        ],
        shared: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "shared",
            },
        ],
    })
);

module.exports = User;
