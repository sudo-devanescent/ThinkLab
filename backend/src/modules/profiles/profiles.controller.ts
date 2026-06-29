import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @Get('me')
  async getMyProfile(@Req() req: any) {
    return this.profilesService.getProfile(req.user.id);
  }

  @Get('history')
  async getHistory(@Req() req: any) {
    return this.profilesService.getHistory(req.user.id);
  }
}
