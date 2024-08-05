import { OAuth2RequestError, generateCodeVerifier } from "arctic";
import { User } from "~/server/models/User.model";

interface GoogleUser {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    picture: string;
    locale: string;
}

export default defineEventHandler(async (event) => {
    console.log("CALLBACK")
    const query = getQuery(event);
    const code = query.code?.toString() ?? null;
    const state = query.state?.toString() ?? null;
    const storedState = getCookie(event, "google_oauth_state") ?? null;
    const storedCodeVerifier = getCookie(event, "code_verifier" ) ?? null;
    if (!code || !state || !storedState || state !== storedState || !storedCodeVerifier) {
        console.log("WRONG")
        throw createError({
            status: 400,
        });
    }

    try {
        const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);
        console.log(tokens)
        const googleResp = await fetch(
            "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
            {
                headers: {
                    Authorization: `Bearer ${tokens.accessToken}`,
                },
                method: "GET",
            },
        );

        const googleData: GoogleUser = await googleResp.json();

        console.log(googleData)

        const existing = await User.findOne({
            google_id: googleData.id,
        });

        console.log(existing)

        if (existing) {
            const session = await lucia.createSession(existing.id, {});
            appendHeader(
                event,
                "Set-Cookie",
                lucia.createSessionCookie(session.id).serialize(),
            );
            return sendRedirect(event, "/");
        }

        console.log("GOOD")

        const userId = crypto.randomUUID();

        await User.create({
            _id: userId,
            username: googleData.name,
            email: googleData.email,
            picture: googleData.picture,
            google_id: googleData.id,
        });

        console.log("created")

        const session = await lucia.createSession(userId, {});
        appendHeader(
            event,
            "Set-Cookie",
            lucia.createSessionCookie(session.id).serialize(),
        );
        return sendRedirect(event, "/");
    } catch (err) {
        console.error("chatter", err)
        if (err instanceof OAuth2RequestError) {
            throw createError({
                status: 400,
            });
        }
        throw createError({
            status: 500,
        });
    }
});
