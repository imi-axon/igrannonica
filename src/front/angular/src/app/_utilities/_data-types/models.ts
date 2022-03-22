/*  REGISTRACIJA  */

export class RegistrationCheck
{
  public invalidRegistration = true;
  
  public invalidName:boolean = true;
  public invalidLastname:boolean = true;
  public invalidUsername:boolean = true;
  public invalidEmail:boolean = true;
  public invalidPassword:boolean = true;
  public invalidPasswordAgain:boolean = true;
  
  constructor() {
      this.invalidRegistration = true;
      this.invalidName = true;
      this.invalidLastname = true;
      this.invalidUsername = true;
      this.invalidEmail = true;
      this.invalidPassword = true;
      this.invalidPasswordAgain = true;
  }
  
  public checkForm(){
      if(this.invalidName || this.invalidLastname || this.invalidUsername || this.invalidEmail || this.invalidPassword || this.invalidPasswordAgain)
          this.invalidRegistration = true;
      else
          this.invalidRegistration = false;
  }
}

export class UserRegistration
{
    public firstname:string = "";
    public lastname:string = "";
    public username: string = "";
    public password: string = "";
    public email: string = "";
    
    constructor() {
        this.firstname = "";
        this.lastname = "";
        this.username = "";
        this.password = "";
        this.email = "";
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

export class Project
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


