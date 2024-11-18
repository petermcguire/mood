import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity()
export class Mood {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  timestamp: Date;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updatedAt: Date;

  @Column({ type: 'integer' })
  level: number;

  @ManyToOne(() => User, (user) => user.moods, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
  })
  user: User;
}
