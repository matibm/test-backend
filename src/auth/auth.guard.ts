import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return false;
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });       
      request.user = decoded;
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}