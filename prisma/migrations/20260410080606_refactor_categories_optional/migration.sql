/*
  Warnings:

  - You are about to drop the column `category` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `InventoryItem` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the `MenuCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `MenuItem` DROP FOREIGN KEY `MenuItem_categoryId_fkey`;

-- DropIndex
DROP INDEX `MenuItem_categoryId_fkey` ON `MenuItem`;

-- AlterTable
ALTER TABLE `Asset` DROP COLUMN `category`,
    ADD COLUMN `categoryId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Expense` DROP COLUMN `category`,
    ADD COLUMN `categoryId` INTEGER NULL;

-- AlterTable
ALTER TABLE `InventoryItem` DROP COLUMN `category`,
    ADD COLUMN `categoryId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Room` DROP COLUMN `type`,
    ADD COLUMN `categoryId` INTEGER NULL;

-- DropTable
DROP TABLE `MenuCategory`;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('MENU', 'INVENTORY', 'EXPENSE', 'ASSET', 'ROOM') NOT NULL DEFAULT 'MENU',

    UNIQUE INDEX `Category_name_type_key`(`name`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MenuItem` ADD CONSTRAINT `MenuItem_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryItem` ADD CONSTRAINT `InventoryItem_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Asset` ADD CONSTRAINT `Asset_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
