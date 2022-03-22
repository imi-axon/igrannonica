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

/*LOGIN*/
export class UserLogin
{
    public username:string="";
    public password:string="";

    constructor(){
        this.username="";
        this.password="";
    }
} 
/*LOGIN*/ 

export class NewProject
{
    public name:string="";
    public description:string="";
    public public:boolean=false;

    constructor()
    {
        this.name="";
        this.description="";
        this.public=false;
    }
}


export class Project
{
    public projectid:number=-1;
    public name:string="";
    public description:string="";
    public public:boolean=false;
    public creationdate:string="";

    constructor()
    {
        this.name="";
        this.description="";
        this.public=false;
        this.creationdate="";
        this.projectid=-1;
    }
}


