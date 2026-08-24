package com.database.repository;

import com.database.model.Sessao;
import com.dto.response.SessaoProjection;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SessaoDao extends JpaRepository<Sessao, Long> {

    List<Sessao> findAllByPeca_Teatro_Id(Long pecaTeatroId);

    Optional<Sessao> findByIdAndPeca_Teatro_Id(Long id, Long pecaTeatroId);


    @Query("""
        SELECT COUNT(s) > 0 
        FROM Sessao s
        WHERE s.propostaAluguel.teatro.id = :idTeatro
          AND s.dataExibicao = :data
          AND s.horarioOcupacaoInicio < :ocupacaoFim
          AND s.horarioOcupacaoFim > :ocupacaoInicio
    """)
    boolean existeConflitoHorario(
            @Param("idTeatro") Long idTeatro,
            @Param("data") LocalDate data,
            @Param("ocupacaoInicio") LocalTime ocupacaoInicio,
            @Param("ocupacaoFim") LocalTime ocupacaoFim
    );

    @Query("""
    SELECT
        s.propostaAluguel.peca.nome as nomePeca,
        s.horarioInicioPeca as horarioInicioPeca,
        s.horarioFimPeca as horarioFimPeca,
        s.dataExibicao as data,
        s.propostaAluguel.artista.nome as nomeArtista
     FROM Sessao s
     WHERE s.propostaAluguel.teatro.id = :idTeatro
""")
    List<SessaoProjection> buscarSessoesRecentes(Long idTeatro,Pageable pageable);


}
