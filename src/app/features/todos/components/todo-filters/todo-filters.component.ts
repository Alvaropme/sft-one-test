import { Component, inject, DestroyRef, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { TodoFilter } from '../../models/todo.model';

@Component({
  selector: 'app-todo-filters',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './todo-filters.component.html',
  styleUrl: './todo-filters.component.scss',
})
export class TodoFiltersComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly DEBOUNCE_TIME = 300;

  readonly filterChange = output<TodoFilter>();
  readonly search = signal('');
  readonly status = signal<string>('');

  constructor() {
    toObservable(this.search).pipe(
      debounceTime(this.DEBOUNCE_TIME),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.emitFilter());
  }

  onSearchChange(value: string): void {
    this.search.set(value);
  }

  onStatusChange(value: string): void {
    this.status.set(value);
    this.emitFilter();
  }

  clearSearch(): void {
    this.search.set('');
  }

  clearStatus(): void {
    this.status.set('');
    this.emitFilter();
  }

  clearAllFilters(): void {
    this.search.set('');
    this.status.set('');
    this.emitFilter();
  }

  private emitFilter(): void {
    this.filterChange.emit({
      search: this.search() || undefined,
      completed: this.status() === '' ? undefined : this.status() === 'true',
    });
  }
}