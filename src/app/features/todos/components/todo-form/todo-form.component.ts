import { Component, inject, computed, input, output, effect } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CreateTodoDto, UpdateTodoDto, Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.scss',
})
export class TodoFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly todo = input<Todo | null>(null);
  readonly existingTitles = input<string[]>([]);
  readonly submitting = input(false);

  readonly create = output<CreateTodoDto>();
  readonly update = output<{ id: number; todo: UpdateTodoDto }>();
  readonly cancel = output<void>();

  readonly isEditMode = computed(() => !!this.todo());
  readonly form: FormGroup = this.buildForm();
  
  

  constructor() {
  effect(() => {
    const todo = this.todo();
    if (todo) {
      this.form.patchValue({
        title: todo.title,
        userId: todo.userId,
        completed: todo.completed,
      });
    }
  });
}

  private buildForm(): FormGroup {
  return this.fb.group({
    title: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
      [this.duplicateTitleValidator()],
    ],
    userId: [
      1,
      [Validators.required, Validators.min(1)],
    ],
    completed: [false],
  });
}

  private duplicateTitleValidator() {
    return (control: AbstractControl) => {
      const title = control.value?.toLowerCase().trim();
      if (title && this.existingTitles().includes(title)) {
        return Promise.resolve({ duplicate: true });
      }
      return Promise.resolve(null);
    };
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { title, userId, completed } = this.form.value;

    if (this.isEditMode() && this.todo()) {
      this.update.emit({ id: this.todo()!.id, todo: { title, completed } });
    } else {
      this.create.emit({ title, userId: Number(userId), completed: Boolean(completed) });
    }
  }
}