
const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'blahsomething',
    db: 'codeialDevelopment',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'projectdevelopment87@gmail.com',
            pass: 'ylllijnhkrngbasm'
        },
        tls: {
            rejectUnauthorized: false
        }
    },
    google_client_iD: "222721594416-km9tb0n9q67f4bpsb7eemtafn3fgj206.apps.googleusercontent.com",
    google_client_secret: "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",
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'codeial'
}

const production = {
    name: 'production'
}

module.exports = development