import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-add-edit-dep',
  templateUrl: './add-edit-dep.component.html',
  styleUrls: ['./add-edit-dep.component.css']
})
export class AddEditDepComponent implements OnInit {

  constructor(private service:SharedService) { }
  @Input () dep: any ;
  DepartmentId:string;
  DepartmentName:string;

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

  ngOnInit(): void {
    this.DepartmentId=this.dep.DepartmentId;
    this.DepartmentName=this.dep.DepartmentName;
  }

  addDepartment()
  {
    var val={DepartmentId:this.DepartmentId, DepartmentName: this.DepartmentName};
    this.service.addDepartment(val).subscribe(res=>{alert(res.toString());});
  }

  updateDepartment()
  {
    var val={DepartmentId:this.DepartmentId, DepartmentName: this.DepartmentName};
    this.service.updateDepartment(val).subscribe(res=>{alert(res.toString());});
  }

}
