export async function onRequest(context) {
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
    } = context;

    const client_id = "Ov23liHqjrY3q35pIKol";
    const client_secret = "e4cee3703b9e1d4495b3c9547e016003d9cb65d6";

    try {
        const url = new URL(request.url);

        // Extract query parameters
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');

        if (!code || !state) {
            return new Response('Missing code or state', { status: 400 });
        }

        // Exchange the authorization code for an access token
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                client_id,
                client_secret,
                code,
                state,
            }),
        });

        const tokenData = await tokenResponse.json();
        if (!tokenData.access_token) {
            return new Response('Failed to retrieve access token', { status: 500 });
        }

        // Redirect the user back to Decap CMS with the access token
        const cmsRedirectUrl = `${url.origin}/admin/#access_token=${tokenData.access_token}`;
        return Response.redirect(cmsRedirectUrl, 302);

    } catch (error) {
        console.error(error);
        return new Response(error.message, { status: 500 });
    }
}