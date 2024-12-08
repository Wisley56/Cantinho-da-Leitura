import { Router } from "express"
import { getAllBooksInLibrary, getBookById, deleteBookFromLibrary, createLibrary } from "../controllers/library_controller"

const libraryRouter = Router()

libraryRouter.get("/", getAllBooksInLibrary)
libraryRouter.get("/:id", getBookById)
libraryRouter.delete("/delete/:libraryId/books/:bookId", deleteBookFromLibrary)
libraryRouter.post("/create", createLibrary)

export default libraryRouter