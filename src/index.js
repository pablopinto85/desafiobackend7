import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import * as path from "path";
import __dirname from "./utils.js";
import { engine } from "express-handlebars";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/carts.routes.js";
import socketRouter from "./routes/socket.routes.js";
import chatRouter from "./routes/chat.routes.js";
import { Server } from "socket.io";
import { dateShort } from "./utils.js";
import connectionMongoose from "./connection/mongoose.js";
import productMongooseRouter from "./routes/productMongoose.routes.js";
import cartsMongooseRouter from "./routes/cartsMongoose.routes.js";
import cartSocketRouter from "./routes/cartsSocket.routes.js";
import productsRouter from "./routes/products.routes.js";
import { chatModel } from "./dao/Mongoose/models/ChatSchema.js";
import CrudMongoose from "./dao/Mongoose/controllers/ProductManager.js";



dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.engine(
  "handlebars",
  engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowedProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));


app.use("/", express.static(__dirname + "/public"));


export const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () =>
  console.log(`Express por Local host ${server.address().port}`)
);
server.on("error", (err) => {
  console.log(`Algo salio mal: ${err}`);
});
export const io = new Server(server);


let time = dateShort();

export let usersChat = [];

const greeting = {
  user: "Administrador",
  messaje: "Bienvenido al Chat 👋",
  time,
  idUser: "1234567890",
};

const addChatMongoose = async (messaje) => {
  await chatModel.create(messaje);
};
io.on("connection", (socket) => {
  console.log(socket.id, "Conectado");
  socket.on("disconnect", () => {
    console.log(socket.id, "Desconectado");
    let user = usersChat.find((user) => user.idUser === socket.id);
    if (user != undefined) {
      
      addChatMongoose({
        user: user.user,
        messaje: "se ha desconecto",
        time: dateShort(),
        idUser: socket.id,
        idConnection: "disConnection",
      });
      let userUpload = usersChat.filter((user) => user.idUser != socket.id);
      usersChat = [...userUpload];
      let findChatMongoose = async () => {
  
        if (usersChat.length === 0) await chatModel.deleteMany({});
        
        let allMessajeMongoose = await chatModel.find();
        io.sockets.emit("userChat", usersChat, allMessajeMongoose);
      };
      findChatMongoose();
    }
  });
  socket.on("userChat", (data) => {
    usersChat.push({
      user: data.user,
      idUser: data.id,
    });
    
    let userConecction = {
      user: data.user,
      messaje: data.messaje,
      time: dateShort(),
      idUser: data.id,
      idConnection: "Connection",
    };
   
    let chat = async () => {
      let chats = await chatModel.find();
      if (chats.length === 0) {
        
        await chatModel.create([greeting, userConecction]);
      } else {
        await chatModel.create(userConecction);
      }
      let allMessajeMongoose = await chatModel.find();
      io.sockets.emit("userChat", usersChat, allMessajeMongoose);
    };
    chat();
  });

  socket.on("messajeChat", (data) => {
    
    addChatMongoose(data);
    let findChatMongoose = async () => {
      let allMessajeMongoose = await chatModel.find();
      io.sockets.emit("messajeLogs", allMessajeMongoose);
    };
    findChatMongoose();
  });
  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });
});


app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/realTimeProducts", socketRouter);
app.use("/chatSocket", chatRouter);
app.use("/mongoose/products", productMongooseRouter);
app.use("/mongoose/carts", cartsMongooseRouter);
app.use("/realTimeCarts", cartSocketRouter);
app.use("/products", productsRouter)

