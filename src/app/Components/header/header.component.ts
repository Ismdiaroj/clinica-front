import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PacienteServiceService } from 'src/app/Services/paciente-service.service';
import { TokenService } from 'src/app/Services/token.service';
import Swal from 'sweetalert2';
import { Paciente } from '../pacientes/paciente';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  role = this.tokenService.roleToken(localStorage.getItem('AuthToken')!)
  dniUsuario = this.tokenService.getDniByToken(localStorage.getItem('AuthToken')!)
  passwordChanged!: Boolean
  usuario!: Paciente


  idUsuario=0

  isLogged=true

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private pacienteService: PacienteServiceService
  ) { }


  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }
    this.cargarUsuario();
  }


  iniciarSesion(){
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  cerrarSesion(){
    Swal.fire({
      title: '¿Realmente quieres cerrar sesión?',
      showCancelButton: true,
      confirmButtonText: 'Cerrar Sesión',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.tokenService.logOut();
        this.isLogged = false;
        this.router.navigate(['/inicio']);
        Swal.fire('Has cerrado sesión correctamente', '', 'success');
      }
    }).then(() => {
      window.location.reload();
    });

  }

  cargarUsuario():void{
    this.pacienteService.getPacienteByDni(this.dniUsuario).subscribe(
      response=>this.usuario= response
    )
  }

}
