/**
 * 013 — Dynamic modules, ConfigModule, lifecycle hooks
 * Run: npm run 013
 */
import "reflect-metadata";
import {
  Controller,
  DynamicModule,
  Get,
  Inject,
  Injectable,
  Module,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
  BeforeApplicationShutdown,
} from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { title, section, step, ok, note, getJson } from "../_shared/nest-log";

const FEATURE_OPTIONS = "FEATURE_OPTIONS";

interface FeatureOptions {
  appName: string;
  maxItems: number;
}

@Injectable()
class FeatureService
  implements
    OnModuleInit,
    OnApplicationBootstrap,
    BeforeApplicationShutdown,
    OnModuleDestroy,
    OnApplicationShutdown
{
  constructor(@Inject(FEATURE_OPTIONS) private readonly options: FeatureOptions) {}

  onModuleInit() {
    step("lifecycle", "onModuleInit");
  }
  onApplicationBootstrap() {
    step("lifecycle", "onApplicationBootstrap");
  }
  beforeApplicationShutdown(signal?: string) {
    step("lifecycle", `beforeApplicationShutdown(${signal || "n/a"})`);
  }
  onModuleDestroy() {
    step("lifecycle", "onModuleDestroy");
  }
  onApplicationShutdown(signal?: string) {
    step("lifecycle", `onApplicationShutdown(${signal || "n/a"})`);
  }

  info() {
    return this.options;
  }
}

@Module({})
class FeatureModule {
  static forRoot(options: FeatureOptions): DynamicModule {
    return {
      module: FeatureModule,
      providers: [
        { provide: FEATURE_OPTIONS, useValue: options },
        FeatureService,
      ],
      controllers: [FeatureController],
      exports: [FeatureService],
    };
  }

  static forRootAsync(): DynamicModule {
    return {
      module: FeatureModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: FEATURE_OPTIONS,
          inject: [ConfigService],
          useFactory: (config: ConfigService): FeatureOptions => ({
            appName: config.get<string>("APP_NAME") || "InterviewDemo",
            maxItems: Number(config.get("MAX_ITEMS") || 10),
          }),
        },
        FeatureService,
      ],
      controllers: [FeatureController],
      exports: [FeatureService],
    };
  }
}

@Controller("feature")
class FeatureController {
  constructor(
    private readonly feature: FeatureService,
    private readonly config: ConfigService
  ) {}

  @Get()
  get() {
    return {
      feature: this.feature.info(),
      envFromConfigService: {
        NODE_ENV: this.config.get("NODE_ENV"),
        APP_NAME: this.config.get("APP_NAME"),
      },
    };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        () => ({
          APP_NAME: process.env.APP_NAME || "NestLifecycleLab",
          MAX_ITEMS: process.env.MAX_ITEMS || "25",
          NODE_ENV: process.env.NODE_ENV || "development",
        }),
      ],
    }),
    FeatureModule.forRootAsync(),
  ],
})
class AppModule {}

async function bootstrap() {
  title("013 | Dynamic Modules, Config & Lifecycle Hooks");

  process.env.APP_NAME = process.env.APP_NAME || "NestLifecycleLab";
  process.env.MAX_ITEMS = process.env.MAX_ITEMS || "25";

  section("Boot sequence (watch lifecycle logs)");
  const app = await NestFactory.create(AppModule, { logger: ["error"] });
  await app.listen(0);
  const base = await app.getUrl();

  section("Dynamic module configured via ConfigService factory");
  const res = await getJson(`${base}/feature`);
  step("GET /feature", res.body);
  note("forRoot = sync options; forRootAsync = inject ConfigService / async sources");
  note("forFeature (in ORMs) usually registers domain entities inside feature modules");

  section("Shutdown sequence (watch lifecycle logs)");
  await app.close();
  ok("Use lifecycle hooks to connect on boot and close resources cleanly");
}

bootstrap();
