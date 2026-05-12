import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  toggleTheme() {
    const htmlElement = document.documentElement;
    htmlElement.classList.toggle('dark');
  }
}
