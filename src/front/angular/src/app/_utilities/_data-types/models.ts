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
      if(this.invalidName || this.invalidPassword || this.invalidLastname || this.invalidUsername || this.invalidEmail || this.invalidPasswordAgain)
          this.invalidRegistration = true;
      else
          this.invalidRegistration = false;
  }
}

export class UserEditCheck
{
  public invalidRegistration = true;
  
  public invalidName:boolean = true;
  public invalidLastname:boolean = true;
  public invalidUsername:boolean = true;
  public invalidEmail:boolean = false;
  public invalidOldPassword: boolean = true;
  public invalidPassword:boolean = false;
  public invalidPasswordAgain:boolean = false;
  
  constructor() {
      this.invalidRegistration = true;
      this.invalidName = true;
      this.invalidLastname = true;
      this.invalidUsername = true;
      this.invalidEmail = false;
      this.invalidOldPassword =true;
      this.invalidPassword = false;
      this.invalidPasswordAgain = false;
  }
  
  public checkForm(){
      if(this.invalidName || this.invalidOldPassword || this.invalidLastname || this.invalidUsername || this.invalidEmail || this.invalidPassword || this.invalidPasswordAgain)
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

export class EditUser
{
    public firstname:string = "";
    public lastname:string = "";
    public username: string = "";
    public oldpassword: string="";
    public newpassword: string = "";
    public email: string = "";
    
    constructor() {
        this.firstname = "";
        this.lastname = "";
        this.username = "";
        this.oldpassword = "";
        this.newpassword = "";
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
    public ProjectId:number=-1;
    public Name:string="";
    public Description:string="";
    public Public:boolean=false;
    public Creationdate:string="";

    constructor()
    {
        this.Name="";
        this.Description="";
        this.Public=false;
        this.Creationdate="";
        this.ProjectId=-1;
    }
}

export class NewNN{
    public name:string=""
    constructor(){
        this.name=";"
    }
}


