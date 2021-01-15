const mongoose = require("mongoose");
require("colors");
const dbConection = async () => {
	try {
		await mongoose.connect(process.env.DB_CONNECT, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log("Conectado a la base de datos ✔ ".blue);
	} catch (error) {
		console.log(error);
		throw new Error("Error en la base de datos - (revisar logs)");
	}
};

module.exports = {
	dbConection,
};
