-- AlterTable
ALTER TABLE `Order` ADD COLUMN `cashierId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_cashierId_fkey` FOREIGN KEY (`cashierId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
