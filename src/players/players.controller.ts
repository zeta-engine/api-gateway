import { BadRequestException, Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { UpdatePlayerDTO } from './dtos/update-player.dto';

@Controller('api/v1/players')
export class PlayersController {

  private logger = new Logger(PlayersController.name);
  
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private clientAdminBackend: ClientProxy = this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() createPlayerDTO: CreatePlayerDTO) {

    const category = await this.clientAdminBackend.send('get-categories', createPlayerDTO.category).toPromise();
    if (category) {
      this.clientAdminBackend.emit('create-player', createPlayerDTO);
    } else {
      throw new BadRequestException(`Category not registered!`)
    }
  }

  @Get()
  @UsePipes(ValidationPipe)
  getPlayers(@Query('idPlayer') _id: string): Observable<any> {
    // SYNC METHOD
    return this.clientAdminBackend.send('get-players', _id ? _id: '');
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(@Body() updatePlayerDTO: UpdatePlayerDTO, @Param('_id') _id: string) {
    // ASYNC METHOD
    const category = await this.clientAdminBackend.send('get-categories', updatePlayerDTO.category).toPromise();
    if (category) {
      return this.clientAdminBackend.emit('update-player',{_id, player: updatePlayerDTO});
    } else {
      throw new BadRequestException(`Category not registered!`)
    }
  }

  @Delete('/:_id')
  @UsePipes(ValidationPipe)
  async deletePlayer(@Param('_id') _id: string) {
    // ASYNC METHOD
    await this.clientAdminBackend.emit('delete-player', {_id});
  }

}
