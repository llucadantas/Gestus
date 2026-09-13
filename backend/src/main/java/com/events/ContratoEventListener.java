package com.events;

import com.services.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ContratoEventListener {

    private final EmailService emailService;

    @Value("${app.frontend.url:http://localhost:8080}")
    private String frontendUrl;

    @EventListener
    public void onContratoCriado(ContratoCriadoEvent event) {
        String linkAssinatura = frontendUrl + "/v1/aluguel/assinar?token=" + event.tokenAssinatura();
        emailService.enviarEmailAssinaturaHTML(
                event.emailArtista(), 
                event.nomeArtista(), 
                event.nomePeca(), 
                linkAssinatura
        );
    }
}