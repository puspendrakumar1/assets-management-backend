import { Controller, Get } from '@nestjs/common';
import { SideBarService } from './side-bar.service';

@Controller('side-bar')
export class SideBarController {
  constructor(private readonly sideBarService: SideBarService) {}
  @Get('tabs')
  async getSizeBarTabs() {
    return this.sideBarService.getSizeBarTabs();
  }
}
