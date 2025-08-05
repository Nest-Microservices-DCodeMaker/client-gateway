import { catchError } from 'rxjs';
import { Controller, Get, Post, Body, Param, Inject, Query, ParseUUIDPipe, Patch, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config/services';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateOrderDto, StatusDto } from './dto';
import { OrderPaginationDto } from './dto/order-pagination';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE)
    private readonly ordersClient: ClientProxy
  ) { }

  @UseGuards( AuthGuard )
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder', createOrderDto)
      .pipe(
        catchError(err => { throw new RpcException(err) })
      );
  }

  @UseGuards( AuthGuard )
  @Get()
  findAll(@Query() paginationDto: OrderPaginationDto) {
    return this.ordersClient.send('findAllOrders', paginationDto)
      .pipe(
        catchError(err => { throw new RpcException(err) })
      );
  }

  @UseGuards( AuthGuard )
  @Get('id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersClient.send('findOneOrder', { id })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      );
  }

  @UseGuards( AuthGuard )
  @Get(':status')
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto
  ) {
    return this.ordersClient.send('findAllOrders', {
      ...paginationDto,
      status: statusDto.status
    })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )
  }

  @UseGuards( AuthGuard )
  @Patch(':id')
  async changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto
  ) {
    return this.ordersClient.send('changeOrderStatus', 
      { id, status: statusDto.status })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )
  }

}