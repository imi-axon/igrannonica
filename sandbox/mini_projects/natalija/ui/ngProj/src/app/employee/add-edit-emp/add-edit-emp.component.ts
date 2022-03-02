import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-add-edit-emp',
  templateUrl: './add-edit-emp.component.html',
  styleUrls: ['./add-edit-emp.component.css']
})
export class AddEditEmpComponent implements OnInit {
  constructor(private service:SharedService) { }
  @Input () emp: any ;
  EmployeeId:string;
  EmployeeName:string;
  Department:string;
  DateOfJoining:string;

  DepartmentsList:any=[];

  /*RESAVA PROLEM:
  
  Compiled with problems:X

ERROR

src/app/department/show-dep/show-dep.component.html:18:31 - error NG8002: Can't bind to 'dep' since it isn't a known property of 'app-add-edit-dep'.
1. If 'app-add-edit-dep' is an Angular component and it has 'dep' input, then verify that it is part of this module.
2. If 'app-add-edit-dep' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message.
3. To allow any property add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component.

18             <app-add-edit-dep [dep]="dep" *ngIf="ActivateAddEditDepComp"></app-add-edit-dep>
                                 ~~~~~~~~~~~

  src/app/department/show-dep/show-dep.component.ts:6:16
    6   templateUrl: './show-dep.component.html',
                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Error occurs in the template of component ShowDepComponent.*/ 

    loadDepartmentList()
    {
      this.service.getAllDepartmentNames().subscribe((data:any)=>{
        this.DepartmentsList=data;
        this.EmployeeId=this.emp.EmployeeId;
        this.EmployeeName=this.emp.EmployeeName;
        this.Department=this.emp.Department;
        this.DateOfJoining=this.emp.DateOfJoining;
      });
    }

  ngOnInit(): void {
  this.loadDepartmentList();
  }

  addEmployee()
  {
    var val={EmployeeId:this.EmployeeId, EmployeeName: this.EmployeeName,Department:this.Department,DateOfJoining:this.DateOfJoining};
    this.service.addEmployee(val).subscribe(res=>{alert(res.toString());});
  }

  updateEmployee()
  {
    var val={EmployeeId:this.EmployeeId, EmployeeName: this.EmployeeName,Department:this.Department,DateOfJoining:this.DateOfJoining};
    this.service.updateEmployee(val).subscribe(res=>{alert(res.toString());});
  }

}
