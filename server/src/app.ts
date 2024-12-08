import express from "express"
import { PrismaClient } from '@prisma/client'
import libraryRouter from "./router/library_routher"
import bookRouter from "./router/book_routher"

const app = express()
const prisma = new PrismaClient()
const port = process.env.PORT || 8080

app.use(express.json())

app.use('/library', libraryRouter)
app.use('/book', bookRouter)

app.get("/ping", (req, res) => {
    res.json({message: "pong"}).status(200)
})



app.listen(port, () => {
    console.log(`Server up and runing on port: ${port}`)
})