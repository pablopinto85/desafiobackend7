import { Router } from "express";
import ProductManager from "../controller/ProductManager.js";

const productRouter = Router();


const productos = new ProductManager();


productRouter.get("/", async (req, res) => {
  try {
    res.send(await productos.getProducts(req.query.limit));
  } catch (error) {
    console.log(error);
  }
});

productsRouter.get('/', (req, res) => {
 
  const limit = req.query.limit || productos.length;
  const limitedProducts = productos.slice(0, limit);
  res.json(limitedProducts);
});

productRouter.get("/:id", async (req, res) => {
  try {
    let productById = await productos.getProductsById(req.params.id);
    if (productById === 404)
      return res.status(404).render("error", {
        title: "404 || Not Found",
        image: "/static/img/404.gif",
        error: "El producto que buscas no existe",
      });
    return res.send(productById);
  } catch (error) {
    console.log(error);
  }
});

productRouter.post("/", async (req, res) => {
  let addProduct = await productos.addProduct(req.body);
  if (addProduct === 400)
    return res.status(400).render("error", {
      title: "400 || Bad Request",
      image: "/static/img/404.gif",
      error: "Faltan Datos",
    });
  return res.send(addProduct);
});

productRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const modify = req.body;
  let modifyProduct = await productos.updateProduct(id, modify);
  if (modifyProduct === 404)
    return res.status(404).render("error", {
      title: "404 || Not Found",
      image: "/static/img/404.gif",
      error: "El producto a Modificar no existe",
    });
  if (modifyProduct === 400)
    return res.status(400).render("error", {
      title: "400 || Bad Request",
      image: "/static/img/404.gif",
      error: "Faltan Datos",
    });
  return res.send(modifyProduct);
});

productRouter.delete("/:id", async (req, res) => {
  let { id } = req.params;
  let productDelete = await productos.deleteProducts(id);
  if (productDelete === 404)
    return res.status(404).render("error", {
      title: "404 || Not Found",
      image: "/static/img/404.gif",
      error: "El producto a Eliminar no existe",
    });
  res.send(productDelete);
});

export default productRouter;
