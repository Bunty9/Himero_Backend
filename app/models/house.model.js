const mongoose = require("mongoose");

const House = mongoose.model(
	"House",
	new mongoose.Schema({
		userid: mongoose.Schema.Types.ObjectId,
		housename: String,
		room: [
			{
				roomname: String,
				device: [
					{
						devicename: String,
						deviceid: String,
					},
				],
			},
		],
	})
);

module.exports = House;
