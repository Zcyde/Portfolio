import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, AfterViewInit {
  
  @ViewChild('navLinks') navLinks!: ElementRef;
  @ViewChild('navIndicator') navIndicator!: ElementRef;

  isDarkMode = false;
  activeSection: string = 'home';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Update active section based on current route
      this.updateActiveSection(event.urlAfterRedirects);
    });
  }

  ngAfterViewInit(): void {
    // Initialize indicator position
    setTimeout(() => {
      this.updateIndicatorFromRoute();
    }, 100);
  }

  // Update active section based on current URL
  private updateActiveSection(url: string): void {
    if (url.includes('/projects')) {
      this.activeSection = 'projects';
    } else if (url.includes('/contact')) {
      this.activeSection = 'contact';
    } else if (url === '/' || url.includes('/home')) {
      this.activeSection = 'home';
    }
    
    // Update indicator after route change
    setTimeout(() => {
      this.updateIndicatorFromRoute();
    }, 50);
  }

  // Update indicator based on current active link
  private updateIndicatorFromRoute(): void {
    if (window.innerWidth > 768) {
      const activeLink = this.navLinks.nativeElement.querySelector('a.active');
      if (activeLink) {
        this.moveIndicator(activeLink);
      }
    }
  }

  setActive(event: Event) {
    const clickedLink = event.target as HTMLElement;
    if (window.innerWidth > 768) {
      this.moveIndicator(clickedLink);
    }
  }

  moveIndicator(link: HTMLElement) {
    const linkRect = link.getBoundingClientRect();
    const menuRect = this.navLinks.nativeElement.getBoundingClientRect();
    
    const indicator = this.navIndicator.nativeElement;
    indicator.style.width = linkRect.width + 'px';
    indicator.style.left = (linkRect.left - menuRect.left) + 'px';
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.setAttribute(
      'data-theme', 
      this.isDarkMode ? 'dark' : 'light'
    );
  }

  scrollToSection(sectionId: string, event: Event) {
    event.preventDefault();
    this.activeSection = sectionId;

    this.router.navigate(['/home'], { fragment: sectionId }).then(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (sectionId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}