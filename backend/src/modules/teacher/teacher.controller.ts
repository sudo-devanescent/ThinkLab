import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('teacher')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeacherController {
  constructor(private teacherService: TeacherService) {}

  @Get('students')
  @Roles('teacher')
  async getStudents() {
    return this.teacherService.getStudents();
  }

  @Get('students/:id')
  @Roles('teacher')
  async getStudent(@Param('id') id: string) {
    return this.teacherService.getStudentById(id);
  }
}
