import multer from "multer"


const storage = multer.diskStorage({ // para guardar la ruta donde se guarda la img cargada
    destination: (req, file, cb) => {
        cb(null, "./temp/images")
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}.png`) // todo se devuelve en la req en un archivo llamado file
    }
})

const upload = multer({ storage })

export default upload 