import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaMrezaComponent } from './lista-mreza.component';

describe('ListaMrezaComponent', () => {
  let component: ListaMrezaComponent;
  let fixture: ComponentFixture<ListaMrezaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaMrezaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaMrezaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
