import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskFormComponet } from './task-form.componet';

describe('TaskFormComponet', () => {
  let component: TaskFormComponet;
  let fixture: ComponentFixture<TaskFormComponet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFormComponet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskFormComponet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
