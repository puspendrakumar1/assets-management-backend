import { Controller, Get, Param, Query } from '@nestjs/common';
import { AssetAutoCompleteService } from './asset-auto-complete.service';
import { AssetAutoCompletePaginateDto } from './dto/asset-auto-complete-paginate.dto';
import { TicketingAutoCompleteService } from './ticketing-auto-complete.service';

@Controller('auto-complete')
export class AutoCompleteController {
  constructor(
    private readonly assetAutoCompleteService: AssetAutoCompleteService,
    private readonly ticketAutoCompleteService: TicketingAutoCompleteService,
  ) {}
  @Get('asset/:id')
  async getAssetAutoComplete(
    @Param() assetAutoCompletePaginateDto: AssetAutoCompletePaginateDto,
    @Query('searchText') searchText: string = '',
  ): Promise<any> {
    return {
      data: await this.assetAutoCompleteService.assetAutoComplete(
        assetAutoCompletePaginateDto.id,
        searchText,
      ),
    };
  }

  @Get('ticket/category')
  async getTicketCategoryAutoComplete(
    @Query('searchText') searchText: string = '',
  ) {
    return {
      data: await this.ticketAutoCompleteService.ticketingCategoryAutoComplete(
        searchText,
      ),
    };
  }
}
