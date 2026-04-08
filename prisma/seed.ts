import "dotenv/config";
import { PrismaClient, Role, ItemType, RoomStatus, ApprovalStatus, MovementType, PaymentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with Forensic Intelligence...');

  // 1. CLEAR OLD DATA (Order matters for relations)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.supplierPayment.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.room.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();
  await prisma.user.deleteMany();

  // 2. CREATE USERS
  const password = await bcrypt.hash('pass123', 10);
  
  const admin = await prisma.user.create({
    data: { email: 'admin@hms.com', name: 'Super Admin', password, role: 'ADMIN' }
  });
  const manager = await prisma.user.create({
    data: { email: 'manager@hms.com', name: 'Jane Manager', password, role: 'MANAGER' }
  });
  const cashier = await prisma.user.create({
    data: { email: 'cashier@hms.com', name: 'Sara Cashier', password, role: 'CASHIER' }
  });
  const waiter = await prisma.user.create({
    data: { email: 'waiter@hms.com', name: 'John Waiter', password, role: 'WAITER' }
  });

  // 3. CREATE SUPPLIERS
  const supplierA = await prisma.supplier.create({
    data: { name: 'Kigali Bulk Supplies', phone: '0788123456', email: 'sales@kbs.rw' }
  });

  // 4. CREATE INVENTORY ITEMS (Stock)
  const rice = await prisma.inventoryItem.create({
    data: { name: 'Basmati Rice', unit: 'kg', currentStock: 100, minimumStock: 20, costPrice: 1200 }
  });
  const chicken = await prisma.inventoryItem.create({
    data: { name: 'Whole Chicken', unit: 'piece', currentStock: 50, minimumStock: 10, costPrice: 4500 }
  });
  const oil = await prisma.inventoryItem.create({
    data: { name: 'Cooking Oil', unit: 'litre', currentStock: 40, minimumStock: 5, costPrice: 2000 }
  });

  // 5. CREATE MENU CATEGORIES
  const catFood = await prisma.menuCategory.create({ data: { name: 'Main Dishes' } });
  const catDrinks = await prisma.menuCategory.create({ data: { name: 'Fresh Drinks' } });

  // 6. CREATE MENU ITEMS
  const jollof = await prisma.menuItem.create({
    data: { name: 'Jollof Rice & Chicken', price: 8500, type: 'FOOD', categoryId: catFood.id }
  });
  const juice = await prisma.menuItem.create({
    data: { name: 'Passion Juice', price: 2500, type: 'DRINK', categoryId: catDrinks.id }
  });

  // 7. CREATE RECIPES (Link Food to Inventory)
  await prisma.recipe.create({
    data: { menuItemId: jollof.id, inventoryItemId: rice.id, quantityNeeded: 0.25 } // 250g per plate
  });
  await prisma.recipe.create({
    data: { menuItemId: jollof.id, inventoryItemId: chicken.id, quantityNeeded: 0.25 } // quarter chicken
  });
  await prisma.recipe.create({
    data: { menuItemId: jollof.id, inventoryItemId: oil.id, quantityNeeded: 0.05 } // 50ml
  });

  // 8. CREATE EXPENSES (Past 7 days)
  const categories = ['RENT', 'SALARIES', 'UTILITIES', 'MAINTENANCE'];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    await prisma.expense.create({
      data: {
        title: `Daily ${categories[i % 4]}`,
        amount: 25000 + (Math.random() * 10000),
        category: categories[i % 4],
        status: 'APPROVED',
        userId: admin.id,
        createdAt: date
      }
    });
  }

  // 9. CREATE STOCK INFLOWS (Procurement)
  await prisma.stockMovement.create({
    data: {
      inventoryItemId: rice.id,
      type: 'STOCK_IN',
      quantity: 50,
      unitCost: 1100,
      supplierId: supplierA.id,
      createdById: admin.id,
      paymentStatus: 'PAID',
      paidAmount: 55000,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    }
  });

  // 10. CREATE ORDERS (Sales History)
  for (let i = 0; i < 20; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 7));
    
    const isPaid = Math.random() > 0.2;
    const order = await prisma.order.create({
      data: {
        tableNumber: `T${Math.floor(Math.random() * 10) + 1}`,
        totalAmount: 17000,
        status: 'COMPLETED',
        paymentStatus: isPaid ? 'PAID' : 'UNPAID',
        userId: waiter.id,
        createdAt: date
      }
    });

    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        menuItemId: jollof.id,
        quantity: 2,
        status: 'DELIVERED',
        createdAt: date
      }
    });
  }

  // 11. CREATE ROOMS
  await prisma.room.create({ data: { number: '101', type: 'STANDARD', price: 45000, status: 'AVAILABLE' } });
  await prisma.room.create({ data: { number: '102', type: 'DELUXE', price: 75000, status: 'OCCUPIED' } });

  console.log('✅ Seed complete. HMS is now pre-populated with forensic data!');
  console.log('🔑 Credentials (Password: pass123):');
  console.log('   - admin@hms.com (ADMIN)');
  console.log('   - manager@hms.com (MANAGER)');
  console.log('   - cashier@hms.com (CASHIER)');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
