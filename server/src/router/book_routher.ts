import { Router } from "express"
import { getAllBooks, getBookById, createBook, updateBook, deleteBook } from "../controllers/book_controller"

const bookRouter = Router()

bookRouter.post("/create", createBook)
bookRouter.put("/update/:id", updateBook)
bookRouter.get("/", getAllBooks)
bookRouter.get("/:id", getBookById)
bookRouter.delete("/delete/:id", deleteBook)

export default bookRouter