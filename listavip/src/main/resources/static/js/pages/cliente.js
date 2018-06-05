$(function() {
	
	showLoadPage('H');
	
	$(".dtNasc").mask("99/99/9999", {
	    completed: function () {
	        console.log('complete')
	        var value = $(this).val().split('/');
	        var maximos = [31, 12, 2100];
	        var novoValor = value.map(function (parcela, i) {
	            if (parseInt(parcela, 10) > maximos[i]) return maximos[i];
	            return parcela;
	        });
	        if (novoValor.toString() != value.toString()) $(this).val(novoValor.join('/')).focus();
	    }
	});
	
	// ## TRATAMENTO CAMPOS FORM 
	$('#clienteSubmit').prop('disabled',true);
	$("#contato_secundario").hide();
	$("#add-proprietario").hide(); 
	$("#error-cliente-existe").hide();
	$("#numProposta").hide();
	$("#maisProprietarios").hide();
	
	if($("#maisProprietarios").val() == 'true'){
		$(".add-contato").removeClass("glyphicon glyphicon-plus-sign");
		$(".add-contato").addClass("glyphicon glyphicon-minus-sign");
		$("#contato_secundario").show();
	}

/*	cleanTelaClienteExistente = function(tpPessoa, idade){
		if(tpPessoa == 'J'){$('#cpf').val('');}
		if(!idade){$('#dtNascimento').val('');}
		$('.ddd').val('');
		$('#telPrincipal').val('');
		$('#telCelular').val('');
		$('#email').val('');
	}
*/
	// TIPO PESSOA
	$("#cpTipoPessoa").hide();

	tratarTipoPessoa = function(tpPessoa) {
		$("#cpTipoPessoa").show();
		if (tpPessoa == 'F') {
			$("#cpCpf").show();
			$("#cpCnpj").hide();
			$("#add-proprietario").hide();
			$("#contato_secundario").hide();
		} else {
			$("#cpCnpj").show();
			$("#cpCpf").show();
			$("#add-proprietario").show();
		}
	}
	
	var vlrTpPessoa = $("input:radio[name='tpPessoa']:checked").val();
	if(vlrTpPessoa != undefined){
		tratarTipoPessoa(vlrTpPessoa);
	}
	

	//RADIO BUTTON TIPO PESSOA
	$("input:radio[name='tpPessoa']").change(function() {
		tratarTipoPessoa($(this).val());
		//cleanTelaClienteExistente($(this).val());
	})

	// MASCARA CPF | CNPJ
	$("#cpf").mask("###.###.###-##");
	$("#cnpj").mask("##.###.###/####-##");

	$("#telPrincipal").focusin(function(){
		$(this).unmask();
		$(this).attr('maxlength','9');
		$(this).val($(this).val().replace(/[^0-9]/g,''));
	});

	//TELEFONE PRINCIPAL
	$("#telPrincipal").focusout(function(){
		var tel = $(this).val();
		if(tel.length < 9){
			$("#telPrincipal").mask("####-####");
		}else{
			$("#telPrincipal").mask("#####-####");
			}
		
	});
	
	//TELEFONE CELULAR
	$("#telCelular").mask("#####-####"); 
	$("#telCelular").on("keyup", function(){
		var tamanho = $(this).val().length;
		if(tamanho > 10){
			$(this).val($(this).val().substring(0,10));
		}
	});

	$('#naoPossuiEmail').change(function(){
		if ($(this).is(":checked")) {
			$('#email').val('');
			$('#email').prop('disabled', true);
		} else {
			$('#email').prop('disabled', false);
		}

	})
	//CONTATO SECUNDARIO
	$(".add-contato").click(function(e){
		e.preventDefault();		
		if($(this).hasClass("glyphicon glyphicon-plus-sign")){
			$("#contato_secundario").show();
			$(this).removeClass("glyphicon glyphicon-plus-sign");
			$(this).addClass("glyphicon glyphicon-minus-sign");
			
		}else{
			$("#contato_secundario").hide();
			$(this).removeClass("glyphicon glyphicon-minus-sign");
			$(this).addClass("glyphicon glyphicon-plus-sign");
		}
	})
	
	//PRÓXIMA PÁGINA
	nextPageSolCaptura = function(dataObject) {
		$("#nomeClienteSC").text($("#nome").val());		
		var tipoPessoa = $("#rdPF").is(':checked') ? 'F' : 'J';	
		popularCamposForm(dataObject);			
		afterInitSolucao($qtdadeMaquinas);
		nextPage();	
		
	}
	
	//STEP01 DATA NASCIMENTO
	$("#dtNascimento").focusout(function(){
		var dataNasc = $(this).val();
		if(dataNasc != ''){	
			atualizarRascunho('atualizarRascunhoCliente','step01');
		}
	});
	
	var $ramoAtividade;
	var $qtdadeMaquinas;
	//SUBMIT FORM
	$('#clienteSubmit').click(function(e) {
		showLoadPage('S');
		e.preventDefault();
        blockedDoubleClick($(this));
		
		$(".panel-body").find('.error').remove();
		$.post({
			url : hostContext()+'saveCliente',
			data : $("form[name=formCrm]").serialize(),			
			success : function(data) {
				if(data.validated){
					console.log(data.objectModel);
					//ATUALIZAMOS O RASCUNHO
					atualizarRascunho('atualizarRascunhoCliente','step02');
					nextPageSolCaptura(data.objectModel);					
				}else{
					console.log(data);
					$.each(data.errorMessages, function(key, value) {
						$('span[id="message.' + key + '"]').after('<div class="error"><span style="color: red">'+ value + '</span></div>');
					});
					showLoadPage('H');
					hideMessageError();
				}
			}
		});
		setScroll();
	});

	//##UTILS
	// SOMENTE NUMEROS
	$(".onlyNumber").keypress(function(e) {
		if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
			return false;
		}
	});

	// TRATAR CARACTERES ESPECIAIS
	$(".ascii").on("change paste keyup onkeypress", function(event) {
		var value = foldToASCII(event.target.value).toUpperCase();
		value = value.replace(/[^0-9A-Za-z ]/g, '')
		event.target.value = value;
	});

	tratarCamposCliente = function(tipoPessoa, cpfCnpj){
		 // $("#dtNascimento").focus();
		if(tipoPessoa == 'F'){
			$('#cpf').val(cpfCnpj);
		}else{
			$('#cnpj').val(cpfCnpj);
			if($("#maisProprietarios").val() == 'true'){
				$(".add-contato").removeClass("glyphicon glyphicon-plus-sign");
				$(".add-contato").addClass("glyphicon glyphicon-minus-sign");
				$("#contato_secundario").show();
			}
		}
	}
	
	//## SERVICES ##//
	var existe;
	clienteExisteSec = function(cliente, tipoPessoa){		
		$.get({ 
			  url : hostContext()+'/verificarExistenciaCliente/'+cliente+'/'+tipoPessoa,
			  dataType: 'text',
		 	  async: false,
				  success : function(data) {
					   existe = data;					  
				  },
				  error : function(error){
					  existe = 'E';		  
				}
		});
	}

	tratarMask = function(method){
		if(method == 'unmask'){
			$("#cpf").unmask();
			$("#cnpj").unmask();
			$("#cpfSegundoProp").unmask();
			$("#cpfTerceiroProp").unmask();
		}else{
			$("#cpf").mask("###.###.###-##");
			$("#cnpj").mask('##.###.###/####-##');			
			$("#cpfSegundoProp").mask("###.###.###-##");
			$("#cpfTerceiroProp").mask("###.###.###-##");
		}
	}
	
	clienteExisteCrd = function (tipoPessoa, cpfCnpj, codFerramenta){
		var central = $("#usuarioCentral").val();
		var perfilSmart = $('#codPerfilSmart').val();
		tratarMask('unmask');
		$.get({ 
			  url : hostContext()+'/obterPropostaRascunho/'+tipoPessoa+'/'+cpfCnpj+'/'+codFerramenta,
			  async: false,
			  success : function(data) {
				  console.log("CRD OK : "+data)
				  if(data.nome== null){
					  data.nome=$("#nome").val();
				  }
				  console.log(data);
				  $ramoAtividade = data.ramoAtividade;
				  $qtdadeMaquinas= data.qtdadeMaquinas;
					
				  popularCamposForm(data);				 
				  tratarCamposCliente(tipoPessoa, cpfCnpj);
				  infoConta(data.tipoConta, data.banco);
			  },
			  error : function(error){
				  console.log("CRD NOK : "+error)
			  }
		});
		 $("#usuarioCentral").val(central); 
		 $('#codPerfilSmart').val(perfilSmart);
		 tratarMask('mask');
	}
	
	cpfCnpjInvalido = function(key, value){
		$(".panel-body").find('.error').remove();
		$('#'+key).focus(); 
		$('span[id="message.' + key + '"]').after('<div class="error"><span style="color: red">'+ value + '</span></div>');
		hideMessageError();
	}


	bloquearTelaCliente = function(action){
		$('#clienteSubmit').prop('disabled', action);
	}
	
	//MENSAGEM DE ERRO CLIENTE
	getMessageErroCliente = function(message, tipoPessoa){
		$("#error-cliente-existe").show();
		$('#message-error').text(message);
		bloquearTelaCliente(true);
		if(tipoPessoa == 'F' ? $('#cpf').focus(): $('#cnpj').focus());
	}
	
	//CALCULO DE MAIORIDADE
	function calcularIdade(ano, mes, dia) {
		var d = new Date,
	        ano_atual = d.getFullYear(),
	        mes_atual = d.getMonth() + 1,
	        dia_atual = d.getDate(),	        
	        quantos_anos = ano_atual - ano;

		if(ano > ano_atual || mes > 12 || dia > 31){
			return 999;
		}
	    if (mes_atual < mes || mes_atual == mes && dia_atual < dia) {
	        quantos_anos--;
	    }
	    return quantos_anos < 0 ? 0 : quantos_anos;
	}

	$(".cpfCnpj").focusout(function(){
		$("#error-cliente-existe").hide();
		
		var tipoPessoa = $("#rdPF").is(':checked') ? 'F' : 'J';		
		var campo = $(this).attr('name');
		
		if(tipoPessoa =='F' && campo =='cpf' || 
				tipoPessoa =='J' && campo =='cnpj'){
			bloquearTelaCliente(false);
			var cpfCnpj = (tipoPessoa == 'F') ? $("#cpf").val().replace(/[^0-9]/g,'') : $("#cnpj").val().replace(/[^0-9]/g,'');		
			clienteExisteSec(cpfCnpj, tipoPessoa);
			//CLIENTE JA EXISTE
			if(existe == 'Y'){				
				getMessageErroCliente('Cliente existente no SEC', tipoPessoa);
			//CPF/CNPJ INVALIDO	
			}else if(existe == 'I'){
				if(tipoPessoa == 'F'){
					cpfCnpjInvalido("cpf","CPF inválido");
				}else{
					cpfCnpjInvalido("cnpj","CNPJ inválido");
				}
				bloquearTelaCliente(true);
			//ERROR CONSULTA
			}else if(existe == 'E'){				
				getMessageErroCliente('Falha sistêmica na Consulta de cliente já cadastrado. Favor tentar novamente', tipoPessoa);
				
			}else{
				//TUDO OK, CONSULTAMOS A PROPOSTA RASCUNHO	
				bloquearTelaCliente(false);	
				
				clienteExisteCrd(tipoPessoa, cpfCnpj, getCodigoFerramenta()); 
			}
		}
	});

	//MESSAGE ERRO DATA NASCIMENTO
	messageErrorDtNascimento = function(id, message){
		$('span[id="message.' + id + '"]').after('<div class="error"><span style="color: red">'+message+'</span></div>');
		bloquearTelaCliente(true);
		$('#'+id).focus();
	}
	
	//TRATAMENTO DATA DE NASCIMENTO
	$(".dtNasc").focusout(function(event){		
		$(".panel-body").find('.error').remove();
		var tipoPessoa = $("#rdPF").is(':checked') ? 'F' : 'J';	
		
		var nascimento = $(this).val();
		var id = event.target.id;
		if(nascimento.length < 10){			
			messageErrorDtNascimento(id, 'Data inválida');
			
		}else{
			var arr = nascimento.split('/');			
			var idade = calcularIdade(arr[2], arr[1], arr[0]);
			
			if(idade == 999){				
				messageErrorDtNascimento(id, 'Data inválida');
				
			}else if(idade < 18){
				messageErrorDtNascimento(id, 'Proprietário menor de 18 anos');
				
			}else{
				bloquearTelaCliente(false);
			}
		}
	});

})