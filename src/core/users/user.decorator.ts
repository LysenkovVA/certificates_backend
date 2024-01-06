import {
    BadRequestException,
    createParamDecorator,
    ExecutionContext,
} from "@nestjs/common";

export const AuthUser = createParamDecorator(
    (data: any, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new BadRequestException(
                "AuthUser: Пользователь не определен!",
            );
        }
        return user;
    },
);
