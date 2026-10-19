/**
 * 015 — TestingModule: unit-style overrideProvider + lightweight e2e request
 * Run: npm run 015
 */
import "reflect-metadata";
import { Controller, Get, Injectable, Module } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { NestFactory } from "@nestjs/core";
import { title, section, step, ok, note, getJson } from "../_shared/nest-log";

@Injectable()
class UsersRepository {
  findAll() {
    return [{ id: 1, name: "REAL-DB-USER" }];
  }
}

@Injectable()
class UsersService {
  constructor(private readonly repo: UsersRepository) {}
  list() {
    return this.repo.findAll();
  }
}

@Controller("users")
class UsersController {
  constructor(private readonly users: UsersService) {}
  @Get()
  list() {
    return this.users.list();
  }
}

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
class UsersModule {}

async function unitStyleTest() {
  section("1) Unit-style TestingModule with overrideProvider");

  const moduleRef = await Test.createTestingModule({
    providers: [UsersService, UsersRepository],
  })
    .overrideProvider(UsersRepository)
    .useValue({
      findAll: () => [{ id: 99, name: "MOCK-USER" }],
    })
    .compile();

  const service = moduleRef.get(UsersService);
  const result = service.list();
  step("UsersService.list() with mocked repo", result);
  ok("DI makes collaborator replacement trivial in tests");
  await moduleRef.close();
}

async function e2eStyleTest() {
  section("2) Lightweight e2e: boot app + real HTTP call");

  const moduleRef = await Test.createTestingModule({
    imports: [UsersModule],
  })
    .overrideProvider(UsersRepository)
    .useValue({
      findAll: () => [{ id: 7, name: "E2E-MOCK" }],
    })
    .compile();

  const app = moduleRef.createNestApplication();
  await app.init();
  await app.listen(0);
  const base = await app.getUrl();

  const res = await getJson(`${base}/users`);
  step("GET /users (e2e with mock repo)", res);
  note("Unit test = class + mocks; e2e = HTTP against nearly-full app");
  ok("Nest TestingModule supports both styles cleanly");

  await app.close();
}

async function main() {
  title("015 | NestJS TestingModule");
  await unitStyleTest();
  await e2eStyleTest();
}

main();
