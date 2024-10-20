import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { ApiService } from '../services/api.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let apiService: jasmine.SpyObj<ApiService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['isLoggedIn']);
    const routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: Router, useValue: routerSpy },
      ]
    });

    guard = TestBed.inject(AuthGuard);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when user is logged in', () => {
    apiService.isLoggedIn.and.returnValue(true);
    const dummyRoute = {} as ActivatedRouteSnapshot;
    const dummyState = { url: '/protected' } as RouterStateSnapshot;
    
    const result = guard.canActivate(dummyRoute, dummyState);
    
    expect(result).toBe(true);
    expect(apiService.isLoggedIn).toHaveBeenCalled();
  });

  it('should redirect to login when user is not logged in', () => {
    apiService.isLoggedIn.and.returnValue(false);
    const dummyRoute = {} as ActivatedRouteSnapshot;
    const dummyState = { url: '/protected' } as RouterStateSnapshot;
    const mockUrlTree = new UrlTree();
    
    router.createUrlTree.and.returnValue(mockUrlTree);
    
    const result = guard.canActivate(dummyRoute, dummyState);
    
    expect(result).toBe(mockUrlTree);
    expect(apiService.isLoggedIn).toHaveBeenCalled();
    expect(router.createUrlTree).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/protected' }});
  });
});