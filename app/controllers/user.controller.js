exports.allAccess = async (req, res) => {
    await res.status(200).send("All Public Content.");
};

exports.userBoard = async function (req, res, next) {
    var data = [];
    const user = await User.findById(req.body.userid).exec();
    for (i = 0; i < user.house.length; i++) {
        const house = await House.find().where("_id").in(user.house[i]).exec();
        const deviceIDS = house.map((house) => house.device).flat();
        if (house.length > 0) {
            data.push(house);
        }
        var devices = [];
        for (j = 0; j < deviceIDS.length; j++) {
            const device = await Device.find()
                .where("_id")
                .in(deviceIDS[j])
                .exec();
            devices.push(device[0]);

            console.log(devices);
        }
        data[i].push(devices);
    }
    console.log(data);
    res.send(data).status(200);
    next();
};

exports.adminBoard = async (req, res) => {
    await res.status(200).send("Admin Content.");
};
