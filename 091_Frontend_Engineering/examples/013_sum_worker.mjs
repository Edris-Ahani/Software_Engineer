self.onmessage = ({ data }) => {
  if (!Number.isSafeInteger(data.limit) || data.limit < 0 || data.limit > 10_000_000) {
    self.postMessage({ id: data.id, error: "Invalid limit" }); return;
  }
  let total = 0;
  for (let value = 1; value <= data.limit; value++) total += value;
  self.postMessage({ id: data.id, total });
};
