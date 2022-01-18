const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
require("dotenv").config();
const authtoken = process.env.AUTH_TOKEN;

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");

db.mongoose
    .connect(process.env.MONGOURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Successfully connect to MongoDB.");
    })
    .catch((err) => {
        console.error("Connection error", err);
        process.exit();
    });

// simple route
app.get("/", function (req, res, next) {
    res.json({ msg: "API Working" });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/device.routes")({ app, io });

io.on("connection", (socket) => {
    console.log(
        `connect auth=${JSON.stringify(socket.handshake.auth)} sid=${socket.id}`
    );
    if (socket.handshake.auth.token != authtoken) {
        if (socket.disconnect()) {
            console.log(
                `disconnected ${socket.id} for invalid token ${socket.handshake.auth.token}`
            );
        }
    }
    socket.on("action", (msg) => {
        console.log("action", msg);
    });
    socket.on("disconnect", () => {
        console.log(`disconnect ${socket.id}`);
    });
});
// set port, listen for requests
const PORT = process.env.PORT || 8080;
// server.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
