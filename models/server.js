// Servidor de Express
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const cors = require("cors");
require("colors");
const Sockets = require("./sockets");
const { dbConection } = require("../database/config");

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;

		//Conectar a db
		dbConection();

		// Http server
		this.server = http.createServer(this.app);

		// Configuraciones de sockets
		this.io = socketio(this.server, {
			/* configuraciones */
		});
	}

	middlewares() {
		// Desplegar el directorio público
		this.app.use(express.static(path.resolve(__dirname, "../public")));
		// Json
		this.app.use(express.json());
		//Cors
		this.app.use(cors());
		//API ENDPOINS
		this.app.use("/api/login", require("../router/auth"));
		this.app.use("/api/mensajes", require("../router/mensajes"));
	}

	// Esta configuración se puede tener aquí o como propieda de clase
	// depende mucho de lo que necesites
	configurarSockets() {
		new Sockets(this.io);
	}

	execute() {
		// Inicializar Middlewares
		this.middlewares();

		// Inicializar sockets
		this.configurarSockets();

		// Inicializar Server
		this.server.listen(this.port, () => {
			console.log("Server corriendo en puerto:".blue, this.port.blue + " ✔");
		});
	}
}

module.exports = Server;
