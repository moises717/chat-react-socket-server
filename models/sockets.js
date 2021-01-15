const {
	usuarioConectado,
	usuariocDesonectado,
	getUsuarios,
	grabarMensaje,
} = require("../controllers/sockets");
const { verificarToken } = require("../helpers/jwt");

class Sockets {
	constructor(io) {
		this.io = io;

		this.socketEvents();
	}

	socketEvents() {
		// On connection
		this.io.on("connection", async (socket) => {
			const [valido, uid] = verificarToken(socket.handshake.query["x-token"]);

			if (!valido) {
				console.log("socket no indentificado.");
				return socket.disconnect();
			}

			await usuarioConectado(uid);

			// Unir al usuario a una sala de socket.io
			socket.join(uid);

			// validar el JWT
			// Si el token no es valido, desconectar
			// Saber que usuario esta activo mediate UID
			// Emitir todos los usuario conectados

			this.io.emit("lista-usuarios", await getUsuarios());

			// Socket join, uid
			// Escuchar cuando le cliente manda un mansaje
			// mensaje personal

			socket.on("mensaje-personal", async (payload) => {
				const mensaje = await grabarMensaje(payload);
				this.io.to(payload.para).emit("mensaje-personal", mensaje);
				this.io.to(payload.de).emit("mensaje-personal", mensaje);
			});

			//  Dissconnect
			//  Marcar en db que el usuario se desconecto
			//  Emitir todos loss usuarios

			socket.on("disconnect", async () => {
				await usuariocDesonectado(uid);
				this.io.emit("lista-usuarios", await getUsuarios());
			});
		});
	}
}

module.exports = Sockets;
