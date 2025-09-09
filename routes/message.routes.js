import { Router } from "express";
import { postMessage } from "../controllers/messageControllers.js";


const route = Router()

route.post("/", postMessage )

export default route 