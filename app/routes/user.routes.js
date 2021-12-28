const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const db = require("../models");
const House = require("../models/house.model");
const User = db.user;
module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);
		next();
	});

	app.get("/api/all", controller.allAccess);

	app.post("/api/user", [authJwt.verifyToken, isUser], function (req, res) {
		// var houses = [];
		var array = [];
		console.log(req.body);
		const user = req.body.userid;
		House.find({ userid: user }).toArray(function (err, result) {
			if (err) throw err;
			console.log(result);
		});
		// console.log(count);
		res.send("sending content").status(200);
	});

	app.post(
		"/api/admin",
		[authJwt.verifyToken, authJwt.isAdmin],
		controller.adminBoard
	);
};
