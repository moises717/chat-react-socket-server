const jwt = require("jsonwebtoken");
require("colors");

const generarJWT = (uid) => {
	return new Promise((resolve, reject) => {
		const payload = { uid };

		jwt.sign(
			payload,
			process.env.JWT_KEY,
			{
				expiresIn: "24h",
			},
			(err, token) => {
				if (err) {
					console.log(err);
					rejecte("No se puedo generar el token.".red);
				} else {
					resolve(token);
				}
			}
		);
	});
};

const verificarToken = (token) => {
	try {
		const { uid } = jwt.verify(token, process.env.JWT_KEY);
		return [true, uid];
	} catch (error) {
		return [false, null];
	}
};

module.exports = { generarJWT, verificarToken };
