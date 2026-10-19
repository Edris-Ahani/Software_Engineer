/**
 * 016 — Senior feature combos:
 * Guard vs Pipe vs Interceptor, Filter vs catchError, module boundaries,
 * REQUEST scope pitfalls, dynamic module forRootAsync pattern
 * Run: npm run 016
 */
import "reflect-metadata";
import {
  CallHandler,
  Catch,
  Controller,
  DynamicModule,
  ExecutionContext,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Module,
  NestInterceptor,
  Optional,
  Scope,
  UseFilters,
  UseGuards,
  UseInterceptors,
  CanActivate,
  ExceptionFilter,
  ArgumentsHost,
  Query,
  PipeTransform,
  ArgumentMetadata,
  UsePipes,
} from "@nestjs/common";
import { NestFactory, REQUEST } from "@nestjs/core";
import type { Request, Response } from "express";
import { Observable, catchError, map, of, throwError } from "rxjs";
import { title, section, step, ok, note, warn, getJson } from "../_shared/nest-log";

const LIB_OPTIONS = "LIB_OPTIONS";

@Injectable()
class RolesGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const role = String(ctx.switchToHttp().getRequest().headers["x-role"] || "");
    return role === "admin" || role === "user";
  }
}

@Injectable()
class PositiveIntPipe implements PipeTransform {
  transform(value: any, _meta: ArgumentMetadata) {
    const n = Number(value);
    if (!Number.isInteger(n) || n <= 0) {
      throw new HttpException("id must be positive int", HttpStatus.BAD_REQUEST);
    }
    return n;
  }
}

@Injectable()
class TimingInterceptor implements NestInterceptor {
  intercept(_ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const started = Date.now();
    return next.handle().pipe(
      map((data) => ({
        ...data,
        meta: { ...(data?.meta || {}), tookMs: Date.now() - started },
      })),
      catchError((err) => {
        // Recover/transform SOME errors before they reach the filter
        if (err?.message === "recoverable") {
          return of({ recoveredBy: "interceptor-catchError", ok: true });
        }
        return throwError(() => err);
      })
    );
  }
}

@Catch(HttpException)
class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    res.status(exception.getStatus()).json({
      handledBy: "ExceptionFilter",
      message: exception.message,
      status: exception.getStatus(),
    });
  }
}

@Injectable({ scope: Scope.REQUEST })
class RequestUser {
  constructor(@Inject(REQUEST) private readonly req: Request) {}
  get name() {
    return String(this.req.headers["x-user"] || "anon");
  }
}

/**
 * Anti-pattern sketch: singleton depending on request-scoped service.
 * Nest will create a "durable" request-scoped chain or warn depending on version/setup.
 * We demonstrate the safer pattern: keep request state in REQUEST scope only.
 */
@Injectable({ scope: Scope.REQUEST })
class SafeFacade {
  constructor(private readonly user: RequestUser) {}
  who() {
    return { user: this.user.name, note: "facade is request-aware via RequestUser" };
  }
}

@Controller("combo")
@UseGuards(RolesGuard)
@UseInterceptors(TimingInterceptor)
@UseFilters(HttpErrorFilter)
class ComboController {
  constructor(private readonly facade: SafeFacade) {}

  @Get("ping")
  @UsePipes(PositiveIntPipe)
  ping(@Query("id", PositiveIntPipe) id: number) {
    return {
      id,
      who: this.facade.who(),
      responsibilities: {
        Guard: "access control",
        Pipe: "validate/transform input",
        Interceptor: "cross-cutting before/after + response shaping",
        Filter: "final HTTP error shape",
      },
    };
  }

  @Get("recover")
  recover() {
    throw new HttpException("recoverable", HttpStatus.BAD_REQUEST);
  }

  @Get("fail")
  fail() {
    throw new HttpException("hard-fail", HttpStatus.BAD_REQUEST);
  }
}

@Module({})
class InternalLibModule {
  static forRootAsync(): DynamicModule {
    return {
      module: InternalLibModule,
      providers: [
        {
          provide: LIB_OPTIONS,
          useFactory: async () => {
            // Imagine reading ConfigService / remote config here
            await new Promise((r) => setTimeout(r, 10));
            return { mode: "async-boot", ready: true };
          },
        },
      ],
      exports: [LIB_OPTIONS],
    };
  }
}

@Controller("lib")
class LibController {
  constructor(@Optional() @Inject(LIB_OPTIONS) private readonly options: any) {}
  @Get("options")
  optionsRoute() {
    return this.options;
  }
}

@Module({
  imports: [InternalLibModule.forRootAsync()],
  controllers: [ComboController, LibController],
  providers: [
    RolesGuard,
    TimingInterceptor,
    HttpErrorFilter,
    PositiveIntPipe,
    RequestUser,
    SafeFacade,
  ],
})
class AppModule {}

async function bootstrap() {
  title("016 | NestJS Senior Feature Combos");

  const app = await NestFactory.create(AppModule, { logger: ["error"] });
  await app.listen(0);
  const base = await app.getUrl();

  section("1) Guard + Pipe + Interceptor cooperation");
  const okRes = await getJson(`${base}/combo/ping?id=5`, {
    headers: { "x-role": "user", "x-user": "Ada" },
  });
  step("success", okRes);

  const badPipe = await getJson(`${base}/combo/ping?id=-1`, {
    headers: { "x-role": "user" },
  });
  step("pipe rejection", badPipe);

  const denied = await getJson(`${base}/combo/ping?id=1`, {
    headers: { "x-role": "hacker" },
  });
  step("guard denial status", denied.status);

  section("2) Interceptor catchError recovery vs Exception Filter");
  const recovered = await getJson(`${base}/combo/recover`, {
    headers: { "x-role": "user" },
  });
  step("recoverable via interceptor", recovered);

  const hard = await getJson(`${base}/combo/fail`, {
    headers: { "x-role": "user" },
  });
  step("hard fail via filter", hard);

  section("3) Configurable internal library bootstrap");
  const lib = await getJson(`${base}/lib/options`);
  step("forRootAsync options", lib.body);
  note("Export only what other modules need — keep feature modules loosely coupled");
  warn("Do not inject REQUEST-scoped providers into long-lived singletons without a deliberate pattern");
  ok("Senior Nest interviews love pipeline + scope + dynamic module design tradeoffs");

  await app.close();
}

bootstrap();
