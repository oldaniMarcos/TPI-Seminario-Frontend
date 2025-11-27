import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
//import { AuthService } from '../services/auth.service';
import { catchError, firstValueFrom, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router
        , //private authService: AuthService
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
  //   const expected = route.data['role'] as string;

  //   // const res = await firstValueFrom(this.authService.fetchDetails().pipe(
  //   //   catchError(() => of({ role: null }))
  //   // ));

  //   if (res.role === expected) {
  //     return true;
  //   }

  //   this.router.navigate(['/not-authorized']);
    return false;
  }
}
