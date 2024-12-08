import {Request, Response} from "express"
import { Book, PrismaClient } from "@prisma/client"

const libraryClient = new PrismaClient().library
const bookClient = new PrismaClient().book


//getAllbooksInLibrary
export const getAllBooksInLibrary = async (req: any, res: any) => {
    try {
        const allBooks = await libraryClient.findMany({
          include: {
            books: true,
          },
        });
    
        if (!allBooks) {
          return res.status(404).json({ message: "No books found in library" });
        }
    
        res.status(200).json({ data: allBooks });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

//getBookById
export const getBookById = async (req: any, res: any) => {
    try {
        const { id } = req.params
        
        if(isNaN(Number(id)) || Number(id) < 0) {
            return res.status(400).json({message: "Bad request. ID incorrect."})
        }
        
        const library = await libraryClient.findUnique({
          where: {
            id: Number(id),
          },
          include: {
            books: true,
          }
        });
    
        if (!library) {
            return res.status(404).json({ message: "Library not found." });
        }

        res.status(200).json({ data: library.books });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

//createLibrary
export const createLibrary = async (req: any, res: any) => {
    const { name, books } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Library name is required." });
    }

    if (!books || !Array.isArray(books)) {
        return res.status(400).json({ error: "Books must be an array." });
    }

    try {
        const newLibrary = await libraryClient.create({
            data: {
                name,
                books: {
                    create: books.map((book: Book) => ({
                        title: book.title,
                        author: book.author,
                        yearPublication: book.yearPublication,
                        genre: book.genre,
                    })),
                },
            },
            include: {
                books: true,
            },
        });

        res.status(201).json({ data: newLibrary })
    } catch (error) {
        console.error("Error creating library:", error)
        res.status(500).json({ error: "Error creating library" })
    }
}

//deleteBook
export const deleteBookFromLibrary = async (req: any, res: any) => {
    try {
        const { libraryId, bookId } = req.params

        if (isNaN(Number(libraryId)) || isNaN(Number(bookId))) {
            return res.status(400).json({ message: "Bad request. Invalid IDs." })
        }

        const library = await libraryClient.findUnique({
            where: { id: Number(libraryId) },
            include: { books: true },
        });

        if (!library) {
            return res.status(404).json({ message: "Library not found." })
        }

        const bookExists = library.books.some((book) => book.id === Number(bookId))
        if (!bookExists) {
            return res.status(404).json({ message: "Book not found in this library." })
        }

        const deletedBook = await bookClient.delete({
            where: { id: Number(bookId) },
        })

        res.status(200).json({ message: "Book deleted successfully.", data: deletedBook })
    } catch (error) {
        console.error("Error deleting book from library:", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

  