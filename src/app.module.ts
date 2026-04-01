import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { ProfileInterceptor } from './interceptors/profile.interceptor';
import { ResponseInterceptor } from './interceptors/response.interceptor';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env'
        }),
        UserModule,
        AuthModule,
        BookModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: "postgres",
                host: config.get<string>('DB_HOST'),
                port: config.get<number>('DB_PORT'),
                username: config.get<string>('DB_USERNAME'),
                password: config.get<string>('DB_PASSWORD'),
                database: config.get<string>('DB_NAME'),
                autoLoadEntities: true,
                synchronize: true
            })
        })
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ProfileInterceptor
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor
        }
    ]
})
export class AppModule { }
