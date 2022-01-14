exports.allAccess = async (req, res) => {
    await res.status(200).send("All Public Content.");
};

exports.userBoard = async (req, res) => {
    await res.status(200).send("User Content.");
};

exports.adminBoard = async (req, res) => {
    await res.status(200).send("Admin Content.");
};
