import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports/nats.module';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [],
  imports: [NatsModule]
})
export class AuthModule {}
