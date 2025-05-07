/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Administrador` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `Utilizador` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Administrador_username_key` ON `Administrador`(`username`);

-- CreateIndex
CREATE UNIQUE INDEX `Utilizador_username_key` ON `Utilizador`(`username`);
