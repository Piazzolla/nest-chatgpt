import OpenAI from "openai";

interface Options {
    threadId: string;
    assistantId?: string;
}

export const createRunUseCase = async( openai: OpenAI, options: Options) => {
    const {threadId, assistantId = 'asst_pBTIm855AMsHQ5Y8ErPRAGKn'} = options;

    const run = await openai.beta.threads.runs.create( threadId, {
        assistant_id: assistantId,
        //instructions; OJO! SOBREESCRIBE el asistente
    })

    console.log({run});
    return run;
}
