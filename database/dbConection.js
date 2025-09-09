import mongoose from "mongoose"


export const dbConection = async () => {
    try {
        const mongoDB = await mongoose.connect(process.env.BASE_URL_DB) // para conectar a la BD
        console.log("Se conecto satisfactoriamente a la BD de:", mongoDB.connections[0].name)
    } catch (error) {
        console.error("Error al conectar a la BD.")
        throw Error(error)
    }
}