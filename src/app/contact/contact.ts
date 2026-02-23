import { Component, AfterViewInit, OnDestroy, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ScrollService } from '../scroll';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact implements OnInit, AfterViewInit, OnDestroy {
  private revealObserver!: IntersectionObserver;
  private sectionObserver!: IntersectionObserver;
  private scrollSections = ['resume', 'contact'];
  private isManualNavigation = false;

  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  isSending = false;

  faqs = [
    {
      question: 'What is your preferred time zone?',
      answer: "<b>I'm based in the Philippines.</b> I'm flexible and happy to schedule meetings.",
      open: false
    },
    {
      question: 'Do you offer free consultations?',
      answer: "<b>Yes! I offer a free initial consultation</b> to discuss your project needs.",
      open: false
    },
    {
      question: 'How do we start a project together?',
      answer: "Simply fill out the contact form or reach out via email.",
      open: false
    }
  ];

  constructor(
    private ngZone: NgZone,
    private scrollService: ScrollService
  ) {}

  ngOnInit(): void {
    const intent = this.scrollService.intentSection();
    if (intent === 'contact') {
      this.isManualNavigation = true;
      this.scrollService.activeSection.set('contact');
      setTimeout(() => {
        this.isManualNavigation = false;
        this.scrollService.intentSection.set('');
      }, 1500);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.setupScrollReveal(), 300);
    setTimeout(() => this.observeSections(), 300);
  }

  ngOnDestroy(): void {
    this.revealObserver?.disconnect();
    this.sectionObserver?.disconnect();
  }

  private observeSections(): void {
    this.sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;

          // During manual nav to contact, only block resume from taking over
          if (this.isManualNavigation && id === 'resume') return;

          // Clear manual nav flag once user scrolls to any section naturally
          this.isManualNavigation = false;
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
      if (section) this.sectionObserver.observe(section);
    });
  }

  public sendEmail(e: Event) {
    e.preventDefault();
    if (this.isSending) return;
    this.isSending = true;

    const SERVICE_ID = 'service_8dwmb48';
    const TEMPLATE_ID = 'template_h8mfiqh';
    const PUBLIC_KEY = 'AnsdRxg8SzGf5IILq';

    emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      name: this.formData.name,
      email: this.formData.email,
      subject: this.formData.subject,
      message: this.formData.message,
    }, PUBLIC_KEY)
    .then((result: EmailJSResponseStatus) => {
      alert('Message sent successfully');
      this.formData = { name: '', email: '', subject: '', message: '' };
    }, (error: any) => {
      alert('Failed to send message. Please try again.');
      console.error(error.text);
    })
    .finally(() => { this.isSending = false; });
  }

  toggleFaq(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
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