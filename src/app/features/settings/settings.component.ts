import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { StorageService } from '../../core/services/storage.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSnackBarModule,
    RouterModule,
  ],
  template: `
    <div class="settings-page">
      <mat-toolbar color="primary">
        <button mat-icon-button routerLink="/todos">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span>Settings</span>
      </mat-toolbar>

      <div class="content">
        <mat-card>
          <mat-card-header>
            <mat-card-title>User Preferences</mat-card-title>
          </mat-card-header>
          
          <mat-card-content>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Theme</mat-label>
              <mat-select [(ngModel)]="theme" (selectionChange)="onThemeChange()">
                <mat-option value="light">Light</mat-option>
                <mat-option value="dark">Dark</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Language</mat-label>
              <mat-select [(ngModel)]="language" (selectionChange)="onLanguageChange()">
                <mat-option value="en">English</mat-option>
                <mat-option value="es">Spanish</mat-option>
                <mat-option value="fr">French</mat-option>
              </mat-select>
            </mat-form-field>
          </mat-card-content>
          
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="savePreferences()">
              Save Preferences
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="storage-card">
          <mat-card-header>
            <mat-card-title>Storage</mat-card-title>
          </mat-card-header>
          
          <mat-card-content>
            <p>Manage your local storage data.</p>
            <div class="storage-info">
              <span>Local Storage: {{ getLocalStorageSize() }} items</span>
              <span>Session Storage: {{ getSessionStorageSize() }} items</span>
            </div>
          </mat-card-content>
          
          <mat-card-actions>
            <button mat-button color="warn" (click)="clearAllData()">
              Clear All Data
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
      min-height: 100vh;
      background: #f5f5f5;
    }
    
    mat-toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .content {
      max-width: 600px;
      margin: 0 auto;
      padding: 24px;
    }
    
    mat-card {
      margin-bottom: 16px;
    }
    
    .full-width {
      width: 100%;
    }
    
    .storage-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin: 16px 0;
      color: #666;
    }
  `]
})
export class SettingsPageComponent {
  private storageService = inject(StorageService);
  private snackBar = inject(MatSnackBar);

  theme = this.storageService.getTheme();
  language = this.storageService.getLanguage();

  onThemeChange(): void {
    this.storageService.setTheme(this.theme);
  }

  onLanguageChange(): void {
    this.storageService.setLanguage(this.language);
  }

  savePreferences(): void {
    this.storageService.setTheme(this.theme);
    this.storageService.setLanguage(this.language);
    this.snackBar.open('Preferences saved successfully', 'Close', { duration: 3000 });
  }

  getLocalStorageSize(): number {
    return localStorage.length;
  }

  getSessionStorageSize(): number {
    return sessionStorage.length;
  }

  clearAllData(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.snackBar.open('All data cleared', 'Close', { duration: 3000 });
  }
}
