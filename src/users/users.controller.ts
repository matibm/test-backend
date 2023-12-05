import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async getAllUsers() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Post()
  async createUser(@Body() userData: any) {
    return await this.usersService.create(userData);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() userData: any) {
    return await this.usersService.update(id, userData);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }

  @Post('login')
  async login(@Body() body: any) {
    console.log(body);
    
    const { username, password } = body;
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      return { message: 'Credenciales inválidas' };
    }
    return this.authService.login(user);
  }
}
