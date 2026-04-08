/*
  Warnings:

  - You are about to drop the column `requestedBy` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the `Request` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Expense` DROP FOREIGN KEY `Expense_requestedBy_fkey`;

-- DropForeignKey
ALTER TABLE `Request` DROP FOREIGN KEY `Request_userId_fkey`;

-- DropIndex
DROP INDEX `Expense_requestedBy_fkey` ON `Expense`;

-- AlterTable
ALTER TABLE `Expense` DROP COLUMN `requestedBy`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `category` VARCHAR(191) NOT NULL DEFAULT 'General',
    ADD COLUMN `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `decisionNote` VARCHAR(191) NULL,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `reviewedAt` DATETIME(3) NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `MenuItem` ADD COLUMN `available` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `stockQuantity` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `trackStock` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `type` ENUM('FOOD', 'DRINK', 'ROOM_SERVICE', 'ACCOMMODATION') NOT NULL DEFAULT 'FOOD';

-- AlterTable
ALTER TABLE `Room` ADD COLUMN `currentCheckIn` DATETIME(3) NULL,
    ADD COLUMN `expectedCheckOut` DATETIME(3) NULL,
    ADD COLUMN `lastStatusChange` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `Request`;

-- CreateTable
CREATE TABLE `RoomStatusLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomId` INTEGER NOT NULL,
    `oldStatus` ENUM('AVAILABLE', 'OCCUPIED', 'CLEANING', 'RESERVED') NULL,
    `newStatus` ENUM('AVAILABLE', 'OCCUPIED', 'CLEANING', 'RESERVED') NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Purchase` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `userId` INTEGER NOT NULL,
    `description` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StaffRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('LEAVING', 'PURCHASE', 'REPAIR', 'OTHER') NOT NULL DEFAULT 'OTHER',
    `title` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `userId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Supplier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupplierPayment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `supplierId` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,
    `method` VARCHAR(191) NOT NULL DEFAULT 'CASH',
    `reference` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `createdById` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InventoryItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NULL,
    `category` VARCHAR(191) NOT NULL DEFAULT 'General',
    `unit` VARCHAR(191) NOT NULL DEFAULT 'piece',
    `currentStock` DOUBLE NOT NULL DEFAULT 0,
    `minimumStock` DOUBLE NOT NULL DEFAULT 0,
    `costPrice` DOUBLE NOT NULL DEFAULT 0,
    `sellingReferencePrice` DOUBLE NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `preferredSupplierId` INTEGER NULL,

    UNIQUE INDEX `InventoryItem_sku_key`(`sku`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockMovement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `inventoryItemId` INTEGER NOT NULL,
    `type` ENUM('STOCK_IN', 'STOCK_OUT', 'ADJUSTMENT', 'WASTAGE') NOT NULL,
    `quantity` DOUBLE NOT NULL,
    `unitCost` DOUBLE NULL,
    `reason` VARCHAR(191) NULL,
    `referenceType` VARCHAR(191) NULL,
    `referenceId` VARCHAR(191) NULL,
    `supplierId` INTEGER NULL,
    `createdById` INTEGER NOT NULL,
    `paymentStatus` ENUM('UNPAID', 'PAID') NOT NULL DEFAULT 'PAID',
    `paidAmount` DOUBLE NULL,
    `paymentMethod` VARCHAR(191) NOT NULL DEFAULT 'CASH',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Recipe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `menuItemId` INTEGER NOT NULL,
    `inventoryItemId` INTEGER NOT NULL,
    `quantityNeeded` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Recipe_menuItemId_inventoryItemId_key`(`menuItemId`, `inventoryItemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Asset` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `serialNumber` VARCHAR(191) NULL,
    `purchaseDate` DATETIME(3) NULL,
    `purchasePrice` DOUBLE NOT NULL DEFAULT 0,
    `currentValue` DOUBLE NULL,
    `location` VARCHAR(191) NULL,
    `status` ENUM('OPERATIONAL', 'MAINTENANCE', 'REPAIR', 'DISPOSED', 'LOST') NOT NULL DEFAULT 'OPERATIONAL',
    `conditionNote` VARCHAR(191) NULL,
    `lastMaintenance` DATETIME(3) NULL,
    `nextMaintenance` DATETIME(3) NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Asset_serialNumber_key`(`serialNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoomStatusLog` ADD CONSTRAINT `RoomStatusLog_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoomStatusLog` ADD CONSTRAINT `RoomStatusLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Purchase` ADD CONSTRAINT `Purchase_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StaffRequest` ADD CONSTRAINT `StaffRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplierPayment` ADD CONSTRAINT `SupplierPayment_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplierPayment` ADD CONSTRAINT `SupplierPayment_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryItem` ADD CONSTRAINT `InventoryItem_preferredSupplierId_fkey` FOREIGN KEY (`preferredSupplierId`) REFERENCES `Supplier`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockMovement` ADD CONSTRAINT `StockMovement_inventoryItemId_fkey` FOREIGN KEY (`inventoryItemId`) REFERENCES `InventoryItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockMovement` ADD CONSTRAINT `StockMovement_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockMovement` ADD CONSTRAINT `StockMovement_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recipe` ADD CONSTRAINT `Recipe_menuItemId_fkey` FOREIGN KEY (`menuItemId`) REFERENCES `MenuItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recipe` ADD CONSTRAINT `Recipe_inventoryItemId_fkey` FOREIGN KEY (`inventoryItemId`) REFERENCES `InventoryItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
