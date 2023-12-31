export const RedirectRoutes = {
    DEFAULT: [''],
    HOME: [''],

    ON_FORBIDDEN: [''],
    ON_UNAUTHORIZED: ['login'],
    ON_SESSION_EXPIRED: ['session-expired'],
    
    ON_LOGOUT: ['login'],
    ON_LOGIN: ['home'],
    
    ON_REGISTER_SUCCESSFUL: ['registration-successful']
}