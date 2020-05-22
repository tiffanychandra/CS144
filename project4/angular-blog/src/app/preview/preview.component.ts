import { Component, OnInit } from '@angular/core';
import { Parser, HtmlRenderer } from 'commonmark';
import { Post, BlogService } from '../blog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
	post: Post;
	parser: Parser;
	htmlRenderer: HtmlRenderer;
	postHTML: String;

  constructor(
  	private blogService: BlogService,
    private router: Router,
    private route: ActivatedRoute
   ) { }

  ngOnInit(): void {
  	this.parser = new Parser();
  	this.htmlRenderer = new HtmlRenderer;
  	this.route.params.subscribe(() => this.getPostHTML());
  }

  getPostHTML(): void {
  	const id = +this.route.snapshot.paramMap.get('id');
    this.blogService.getPost(id).subscribe((post) => (this.post = post));
    if (this.post) {
    	console.log("testing");
  		this.postHTML = this.htmlRenderer.render(this.parser.parse(this.post.title)) 
  						+ this.htmlRenderer.render(this.parser.parse(this.post.body));

  	}
  }

  // navigate to edit post
  editPost(): void {
    this.router.navigate(['edit', this.post.postid]);
  }

}
