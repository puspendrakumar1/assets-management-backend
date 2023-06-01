// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { CommonResponse } from '../common/interfaces';
// import { Repository } from 'typeorm';
// import { CreateAuditDto } from './dtos/createAudit.dto';
// import { AuditEntity } from './entities/audit.entity';
// import { ErrorCode } from '../common/ErrorCodes';
// import { UsersService } from '../users/users.service';
// import { AuditAssetsService } from './audit-assets.service';

// @Injectable()
// export class AuditService {
//   // constructor(
//   //   @InjectRepository(AuditEntity)
//   //   private readonly auditRepository: Repository<AuditEntity>,
//   //   private readonly userService: UsersService,
//   //   private readonly auditAssetsService: AuditAssetsService,
//   // ) {}

//   // async createAudit(createAuditDto: CreateAuditDto): Promise<CommonResponse> {
//   //   const audit = this.auditRepository.create({
//   //     ...createAuditDto,
//   //   });

//   //   await this.auditRepository.save(audit);
//   //   await this.auditAssetsService.generateAuditAssets(audit);
//   //   return { message: 'Audit Created Successfully', data: audit };
//   // }

//   // async getAudits(): Promise<CommonResponse<AuditEntity[]>> {
//   //   const audits = await this.auditRepository.find({
//   //     relations: ['department', 'assignedUser'],
//   //   });
//   //   return {
//   //     data: audits.map((audit) => this.removePasswordFromUser(audit)),
//   //   };
//   // }
//   // async getAuditById(id: string): Promise<AuditEntity> {
//   //   return this.auditRepository.findOne({
//   //     where: { id },
//   //     relations: ['department', 'assignedUser'],
//   //   });
//   // }
//   // removePasswordFromUser(audit: AuditEntity) {
//   //   if (audit && audit.assignedUser) {
//   //     delete audit.assignedUser.password;
//   //   }
//   //   return audit;
//   // }
//   // async assignUser(
//   //   id: string,
//   //   userId: string,
//   // ): Promise<CommonResponse<AuditEntity>> {
//   //   const audit = await this.getAuditById(id);
//   //   if (!audit) {
//   //     throw new NotFoundException('Audit Not Found', ErrorCode.AUDIT_NOT_FOUND);
//   //   }
//   //   const user = await this.userService.findById(userId);
//   //   if (!user) {
//   //     throw new NotFoundException('user Not Found', ErrorCode.USER_NOT_FOUND);
//   //   }

//   //   await this.auditRepository.update(
//   //     {
//   //       id,
//   //     },
//   //     {
//   //       assignedUserId: userId,
//   //     },
//   //   );

//   //   return {
//   //     message: 'User Assigned',
//   //   };
//   // }

//   // async markAuditCompletedStatus(id: string, isCompleted: boolean) {
//   //   const audit = await this.getAuditById(id);
//   //   if (!audit) {
//   //     throw new NotFoundException('Audit not Found', ErrorCode.AUDIT_NOT_FOUND);
//   //   }
//   //   const updateData = { isCompleted };
//   //   if (isCompleted) {
//   //     Object.assign(updateData, {
//   //       completedAt: new Date(),
//   //     });
//   //   }

//   //   await this.auditRepository.update({ id }, updateData);
//   // }
// }
