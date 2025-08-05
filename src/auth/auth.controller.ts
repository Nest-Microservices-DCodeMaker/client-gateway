import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config/services';
import { catchError } from 'rxjs';
import { LoginUserDto, RegisterUserDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { Token, User } from './decorators';
import { CurrentUser } from './interfaces/current-user.interface';

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
        return this.authClient.send('auth.register.user', registerUserDto).pipe(
            catchError((err) => {
                throw new RpcException(err)
            })
        )
    }

    @Post('login')
    loginUser(
        @Body() loginUserDto: LoginUserDto
    ) {
        return this.authClient.send('auth.login.user', loginUserDto).pipe(
            catchError((err) => {
                throw new RpcException(err)
            })
        )
    }

    @UseGuards( AuthGuard )
    @Get('verify')
    verifyUser(
        @User() user: CurrentUser,
        @Token() token: string
    ) {
        return { user, token }
    }

}
