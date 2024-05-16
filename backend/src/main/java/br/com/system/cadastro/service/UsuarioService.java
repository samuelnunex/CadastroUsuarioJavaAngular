package br.com.system.cadastro.service;

import br.com.system.cadastro.dto.UsuarioDTO;
import br.com.system.cadastro.entity.Usuario;
import br.com.system.cadastro.repository.UsuarioRepository;
import br.com.system.cadastro.service.exceptions.ResourceNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> getAllUsers() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> getUserById(Long id) {
        return usuarioRepository.findById(id);
    }

    @Transactional
    public UsuarioDTO salvar(@Valid UsuarioDTO usuarioDTO) {
        Usuario entity = new Usuario();
        copiaDtoParaEntidade(usuarioDTO, entity);
        entity = usuarioRepository.save(entity);
        return new UsuarioDTO(entity);
    }

    @Transactional
    public UsuarioDTO update(Long id, @Validated(UsuarioDTO.Update.class) UsuarioDTO usuarioDTO) {
        Optional<Usuario> optionalUsuario = usuarioRepository.findById(id);
        if (optionalUsuario.isPresent()) {
            Usuario entity = optionalUsuario.get();

            if (usuarioDTO.getNome() != null) {
                entity.setNome(usuarioDTO.getNome());
            }
            if (usuarioDTO.getEndereco() != null) {
                entity.setEndereco(usuarioDTO.getEndereco());
            }

            if (usuarioDTO.getEmail() != null) {
                entity.setEmail(usuarioDTO.getEmail());
            }
            if (usuarioDTO.getSenha() != null) {
                entity.setSenha(usuarioDTO.getSenha());
            }

            // Salva a entidade atualizada
            entity = usuarioRepository.save(entity);
            return new UsuarioDTO(entity);
        } else {
            throw new ResourceNotFoundException("Usuário não encontrado");
        }
    }


    @Transactional
    public boolean deleteUser(Long id) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findById(id);
        if (usuarioOptional.isPresent()) {
            usuarioRepository.delete(usuarioOptional.get());
            return true;
        } else {
            return false;
        }
    }

    private void copiaDtoParaEntidade(UsuarioDTO usuarioDTO, Usuario entity) {
        entity.setId(usuarioDTO.getId());
        entity.setNome(usuarioDTO.getNome());
        entity.setEndereco(usuarioDTO.getEndereco());
        entity.setEmail(usuarioDTO.getEmail());
        entity.setSenha(usuarioDTO.getSenha());
        entity.setCreatedAt(Instant.now());
        entity.setUpdatedAt(Instant.now());
    }


}
