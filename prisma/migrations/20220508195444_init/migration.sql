/*
  Warnings:

  - You are about to drop the column `exp` on the `Appliers` table. All the data in the column will be lost.
  - You are about to drop the column `iat` on the `Appliers` table. All the data in the column will be lost.
  - You are about to drop the column `iss` on the `Appliers` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Appliers` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Appliers` table. All the data in the column will be lost.
  - You are about to drop the column `sub` on the `Appliers` table. All the data in the column will be lost.
  - The primary key for the `Movies` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Appliers" DROP COLUMN "exp",
DROP COLUMN "iat",
DROP COLUMN "iss",
DROP COLUMN "name",
DROP COLUMN "role",
DROP COLUMN "sub";

-- AlterTable
ALTER TABLE "Movies" DROP CONSTRAINT "Movies_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Movies_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Movies_id_seq";

-- CreateTable
CREATE TABLE "_AppliersToMovies" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AppliersToMovies_AB_unique" ON "_AppliersToMovies"("A", "B");

-- CreateIndex
CREATE INDEX "_AppliersToMovies_B_index" ON "_AppliersToMovies"("B");

-- AddForeignKey
ALTER TABLE "_AppliersToMovies" ADD CONSTRAINT "_AppliersToMovies_A_fkey" FOREIGN KEY ("A") REFERENCES "Appliers"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppliersToMovies" ADD CONSTRAINT "_AppliersToMovies_B_fkey" FOREIGN KEY ("B") REFERENCES "Movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
