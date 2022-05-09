/*
  Warnings:

  - You are about to drop the `_AppliersToMovies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AppliersToMovies" DROP CONSTRAINT "_AppliersToMovies_A_fkey";

-- DropForeignKey
ALTER TABLE "_AppliersToMovies" DROP CONSTRAINT "_AppliersToMovies_B_fkey";

-- DropTable
DROP TABLE "_AppliersToMovies";

-- CreateTable
CREATE TABLE "MoviesOnAppliers" (
    "id" TEXT NOT NULL,
    "appliersUserId" INTEGER,
    "moviesId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MoviesOnAppliers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MoviesOnAppliers" ADD CONSTRAINT "MoviesOnAppliers_appliersUserId_fkey" FOREIGN KEY ("appliersUserId") REFERENCES "Appliers"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoviesOnAppliers" ADD CONSTRAINT "MoviesOnAppliers_moviesId_fkey" FOREIGN KEY ("moviesId") REFERENCES "Movies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
