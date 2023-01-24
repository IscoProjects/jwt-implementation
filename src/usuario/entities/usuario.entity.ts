import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id_usuario: string;

  @Column({
    type: 'text',
    unique: true,
    nullable: false,
  })
  cedula: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  nombres: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  apellidos: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  role: string;

  @Column({
    type: 'text',
    unique: true,
    nullable: false,
  })
  user: string;

  @Column({
    type: 'text',
    nullable: false,
    select: false,
  })
  password: string;
}
