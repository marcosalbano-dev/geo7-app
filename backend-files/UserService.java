package org.geo7.service;

import org.geo7.dto.AuthResponseDTO;
import org.geo7.dto.LoginRequestDTO;
import org.geo7.dto.RegisterRequestDTO;
import org.geo7.dto.UserDTO;
import org.geo7.model.entity.User;
import org.geo7.model.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public AuthResponseDTO login(LoginRequestDTO request) {
        System.out.println("=== DEBUG LOGIN ===");
        System.out.println("Email recebido: " + request.getEmail());
        System.out.println("Senha recebida: " + request.getPassword());
        
        // Buscar usuário
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        
        if (userOpt.isEmpty()) {
            System.out.println("Usuário não encontrado no banco");
            throw new RuntimeException("Credenciais inválidas");
        }
        
        User user = userOpt.get();
        System.out.println("Usuário encontrado: " + user.getEmail());
        System.out.println("Usuário ativo: " + user.getActive());
        System.out.println("Senha no banco: " + user.getPassword());
        
        if (!user.getActive()) {
            System.out.println("Usuário inativo");
            throw new RuntimeException("Credenciais inválidas");
        }

        // Verificar senha
        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());
        System.out.println("Senha confere: " + passwordMatches);
        
        if (!passwordMatches) {
            System.out.println("Senha não confere");
            throw new RuntimeException("Credenciais inválidas");
        }

        // Gerar token
        String token = jwtService.generateToken(user);
        System.out.println("Token gerado com sucesso");
        System.out.println("=== FIM DEBUG LOGIN ===");

        return new AuthResponseDTO(
                "Login realizado com sucesso",
                new UserDTO(user),
                token
        );
    }

    // ... resto dos métodos permanecem iguais
}
