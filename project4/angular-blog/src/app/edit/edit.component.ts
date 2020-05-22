import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Post, BlogService } from '../blog.service';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  @Input() post: Post;
  form: FormGroup;

  constructor(
    private blogService: BlogService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(() => this.getPost());
  }

  getPost(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.blogService.getPost(id).subscribe((post) => (this.post = post));
    if (this.post) {
      this.form = new FormGroup({
        title: new FormControl(this.post.title),
        body: new FormControl(this.post.body),
      });
    }
  }

  save(): void {
    this.blogService.updatePost(this.post).subscribe();
    this.form.markAsPristine();
  }

  preview(): void {
    if (this.form.dirty) {
      this.save();
    }
    this.router.navigate(['preview', this.post.postid]);
  }

  delete(): void {
    this.blogService.deletePost(this.post.postid).subscribe();
    this.router.navigate(['/']);
  }
}
