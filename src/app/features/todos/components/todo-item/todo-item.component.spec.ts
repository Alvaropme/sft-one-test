import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ComponentRef } from '@angular/core';
import { TodoItemComponent } from './todo-item.component';
import { Todo } from '../../models/todo.model';

const mockTodo: Todo = {
  id: 1,
  userId: 1,
  title: 'Test Todo',
  completed: false,
};

describe('TodoItemComponent', () => {
  let component: TodoItemComponent;
  let componentRef: ComponentRef<TodoItemComponent>;
  let fixture: ComponentFixture<TodoItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItemComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('todo', mockTodo);
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the todo title', () => {
    const title = fixture.debugElement.query(By.css('.todo-title'));
    expect(title.nativeElement.textContent).toContain('Test Todo');
  });

  it('should display the todo id', () => {
    const id = fixture.debugElement.query(By.css('.todo-id'));
    expect(id.nativeElement.textContent).toContain('#1');
  });

  it('should not have completed class when todo is not completed', () => {
    const card = fixture.debugElement.query(By.css('mat-card'));
    expect(card.nativeElement.classList).not.toContain('completed');
  });

  it('should have completed class when todo is completed', () => {
    componentRef.setInput('todo', { ...mockTodo, completed: true });
    fixture.detectChanges();
    const card = fixture.debugElement.query(By.css('mat-card'));
    expect(card.nativeElement.classList).toContain('completed');
  });

  it('should show star_border icon when not favorite', () => {
    const icon = fixture.debugElement.queryAll(By.css('mat-icon'))[0];
    expect(icon.nativeElement.textContent).toContain('star_border');
  });

  it('should show star icon when favorite', () => {
    componentRef.setInput('isFavorite', true);
    fixture.detectChanges();
    const icon = fixture.debugElement.queryAll(By.css('mat-icon'))[0];
    expect(icon.nativeElement.textContent).toContain('star');
  });

  it('should emit toggleComplete with todo id when checkbox changes', () => {
    let emittedId: number | undefined;
    component.toggleComplete.subscribe((id: number) => emittedId = id);

    const checkbox = fixture.debugElement.query(By.css('mat-checkbox'));
    checkbox.triggerEventHandler('change', {});
    expect(emittedId).toBe(1);
  });

  it('should emit toggleFavorite with todo id when favorite button clicked', () => {
    let emittedId: number | undefined;
    component.toggleFavorite.subscribe((id: number) => emittedId = id);

    const buttons = fixture.debugElement.queryAll(By.css('button[mat-icon-button]'));
    buttons[0].triggerEventHandler('click', {});
    expect(emittedId).toBe(1);
  });

  it('should emit edit with todo id when edit button clicked', () => {
    let emittedId: number | undefined;
    component.edit.subscribe((id: number) => emittedId = id);

    const buttons = fixture.debugElement.queryAll(By.css('button[mat-icon-button]'));
    buttons[1].triggerEventHandler('click', {});
    expect(emittedId).toBe(1);
  });

  it('should emit delete with todo id when delete button clicked', () => {
    let emittedId: number | undefined;
    component.delete.subscribe((id: number) => emittedId = id);

    const buttons = fixture.debugElement.queryAll(By.css('button[mat-icon-button]'));
    buttons[2].triggerEventHandler('click', {});
    expect(emittedId).toBe(1);
  });
});