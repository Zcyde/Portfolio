import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  constructor(private router: Router) {}

  scrollToSection(sectionId: string, event: Event) {
    event.preventDefault();

    if (sectionId === 'projects') {
      this.router.navigate(['/projects']).then(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      return;
    }

    const route = (sectionId === 'resume' || sectionId === 'contact') ? '/contact' : '/home';

    this.router.navigate([route], { fragment: sectionId }).then(() => {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const navbarHeight = 80;
          const elementTop = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: elementTop - navbarHeight, behavior: 'smooth' });
        } else if (sectionId === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    });
  }
}