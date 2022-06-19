import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { PacienteServiceService } from 'src/app/Services/paciente-service.service';
import { TokenService } from 'src/app/Services/token.service';
import Swal from 'sweetalert2';
import { LoginUsuario } from './models/login-usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuariosLoginForm!: FormGroup;

  isLogged = false;
  isLoginFail = false;

  username: string = '';
  password: string = '';

  errMsj: string = '';
  loginUsuario: LoginUsuario | undefined;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router,
    private readonly formBuilder: FormBuilder,
    private pacienteService: PacienteServiceService
  ) { }

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.isLoginFail = false;
    }
    this.usuariosLoginForm = this.iniciarFormulario();
  }

  // Aplica validaciones al formulario
  iniciarFormulario(): FormGroup {
    return this.formBuilder.group(
      {
        username: ["", Validators.required],
        password: ["", Validators.required]
      }
    );
  }

  // Se controla el inicio de sesión
  onLogin(): void {
    // let spinner = document.getElementById("spinner");
    // spinner!.style.display = "block";

    this.loginUsuario = new LoginUsuario(this.username, this.password);
    this.authService.login(this.loginUsuario).subscribe(
      data => {
        this.isLogged = true;
        this.isLoginFail = false;

        this.tokenService.setToken(data.token);

        // this.tokenPasswordCambiada();

        this.router.navigate(['/inicio']).then(() => {
          window.location.reload();
        });
      },
      err => {
        this.isLogged = false;
        this.isLoginFail = true;
        this.errMsj = err.error.error;
        const bod = document.getElementById("bod");
        Swal.fire("Error al iniciar sesión", this.errMsj, "error");
        bod?.classList.remove("swal2-height-auto"); // Elimina dicha clase del body para no generar problemas en la vista

        // Oculta el circulo de carga
        // let spinner = document.getElementById("spinner");
        // spinner!.style.display = "none";
      }
    );

  }

  // Elimina el token para cerrar la sesión
  cerrarSesion(): void {
    this.tokenService.logOut();
    this.isLogged = false;
    this.isLoginFail = false;
  }

}
