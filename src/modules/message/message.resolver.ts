import { Args, Int, Resolver, Subscription } from '@nestjs/graphql';
import { MessageEntity } from './entities/message.entity';
import { MessageService } from './message.service';
@Resolver(() => MessageEntity)
export class MessageResolver {
  constructor(private MessageService: MessageService) {}

  @Subscription(() => MessageEntity)
  messageAdded(@Args('roomId', { type: () => Int }) roomId: number) {
    return this.MessageService.newMessage(roomId);
  }
}
