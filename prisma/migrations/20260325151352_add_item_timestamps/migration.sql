-- AlterTable
ALTER TABLE `OrderItem` ADD COLUMN `deliveredAt` DATETIME(3) NULL,
    ADD COLUMN `preparingAt` DATETIME(3) NULL,
    ADD COLUMN `readyAt` DATETIME(3) NULL;
