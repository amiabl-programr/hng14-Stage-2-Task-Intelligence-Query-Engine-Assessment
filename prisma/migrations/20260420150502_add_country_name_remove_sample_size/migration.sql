/*
  Warnings:

  - The primary key for the `profiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `sample_size` on the `profiles` table. All the data in the column will be lost.
  - The `id` column on the `profiles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `country_name` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_pkey",
DROP COLUMN "sample_size",
ADD COLUMN     "country_name" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(6),
ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");
