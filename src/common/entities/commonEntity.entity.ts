// import {
//   PrimaryGeneratedColumn,
//   BeforeUpdate,
//   BeforeInsert,
//   CreateDateColumn,
//   UpdateDateColumn,
// } from 'typeorm';

// export class BaseEntity {
//   @PrimaryGeneratedColumn('uuid') id: string;
//   @CreateDateColumn() createdAt: Date;
//   @UpdateDateColumn() updatedAt: Date;

//   @BeforeInsert()
//   beforeInsert() {
//     this.createdAt = new Date();
//     this.updatedAt = new Date();
//   }

//   @BeforeUpdate()
//   beforeUpdate() {
//     this.updatedAt = new Date();
//   }
// }
