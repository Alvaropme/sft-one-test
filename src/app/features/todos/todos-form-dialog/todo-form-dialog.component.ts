import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { TodoFormComponent } from '../components/todo-form/todo-form.component';
import { Todo, CreateTodoDto, UpdateTodoDto } from '../models/todo.model';

export interface TodoFormDialogData {
  mode: 'create' | 'edit';
  todo?: Todo;
  existingTitles: string[];
}

@Component({
  selector: 'app-todo-form-dialog',
  standalone: true,
  imports: [MatDialogModule, TodoFormComponent],
  templateUrl: './todo-form-dialog.component.html',
})
export class TodoFormDialogComponent {
  readonly dialogRef = inject(MatDialogRef<TodoFormDialogComponent>);
  readonly data = inject<TodoFormDialogData>(MAT_DIALOG_DATA);

  onCreate(todo: CreateTodoDto): void {
    this.dialogRef.close(todo);
  }

  onUpdate(update: { id: number; todo: UpdateTodoDto }): void {
    this.dialogRef.close(update.todo);
  }
}