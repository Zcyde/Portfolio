import { Component, AfterViewInit, OnDestroy, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ScrollService } from '../scroll';
import { Title, Meta } from '@angular/platform-browser'; 
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
    private scrollService: ScrollService,
    private titleService: Title, 
    private metaService: Meta    
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Contact | Eldrin Josh Pineda');
    this.metaService.updateTag({ name: 'description', content: 'Get in touch with Eldrin Josh Pineda' });
    this.metaService.updateTag({ property: 'og:title', content: 'Contact & Resume | Eldrin Josh Pineda' });
    this.metaService.updateTag({ property: 'og:description', content: 'Get in touch with Eldrin Josh Pineda. View his resume, certifications, tech stack, and send a message directly through the contact form.' });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });

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

          if (this.isManualNavigation && id === 'resume') return;

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

    formErrors = {
    name: false,
    email: false,
    emailInvalid: false,
    subject: false,
    message: false
  };

  public sendEmail(e: Event) {
    e.preventDefault();
    if (this.isSending) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Reset errors
    this.formErrors = { name: false, email: false, emailInvalid: false, subject: false, message: false };

    // Validate
    if (!this.formData.name.trim()) this.formErrors.name = true;
    if (!this.formData.email.trim()) this.formErrors.email = true;
    else if (!emailRegex.test(this.formData.email)) this.formErrors.emailInvalid = true;
    if (!this.formData.subject.trim()) this.formErrors.subject = true;
    if (!this.formData.message.trim()) this.formErrors.message = true;

    if (Object.values(this.formErrors).some(v => v)) return;

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
      this.formErrors = { name: false, email: false, emailInvalid: false, subject: false, message: false };
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