/** 019 — Real HTTP validation, serialization, and REQUEST scope bubbling.
 * Run: npm run 019. Questions: 136–140, 149, 212, 214.
 */
import "reflect-metadata";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import {
  Body, ClassSerializerInterceptor, Controller, Get, Injectable, Module,
  ParseBoolPipe, ParseIntPipe, Post, Query, Scope, ValidationPipe,
} from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { Exclude } from "class-transformer";
import { IsEmail, IsString, Length } from "class-validator";
import { title, section, step, ok, getJson } from "../_shared/nest-log";

class CreateUserDto {
  @IsString()
  @Length(2, 40)
  name!: string;

  @IsEmail()
  email!: string;
}

class UserView {
  constructor(public name: string, public email: string) {}

  @Exclude()
  internalSecret = "must-never-appear-in-json";
}

@Injectable()
class SharedStamp {
  readonly id = randomUUID();
}

@Injectable({ scope: Scope.REQUEST })
class RequestStamp {
  readonly id = randomUUID();
}

// Default scope deliberately demonstrates REQUEST bubbling through dependency injection.
@Injectable()
class RequestFacade {
  readonly id = randomUUID();
  constructor(readonly stamp: RequestStamp, readonly shared: SharedStamp) {}
}

@Controller("contracts")
class ContractsController {
  constructor(private readonly facade: RequestFacade, private readonly stamp: RequestStamp) {}

  @Post("users")
  create(@Body() dto: CreateUserDto): UserView {
    return new UserView(dto.name, dto.email);
  }

  @Get("query")
  // unknown emits Object metadata, preventing the earlier global ValidationPipe from
  // coercing primitive input before these strict parameter pipes get to inspect it.
  query(@Query("enabled", ParseBoolPipe) enabled: unknown, @Query("page", ParseIntPipe) page: unknown) {
    return { enabled, page };
  }

  @Get("scope")
  scope() {
    return {
      request: this.stamp.id,
      viaFacade: this.facade.stamp.id,
      facade: this.facade.id,
      singleton: this.facade.shared.id,
    };
  }
}

@Module({ controllers: [ContractsController], providers: [SharedStamp, RequestStamp, RequestFacade] })
class AppModule {}

async function main(): Promise<void> {
  title("019 | Validation, serialization, and effective request scope");
  const app = await NestFactory.create(AppModule, { logger: ["error"] });
  try {
    app.useGlobalPipes(new ValidationPipe({
      transform: true, whitelist: true, forbidNonWhitelisted: true,
    }));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    await app.listen(0, "127.0.0.1");
    const base = await app.getUrl();
    const post = (body: unknown) => getJson(`${base}/contracts/users`, {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body),
    });

    section("1) Valid input; sensitive output property is excluded");
    const valid = await post({ name: "Ada", email: "ada@example.com" });
    assert.equal(valid.status, 201);
    assert.deepEqual(valid.body, { name: "Ada", email: "ada@example.com" });
    step("POST valid", valid);

    section("2) Invalid email, unknown property, and explicit primitive parsing");
    assert.equal((await post({ name: "Ada", email: "not-an-email" })).status, 400);
    assert.equal((await post({ name: "Ada", email: "ada@example.com", isAdmin: true })).status, 400);
    const query = await getJson(`${base}/contracts/query?enabled=false&page=2`);
    assert.equal(query.status, 200);
    assert.deepEqual(query.body, { enabled: false, page: 2 });
    assert.equal((await getJson(`${base}/contracts/query?enabled=maybe&page=2`)).status, 400);
    assert.equal((await getJson(`${base}/contracts/query?enabled=false&page=no`)).status, 400);
    step("explicit query types", query.body);

    section("3) Same request shares identity; next request gets a new facade");
    const first = await getJson(`${base}/contracts/scope`);
    const second = await getJson(`${base}/contracts/scope`);
    assert.equal(first.status, 200);
    assert.equal(second.status, 200);
    assert.equal(first.body.request, first.body.viaFacade);
    assert.equal(second.body.request, second.body.viaFacade);
    assert.notEqual(first.body.request, second.body.request);
    assert.notEqual(first.body.facade, second.body.facade);
    assert.equal(first.body.singleton, second.body.singleton);
    step("request one", first.body);
    step("request two", second.body);
    ok("HTTP contracts and scope bubbling verified");
  } finally {
    await app.close();
  }
}

main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
