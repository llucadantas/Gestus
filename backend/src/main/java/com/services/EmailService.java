package com.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine; // Injeção do Thymeleaf!

    @Value("${spring.mail.username}")
    private String remetente;

    @Async
    public void enviarEmailAssinaturaHTML(String emailArtista, String nomeArtista, String nomePeca, String linkAssinatura) {
        try {
            MimeMessage mensagem = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensagem, true, "UTF-8");

            helper.setFrom("lucasdantasps2015@gmail.com"); // Utilizando a variável que você já tinha declarado
            helper.setTo(emailArtista);
            helper.setSubject("Ação Necessária: Novo Contrato Gestus");
            Context context = new Context();
            context.setVariable("nomeArtista", nomeArtista);
            context.setVariable("nomePeca", nomePeca);
            context.setVariable("linkAssinatura", linkAssinatura);

            String conteudoHtml = templateEngine.process("contrato-email", context);
            helper.setText(conteudoHtml, true);

            javaMailSender.send(mensagem);
            log.info("E-mail HTML enviado com sucesso para: {}", emailArtista);

        } catch (MessagingException e) {
            log.error("ERRO AO ENVIAR E-MAIL HTML: {}", e.getMessage(), e);
        }
    }
}