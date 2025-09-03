import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';

export const PUB_SUB = 'PUB_SUB';

@Global()
@Module({
  providers: [
    {
      provide: PUB_SUB,
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        return new RedisPubSub({
          connection: {
            host: cfg.get<string>('PUB_SUB_HOST'),
            port: cfg.get<number>('PUB_SUB_PORT'),
          },
        });
      },
    },
  ],
  exports: [PUB_SUB],
})
export class PubsubModule {}
