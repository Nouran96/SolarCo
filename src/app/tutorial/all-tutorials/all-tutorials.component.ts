import { Component, OnInit } from '@angular/core';
import { TutorialService } from 'src/app/shared/services/tutorial.service';
import { AngularTokenService } from 'angular-token';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-all-tutorials',
  templateUrl: './all-tutorials.component.html',
  styleUrls: ['./all-tutorials.component.css']
})
export class AllTutorialsComponent implements OnInit {

  title: string = "Blog";
  tutorials = new Array;
  p: number = 1;
  isLoading: boolean = true;
  noResponse: boolean = false;
  category: any;
  contractor: any;
  user: any;
  successMsg: string;
  warningMsg: string;

  constructor(private __service: TutorialService,
    public tokenAuth: AngularTokenService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    setTimeout(() => { this.timeOut() }, 40000);
    // console.log(this.tokenAuth);
    if (this.router.url.includes('categories')) {
      this.route.params.subscribe(params => {
        if (Number.isInteger(+params['id'])) {
          this.tutorialsByCat(+params['id']);
        } else {
          this.router.navigate(['404']);
        }
      })
    } else if (this.router.url.includes('contractors')) {
      this.route.params.subscribe(params => {
        if (Number.isInteger(+params['id'])) {
          this.tutorialsByCon(+params['id']);
        } else {
          this.router.navigate(['404']);
        }
      })
    } else if (this.router.url.includes('users') && this.tokenAuth.userSignedIn() && this.tokenAuth['currentUserType'] == 'USER') {
      this.route.params.subscribe(params => {
        if (Number.isInteger(+params['id'])) {
          this.tutorialsByFav(+params['id']);
        } else {
          this.router.navigate(['404']);
        }
      })
    } else {
      this.allTutorials();
    }
  }

  allTutorials() {
    this.tutorials = new Array;
    this.__service.getTutorials().subscribe(
      (response) => {
        if (response) {
          this.tutorials = response;
        }
        setTimeout(() => {
          this.isLoading = false;
        }, 300);
      },
      (error) => {
        setTimeout(() => {
          this.isLoading = false;
        }, 300);
        this.warningMsg = error.error.error;
      });
  }

  tutorialsByCat(id) {
    this.tutorials = new Array;
    this.__service.getTutorialsByCategory(id).subscribe(
      (response) => {
        if (response) {
          this.tutorials = response;
          if (response['length'] > 0) this.category = response[0].category;
        }
        setTimeout(() => {
          this.isLoading = false;
        }, 300);
      },
      (error) => {
        setTimeout(() => {
          this.isLoading = false;
        }, 300);
        this.warningMsg = error.error.error;
      });
  }

  tutorialsByCon(id) {
    this.tutorials = new Array;
    this.__service.getTutorialsByContractor(id).subscribe(
      (response) => {
        if (response) {
          this.tutorials = response;
          if (response['length'] > 0) this.contractor = response[0].contractor;
        }
        setTimeout(() => {
          this.isLoading = false;
        }, 300);
      },
      (error) => {
        setTimeout(() => {
          this.isLoading = false;
        }, 300);
        this.warningMsg = error.error.error;
      });
  }

  tutorialsByFav(id) {
    this.tutorials = new Array;
    this.__service.getUserFavorites(id).subscribe(
      (response) => {
        if (response) {
          for (let res of response) {
            this.tutorials.push(res['tutorial']);
          }
          if (response['length'] > 0) this.user = response[0].user;
        }
        setTimeout(() => {
          this.isLoading = false;
        }, 300);
      },
      (error) => {
        setTimeout(() => {
          this.isLoading = false;
        }, 300);
        this.warningMsg = error.error.error;
      });
  }

  addFav(tutorial_id) {
    if (this.tokenAuth.userSignedIn() && this.tokenAuth['currentUserType'] == 'USER') {
      this.__service.setFavorite({ "tutorial_id": tutorial_id }).subscribe(
        (res) => {
          if (res && res['exist']) {
            this.warningMsg = res['exist'];
          } else {
            this.successMsg = "added Successfully!";
          }
        },
        (error) => {
          this.warningMsg = error.error.error;
        });
    }
  }

  favRemove(tutorial_id) {
    if (this.tokenAuth.userSignedIn() && this.tokenAuth['currentUserType'] == 'USER') {
      if (this.user) {
        this.__service.deleteFavorite(tutorial_id).subscribe(
          (res) => {
            this.tutorials = this.tutorials.filter(item => item.id !== tutorial_id);
          },
          (error) => {
            this.warningMsg = error.error.error;
          });
      }
    }
  }

  tutRemove(tutorial_id) {
    if (this.tokenAuth.userSignedIn() && this.tokenAuth['currentUserType'] == 'CONTRACTOR' && this.tokenAuth['userData']['id'] == this.contractor.id) {
      if (this.contractor) {
        this.__service.deleteTutorial(tutorial_id).subscribe(
          (res) => {
            this.tutorials = this.tutorials.filter(item => item.id !== tutorial_id);
          },
          (error) => {
            this.warningMsg = error.error.error;
          });
      }
    }
  }
  timeOut() {
    if (this.isLoading == true) {
      this.noResponse = true;
      this.isLoading = false;
    }
  }

  //scroll up whenever you change the page on pagination
  pageChanged(event) {
    this.p = event;
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 30); // how far to scroll on each step
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 8);
  }

}
