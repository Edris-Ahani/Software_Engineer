/**
 * 005 — Streams, backpressure, Buffer
 * Run: npm run 005
 */
const fs = require("fs");
const path = require("path");
const { Readable, Transform, pipeline } = require("stream");
const { promisify } = require("util");
const { title, section, step, note, ok, warn } = require("../_shared/logger");

const pipelineAsync = promisify(pipeline);
const sampleFile = path.join(__dirname, "sample.txt");

title("005 | Streams, Backpressure & Buffer");

async function main() {
  fs.writeFileSync(
    sampleFile,
    "line-1 hello\nline-2 nestjs\nline-3 nodejs\nline-4 streams\n"
  );

  section("1) readFile vs createReadStream");
  const whole = await fs.promises.readFile(sampleFile);
  step("readFile bytes in memory at once", whole.length);

  let chunks = 0;
  let streamed = 0;
  await new Promise((resolve, reject) => {
    const rs = fs.createReadStream(sampleFile, { highWaterMark: 8 });
    rs.on("data", (chunk) => {
      chunks += 1;
      streamed += chunk.length;
      step(`chunk #${chunks}`, `"${chunk.toString()}" (${chunk.length} bytes)`);
    });
    rs.on("end", resolve);
    rs.on("error", reject);
  });
  step("total streamed bytes", streamed);
  ok("Stream processes incrementally — better for large files");

  section("2) Transform stream pipeline");
  const upper = new Transform({
    transform(chunk, _enc, cb) {
      cb(null, chunk.toString().toUpperCase());
    },
  });
  let out = "";
  await pipelineAsync(
    fs.createReadStream(sampleFile),
    upper,
    new WritableCollector((s) => {
      out += s;
    })
  );
  step("pipeline output", out.trim());

  section("3) Backpressure demo (fast producer, slow consumer)");
  let writes = 0;
  let pausedHints = 0;
  const slow = new (require("stream").Writable)({
    highWaterMark: 4,
    write(chunk, _enc, cb) {
      writes += 1;
      setTimeout(cb, 15); // slow consumer
    },
  });

  const fast = Readable.from(
    (async function* () {
      for (let i = 0; i < 12; i++) {
        yield Buffer.from(`x${i}-`);
      }
    })()
  );

  fast.on("data", (chunk) => {
    const okWrite = slow.write(chunk);
    if (!okWrite) {
      pausedHints += 1;
      fast.pause();
      slow.once("drain", () => fast.resume());
    }
  });

  await new Promise((resolve) => {
    fast.on("end", () => slow.end());
    slow.on("finish", resolve);
  });
  step("chunks written", writes);
  step("times producer paused (backpressure)", pausedHints);
  note("When write() returns false, pause until 'drain'");

  section("4) Buffer basics");
  const buf = Buffer.from("Node.js", "utf8");
  step("Buffer.from('Node.js')", buf);
  step("buf.toString()", buf.toString("utf8"));
  step("buf.length (bytes)", buf.length);
  step("buf[0] (first byte)", buf[0]);

  const alloc = Buffer.alloc(8); // zero-filled (safe)
  step("Buffer.alloc(8) zero-filled", alloc);
  warn("Prefer Buffer.alloc / Buffer.from — avoid unsafe patterns in real apps");

  ok("Streams + Buffers = efficient binary & large-data I/O in Node");
}

function WritableCollector(onChunk) {
  const { Writable } = require("stream");
  return new Writable({
    write(chunk, _enc, cb) {
      onChunk(chunk.toString());
      cb();
    },
  });
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
