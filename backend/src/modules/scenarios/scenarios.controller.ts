import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ScenariosService } from './scenarios.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('scenarios')
@UseGuards(JwtAuthGuard)
export class ScenariosController {
  constructor(private scenariosService: ScenariosService) {}

  @Get('next')
  async getNext(@Req() req: any) {
    return this.scenariosService.getNextScenario(req.user.id);
  }
}
