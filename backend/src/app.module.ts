import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { ScenariosModule } from './modules/scenarios/scenarios.module';
import { DecisionsModule } from './modules/decisions/decisions.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { TeacherModule } from './modules/teacher/teacher.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        schema: configService.get('DB_SCHEMA'),
        synchronize: false,
        logging: true,
        entities: [__dirname + '/entities/*.entity{.ts,.js}'],
      }),
    }),
    HealthModule,
    AuthModule,
    ScenariosModule,
    DecisionsModule,
    ProfilesModule,
    TeacherModule,
  ],
})
export class AppModule {}
