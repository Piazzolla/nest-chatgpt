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
            content: `Te serán provistos textos en españool con posibles errores ortográficos y gramaticales,
            Las palabras usadas deben existir en el diccionario de la Real Academia Española,
            Debes responder en formato JSON,
            tu tarea es corregirlos y retornar la información soluciones,
            también debes de dar un porcentaje de acierto por el usuario,
            Si no hay errores, debes retornar un mensaje de felicitaciones.
            
            Ejemplo de salida:
            {
                userSCore: number,
                errors: string[], //['error -> solucion']
                message: string, // Usa emojis para felicitar al usuario
            }
            `  
        },
        {
            role:"user",
            content: prompt,
        }
    ],
        temperature: 0.5,
        max_tokens: 150,
        model: "gpt-4",
      });
    
      console.log(completion);
      const jsonResp = JSON.parse(completion.choices[0].message.content)
      return jsonResp;
}