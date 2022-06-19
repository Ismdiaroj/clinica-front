import { Component, OnInit } from '@angular/core';
import { PacienteServiceService } from 'src/app/Services/paciente-service.service';
import Swal from 'sweetalert2';
import { Paciente } from './paciente';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit {

  pacientes !: Paciente[]

  constructor(
    private pacienteService: PacienteServiceService
  ) { }

  ngOnInit(): void {

    this.cargarPacientes();

  }


  cargarPacientes(): void{
    this.pacienteService.getPacientes().subscribe(
      response => this.pacientes = response
    )
  }

  //Eliminar un Paciente mediate ID

  eliminarPaciente(paciente: Paciente):void{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger me-2'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro?',
      text: "¿Seguro que deseas eliminar el Usuario '" + paciente.nombre + "'?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then((result: any) => {
      if (result.isConfirmed) {
        let consultasPaciente:number = 0;
        this.pacienteService.getConsultasFromPaciente(paciente.id!).subscribe(
          response => {
            consultasPaciente = response.length;
            if (consultasPaciente == 0) {
              this.pacienteService.deletePaciente(paciente.id).subscribe(
                response => {
                  this.pacientes = this.pacientes?.filter(p => p !== paciente);
                  swalWithBootstrapButtons.fire(
                    "Usuario eliminada",
                    "Usuario '" + paciente.nombre + "' eliminado correctamente",
                    "success"
                  );
                }
              )
            } else {
              swalWithBootstrapButtons.fire(
                "Error al eliminar la iniciativa",
                "No se puede eliminar la iniciativa '" + paciente.nombre + "' porque tiene usuarios asignados.",
                "warning"
              );
            }
          }
        )
      }
    });

  }

}
