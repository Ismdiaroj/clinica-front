import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ConsultaServiceService } from 'src/app/Services/consulta-service.service';
import { PacienteServiceService } from 'src/app/Services/paciente-service.service';
import Swal from 'sweetalert2';
import { Paciente } from '../pacientes/paciente';
import { Consulta } from './consulta';

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css']
})
export class ConsultasComponent implements OnInit {

  consultas: Consulta[] = []

  paciente!: Paciente

  constructor(
    private consultaService: ConsultaServiceService,
    private pacienteService: PacienteServiceService,
    private activetedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cargarPaciente();
    this.cargarConsultas();
  }



  cargarPaciente():void{
    this.activetedRoute.params.subscribe(params =>{
      let id = params['id']
      this.pacienteService.getPacienteById(id).subscribe(
        response => {
          this.paciente = response
        }
      )
    })
  }

  cargarConsultas():void{
    this.activetedRoute.params.subscribe(params =>{
      let id = params['id']
      this.pacienteService.getConsultasFromPaciente(id).subscribe(
        response => {
          this.consultas = response
        }
      )

    })
  }

  eliminarConsulta(consulta: Consulta):void{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger me-2'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro?',
      text: "¿Seguro que deseas eliminar esta Consulta?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then((result: any) => {
      if (result.isConfirmed) {
              this.consultaService.deleteConsulta(consulta.id).subscribe(
                response => {
                  this.consultas = this.consultas?.filter(c => c !== consulta);
                  swalWithBootstrapButtons.fire(
                    "Consulta eliminada",
                    "",
                    "success"
                  );
                }
              )
          }


    });
  }

}
