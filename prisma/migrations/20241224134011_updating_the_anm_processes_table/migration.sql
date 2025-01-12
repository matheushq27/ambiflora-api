/*
  Warnings:

  - Added the required column `cardholder_name` to the `anm_processes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpf_cnpj` to the `anm_processes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `current_phase` to the `anm_processes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `municipalities` to the `anm_processes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requirement_type` to the `anm_processes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `situation` to the `anm_processes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `substances` to the `anm_processes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `types_of_use` to the `anm_processes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "anm_processes" ADD COLUMN     "cardholder_name" TEXT NOT NULL,
ADD COLUMN     "cpf_cnpj" TEXT NOT NULL,
ADD COLUMN     "current_phase" TEXT NOT NULL,
ADD COLUMN     "municipalities" TEXT NOT NULL,
ADD COLUMN     "requirement_type" TEXT NOT NULL,
ADD COLUMN     "situation" TEXT NOT NULL,
ADD COLUMN     "substances" TEXT NOT NULL,
ADD COLUMN     "types_of_use" TEXT NOT NULL;
