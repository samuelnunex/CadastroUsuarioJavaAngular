package br.com.system.cadastro.entity;
import br.com.system.cadastro.dto.UsuarioDTO;
import jakarta.persistence.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import lombok.Data;

import java.time.Instant;

@Data
@Entity
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String endereco;
    private String email;
    private String senha;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP WITHOUT TIME ZONE")
    private Instant createdAt;

    @Column(name = "updated_at", columnDefinition = "TIMESTAMP WITHOUT TIME ZONE")
    private Instant updatedAt;



    public Usuario(UsuarioDTO usuarioDTO) {
        this.id = usuarioDTO.getId();
        this.nome = usuarioDTO.getNome();
        this.endereco = usuarioDTO.getEndereco();
        this.email = usuarioDTO.getEmail();
        setSenha(usuarioDTO.getSenha());
    }

    @PrePersist
    public void prePersist() {
        createdAt = Instant.now();
        updatedAt = Instant.now();

    }


    public Usuario() {

    }

    public void setSenha(String senha) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        this.senha = passwordEncoder.encode(senha);
    }
}