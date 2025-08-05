import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config/services';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(NATS_SERVICE)
    private readonly client: ClientProxy
  ) {}

  @UseGuards( AuthGuard )
  @Post()
  createProduct(@Body() createProductDto: CreateProductDto){
    return this.client.send({ cmd: 'create_product' }, createProductDto)
      .pipe(
        catchError( err => { throw new RpcException(err) })
      );
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    
    return this.client.send({ cmd: 'find_all' }, paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.client.send({ cmd: 'find_one_product' }, { id })
      .pipe(
        catchError( err => { throw new RpcException(err) } )
      );
    // try {
    //   const product = await firstValueFrom(
    //     this.productsClient.send({ cmd: 'find_one_product' }, { id })
    //   );
    //   return product;
    // } catch (error) {
    //   throw new RpcException(error);
    // }
  }

  @UseGuards( AuthGuard )
  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.client.send({ cmd: 'delete_product' }, { id })
      .pipe(
        catchError( err => { throw new RpcException(err) })
      );
  }

  @UseGuards( AuthGuard )
  @Patch(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.client.send({ cmd: 'update_product' }, {
      id,
      ...updateProductDto
    })
      .pipe(
        catchError( err => { throw new RpcException(err) })
      );
  }

}
