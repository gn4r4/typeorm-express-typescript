import { Category } from '../orm/entities/category/Category';

export class CategoryResponseDTO {
  id: number;
  name: string;

  constructor(category: Category) {
    this.id = category.id_category;
    this.name = category.name;
  }
}