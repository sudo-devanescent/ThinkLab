import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { DecisionsService } from './decisions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('decisions')
@UseGuards(JwtAuthGuard)
export class DecisionsController {
  constructor(private decisionsService: DecisionsService) {}

  @Post()
  async submit(
    @Req() req: any,
    @Body('sessionScenarioId') sessionScenarioId: string,
    @Body('optionId') optionId: string,
    @Body('responseTimeMs') responseTimeMs: number,
  ) {
    return this.decisionsService.submitDecision(
      req.user.id,
      sessionScenarioId,
      optionId,
      responseTimeMs,
    );
  }
}
