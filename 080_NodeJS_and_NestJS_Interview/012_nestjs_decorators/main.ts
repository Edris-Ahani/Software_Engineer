/**
 * 012 — Decorators, ExecutionContext, Reflector, custom decorators, DTO + ValidationPipe
 * Run: npm run 012
 */
import "reflect-metadata";
import {
  Body,
  CanActivate,
  Controller,
  createParamDecorator,
  ExecutionContext,
  Get,
  Injectable,
  Module,
  Post,
  SetMetadata,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { IsEmail, IsString, MinLength } from "class-validator";
import { title, section, step, ok, note, getJson } from "../_shared/nest-log";

const ROLES_KEY = "roles";
const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.headers["x-user"] || "anonymous";
  }
);

@Injectable()
class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles =
      this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || [];

    const req = context.switchToHttp().getRequest();
    const role = String(req.headers["x-role"] || "");
    const handler = context.getHandler().name;
    const className = context.getClass().name;

    step("ExecutionContext", { type: context.getType(), className, handler, requiredRoles: roles, role });

    if (roles.length === 0) return true;
    return roles.includes(role);
  }
}

class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

@Controller("auth")
@UseGuards(RolesGuard)
class AuthController {
  @Get("me")
  me(@CurrentUser() user: string) {
    return { user, via: "createParamDecorator CurrentUser" };
  }

  @Get("admin")
  @Roles("admin")
  admin(@CurrentUser() user: string) {
    return { user, area: "admin-only" };
  }

  @Post("register")
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  )
  register(@Body() dto: RegisterDto) {
    return {
      accepted: dto,
      note: "whitelist strips unknown fields; transform yields class instance",
      isClassInstance: dto instanceof RegisterDto,
    };
  }
}

@Module({
  controllers: [AuthController],
  providers: [RolesGuard],
})
class AppModule {}

async function bootstrap() {
  title("012 | NestJS Decorators, Reflector & DTOs");

  const app = await NestFactory.create(AppModule, { logger: ["error"] });
  await app.listen(0);
  const base = await app.getUrl();

  section("1) Custom param decorator");
  const me = await getJson(`${base}/auth/me`, {
    headers: { "x-user": "Ada" },
  });
  step("GET /auth/me", me);

  section("2) Reflector reads @Roles metadata via ExecutionContext");
  const adminOk = await getJson(`${base}/auth/admin`, {
    headers: { "x-user": "Ada", "x-role": "admin" },
  });
  step("admin allowed", adminOk);

  const adminDenied = await getJson(`${base}/auth/admin`, {
    headers: { "x-user": "Bob", "x-role": "user" },
  });
  step("admin denied status", adminDenied.status);

  section("3) DTO + ValidationPipe (transform + whitelist)");
  const good = await getJson(`${base}/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      email: "ada@example.com",
      password: "secret1",
      hackerField: "should-be-stripped",
    }),
  });
  step("valid body", good);

  const bad = await getJson(`${base}/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "not-an-email", password: "123" }),
  });
  step("invalid body status", bad.status);
  step("invalid body", bad.body);

  note("@Res() without { passthrough: true } bypasses Nest automatic response handling");
  ok("Decorators + Reflector + DTO validation are core Nest expressiveness");

  await app.close();
}

bootstrap();
