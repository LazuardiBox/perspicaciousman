export async function onRequest(context) {
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
    } = context;

    const client_id = "Ov23liHqjrY3q35pIKol"; // Use environment variable for client_id

    try {
        const url = new URL(request.url);

        // Redirect to GitHub's OAuth page
        const redirectUrl = new URL('https://github.com/login/oauth/authorize');
        redirectUrl.searchParams.set('client_id', client_id);
        redirectUrl.searchParams.set('redirect_uri', url.origin + '/api/callback'); // Ensure this matches GitHub OAuth App settings
        redirectUrl.searchParams.set('scope', url.searchParams.get('scope') || 'repo user'); // Allow scope to be passed as a query parameter
        redirectUrl.searchParams.set('state', crypto.randomUUID()); // Generate a secure state parameter

        return Response.redirect(redirectUrl.href, 302); // Use 302 for temporary redirects

    } catch (error) {
        console.error(error);
        return new Response(error.message, {
            status: 500,
        });
    }
}