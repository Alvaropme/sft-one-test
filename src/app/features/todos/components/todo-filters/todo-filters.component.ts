import { Component, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { debounceTime, Subject } from 'rxjs';
import { TodoFilter } from '../../models/todo.model';

@Component({
  selector: 'app-todo-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="filters-container">
      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Search</mat-label>
        <input 
          matInput 
          [ngModel]="search()" 
          (ngModelChange)="onSearchChange($event)"
          placeholder="Search todos...">
        <mat-icon matPrefix>search</mat-icon>
        @if (search()) {
          <button matSuffix mat-icon-button (click)="clearSearch()">
            <mat-icon>close</mat-icon>
          </button>
        }
      </mat-form-field>

      <mat-form-field appearance="outline" class="status-field">
        <mat-label>Status</mat-label>
        <mat-select [ngModel]="status()" (ngModelChange)="onStatusChange($event)">
          <mat-option value="">All</mat-option>
          <mat-option value="true">Completed</mat-option>
          <mat-option value="false">Pending</mat-option>
        </mat-select>
      </mat-form-field>

      <div class="active-filters">
        @if (search() || status()) {
          <mat-chip-set>
            @if (search()) {
              <mat-chip (removed)="clearSearch()">
                Search: {{ search() }}
                <button matChipRemove>
                  <mat-icon>cancel</mat-icon>
                </button>
              </mat-chip>
            }
            @if (status()) {
              <mat-chip (removed)="clearStatus()">
                Status: {{ status() === 'true' ? 'Completed' : 'Pending' }}
                <button matChipRemove>
                  <mat-icon>cancel</mat-icon>
                </button>
              </mat-chip>
            }
          </mat-chip-set>
          <button mat-button (click)="clearAllFilters()">Clear All</button>
        }
      </div>
    </div>
  `,
  styles: [`
    .filters-container {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: flex-start;
      margin-bottom: 16px;
    }
    
    .search-field {
      flex: 1;
      min-width: 200px;
    }
    
    .status-field {
      min-width: 150px;
    }
    
    .active-filters {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
  `]
})
export class TodoFiltersComponent {
  @Output() filterChange = new EventEmitter<TodoFilter>();

  search = signal('');
  status = signal<string>('');

  private searchSubject = new Subject<string>();
  private debounceTime = 300;

  constructor() {
    this.searchSubject.pipe(debounceTime(this.debounceTime)).subscribe(search => {
      this.emitFilter();
    });
  }

  onSearchChange(value: string): void {
    this.search.set(value);
    this.searchSubject.next(value);
  }

  onStatusChange(value: string): void {
    this.status.set(value);
    this.emitFilter();
  }

  clearSearch(): void {
    this.search.set('');
    this.emitFilter();
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
    const filter: TodoFilter = {
      search: this.search() || undefined,
      completed: this.status() === '' ? undefined : this.status() === 'true',
    };
    this.filterChange.emit(filter);
  }
}
