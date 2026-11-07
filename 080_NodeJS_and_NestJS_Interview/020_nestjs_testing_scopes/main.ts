/** 020 — Asserted provider substitution, failure propagation, and scoped resolution.
 * Run: npm run 020. Questions: 146, 195–199, 214–215. No HTTP server or real database.
 */
import "reflect-metadata";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { Inject, Injectable, Scope } from "@nestjs/common";
import { ContextIdFactory, REQUEST } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import { title, section, step, ok } from "../_shared/nest-log";

interface User { id: number; name: string }
const USERS = Symbol("USERS");
interface UsersPort { find(id: number): Promise<User> }

@Injectable()
class UsersService {
  constructor(@Inject(USERS) private readonly users: UsersPort) {}
  find(id: number): Promise<User> { return this.users.find(id); }
}

@Injectable()
class SharedResource {
  readonly id = randomUUID();
}

@Injectable({ scope: Scope.REQUEST })
class RequestIdentity {
  readonly id = randomUUID();
  constructor(@Inject(REQUEST) readonly request: { requestId: string }) {}
}

@Injectable()
class ContextConsumer {
  constructor(readonly identity: RequestIdentity, readonly shared: SharedResource) {}
}

async function main(): Promise<void> {
  title("020 | Meaningful assertions with TestingModule and scoped contexts");
  const moduleRef = await Test.createTestingModule({
    providers: [
      UsersService, SharedResource, RequestIdentity, ContextConsumer,
      { provide: USERS, useValue: { find: async () => { throw new Error("real provider must be overridden"); } } },
    ],
  }).overrideProvider(USERS).useValue({
    find: async (id: number): Promise<User> => {
      if (id === 404) throw new Error("fake persistence unavailable");
      return { id, name: "FAKE-USER" };
    },
  } satisfies UsersPort).compile();

  try {
    section("1) Override by exact token and verify both success and failure");
    const service = moduleRef.get(UsersService);
    assert.deepEqual(await service.find(7), { id: 7, name: "FAKE-USER" });
    await assert.rejects(service.find(404), /fake persistence unavailable/);
    step("substituted result", await service.find(7));

    section("2) Explicit contexts share scoped providers only within that context");
    const contextA = ContextIdFactory.create();
    const contextB = ContextIdFactory.create();
    moduleRef.registerRequestByContextId({ requestId: "A" }, contextA);
    moduleRef.registerRequestByContextId({ requestId: "B" }, contextB);
    const first = await moduleRef.resolve(ContextConsumer, contextA);
    const same = await moduleRef.resolve(ContextConsumer, contextA);
    const other = await moduleRef.resolve(ContextConsumer, contextB);
    assert.strictEqual(first, same);
    assert.notStrictEqual(first, other);
    assert.notStrictEqual(first.identity, other.identity);
    assert.strictEqual(first.shared, other.shared);
    assert.equal(first.identity.request.requestId, "A");
    assert.equal(other.identity.request.requestId, "B");
    step("scoped IDs", [first.identity.id, other.identity.id]);
    step("shared singleton", first.shared.id);
    ok("Substitution, rejection propagation, REQUEST injection, and scope identity verified");
  } finally {
    await moduleRef.close();
  }
}

main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
