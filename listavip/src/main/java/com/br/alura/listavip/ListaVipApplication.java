package com.br.alura.listavip;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages="com.br.alura")
public class ListaVipApplication {

	public static void main(String[] args) {
		SpringApplication.run(ListaVipApplication.class, args);
	}
}
