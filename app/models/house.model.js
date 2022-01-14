const mongoose = require("mongoose");

const House = mongoose.model(
    "House",
    new mongoose.Schema({
        userid: mongoose.Schema.Types.ObjectId,
        housename: String,
        room: [{ type: mongoose.Schema.ObjectId }],
    })
);

module.exports = House;
