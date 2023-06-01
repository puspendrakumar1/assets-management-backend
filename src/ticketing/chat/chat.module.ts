import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import {
  TicktingChat,
  TicktingChatSchema,
} from './schema/ticketing-chat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TicktingChat.name, schema: TicktingChatSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
