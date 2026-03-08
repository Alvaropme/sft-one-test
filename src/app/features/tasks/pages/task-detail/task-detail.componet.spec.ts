import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailComponet } from './task-detail.componet';

describe('TaskDetailComponet', () => {
  let component: TaskDetailComponet;
  let fixture: ComponentFixture<TaskDetailComponet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDetailComponet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskDetailComponet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
