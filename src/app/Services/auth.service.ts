import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtDTO } from '../Components/login/models/jwt-dto';
import { LoginUsuario } from '../Components/login/models/login-usuario';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  authURL = 'http://clinicafisio-env.eba-692pmtcs.us-east-1.elasticbeanstalk.com/autentificacion';

  constructor(private httpClient: HttpClient) { }

  public login(loginUsuario: LoginUsuario): Observable<JwtDTO>{
    return this.httpClient.post<JwtDTO>(this.authURL+ '/login',loginUsuario);
  }


}
