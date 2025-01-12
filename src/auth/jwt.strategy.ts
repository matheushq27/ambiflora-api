import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt"
import { Env } from "src/env";
import { z } from "zod";
import { BadRequestException, Injectable } from '@nestjs/common';
import { ZodError } from 'zod'
import { fromZodError } from "zod-validation-error";

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
    constructor(config: ConfigService<Env, true>) {
        const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: Buffer.from(publicKey, 'base64'),
            algorithms: ['RS256']
        })
    }

    async validate(payload: UserPayload) {
        try {
            return tokenPayloadSchema.parse(payload)
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