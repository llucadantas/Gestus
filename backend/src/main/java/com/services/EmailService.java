package com.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender javaMailSender;
    @Value("${spring.mail.username}")
    private String remetente;

    @Async
    public void enviarEmailAssinaturaHTML(String emailArtista, String nomeArtista, String nomePeca, String linkAssinatura) {
        try {
            MimeMessage mensagem = javaMailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(mensagem, true, "UTF-8");

            helper.setTo(emailArtista);
            helper.setSubject("Ação Necessária: Novo Contrato Gestus");

            String htmlTemplate = """
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; }
                        .email-container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden; }
                        .email-header { background-color: #2c3e50; padding: 30px 20px; text-align: center; }
                        .email-header h1 { color: #ffffff; font-size: 24px; margin: 0; letter-spacing: 1px; }
                        .email-body { padding: 40px 30px; color: #333333; line-height: 1.6; font-size: 16px; }
                        .highlight { font-weight: bold; color: #2c3e50; }
                        .button-wrapper { text-align: center; margin: 40px 0; }
                        .action-button { background-color: #27ae60; color: #ffffff; text-decoration: none; padding: 15px 35px; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block; }
                        .fallback-link { font-size: 13px; color: #7f8c8d; word-break: break-all; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee; }
                        .email-footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 13px; color: #95a5a6; }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="email-header">
                            <h1>Ação Necessária: Novo Contrato</h1>
                        </div>
                        <div class="email-body">
                            <p>Olá, <span class="highlight">%s</span>!</p>
                            <p>Um novo contrato de aluguel para a peça <span class="highlight">%s</span> foi gerado no sistema <strong>Gestus</strong> e está aguardando a sua assinatura.</p>
                            <p>Por favor, revise os detalhes e clique no botão abaixo para confirmar a sua assinatura. Ao assinar, as sessões no teatro serão ativadas automaticamente.</p>
                            
                            <div class="button-wrapper">
                                <a href="%s" class="action-button">Assinar Contrato</a>
                            </div>
                            
                            <p>Atenciosamente,<br><strong>Equipe Gestus</strong></p>
                            
                            <div class="fallback-link">
                                <p>Se o botão não funcionar, copie e cole este link no seu navegador:</p>
                                <a href="%s" style="color: #3498db;">%s</a>
                            </div>
                        </div>
                        <div class="email-footer">
                            <p>Este é um e-mail automático do sistema Gestus. Por favor, não responda.</p>
                        </div>
                    </div>
                </body>
                </html>
                """;

            String conteudoHtml = String.format(htmlTemplate, nomeArtista, nomePeca, linkAssinatura, linkAssinatura, linkAssinatura);

            helper.setText(conteudoHtml, true);

            javaMailSender.send(mensagem);
            System.out.println("E-mail HTML enviado com sucesso para: " + emailArtista);

        } catch (MessagingException e) {
            System.err.println("ERRO AO ENVIAR E-MAIL HTML: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

