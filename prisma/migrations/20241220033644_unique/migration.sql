/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Building` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Building_title_key" ON "Building"("title");
