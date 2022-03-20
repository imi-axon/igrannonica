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

    static decodePayload(jwt: string | null): JWT | null {
        if (jwt == null || jwt == '')
            return null;
            
        const payload = jwt.split('.')[1];    
        console.log(JSON.parse(atob(payload)));
        return JSON.parse(atob(payload));
    }

    static getPayload(): JWT | null {
        return this.decodePayload(this.get());
    }

    static getUsername(): string {
        let g = this.getPayload();
        return (g == null)? '' : g["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
    }
    static getEmail(): string {
        let g = this.getPayload();
        return (g == null)? '' : g["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
    }

    static fullName(): string {
        let g = this.getPayload();
        return (g == null)? '' : g["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"];
    }
    

   
}
interface JWT {
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name' :string;
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress':string;
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname':string;
   exp:number

}