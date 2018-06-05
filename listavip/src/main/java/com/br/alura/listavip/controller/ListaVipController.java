package com.br.alura.listavip.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.br.alura.entity.Convidado;
import com.br.alura.repository.ConvidadoRepository;

@Controller
public class ListaVipController {

	@Autowired
	private ConvidadoRepository repository;
	
	@RequestMapping("/")
	public String getHome() {
		return "home";
	}
	
	@RequestMapping("/listaContatos")
	public String getListaContatos(Model model) {
		Iterable<Convidado> listaConvidados = repository.findAll();
		model.addAttribute("listaConvidados", listaConvidados);
		return "pages/lista_contatos";
	}
}
