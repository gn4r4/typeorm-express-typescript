// src/services/DashboardService.ts
import { BookService } from "./BookService";
import { ReaderService } from "./ReaderService";
import { LendingService } from "./LendingService";

export class DashboardService {

  async getStats() {

    const [totalBooks, activeReaders, issuedToday, overdueBooks] = await Promise.all([
      new BookService().countAll(),
      new ReaderService().countAll(),
      new LendingService().countIssuedToday(),
      new LendingService().countOverdue()
    ]);

    return {
      totalBooks,
      activeReaders,
      issuedToday,
      overdueBooks
    };
  }
}