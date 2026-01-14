const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL || 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = import.meta.env.VITE_AI_MODEL || 'llama-3.3-70b-versatile';

async function callAI(messages, jsonMode = false) {
    if (!API_KEY) throw new Error("Missing API Key");

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL,
                messages: messages,
                temperature: 0.7,
                response_format: jsonMode ? { type: "json_object" } : undefined
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error Details:", response.status, response.statusText, errorText);
            throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        console.log("AI API Response:", data); // Debug log to see structure
        return data.choices[0].message.content;
    } catch (error) {
        console.error("AI Service Error:", error);
        throw error;
    }
}

export const aiService = {
    // Generate Quiz Questions
    async generateQuiz({ className, subject, topic, difficulty }) {
        const prompt = `
      Create a quiz for a Class ${className} student.
      Subject: ${subject}
      Topic: ${topic}
      Difficulty: ${difficulty}
      
      Generate 5 distinct multiple-choice questions.
      Return ONLY a VALID JSON object with a "questions" key containing an array.
      Structure:
      {
        "questions": [
          {
            "question": "Question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0, // Index of correct option (0-3)
            "explanation": "Brief explanation"
          }
        ]
      }
    `;

        const response = await callAI([{ role: "user", content: prompt }], true);

        // Parse JSON safely
        try {
            const json = JSON.parse(response);
            return json.questions || json; // Handle both wrapped and unwrapped array if model deviates
        } catch (e) {
            // Fallback cleanup if the model returns markdown code blocks
            const clean = response.replace(/```json/g, '').replace(/```/g, '').trim();
            const json = JSON.parse(clean);
            return json.questions || json;
        }
    },

    // Generate Board Exam Paper
    async generateBoardPaper({ className, subject, board = "CBSE" }) {
        const prompt = `
      Create a sample board exam paper for Class ${className} ${subject} following ${board} pattern.
      Includes 3 sections:
      1. Section A: 5 MCQs (with answers at the end)
      2. Section B: 3 Short Answer Questions (Theoretical)
      3. Section C: 2 Long Answer Questions (Theoretical)
      
      Format with clear Markdown headers.
    `;
        return await callAI([{ role: "user", content: prompt }]);
    },

    // Chat/Tutor Function
    async chatWithTutor(message, context = "") {
        const systemPrompt = `You are a helpful AI tutor for a Class student. Context: ${context}. Keep answers simple, friendly, and educational.`;
        return await callAI([
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
        ]);
    },

    // Grade Answer
    async gradeAnswer({ question, userAnswer }) {
        const prompt = `
      Question: ${question}
      Student Answer: ${userAnswer}
      
      Grade this answer on a scale of 0-10.
      Return JSON: { "score": number, "feedback": "string" }
    `;

        const response = await callAI([{ role: "user", content: prompt }], true);
        try {
            return JSON.parse(response);
        } catch (e) {
            const clean = response.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(clean);
        }
    }
};
