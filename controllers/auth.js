const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
	try {
		const { email, password } = req.body;

		const existeEmail = await Usuario.findOne({ email });
		if (existeEmail) {
			return res.status(400).json({
				ok: false,
				msg: "El correo ya existe.",
			});
		}

		const usuario = new Usuario(req.body);
		// Encrptar contraseña
		const salt = bcrypt.genSaltSync();

		usuario.password = bcrypt.hashSync(password, salt);
		// Guardar usuario

		await usuario.save();

		// Generar el jwt

		const token = await generarJWT(usuario.id);

		res.json({
			ok: true,
			usuario,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Contactar al admistrador.",
		});
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const usuario = await Usuario.findOne({ email });

		if (!usuario) {
			return res.status(404).json({
				ok: false,
				msg: "Email no encontrado.",
			});
		}

		// Validar el password

		const validPassword = bcrypt.compareSync(password, usuario.password);

		if (!validPassword) {
			return res.status(400).json({
				ok: false,
				msg: "Datos Incorrectos.",
			});
		}

		// generar el token

		const token = await generarJWT(usuario.id);

		res.json({
			ok: true,
			usuario,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: "Contactar al admistrador.",
		});
	}
};

const renewToken = async (req, res) => {
	const uid = req.uid;

	// generar un nuevo jwt

	const token = await generarJWT(uid);

	// Obtener el usuario por uid

	const usuario = await Usuario.findById(uid);

	res.json({
		ok: true,
		usuario,
		token,
	});
};
module.exports = {
	crearUsuario,
	login,
	renewToken,
};
