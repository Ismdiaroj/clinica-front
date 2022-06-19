import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultaServiceService } from 'src/app/Services/consulta-service.service';
import { PacienteServiceService } from 'src/app/Services/paciente-service.service';
import { TokenService } from 'src/app/Services/token.service';
import Swal from 'sweetalert2';
import { Paciente } from '../../pacientes/paciente';
import { Consulta } from '../consulta';

@Component({
  selector: 'app-consultas-form',
  templateUrl: './consultas-form.component.html',
  styleUrls: ['./consultas-form.component.css']
})
export class ConsultasFormComponent implements OnInit {

  consultasForm!: FormGroup;

  titulo1 = "Formulario para pedir una Consulta";
  titulo2 = "Formulario para editar una Consulta";
  textoTitulo: boolean = true;
  pacienteLogeado!: Paciente


  consulta: Consulta = new Consulta();
  pacientes: Paciente[] = []

  dniUsuario = this.tokenService.getDniByToken(localStorage.getItem('AuthToken')!)
  role = this.tokenService.roleToken(localStorage.getItem('AuthToken')!)

  constructor(
    private tokenService: TokenService,
    private consultaService: ConsultaServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private pacienteService: PacienteServiceService,
    private readonly formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.cargarPacientes();
    this.cargarConsulta();
    this.seleccionarTipoForm();
    this.cargarPacienteLogeado();
  }


  // Aplica validaciones al formulario
  iniciarFormulario(): FormGroup {
    return this.formBuilder.group(
     {
       fecha: ["", Validators.required],
       idPaciente: ["",Validators.required],
       seguro: ["",Validators.required],
       tratamiento: [""],
        evolucion: [""],

     }
   );
 }


  // Aplica validaciones al formulario
  iniciarFormularioEditar(): FormGroup {
    return this.formBuilder.group(
      {
        tratamiento: [""],
        evolucion: [""],
        seguro: [""],
        fecha: ["", Validators.required],
        idPaciente: ["",Validators.required],

      }
   );
 }

 seleccionarTipoForm():void{
  if(!this.textoTitulo){
    this.consultasForm = this.iniciarFormularioEditar()
  }else{
    this.consultasForm = this.iniciarFormulario()
  }
 }

 cargarPacientes():void{
  this.pacienteService.getPacientes().subscribe(
    response => {
      response.forEach(paciente =>{
        if(paciente.role=="paciente" && paciente.activo){
          this.pacientes.push(paciente)
        }
      })
    }
  );

 }


// Lee el ID pasado por URL si existe carga la consulta
cargarConsulta():void{
  this.activatedRoute.params.subscribe(params=>{
    let idConsulta = params['idConsulta']
    let idPaciente = params['idPaciente']
    if(idConsulta){
      this.textoTitulo=false
      this.consultaService.getConsultaById(idConsulta).subscribe( response => {
       this.consulta = response

       });
    }
  })
}


 // Crear iniciativa
  crearConsulta(): void {
    this.consultaService.postConsulta(this.consulta).subscribe(
      response => {
        this.router.navigate(['/usuarios']),
        Swal.fire(
          "Consulta creada",
          "",
          "success"
        );
      }
    );
  }

   // Actualizar iniciativa
   actualizarConsulta(): void {
    this.consultaService.putConsulta(this.consulta).subscribe(
      response => {
        this.router.navigate(['/usuarios']);
        Swal.fire(
          "Consulta actualizada",
          "",
          "success"
        );
      }
    );
  }

  cargarPacienteLogeado():void{
    if(this.role=='paciente'){
      this.pacienteService.getPacienteByDni(this.dniUsuario).subscribe(
        response=> this.pacienteLogeado= response
      )
    }
  }

}
