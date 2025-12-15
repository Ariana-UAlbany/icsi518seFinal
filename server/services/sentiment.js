export async function analyzeSentiment(text) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    }
  );

  const data = await response.json();

  if (!Array.isArray(data) || !Array.isArray(data[0])) {
    return { label: "UNKNOWN", score: 0 };
  }

  return {
    label: data[0][0].label,  // POSITIVE / NEGATIVE
    score: data[0][0].score,
  };
}