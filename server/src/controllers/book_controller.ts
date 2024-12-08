import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const bookClient = new PrismaClient().book

//getAllBooks
export const getAllBooks = async (req: any, res: any) => {
  try {
        const books = await bookClient.findMany()

        if (!books) {
            return res.status(404).json({ message: "No books found." })
        }

        res.status(200).json({ data: books })
  
    } catch (error) {
        res.status(500).json({ error: "Error fetching books." })
    }
}

//getBookById
export const getBookById = async (req: any, res: any) => {
    try {
        const { id } = req.params
        
        if(isNaN(Number(id)) || Number(id) < 0) {
            return res.status(400).json({message: "Bad request. ID incorrect."})
        }
        
        const book = await bookClient.findUnique({
          where: {
            id: Number(id),
          },
        });
    
        res.status(200).json({ data: book });
    } catch (e) {
    console.error(e);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

//createBook
export const createBook = async (req: Request, res: Response) => {
    const { title, author, yearPublication, genre, libraryId } = req.body
    try {
        const newBook = await bookClient.create({
        data: { title, author, yearPublication, genre, libraryId },
        });

        res.status(201).json(newBook)

    } catch (error) {
        res.status(500).json({ error: `Error creating book: ${error}`})
    }
}

//updateBook
export const updateBook = async (req: Request, res: Response) => {
  const { id } = req.params
  const { title, author, yearPublication, genre } = req.body
  try {
    const updatedBook = await bookClient.update({
      where: { id: Number(id) },
      data: { title, author, yearPublication, genre },
    });
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: "Error updating book" })
  }
}

//deleteBook
export const deleteBook = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        await bookClient.delete({
            where: { id: Number(id) },
        });
        res.status(200).json({ message: "Book deleted successfully" })
    } catch (error) {
        res.status(500).json({ error: "Error deleting book" })
    }
}
