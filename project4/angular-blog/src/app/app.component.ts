import { Component } from '@angular/core';
import { BlogService } from './blog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [BlogService],
})
export class AppComponent {
  title: string;

  constructor(private blogService: BlogService) {
    this.title = 'Angular Blog';
  }
}
