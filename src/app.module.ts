import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { ChallengesModule } from './challenges/challenges.module';
import { PlayersModule } from './players/players.module';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { RankingsModule } from './rankings/rankings.module';

@Module({
  imports: [CategoriesModule, PlayersModule, ChallengesModule, ProxyRMQModule, RankingsModule],
  providers: [],
})
export class AppModule {}
