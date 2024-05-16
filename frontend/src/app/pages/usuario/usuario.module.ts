import { NgModule } from '@angular/core';
import {NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule} from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ReactiveFormsModule } from '@angular/forms';

import { ThemeModule } from '../../@theme/theme.module';
import { UsuarioRoutingModule, routedComponents } from './usuario-routing.module';
import { ListaComponent } from './lista/lista.component';

@NgModule({
    imports: [
        NbCardModule,
        NbIconModule,
        NbInputModule,
        ThemeModule,
        UsuarioRoutingModule,
        Ng2SmartTableModule,
        ReactiveFormsModule,
        NbButtonModule,

    ],
  declarations: [
    ...routedComponents,
    ListaComponent,
  ],
})
export class UsuarioModule { }
