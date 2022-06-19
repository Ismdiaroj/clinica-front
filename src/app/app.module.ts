import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './Components/header/header.component';
import { PacientesComponent } from './Components/pacientes/pacientes.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PacientesFormComponent } from './Components/pacientes/pacientes-form/pacientes-form.component';
import { ConsultasComponent } from './Components/consultas/consultas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConsultasFormComponent } from './Components/consultas/consultas-form/consultas-form.component';
import { InicioComponent } from './Components/inicio/inicio.component';
import { LoginComponent } from './Components/login/login.component';
import { PerfilComponent } from './Components/perfil/perfil.component';
import { AyudaComponent } from './Components/ayuda/ayuda.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PacientesComponent,
    PacientesFormComponent,
    ConsultasComponent,
    ConsultasFormComponent,
    InicioComponent,
    LoginComponent,
    PerfilComponent,
    AyudaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    PdfViewerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
