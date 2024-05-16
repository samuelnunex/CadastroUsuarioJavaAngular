import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { ServicosFormsService } from '../../../@core/services/usuario-services';
import { UsuarioModel } from '../../../@core/models/usuario.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Icon } from 'ol/style';
import { HttpClient } from '@angular/common/http';
import MapBrowserEvent from 'ol/MapBrowserEvent';

@Component({
  selector: 'ngx-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
})
export class CadastroComponent implements OnInit, AfterViewInit {

  formUsuario!: FormGroup;
  listarUsuarios: UsuarioModel[] = [];
  isEditar: boolean = false;
  mostrarListarUsuariosCard: boolean = false;
  map!: Map;
  vectorLayer!: VectorLayer<VectorSource>;


  @Input() page: any;

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private toastr: NbToastrService,
    private usuarioService: ServicosFormsService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.inicializaFormGroup();
    this.carregarUsuarios();

  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  inicializaFormGroup() {
    this.formUsuario = this.fb.group({
      id: [null],
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      endereco: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$')]],
      senha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      confirmarSenha: ['', Validators.required],
    }, {
      validator: this.confirmaSenhaValidator,
    });
  }

  confirmaSenhaValidator(group: FormGroup) {
    const senha = group.get('senha')?.value;
    const confirmarSenha = group.get('confirmarSenha')?.value;
    return senha === confirmarSenha ? null : { notSame: true };
  }

  private listarRegistrosNoMapa(): void {
    this.listarUsuarios.forEach(usuario => {
      if (usuario.endereco) {
        this.adicionarMarcador(usuario.endereco, usuario);
      }
    });
  }

  carregarUsuarios() {
    this.usuarioService.buscarUsuarios().subscribe(
      (usuarios: UsuarioModel[]) => {
        this.listarUsuarios = usuarios;
        // Após carregar os usuários, liste os registros no mapa
        this.listarRegistrosNoMapa();
      },
      (error) => {
        console.error('Erro ao buscar usuários:', error);
      },
    );
  }
  carregarDadosParaEdicao(usuario: UsuarioModel): void {
    this.isEditar = true;
    // Certifique-se de que o usuário tenha um ID válido antes de atribuí-lo
    if (usuario.id) {
      this.formUsuario.patchValue({
        id: usuario.id,
        nome: usuario.nome,
        endereco: usuario.endereco,
        email: usuario.email,
        senha: null,
        confirmaSenha: null,
      });
      this.updateMapWithAddress(usuario.endereco);
    } else {
      console.error('ID do usuário não definido:', usuario);
    }
  }


  limparUsuario() {
    this.isEditar = false;
    this.formUsuario.reset();
    this.limparMapa();
  }

  limparMapa() {
    this.vectorLayer.getSource().clear();
    this.map.getView().setCenter(fromLonLat([-47.92972, -15.77972]));
    this.map.getView().setZoom(4);
    this.listarRegistrosNoMapa();
  }


  salvarUsuario() {
    if (this.formUsuario.valid) {
      const usuario = this.formUsuario.value;
      if (this.isEditar) {
        this.usuarioService.updateUsuarios(usuario).subscribe(
          () => {
            this.toastr.success('Usuário atualizado com sucesso', 'Sucesso');
            this.carregarUsuarios();
            this.limparUsuario();
          },
          (error: any) => {
            console.error('Erro ao atualizar usuário:', error);
            this.toastr.danger('Erro ao atualizar usuário', 'Erro');
          },
        );
      } else {
        this.usuarioService.salvarUsuario(usuario).subscribe(
          () => {
            this.toastr.success('Usuário salvo com sucesso', 'Sucesso');
            this.carregarUsuarios();
            this.limparUsuario();
          },
          (error: any) => {
            console.error('Erro ao salvar usuário:', error);
            this.toastr.danger('Erro ao salvar usuário', 'Erro');
          },
        );
      }
    } else {
      this.toastr.warning('Preencha todos os campos obrigatórios', 'Aviso');
    }
  }
  updateProdutoById(usuario: UsuarioModel) {
    if (!usuario.id) {
      console.error('Erro ao atualizar usuario: ID do produto está undefined');
      return;
    }
    this.usuarioService.updateUsuarios(usuario).subscribe({
      next: () => {
        this.toastr.success(`Produto com ID ${usuario.id} atualizado com sucesso.`, 'Sucesso');
        this.carregarUsuarios();
      },
      error: (erro) => {
        console.error('Erro ao atualizar usuario:', erro);
        this.toastr.danger(`Erro ao atualizar usuario ${usuario.id}.`, 'Erro');
      },
    });
  }


