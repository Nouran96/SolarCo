import { Component, OnInit } from '@angular/core';
import { PvCalculationService } from '../../shared/services/pv-calculation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ShareService } from 'src/app/shared/services/share.service';

@Component({
  selector: 'app-pv-system',
  templateUrl: './pv-system.component.html',
  styleUrls: ['./pv-system.component.css']
})
export class PvSystemComponent implements OnInit {

  system_data: object;

  constructor(private data: PvCalculationService, 
              private route: ActivatedRoute,
              private router: Router,
              private __service: ShareService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.getSystemDetails(+params['id']);
    });
  }

  getSystemDetails(id){
    this.data.getSystem(id, response =>{
      if(response){
        this.system_data = response;
      }else{
        this.router.navigate(['user-input']);
      }
    });
  }

  publish(){
    if (!this.system_data['published']){
      this.__service.setData(this.system_data);
      this.router.navigate(['create/post']);
    } else {
      console.log("this Post is published");
    }
  }

  profile(){
    this.__service.setData(this.system_data);
    this.router.navigate(['profile']);
  }

  cancel(){
    this.data.delSystem(this.system_data['calculation']['id']);
    this.router.navigate(['system-info']);
  }

}
