import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { dbConection } from "./database/dbConection.js";

import productRoutes from "./routes/products.routes.js"
import cartRoutes from "./routes/cart.routes.js"
import messageRoutes from "./routes/message.routes.js"
import imageRoutes from "./routes/image.routes.js"

const server = express();

const api = async () => {
    dotenv.config()

    await dbConection()

    server.use(express.json()) // el servidor va a usar estructura tipo json
    server.use(cors())

    server.use("/images", imageRoutes)
    server.use("/api/products", productRoutes)
    server.use("/api/cart", cartRoutes)
    server.use("/api/contact", messageRoutes)

    server.listen(process.env.PORT, () => console.log("Servidor corriendo en el puerto", process.env.PORT)) // para correr el .env y el cgl para el mensaje de sv corriendo
}

api()