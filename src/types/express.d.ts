import { User as PrismaUser } from "@prisma/client";

export type AuthUser = Pick<PrismaUser, "id" | "email">;

declare global {
  namespace Express {

    interface User extends AuthUser {}
    interface Request {
      user?: User; 
    }
  }
}