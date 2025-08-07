export async function onRequest(context) {
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;

    // Retrieve the GitHub Client ID from environment variables
    const client_id = env.GITHUB_CLIENT_ID;

    try {
        // Parse the incoming request URL
        const url = new URL(request.url);

        // Construct the GitHub OAuth authorization URL
        const redirectUrl = new URL('https://github.com/login/oauth/authorize');
        redirectUrl.searchParams.set('client_id', client_id);
        redirectUrl.searchParams.set('redirect_uri', `${url.origin}/api/callback`);
        redirectUrl.searchParams.set('scope', 'repo user');

        // Generate a random state value for CSRF protection
        const state = Array.from(crypto.getRandomValues(new Uint8Array(12)))
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
        redirectUrl.searchParams.set('state', state);

        // Redirect the user to GitHub's OAuth page
        return Response.redirect(redirectUrl.href, 302); // Use 302 for temporary redirects

    } catch (error) {
        console.error('Error during OAuth redirection:', error);
        return new Response('Internal Server Error', {
            status: 500,
        });
    }
}