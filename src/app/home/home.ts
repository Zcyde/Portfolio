import { Component, OnInit, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ScrollService } from '../scroll';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, AfterViewInit, OnDestroy {
  
  private typingRoles = [
    'Third year IT Web-Development Student',
    'Aspiring Full-Stack Developer and',
    'Cloud Engineer'
  ];
  private roleIndex = 0;
  private charIndex = 0;
  private typingSpeed = 100;
  private pauseBetweenLines = 500;
  private pauseBeforeRestart = 10000;

  private observer!: IntersectionObserver;
  private revealObserver!: IntersectionObserver;
  private scrollSections = ['home', 'about'];

  constructor(
    private ngZone: NgZone,
    private scrollService: ScrollService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const intent = this.scrollService.intentSection();
    if (intent === 'about') {
      this.scrollService.activeSection.set('about');
      setTimeout(() => {
        this.scrollService.intentSection.set('');
      }, 1500);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.typeEffect(), 1000);
    setTimeout(() => this.observeSections(), 300);
    setTimeout(() => this.setupScrollReveal(), 300);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.revealObserver?.disconnect();
  }

  private observeSections(): void {
    this.observer?.disconnect();

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const intent = this.scrollService.intentSection();

          // If navigating to 'about', block 'home' from overriding
          if (intent === 'about' && id === 'home') return;

          this.scrollService.intentSection.set('');
          this.ngZone.run(() => {
            this.scrollService.activeSection.set(id);
          });
        }
      });
    }, {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: 0
    });

    this.scrollSections.forEach(id => {
      const section = document.getElementById(id);
      if (section) this.observer.observe(section);
    });
  }

  private setupScrollReveal(): void {
    this.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            this.revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
      }
    );

    document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up')
      .forEach(el => this.revealObserver.observe(el));
  }

  private typeEffect(): void {
    const typingElement = document.getElementById('typingText');
    if (!typingElement) return;

    const currentRole = this.typingRoles[this.roleIndex];
    let fullText = '';
    for (let i = 0; i < this.roleIndex; i++) {
      fullText += this.typingRoles[i] + '<br>';
    }
    fullText += currentRole.substring(0, this.charIndex + 1);
    typingElement.innerHTML = fullText;
    this.charIndex++;

    if (this.charIndex === currentRole.length) {
      this.roleIndex++;
      this.charIndex = 0;
      if (this.roleIndex < this.typingRoles.length) {
        setTimeout(() => this.typeEffect(), this.pauseBetweenLines);
        return;
      } else {
        setTimeout(() => {
          this.roleIndex = 0;
          this.charIndex = 0;
          this.typeEffect();
        }, this.pauseBeforeRestart);
        return;
      }
    }
    setTimeout(() => this.typeEffect(), this.typingSpeed);
  }

  goToContact() {
    this.scrollService.intentSection.set('contact');
    this.scrollService.activeSection.set('contact');
    this.router.navigate(['/contact'], { fragment: 'contact' }).then(() => {
      setTimeout(() => {
        const element = document.getElementById('contact');
        if (element) {
          const navbarHeight = 80;
          const elementTop = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: elementTop - navbarHeight, behavior: 'smooth' });
        }
      }, 300);
    });
  }

  scrollTo(section: string) {
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  }
}