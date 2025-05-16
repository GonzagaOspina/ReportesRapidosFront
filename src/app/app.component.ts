import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

import { HeaderComponent } from './componenetes/header/header.component';
import { FooterComponent } from './componenetes/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    HeaderComponent, // 👈 Aquí lo agregas
    FooterComponent  // 👈 Y aquí también
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'VS_ReportesRapidos';
}