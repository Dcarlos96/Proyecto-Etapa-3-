import express from "express"
import { createProduct, deletProduct, getProducts, updateProduct } from "../controllers/productsControllers.js"
import upload from "../helper/storage.js";

const route = express.Router()

route
.post("/", upload.single("img"), createProduct) //  el upload es middleware que se guarda en destination de storage.js
.get("/", getProducts )   //  funcion que se importa desde productsControllers
.put("/edit/:id", updateProduct)//  funcion que se importa desde productsControllers para editar productos
.delete("/delete/:id", deletProduct)


export default route;