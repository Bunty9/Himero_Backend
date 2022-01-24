const mongoose = require("mongoose");

const Device = mongoose.model(
    "Device",
    new mongoose.Schema({
        devicename: String,
        deviceid: String,
    })
);

module.exports = Device;
