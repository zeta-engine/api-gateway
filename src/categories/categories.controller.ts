import { Body, Controller, Get, Logger, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { UpdateCategoryDTO } from './dtos/update-category.dto';

@Controller('api/v1/categories')
export class CategoriesController {

  private logger = new Logger(CategoriesController.name);
  
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private clientAdminBackend: ClientProxy = this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  @Post()
  @UsePipes(ValidationPipe)
  createCategory (@Body() createCategoryDTO: CreateCategoryDTO) {
    // ASYNC METHOD
    this.clientAdminBackend.emit('create-category', createCategoryDTO);
  }

  @Get()
  @UsePipes(ValidationPipe)
  getCategoryBy(@Query('idCategory') _id: string): Observable<any> {
    // SYNC METHOD
    return this.clientAdminBackend.send('get-categories', _id ? _id: '');
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  updateCategory(@Body() udateCategoryDTO: UpdateCategoryDTO, @Param('_id') _id: string): Observable<any> {
    // ASYNC METHOD
    return this.clientAdminBackend.emit('update-category',{_id, category: udateCategoryDTO});
  }

}
