package br.com.system.cadastro.dto;

import br.com.system.cadastro.entity.Usuario;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.Instant;

@Data
public class UsuarioDTO {

    public interface Create {}
    public interface Update {}

    private Long id;

    @NotBlank(message = "Nome é obrigatório", groups = {Create.class, Update.class})
    @Size(min = 3, max = 50, message = "Nome do Usuário precisa ter de 3 a 50 caracteres")
    private String nome;

    private String endereco;

    @NotBlank(message = "Email é obrigatório", groups = {Create.class, Update.class})
    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$", message = "Email inválido")
    private String email;

    @NotBlank(message = "Senha é obrigatória", groups = {Create.class, Update.class})
    @Size(min = 6, max = 20, message = "Senha precisa ter de 6 a 20 caracteres")
    private String senha;

    public UsuarioDTO(Usuario usuario) {
        this.id = usuario.getId();
        this.nome = usuario.getNome();
        this.endereco = usuario.getEndereco();
        this.email = usuario.getEmail();
        this.senha = usuario.getSenha();
    }

    public UsuarioDTO(Instant createdAt, Instant updatedAt) {
        // Construtor padrão sem argumentos
    }

}
