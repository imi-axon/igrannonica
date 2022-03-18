/*  REGISTRACIJA  */
export class User
{
    public name:string = "";
    public lastname:string = "";
    public username: string = "";
    public email: string = "";
    public password: string = "";
    
    constructor() {
        this.name = "";
        this.lastname = "";
        this.username = "";
        this.email = "";
        this.password = "";
    }
}
/* REGISTRACIJA */

export class Project
{
    public name:string="";
    public description:string="";
    public isPublic:boolean=false;

    constructor()
    {
        this.name="";
        this.description="";
        this.isPublic=false;
    }
}


