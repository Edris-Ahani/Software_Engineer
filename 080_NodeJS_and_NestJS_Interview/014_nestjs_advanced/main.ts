/**
 * 014 — Advanced Nest features (lightweight runnable demos):
 * API versioning, CacheModule, Swagger setup, TCP microservice hybrid
 * Run: npm run 014
 */
import "reflect-metadata";
import {
  Controller,
  Get,
  Injectable,
  Module,
  Version,
  VersioningType,
  Inject,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { CacheModule, CacheInterceptor, CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from "cache-manager";
import { UseInterceptors } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import {
  ClientsModule,
  Transport,
  ClientProxy,
  MessagePattern,
} from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { title, section, step, ok, note, getJson } from "../_shared/nest-log";

@Controller()
class MathTcpController {
  @MessagePattern({ cmd: "sum" })
  sum(data: number[]) {
    return (data || []).reduce((a, b) => a + b, 0);
  }
}

@Controller({ path: "hello", version: "1" })
class HelloV1Controller {
  @Get()
  hello() {
    return { version: "1", message: "hello v1" };
  }
}

@Controller({ path: "hello", version: "2" })
class HelloV2Controller {
  @Get()
  hello() {
    return { version: "2", message: "hello v2 (newer contract)" };
  }
}

@Controller("cache-demo")
@UseInterceptors(CacheInterceptor)
class CacheDemoController {
  private hits = 0;

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  @Get()
  async value() {
    this.hits += 1;
    const cached = await this.cache.get("demo");
    return { hits: this.hits, cachedHint: cached ?? null, now: Date.now() };
  }
}

@Controller("rpc")
class RpcBridgeController {
  constructor(@Inject("MATH_SERVICE") private readonly client: ClientProxy) {}

  @Get("sum")
  async sum() {
    const result = await firstValueFrom(
      this.client.send<number>({ cmd: "sum" }, [2, 3, 5])
    );
    return { via: "TCP microservice MessagePattern", result };
  }
}

@Module({
  imports: [
    CacheModule.register({ ttl: 5, max: 100 }),
    ClientsModule.register([
      {
        name: "MATH_SERVICE",
        transport: Transport.TCP,
        options: { host: "127.0.0.1", port: 43014 },
      },
    ]),
  ],
  controllers: [
    HelloV1Controller,
    HelloV2Controller,
    CacheDemoController,
    RpcBridgeController,
    MathTcpController,
  ],
})
class AppModule {}

async function bootstrap() {
  title("014 | NestJS Advanced Features");

  // Microservice process (TCP) inside same hybrid app
  const app = await NestFactory.create(AppModule, { logger: ["error"] });
  app.enableVersioning({ type: VersioningType.URI });

  app.connectMicroservice({
    transport: Transport.TCP,
    options: { host: "127.0.0.1", port: 43014 },
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Interview Advanced Demo")
    .setDescription("Swagger wired with SwaggerModule.setup")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, document);

  await app.startAllMicroservices();
  await app.listen(0);
  const base = await app.getUrl();

  section("1) URI Versioning");
  step("v1", await getJson(`${base}/v1/hello`));
  step("v2", await getJson(`${base}/v2/hello`));

  section("2) CacheModule (interceptor caches GET responses)");
  const c1 = await getJson(`${base}/cache-demo`);
  const c2 = await getJson(`${base}/cache-demo`);
  step("first", c1.body);
  step("second (often same body while TTL alive)", c2.body);
  note("CacheInterceptor caches handler results for identical GET routes");

  section("3) Hybrid app: HTTP + TCP microservice");
  // Give TCP server a brief moment
  await new Promise((r) => setTimeout(r, 100));
  const rpc = await getJson(`${base}/rpc/sum`);
  step("HTTP bridge → TCP MessagePattern", rpc);

  section("4) Swagger document generated");
  const docs = await fetch(`${base}/docs-json`);
  step("GET /docs-json status", docs.status);
  step("openapi title", (await docs.json()).info?.title);
  note("Also available: GraphQL code-first/schema-first, WebSocket Gateways, Schedule, CQRS modules");
  ok("Versioning + Cache + Microservice hybrid + Swagger are key advanced Nest features");

  await app.close();
}

bootstrap();
