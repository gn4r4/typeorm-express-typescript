import { Publisher } from '../orm/entities/publisher/Publisher';

export class PublisherResponseDTO {
  id: number;
  name: string;
  address: string | null;
  contact: string | null;

  constructor(publisher: Publisher) {
    this.id = publisher.id_publisher;
    this.name = publisher.name;
    this.address = publisher.address || null;
    this.contact = publisher.contact || null;
  }
}