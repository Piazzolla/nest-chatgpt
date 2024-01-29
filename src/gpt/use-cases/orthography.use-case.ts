import OpenAI from "openai";

interface Options {
    prompt: string;
}

export const orthographyCheckUseCase = async( openai:OpenAI, options: Options) => {
    const { prompt } = options; 
    console.log(prompt);
    const completion = await openai.chat.completions.create({
        messages: [{ 
            role: "system", 
            content: "You are a helpful assistant." 
        },
        {
            role:"user",
            content: prompt,
        }
        ],
        model: "gpt-3.5-turbo",
      });
    
      console.log(completion);
      return completion.choices[0];
}