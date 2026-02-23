import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { provideRouter, withComponentInputBinding, withInMemoryScrolling,} from '@angular/router';
import { routes } from './app.routes';
import { ApplicationConfig,} from '@angular/core';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  isDarkMode: boolean = false;

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    
    // This toggles a class on the entire body of the website
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, 
      withInMemoryScrolling({ 
        anchorScrolling: 'enabled', // This enables the jump to #id
        scrollPositionRestoration: 'top',
        
      })
    )
  ]
};

