import { Router } from "express";
import ProductManager from "../dao/FileSystem/controllers/ProductManager.js";
import { io } from "../index.js";

const socketRouter = Router();
const productAll = new ProductManager();

socketRouter.get("/", async (req, res) => {
 
  io.on("connection", (socket) => {
    socket.on("messaje", (data) => {
      console.log(data);
      
      io.sockets.emit("estado", "Conectado con el Servidor por Sockets");
    });

    
    socket.on("getProduct", async (data) => {
      let byIdProducts = await productAll.getProductsById(data);
      if (data === "") {
        io.sockets.emit("getProduct", {
          messaje: "Se consultaron todos los Productos",
          products: await productAll.getProducts(),
        });
      } else if (byIdProducts === "Producto no Encontrado") {
        io.sockets.emit("getProduct", {
          messaje: byIdProducts,
          products: [],
        });
      } else {
        io.sockets.emit("getProduct", {
          messaje: "Consulta Exitosa",
          products: [byIdProducts],
        });
      }
    });

    
    socket.on("addProduct", async (data) => {
      let addProduct = await productAll.addProduct(JSON.parse(data));
      io.sockets.emit("addProduct", {
        messaje: addProduct,
        products: await productAll.readProducts(),
      });
    });

    
    socket.on("putProduct", async (data) => {
      let updateProduct = await productAll.updateProduct(
        data.id,
        JSON.parse(data.info)
      );
      io.sockets.emit("putProduct", {
        messaje: updateProduct,
        products: await productAll.readProducts(),
      });
    });

    
    socket.on("deleteProduct", async (data) => {
      let deleteProduct = await productAll.deleteProducts(data);
      io.sockets.emit("deleteProduct", {
        messaje: deleteProduct,
        products: await productAll.readProducts(),
      });
    });
  });

 
  let products = await productAll.readProducts();
  res.render("realTimeProducts", {
    title: "Express | Websockets",
    products,
  });
});

export default socketRouter;
