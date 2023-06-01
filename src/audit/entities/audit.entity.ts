// import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
// import { BaseEntity } from '../../common/entities/commonEntity.entity';

// @Entity({ name: 'audit' })
// export class AuditEntity extends BaseEntity {
//   @Column() name: string;
//   @Column({ unique: false, type: 'nvarchar' })
//   departmentId: string;
//   @Column() category: string;
//   // @Column({ nullable: true, unique: false, type: 'nvarchar' })
//   // assignedUserId?: string;
//   @Column({ default: false }) isCompleted: boolean;
//   @Column({ nullable: true }) completedAt: Date;

//   // @OneToOne(() => Department, {
//   //   nullable: true,
//   //   createForeignKeyConstraints: false,
//   // })
//   // @JoinColumn({ name: 'departmentId' })
//   // department?: Department;
//   // @OneToOne(() => User, {
//   //   nullable: true,
//   //   createForeignKeyConstraints: false,
//   // })
//   // @JoinColumn({ name: 'assignedUserId' })
//   // assignedUser?: User;
// }
