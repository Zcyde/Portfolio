import { Component, AfterViewInit, OnDestroy } from '@angular/core';

interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  link: string;
  thumbnail: string;
  featured?: boolean;
}

@Component({
  selector: 'app-projects',
  imports: [],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class Projects implements AfterViewInit, OnDestroy {

  private revealObserver!: IntersectionObserver;

  featuredProject: Project = {
    id: 1,
    title: 'FilSafe Enterprises',
    description: 'Hardcoded client website I designed with complete backend and is SEO optimized.',
    techStack: ['Angular', 'Node.js', 'MongoDB'],
    link: 'https://filsafe.shop/',
    featured: true,
    thumbnail: 'Filsafe-thumbnail.png'
  };

  otherProjects: Project[] = [
    {
      id: 1,
      title: 'DoMore — Planner Web Application',
      description: 'A fullstack web-based planner system unifying task and file management into one seamless workspace.',
      techStack: ['Angular', 'Express.js', 'MongoDB',],
      link: 'https://domore-student-planner.netlify.app',
      featured: true,
      thumbnail: 'DoMore-thumbnail.png'
    },

    {
      id: 2,
      title: 'DineSmart — Web-based Reservation System',
      description: 'A web-based reservation platform UI/UX design for buffets and unlimited type restaurants.',
      techStack: ['UI/UX', 'Figma'],
      link: 'https://www.figma.com/proto/FEIF2RApyICgdIuohSyzLr/DineSmart-Design?page-id=0%3A1&node-id=1-222&p=f&viewport=25%2C181%2C0.15&t=0zE2WED8ThXKqQGg-1&scaling=min-zoom&content-scaling=fixed',
      thumbnail: 'DineSmart-thumbnail.png'
    },

    {
      id: 3,
      title: 'Sole Purpose — Static E-commerce Shoe Website',
      description: 'A shoe E-commerce website designed with HTML and CSS, focused on clean product presentation and UX.',
      techStack: ['HTML', 'CSS'],
      link: 'https://solepurposeshop.netlify.app',
      thumbnail: 'SolePurpose-thumbnail.png',
    },
  ];

  ngAfterViewInit(): void {
    setTimeout(() => this.setupScrollReveal(), 300);
  }

  ngOnDestroy(): void {
    this.revealObserver?.disconnect();
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
      { root: null, rootMargin: '0px 0px -80px 0px', threshold: 0.1 }
    );

    document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up')
      .forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          el.classList.add('in-view');
        } else {
          this.revealObserver.observe(el);
        }
      });
  }
}