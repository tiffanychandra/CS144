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
    var token = values.pop().split(';').shift();
  }
  return jwt_decode(token).usr;
}

@Injectable()
export class BlogService {
  private posts: Post[];
  constructor(private http: HttpClient, private router: Router) {
    var username = getUsername();
    this.fetchPosts(username);
  }

  fetchPosts(username: string): void {
    this.posts = [];
    this.http.get<Post[]>('/api/' + username).subscribe((posts) => {
      this.posts = posts;
    });
  }

  getPosts(): Observable<Post[]> {
    var username = getUsername();
    return this.http.get<Post[]>('/api/' + username).pipe(
      tap((_) => console.log('fetched posts')),
      catchError(this.handleError<Post[]>('getPosts', []))
    );
  }

  getPost(postid: number): Observable<Post> {
    const url = `/api/${getUsername()}/${postid}`;
    return this.http.get<Post>(url).pipe(
      tap((_) => console.log(`fetched post id=${postid}`)),
      catchError(this.handleError<Post>(`getPost id=${postid}`))
    );
  }

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

  updatePost(post: Post): Observable<any> {
    var username = getUsername();
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

  deletePost(postid: number): Observable<Post> {
    var username = getUsername();

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
