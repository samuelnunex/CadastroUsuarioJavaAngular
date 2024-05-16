package br.com.system.cadastro.controllers;

import br.com.system.cadastro.dto.UsuarioDTO;
import br.com.system.cadastro.entity.Usuario;
import br.com.system.cadastro.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> getAllUsers() {
        List<UsuarioDTO> usuariosDTO = usuarioService.getAllUsers().stream()
                .map(this::convertToDTO)
                .toList();
        return ResponseEntity.ok(usuariosDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> getUserById(@PathVariable Long id) {
        Optional<Usuario> usuarioOptional = usuarioService.getUserById(id);
        if (usuarioOptional.isPresent()) {
            UsuarioDTO usuarioDTO = convertToDTO(usuarioOptional.get());
            return ResponseEntity.ok(usuarioDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody UsuarioDTO usuarioDTO) {
        try {
            UsuarioDTO createdUsuarioDTO = usuarioService.salvar(usuarioDTO);
            URI uri = ServletUriComponentsBuilder
                    .fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(createdUsuarioDTO.getId())
                    .toUri();
            return ResponseEntity.created(uri).body(createdUsuarioDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao criar usuário: " + e.getMessage());
        }
    }


    @PutMapping(value = "/{id}")
    public ResponseEntity<UsuarioDTO> update(@PathVariable Long id, @Valid @RequestBody UsuarioDTO usuarioDTO) {
        usuarioDTO = usuarioService.update(id, usuarioDTO);
        return  ResponseEntity.ok(usuarioDTO);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        try {
            if (usuarioService.deleteUser(id)) {
                return ResponseEntity.ok().body("Usuário excluído com sucesso.");
            } else {
                return ResponseEntity.badRequest().body("Usuario não encontrado com o ID: " + id);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao excluir usuário: " + e.getMessage());
        }
    }


    private UsuarioDTO convertToDTO(Usuario usuario) {
        return new UsuarioDTO(usuario);
    }
}
