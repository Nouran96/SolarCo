import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/shared/services/post.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ShareService } from 'src/app/shared/services/share.service';
import { AngularTokenService } from 'angular-token';
@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.css']
})
export class SinglePostComponent implements OnInit {
  offers = [];
  userData;
  post;
  title: string = `Post`;
  errorMessage: string = '';
  isLoading: boolean = true;
  noResponse: boolean = false;
  currentUserID: any;
  applied: boolean = false;
  approved: boolean = false;
  constructor(private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private __service: ShareService,
    public tokenAuth: AngularTokenService) { }

  ngOnInit(): void {
    setTimeout(() => {this.timeOut()}, 40000);
    this.tokenAuth.validateToken().subscribe(
      res => {
        this.userData = this.tokenAuth.currentUserData;
        this.route.params.subscribe(params => {
          if (Number.isInteger(+params['id'])) {
            this.getPost(+params['id']);
          } else {
            this.router.navigate(['404']);
          }
        });
      },
      error => console.log(error)
    );
  }

  getPost(id) {
    this.currentUserID = this.tokenAuth.currentUserData.id.toString();
    this.postService.getPost(id).subscribe((res) => {
      this.post = res;
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
       // For Apply button
      let userOffer = this.post.offers.filter(offer => offer.contractor_id == this.currentUserID);
      if (userOffer.length > 0) {
        this.applied = true;
      }
      this.title = `${this.post.user.name}\'s Post`;
      console.log(this.post)
    }, (err) => {
      this.errorMessage = err.error.error;
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    });
  }

  deletePost(id) {
    this.postService.deletePost(id).subscribe()
    this.router.navigate(['/profile/posts'])
  }

  sendId(id) {
    this.router.navigate(['/offers/new'], { queryParams: { id: id }, queryParamsHandling: 'merge' });
  }

  onDeleteOffer() {
    this.applied = false;
  }

  onApproveOffer() {
    this.approved = true;
  }

  timeOut() {
    if (this.isLoading == true) {
      this.noResponse = true;
      this.isLoading = false;
    }
  }
}
