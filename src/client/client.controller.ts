import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { IdDto } from '../dtos/id.dto';
import { CommonResponse } from '../common/interfaces';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/createClient.dto';
import { ClientDocument } from './schemas/client.schema';
import { JwtAuthGuard } from 'src/common/Guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/Guards/roles.guards';
// import { Roles } from 'src/common/Decorators/role.decorator';
// import { UserRole } from 'src/common/Enums';
import { IPaginatedResponse } from 'src/common/interfaces/paginate.interface';
import { CurrentUser } from 'src/common/Decorators/current-user.decorator';
import { UserDocument } from 'src/users/schemas/user.schema';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  async createClient(
    @Body() createClientDto: CreateClientDto,
    @CurrentUser() currentUser: UserDocument,
  ): Promise<CommonResponse> {
    return this.clientService.createClient(createClientDto, currentUser);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getClients(): Promise<CommonResponse<ClientDocument[]>> {
    return this.clientService.getClients();
  }

  @Get('paginate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.LEVEL1, UserRole.LEVEL2)
  async paginate(
    @Query() query: any,
  ): Promise<IPaginatedResponse<ClientDocument>> {
    return this.clientService.paginate(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getClientById(
    @Param() params: IdDto,
  ): Promise<CommonResponse<ClientDocument>> {
    return {
      data: await this.clientService.getClientById(params.id),
    };
  }
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateClientById(
    @Param() params: IdDto,
    @Body() updateClientByIdDto: CreateClientDto,
  ): Promise<CommonResponse<ClientDocument>> {
    return {
      message: 'Client Updated Successfully',
      data: await this.clientService.updateClientById(
        params.id,
        updateClientByIdDto,
      ),
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteClient(
    @Param() params: IdDto,
  ): Promise<CommonResponse<ClientDocument>> {
    return {
      message: 'Client Delelted Successfully',
      data: await this.clientService.deleteClient(params.id),
    };
  }
}
