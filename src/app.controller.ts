import { Body, Controller, Get, Logger, Param, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CreateCategoryDTO } from './dtos/create-category.dto';

@Controller('api/v1')
export class AppController {

  private logger = new Logger(AppController.name);

  private clientAdminBackend: ClientProxy;
  
  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:user@0.0.0.0:5672'],
        queue: 'admin-backend',
      }
    });
  }

  @Post('categories')
  @UsePipes(ValidationPipe)
  createCategory (@Body() createCategoryDTO: CreateCategoryDTO) {
    // ASYNC METHOD
    this.clientAdminBackend.emit('create-category', createCategoryDTO);
  }

  @Get('categories')
  @UsePipes(ValidationPipe)
  getCategoryBy(@Query('idCategory') _id: string): Observable<any> {
    // SYNC METHOD
    return this.clientAdminBackend.send('get-categories', _id ? _id: '');;
  }


}
