import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListComponet } from './task-list.componet';

describe('TaskListComponet', () => {
  let component: TaskListComponet;
  let fixture: ComponentFixture<TaskListComponet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListComponet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskListComponet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
