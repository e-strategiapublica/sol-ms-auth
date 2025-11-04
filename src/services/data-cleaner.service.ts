import type { IDataCleaner } from "../interfaces/seed.interfaces.js";
import { db } from "../config/db.js";

export class DataCleanerService implements IDataCleaner {
  async cleanTestUsers(emails: string[]): Promise<void> {
    if (emails.length === 0) return;

    if (emails.length === 1) {
      const email = emails[0];
      if (email) {
        await db
          .deleteFrom("user")
          .where("email", "=", email)
          .execute();
      }
    } else {
      const validEmails = emails.filter(email => email !== undefined);
      if (validEmails.length > 0) {
        await db
          .deleteFrom("user")
          .where("email", "in", validEmails)
          .execute();
      }
    }
  }
}
