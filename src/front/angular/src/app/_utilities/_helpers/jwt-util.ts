import { JWT_HEADER_NAME } from "../_data-types/vars";
export class JWTUtil
{
    static localStorageKey: string = JWT_HEADER_NAME

    static get(): string {
        const jwt = window.localStorage.getItem(this.localStorageKey)
        if (jwt == null)
            return '';
        
        return jwt;
    }

    static store(jwt: string | null) {
        window.localStorage.setItem(this.localStorageKey, (jwt == null)? '' : jwt);
    }

    static delete() {
        window.localStorage.removeItem(this.localStorageKey);
    }

   
}
// interface JWT {
//     exp: number;
//     iss: string;
//     rol: string;
//     uid: number;
// }