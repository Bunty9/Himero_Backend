exports.allAccess = (req, res) => {
    res.status(200).send("All Public Content.");
};

exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
    res.status(200).send("GOD Content.");
};
