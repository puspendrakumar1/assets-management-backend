import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/Decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/Guards/jwt-auth.guard';
import { CommonResponse } from 'src/common/interfaces';
import { IPaginatedResponse } from 'src/common/interfaces/paginate.interface';
import { IdDto } from 'src/dtos/id.dto';
import { UserDocument } from 'src/users/schemas/user.schema';
import { ChatService } from './chat.service';
import { AddTicketingChatDto } from './dto/create-ticketing-chat.dto';
import { TicketIdDto } from './dto/ticket-id.dto';
import { TicktingChatDocument } from './schema/ticketing-chat.schema';

@UseGuards(JwtAuthGuard)
@Controller('ticketing-chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(
    @Body() addTicketingChatDto: AddTicketingChatDto,
    @CurrentUser() currentUser: UserDocument,
  ): Promise<CommonResponse<TicktingChatDocument>> {
    return {
      message: 'Chat Created',
      data: await this.chatService.create(addTicketingChatDto, currentUser),
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllChats(
    @Query() params: TicketIdDto,
  ): Promise<CommonResponse<TicktingChatDocument[]>> {
    return {
      data: await this.chatService.getAllChats(params.ticketId),
    };
  }

  @Get('paginate')
  @HttpCode(HttpStatus.OK)
  async paginate(
    @Query() params: TicketIdDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<IPaginatedResponse<TicktingChatDocument>> {
    return this.chatService.paginate(params.ticketId, page, limit);
  }
}
