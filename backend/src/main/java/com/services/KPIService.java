package com.services;

import com.database.dao.AluguelDao;
import com.database.dao.IngressoDao;
import com.database.dao.SessaoDao;
import com.database.dao.TeatroDao;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KPIService {
    private final IngressoDao ingressoDao;
    private final AluguelDao aluguelDao;
    private final TeatroDao teatroDao;
    private final SessaoDao sessaoDao;






}
