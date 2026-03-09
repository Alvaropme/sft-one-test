import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ComponentRef } from '@angular/core';
import { TodoFormComponent } from './todo-form.component';
import { Todo } from '../../models/todo.model';

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

const mockTodo: Todo = {
  id: 1,
  userId: 2,
  title: 'Existing Todo',
  completed: false,
};

describe('TodoFormComponent', () => {
  let component: TodoFormComponent;
  let componentRef: ComponentRef<TodoFormComponent>;
  let fixture: ComponentFixture<TodoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoFormComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoFormComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render in create mode by default', () => {
    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(button.nativeElement.textContent).toContain('Create');
  });

  it('should render in edit mode when todo input is provided', () => {
    componentRef.setInput('todo', mockTodo);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(button.nativeElement.textContent).toContain('Update');
  });

  it('should initialize form with empty values in create mode', () => {
    expect(component.form.get('title')?.value).toBe('');
    expect(component.form.get('userId')?.value).toBe(1);
    expect(component.form.get('completed')?.value).toBe(false);
  });

  it('should patch form values when todo input is set', async () => {
    componentRef.setInput('todo', mockTodo);
    await flushPromises();
    fixture.detectChanges();
    expect(component.form.get('title')?.value).toBe('Existing Todo');
    expect(component.form.get('userId')?.value).toBe(2);
    expect(component.form.get('completed')?.value).toBe(false);
  });

  it('should be invalid when title is empty', () => {
    component.form.get('title')?.setValue('');
    expect(component.form.get('title')?.hasError('required')).toBe(true);
  });

  it('should be invalid when title is too short', () => {
    component.form.get('title')?.setValue('ab');
    expect(component.form.get('title')?.hasError('minlength')).toBe(true);
  });

  it('should be invalid when title is too long', () => {
    component.form.get('title')?.setValue('a'.repeat(101));
    expect(component.form.get('title')?.hasError('maxlength')).toBe(true);
  });

  it('should be invalid when userId is less than 1', () => {
    component.form.get('userId')?.setValue(0);
    expect(component.form.get('userId')?.hasError('min')).toBe(true);
  });

  it('should be valid with correct values', async () => {
    component.form.get('title')?.setValue('Valid Title');
    component.form.get('userId')?.setValue(1);
    await flushPromises();
    expect(component.form.valid).toBe(true);
  });

  it('should detect duplicate title', async () => {
    componentRef.setInput('existingTitles', ['existing title']);
    component.form.get('title')?.setValue('existing title');
    await flushPromises();
    expect(component.form.get('title')?.hasError('duplicate')).toBe(true);
  });

  it('should mark all fields as touched when submitting invalid form', () => {
    component.form.get('title')?.setValue('');
    component.onSubmit();
    expect(component.form.get('title')?.touched).toBe(true);
    expect(component.form.get('userId')?.touched).toBe(true);
  });

  it('should emit create when form is valid in create mode', async () => {
    let emitted: any;
    component.create.subscribe((val: any) => emitted = val);

    component.form.get('title')?.setValue('New Todo');
    component.form.get('userId')?.setValue(1);
    await flushPromises();
    fixture.detectChanges();

    component.onSubmit();

    expect(emitted).toEqual({
      title: 'New Todo',
      userId: 1,
      completed: false,
    });
  });

  it('should emit update when form is valid in edit mode', async () => {
    componentRef.setInput('todo', mockTodo);
    await flushPromises();
    fixture.detectChanges();

    let emitted: any;
    component.update.subscribe((val: any) => emitted = val);

    component.form.get('title')?.setValue('Updated Title');
    await flushPromises();
    fixture.detectChanges();

    component.onSubmit();

    expect(emitted).toEqual({
      id: 1,
      todo: { title: 'Updated Title', completed: false },
    });
  });

  it('should emit cancel when cancel button is clicked', () => {
    let cancelled = false;
    component.cancel.subscribe(() => cancelled = true);

    const cancelButton = fixture.debugElement.queryAll(By.css('button'))[1];
    cancelButton.triggerEventHandler('click', {});

    expect(cancelled).toBe(true);
  });


  it('should disable submit button when form is invalid', () => {
    component.form.get('title')?.setValue('');
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(button.nativeElement.disabled).toBe(true);
  });

  it('should disable submit button when submitting', () => {
    componentRef.setInput('submitting', true);
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(button.nativeElement.disabled).toBe(true);
  });
});