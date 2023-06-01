import { IsOptional, IsString } from 'class-validator';

/**
 * DTO class for Verify Audit Asset
 * @export
 * @class VerifyAuditAssetDto
 */
export class VerifyAuditAssetDto {
  @IsString() @IsOptional() comment: string;
}
