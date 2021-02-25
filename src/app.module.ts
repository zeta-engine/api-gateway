import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { PlayersModule } from './players/players.module';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';

@Module({
  imports: [CategoriesModule, PlayersModule, ProxyRMQModule],
  providers: [],
})
export class AppModule {}
