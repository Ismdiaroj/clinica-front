import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Paciente } from '../Components/pacientes/paciente';
import Swal from 'sweetalert2';
import { Consulta } from '../Components/consultas/consulta';

@Injectable({
  providedIn: 'root'
})
export class PacienteServiceService {

  private urlEndPoint: string = "http://clinicafisio-env.eba-692pmtcs.us-east-1.elasticbeanstalk.com/pacientes";

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });


  errores!: string;


  constructor(
    private http: HttpClient,
    private router: Router
  ) { }


  // Get Pacientes
    getPacientes(): Observable<Paciente[]>{
      return this.http.get(`${this.urlEndPoint}/get-all`).pipe(
        map((response)=> response as Paciente[])
      )
    }


    //Post Pacientes
    postPaciente(paciente: Paciente):Observable<Paciente>{
      return this.http.post<Paciente>(`${this.urlEndPoint}/add`,paciente,{headers: this.httpHeaders}).pipe(
        catchError(e=>{ // todo gestionar errores
          return throwError(e);
        })
      )
    }


    // Actualizar paciente
    putPaciente(paciente: Paciente): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.urlEndPoint}/update/${paciente.id}`, paciente, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        if(e.status == 400) {
          this.errores = e.error.errors.toString();
          Swal.fire("Fallo al intentar modificar paciente", this.errores, "error");
        }
        else {
          console.error(e.error.mensaje);
          Swal.fire("Error al editar iniciativa", e.error.mensaje, "error");
        }
        return throwError(e);
      })
    );
  }


  // Eliminar Paciente
  deletePaciente(id: any): Observable<Paciente> {
    return this.http.delete<Paciente>(`${this.urlEndPoint}/delete/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        Swal.fire("Error al eliminar paciente", e.error.mensaje, "error");
        return throwError(e);
      })
    );
  }



  // Recoger las Consultas de un Paciente
  getConsultasFromPaciente(id: number): Observable<Consulta[]> {
    return this.http.get(this.urlEndPoint + `/consultas/${id}`).pipe(
      map((response) => response as Consulta[])
    );
  }


  // Obtener Paciente por ID
  getPacienteById(id: number):Observable<Paciente>{
    return this.http.get<Paciente>(`${this.urlEndPoint}/get-by-id/${id}`).pipe(
      catchError(e => {
        if (e.status == 404) {
          Swal.fire('Error', 'No es posible encontrar el usuario con ID: ' + id, 'error');
          this.router.navigate(['/usuarios']);
          return throwError(e);
        }
        return throwError(e);
      })
    )
  }

  // Obtener Paciente por DNI
  getPacienteByDni(dni: string):Observable<Paciente>{
    return this.http.get<Paciente>(`${this.urlEndPoint}/get-by-dni/${dni}`).pipe(
      catchError(e => {
        if (e.status == 404) {
          Swal.fire('Error', 'No es posible encontrar el usuario con DNI: ' + dni, 'error');
          this.router.navigate(['/usuarios']);
          return throwError(e);
        }
        return throwError(e);
      })
    )
  }

}
