import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post, BlogService } from '../blog.service';

import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})

export class ListComponent implements OnInit {
  posts: Post[];
  constructor(private blogService: BlogService, private router: Router) {}

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts(): void {
    this.blogService.getPosts().subscribe((posts) => (this.posts = posts));
  }

  createPost(): void {
    if(this.authenticate()) {
      let postid;
      this.blogService.newPost().subscribe((post) => {
        this.posts.push(post);
        postid = post.postid;
      });
      this.blogService.getPosts().subscribe((posts) => (this.posts = posts));
      this.router.navigate(['edit', postid + 1]);
    }
  }

  private authenticate() : boolean {
    var key = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c";
    var token = this.getUsername();
    var auth;
    if (!token) {
      this.router.navigate(['/login?redirect=/editor/']);
      return false;
    }
    try {
      auth = jwt_decode.verify(token, key);
    } catch (e) {
      this.router.navigate(['/login?redirect=/editor/']);
      return false;
    }
    if (auth.exp <= Math.floor(Date.now() / 1000)) {
      this.router.navigate(['/login?redirect=/editor/']);
      return false;
    } 
    return true;
  }

  private getUsername() {
    let str = '; ' + document.cookie;
    let values = str.split('; ' + 'jwt' + '=');
    if (values.length == 2) {
      var token = values.pop().split(';').shift();
    }
    return jwt_decode(token).usr;
  }
}
