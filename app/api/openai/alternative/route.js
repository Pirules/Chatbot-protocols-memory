import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Almacena los conteos de protocolos en memoria
const protocolCounts = {};

export const runtime = "edge";

export async function POST(req, res) {
  const { messages } = await req.json();

  // Verifica si el mensaje es una consulta sobre un protocolo
  const protocolMatch = messages[messages.length - 1].content.match(/protocolo (\d+)/i);
  if (protocolMatch) {
    const protocolNumber = protocolMatch[1];
    protocolCounts[protocolNumber] = (protocolCounts[protocolNumber] || 0) + 1;
  }

  // Genera la respuesta del chat utilizando la API de OpenAI
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "you are a helpful assistant that can answer any question or provide information about a topic and keeps track of company protocols." +
          "Protocol 1 is being cool, Protocol 2 is being cooler, Protocol 3 is being the coolest." +
          "Whenever you state what a protocol is, you must also state how many times the protocol has been stated.",
      },
      ...messages,
    ],
    stream: true,
  });

/*   if (protocolMatch) {
    const protocolNumber = protocolMatch[1];
    //response.choices[0].message.content += ` El protocolo ${protocolNumber} ha sido consultado ${protocolCounts[protocolNumber]} veces.`;
    res = ` El protocolo ${protocolNumber} ha sido consultado ${protocolCounts[protocolNumber]} veces.`;
  }
  console.log("response:", response);
  const message = response.choices[0].message.content;
  console.log("message:", message);
  return new Response(message); */
  // Modifica la respuesta para incluir el conteo de protocolos
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream)
}
