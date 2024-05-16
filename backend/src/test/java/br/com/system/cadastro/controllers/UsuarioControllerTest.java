package br.com.system.cadastro.controllers;

import br.com.system.cadastro.dto.UsuarioDTO;
import br.com.system.cadastro.entity.Usuario;
import br.com.system.cadastro.service.UsuarioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class UsuarioControllerTest {

    @Mock
    private UsuarioService usuarioService;

    @InjectMocks
    private UsuarioController usuarioController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    void testGetAllUsers() {
        // Given
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNome("Teste");

        when(usuarioService.getAllUsers()).thenReturn(Collections.singletonList(usuario));

        // When
        ResponseEntity<List<UsuarioDTO>> response = usuarioController.getAllUsers();

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals("Teste", response.getBody().get(0).getNome());
    }

    @Test
    void testGetUserById() {
        // Given
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNome("Teste");

        when(usuarioService.getUserById(1L)).thenReturn(Optional.of(usuario));

        // When
        ResponseEntity<UsuarioDTO> response = usuarioController.getUserById(1L);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Teste", response.getBody().getNome());
    }

}
