import { Cart } from "../models/Cart.js"


export const createCart = async (req, res) => { 
    const {body} = req
    
    try {

        const cart = await Cart.create(body)

        res.json({ // si esta todo bien 
            ok:true,
            msg: "Carrito creado correctamente.",
            cart
        })
        
    } catch (error) { // si fallo algo
        console.log("Error interno:", error)
        res.status(500).json({
            ok:false,
            msg:"Error de servidor."
        })
    }
}
