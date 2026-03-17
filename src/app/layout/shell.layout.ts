import { Component, inject, signal, effect, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { StorageService } from '../core/services/storage.service';
import { Language, Theme } from './models/shell.layout.models';

@Component({
  selector: 'app-shell-layoutt',
  imports: [RouterModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './shell.layout.html',
  styleUrl: './shell.layout.scss',
})
export class ShellLayoutComponent {
  private readonly storageService = inject(StorageService);
  readonly theme = signal<Theme>(this.storageService.getTheme());
  readonly language = signal<Language>(this.storageService.getLanguage());

  toggleTheme() {
    const newTheme: Theme = this.theme() === 'primary' ? 'accent' : 'primary';
    this.storageService.setTheme(newTheme);
    this.theme.set(newTheme);
  }

  toggleLanguage() {
    const newLanguage: Language = this.language() === 'es' ? 'en' : 'es';
    this.storageService.setLanguage(newLanguage);
    this.language.set(newLanguage);
  }

}
