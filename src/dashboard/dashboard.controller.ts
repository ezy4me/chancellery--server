import { Controller, Get } from '@nestjs/common';
import { DashboardDto } from './dto/dashboard.dto';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getDashboardData(): Promise<DashboardDto> {
    return this.dashboardService.getDashboardData();
  }
}
