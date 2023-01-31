import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Usuario } from '../entities/usuario.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: IJwtPayload): Promise<Usuario> {
    const { id_usuario } = payload;

    const user = await this.usuarioRepository.findOneBy({ id_usuario });

    if (!user) {
      throw new UnauthorizedException('Token not valid');
    }
    return user;
  }
}
