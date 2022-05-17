const fs = require("fs");
const qrcode = require("qrcode-terminal");

const { Client } = require("whatsapp-web.js");

const SESSION_FILE_PATH = "./session.js";

const country_code = "57";
const numero = "3186593727";
const mensaje = "jelou moderfocker";

let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({
  session: sessionData,
});

client.initialize();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("El cliente está listo");

  let chatId = country_code + numero + "@c.us";

  client.sendMessage(chatId, mensaje).then((respuesta) => {
    if (respuesta.id.fromMe) {
      console.log("El mensaje fue enviado");
    }
  });
});

client.on("authenticated", (session) => {
  sessionData = session;

  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
    if (err) {
      console.error(err);
    }
  });
});

client.on("auth_failure", (msg) => {
  console.error("Hubo un fallo en la autenticación", msg);
});

client.on("message", (msg) => {
  if (msg.body === "Hola") {
    client.sendMessage(msg.from, "Jelou, bien o k");
  }
});
