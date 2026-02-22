import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {

  faqs = [
    {
      question: 'What is your preferred time zone?',
      answer: "I'm based in the Philippines (PST, UTC+8). I'm flexible and happy to schedule meetings that work across different time zones.",
      open: false
    },
    {
      question: 'Do you offer free consultations?',
      answer: "Yes! I offer a free initial consultation to discuss your project needs, goals, and how I can help bring your ideas to life.",
      open: false
    },
    {
      question: 'How do we start a project together?',
      answer: "Simply fill out the contact form or reach out via email. We'll set up a quick call to align on scope, timeline, and deliverables.",
      open: false
    }
  ];

  toggleFaq(index: number) {
  this.faqs[index].open = !this.faqs[index].open;
}

}