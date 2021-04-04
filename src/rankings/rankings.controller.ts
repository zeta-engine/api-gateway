import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';

@Controller('api/v1/rankings')
export class RankingsController {

  constructor(
    private clientProxySmartRanking: ClientProxySmartRanking
  ) { }

  private clientRankingsBackend = this.clientProxySmartRanking.getClientProxyRankingsInstance()

  @Get()
  getRankings(

    @Query('idCategory') idCategory: string,
    @Query('dataRef') dataRef: string): Observable<any> {

    if (!idCategory) {
      throw new BadRequestException('O id da categoria é obrigatório!')
    }

    return this.clientRankingsBackend.send('get-rankings',
      { idCategory: idCategory, dataRef: dataRef ? dataRef : '' })

  }

}
