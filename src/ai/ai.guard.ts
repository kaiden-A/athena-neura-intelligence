import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../public.decorater';

@Injectable()
export class AIGuard implements CanActivate {

  constructor(
    private readonly prisma : PrismaService,
    private reflector : Reflector
  ){}

  async canActivate(context: ExecutionContext,
  ): Promise<boolean>  {


    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; // Skip API key check
    }

    const request = context.switchToHttp().getRequest<Request>()
    const apiKeys = request.headers['x-motionu-key'] as string;

    if(!apiKeys){
      throw new UnauthorizedException('API keys is missings');
    }

    const keyRecord = await this.prisma.apiKeys.findUnique({
      where : {
        apiKey : apiKeys
      }
    })

    if(!keyRecord){
      throw new UnauthorizedException('API keys not valid')
    }


    return true;
  }
}
