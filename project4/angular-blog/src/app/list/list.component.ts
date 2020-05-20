import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Post, BlogService } from '../blog.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  posts: Post[];
  constructor(private blogService: BlogService, private router: Router) {}

  ngOnInit(): void {
    this.posts = this.blogService.getPosts();
  }
}
