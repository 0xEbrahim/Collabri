import { Args, Int, Query, Resolver, Subscription } from '@nestjs/graphql';
import { MessageEntity } from './entities/message.entity';
import { MessageService } from './message.service';
@Resolver(() => MessageEntity)
export class MessageResolver {
  constructor(private MessageService: MessageService) {}

  @Query(() => [MessageEntity])
  messages() {
    return this.MessageService.findAll();
  }
  @Subscription(() => MessageEntity)
  messageAdded(@Args('roomId', { type: () => Int }) roomId: number) {
    return this.MessageService.newMessage(roomId);
  }
}
