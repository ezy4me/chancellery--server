import {
  Body,
  Post,
  Get,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserResponse } from './response';
import { CurrentUser } from '@common/decorators';
import { JwtPayload } from '@auth/interfaces';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.userService.save(dto);
    return new UserResponse(user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    const userResponses = users.map((user) => new UserResponse(user));
    return userResponses;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':email')
  async findOneByEmail(@Param('email') email: string) {
    const user = await this.userService.findOne(email);
    return new UserResponse(user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOneById(@Param('id') id: number) {
    const user = await this.userService.findOneById(id);
    return new UserResponse(user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    const updatedUser = await this.userService.update(id, dto);
    return new UserResponse(updatedUser);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const deletedUser = await this.userService.delete(id, user);
    return new UserResponse(deletedUser);
  }
}
