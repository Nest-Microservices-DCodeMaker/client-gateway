import { Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config/services';

@Controller('auth')
export class AuthController {
  
    constructor(
        @Inject(NATS_SERVICE)
        private readonly authClient: ClientProxy
    ) { }

    @Post('register')
    registerUser() {
        return this.authClient.send('auth.register.user', {});
    }

    @Post('login')
    loginUser() {
        return this.authClient.send('auth.login.user', {});
    }

    @Get('verify')
    verifyUser() {
        return this.authClient.send('auth.verify.user', {});
    }

}
