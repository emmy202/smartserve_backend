"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const reports_service_1 = require("./reports.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    getDashboardStats(start, end) {
        if (!start || !end)
            return { error: 'Start and end boundaries are required' };
        return this.reportsService.getDashboardStats(start, end);
    }
    getKitchenSales(start, end) {
        if (!start || !end)
            return { error: 'Start and end dates are required' };
        return this.reportsService.getKitchenSales(start, end);
    }
    getFinanceReport(start, end) {
        if (!start || !end)
            return { error: 'Start and end dates are required' };
        return this.reportsService.getSalesVsExpenses(start, end);
    }
    getLedger(type, start, end) {
        if (!start || !end)
            return { error: 'Start and end dates are required' };
        return this.reportsService.getPeriodicLedger(type || 'DAILY', start, end);
    }
    getProfitAnalysis(start, end) {
        if (!start || !end)
            return { error: 'Start and end boundaries are required' };
        return this.reportsService.getProfitAnalysis(start, end);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MANAGER),
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Query)('start')),
    __param(1, (0, common_1.Query)('end')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getDashboardStats", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MANAGER),
    (0, common_1.Get)('kitchen-sales'),
    __param(0, (0, common_1.Query)('start')),
    __param(1, (0, common_1.Query)('end')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getKitchenSales", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MANAGER),
    (0, common_1.Get)('finance'),
    __param(0, (0, common_1.Query)('start')),
    __param(1, (0, common_1.Query)('end')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getFinanceReport", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MANAGER),
    (0, common_1.Get)('ledger'),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('start')),
    __param(2, (0, common_1.Query)('end')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getLedger", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MANAGER),
    (0, common_1.Get)('profit-analysis'),
    __param(0, (0, common_1.Query)('start')),
    __param(1, (0, common_1.Query)('end')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getProfitAnalysis", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map