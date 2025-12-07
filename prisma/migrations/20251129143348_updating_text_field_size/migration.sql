/*
  Warnings:

  - You are about to alter the column `title` on the `posts` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(120)`.

*/
-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "title" SET DATA TYPE VARCHAR(120),
ALTER COLUMN "content" SET DATA TYPE TEXT;
