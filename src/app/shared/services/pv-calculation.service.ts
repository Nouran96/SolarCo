import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalService } from './global.service'
@Injectable()
export class PvCalculationService {

  constructor(private http: HttpClient,
              private api: GlobalService) { }

  private apiCal:String = `${this.api.host}/calculations`;

  // delete
  delCalculation(calc_id){
    this.http.delete(`${this.apiCal}/${calc_id}`).subscribe();
  }

  // get/:id
  getCalculation(calc_id, callback){
    this.http.get(`${this.apiCal}/${calc_id}`).subscribe(response =>{
      console.log(response);
      callback(response);
    });
  }
  // get
  getCalculations(callback){
    this.http.get(`${this.apiCal}`).subscribe(response =>{
      console.log(response);
      callback(response);
    });
  }

  private apiSys:String = `${this.api.host}/systems`;

  // post
  setSystem(system_data, callback){
    this.http.post(`${this.apiSys}`, system_data).subscribe(response =>{
      console.log(response);
      callback(response);
    });
  }

  // get
  getSystems(callback){
    this.http.get(`${this.apiSys}`).subscribe(response =>{
      console.log(response);
      callback(response);
    });
  }
  
}
