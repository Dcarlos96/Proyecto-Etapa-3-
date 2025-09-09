import { model, Schema } from "mongoose";



const ProductSchema = new Schema({ // esquema del producto
    name: {
        type: String,
        unique: true,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        default: 0
    },
    brand: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    shortsDescription: {
        type: String,
        required: true
    },
    largeDescription: {
        type: String,
        
    },
    freeDelivery: {
        type: Boolean,
        default: false
    },
    img: {
        type: String,
        require: true
    },
    ageFrom: {
        type: Number,
        
    },
    ageTo: {
        type: Number,
        
    },
    deletedAt: {
        type: Date,
        
    },

}, {timestamps: true}) // segundo objeto, para agregar la fecha de creacion y actualizacion 

ProductSchema.set("toJSON", { // funcion para renombrar el _id por el id y ProductSchema lo mandamos abajo a la const "Products"
    transform: (doc, ret, options) => {
        ret.id = ret._id;
        delete ret._id
    }
} )
export const Products = model("Product", ProductSchema) // Estrutura general del archivo, "Product" este se va a Products.js