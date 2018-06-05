package com.br.alura.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.br.alura.entity.Convidado;

@Repository
public interface ConvidadoRepository extends JpaRepository<Convidado, Long>{

}
