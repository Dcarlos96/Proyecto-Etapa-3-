import { skipMiddlewareFunction } from "mongoose"
import fs from "fs"
import { Products } from "../models/Products.js"
import { Images } from "../models/Images.js"


export const createProduct = async (req, res) => { //  controlador para crear productos. Se importa a products.routes
    const {body, file} = req
   
    try {

        if(!file) {
            return res.status(400).json({
                ok: false,
                msg:"La imagen no se pudo guardar correctamente"
            })
        }

        const prod = await Products.findOne({name: body.name})

        if (prod) { // si ya hay uno
            return res.status(400).json({
                ok: false,
                msg:"Ya existe un producto con este nombre"
            })
        }

        const imageBuffer = fs.readFileSync("./" + file.path); // creamos el buffer para guardalo en la BD
        

        const image = await Images.create({ // para grabar la imagen en la BD
            fileName: file.filename,
            img: {
                data: imageBuffer,
                contentType: "image.png"
            }
        })

        if(!image) { // error si no carga
            return res.status(400).json({
                ok: false,
                msg:"La imagen no se pudo guardar correctamente"
            })
        }
        const base = process.env.BASE_URL_API?.trim().replace(/\/$/, "");
        const newProd = await Products.create({
            ...body,
            img: `${base}/images/${image._id}`
        })

        fs.rm("./" + file.path, error => {
            if (error) console.log ("Lo sentimos, no hemos podido eliminar la imagen temporal")
            else console.log("El archivo se creo correctamente.")
        })

        res.json({
            ok:true,
            msg: "Producto creado correctamente.",
            product: newProd
        })
        
    } catch (error) {
        console.log("Error interno:", error)
        res.status(500).json({
            ok:false,
            msg:"Error de servidor."
        })
    }
}

export const getProducts = async (req, res) => { // para traer los productos cargados 

    const { query } = req; // la query es lo que esta en la url despues del signo "?" // name pageNumber documentsPerPage

    const documentsPerPage = parseInt(query.documentsPerPage) || 30; // limita el limite superior 
    const skip = ((parseInt(query.pageNumber) || 1) -1)  * documentsPerPage // 

    try {

        const queryRegExp = query.name ? { name: new RegExp(query.name, "i") } : undefined // le mandamos la "i" para que ignore las minusculas y mayusculas

        const totalDocs = await Products.countDocuments({
            ...queryRegExp,
            deletedAt: { $in: [null, undefined]}
        })

        const products = await Products.find({
            ...queryRegExp, // para que devuelva la queryRegExp
            deletedAt: { $in: [null, undefined] } // para que al pedir los productos no devuelva con los valores null o undefined del borrado
        }) 
            .skip(skip) // para las paginaciones 
            .limit(documentsPerPage) // x2

        res.json({
            ok:true,
            products,
            pageNumber: parseInt(query.pageNumber) || 1 ,
            totalPages: Math.ceil(totalDocs / documentsPerPage)
        })
        
    } catch (error) {
        console.log("Error interno:", error)
        res.status(500).json({
            ok:false,
            msg:"Error de servidor."
        })
    }
}

export const updateProduct = async (req, res) => { // para actualizar datos del producto ya cargado
    const { params: {id}, body} = req  // una doble desestructuración para traer el id y el body del param, el body para mandar los mismo datos
    
    try {
        const existProduct = await Products.findById(id) // para ver si existe el id del proximo producto

        if (!existProduct || existProduct.deletedAt) { // si no existe retornamos status 404
            return res.status(404).json({
                ok:false,
                msg:"El producto no existe"
            })
        }

        const newProduct = await Products.findByIdAndUpdate(
            id,
            body,
            {new: true}
        )

        res.json({
            ok: true,
            msg: "Producto modificado correctamente",
            product: newProduct
        })


    } catch (error) {
        console.log("Error interno:", error)
        res.status(500).json({
            ok:false,
            msg:"Error de servidor."
        })
    }
}

export const deletProduct = async (req, res) => { // para eliminar productos
    const { params: {id}} = req;
    try {
        const existProduct = await Products.findById(id)

        if(!existProduct || existProduct.deletedAt) { // porque si tiene fecha es un true, entonce es correcto que el producto no existe
            return res.status(404).json({
                ok:false,
                msg: "El producto no existe."
            })
        }

        await Products.findByIdAndUpdate(
            id,
            {deletedAt: new Date() }, // nuevo valor cargado al Products.js, para guardar 
            { new:true}
        )

        res.json({
            ok: true,
            msg: "Producto eliminado correvtamente",
        })
        
    } catch (error) {
        console.log("Error interno:", error)
        res.status(500).json({
            ok:false,
            msg:"Error de servidor."
        })
    }
}