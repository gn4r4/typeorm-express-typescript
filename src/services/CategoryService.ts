import { getRepository } from 'typeorm';
import { Category } from '../orm/entities/category/Category';

export class CategoryService {

  private get categoryRepository() {
    return getRepository(Category);
  }
  
  private relations = ['books'];

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ relations: this.relations, });
  }

  async findOne(id: number): Promise<Category | null> {
    return this.categoryRepository.findOne({
      where: { id_category: id },
      relations: this.relations,
    });
  }

  async create(data: Partial<Category>): Promise<Category> {
    const category = this.categoryRepository.create(data);
    return this.categoryRepository.save(category);
  }

  async update(id: number, data: Partial<Category>): Promise<Category | null> {
    await this.categoryRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}