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
const Role = db.role;

db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Successfully connect to MongoDB.");
        initial();
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
// const jwtMiddleware = (socket, next) => {                //jwt auth token for socket connection
//     const {token} = socket.handshake.query;
//     // verify token
//   };
// io.use(jwtMiddleware);
io.on("connection", (socket) => {
    console.log(
        `connect auth=${JSON.stringify(socket.handshake.auth)} sid=${socket.id}`
    );
    // if (socket.handshake.auth.token != authtoken) {
    //     if (socket.disconnect()) {
    //         console.log(
    //             `disconnected ${socket.id} for invalid token ${socket.handshake.auth.token}`
    //         );
    //     }
    // }
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
function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user",
            }).save((err) => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'user' to roles collection");
            });

            new Role({
                name: "moderator",
            }).save((err) => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'moderator' to roles collection");
            });

            new Role({
                name: "admin",
            }).save((err) => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'admin' to roles collection");
            });
        }
    });
}
