package com.br.alura.listavip;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import nz.net.ultraq.thymeleaf.LayoutDialect;

@Configuration
public class ListaVipConfiguration {

	@Bean
	public LayoutDialect layoutDialect() {
	    return new LayoutDialect();
	}
}
