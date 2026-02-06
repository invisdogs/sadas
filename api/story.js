import fetch from "node-fetch";

export default async function handler(req, res) {
  const { link } = req.query;

  if (!link) {
    return res.status(400).json({ error: "Missing link parameter" });
  }

  // Prevent loops / fetching your own API
  if (link.includes("vercel.app") || link.includes("snapchat-site")) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  // Only allow Snapchat URLs
  if (!link.startsWith("https://") || !link.includes("snapchat.com")) {
    return res.status(400).json({ error: "Invalid Snapchat URL" });
  }

  try {
    const snapRes = await fetch(link, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "*/*",
      },
      redirect: "follow",
    });

    const contentType = snapRes.headers.get("content-type") || "";
    const body = contentType.includes("application/json")
      ? await snapRes.json()
      : await snapRes.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ data: body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
