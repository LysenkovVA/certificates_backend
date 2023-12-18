import { createParamDecorator, ExecutionContext } from "@nestjs/common";

// export const UserId = createParamDecorator(
//     (data: any, ctx: ExecutionContext) => {
//         const request = ctx.switchToHttp().getRequest();
//         return request.userId;
//     },
// );

export const AuthUser = createParamDecorator(
    (data: any, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
