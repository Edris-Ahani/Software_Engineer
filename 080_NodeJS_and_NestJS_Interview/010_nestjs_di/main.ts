/**
 * 010 — NestJS DI: scopes, custom providers, tokens, Optional, forwardRef
 * Run: npm run 010
 */
import "reflect-metadata";
import {
  Controller,
  Get,
  Inject,
  Injectable,
  Module,
  Optional,
  Scope,
  forwardRef,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";
import { title, section, step, ok, note, warn, getJson } from "../_shared/nest-log";

export const APP_CONFIG = "APP_CONFIG";

@Injectable()
class SingletonCounter {
  id = Math.random().toString(36).slice(2, 7);
  hits = 0;
  bump() {
    this.hits += 1;
    return { scope: "singleton", id: this.id, hits: this.hits };
  }
}

@Injectable({ scope: Scope.TRANSIENT })
class TransientStamp {
  id = Math.random().toString(36).slice(2, 7);
  info() {
    return { scope: "transient", id: this.id };
  }
}

@Injectable({ scope: Scope.REQUEST })
class RequestContext {
  id = Math.random().toString(36).slice(2, 7);
  constructor(@Inject(REQUEST) private readonly req: Request) {}
  info() {
    return {
      scope: "request",
      id: this.id,
      path: this.req.url,
    };
  }
}

@Injectable()
class EngineService {
  name = "v8-engine";
}

/** Each consumer gets its own TRANSIENT instance. */
@Injectable()
class TransientConsumerA {
  constructor(private readonly stamp: TransientStamp) {}
  info() {
    return this.stamp.info();
  }
}

@Injectable()
class TransientConsumerB {
  constructor(private readonly stamp: TransientStamp) {}
  info() {
    return this.stamp.info();
  }
}

@Injectable({ scope: Scope.REQUEST })
class CarService {
  constructor(
    private readonly engine: EngineService,
    @Inject(APP_CONFIG) private readonly config: { brand: string },
    @Optional() private readonly missing?: { label: string },
    private readonly singleton: SingletonCounter,
    private readonly transientConsumerA: TransientConsumerA,
    private readonly transientConsumerB: TransientConsumerB,
    private readonly requestCtx: RequestContext
  ) {}

  snapshot() {
    return {
      engine: this.engine.name,
      config: this.config,
      optionalMissing: this.missing ?? null,
      singleton: this.singleton.bump(),
      transientA: this.transientConsumerA.info(),
      transientB: this.transientConsumerB.info(),
      request: this.requestCtx.info(),
    };
  }
}

// Circular providers resolved with forwardRef
// Note: avoid emitting design:paramtypes that reference the other class
// (emitDecoratorMetadata + circular class types = TDZ). Use Inject token only.
@Injectable()
class AlphaService {
  constructor(@Inject(forwardRef(() => BetaService)) private readonly beta: { name(): string }) {}
  ping() {
    return `alpha→${this.beta.name()}`;
  }
  name() {
    return "alpha";
  }
}

@Injectable()
class BetaService {
  constructor(@Inject(forwardRef(() => AlphaService)) private readonly alpha: { name(): string }) {}
  name() {
    return "beta";
  }
  ping() {
    return `beta→${this.alpha.name()}`;
  }
}

@Controller("di")
class DiController {
  constructor(
    private readonly car: CarService,
    private readonly alpha: AlphaService,
    private readonly beta: BetaService
  ) {}

  @Get("snapshot")
  snapshot() {
    return this.car.snapshot();
  }

  @Get("circular")
  circular() {
    return { alpha: this.alpha.ping(), beta: this.beta.ping() };
  }
}

@Module({
  controllers: [DiController],
  providers: [
    EngineService,
    CarService,
    SingletonCounter,
    TransientStamp,
    TransientConsumerA,
    TransientConsumerB,
    RequestContext,
    AlphaService,
    BetaService,
    { provide: APP_CONFIG, useValue: { brand: "NestMotors" } },
    // useFactory example
    {
      provide: "BOOT_TIME",
      useFactory: () => new Date().toISOString(),
    },
  ],
})
class AppModule {}

async function bootstrap() {
  title("010 | NestJS Dependency Injection");

  const app = await NestFactory.create(AppModule, { logger: ["error"] });
  await app.listen(0);
  const base = await app.getUrl();

  section("1) Custom providers: useValue / constructor injection / Optional");
  const s1 = await getJson(`${base}/di/snapshot`);
  step("first request snapshot", s1.body);

  section("2) Scopes across two HTTP requests");
  const s2 = await getJson(`${base}/di/snapshot`);
  step("second request snapshot", s2.body);
  note("singleton.id stays same & hits increments");
  note("request.id differs per HTTP request");
  note("transientA.id !== transientB.id (each consumer gets its own TRANSIENT instance)");

  section("3) forwardRef circular providers");
  const circ = await getJson(`${base}/di/circular`);
  step("circular ping", circ.body);
  ok("IoC container owns lifetimes; tokens unlock non-class injections");
  warn("Avoid REQUEST-scoped deps inside careless singletons (see demo 016)");

  await app.close();
}

bootstrap();
