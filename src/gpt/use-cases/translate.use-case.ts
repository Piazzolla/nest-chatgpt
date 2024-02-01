import OpenAI from "openai";

interface Options {
    prompt: string;
    lang: string;
}

export const translateUseCase = async( openai:OpenAI, options: Options) => {
    const { prompt, lang } = options; 
    console.log(prompt);
    const completion = await openai.chat.completions.create({
        messages: [{ 
            role: "system", 
            content: `
            Se te dará un lenguaje 'lang' y un texto y deberás traducir el texto al lenguaje provisto.
            La respuesta deberá ser solo el texto traducido.           
            `  
        },
        {
            role:"user",
            content: prompt,
            
        },
        {
            role: "user",
            content: lang
        }
    ],
        temperature: 0.8,
        max_tokens: 500,
        model: "gpt-3.5-turbo",
      });
    
      console.log(completion);
      return  completion.choices[0].message
}