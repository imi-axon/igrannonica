import { HttpHeaders } from "@angular/common/http";
import { JWT_HEADER_NAME } from "../_data-types/vars";
import { JWTUtil } from "./jwt-util";

export class HeaderUtil 
{
    static jwtOnlyHeaders(): HttpHeaders
    {
        let obj: { [key: string]: string } = {};
        let jwt:string=JWTUtil.get();
        if(jwt!='')
            obj[JWT_HEADER_NAME] = 'bearer ' + jwt ;
        return new HttpHeaders(obj);
    }
}