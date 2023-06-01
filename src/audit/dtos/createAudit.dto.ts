import { IsString, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';

/**
 * DTO class for Create Audit
 * @export
 * @class CreateAuditDto
 */
export class CreateAuditDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsUUID() departmentId: string;
  @IsString() @IsNotEmpty() category: string;
  @IsString() @IsOptional() assignedUserId?: string;
}
