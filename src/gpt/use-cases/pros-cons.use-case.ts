import OpenAI from "openai";

interface Options {
    prompt: string;
}

export const prosConsDiscusserUseCase = async( openai:OpenAI, options: Options) => {
    const { prompt } = options; 
    console.log(prompt);
    const completion = await openai.chat.completions.create({
        messages: [{ 
            role: "system", 
            content: `
            Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
            la respuesta debe de ser en formato markdown,
            los pros y contras deben de estar en una lista,           
            `  
        },
        {
            role:"user",
            content: prompt,
        }
    ],
        temperature: 0.8,
        max_tokens: 500,
        model: "gpt-4",
      });
    
      console.log(completion);
      const strResp = completion.choices[0].message.content
      return strResp;
}