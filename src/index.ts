import { App } from "./app";

new App().server.listen(5555, () => {
	console.log('Servidor rodando na porta: http://localhost:5555/')
});
