import { GoogleGenerativeAI } from "@google/generative-ai"
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";


const apiKey = process.env.OPENAI_API_KEY;
const EdenKey = process.env.EDEN_API_KEY;
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

export const Image = action({
	args: {
		conversation: v.id("conversations"),
		messageBody: v.string(),
	},
	handler: async (ctx, args) => {
		const url = 'https://api.edenai.run/v2/image/generation';
		const options = {
			method: 'POST',
			headers: {
				accept: 'application/json',
				'content-type': 'application/json',
				authorization: `Bearer ${EdenKey}`
			},
			body: JSON.stringify({
				response_as_dict: true,
				attributes_as_list: false,
				show_base_64: false,
				show_original_response: false,
				num_images: 1,
				providers: ['amazon/titan-image-generator-v1_standard'],
				text: args.messageBody,
				resolution: '512x512'
			})
		};
		const response = await fetch(url, options);
		const data = await response.json();
		const imageUrl = data['amazon/titan-image-generator-v1_standard'].items[0].image_resource_url
		await ctx.runMutation(api.messages.sendChatGPTMessage, {
			content: imageUrl ?? "/image.png",
			conversation: args.conversation,
			messageType: "image",
		});
	},
});
