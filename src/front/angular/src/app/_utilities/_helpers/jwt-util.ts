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
        return (g == null)? '' : g["username"];
    }
    static getEmail(): string {
        let g = this.getPayload();
        return (g == null)? '' : g["email"];
    }

    static fullName(): string {
        let g = this.getPayload();
        return (g == null)? '' : g["imeprezime"];
    }
    

   
}
interface JWT {
    username :string;
    email:string;
    imeprezime:string;
    id:string;
    exp:number
}