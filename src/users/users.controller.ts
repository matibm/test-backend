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
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard) 
  async getAllUsers() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard) 
  async getUserById(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard) 
  async createUser(@Body() userData: any) {
    return await this.usersService.create(userData);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard) 
  async updateUser(@Param('id') id: string, @Body() userData: any) {
    return await this.usersService.update(id, userData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) 
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { password } = body;
    const user = await this.usersService.findOne({ email: body.email })
    console.log(user);
    
    const userValidate = await this.authService.validateUser(
      user,
      password,
    );
    if (!userValidate) {
      return { message: 'Credenciales inválidas' };
    }
    return this.authService.login(user, password);
  }
}
