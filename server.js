var express = require('express');
const cors = require("cors");
const db = require("./backend/models");
var path = require('path');

var publicDir = path.join(__dirname,'public');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 5001;
        this.frontend_dir = path.join(__dirname,'./frontend/build');
        this.corsOptions = { origin: "http://localhost:3000" };

        // Setup DB
        this.role = db.role;
        this.user = db.user;
        // TODO(before prod) : do not force true in prod
        /* db.sequelize.sync({force: true}).then(() => {
            console.log('Drop and Resync Database with { force: true }');
            this.initialize_db();
        });*/
        db.sequelize.sync();

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(cors(this.corsOptions));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(express.static(this.frontend_dir));
    }

    routes() {
        require('./backend/routes/auth.routes')(this.app);
        require('./backend/routes/file.routes')(this.app);
        // Catch all requests that don't match any route
        /* this.app.get("*", (req, res) => {
            res.sendFile(
                path.join(this.frontend_dir, "index.html")
            );
        }); */
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log("Server running on port: ", this.port);
          });
    }

    initialize_db() {
        this.role.create({
            id: 1,
            name: "user"
        });
         
        this.role.create({
            id: 2,
            name: "admin"
        });
    }
}

const server = new Server();
server.listen();

module.exports = Server;
