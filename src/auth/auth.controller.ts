import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config/services';
import { LoginUserDto, RegisterUserDto } from './dto';

@Controller('auth')
export class AuthController {
  
    constructor(
        @Inject(NATS_SERVICE)
        private readonly authClient: ClientProxy
    ) { }

    @Post('register')
    registerUser(
        @Body() registerUserDto: RegisterUserDto
    ) {
        return this.authClient.send('auth.register.user', registerUserDto);
    }

    @Post('login')
    loginUser(
        @Body() loginUserDto: LoginUserDto
    ) {
        return this.authClient.send('auth.login.user', loginUserDto);
    }

    @Get('verify')
    verifyUser() {
        return this.authClient.send('auth.verify.user', {});
    }

}
