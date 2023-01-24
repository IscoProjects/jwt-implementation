import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorHandleDBService } from 'src/common/services/errorHandleDBException';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly errorHandleDBException: ErrorHandleDBService,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    try {
      const { password, ...usuarioData } = createUsuarioDto;
      const usuario = this.usuarioRepository.create({
        ...usuarioData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.usuarioRepository.save(usuario);
      return usuario;
    } catch (error) {
      this.errorHandleDBException.errorHandleDBException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this.usuarioRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(term: string) {
    let user: Usuario;

    if (isUUID(term)) {
      user = await this.usuarioRepository.findOne({
        where: {
          id_usuario: term,
        },
      });
    } else {
      const queryBuilder = this.usuarioRepository.createQueryBuilder('user');
      user = await queryBuilder
        .leftJoinAndSelect('user.agendamiento', 'agendamiento')
        .where('us_cedula=:us_cedula', {
          us_cedula: term,
        })
        .getOne();
    }

    if (!user)
      throw new NotFoundException(`Usuario con ID: ${term} no encontrado`);
    return user;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const user = await this.usuarioRepository.preload({
      id_usuario: id,
      ...updateUsuarioDto,
    });
    if (!user)
      throw new NotFoundException(`Usuario con ID: ${id} no encontrado`);
    try {
      await this.usuarioRepository.save(user);
      return user;
    } catch (error) {
      this.errorHandleDBException.errorHandleDBException(error);
    }
  }

  async remove(id: string) {
    const deleteUsuario = await this.findOne(id);
    await this.usuarioRepository.remove(deleteUsuario);
  }
}
