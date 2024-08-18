import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.YOUR_SITE_URL, 
    'X-Title': process.env.YOUR_SITE_NAME, 
  },
})

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
}`

export async function POST(req) {
  try {
    const data = await req.text()

    const completion = await openai.chat.completions.create({
      model: 'meta-llama/llama-3.1-8b-instruct:free',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: data },
      ],
    })

    // Parse the JSON response from the LLaMA API
    const flashcards = JSON.parse(completion.choices[0].message.content)

    // Return the flashcards as a JSON response
    return NextResponse.json(flashcards.flashcards)
  } catch (error) {
    console.error('Error creating flashcards:', error)
    return NextResponse.json({ error: { message: error.message } }, { status: 500 })
  }
}
