import { Module } from '@nestjs/common';
import { AllocationFormService } from './allocation-form.service';
import { AllocationFormController } from './allocation-form.controller';

@Module({
  providers: [AllocationFormService],
  controllers: [AllocationFormController]
})
export class AllocationFormModule {}
