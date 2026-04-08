import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MenuModule } from './menu/menu.module';
import { OrdersModule } from './orders/orders.module';
import { RoomsModule } from './rooms/rooms.module';
import { ExpensesModule } from './expenses/expenses.module';
import { RequestsModule } from './requests/requests.module';
import { ReportsModule } from './reports/reports.module';
import { InventoryModule } from './inventory/inventory.module';
import { QueueGateway } from './queue/queue.gateway';
import { AssetsModule } from './assets/assets.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, MenuModule, OrdersModule, RoomsModule, ExpensesModule, RequestsModule, ReportsModule, InventoryModule, AssetsModule],
  controllers: [AppController],
  providers: [AppService, QueueGateway],
})
export class AppModule {}
