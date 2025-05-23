import { JwtPayload } from '@auth/interfaces';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';
import { DatabaseService } from 'src/database/database.service';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { convertToSecondsUtil } from '@common/utils';

@Injectable()
export class UserService {
  constructor(
    private readonly databaseService: DatabaseService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  async save(user: Partial<User>): Promise<User> {
    const hashedPassword = this.hashPassword(user.passwordHash!);

    console.log(user);

    const _user = await this.databaseService.user.create({
      data: {
        email: user.email!,
        phone: user.phone!,
        passwordHash: hashedPassword,
        role: user.role!,
      },
    });

    return _user;
  }

  async findAll(): Promise<User[]> {
    return this.databaseService.user.findMany();
  }

  async findOneById(id: number): Promise<User | null> {
    return this.databaseService.user.findUnique({
      where: { id },
    });
  }

  async findOne(email: string, isReset = false): Promise<User | null> {
    if (isReset) {
      await this.cacheManager.del(email);
    }

    const user = await this.cacheManager.get<User>(email);
    if (!user) {
      const user = await this.databaseService.user.findUnique({
        where: { email },
      });
      if (!user) {
        return null;
      }

      await this.cacheManager.set(
        email,
        user,
        convertToSecondsUtil(this.configService.get('JWT_EXP')),
      );
      return user;
    }
    return user;
  }

  async delete(id: number, user: JwtPayload): Promise<User> {
    if (user.id !== id && !(user.role === 'ADMIN')) {
      throw new ForbiddenException();
    }

    await Promise.all([this.cacheManager.del(user.email)]);

    return this.databaseService.user.delete({
      where: { id },
    });
  }

  async update(id: number, dto: Partial<User>): Promise<User> {
    const updatedUser = await this.databaseService.user.update({
      where: { id },
      data: {
        email: dto.email,
        phone: dto.phone,
        role: dto.role,
      },
    });

    await this.cacheManager.del(updatedUser.email);

    return updatedUser;
  }

  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(2));
  }
}
