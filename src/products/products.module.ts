import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, PRODUCT_SERVICE } from 'src/config';
import { ProductsController } from './products.controller';

@Module({
  controllers: [ProductsController],
  imports: [
    ClientsModule.register([
      {
        name: PRODUCT_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.PRODUCTS_MICROSERVICE_HOST,
          port: envs.PRODUCTS_MICROSERVICE_PORT
        }
      },
    ]),
  ],
  providers: [],
})
export class ProductsModule { }
