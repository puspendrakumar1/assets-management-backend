import { IsBoolean } from 'class-validator';

/**
 * DTO class for Mark Audit Completed Status
 * @export
 * @class MarkCompletedStatusDto
 */
export class MarkCompletedStatusDto {
  @IsBoolean() isCompleted: boolean;
}
