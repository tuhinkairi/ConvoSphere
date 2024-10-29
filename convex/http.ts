import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
	path: "/clerk",
	method: "POST",
	handler: httpAction(async (ctx, req) => {
		const payloadString = await req.text();
		const headerPayload = req.headers;

		try {
			const response = await ctx.runAction(internal.clerk.fulfill, {
				payload: payloadString,
				headers: {
					"svix-id": headerPayload.get("svix-id")!,
					"svix-signature": headerPayload.get("svix-signature")!,
					"svix-timestamp": headerPayload.get("svix-timestamp")!,
				},
			});
            switch (response.type) {
				case "user.created":
					await ctx.runMutation(internal.users.createUser, {
						tokenIdentifier: `${process.env.CLERK_APP_DOMAIN}|${response.data.id}`,
						email: response.data.email_addresses[0]?.email_address,
						name: `${response.data.first_name ?? "Guest"} ${response.data.last_name ?? ""}`,
						image: response.data.image_url,
					});
					break;
				// case "user.updated":
				// 	await ctx.runMutation(internal.users.updateUser, {
				// 		tokenIdentifier: `${process.env.CLERK_APP_DOMAIN}|${response.data.id}`,
				// 		image: response.data.image_url,
				// 	});
				// 	break;
				// case "session.created":
				// 	await ctx.runMutation(internal.users.setUserOnline, {
				// 		tokenIdentifier: `${process.env.CLERK_APP_DOMAIN}|${response.data.user_id}`,
				// 	});
				// 	break;
				// case "session.ended":
				// 	await ctx.runMutation(internal.users.setUserOffline, {
				// 		tokenIdentifier: `${process.env.CLERK_APP_DOMAIN}|${response.data.user_id}`,
				// 	});
				// 	break;
			}

			return new Response(null, {
				status: 200,
			});
		} catch (error) {
			console.log("Webhook Error🔥🔥", error);
			return new Response("Webhook Error", {
				status: 400,
			});
		}
	}),
});

export default http;

