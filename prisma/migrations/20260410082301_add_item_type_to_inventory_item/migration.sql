-- DropForeignKey
ALTER TABLE `MenuItem` DROP FOREIGN KEY `MenuItem_categoryId_fkey`;

-- DropIndex
DROP INDEX `MenuItem_categoryId_fkey` ON `MenuItem`;

-- AlterTable
ALTER TABLE `InventoryItem` ADD COLUMN `type` ENUM('FOOD', 'DRINK', 'ROOM_SERVICE', 'ACCOMMODATION') NOT NULL DEFAULT 'FOOD';

-- AlterTable
ALTER TABLE `MenuItem` MODIFY `categoryId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `MenuItem` ADD CONSTRAINT `MenuItem_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
