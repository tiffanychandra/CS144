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
  let str = '; ' + document.cookie;
  let values = str.split('; ' + 'jwt' + '=');
  if (values.length == 2) {
    var token = values.pop().split(';').shift();
  }
  return jwt_decode(token).usr;
}

@Injectable()
export class BlogService {
  private posts: Post[];
  postObservable: Observable<Post>;

  constructor(private http: HttpClient, private router: Router) {
    var username = getUsername();
    this.fetchPosts(username);
  }

  fetchPosts(username: string): void {
    if(this.authenticate()) {
      this.posts = [];
      this.http.get<Post[]>('/api/' + username).subscribe((posts) => {
        this.posts = posts;
      });
    }
  }

  getPosts(): Observable<Post[]> {
    if(this.authenticate()) {
      const username = getUsername();
      return this.http.get<Post[]>('/api/' + username).pipe(
        tap((_) => console.log('fetched posts')),
        catchError(this.handleError<Post[]>('getPosts', []))
      );
    }
  }

  getPost(postid: number): Post {
    if(this.authenticate()) {
      return this.posts.find((post) => post.postid === postid);
    }
  }

  newPost(): Observable<Post> {
    const username = getUsername();
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

  updatePost(post: Post): Observable<Post> {
    const username = getUsername();
    let old = this.posts.find((p) => p.postid === post.postid);
    if (old) {
      this.posts[this.posts.indexOf(old)].title = post.title;
      this.posts[this.posts.indexOf(old)].body = post.body;
      this.posts[this.posts.indexOf(old)].modified = new Date();
    }
    // post.modified = new Date();
    return this.http
      .put(
        '/api/' + username + '/' + post.postid,
        {
          title: post.title,
          body: post.body,
          modified: new Date(),
        },
        { responseType: 'text' }
      )
      .pipe(
        tap((_) => console.log(`updated post with id=${post.postid}`)),
        catchError(this.handleError<any>('updatePost'))
      );
    }
  }

  deletePost(postid: number): Observable<Post> {
    const username = getUsername();
    const url = `/api/${username}/${postid}`;

    return this.http.delete<Post>(url).pipe(
      tap((_) => console.log(`deleted hero id=${postid}`)),
      catchError(this.handleError<Post>('deletePost'))
    );
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

  private authenticate() : boolean {
    var key = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c";
    var token = getUsername();
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
}
