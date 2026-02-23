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
  private revealObserver!: IntersectionObserver;  // ← class property declared here
  private scrollSections = ['home', 'about'];

  constructor(
    private ngZone: NgZone,
    private scrollService: ScrollService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => this.typeEffect(), 1000);
    setTimeout(() => this.observeSections(), 300);
    setTimeout(() => this.setupScrollReveal(), 300);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.revealObserver?.disconnect();  // ← now this can actually reach it
  }

  private observeSections(): void {
    this.observer?.disconnect();

    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px 0px -40% 0px',
      threshold: 0
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.ngZone.run(() => {
            this.scrollService.activeSection.set(entry.target.id);
          });
        }
      });
    }, options);

    this.scrollSections.forEach(id => {
      const section = document.getElementById(id);
      if (section) this.observer.observe(section);
    });
  }

  private setupScrollReveal(): void {
    this.revealObserver = new IntersectionObserver(   // ← assigns to class property
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            this.revealObserver.unobserve(entry.target);  // ← uses class property
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
      .forEach(el => this.revealObserver.observe(el));  // ← uses class property
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
  this.router.navigate(['/contact'], { fragment: 'contact' }).then(() => {
    setTimeout(() => {
      const element = document.getElementById('contact');
      if (element) {
        const navbarHeight = 80;
        const elementTop = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: elementTop - navbarHeight, behavior: 'smooth' });
      }
    }, 200);
  });
}

  scrollTo(section: string) {
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  }
}