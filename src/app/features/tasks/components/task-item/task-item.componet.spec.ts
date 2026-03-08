import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskItemComponet } from './task-item.componet';

describe('TaskItemComponet', () => {
  let component: TaskItemComponet;
  let fixture: ComponentFixture<TaskItemComponet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskItemComponet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskItemComponet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
