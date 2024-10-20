import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  data: any;
  constructor(private apiService: ApiService){}
ngOnInit() {
    this.apiService.getData().subscribe(
      data => this.data=data,
      error => console.error('Error fetching data', error)
    );
}
logout(){
  this.apiService.logout();
}
}
