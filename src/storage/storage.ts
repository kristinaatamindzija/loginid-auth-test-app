const NodeCache = require("node-cache");
const cache = new NodeCache();

export function storePublicKey(publicKey: string) {
  cache.set("public_key", publicKey);
}

export function getPublicKeyFromStorage() {
  return cache.get("public_key");
}
