import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.YOUR_SITE_URL, 
    'X-Title': process.env.YOUR_SITE_NAME, 
  },
});

const systemPrompt = `
You are a flashcard creator. You take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}`;

export async function POST(req) {
  try {
    const data = await req.text();

    const completion = await openai.chat.completions.create({
      model: 'meta-llama/llama-3.1-8b-instruct:free',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: data },
      ],
    });

    // Log the raw response
    console.log('Raw response:', completion.choices[0].message.content);

    // Extract and clean the JSON response
    let responseContent = completion.choices[0].message.content;

    // Remove any extra text or non-JSON characters
    const jsonStartIndex = responseContent.indexOf('{');
    const jsonEndIndex = responseContent.lastIndexOf('}') + 1;
    responseContent = responseContent.substring(jsonStartIndex, jsonEndIndex);

    // Parse the JSON response
    let flashcards;

    try {
      flashcards = JSON.parse(responseContent);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      console.error('Response content:', responseContent);
      return NextResponse.json({ error: { message: 'Failed to parse response' } }, { status: 500 });
    }

    // Return the flashcards as a JSON response
    return NextResponse.json(flashcards.flashcards);
  } catch (error) {
    console.error('Error creating flashcards:', error);
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}
