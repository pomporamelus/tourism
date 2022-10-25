import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { ROLES_KEY } from "../../users/entities/role-decorator";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private jwtService: JwtService,
                private reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const needRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ])
            if(!needRoles) {
                return true
            }
            const req = context.switchToHttp().getRequest()
            const authHeader = req.headers.authorization
            const bearer =  authHeader.split(' ')[0]
            const token =  authHeader.split(' ')[1]
                if (bearer !== 'Bearer' || !token) {
                    throw new UnauthorizedException({message: 'the user do not regiter'})
                }
                const user = this.jwtService.verify(token);
                req.user = user;
                console.log(user)
                if(needRoles.includes(user.role)) {
                    return true
                }
        }  catch (e){
            console.log(e)
            throw new HttpException('you do not have acces to this', HttpStatus.FORBIDDEN)
        }
    }
}