import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNeuralNetworkComponent } from './create-neural-network.component';

describe('CreateNeuralNetworkComponent', () => {
  let component: CreateNeuralNetworkComponent;
  let fixture: ComponentFixture<CreateNeuralNetworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNeuralNetworkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNeuralNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
