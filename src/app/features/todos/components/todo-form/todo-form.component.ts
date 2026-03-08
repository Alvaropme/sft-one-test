import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, inject, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Title</mat-label>
        <input matInput formControlName="title" placeholder="Enter todo title">
        @if (form.get('title')?.hasError('required') && form.get('title')?.touched) {
          <mat-error>Title is required</mat-error>
        }
        @if (form.get('title')?.hasError('minlength') && form.get('title')?.touched) {
          <mat-error>Title must be at least 3 characters</mat-error>
        }
        @if (form.get('title')?.hasError('maxlength') && form.get('title')?.touched) {
          <mat-error>Title must not exceed 100 characters</mat-error>
        }
        @if (form.get('title')?.hasError('duplicate') && form.get('title')?.touched) {
          <mat-error>This title already exists</mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>User ID</mat-label>
        <input matInput type="number" formControlName="userId" placeholder="Enter user ID">
        @if (form.get('userId')?.hasError('required') && form.get('userId')?.touched) {
          <mat-error>User ID is required</mat-error>
        }
        @if (form.get('userId')?.hasError('min') && form.get('userId')?.touched) {
          <mat-error>User ID must be at least 1</mat-error>
        }
      </mat-form-field>

      <mat-checkbox formControlName="completed">Completed</mat-checkbox>

      <div class="form-actions">
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || submitting">
          @if (submitting) {
            <mat-spinner diameter="20"></mat-spinner>
          } @else {
            {{ isEditMode ? 'Update' : 'Create' }}
          }
        </button>
        <button mat-button type="button" (click)="cancel.emit()">Cancel</button>
      </div>
    </form>
  `,
  styles: [`
    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .full-width {
      width: 100%;
    }
    
    mat-checkbox {
      margin: 8px 0;
    }
    
    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 8px;
    }
    
    mat-spinner {
      display: inline-block;
    }
  `]
})
export class TodoFormComponent implements OnInit, AfterViewInit {
  @Input() todo: Todo | null = null;
  @Input() existingTitles: string[] = [];
  @Input() submitting = false;
  
  @Output() create = new EventEmitter<CreateTodoDto>();
  @Output() update = new EventEmitter<{ id: number; todo: UpdateTodoDto }>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  isEditMode = false;

  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.isEditMode = !!this.todo;
    this.initForm();
  }

  ngAfterViewInit(): void {
    if (this.todo) {
      this.form.patchValue({
        title: this.todo.title,
        userId: this.todo.userId,
        completed: this.todo.completed,
      });
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
        [this.duplicateTitleValidator()],
      ],
      userId: [
        1,
        [
          Validators.required,
          Validators.min(1),
        ],
      ],
      completed: [false],
    });
  }

  private duplicateTitleValidator() {
    return (control: import('@angular/forms').AbstractControl) => {
      const title = control.value?.toLowerCase().trim();
      if (title && this.existingTitles.includes(title)) {
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

    if (this.isEditMode && this.todo) {
      this.update.emit({
        id: this.todo.id,
        todo: { title, completed },
      });
    } else {
      this.create.emit({
        title,
        userId: Number(userId),
        completed: Boolean(completed),
      });
    }
  }
}
