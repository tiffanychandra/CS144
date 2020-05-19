import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { BlogService } from './blog.service';

describe('BlogService', () => {
  let service: BlogService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BlogService]

    });
    service = TestBed.get(BlogService);
    httpTestingController = TestBed.get(HttpTestingController);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return posts',
    fakeAsync(() => {
    let response = {

    };

    // Perform a request (this is fakeAsync to the responce won't be called until tick() is called)
    service.fetchPosts('cs144');

    // Expect a call to this URL
    const req = httpTestingController.expectOne(
        '/api/cs144'
    );
    // Assert that the request is a GET.
    expect(req.request.method).toEqual("GET");
    // Respond with this data when called
    req.flush(response);

    // Call tick whic actually processes te response
    tick();

    // Run our tests
    expect(service.posts.length).toBe(2);
    // expect(service.results[0].artist).toBe("U2");
    // expect(service.results[0].name).toBe("Beautiful Day");
    // expect(service.results[0].thumbnail).toBe("image.jpg");
    // expect(service.results[0].artistId).toBe(78500);
})

  });
});
