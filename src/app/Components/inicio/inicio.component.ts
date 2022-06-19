import { Component, OnInit } from '@angular/core';
import { PacienteServiceService } from 'src/app/Services/paciente-service.service';
import { TokenService } from 'src/app/Services/token.service';
import { Consulta } from '../consultas/consulta';
import { Paciente } from '../pacientes/paciente';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {


  consultas: Consulta[] = [];
  usuarios: Paciente[] = [];
  usuario!: Paciente

  passwordChanged!: Boolean;

  dniUsuario = this.tokenService.getDniByToken(localStorage.getItem('AuthToken')!)
  role = this.tokenService.roleToken(localStorage.getItem('AuthToken')!)


  // ID del Usuario que ha iniciado sesión
  idUsuario!: number;
  nombreUsuario!: string;


  constructor(
    private tokenService: TokenService,
    private pacienteService: PacienteServiceService
  ) { }

  ngOnInit(): void {
    this.cargarUsuario();
    this.cargarConsultas();

  }

  cargarConsultas():void{
    this.pacienteService.getPacientes().subscribe(
      response => {
        response.forEach(paciente=>{
          if(paciente.idFisio==this.usuario.id){
            this.usuarios.push(paciente)
            this.pacienteService.getConsultasFromPaciente(paciente.id).subscribe(
              cons=>{
                cons.forEach(c=>{
                  this.consultas.push(c)
                })
              }
            )
          }
        })
      }
    )
  }


  // Cargar usuario datos del usuario loggeado
  cargarUsuario():void{
    this.pacienteService.getPacienteByDni(this.dniUsuario).subscribe(
      response=>{
        this.usuario = response
      }
    )
  }



}
