import assert from "node:assert/strict";

import {
  resolveToken,
  upstreamHeaders,
  upstreamUrl,
} from "../src/lib/http/upstream.ts";

assert.equal(
  upstreamUrl("http://backend:8000", ["products", "42", "docs"], "?page=2"),
  "http://backend:8000/products/42/docs?page=2",
);

assert.equal(
  upstreamUrl("http://backend:8000/", ["products"]),
  "http://backend:8000/products",
);

const forged = new Headers({
  authorization: "Bearer token-do-cliente",
  cookie: "access_token=roubado",
  "content-type": "application/json",
});
const sent = upstreamHeaders(forged, "token-do-servidor");
assert.equal(sent.get("authorization"), "Bearer token-do-servidor");
assert.equal(sent.get("cookie"), null, "cookie do cliente não pode atravessar");
assert.equal(sent.get("content-type"), "application/json");

assert.equal(upstreamHeaders(forged, null).get("authorization"), null);

const upload = new Headers({
  "content-type": "multipart/form-data; boundary=abc123",
  "content-length": "999",
});
const forwarded = upstreamHeaders(upload, null);
assert.equal(
  forwarded.get("content-type"),
  "multipart/form-data; boundary=abc123",
);
assert.equal(forwarded.get("content-length"), null);

assert.equal(
  resolveToken("do-cookie", "do-bypass", false),
  "do-cookie",
  "cookie de sessão precisa ter precedência sobre o bypass",
);

assert.equal(resolveToken(null, "do-bypass", false), "do-bypass");

assert.equal(resolveToken(null, "do-bypass", true), null);
assert.equal(resolveToken("do-cookie", "do-bypass", true), "do-cookie");

assert.equal(resolveToken(null, undefined, false), null);
assert.equal(resolveToken(null, "", false), null, "string vazia não é token");

console.log("ok — proxy do backend: 9 invariantes");
