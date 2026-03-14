const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error("Missing GOOGLE_API_KEY. Set it in .env.local first.");
  process.exit(1);
}

const url = new URL("https://generativelanguage.googleapis.com/v1beta/models");
url.searchParams.set("key", apiKey);

const res = await fetch(url);
const bodyText = await res.text();

if (!res.ok) {
  console.error(`Failed to list models: HTTP ${res.status}`);
  console.error(bodyText);
  process.exit(1);
}

const json = JSON.parse(bodyText);
const models = Array.isArray(json.models) ? json.models : [];
const names = models
  .map((m) => m?.name)
  .filter((n) => typeof n === "string")
  .sort();

if (names.length === 0) {
  console.log("No models returned.");
  process.exit(0);
}

console.log("Available models:");
for (const name of names) {
  console.log(`- ${name}`);
}

