const db = require("../models");
const User = db.user;

checkDuplicateHouse = (req, res, next) => {
    const userid = req.body.userid;
    const houseName = req.body.homeName;
    User.findById(userid).then((user) => {
        if (user) {
            for (let i = 0; i < user.house.length; i++) {
                if (user.house[i].housename == houseName) {
                    return res.send("House already exists").status(400);
                }
            }
            next();
        }
    });
};

module.exports = checkDuplicateHouse;
