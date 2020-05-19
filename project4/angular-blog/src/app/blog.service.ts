import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import * as jwt_decode from 'jwt-decode';

export class Post {
  postid: number;
  created: Date;
  modified: Date;
  title: string;
  body: string;
}

function getUsername() {
  var str = '; ' + document.cookie;
  var values = str.split('; ' + 'jwt' + '=');
  if (values.length == 2) {
    var cookie = values.pop().split(';').shift();
  }
  return jwt_decode(cookie).usr;
}

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  // private posts: Post[];
  // changed to not private for testing purposes
  posts: Post[];
  constructor(private http: HttpClient, private router: Router) {
    var username = getUsername();
    this.fetchPosts(username);
  }

  fetchPosts(username: string): Promise<Post> {
    let promise = new Promise<Post>(function (resolve, reject) {
      this.posts = [];
      this.http
        .get('/api/' + username)
        .subscribe((posts) => (this.posts = posts));
    });

    return promise;
  }

  // fetchPosts(username: string): Observable<Post[]> {
  //   return this.http.get<Post[]>('/api/' + username).pipe(
  //     tap((_) => console.log('fetched heroes')),
  //     catchError(this.handleError<Post[]>('getHeroes', []))
  //   );
  // }

  getPost(username: string, postid: number): Promise<Post> {
    let promise = new Promise<Post>(function (resolve, reject) {
      this.posts = [];
      this.http.find((post) => post.postid == postid);
    });

    return promise;
  }

  // getPost(postid: number): Post {
  //   return this.posts.find((post) => post.postid == postid);
  // }

  // newPost(username: string, post: Post): Promise<void> {
  //   let promise = new Promise<void>(function (resolve, reject) {});

  //   return promise;
  // }

  newPost(username: string): Observable<Post> {
    let new_id =
      this.posts.reduce((post1, post2) =>
        post1.postid > post2.postid ? post1 : post2
      ).postid + 1;
    let post: Post = {
      postid: new_id,
      created: new Date(),
      modified: new Date(),
      title: '',
      body: '',
    };
    this.posts.push(post);
    return this.http
      .post<Post>('/api/' + username + '/' + post.postid, {
        title: post.title,
        body: post.body,
      })
      .pipe(
        tap((newPost: Post) => {
          console.log(`added post with id ${newPost.postid}`);
          this.router.navigate(['/']);
        }),
        catchError(this.handleError<Post>('newPost'))
      );
  }

  updatePost(username: string, post: Post): Observable<any> {
    let previous = this.posts.find((curPost) => curPost.postid == post.postid);
    if (previous) {
      let i = this.posts.indexOf(previous);
      this.posts[i].title = post.title;
      this.posts[i].body = post.body;
      this.posts[i].modified = new Date();
      return this.http
        .put('/api/' + username + '/' + post.postid, {
          title: post.title,
          body: post.body,
        })
        .pipe(
          tap((_) => console.log(`updated post with id=${post.postid}`)),
          catchError(this.handleError<any>('updatePost'))
        );
    }
  }

  deletePost(username: string, postid: number): Observable<Post> {
    let post = this.posts.find((post) => post.postid == postid);
    if (post) {
      let i = this.posts.indexOf(post);
      this.posts.splice(i, 1);
      return this.http
        .delete<Post>('/api/' + username + '/' + post.postid)
        .pipe(
          tap((_) => console.log(`deleted post with id ${postid}`)),
          catchError(this.handleError<Post>('deletePost'))
        );
    }
  }

  // from angular.io/tutorial/toh-pt6

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
