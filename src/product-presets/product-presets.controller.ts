import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/Decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/Guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/Guards/roles.guards';
import { CommonResponse } from 'src/common/interfaces';
import { IPaginatedResponse } from 'src/common/interfaces/paginate.interface';
import { IdDto } from 'src/dtos/id.dto';
import { AddProductPresetsDto } from './dtos/product-presents.dto';
import { ProductPresetsService } from './product-presets.service';
import { ProductPresetsDocument } from './schemas/product-presets.schema';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('product-presets')
export class ProductPresetsController {
  constructor(private readonly productPresentsService: ProductPresetsService) {}

  @Post()
  //   @Roles(UserRole.LEVEL1, UserRole.LEVEL2)
  @HttpCode(HttpStatus.OK)
  async create(
    @Body() addProductPresetsDto: AddProductPresetsDto,
    @CurrentUser() currentUser: any,
  ): Promise<CommonResponse> {
    return this.productPresentsService.create(
      addProductPresetsDto,
      currentUser,
    );
  }

  @Get('paginate')
  //   @Roles(UserRole.LEVEL1, UserRole.LEVEL2)
  async paginate(
    @Query() query: any,
  ): Promise<IPaginatedResponse<ProductPresetsDocument>> {
    return this.productPresentsService.paginate(query);
  }

  @Get('suggetions')
  async getSuggetions(
    @Query() params: any,
  ): Promise<CommonResponse<ProductPresetsDocument[]>> {
    return {
      data: await this.productPresentsService.getSuggetions(params),
    };
  }

  @Get(':id')
  // @Roles(UserRole.LEVEL1, UserRole.LEVEL2, UserRole.LEVEL3)
  async getById(
    @Param() params: IdDto,
  ): Promise<CommonResponse<ProductPresetsDocument>> {
    return {
      data: await this.productPresentsService.getById(params.id),
    };
  }
}
