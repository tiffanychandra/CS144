import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import * as jwt_decode from 'jwt-decode';

export class Post {
  postid: number;
  created: Date;
  modified: Date;
  title: string;
  body: string;
}

// function getUsername() {
//   var str = '; ' + document.cookie;
//   var values = str.split('; ' + 'jwt' + '=');
//   if (values.length == 2) {
//     var cookie = values.pop().split(';').shift();
//   }
//   return jwt_decode(cookie).usr;
// }

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private posts: Post[];
  constructor(private http: HttpClientModule) {}

  // TO DO
  // fetchPosts(username: string): Post[] {

  // }

  // getPost(username: string, postid: number): Post {

  // }

  // newPost(username: string, post: Post): void {

  // }

  updatePost(username: string, post: Post): void {
    let previous = this.posts.find((curPost) => curPost.postid == post.postid);
    if (previous) {
      let i = this.posts.indexOf(previous);
      this.posts[i].title = post.title;
      this.posts[i].body = post.body;
      this.posts[i].modified = new Date();
      this.http
        .put('/api/' + username + '/' + post.postid, {
          title: post.title,
          body: post.body,
        })
        .subscribe(console.log());
    }
  }

  deletePost(username: string, postid: number): void {
    let post = this.posts.find((post) => post.postid == postid);
    if (post) {
      let i = this.posts.indexOf(post);
      this.posts.splice(i, 1);
      this.http
        .delete('/api/' + username + '/' + post.postid)
        .subscribe(console.log());
    }
  }

  // performed as local operations, no need to implement for express server
  // setCurrentDraft(post: Post): void {

  // }

  // getCurrentDraft(): Post {

  // }
}
