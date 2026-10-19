/**
 * 009 — NestJS core: Module / Controller / Service / exports
 * Run: npm run 009
 */
import "reflect-metadata";
import { Controller, Get, Injectable, Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { title, section, step, ok, note, getJson } from "../_shared/nest-log";

@Injectable()
class UsersService {
  private users = [
    { id: 1, name: "Ada" },
    { id: 2, name: "Linus" },
  ];

  findAll() {
    return this.users;
  }
}

@Controller("users")
class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  list() {
    // Thin controller: delegates business logic to the service
    return {
      layer: "controller",
      data: this.usersService.findAll(),
    };
  }
}

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // only exported providers are visible to other modules
})
class UsersModule {}

@Injectable()
class ReportService {
  constructor(private readonly usersService: UsersService) {}

  summary() {
    return {
      layer: "report-service",
      userCount: this.usersService.findAll().length,
      note: "ReportModule imported UsersModule and received exported UsersService",
    };
  }
}

@Controller("reports")
class ReportsController {
  constructor(private readonly reportService: ReportService) {}

  @Get("summary")
  summary() {
    return this.reportService.summary();
  }
}

@Module({
  imports: [UsersModule],
  providers: [ReportService],
  controllers: [ReportsController],
})
class ReportsModule {}

@Module({
  imports: [UsersModule, ReportsModule],
})
class AppModule {}

async function bootstrap() {
  title("009 | NestJS Core Architecture");

  const app = await NestFactory.create(AppModule, { logger: ["error"] });
  await app.listen(0);
  const base = await app.getUrl();

  section("1) NestFactory.create boots DI graph + HTTP adapter");
  step("base URL", base);
  note("Root module imports feature modules; providers are wired by the IoC container");

  section("2) Controller → Service separation");
  const users = await getJson(`${base}/users`);
  step("GET /users", users);

  section("3) Module exports enable cross-module injection");
  const report = await getJson(`${base}/reports/summary`);
  step("GET /reports/summary", report);
  ok("Module / Controller / Provider(+exports) are the core Nest building blocks");

  await app.close();
}

bootstrap();
