import { Router } from "express";
import CartsManager from "../dao/FileSystem/controllers/CartsManager.js";


const cartsRouter = Router();

const carts = new CartsManager();


cartsRouter
  .post("/", async (req, res) => {
    let newCart = await carts.addCarts();
    res.send(newCart);
  })
 
  .get("/:id", async (req, res) => {
    let cartById = await carts.getCartById(req.params.id);
    if (cartById === 404)
      return res.status(404).send({ error: "El Carrito solicitado no existe" });
    res.send(cartById);
  })
  
  .post("/:cid/products/:pid", async (req, res) => {
    let productInCart = await carts.addProductInCart(
      req.params.cid,
      req.params.pid
    );
    if (productInCart === "error cart")
      return res.status(404).send({error: "El Carrito Seleccionado no existe"});
    if (productInCart === "error product")
      return res.status(404).send({error: "El producto Seleccionado no existe"});
    return res.send(productInCart);
  });

export default cartsRouter;
