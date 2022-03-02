import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared.service';



@Component({
  selector: 'app-show-emp',
  templateUrl: './show-emp.component.html',
  styleUrls: ['./show-emp.component.css']
})
export class ShowEmpComponent implements OnInit {
  constructor(private service:SharedService) { }
  EmployeeList:any=[];

  

  ModalTitle:string=""; 
  ActivateAddEditEmpComp:boolean=false;
  emp:any;

  ngOnInit(): void {
    this.refreshEmpList();
  }

  addClick(){
    this.emp={EmployeeId:0,EmployeeName:"",Department:"",DateOfJoining:""}
    this.ModalTitle="Add Employee";
    this.ActivateAddEditEmpComp=true;
  }

  closeClick()
  {
    this.ActivateAddEditEmpComp=false;
    this.refreshEmpList();
  }

  deleteClick(item)
  {
    if(confirm("Are you sure?"))
    {
      this.service.deleteEmployee(item.EmployeeId).subscribe(data=>{
        alert(data.toString());
        this.refreshEmpList();
      });
    }
  }

  editClick(item)
  {
    this.emp=item;
    this.ModalTitle="Edit Employee";
    this.ActivateAddEditEmpComp=true;
  }

 

  refreshEmpList()
  {
    this.service.getEmpList().subscribe(data=>{
      this.EmployeeList=data;
    });
  }


}


