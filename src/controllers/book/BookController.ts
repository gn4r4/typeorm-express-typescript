import { Request, Response, NextFunction } from 'express';
import { BookService } from '../../services/BookService';
import { CustomError } from '../../utils/response/custom-error/CustomError';
import { BookResponseDTO } from '../../dto/BookResponseDTO';

export class BookController {
  private bookService = new BookService();

  public list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const books = await this.bookService.findAll();
      const booksDTO = books.map((book) => new BookResponseDTO(book));
      
      res.customSuccess(200, 'List of books.', booksDTO);
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public show = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const book = await this.bookService.findOne(id);
      if (!book) return next(new CustomError(404, 'General', `Book with id:${id} not found.`));
      
      res.customSuccess(200, 'Book found', new BookResponseDTO(book));
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    // authorIds обробляються в Service
    try {
      const book = await this.bookService.create(req.body);
      res.customSuccess(201, 'Book successfully created.', new BookResponseDTO(book));
    } catch (err) {
      next(new CustomError(400, 'Raw', "Can't create book.", null, err));
    }
  };

  public edit = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const book = await this.bookService.update(id, req.body);
      if (!book) return next(new CustomError(404, 'General', `Book with id:${id} not found.`));
      
      res.customSuccess(200, 'Book successfully updated.', new BookResponseDTO(book));
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };

  public destroy = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    try {
      const book = await this.bookService.findOne(id);
      if (!book) return next(new CustomError(404, 'General', `Book with id:${id} not found.`));
      
      await this.bookService.delete(id);
      res.customSuccess(200, 'Book successfully deleted.', { id });
    } catch (err) {
      next(new CustomError(400, 'Raw', 'Error', null, err));
    }
  };
}