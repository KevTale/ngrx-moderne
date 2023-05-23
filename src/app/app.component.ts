import { RouterLink, RouterOutlet } from '@angular/router';

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header>
      <nav>
        <a routerLink="todos">Todos</a>
        <a routerLink="products">Products</a>
      </nav>
    </header>
    <main>
      <router-outlet />
    </main>
    <footer>some footer</footer>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      header {
        background: #eee;
        padding: 1rem;
      }
      header nav {
        display: flex;
        gap: 1rem;
      }
      main {
        flex-grow: 1;
        padding: 1rem;
      }
      footer {
        background: #eee;
        padding: 1rem;
      }
    `,
  ],
})
export class AppComponent {}
