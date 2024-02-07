import OpenAI from "openai";

interface Options {
    baseImage: string;
}

export const imageVariationUseCase = async (openai: OpenAI, options: Options) => {

    const { baseImage } = options;

    return baseImage;

}