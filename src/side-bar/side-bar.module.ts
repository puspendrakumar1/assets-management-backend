import { Module } from '@nestjs/common';
import { SideBarController } from './side-bar.controller';
import { SideBarService } from './side-bar.service';

@Module({
  controllers: [SideBarController],
  providers: [SideBarService]
})
export class SideBarModule {}
