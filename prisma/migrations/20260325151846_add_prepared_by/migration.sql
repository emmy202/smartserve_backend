-- AlterTable
ALTER TABLE `OrderItem` ADD COLUMN `preparedById` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_preparedById_fkey` FOREIGN KEY (`preparedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
