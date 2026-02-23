import { Component, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import { ScrollService } from '../scroll';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule,],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact implements AfterViewInit, OnDestroy {
  private revealObserver!: IntersectionObserver;
  private sectionObserver!: IntersectionObserver;  // add this
  private scrollSections = ['resume', 'contact'];

   constructor(
    private ngZone: NgZone,           // add this
    private scrollService: ScrollService  // add this
  ) {}

  ngOnInit(): void {}

  private observeSections(): void {
    this.sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.ngZone.run(() => {
            this.scrollService.activeSection.set(entry.target.id);
          });
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40% 0px',
      threshold: 0
    });

    this.scrollSections.forEach(id => {
      const section = document.getElementById(id);
      if (section) this.sectionObserver.observe(section);
    });
  }

  // 1. Form Data
  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  isSending = false;

  // 2. FAQ Data
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

  // 3. Email Logic
  public sendEmail(e: Event) {
    e.preventDefault();
    if (this.isSending) return;

    this.isSending = true;

    // REPLACE THESE WITH YOUR ACTUAL KEYS FROM EMAILJS
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
    .finally(() => {
        this.isSending = false;
    });
  }

  // 4. Existing Lifecycle & UI Logic
  ngAfterViewInit(): void {
    setTimeout(() => this.setupScrollReveal(), 300);
    setTimeout(() => this.observeSections(), 300);
  }

  ngOnDestroy(): void {
    this.revealObserver?.disconnect();
     this.sectionObserver?.disconnect();
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