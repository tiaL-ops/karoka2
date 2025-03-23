const functions = require("firebase-functions");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: functions.config().openai.key,
});
const openai = new OpenAIApi(configuration);

exports.generateKarokaProfile = functions.https.onRequest(async (req, res) => {
  const { top3 } = req.body;

  const formatTop = top3.map(t => `${t.type}: ${t.percent}%`).join(", ");

  const prompt = `
You are Karoka, a motivational personality system for learners inspired by anime. 
Given these top 3 types:
${formatTop}

Return:
1. Their dominant type (name, % and short description)
2. Their top 3 types with scores
3. A personality-based interpretation combining all 3
4. A one-line affirmation to motivate them.
Use fun, clear, learner-friendly language.
`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }]
    });

    res.send({ result: completion.data.choices[0].message.content });
  } catch (error) {
    console.error("GPT error:", error);
    res.status(500).send("GPT failed");
  }
});
