package com.br.alura.listavip.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ListaVipController {

	@RequestMapping("/")
	public String getHome() {
		return "home";
	}
	
	@RequestMapping("/listaContatos")
	public String getListaContatos() {
		return "pages/lista_contatos";
	}
}
