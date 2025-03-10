import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Mood } from './mood.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'varchar', length: 64 })
  password: string;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updated_at: Date;

  @OneToMany(() => Mood, (mood) => mood.user, { cascade: true, eager: true })
  moods: Mood[];
}
