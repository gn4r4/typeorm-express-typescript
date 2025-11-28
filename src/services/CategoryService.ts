import { getRepository } from 'typeorm';
import { Category } from '../orm/entities/category/Category';

export class CategoryService {
  private categoryRepository = getRepository(Category);

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findOne(id: number): Promise<Category | null> {
    return this.categoryRepository.findOne({ where: { id_category: id } });
  }

  async create(data: Partial<Category>): Promise<Category> {
    const category = this.categoryRepository.create(data);
    return this.categoryRepository.save(category);
  }

  async update(id: number, data: Partial<Category>): Promise<Category | null> {
    const category = await this.findOne(id);
    if (!category) return null;

    this.categoryRepository.merge(category, data);
    return this.categoryRepository.save(category);
  }

  async delete(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}