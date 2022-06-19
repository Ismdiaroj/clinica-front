import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from 'src/app/Services/token.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthLoggedGuard implements CanActivate {

  role = this.tokenService.roleToken(localStorage.getItem('AuthToken')!)
  acceso = false;

  constructor(
    private router: Router,
    private tokenService: TokenService,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (!this.role) { // "Role no encontrado" => redireccion al login

        this.router.navigate(['/login']).then(() => {
          return true;
        });

      } else { // "Role encontrado"

          if (this.role == "paciente" || "empleado") { // Sí tiene acceso
            this.acceso = true;
          } else { // No tiene acceso
            this.acceso = false;
            this.router.navigate(['/inicio']);
          }


      }
      return this.acceso;
    }


}
