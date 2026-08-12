import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt"
import { Env } from '@/common/env';
import { z } from "zod";
import { BadRequestException, Injectable } from '@nestjs/common';
import { ZodError } from 'zod'
import { fromZodError } from "zod-validation-error";
import { ClsService } from 'nestjs-cls';
import type { AppClsStore } from '@/application/services/user-cache.service';

const tokenPayloadSchema = z.object({
    user: z.object({
        id: z.number(),
        name: z.string(),
        surname: z.string(),
        email: z.string(),
        userType: z.enum(['SUPER_ADMIN', 'DEVELOPER', 'ADMIN', 'USER']),
        companyId: z.number(),
    })
})

export type UserPayload = z.infer<typeof tokenPayloadSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        config: ConfigService<Env, true>,
        private readonly cls: ClsService<AppClsStore>,
    ) {
        const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: Buffer.from(publicKey, 'base64').toString(),
            algorithms: ['RS256']
        })
    }

    async validate(payload: UserPayload) {
        try {
            const parsed = tokenPayloadSchema.parse(payload)
            
            // Grava a sessão em nível de requisição usando o CLS (Continuation Local Storage)
            this.cls.set('user', {
              userId: parsed.user.id,
              companyId: parsed.user.companyId,
            });

            return parsed;
        } catch (error) {
            if (error instanceof ZodError) {
                throw new BadRequestException({
                    message: 'Token Inválido',
                    statusCode: 400,
                    errors: fromZodError(error),
                })
            }
        }
    }
}