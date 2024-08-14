import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Almacena los conteos de protocolos en memoria
const protocolCounts = {};

export const runtime = "edge";

export async function POST(req, res) {
  const  body  = await req.json();
  console.log("messages route:", body.message);

  // Verifica si el mensaje es una consulta sobre un protocolo
  const protocolMatch = body.message.match(/protocolo (\d+)/i);
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
          "you are a helpful assistant names Lola that can answer any question or provide information about a topic and keeps track of company protocols." +
          "Protocol 1 is being cool, Protocol 2 is being cooler, Protocol 3 is being the coolest. respond super succintly",
      },
      {role: "user", content: body.message},
    ],

  });
  console.log("response:", response);
       if (protocolMatch) {
        const protocolNumber = protocolMatch[1];
        response.choices[0].message.content += ` El protocolo ${protocolNumber} ha sido consultado ${protocolCounts[protocolNumber]} veces.`;
      } 
      console.log("response:", response);
      const message = response.choices[0].message.content;
      console.log("message:", message);
        return Response.json(response.choices[0].message);
  // Modifica la respuesta para incluir el conteo de protocolos
  //const stream = OpenAIStream(response);
  //return new StreamingTextResponse(stream)
}
