import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule , ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth.guard';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [
        PrismaModule,
        ConfigModule.forRoot({isGlobal : true}),
        JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                global : true,
                secret: config.getOrThrow('JWT_SECRET'),
                signOptions: { expiresIn: '1d' },
            }),
        })
    ],
    providers: [AuthGuard],
    exports : [AuthGuard , JwtModule]
})
export class AuthModule {}
