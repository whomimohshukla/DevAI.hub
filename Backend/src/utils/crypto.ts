import crypto from "crypto";


// TODO: use a proper crypto library
export function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}


// TODO: use a proper crypto library
export function generateApiKey(): string {
  return `dak_${crypto.randomBytes(24).toString("hex")}`; // dev api key prefix
}
