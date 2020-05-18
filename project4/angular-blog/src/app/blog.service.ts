import { Injectable } from '@angular/core';
<<<<<<< HEAD
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

const jwt_decode = require('jwt_decode')
=======
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import * as jwt_decode from 'jwt-decode';
>>>>>>> a4cafb54e08a559d696af8dbf2625144bac5fdee

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
<<<<<<< HEAD
  constructor(private http: HttpClient) {}

  fetchPosts(username: string): Promise<Post> {
    let promise = new Promise<Post>(function(resolve, reject) {
      this.posts = []; 
      this.http.get('/api/' + username)
        .subscribe(posts => this.posts = posts);
    });

    return promise;
  }

  getPost(username: string, postid: number): Promise<Post> {
    let promise = new Promise<Post>(function(resolve, reject) {
      this.posts = []; 
      this.http.find(post => post.postid = postid)
    });

    return promise;
  }

  newPost(username: string, post: Post): Promise<void> {
    let promise = new Promise<void>(function(resolve, reject) {
      
    });

    return promise;
  }
=======
  constructor(private http: HttpClientModule) {}

  // TO DO
  // fetchPosts(username: string): Post[] {

  // }

  // getPost(username: string, postid: number): Post {

  // }

  // newPost(username: string, post: Post): void {

  // }
>>>>>>> a4cafb54e08a559d696af8dbf2625144bac5fdee

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
