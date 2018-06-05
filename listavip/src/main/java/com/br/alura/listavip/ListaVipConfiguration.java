package com.br.alura.listavip;

import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import nz.net.ultraq.thymeleaf.LayoutDialect;

@Configuration
public class ListaVipConfiguration {

	@Bean
	public LayoutDialect layoutDialect() {
	    return new LayoutDialect();
	}
	
	@Bean
	public DataSource getDataSource() {
		DriverManagerDataSource datasource = new DriverManagerDataSource();
		datasource.setDriverClassName("com.mysql.jdbc.Driver");
		datasource.setUrl("jdbc:mysql://localhost:3306/listavip");
		datasource.setUsername("root");
		datasource.setPassword("admin");
		return datasource;
	}
}
