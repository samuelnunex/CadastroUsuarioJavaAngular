import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuarioComponent } from './usuario.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { ListaComponent } from './lista/lista.component';

const routes: Routes = [{
  path: '',
  component: UsuarioComponent,
  children: [
    {
      path: 'cadastro',
      component: CadastroComponent,
    },
    {
      path: 'lista',
      component: ListaComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuarioRoutingModule { }

export const routedComponents = [
  UsuarioComponent,
  CadastroComponent,
];
