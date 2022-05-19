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
  public invalidRegistration1 = true;
  public invalidRegistration2 = true;
  public invalidRegistration3 = true;
  public invalidRegistration4 = true;
  public invalidName:boolean = true;
  public invalidLastname:boolean = true;
  public invalidUsername:boolean = true;
  public invalidEmail:boolean = true;
  public invalidOldPassword1: boolean = true;
  public invalidOldPassword2: boolean = true;
  public invalidOldPassword3: boolean = true;
  public invalidOldPassword4: boolean = true;
  public invalidPassword:boolean = true;
  public invalidPasswordAgain:boolean = true;
  
  constructor() {
      this.invalidRegistration1 = true;
      this.invalidRegistration2 = true;
      this.invalidRegistration3 = true;
      this.invalidRegistration4 = true;
      this.invalidName = true;
      this.invalidLastname = true;
      this.invalidUsername = true;
      this.invalidEmail = true;
      this.invalidOldPassword1 =true;
      this.invalidOldPassword2 =true;
      this.invalidOldPassword3 =true;
      this.invalidOldPassword4 =true;
      this.invalidPassword = true;
      this.invalidPasswordAgain = true;
  }
  
  public checkForm1(){
      if(this.invalidName || this.invalidOldPassword1 || this.invalidLastname || this.invalidUsername)
          this.invalidRegistration1 = true;
      else
          this.invalidRegistration1 = false;
  }

  public checkForm2(){
    if(this.invalidOldPassword2 || this.invalidEmail)
        this.invalidRegistration2 = true;
    else
        this.invalidRegistration2 = false;
  }

  public checkForm3(){
    if(this.invalidOldPassword3 || this.invalidPassword || this.invalidPasswordAgain)
        this.invalidRegistration3 = true;
    else
        this.invalidRegistration3 = false;
  }
  public checkForm4(){
    if(this.invalidOldPassword4)
        this.invalidRegistration4 = true;
    else
        this.invalidRegistration4 = false;
  }
}

export class UserRegistration
{
    public firstname:string = "";
    public lastname:string = "";
    public username: string = "";
    public password: string = "";
    public email: string = "";
    public photo:File = null as any;
    
    constructor() {
        this.firstname = "";
        this.lastname = "";
        this.username = "";
        this.password = "";
        this.email = "";
        this.photo = null as any;
    }
}

export class EditUser
{
    public firstname:string = "";
    public lastname:string = "";
    public username: string = "";
    public oldpassword1: string="";
    public oldpassword2: string="";
    public oldpassword3: string="";
    public oldpassword4: string="";
    public newpassword: string = "";
    public email: string = "";
    public photo:File = null as any;
    
    constructor() {
        this.firstname = "";
        this.lastname = "";
        this.username = "";
        this.oldpassword1 = "";
        this.oldpassword2 = "";
        this.oldpassword3 = "";
        this.oldpassword4 = "";
        this.newpassword = "";
        this.email = "";
        this.photo = null as any;
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


export class UserInfo
{
    public username: string = "";
    public fullname: string = "";
    public lastname: string = "";
    public email: string = "";
}


/* PROJEKAT */
export class NewProject
{
    public name:string="";
    public description:string="";
    public public:boolean=false;

    constructor()
    {
        this.name="Untitled Project";
        this.description="";  // ovo se prevodi "Project description goes here...";
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
    public hasDataset:boolean=false;
    public Username:string="";

    constructor()
    {
        this.Name="";
        this.Description="";
        this.Public=false;
        this.Creationdate="";
        this.ProjectId=-1;
        this.hasDataset=false;
        this.Username="";
    }
}

export class ProjectOwner{
    public UserID: string = "";
    public Name: string = "";
    public Lastname: string = "";
    public Username: string = "";
    public Email: string = "";
    public Photo: string = "/assets/Images/profilna.png";
    
    constructor()
    {
        this.UserID = "";
        this.Name = "";
        this.Lastname = "";
        this.Username = "";
        this.Email = "";
        this.Photo = "/assets/Images/profilna.png";
    }
}

export class PublicProject
{
    public project: Project = new Project();
    public owner: ProjectOwner = new ProjectOwner();
}


export class OwnerInfo{
    public Name: string = "";
    public Lastname: string = "";
    public Username: string = "";
    public Photo: string = "/assets/Images/profilna.png";
}
/* PROJEKAT */






/* DATASET */

export class LocalChange{
    public action: string = "";
    public column: string = "";
    
    constructor(){
        this.action = "";
        this.column = "";
    }
}


/* DATASET */






/* MREZA */

export class NewNN{
    public Name:string="";
    constructor(){
        this.Name="";
    }
}

export class NN{
    public name:string='';
    public id:number=-1;
    constructor(){
        this.name='';
        this.id=-1;
    }
}


export class NeuralNetwork{
    nn: Network = new Network();
    conf: NetworkConfiguration = new NetworkConfiguration();
}

class Network{
    layers: Layer[] = [];
}

class Layer{
    neurons: Neuron[] = [];
}

class Neuron{
    weights: number[] = [];
    bias: number = 0;
}

export class NetworkConfiguration{
    inputs: string[] = [];
    outputs: string[] = [];
    
    neuronsPerLayer: number[] = [];
    
    actPerLayer: string[] = [];
    actOut: string = "";
    
    learningRate: number = 0;
    reg: string = "";
    regRate: number = 0;
    batchSize: number = 0;
    
    problemType: string = "";
    
    splitType: string = "";
    trainSplit: number = 0;
    valSplit: number = 0;
}
/* MREZA */