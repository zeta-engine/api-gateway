import { BadRequestException, Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { Player } from '../players/interfaces/player.interface';
import { CreateChallengeDTO } from './dtos/create-challenge.dto';
import { SetChallengeMatchDTO } from './dtos/set-challenge-match.dto';
import { UpdateChallengeDTO } from './dtos/update-challenge.dto';
import { ChallengeStatus } from './interfaces/challenge.enum';
import { Challenge } from './interfaces/challenge.interface';
import { Match } from './interfaces/match.interface';
import { ChallengeStatusValidationPipe } from './pipes/challenge-status-validation.pipe';


/* tslint:disable:2551 */

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly clientProxySmartRanking: ClientProxySmartRanking) { }

  private clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  private clientChallenge = this.clientProxySmartRanking.getClientProxyChallengeInstance();

  private readonly logger = new Logger(ChallengesController.name)

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(@Body() createChallengeDTO: CreateChallengeDTO) {
    const players: Player[] = await this.clientAdminBackend.send('get-players', '').toPromise();

    createChallengeDTO.players.map(playerDTO => {
      const playerFilter: Player[] = players.filter(player => player._id == playerDTO._id);

      if (playerFilter.length === 0) {
        throw new BadRequestException(`O id ${playerDTO._id} is not a player!`);
      }

      if (playerFilter[0].category !== createChallengeDTO.category) {
        throw new BadRequestException(`O player ${playerFilter[0]._id} not the same category of challenge!`)
      }
    });


    const requesterIsPlayer: Player[] = createChallengeDTO.players.filter(player => player._id == createChallengeDTO.requester)

    this.logger.log(`requesterIsPlayer: ${JSON.stringify(requesterIsPlayer)}`)

    if (requesterIsPlayer.length === 0) {
      throw new BadRequestException(`O solicitante deve ser um jogador da partida!`)
    }

    const category = await this.clientAdminBackend.send('get-categories', createChallengeDTO.category).toPromise()

    this.logger.log(`Category: ${JSON.stringify(category)}`)

    if (!category) {
      throw new BadRequestException(`category is not found!`)
    }

    await this.clientChallenge.emit('create-challenge', createChallengeDTO)
  }

  @Get()
  async getChallenges(@Query('idPlayer') idPlayer: string): Promise<Challenge[]> {
    if (idPlayer) {
      const player: Player = await this.clientAdminBackend.send('get-players', idPlayer).toPromise();
      this.logger.log(`player: ${JSON.stringify(player)}`)
      if (!player) {
        throw new BadRequestException(`Player not found!`)

      }
    }
    return await this.clientChallenge.send('get-challenges', { idPlayer: idPlayer, _id: '' }).toPromise();
  }


  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updateChallenge(@Param('_id', ValidationPipe) _id: string, @Body(ChallengeStatusValidationPipe) updateChallengeDTO: UpdateChallengeDTO): Promise<void> {

    const challenge: Challenge = await this.clientChallenge.send('get-challenges', { idPlayer: '', _id: _id }).toPromise()

    this.logger.log(`challenge: ${JSON.stringify(challenge)}`)

    if (!challenge) {

      throw new BadRequestException(`Challenge not found!`)

    }

    if (challenge.status != ChallengeStatus.PENDING) {

      throw new BadRequestException('Somente desafios com status PENDENTE podem ser atualizados!')

    }
    console.log(".++-+-+-+-+-+-+")

    this.clientChallenge.emit('update-challenge', { _id: _id, challenge: updateChallengeDTO })

  }

  @Delete('/:_id')
  async deleteChallenge(@Param('_id') _id: string) {
    const challenge: Challenge = await this.clientChallenge.send('consultar-desafios', { idPlayer: '', _id: _id }).toPromise()

    this.logger.log(`challenge: ${JSON.stringify(challenge)}`)

    if (!challenge) {
      throw new BadRequestException(`Desafio não cadastrado!`)
    }

    await this.clientChallenge.emit('delete-challenge', challenge)
  }


  @Post('/:challenge/match/')
   async setChallengeMatch(
       @Body(ValidationPipe) setChallengeMatchDTO: SetChallengeMatchDTO,
       @Param('challenge') _id: string) {
            
        const challenge: Challenge = await this.clientChallenge.send('get-challenges', { idPlayer: '', _id: _id }).toPromise()

        this.logger.log(`challenge: ${JSON.stringify(challenge)}`)
            
        /*
            Verificamos se o challenge está cadastrado
        */
        if (!challenge) {

            throw new BadRequestException(`challenge não cadastrado!`)

            }

        /*
            Verificamos se o challenge já foi realizado
        */

        if (challenge.status == ChallengeStatus.REALIZED) {
           
            throw new BadRequestException(`Desafio já realizado!`)
            
        }

        /*
            Somente deve ser possível lançar uma partida para um desafio
            com status ACEITO
        */

        if ( challenge.status != ChallengeStatus.ACEPTED) {

            throw new BadRequestException(`Partidas somente podem ser lançadas em desafios aceitos pelos adversários!`)

        }

        /*
            Verificamos se o jogador informado faz parte do desafio
        */
       if (!challenge.players.includes(setChallengeMatchDTO.def)) {

            throw new BadRequestException(`O jogador vencedor da partida deve fazer parte do desafio!`)

       }

        /*
            Criamos nosso objeto partida, que é formado pelas
            informações presentes no Dto que recebemos e por informações
            presentes no objeto desafio que recuperamos 
        */
        const match: Match = { } 
        match.category = challenge.category
        match.def = setChallengeMatchDTO.def
        match.challenge = _id
        match.players = challenge.players
        match.result = setChallengeMatchDTO.result

        /*
            Enviamos a partida para o tópico 'criar-partida'
            Este tópico é responsável por persitir a partida na 
            collection Partidas
        */
        await this.clientChallenge.emit('create-match', match)
   
    }

}
