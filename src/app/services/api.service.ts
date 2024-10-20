import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://api.'; 
  private token: string | null = null;  
  // let token = localStorage.getItem('token');
  // token= token === null? undefined: token;
  // this.helper.isTokenExpired(token);

  constructor(private http: HttpClient, private router: Router) {
    this.token = localStorage.getItem('token'); 
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.logout();
    }
    return throwError('Ocurrió un error, intente de nuevo.');
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    if (this.token) {
      headers = headers.set('Authorization', `Bearer ${this.token}`);
    }

    return headers;
  }

  // // Función de login
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          console.log('API response:', response);  // Log para verificar la respuesta
          
          try {
            if (response.token) {
              this.token = response.token;
              console.log('Guardando el token:', this.token);  // Verifica si el token está presente
              window.localStorage.setItem('token', this.token);
            } else {
              console.error('Token no presente en la respuesta');
            }
          } catch (e) {
            console.error('Error al guardar el token en localStorage', e);
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  //Alternativa sin tap (opcional para prueba)
  // login(username: string, password: string): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}/login`, { username, password })
  //     .pipe(
  //       catchError(this.handleError.bind(this))
  //     ).subscribe(response => {
  //       console.log('API response:', response);  // Log para verificar la respuesta
  //       if (response.token) {
  //         this.token = response.token;
  //         localStorage.setItem('token', this.token);  // Guarda el token en localStorage
  //       }
  //     });
  // }

  // Función de logout
  logout() {
    this.token = null;  
    localStorage.removeItem('token');  
    this.router.navigate(['/login']);
  }

  // Obtener datos protegidos
  getData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/data`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError.bind(this)));
  }

  // Verificar si está logueado
  isLoggedIn(): boolean {
    return !!this.token;  
  }
}

