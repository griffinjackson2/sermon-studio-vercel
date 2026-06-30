export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "No API key found in environment variables. Add ANTHROPIC_API_KEY in Vercel project settings." });
  }

  const { messages } = req.body || {};
  if (!messages) {
    return res.status(400).json({ error: "Missing messages in request body." });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: messages,
      }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      return res.status(response.status || 500).json({
        error: data.error?.message || JSON.stringify(data),
      });
    }

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: "Server error: " + err.message });
  }
}
