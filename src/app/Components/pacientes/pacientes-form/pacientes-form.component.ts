import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteServiceService } from 'src/app/Services/paciente-service.service';
import Swal from 'sweetalert2';
import { Consulta } from '../../consultas/consulta';
import { Paciente } from '../paciente';

@Component({
  selector: 'app-pacientes-form',
  templateUrl: './pacientes-form.component.html',
  styleUrls: ['./pacientes-form.component.css']
})
export class PacientesFormComponent implements OnInit {

  usuariosForm!: FormGroup;

  titulo1 = "Formulario de creación de usuario";
  titulo2 = "Formulario de edición de usuario";
  textoTitulo: boolean = true;

  paciente: Paciente = new Paciente();

  fisios: Paciente[] = []

  constructor(
    private pacienteService: PacienteServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.cargarFisios()
    this.cargarPaciente();
    this.seleccionarTipoForm();


  }

   // Crear Formulario y Validaciones
   iniciarFormulario(): FormGroup {
    return this.formBuilder.group(
     {
       dni: ["", Validators.required],
       email: ["", Validators.required],
       nombre: ["", Validators.required],
       telefono: ["", Validators.required],
       role: ["",Validators.required],
       password: ["",Validators.required],
       activo: ["",Validators.required],
       idFisio:[""],
       antecedentes: [""],
       motivo: [""],
       exploracion: [""],
       diagnostico: [""],
       ejercicios: [""],
       recomendaciones: [""]
     }
   );
 }


 // Crear Formulario y Validaciones para Editar
 iniciarFormularioEditar(): FormGroup {
  return this.formBuilder.group(
   {
     dni: ["", Validators.required],
     email: ["", Validators.required],
     nombre: ["", Validators.required],
     telefono: ["", Validators.required],
     role: ["",Validators.required],
     idFisio:[""],
     password: [""],
     activo: [""],
     antecedentes: [""],
     motivo: [""],
     exploracion: [""],
     diagnostico: [""],
     ejercicios: [""],
     recomendaciones: [""],
   }
 );
}


 seleccionarTipoForm():void{
  if(!this.textoTitulo){
    this.usuariosForm = this.iniciarFormularioEditar()
  }else{
    this.usuariosForm = this.iniciarFormulario()
  }
 }


// Lee el ID pasado por URL si existe carga el usuario
 cargarPaciente():void{
   this.activatedRoute.params.subscribe(params=>{
     let id = params['id']
     if(id){
       this.textoTitulo=false
       this.pacienteService.getPacienteById(id).subscribe( response => {
        this.paciente = response
        });
     }
   })
 }

 cargarFisios():void{
  this.pacienteService.getPacientes().subscribe(
    response => {
      response.forEach(fisio=>{
        if(fisio.role=='empleado'){
          this.fisios.push(fisio)
        }
      })
    }
  )
 }

//Enviar post con los datos del formulario
 crearPaciente():void{
   this.pacienteService.postPaciente(this.paciente).subscribe(
    response => {
      this.router.navigate(['/usuarios']),
      Swal.fire(
        "Usuario creado",
        "Usuario '" + this.paciente.nombre + "' creado correctamente",
        "success"
      );
    }
  );
 }

 // Enviar put con los datos del formulario
 actualizarPaciente():void{
   console.log(this.paciente)
  this.pacienteService.putPaciente(this.paciente).subscribe(
    response => {
      this.router.navigate(['/usuarios']),
      Swal.fire(
        "Usuario editado",
        "Usuario '" + this.paciente.nombre + "' editado correctamente",
        "success"
      );
    }
  );

 }


}
