import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, AfterViewInit {
  
  // Typing effect variables
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

  constructor() {}

  ngOnInit(): void {
    // Component initialization
  }

  ngAfterViewInit(): void {
    // Start typing effect after view loads
    setTimeout(() => this.typeEffect(), 1000);
  }

  // Typing effect method - types each line, keeps them, then restarts
  private typeEffect(): void {
    const typingElement = document.getElementById('typingText');
    if (!typingElement) return;

    const currentRole = this.typingRoles[this.roleIndex];
    
    // Build the text with all previous lines
    let fullText = '';
    for (let i = 0; i < this.roleIndex; i++) {
      fullText += this.typingRoles[i] + '<br>';
    }
    fullText += currentRole.substring(0, this.charIndex + 1);
    
    typingElement.innerHTML = fullText;
    this.charIndex++;

    // Check if we finished typing the current role
    if (this.charIndex === currentRole.length) {
      this.roleIndex++;
      this.charIndex = 0;
      
      // If there are more roles to type
      if (this.roleIndex < this.typingRoles.length) {
        setTimeout(() => this.typeEffect(), this.pauseBetweenLines);
        return;
      } else {
        // All lines typed, pause then restart
        setTimeout(() => {
          this.roleIndex = 0;
          this.charIndex = 0;
          this.typeEffect();
        }, this.pauseBeforeRestart);
        return;
      }
    }

    // Continue typing
    setTimeout(() => this.typeEffect(), this.typingSpeed);
  }

  // Your existing scroll method
  scrollTo(section: string) {
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  }
}