import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import {Router,ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-login',
    templateUrl: './login.component.html',
  styleUrl: './login.component.css'
  
})

export class LoginComponent {
  username: string= '';
  password: string= '';

  constructor (
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
  ){}
  onSubmit(){
    this.apiService.login(this.username, this.password). subscribe(
      () => {
        const returnUrl= this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error => {
        console.error('Login failed', error);
      }
    );
  }
  }

