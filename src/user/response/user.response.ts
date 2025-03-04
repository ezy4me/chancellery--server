import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsString } from 'class-validator';

export class UserResponse implements User {
  id: number;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @Exclude()
  passwordHash: string;

  @IsString()
  role: string;

  constructor(user: User | null) {
    Object.assign(this, user);
  }
}
