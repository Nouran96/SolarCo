import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GeoLoactionService } from 'src/app/shared/services/geo-loaction.service';
import { ShareService } from 'src/app/shared/services/share.service';
import { Router } from '@angular/router';
import { UserRequest } from 'src/app/shared/interfaces/user-request';
import { MapComponent } from './map/map.component';
import { AngularTokenService } from 'angular-token';
@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.css']
})
export class UserInputComponent implements OnInit {

  @ViewChild(MapComponent) child;

  client_request: object;
  // api_response: any;
  // permission: boolean = true;
  title: string = 'Pv-System Calculate';
  error: string;
  location: boolean = false;
  backup: boolean = false;

  constructor(private geolocation: GeoLoactionService,
    private http: HttpClient,
    private router: Router,
    private __service: ShareService,
    private tokenAuth: AngularTokenService) { }

  ngOnInit(): void {
    if (this.tokenAuth.userSignedIn() && this.tokenAuth['currentUserType'] == 'USER') {
      this.client_request = new Object();
    } else {
      this.router.navigate(['login']);
    }
  }

  getLoc() {
    this.location = !this.location;
  }

  confirm() {
    if (this.location) {
      this.client_request["lat"] = this.child.latitude;
      this.client_request["long"] = this.child.longitude;
      this.client_request["address"] = this.child.address;
    }
    if (this.client_request['consump'] && this.client_request['consump'] > 0) {
      this.geolocation.getLocation(this.client_request, response => {
        if (response && response['permission']) {
          if (this.client_request['src']) response['src'] = this.client_request['src'];
          response['backup'] = this.backup;
          this.__service.setData(response);
          this.router.navigate(['pv-system/calculate']);
        } else {
          this.error = "Some issues happens with your request, try it later!";
        }
      });
    } else {
      this.error = "Please fill the form with valid input!"
    }
  }

}

