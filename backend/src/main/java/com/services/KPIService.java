package com.services;

import com.database.dao.ContratoDao;
import com.database.dao.IngressoDao;
import com.database.dao.SessaoDao;
import com.database.dao.TeatroDao;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KPIService {
    private final IngressoDao ingressoDao;
    private final ContratoDao contratoDao;
    private final TeatroDao teatroDao;
    private final SessaoDao sessaoDao;






}
