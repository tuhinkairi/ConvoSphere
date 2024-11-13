import { GoogleGenerativeAI } from "@google/generative-ai"
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";


const apiKey = process.env.OPENAI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey!);

export const chat = action({
	args: {
		messageBody: v.string(),
		conversation: v.id("conversations"),
	},
	handler: async (ctx, args) => {

		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
		const prompt = `You are a terse bot in a group chat responding to questions with 1-sentence answer for ${args.messageBody}`;
		const result = await model.generateContent(prompt);
		console.log(result.response.text());
		const messageContent = result.response.text();

		
		await ctx.runMutation(api.messages.sendChatGPTMessage, {
			content: messageContent ?? "I'm sorry, I don't have a response for that",
			conversation: args.conversation,
			messageType: "text",
		});
	},
});

// export const dall_e = action({
// 	args: {
// 		conversation: v.id("conversations"),
// 		messageBody: v.string(),
// 	},
// 	handler: async (ctx, args) => {
// 		const res = await openai.images.generate({
// 			model: "dall-e-3",
// 			prompt: args.messageBody,
// 			n: 1,
// 			size: "1024x1024",
// 		});

// 		const imageUrl = res.data[0].url;
// 		await ctx.runMutation(api.messages.sendChatGPTMessage, {
// 			content: imageUrl ?? "/poopenai.png",
// 			conversation: args.conversation,
// 			messageType: "image",
// 		});
// 	},
// });

// // 1 token ~= 4 chars in English
// // 1 token ~= ¾ words
// // 100 tokens ~= 75 words
// // Or
// // 1-2 sentence ~= 30 tokens
// // 1 paragraph ~= 100 tokens
// // 1,500 words ~= 2048 tokens

// // 1 image will cost $0,04(4 cents) => dall-e-3
// // 1 image will cost $0,02(2 cents) => dall-e-2