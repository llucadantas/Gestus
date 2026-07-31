package com.dto;

import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
public class AdministradorDto {
    private String email;
    private String nome;
    private String senha;

}
