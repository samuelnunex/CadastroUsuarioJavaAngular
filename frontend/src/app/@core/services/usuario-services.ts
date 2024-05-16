import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {UsuarioModel} from '../models/usuario.model';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ServicosFormsService {
  constructor(
    private http: HttpClient,
  ) {}

  buscarUsuarios(): Observable<UsuarioModel[]> {
    return this.http.get<UsuarioModel[]>(`${environment.REST_URL}usuarios`);
  }

  buscarUsuariosPorId(usuario): Observable<UsuarioModel> {
    return this.http.get<UsuarioModel>(`${environment.REST_URL}usuarios/${usuario}`);
  }

  updateUsuarios(usuario: UsuarioModel): Observable<UsuarioModel> {
    return this.http.put<UsuarioModel>(`${environment.REST_URL}usuarios/${usuario.id}`, usuario);
  }

  deleteUsuarios(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.REST_URL}usuarios/${id}`);
  }

  salvarUsuario(usuario: UsuarioModel): Observable<UsuarioModel> {
    return this.http.post<UsuarioModel>(`${environment.REST_URL}usuarios`, usuario);
  }

}
