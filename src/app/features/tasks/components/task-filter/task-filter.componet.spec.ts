import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskFilterComponet } from './task-filter.componet';

describe('TaskFilterComponet', () => {
  let component: TaskFilterComponet;
  let fixture: ComponentFixture<TaskFilterComponet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFilterComponet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskFilterComponet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
