const { parentPort, workerData, threadId } = require("worker_threads");

const n = workerData.n;
let sum = 0;
for (let i = 0; i < n; i++) sum += i;

parentPort.postMessage({ threadId, n, sum });
