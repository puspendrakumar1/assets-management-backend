import { Module } from '@nestjs/common';
import { TicketingController } from './ticketing.controller';
import { AddTicketingService } from './add-ticketing.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Tickting, TicktingSchema } from './schemas/ticketing.schema';
import { UpdateTicketingService } from './update-ticketing.service';
import { ActiveDirectoryModule } from 'src/active-directory/active-directory.module';
import { GetTicketFieldsService } from './get-ticket-fields.service';
import { PaginateTicketingService } from './ticket-paginate.service';
import { GetTicketingService } from './get-ticket.service';
import { TicketingService } from './ticketing.service';
import { UsersModule } from '../users/users.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tickting.name, schema: TicktingSchema },
    ]),
    ActiveDirectoryModule,
    UsersModule,
    ChatModule,
  ],
  controllers: [TicketingController],
  providers: [
    AddTicketingService,
    UpdateTicketingService,
    GetTicketFieldsService,
    PaginateTicketingService,
    GetTicketingService,
    TicketingService,
  ],
  exports: [TicketingService],
})
export class TicketingModule {}
