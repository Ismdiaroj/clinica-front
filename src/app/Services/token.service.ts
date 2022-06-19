import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Paciente } from '../Components/pacientes/paciente';
import { PacienteServiceService } from './paciente-service.service';


const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUserName';
let isRole = '';
let dni = '';



@Injectable({
  providedIn: 'root'
})
export class TokenService {

  roles: Array<string> = [];

  paciente!: Paciente;

  constructor(private pacienteService: PacienteServiceService) { }

  //Guarda el Token anterior y almacena el nuevo en el localStorage
  public setToken(token: string): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  //Obtiene el Token del localStorage
  public getToken(): string {
    return localStorage.getItem(TOKEN_KEY)!;
  }

   //Obtiene el nombre de usuario desde el localStorage
   public getUserName(): string {
    return JSON.parse(localStorage.getItem(USERNAME_KEY)!);
  }

  //Método para obtener el rol a partir del Token
  public roleToken(token: string): string {
    if (token != null) {
      let jwtData = token.split('.')[1];
      let amb = atob(jwtData);
      let decodedJwtData = JSON.parse(amb);
      let isRole = decodedJwtData.role;
      return isRole;
    } else {
      isRole = '';
      return isRole;
    }
  }

  // Método para obtener el DNI a partir del Token
  public getDniByToken(token: string): string {
    if (token != null) {
      let jwtData = token.split('.')[1];
      let amb = atob(jwtData);
      let decodedJwtData = JSON.parse(amb);
      let dni = decodedJwtData.dni;
      return dni;
    } else {
      dni = '';
      return dni;
    }
  }

  //Elimina los datos del localStorage al cerrar sesión
  public logOut(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("passwordChanged");
  }

}