  deletarUsuario(id: number) {
    this.usuarioService.deleteUsuarios(id).subscribe({
      next: () => {
        this.toastr.success(`Usuario com ID ${id} deletado com sucesso.`, 'Erro');
        this.limparUsuario();
      },
      error: (erro) => {
        console.error('Erro ao deletar usuario:', erro);
        this.toastr.danger(`Erro ao deletar usuario ${id}.`, 'Erro');

      },
    });
  }

  toggleListarUsuariosCard() {
    this.mostrarListarUsuariosCard = !this.mostrarListarUsuariosCard;
  }


  onDeleteConfirm(id: number) {
    if (window.confirm('Deseja excluir o usuário?')) {
      this.usuarioService.deleteUsuarios(id).subscribe({
        next: () => {
          this.toastr.success(`Usuário com ID ${id} excluído com sucesso.`, 'Sucesso');
          this.carregarUsuarios();
        },
        error: (erro) => {
          if (erro.status !== 200) {
            console.error('Erro ao excluir usuário:', erro);
            this.toastr.danger('Erro ao excluir usuário', 'Erro');
          } else {
            this.toastr.success(`Usuário com ID ${id} excluído com sucesso.`, 'Sucesso');
            this.carregarUsuarios();
          }
        },
      });
    }
  }


  private adicionarMarcador(address: string, usuario: UsuarioModel): void {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&addressdetails=1`;

    this.http.get(url).subscribe((res: any) => {
      if (res.length > 0) {
        const location = res[0];
        const coordinates = [parseFloat(location.lon), parseFloat(location.lat)];

        const marker = new Feature({
          geometry: new Point(fromLonLat(coordinates)),
          user: usuario,
        });

        const shadowStyle = new Style({
          image: new Icon({
            src: 'assets/images/shadow.png',
            scale: 1.2,
            opacity: 0.5,
            offset: [-6, 1],
          }),
        });

        const markerStyle = new Style({
          image: new Icon({
            src: 'assets/images/pin1.png',
            scale: 0.9,
          }),
        });

        marker.setStyle([shadowStyle, markerStyle]);

        this.vectorLayer.getSource().addFeature(marker);
      } else {
        console.error('Endereço não encontrado:', address);
      }
    }, (error) => {
      console.error('Erro ao buscar coordenadas:', error);
    });
  }

  private abrirZoomNoRegistro(usuario: UsuarioModel): void {
    const address = usuario.endereco;
    this.updateMapWithAddress(address);
  }
 private initializeMap(): void {
  this.map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: fromLonLat([-47.92972, -15.77972]),
      zoom: 4,
    }),
  });

  this.vectorLayer = new VectorLayer({
    source: new VectorSource(),
  });

  this.map.addLayer(this.vectorLayer);

  // Adicionar um ouvinte de evento de clique aos marcadores
  this.map.on('click', (event: MapBrowserEvent<UIEvent>) => {
    const feature = this.map.forEachFeatureAtPixel(event.pixel, (feature: any) => feature);
    if (feature && feature.get('user')) {
      const userData = feature.get('user');
      this.carregarDadosParaEdicao(userData);
    }
  });

  // Listar todos os registros no mapa após a inicialização do mapa
  this.listarRegistrosNoMapa();
}

  private updateMapWithAddress(address: string): void {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&addressdetails=1`;

    this.http.get(url).subscribe((res: any) => {
      if (res.length > 0) {
        const location = res[0];
        const coordinates = [parseFloat(location.lon), parseFloat(location.lat)];

        const marker = new Feature({
          geometry: new Point(fromLonLat(coordinates)),
        });

        // Defina o estilo da sombra
        const shadowStyle = new Style({
          image: new Icon({
            src: 'assets/images/shadow.png',
            scale: 1.2, // Ajuste a escala da sombra conforme necessário
            opacity: 0.5,
            offset: [-6, 1],
          }),
        });

        // Defina o estilo do marcador
        const markerStyle = new Style({
          image: new Icon({
            src: 'assets/images/pin1.png',
            scale: 0.9,
          }),
        });

        // Adicione a sombra ao marcador
        marker.setStyle([shadowStyle, markerStyle]);

        this.vectorLayer.getSource().clear(); // Limpa marcadores antigos
        this.vectorLayer.getSource().addFeature(marker);

        this.map.getView().setCenter(fromLonLat(coordinates));
        this.map.getView().setZoom(17); // Ajuste o zoom conforme necessário
      } else {
        console.error('Endereço não encontrado:', address);
      }
    }, (error) => {
      console.error('Erro ao buscar coordenadas:', error);
    });
  }

}
