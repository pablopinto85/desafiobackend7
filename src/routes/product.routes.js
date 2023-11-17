import { Router } from "express";
import ProductManager from "../dao/FileSystem/controllers/ProductManager.js";

const productRouter = Router();


const productos = new ProductManager();


productRouter.get("/", async (req, res) => {
  try {
    res.send(await productos.getProducts(req.query.limit));
  } catch (error) {
    console.log(error);
  }
});

productRouter
  .get("/:id", async (req, res) => {
    try {
      let productById = await productos.getProductsById(req.params.id);
      if (productById === "Producto no Encontrado")
        return res
          .status(404)
          .send({ error: "El producto que buscas no existe" });
      return res.send(productById);
    } catch (error) {
      console.log(error);
    }
  })
 
  .post("/", async (req, res) => {
    let addProduct = await productos.addProduct(req.body);
    if (addProduct === "JSON incompleto. Faltan 1 o mas Datos")
      return res.status(400).send({ error: "Faltan Datos" });
    return res.send(addProduct);
  })
  
  .put("/:id", async (req, res) => {
    const { id } = req.params;
    const modify = req.body;
    let modifyProduct = await productos.updateProduct(id, modify);
    if (modifyProduct === "Producto a modificar no Existe")
      return res
        .status(404)
        .send({ error: "El producto a Modificar no existe" });
    if (modifyProduct === "JSON incompleto. Faltan 1 o mas Datos")
      return res
        .status(400)
        .send({ error: "JSON incompleto. Faltan 1 o mas Datos" });
    return res.send(modifyProduct);
  })
 
  .delete("/:id", async (req, res) => {
    let { id } = req.params;
    let productDelete = await productos.deleteProducts(id);
    if (productDelete === "Producto No Encontrado")
      return res.status(404).render("error", {
        title: "404 || Not Found",
        image: "/static/img/404.gif",
        error: "El Producto a Eliminar no Existe",
      });
    res.send(productDelete);
  });

export default productRouter;
