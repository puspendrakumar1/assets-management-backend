import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ScannedAssetDocument } from 'src/asset/schemas/scanned-asset.schema';
import { CurrentUser } from 'src/common/Decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/Guards/jwt-auth.guard';
import { CommonResponse } from 'src/common/interfaces';
import { IPaginatedResponse } from 'src/common/interfaces/paginate.interface';
import { IdDto } from 'src/dtos/id.dto';
import { UserDocument } from 'src/users/schemas/user.schema';
import { MoveToInPollDto } from './dto/move-to-in-poll.dto';
import { ExeAgentService } from './exe-agent.service';

@Controller('exe-agent')
export class ExeAgentController {
  constructor(private readonly exeAgentService: ExeAgentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async createScannedAsset(
    @Body() scannedAsset: any,
    @CurrentUser() currentUser: UserDocument,
  ): Promise<CommonResponse> {
    return this.exeAgentService.createScannedAsset(scannedAsset, currentUser);
  }

  @Get('paginate')
  @UseGuards(JwtAuthGuard)
  async paginate(
    @Query() query: any,
    @CurrentUser() currentUser: UserDocument,
  ): Promise<IPaginatedResponse<ScannedAssetDocument>> {
    return this.exeAgentService.paginate(query, currentUser);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteCreateScannedAssetById(
    @Param() params: IdDto,
    @CurrentUser() currentUser: UserDocument,
  ): Promise<CommonResponse> {
    return this.exeAgentService.deleteCreateScannedAssetById(
      params.id,
      currentUser,
    );
  }

  @Put('move-to-in-pull')
  @UseGuards(JwtAuthGuard)
  async moveScannedAssetToInPull(
    @Body() moveToInPollDto: MoveToInPollDto,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.exeAgentService.moveScannedAssetToInPoll(
      moveToInPollDto,
      currentUser,
    );
  }
}
