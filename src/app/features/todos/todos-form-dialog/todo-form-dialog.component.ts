import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TodoFormComponent } from "../components/todo-form/todo-form.component";
import { Todo, CreateTodoDto, UpdateTodoDto } from "../models/todo.model";

@Component({
  selector: 'app-todo-form-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TodoFormComponent],
  templateUrl: './todo-form-dialog.component.html'
})
export class TodoFormDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TodoFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'create' | 'edit'; todo?: Todo; existingTitles: string[] }
  ) {}

  onCreate(todo: CreateTodoDto): void {
    this.dialogRef.close(todo);
  }

  onUpdate(update: { id: number; todo: UpdateTodoDto }): void {
    this.dialogRef.close(update.todo);
  }
}