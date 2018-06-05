$(function() {
	
	//RESUMO PADRÃO NO INICIO DA PAGINA
	cleanInfoResumo = function(){
		$("#descSolCaptura").text('');
		$("#descPlano").text('');
		$(".resumo").find('.qtdDias').remove();
		$('#text-qtdade-dias').text('Recebimento de suas vendas');
		$("#descQtdadeDias").text('');
	}

	//CAMPOS HIDE
	initFields = function() {
		$('#planoCieloConvencional').hide();
		$('#planoCieloControle').hide();
		$('#planoCieloLivre').hide();
		$('.pnlTaxas').hide();
		$("#cboQtdadeMaquinas").hide();
		$("#lblQtdadeMaquinas").hide();
		$("#chkVendasArv").prop('checked', false);
		$('#isEntregaMaquina').hide();
		//REGRAS SOLUCAO HIDE
		$("#regra01").hide();
		$("#regra02").hide();
		$("#regra03").hide();
		$("#taxaArv").hide();
		$('.lblCombetaMaquinas').hide();		
		$('.planosInfo').show();
		$('.planosOption').hide();		
		cleanInfoResumo();
	}
	initFields();
		
	//RAMOS DE ATIVIDADES (MCCS)
	popularRamosAtividades = function(){
		var tipoPessoa = $("input:radio[name='tpPessoa']:checked").val();
		$.get({ 
			  url : hostContext()+'/getRamosAtividades/'+tipoPessoa+'/'+getCodigoFerramenta(),
			  async: false,
	          dataType: 'json',
	          contentType: "application/json; charset=utf-8",
			  success : function(data) {
				  
				$('#ramoAtividade').find('option').remove();
				var selectbox = $('#ramoAtividade');
				$('<option>').val(0).text("Selecione").appendTo(selectbox);
				
	             $.each(data, function (i, d) {
	                 $('<option>').val(d.pk.codigo).text(d.pk.codigo+' - '+d.descricao).appendTo(selectbox);
	             });
	             $('#ramoAtividade').val(ramoAtividade);
	             $("select[name=ramoAtividade]").selectpicker("refresh");
	          
			  },
			  error : function(error){
				  console.log(error);
			  }
		});
	}

	//COMBO LISTA DE FATURAMENTO
	$.get({ 
		  url : hostContext()+'/getListaFaturamento',
		  async: false,
          dataType: 'json',
          contentType: "application/json; charset=utf-8",
		  success : function(data) {
			  
			$('#faturamento').find('option').remove();
			var selectbox = $('#faturamento');
			$('<option>').val(0).text("Selecione").appendTo(selectbox);			
             $.each(data, function (i, d) {            	
            	$('<option>').val(d.codigo).text(d.descricao).appendTo(selectbox);
             });             
             $("select[name=faturamento]").selectpicker("refresh");
			 
		  },
		  error : function(error){
			  console.log(error);
		  }
	});
	
	//LISTA TAXAS RECEBA RAPIDO
	$.get({ 
		  url : hostContext()+'/getTaxasRecebaRapido', 
          dataType: 'json',
          contentType: "application/json; charset=utf-8",
		  success : function(data) {
			var optRadio = $('#txRecebaRapido');			
            $.each(data, function (i, d) {
            	$('<div class="col-xs-4 col-sm-4 col-md-4"><input type="radio" name="taxaRR" value='+d+'> &nbsp;<span class="badge badge-info-rdr">'+d+' %</span>'+'</div>').appendTo(optRadio);
            }); 
		  },
		  error : function(error){
			  console.log(error);
		  }
	});
		
	
	//COMBO SOLUCAO DE CAPTURA, CARREGADA APÓS SELECIONAR O FATURAMENTO
	carregarSolucoesCaptura = function(faixaFaturamento){
		var tipoPessoa = $("input:radio[name='tpPessoa']:checked").val();
		$.get({ 
			  url : hostContext()+'/getSolucaoCaptura/'+getCodigoFerramenta()+'/'+tipoPessoa+'/'+faixaFaturamento,
	          dataType: 'json',
	          contentType: "application/json; charset=utf-8",
			  success : function(data) {				  
				$('#solCaptura').find('option').remove();
				var selectbox = $('#solCaptura');
				$('<option>').val(0).text("Selecione").appendTo(selectbox);
				
	             $.each(data, function (i, d) {
	            	$('<option data-maq="'+d.indEntregaMaquina+'" data-plconv="'+d.indPlanoConvencional+'" data-plcont="'+d.indPlanoCieloControle+'" data-pllivre="'+d.indPlanoCieloLivre+'">').val(d.codigo).text(d.descricao.toUpperCase()).appendTo(selectbox);
	             });
	             
	             $("select[name=solCaptura]").selectpicker("refresh");			 
			  },
			  error : function(error){
				  console.log(error);
			  }
		});
	}	
	
	//COMBO FATURAMENTO RANGE DE FAIXAS
	$("#ramoAtividade").on("change", function() {		
		tratarSolucaoRamoAtividade($("#solCaptura").val());
	})
	
	//COMBO FATURAMENTO RANGE DE FAIXAS
	$("#faturamento").on("change", function() {
		var vlrFaturamento = $(this).val();
		//CARREGAMOS A COMBO DE SOLUÇÃO DE CAPTURA
		carregarSolucoesCaptura(vlrFaturamento);
		initFields();
		tratarExibicaoQtdadeMaquinas();
	})

	// TRATAMENTO EXIBICAO DA QUANTIDADE DE MAQUINAS, LABEL MAXIMO 01 OU COMBETA PARA ELE SELECIONAR
	tratarExibicaoQtdadeMaquinas = function() {
		var codigoSolucao = $('#solCaptura').val();
		var tpPlano = $("input:radio[name='tpPlano']:checked").data('name'); 
		if(codigoSolucao == '26' || tpPlano == 'controle' || tpPlano == 'cieloLivre'){//MPOS - CIELO ZIP || CIELO CONTROLE || CIELO LIVRE, PERMITE SOMENTE 01 EQUIPAMENTO
			$("#text-qtdade-maquinas").text(getMessageApenas01Maquina(tpPlano));	
			$("#lblQtdadeMaquinas").show();			
			$("#cboQtdadeMaquinas").hide();
		}else{
			$("#lblQtdadeMaquinas").hide();
			$("#cboQtdadeMaquinas").show();
		}
	}
	
	//MENSAGEM PARA OPÇÃO DE APENAS 01 MAQUINA
	getMessageApenas01Maquina = function(tipoPlano){
		return tipoPlano == 'controle' ? 'Plano Cielo Controle' : 'Plano Cielo Livre';
	}

	//COMBO SOLUCAO DE CAPTURA
	$("#solCaptura").on("change", function() {		
		var codSolCaptura = $(this).val();
		//TRATAMENTO EXIBICAO DE PLANOS CIELO
		tratarExibicaoPlanoConvencional($(this).find(':selected').attr('data-plconv'));
		tratarExibicaoPlanoControle($(this).find(':selected').attr('data-plcont'), codSolCaptura);
		tratarExibicaoPlanoLivre($(this).find(':selected').attr('data-pllivre'), codSolCaptura);
		//TRATAMENTO REGRAS DE TELA DE ACORDO COM A SOLUCAO DE CAPTURA			
		tratarSolucaoRamoAtividade(codSolCaptura);
		codSolCaptura != 0 ? $('.lblCombetaMaquinas').show() :$('.lblCombetaMaquinas').hide();
		$('.planosInfo').hide();
		$('.planosOption').show();	
		chekedPlanoDefault();
		atualizarRascunho('atualizarRascunhoSolCaptura', 'step01');
	})

	//TRATAMENTO PARA PLANO CONVENCIONAL SHOW/HIDE 
	tratarExibicaoPlanoConvencional = function(flagControle){
		if(flagControle == 'S'){
			$('#planoCieloConvencional').show();
		}else{
			$('#planoCieloConvencional').hide();
		}
	}
	
	//TRATAMENTO PARA PLANO CIELO CONTROLE SHOW/HIDE 
	tratarExibicaoPlanoControle = function(flagControle, solucao){
		if(flagControle == 'S'){
			var data = verificarPlanoHabilitado(solucao, 2) //2 == CONTROLE
			//PODEMOS HABILITAR O PLANO CONTROLE ?
			if(data.planoHabilitado === true){
				$('#planoCieloControle').show();				
				//POSSUI LIQUIDAÇÃO EM 2 DIAS
				if(data.liquidacaoDoisDias === true){$('.rd2dias').show();}else{$('.rd2dias').hide();}
				//POSSUI LIQUIDAÇÃO EM 31 DIAS
				if(data.liquidacaoTrintaEUmDias === true){$('.rd30dias').show();}else{$('.rd30dias').hide();}
			}else{
				$('#planoCieloControle').hide();
			}
		}else{
			$('#planoCieloControle').hide();
		}
	}
	
	//TRATAMENTO PARA PLANO CIELO CONTROLE SHOW/HIDE 
	tratarExibicaoPlanoLivre = function(flagControle, solucao){
		if(flagControle == 'S'){
			var data = verificarPlanoHabilitado(solucao, 3) //3 == LIVRE
			//PODEMOS HABILITAR O PLANO CIELO LIVRE ?
			if(data.planoHabilitado === true){
				$('#planoCieloLivre').show();
			}else{
				$('#planoCieloLivre').hide();
			}
		}else{
			$('#planoCieloLivre').hide();
		}
	}
	
	//VERIFICAMOS SE PODEMOS HABILITAR OS PLANOS DE ACORDO COM AS REGRAS
	verificarPlanoHabilitado = function(solucao, plano){		
		var faturamento = $("#faturamento").val();
		var ferramenta = getCodigoFerramenta();
		var dados;
		$.get({ 
			  url : hostContext()+'/verificarHabilitacaoPlanoCielo/'+ferramenta+'/'+solucao+'/'+plano+'/'+faturamento,
			  async: false,
	          dataType: 'json',
	          contentType: "application/json; charset=utf-8",
			  success : function(data) {
				  dados = data;
			  },
			  error : function(error){
				  console.log(error);
			  }
		});
		return dados;
	}
	
	//TRATAMENTO TAXAS RAMO ATIVIDADE (MCC)
	tratarSolucaoRamoAtividade = function(solucaoCaptura){
		if (solucaoCaptura != '0') {
			var mcc = $("#ramoAtividade").val();
			if (mcc != '0') {
				if (solucaoCaptura == '18') {//MOBILE
					mcc = '90000';//FIXO
				}
				else if (solCaptura == '26') {//MPOS - CIELO ZIP
					mcc = '90001';//FIXO
				}
				obterTaxasPrazos(mcc);
			}
			//COMBETA QUANTIDADE
			obterQtdadeEquipamentos(solucaoCaptura, getCodigoFerramenta());			
			//TRATAR ENTREGA MAQUINAS
			tratarEntregaMaquinas($("#solCaptura option:selected" ).attr('data-maq'));
		} else {
			$('.pnlTaxas').hide();
		}
		tratarRegrasSolucaoCaptura(solucaoCaptura);
	}

	//OBTER AS TAXAS DE ACORDO COM O MCC, SERVIÇO DO SEC QUE RETORNA ESSES VALORES, GUARDAMOS EM UMA TABELA EMBEDDED
	obterTaxasPrazos = function(codigoMcc) {
		$.get({
			url : hostContext() + '/getTaxasPrazos/' + codigoMcc,
			dataType : 'json',
			contentType : "application/json; charset=utf-8",
			success : function(data) {
				popularTaxasPrazos(data);
			},
			error : function(error) {
				console.log(error);
			}
		});
	}

	//CONTROLE DE TAXAS E PRAZOS
	popularTaxasPrazos = function(taxasPrazos) {
		$('.pnlTaxas').show();
		popularInfoTaxas("txCredito", taxasPrazos.produto40);
		popularInfoTaxas("txDebito", taxasPrazos.produto41);
		popularInfoTaxas("credParc3x",taxasPrazos.segmentado3Parcelas);
		popularInfoTaxas("credParc6x",taxasPrazos.segmentado6Parcelas);
		popularInfoTaxas("credParc12x",taxasPrazos.segmentado12Parcelas);
	}

	//POPULAMOS AS INFORMAÇÕES DE TAXAS
	popularInfoTaxas = function(campo, valor){
		if(valor > 0){ //SOMENTE EXIBIMOS A TAXA SE FOR MAIOR QUE '0'
			 $('.'+campo).show();
			 $('#'+campo).text(valor + "%")
		}else{
			$('.'+campo).hide();
		}
	}
	
	//OBTER QUANTIDADE DE MAQUINAS X SOLUCAO CAPTURA
	obterQtdadeEquipamentos = function(codSolucaoCaptura, codigoFerramenta){
		$('#qtdadeMaquinas').prop('disabled',true);
		$.get({
			url : hostContext() + '/getQtdadeEquipamentos/' + codSolucaoCaptura+ '/' +codigoFerramenta,
			dataType : 'json',
			async: false,
			contentType : "application/json; charset=utf-8",
			success : function(data) {
				popularComboQtdEquipamentos(data);
			},
			error : function(error) {
				console.log(error);
				popularComboQtdEquipamentos(10)//CONTIGENCIA POPULAMOS COM 10
			}
		});
		$("select[name=qtdadeMaquinas]").selectpicker("refresh"); 
	}
	
	//POPULAMOS AS INFORMACOES DE QUANTIDADE NA COMBO DE OPÇÕES
	popularComboQtdEquipamentos = function(data){
		$('#qtdadeMaquinas').find('option').remove();
		var selectbox = $('#qtdadeMaquinas');	
		$('<option>').val(0).text("Selecione").appendTo(selectbox);
		for(i=1; i<=data; i++){
			$('<option>').val(i).text(i).appendTo(selectbox);
		}
		$('#qtdadeMaquinas').prop('disabled',false);
		$('lblCombetaMaquinas').show();

	}

	//ENTREGA DE MAQUINAS NA HORA - SOMENTE FERRAMENTA FEIRAS
	tratarEntregaMaquinas = function(indEntregaMaquina){
		var codigoFerramenta = getCodigoFerramenta();
		if(indEntregaMaquina == 'S' && codigoFerramenta == '8'){ //FLAG TRUE E FERRAMENTA FEIRAS			
			$('#isEntregaMaquina').show();		
		}else{
			$('#isEntregaMaquina').hide();	
		}
	}

	//REGRAS DE TELA PARA EXIBIÇÃO DOS BLOCOS PERTINENTES A SOLUCAO DE CAPTURA
	tratarRegrasSolucaoCaptura = function(codigo) {
		//POS Regras Exibição Taxa
		if (codigo == '1' || codigo == '2' || codigo == '3' || codigo == '18'|| codigo == '25' || codigo == '26') {
			$("#regra01").show();
			$("#regra02").hide();
			$("#regra03").hide();

		} else if (codigo == '19') {
			$("#regra02").show();
			$("#regra01").hide();
			$("#regra03").hide()

		} else if (codigo == '20' || codigo == '0') {
			regrasSolucaoHide();

		} else {
			$("#regra03").show();
			$("#regra01").show();
			$("#regra02").hide();
		}
		tratarExibicaoQtdadeMaquinas();
	}
	
	// HIDE NAS REGRAS X SOLUÇÃO DE CAPTURA
	regrasSolucaoHide = function() {
		$("#regra01").hide();
		$("#regra02").hide();
		$("#regra03").hide();
	}
	
	//CHECKED PLANO DEFAULT, O 1° PLANO HABILITADO
	chekedPlanoDefault = function(){
		//CONVENCIONAL
		if($('#planoCieloConvencional').is(':visible') === true){
			$("input:radio[name='tpPlano'][value=1]").prop('checked', true);	
			tratarCampoDiasLiquidacao(true, false);
		//CONTROLE	
		}else if($('#planoCieloControle').is(':visible') === true){
			$("input:radio[name='tpPlano'][value=2]").prop('checked', true);	
			$("#regra01").hide();
			tratarCampoDiasLiquidacao(false, true);		
		//LIVRE
		}else if($('#planoCieloLivre').is(':visible') === true){
			$("input:radio[name='tpPlano'][value=3]").prop('checked', true);
			tratarCampoDiasLiquidacao(true, false);
		}
		tratarExibicaoQtdadeMaquinas();
		popularInfoResumo();
	}
	
	//COMPORTAMENTO PADRAO PARA OS DIAS DE LIQUIDACAO PLANO CONTROLE
	tratarCampoDiasLiquidacao = function(isDisabled, isChecked){
		$("input:radio[name='diasLiqControle']").prop('disabled', isDisabled);
		$("input:radio[name='diasLiqControle']").prop('checked', false);
		$("input:radio[name='diasLiqControle'][value=2]").prop('checked', isChecked);
	}
	
	//EVENTO DE SELEÇÃO DE PLANOS CIELO
	$("input:radio[name='tpPlano']").on("change", function() {
		var plano = $(this).data('name');
		tratarTipoPlano(plano);
	})

	//TRATAMENTO TIPOS PLANOS CIELO
	tratarTipoPlano = function(plano) {
		if (plano == 'controle') {
			$("#regra01").hide();
			tratarCampoDiasLiquidacao(false, true);			

		} else {
			tratarCampoDiasLiquidacao(true, false);
			tratarRegrasSolucaoCaptura($("#solCaptura").val());
		}
		//CONTROLE E MPOS, QUANTIDADE MAXIMA DE EQUIPAMENTOS 01
		tratarExibicaoQtdadeMaquinas();
		popularInfoResumo();
	}
	
	//EVENTO SELECAO LIQUIDACAO PLANO CONTROLE
	$("input:radio[name='diasLiqControle']").on("change", function() {
		var dias = $(this).val();
		if(dias == 30){
			$("#regra01").show();
		}else{
			$("#regra01").hide();
		}
		popularInfoResumo();
	});

	//TRATAMENTO PARA EXIBIÇÃO DAS TAXAS DE ARV
	tratarExibicaoTaxasArv = function() {
		if ($("#chkVendasArv").is(':checked')) {
			$("#taxaArv").show();
		} else {
			$("#taxaArv").hide();
		}
	}
	
	//TRATAMOS O CHECKED DO ARV / RECEBA RAPIDO
	$("#chkVendasArv").on("change", function() {
		tratarExibicaoTaxasArv();
	})
	
	//POPULAR INFORMAÇÕES DE RESUMO
	popularInfoResumo = function() {
		$("#descSolCaptura").text($('#solCaptura :selected').text());
		var plano = $("input:radio[name='tpPlano']:checked").data('name');
		$("#descPlano").text($("input:radio[name='tpPlano']:checked").parent('label').text());
		$('#text-qtdade-dias').text('');
		if (plano == 'convencional') { 
			$(".resumo").find('.qtdDias').remove();
			$("#descQtdadeDias").text('');
			$("#descQtdadeDias").after("<div class='qtdDias'><p>Débito em 1 dia</p><p>Crédito em até 30 dias</p><div>");			
			$('#text-qtdade-dias').text('Recebimento de suas vendas');
			
		} else if (plano == 'controle') {
			$(".resumo").find('.qtdDias').remove();
			$("#descQtdadeDias").text('');
			$("#descQtdadeDias").text($("input:radio[name='diasLiqControle']:checked").parent('label').text());
			$('#text-qtdade-dias').text('Em quantos dias deseja receber suas vendas no crédito à vista?');
			
		} else if (plano == 'cieloLivre') {
			$(".resumo").find('.qtdDias').remove();
			$("#descQtdadeDias").text('');
			$('#text-qtdade-dias').text('Recebimento de suas vendas');
			$("#descQtdadeDias").after("<div class='qtdDias'><p>Débito em 01 dia</p><p>Crédito em 02 dias</p><div>");	
		} 
	}

	//EVENTO SELECAO OPERADORA
	$("input:checkbox[name='operadora']").on("change", function() {
		tratarOperadora();
	})

	//TRATAMENTO OPERADORA DE CELULAR GPRS    
	tratarOperadora = function() {
		$("input:checkbox[name='operadora']").each(function() {
			$(this).prop('disabled', false);
		})
		var $check = $("input:checkbox[name='operadora']:checked");
		if ($check.length >= 2) {
			$("input:checkbox[name='operadora']").each(function() {
				if (!$(this).is(":checked")) {
					$(this).prop('disabled', true);
				}
			});
		}
	}

	//EVENTO OPERADORA NAO INFORMADA
	$('#naoInfoOperadora').change(function() {
		if ($(this).is(":checked")) {
			$("input:checkbox[name='operadora']").each(function() {
				$(this).prop('checked', false);
				$(this).prop('disabled', true);
			})
		} else {
			$("input:checkbox[name='operadora']").each(function() {
				$(this).prop('disabled', false);
			})
		}
	});

	//TRATAMENTO PARA EXIBICAO NO RESUMO DA QUANTIDADE DE MAQUINAS
	tratarQtdadeMaquinas = function(qtdMaquinas) {
		//COMBO
		$('#qtdadeMaquinas').val(qtdMaquinas);
		$("select[name=qtdadeMaquinas]").selectpicker("refresh");
		
		//RESUMO
		var txt = $('#solCaptura :selected').text();
		if (txt != 'Selecione') {
			$("#descSolCaptura").text(txt + " x " + qtdMaquinas);
		}
	}
	//EVENTO DE TRATAMENTO DE SELEÇÃO DA QUANTIDADE DE MAQUINAS
	$("#qtdadeMaquinas").on("change", function() {
		tratarQtdadeMaquinas($(this).val());
	});
	
	//PRÓXIMA PÁGINA
	nextPageInfoAdicional = function(dataObject) {
		$("#nomeClienteIA").text(dataObject.nome);
		$("#descRamoAtividade").text($('#ramoAtividade :selected').text());
		
		var nmFantasia = $('#nomeFantasia').val();
		var cidComercial = $('#cidadeComercial').val();
		var estadoComercial = $('#estadoComercial').val();
		var cidCorrespondencia = $('#cidadeCorrespondencia').val();
		var estadoCorrespondencia = $('#estadoCorrespondencia').val();

		popularCamposForm(dataObject);
		
		$('#nomeFantasia').val(nmFantasia);
		$('#cidadeComercial').val(cidComercial);
		$('#estadoComercial').val(estadoComercial);
		$('#cidadeCorrespondencia').val(cidCorrespondencia);
		$('#estadoCorrespondencia').val(estadoCorrespondencia);

		afterInitInfoAdicional();		
		nextPage();		
	}
	
	//VALIDAMOS O FORMATO DO EMAIL REQUERIDO PARA O MPOS
	validarEmail = function(email){		
		var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if (!reg.test(email)) {
		    $('span[id="message.email.required"]').after('<div class="error"><span style="color: red">Por favor, informe um email válido</span></div>');
		    hideMessageError();
		    return false;
		}
		return true;
	}
	
	//BOTAO DE EMAIL REQUERIDO, PARA SOLUCAO MPOS
	$('#btoRequiredEmail').on('click', function(){
		var email = $('#emailTxtRequired').val();		
		var isEmailValido = validarEmail(email);
		
	    if(isEmailValido){
	    	//$('#naoPossuiEmail').val(null);
	    	$('#naoPossuiEmail').prop('checked', false);
	    	$('#email').prop('disabled', false);
	    	$('#email').val(email);
	    	$('#myModalEmail').modal('toggle');
	    	$('#solCapturaSubmit').click();
	    }
	});
	
	//TRATAR EMAIL PARA SOLUCAO DE CAPTURA MPOS, É OBRIATORIO 
	tratarEmailSolucaoCaptura = function(){
		var solCaptura = $("#solCaptura").val();
		//CASO SOLUCAO IGUAL A MPOS (CIELO ZIP) O EMAIL É OBRIGATÓRIO
		if(solCaptura != '0' &&  solCaptura == '26'){			
			var email = $('#email').val();
			if(email == ''){
				$('#myModalEmail').modal({backdrop: 'static', keyboard: false}); 
				return false;
			}
			return true;
		}
		return true;
	}

	//TRATAMENTO AUXILIAR PARA TAXAS RECEBA RAPIDO
	verificarTaxaRecebaRapido = function(){
		if($("#chkVendasArv").is(':checked')){
			$('#txArv').val($('input[name=taxaRR]:checked').val())
		}
	}
	
	//SUBMIT FORM
	$('#solCapturaSubmit').click(function(e) {
		e.preventDefault();
		
		var isNextPage = tratarEmailSolucaoCaptura();//MPOS EMAIL É OBRIGATÓRIO		
		if(isNextPage){		 
		    showLoadPage('S');
			e.preventDefault();	
	        blockedDoubleClick($(this));
	        //METODO AUXILIAR TRATAMENTO RECEBA RAPIDO
	        verificarTaxaRecebaRapido();
			$(".panel-body").find('.error').remove();
			$.post({
				url : hostContext() + 'saveSolucaoCaptura',
				data : $("form[name=formCrm]").serialize(),
				success : function(data) {
					console.log(data);
					if (data.validated) {
						console.log(data.objectModel);
						//ATUALIZAMOS O RASCUNHO
						atualizarRascunho('atualizarRascunhoSolCaptura','step02')
						nextPageInfoAdicional(data.objectModel);

					} else {
						$.each(data.errorMessages, function(key, value) {
							$('span[id="message.' + key + '"]').after('<div class="error"><span style="color: red">'+ value + '</span></div>');
						});
						showLoadPage('H');
						hideMessageError();
					}
				}
			});
		 setScroll();
	   }
	});

})