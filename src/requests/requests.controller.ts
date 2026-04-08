import { Controller, Get, Post, Body, Param, Put, UseGuards, Request } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, ApprovalStatus, RequestType } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  create(@Request() req: any, @Body() body: { type: RequestType, title: string, reason: string }) {
    return this.requestsService.create(req.user.id, body.type, body.title, body.reason);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Get()
  findAll() {
    return this.requestsService.findAll();
  }

  @Get('my')
  findMyRequests(@Request() req: any) {
    return this.requestsService.getMyRequests(req.user.id);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: ApprovalStatus) {
    return this.requestsService.updateStatus(+id, status);
  }
}
