import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, NgZone, ChangeDetectorRef, effect } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { ScrollService } from '../scroll';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('navLinks') navLinks!: ElementRef;
  @ViewChild('navIndicator') navIndicator!: ElementRef;

  isDarkMode = false;
  activeSection: string = 'home';

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,       // *** NEW ***
    private scrollService: ScrollService
  ) {
    effect(() => {
      this.activeSection = this.scrollService.activeSection();
      this.cdr.detectChanges();            // *** NEW: force re-render ***
      // Delay indicator update until after DOM reflects new active class
      setTimeout(() => this.updateIndicatorFromRoute(), 60);
    });
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      if (!url.startsWith('/home') && url !== '/') {
        this.updateActiveSection(url);
        this.cdr.detectChanges();          // *** NEW ***
      }
      setTimeout(() => this.updateIndicatorFromRoute(), 100);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.updateIndicatorFromRoute(), 100);
  }

  ngOnDestroy(): void {}

  private updateActiveSection(url: string): void {
    if (url.includes('/projects')) {
      this.activeSection = 'projects';
    } else if (url.includes('/contact#resume')) {
      this.activeSection = 'resume';
    } else if (url.includes('/contact')) {
      this.activeSection = 'contact';
    }else if (url === '/' || url.includes('/home')) {
      this.activeSection = 'home';
    }
  }

  private updateIndicatorFromRoute(): void {
    if (window.innerWidth > 768) {
      const activeLink = this.navLinks?.nativeElement.querySelector('a.active');
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
    document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
  }

  scrollToSection(sectionId: string, event: Event) {
    event.preventDefault();
    this.activeSection = sectionId;

    const route = (sectionId === 'resume') ? '/contact' : (sectionId === 'contact') ? '/contact' : '/home';

    this.router.navigate([route], {fragment: sectionId}).then(() => {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const navbarHeight = 80;
          const elementTop = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementTop - navbarHeight,
            behavior: 'smooth'
          }); 
        } else if (sectionId === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    });
  }
}