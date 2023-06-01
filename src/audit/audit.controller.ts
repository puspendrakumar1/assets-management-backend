// import {
//   Body,
//   Controller,
//   Get,
//   HttpCode,
//   HttpStatus,
//   Param,
//   Post,
//   Put,
// } from '@nestjs/common';
// import { IdDto } from '../dtos/id.dto';
// import { CommonResponse } from '../common/interfaces';
// import { AuditService } from './audit.service';
// import { CreateAuditDto } from './dtos/createAudit.dto';
// import { AuditEntity } from './entities/audit.entity';
// import { AssignUserDto } from './dtos/assignUser.dto';
// import { MarkCompletedStatusDto } from './dtos/markCompletedStatus.dto';

// @Controller('audit')
// export class AuditController {
//   constructor(private readonly auditService: AuditService) {}
//   @Post()
//   @HttpCode(HttpStatus.OK)
//   async createAudit(
//     @Body() createAuditDto: CreateAuditDto,
//   ): Promise<CommonResponse> {
//     return this.auditService.createAudit(createAuditDto);
//   }

//   @Get()
//   @HttpCode(HttpStatus.OK)
//   async getDepartments(): Promise<CommonResponse<AuditEntity[]>> {
//     return this.auditService.getAudits();
//   }

//   @Put(':id/completed')
//   @HttpCode(HttpStatus.OK)
//   async markAuditCompletedStatus(
//     @Param() params: IdDto,
//     @Body()
//     markCompletedStatusDto: MarkCompletedStatusDto,
//   ): Promise<CommonResponse> {
//     await this.auditService.markAuditCompletedStatus(
//       params.id,
//       markCompletedStatusDto.isCompleted,
//     );
//     return {
//       message: 'Audit Marked',
//     };
//   }

//   @Put(':id/user/:userId')
//   @HttpCode(HttpStatus.OK)
//   async assignUser(
//     @Param() params: AssignUserDto,
//   ): Promise<CommonResponse<AuditEntity>> {
//     return this.auditService.assignUser(params.id, params.userId);
//   }
// }
