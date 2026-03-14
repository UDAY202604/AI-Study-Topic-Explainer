const baseUrl = process.env.SMOKE_BASE_URL || "http://localhost:3000";

async function post(topic) {
  const res = await fetch(`${baseUrl}/api/explain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic }),
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }

  return { status: res.status, json };
}

async function get(pathname) {
  const res = await fetch(`${baseUrl}${pathname}`);
  await res.arrayBuffer();
  return { status: res.status };
}

const cases = ["", "Photosynthesis"];

for (const topic of cases) {
  console.log("\nTopic:", JSON.stringify(topic));
  console.log(await post(topic));
}

console.log("\nGET /@vite/client");
console.log(await get("/@vite/client"));
