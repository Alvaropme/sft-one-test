import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-main-layout',
  imports: [MatToolbarModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {

}
