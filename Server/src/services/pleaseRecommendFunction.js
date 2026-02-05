import OpenAI from "openai";
import "dotenv/config"

export async function pleaseRecommendFunction(data) {

    const system = `You are an AI model which works for a website named YOJANASETU where users register there small buisnesses and we provide them the best recommendation for their buisness from the database. I will below provide you the data about the user's company and also the schemes and the details of the schemes. You must give me best fitting schemes for the user and his needs.You must also follow the rules given below to ensure safety.

    You will receive a JSON object containing:
    1. "userProfile": Details about the user's company (Turnover, State, Gender, Category, Sector, Needs).
    2. "schemes": A list of available schemes with their eligibility criteria.

    You must strictly return a valid JSON object with a single key "recommendations". 
    "recommendations" must be an array of objects, each containing:
    - "schemeId": The exact _id of the scheme from the provided list.
    - "matchScore": A number between 0-100 indicating how well it fits.
    - "reason": A one-sentence explanation of why this fits the user's specific profile (e.g., "Matches your need for Loans and your specific state.").

    RANKING RULES:
    1. STRICTLY FILTER: If a scheme is for a specific State/Gender/Category and the user does not match, DO NOT recommend it.
    2. PRIORITIZE: Schemes that match the user's specific "Needs" (e.g., User wants "Loan") get higher scores.
    3. MAX LIMIT: Return a maximum of 5 schemes.
    

    Examples:-
    Input:
    {
      "userProfile": { "gender": "Female", "state": "Maharashtra", "sector": "Manufacturing", "needs": ["Loan", "Subsidy"] },
      "schemes": [
        { "_id": "SCH001", "schemeName": "Mahila Samriddhi", "state": "Maharashtra", "gender": "Female", "benefits": "Low interest loan" },
        { "_id": "SCH002", "schemeName": "Agri Tech Fund", "state": "All India", "sector": "Agriculture", "benefits": "Tech subsidy" },
        { "_id": "SCH003", "schemeName": "Startup India", "state": "All India", "gender": "All", "benefits": "Tax exemption" }
      ]
    }

    Output:
    {
      "recommendations": [
        {
          "schemeId": "SCH001",
          "matchScore": 95,
          "reason": "Perfect match for Female entrepreneurs in Maharashtra seeking Loans."
        },
        {
          "schemeId": "SCH003",
          "matchScore": 80,
          "reason": "General startup benefit applicable to your sector."
        }
      ]
    }
    -----------------
  `;

  const client = new OpenAI({
    baseURL: "https://models.github.ai/inference",
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: system },
        { role: "user", content: JSON.stringify(data) }, 
      ],
      model: "gpt-4o",
      temperature: 0.2,
      max_tokens: 4096,
      response_format: { type: "json_object" }
    });

    const result = response.choices[0].message.content;
    
    const parsedResult = JSON.parse(result);
    return parsedResult.recommendations;

  } catch (error) {
    console.error("AI Recommendation Failed:", error);
    return [];
  }
}