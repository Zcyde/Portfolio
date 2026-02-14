import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

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
    // Theme preference logic
  }

  ngAfterViewInit(): void {
    // Initialize indicator position
    setTimeout(() => {
      const activeLink = this.navLinks.nativeElement.querySelector('a.active');
      if (activeLink && window.innerWidth > 768) {
        this.moveIndicator(activeLink);
      }
    }, 100);
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