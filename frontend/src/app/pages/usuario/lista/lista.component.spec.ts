import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ListaComponent } from './lista.component';
import { ServicosFormsService } from '../../../@core/services/usuario-services';
import { UsuarioModel } from '../../../@core/models/usuario.model';
import { NbToastrService, NbWindowService } from '@nebular/theme';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('ListaComponent', () => {
  let component: ListaComponent;
  let fixture: ComponentFixture<ListaComponent>;
  let mockServicosFormsService: Partial<ServicosFormsService>;
  let mockToastrService: Partial<NbToastrService>;
  let mockWindowService: Partial<NbWindowService>;

  const mockUsuario: UsuarioModel = {
    id: 1,
    nome: 'Teste',
    email: 'teste@teste.com',
  };


  beforeEach(async () => {
    mockServicosFormsService = {
      buscarUsuarios: () => of([mockUsuario]),
    };
    mockToastrService = {
      success: () => null,
      danger: () => null,
      warning: () => null,
    };
    mockWindowService = {
      open: () => null,
    };

    await TestBed.configureTestingModule({
      declarations: [ ListaComponent ],
      imports: [ ReactiveFormsModule, RouterTestingModule ],
      providers: [
        { provide: ServicosFormsService, useValue: mockServicosFormsService },
        { provide: NbToastrService, useValue: mockToastrService },
        { provide: NbWindowService, useValue: mockWindowService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    spyOn(mockServicosFormsService, 'buscarUsuarios').and.callThrough();
    component.ngOnInit();
    expect(mockServicosFormsService.buscarUsuarios).toHaveBeenCalled();
    expect(component.listarUsuarios).toEqual([mockUsuario]);
  });

  it('should open modal', () => {
    spyOn(mockWindowService, 'open').and.callThrough();
    component.openModal(component.modalTemplate);
    expect(mockWindowService.open).toHaveBeenCalled();
  });

  it('should save user', () => {
    spyOn(mockServicosFormsService, 'salvarUsuario').and.returnValue(of(null));
    spyOn(mockToastrService, 'success').and.callThrough();
    spyOn(component, 'carregarUsuarios').and.callThrough();
    spyOn(component, 'limparUsuario').and.callThrough();

    component.formUsuario.patchValue(mockUsuario);
    component.isEditar = false;
    component.salvarUsuario();

    expect(mockServicosFormsService.salvarUsuario).toHaveBeenCalledWith(mockUsuario);
    expect(mockToastrService.success).toHaveBeenCalledWith('Usuário salvo com sucesso', 'Sucesso');
    expect(component.carregarUsuarios).toHaveBeenCalled();
    expect(component.limparUsuario).toHaveBeenCalled();
  });

});
