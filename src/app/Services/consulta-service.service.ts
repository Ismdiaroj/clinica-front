import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Cons, map, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Consulta } from '../Components/consultas/consulta';

@Injectable({
  providedIn: 'root'
})
export class ConsultaServiceService {

  private urlEndPoint: string = "http://clinicafisio-env.eba-692pmtcs.us-east-1.elasticbeanstalk.com/consultas";

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  errores!: string;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }


     // Get Pacientes
     getConsultas(): Observable<Consulta[]>{
      return this.http.get(`${this.urlEndPoint}/get-all`).pipe(
        map((response)=> response as Consulta[])
      )
    }

    //Post Pacientes
    postConsulta(consulta: Consulta):Observable<Consulta>{
      return this.http.post<Consulta>(`${this.urlEndPoint}/add`,consulta,{headers: this.httpHeaders}).pipe(
        catchError(e=>{ // todo gestionar errores
          return throwError(e);
        })
      )
    }

    // Actualizar consulta
    putConsulta(consulta: Consulta): Observable<Consulta> {
      return this.http.put<Consulta>(`${this.urlEndPoint}/update/${consulta.id}`, consulta, {headers: this.httpHeaders}).pipe(
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


  // Obtener Consulta por ID
  getConsultaById(id: number):Observable<Consulta>{
    return this.http.get<Consulta>(`${this.urlEndPoint}/get-by-id/${id}`).pipe(
      catchError(e => {
        if (e.status == 404) {
          Swal.fire('Error', 'No es posible encontrar la consulta con ID: ' + id, 'error');
          this.router.navigate(['/consultas']);
          return throwError(e);
        }
        return throwError(e);
      })
    )
  }

  deleteConsulta(id: number):Observable<Consulta>{
    return this.http.delete<Consulta>(`${this.urlEndPoint}/delete/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        Swal.fire("Error al eliminar la consulta", e.error.mensaje, "error");
        return throwError(e);
      })
    );
  }


}
