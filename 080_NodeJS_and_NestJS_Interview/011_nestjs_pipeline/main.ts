/**
 * 011 — Request pipeline order:
 * Middleware → Guard → Interceptor(pre) → Pipe → Handler → Interceptor(post) → Filter
 * Run: npm run 011
 */
import "reflect-metadata";
import {
  ArgumentMetadata,
  Body,
  CallHandler,
  Catch,
  Controller,
  ExecutionContext,
  Get,
  HttpException,
  HttpStatus,
  Injectable,
  MiddlewareConsumer,
  Module,
  NestInterceptor,
  NestMiddleware,
  NestModule,
  PipeTransform,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  CanActivate,
  ExceptionFilter,
  ArgumentsHost,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Request, Response, NextFunction } from "express";
import { Observable, tap } from "rxjs";
import { IsInt, Min } from "class-validator";
import { Type } from "class-transformer";
import { title, section, step, ok, note, getJson } from "../_shared/nest-log";

const trace: string[] = [];
function mark(label: string) {
  trace.push(label);
  console.log(`  → ${label}`);
}

@Injectable()
class TraceMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    mark("1 Middleware");
    next();
  }
}

@Injectable()
class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    mark("2 Guard");
    const req = context.switchToHttp().getRequest<Request>();
    if (req.headers["x-role"] === "blocked") {
      throw new HttpException("Forbidden by Guard", HttpStatus.FORBIDDEN);
    }
    return true;
  }
}

@Injectable()
class TimingInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    mark("3 Interceptor BEFORE");
    const started = Date.now();
    return next.handle().pipe(
      tap(() => {
        mark(`6 Interceptor AFTER (+${Date.now() - started}ms)`);
      })
    );
  }
}

@Injectable()
class ParseAgePipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata) {
    mark("4 Pipe");
    const n = Number(value?.age);
    if (Number.isNaN(n)) {
      throw new HttpException("age must be a number", HttpStatus.BAD_REQUEST);
    }
    return { ...value, age: n };
  }
}

@Catch()
class DemoFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    mark("7 Exception Filter");
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.message
        : "Internal error";
    res.status(status).json({
      handledBy: "DemoFilter",
      status,
      message,
      pipelineTrace: [...trace],
    });
  }
}

class CreateUserDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  age!: number;
}

@Controller()
@UseGuards(AuthGuard)
@UseInterceptors(TimingInterceptor)
@UseFilters(DemoFilter)
class DemoController {
  @Get("ping")
  ping() {
    mark("5 Controller/Handler");
    return { ok: true, pipelineTrace: [...trace] };
  }

  @Post("users")
  @UsePipes(ParseAgePipe)
  create(@Body() body: CreateUserDto) {
    mark("5 Controller/Handler");
    return { created: body, pipelineTrace: [...trace] };
  }

  @Get("fail")
  fail() {
    mark("5 Controller/Handler");
    throw new HttpException("boom", HttpStatus.BAD_REQUEST);
  }
}

@Module({
  controllers: [DemoController],
  providers: [AuthGuard, TimingInterceptor, ParseAgePipe, DemoFilter],
})
class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TraceMiddleware).forRoutes("*");
  }
}

async function bootstrap() {
  title("011 | NestJS Request Pipeline");

  const app = await NestFactory.create(AppModule, { logger: ["error"] });
  await app.listen(0);
  const base = await app.getUrl();

  section("A) Happy path order");
  trace.length = 0;
  const ping = await getJson(`${base}/ping`);
  step("response", ping.body);
  step("order", (ping.body.pipelineTrace || trace).join(" → "));

  section("B) Pipe runs before handler on POST body");
  trace.length = 0;
  const created = await getJson(`${base}/users`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ age: "21" }),
  });
  step("response", created.body);

  section("C) Filter shapes errors");
  trace.length = 0;
  const fail = await getJson(`${base}/fail`);
  step("error response", fail.body);

  section("D) Guard can short-circuit");
  trace.length = 0;
  const blocked = await getJson(`${base}/ping`, {
    headers: { "x-role": "blocked" },
  });
  step("blocked", blocked);

  note("Full success path: Middleware → Guard → Interceptor(pre) → Pipe → Handler → Interceptor(post)");
  ok("On errors, Exception Filter formats the final HTTP response");

  await app.close();
}

bootstrap();
