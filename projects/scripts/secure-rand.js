import crypto from "node:crypto";

const secret = crypto.randomBytes(32).toString("hex"); // 32 bytes = 64 hex characters

console.log(secret);
