//handle crud home,room, device routes and update to database
const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const ObjectId = require("mongodb").ObjectId;
const db = require("../models");
const User = db.user;
const House = db.house;
const { checkDuplicateHouse } = require("../middlewares");
const { house } = require("../models");
const { isUser } = require("../middlewares/authJwt");

module.exports = function ({ app, io }) {
	app.use(function (req, res, next) {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);
		next();
	});

	//read
	app.get(
		"/api/devices/:id",
		[authJwt.verifyToken, authJwt.isAdmin],
		async function (req, res) {
			const user = req.params.id;
			User.findOne(ObjectId(userid)).exec((err, user) => {
				if (err) {
					res.status(500).send({ message: err });
					return;
				}
				if (!user) {
					return res.status(404).send({ message: "User Not found." });
				}
				return res.status(200).send(user.username);
				// get user devices
				//send structured device data
			});
		}
	);

	// create
	app.post(
		"/api/devices/new",
		[authJwt.verifyToken, authJwt.isAdmin],
		async function (req, res) {
			const user = req.body.userid;
			User.findOne(ObjectId(user)).exec((err, user) => {
				if (err) {
					res.status(500).send({ message: err });
					return;
				}
				if (!user) {
					return res.status(404).send({ message: "User Not found." });
				}
				// return res.status(200).send(user.username);
				// get house id
				House.findOne(ObjectId(house)).exec((err, house) => {
					if (err) {
						res.status(500).send({ message: err });
						return;
					}
					if (!house) {
						return res.status(404).send({ message: "House Not found." });
					}
				});
			});
		}
	);

	//update
	app.put(
		"/api/devices/update",
		[authJwt.verifyToken, authJwt.isAdmin],
		async function (req, res) {
			const user = req.body.userid;
			User.findOne(ObjectId(user)).exec((err, user) => {
				if (err) {
					res.status(500).send({ message: err });
					return;
				}
				if (!user) {
					return res.status(404).send({ message: "User Not found." });
				}
				return res.status(200).send(user.username);
				// get user devices
				//send structured device data
			});
		}
	);

	//delete
	app.delete(
		"/api/devices/update",
		[authJwt.verifyToken, authJwt.isAdmin],
		async function (req, res) {
			const user = req.body.userid;
			House.findByIdAndDelete(id)
				.then(() => res.json("Requested house/room/device deleted."))
				.catch((err) => res.status(400).json("Error: " + err));
		}
	);

	app.post("/api/newhome", isUser, function (req, res) {
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
					{ $addToSet: { house: { houseid: house._id } } },
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

	app.post("/api/newroom", isUser, function (req, res) {
		console.log(req.body);
		House.updateOne(
			{ userid: req.body.userid, housename: req.body.homeName },
			{ $addToSet: { room: { roomname: req.body.roomName } } },

			function (err) {
				if (err) {
					res.status(500).send({ message: err });
					return;
				} else {
					res.send("New Room added").status(200);
				}
			}
		);
	});

	app.post("/api/newdevice", isUser, function (req, res) {
		console.log(req.body);
		House.findOne({
			userid: req.body.userid,
			housename: req.body.homeName,
		}).exec(function (err, house) {
			if (err) {
				res.status(500).send({ message: err });
				return;
			}
			if (!house) {
				res.send("no house found").status(404);
			} else {
				House.updateOne(
					{
						_id: house._id,
						"room.roomname": req.body.roomName,
					},
					{
						$push: {
							"room.$[].device": {
								devicename: req.body.deviceName,
								deviceid: req.body.deviceId,
							},
						},
					},
					function (err) {
						if (err) {
							res.status(500).send({ message: err });
							return;
						} else {
							res.send("New Device added").status(200);
						}
					}
				);
			}
		});
	});

	app.post("/api/turnon", function (req, res) {
		io.emit("test", req.body);
		console.log(req.body);
		res.status(200).send("turn on emitted");
	});
};
