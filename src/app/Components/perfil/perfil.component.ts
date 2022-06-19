import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultaServiceService } from 'src/app/Services/consulta-service.service';
import { PacienteServiceService } from 'src/app/Services/paciente-service.service';
import { TokenService } from 'src/app/Services/token.service';
import Swal from 'sweetalert2';
import { Consulta } from '../consultas/consulta';
import { Paciente } from '../pacientes/paciente';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {


  dniUsuario = this.tokenService.getDniByToken(localStorage.getItem('AuthToken')!)
  role = this.tokenService.roleToken(localStorage.getItem('AuthToken')!)

  usuario!: Paciente
  fisio!: Paciente

  consultas: Consulta[] = []

  listado: any[] = []
  historialListado: any[] =[]
  verHistorial: Boolean = false


  //Proxima Consulta del Paciente
  nextConsulta!: Consulta

  constructor(
    private tokenService: TokenService,
    private pacienteService: PacienteServiceService,
    private consultaService: ConsultaServiceService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cargarUsuario();
    this.cargarConsultas();
  }




  // Cargar usuario datos del usuario loggeado
  cargarUsuario():void{
    this.pacienteService.getPacienteByDni(this.dniUsuario).subscribe(
      response=>{
        this.usuario = response
        if(response.role='paciente'){
          this.cargarFisioPaciente();
        }
      }
    )
  }

  cambiarHistorial():void{

    this.listado = []

    this.verHistorial = !this.verHistorial

    this.cargarConsultas();

  }

  //Cargar consultas del empleado/paciente
  cargarConsultas(): void{
    if(this.role=="empleado"){
      this.activatedRoute.params.subscribe(
        params => {
          this.pacienteService.getPacientes().subscribe(
            pacientes => {
              pacientes.forEach(p =>{
                if(p.idFisio==params['idUsuario']){
                  this.pacienteService.getConsultasFromPaciente(p.id).subscribe(
                    response => {
                      response.forEach(c =>{

                        let hoy = new Date()
                        hoy.setDate(hoy.getDate()-1)
                        let fecha = new Date(c.fecha)

                        if(this.verHistorial){
                          if(hoy>fecha){
                            this.listado.push({p,c})
                          }

                        }else{
                          if(hoy<fecha || hoy.getTime()==fecha.getTime()){
                            this.listado.push({p,c})
                          }
                        }
                      })
                    }
                  )
                }
              })

            }
          )
        }
      )



    }else if(this.role=="paciente"){
      this.pacienteService.getPacienteByDni(this.dniUsuario).subscribe(
        response => this.pacienteService.getConsultasFromPaciente(response.id).subscribe(
         consultas => {
          consultas.forEach(c=>{
                  let hoy = new Date()
                  hoy.setDate(hoy.getDate()-1)
                  let fecha = new Date(c.fecha)

                  if(hoy<fecha){
                    this.consultas.push(c)
                  }
          })
        }
        )
      )



    }
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

  cargarFisioPaciente():void{
    this.pacienteService.getPacienteById(this.usuario.idFisio).subscribe(
      response => this.fisio = response
    )
  }

}
