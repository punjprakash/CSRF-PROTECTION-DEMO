import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="app-container">
      <header>
        <h1>CSRF Protection Demo</h1>
      </header>
      <main>
        <router-outlet></router-outlet>
      </main>
      <footer>
        <p>Angular 18 CSRF Protection Example</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    header {
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    footer {
      margin-top: 30px;
      padding-top: 10px;
      border-top: 1px solid #eee;
      text-align: center;
      color: #777;
    }
  `]
})
export class AppComponent {
  title = 'csrf-protection-demo';
}
