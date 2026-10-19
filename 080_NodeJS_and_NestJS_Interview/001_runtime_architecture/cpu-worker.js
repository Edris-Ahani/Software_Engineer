const { parentPort, workerData } = require("worker_threads");

const loops = workerData.loops || 1e7;
let sum = 0;
for (let i = 0; i < loops; i++) sum += i;

parentPort.postMessage({ sum, loops, threadId: require("worker_threads").threadId });
