$(function(){
	
	$("#endCorrespondecia").hide();
	$("#endPrincMsmCorresp").prop("checked",true);
	$("#retirada").hide();
	$('.operacao').hide();
	$('#msg-domicilio-bancario').hide();
	$("#error-cep-comercial").hide();
	$("#error-cep-correspondencia").hide();
	$('.cep').mask('#####-###');
	$('.msgCaixaConta').hide();
	
	//HORARIO DE FUNCIONAMENTO
	popularHorarioFuncionamento = function(){	
		$.get({ 
			  url : hostContext()+'/getHorariosFuncionamento',
	          dataType: 'json',
	          contentType: "application/json; charset=utf-8",
	          async:false,
			  success : function(data) {
				  
				$('#codHorarioAtendimento').find('option').remove();
				var selectbox = $('#codHorarioAtendimento');
				$('<option>').val(0).text("Selecione").appendTo(selectbox);

                 $.each(data, function (i, d) {
                     $('<option>').val(d.pk.codigo).text(d.descricao).appendTo(selectbox);
                 });
				 $("select[name=codHorarioAtendimento]").selectpicker("refresh");
			  },
			  error : function(error){
				  console.log(error);
			  }
		});
	}

	//CAMPO RAZAO SOCIAL REPLICA PARA NOME EXIBIDO E NOME FANTASIA
	$('#razaoSocial').on('keyup', function(){
		$('.nome-plaqueta-pj').val($(this).val());
		$('#nomeFantasia').val($(this).val());
	})
	
	tratarMccRestrito = function(codigoMcc,tipoPessoa){
		//7011 (Hotéis / Motéis) e 5813 (Boates / casas noturnas)
		if(codigoMcc == 7011 || codigoMcc == 5813){
			$('.nome-plaqueta-pf').prop('disabled', false);
			$('.nome-plaqueta-pj').prop('disabled', false);
			$('#nomeFantasia').prop('disabled', false);
		}else{
			$('.nome-plaqueta-pf').prop('disabled', true);
			$('.nome-plaqueta-pj').prop('disabled', true);
			$('#nomeFantasia').prop('disabled', true);
		}
	}
	
	tratarExibicaoEntMaquinas = function(){
		//SE FOR MOBILE OU FERRAMENTA FEIRAS, INIBIR ENTREGA DE MAQUINAS (SOLICITAÇÃO AREA DE NEGOCIO)
		var solCaptura = $("#solCaptura").val();
		var $tipoFerramenta = $('#codigoFerramenta').val();
		
		if(solCaptura == 18 || $tipoFerramenta == 8){
			$('.entregaMaquinas').hide();
			$('.horarioGtec').hide();			
		}else{
			$('.entregaMaquinas').show();
			$('.horarioGtec').show();		
		}
	}
	
	getMessageErrorCep = function(cause){		
		if(cause == 'I'){
			return 'CEP Inválido';
		}else{
			return 'Falha sistêmica na Consulta de CEP. Favor tentar novamente';
		}
	}
	erroComercial = function(cause){
		$("#error-cep-comercial").show();
		$('#cepComercial').focus();
		$('#message-error-cep-comercial').text(getMessageErrorCep(cause));
	}
	
	errorCorrespondencia = function(cause){
		$("#error-cep-correspondencia").show();
		$('#cepCorrespondencia').focus();
		$('#message-error-cep-correspondencia').text(getMessageErrorCep(cause));

	}
	
	errorConsultaCep = function(cause, tipoEndereco){	
		if(tipoEndereco == 'COMERCIAL'){
			erroComercial(cause);
		}else{
			errorCorrespondencia(cause);
		}
	}
	
	//POPULA AS INFORMAÇÕES DE ENDERECO, RETORNADOS DA CONSULTA DE CEP
	popularInformacoesEndereco = function(data, tipoEndereco){
		if(tipoEndereco == 'COMERCIAL'){
			$('#logradouroComercial').val(data.enderecos[0].nomeTipoLogradouro+' '+data.enderecos[0].nomeLogradouro); 
			$('#numeroComercial').val(data.enderecos[0].numeroLogradouro);
			$('#complementoComercial').val(data.enderecos[0].nomeComplementoCEP);
			$('#cidadeComercial').val(data.enderecos[0].nomeCidade);
			$('#estadoComercial').val(data.enderecos[0].siglaEstado);
			//ESSES CAMPOS NÃO PODEM SER ALTERADOS
			$('#cidadeComercial').prop('disabled', true);
			$('#estadoComercial').prop('disabled', true);

		}else{
			$('#logradouroCorrespondencia').val(data.enderecos[0].nomeLogradouro); 
			$('#numeroCorrespondencia').val(data.enderecos[0].numeroLogradouro);
			$('#complementoCorrespondencia').val(data.enderecos[0].nomeComplementoCEP);
			$('#cidadeCorrespondencia').val(data.enderecos[0].nomeCidade);
			$('#estadoCorrespondencia').val(data.enderecos[0].siglaEstado);
			//ESSES CAMPOS NÃO PODEM SER ALTERADOS
			$('#cidadeCorrespondencia').prop('disabled', true);
			$('#estadoCorrespondencia').prop('disabled', true);

		}
	}
	//CONSULTA DE CEP
	consultarCep = function(cep, tipoEndereco){	
		$("#error-cep-comercial").hide();
		$("#error-cep-correspondencia").hide();

		$.get({ 
			  url : hostContext()+'/consultarCep/'+cep.replace(/[^0-9]/g,''),
	          dataType: 'json',
	          contentType: "application/json; charset=utf-8",
	          async:false,
			  success : function(data) {
				  if(data.enderecos == null){
					  errorConsultaCep('I', tipoEndereco);
				  }else{
					  popularInformacoesEndereco(data, tipoEndereco);
				  }
			  },
			  error : function(error){
				  errorConsultaCep('E', tipoEndereco);
			  }
		});
	}

	$('#cepComercial ').focusout(function(){
		var cep = $(this).val();
		if(cep != ''){
			consultarCep(cep, 'COMERCIAL');
		}
	})
	$('#cepCorrespondencia').focusout(function(){
		var cep = $(this).val();
		if(cep != ''){
			consultarCep(cep, 'CORRESPONDECIA');
		}
	})

	
    //REGRA ENDERECO
    $("#endPrincMsmCorresp").on("change", function(){
    	if ($(this).is(':checked')) {
    		$("#endCorrespondecia").hide();
    	}else{
    		$("#endCorrespondecia").show();
    	}
    })

    
    disabledEnabledEndereco = function (action){
		$('#cidadeComercial').prop('disabled', action);
		$('#estadoComercial').prop('disabled', action);
		$('#cidadeCorrespondencia').prop('disabled', action);
		$('#estadoCorrespondencia').prop('disabled', action);
	}
    
    $("input:radio[name='entregaMaquina']").on("change", function(){    	
    	if($(this).val() =='2'){
    		$("#retirada").show();
    	}else{
    		$("#retirada").hide();
    	}
    	disabledEnabledEndereco(false);

    	atualizarRascunho('atualizarInfoAdicional','step01')
    	
    	disabledEnabledEndereco(true);
    })

	//CONSULTA DE CEP
	obterListaBancos = function(tipoConta){	
		$.get({ 
			  url : hostContext()+'getListaBancos/'+tipoConta,
	          dataType: 'json',
	          contentType: "application/json; charset=utf-8",
	          async:false,
			  success : function(data) {
				 var selectbox = $('#banco');
                 $.each(data, function (i, d) {
                     $('<option>').val(d.pk.codigo).text(d.descResumida).appendTo(selectbox);
                 });
                 $("select[name=banco]").selectpicker("refresh");
			  },
			  error : function(error){
				  console.log(error);
			  }
		});
	}

    
   tratarContaCorrente = function(tipoPessoa, banco){
		if(tipoPessoa == 'J'){
			$('#poup').hide();
			$("input:radio[name='tipoConta'][value=0]").prop('checked', true);
			obterListaBancos(0)//CORRENTE
		}else{
			$('#banco').val(banco == null ? '0':banco);
			if(banco != '0'){
				$('#infoAdicionalSubmit').prop('disabled', false);
			}
		}
	}
	
   cleanOptionBancos = function(){
	   $('#banco option').each(function() {
		   $(this).remove();
	   });
	   $('<option>').val('').text('Selecione').appendTo($('#banco'));
   }
   
   $("input:radio[name='tipoConta']").on('change', function(){
	   cleanOptionBancos();
		$('.operacao').hide();
		$('.msgCaixaConta').hide();
	   obterListaBancos($(this).val());
   })
  
   //MENSAGEM OPERACAO
   tratarMensagemOperacao = function(tipoPessoa, tipoConta){
	   $('.operacao').show();
	   $('.msgCaixaConta').show();
	   $('#msg-caixa-conta').text('');
	   if(tipoPessoa == 'J'){
		   $('#msg-caixa-conta').text('Para cliente PJ Conta Corrente: Os dígitos 003 antes da conta serão colocados automaticamente');
		   $('#operacaoCaixa').text('003');
		   
	   }else if(tipoPessoa == 'F' && tipoConta =='0'){
		   $('#msg-caixa-conta').text('Para cliente PF Conta Corrente: Os dígitos 001 antes da conta serão colocados automaticamente');
		   $('#operacaoCaixa').text('001');
		   
	   }else if(tipoPessoa == 'F' && tipoConta =='2'){
		   $('#msg-caixa-conta').text('Para cliente PF Conta Poupança: Os dígitos 013 antes da conta serão colocados automaticamente');
		   $('#operacaoCaixa').text('013');
	   }
   }
   
   //DOMICILIO BANCARIO
   $('#banco').on('change', function(){
	   var codigoBanco = $(this).val();
	   if(codigoBanco == '104'){
		  
		   var tipoPessoa = $("#rdPF").is(':checked') ? 'F' : 'J';
		   var tipoConta = $("#corrente").is(':checked') ? '0' : '2';
		   
		   tratarMensagemOperacao(tipoPessoa, tipoConta);
		   
	   }else{
		   $('.operacao').hide();
		   $('.msgCaixaConta').hide();
	   }
   })
   //INIT
   tratarTipoPessoaEndereco = function(){
	    var tipoPessoa = $("#rdPF").is(':checked') ? 'F' : 'J';		   
	    if(tipoPessoa == 'F'){
	    	$('#txCpfCnpfIa').text('CPF');
	    	$('.nome-plaqueta-pf').val($('#nome').val());
	    	$('.nmFantasia').hide();
	    	$('.rzSocial').hide();
	    	$('#cpfCnpfIa').val($('#cpf').val());	    	
	    	$('.nm-exibido-pj').hide();
	    	$('.nm-exibido-pf').show();
	    }else{
	    	$('#txCpfCnpfIa').text('CNPJ');
	    	$('.nmFantasia').show();
	    	$('#nmFantasia').val($('#nmFantasia').val());
	    	$('#nomePlaqueta').val('');
	    	$('#cpfCnpfIa').val($('#cnpj').val());
	    	$('.rzSocial').show();
	    	$('.nm-exibido-pf').hide();
	    	$('.nm-exibido-pj').show();
	    }
	    if($('#cepComercial').val() != ''){
			$('#cidadeComercial').prop('disabled', true);
			$('#estadoComercial').prop('disabled', true);
	    }
	    if($('#cepCorrespondencia').val() != ''){
	    	$('#cidadeCorrespondencia').prop('disabled', true);
	    	$('#estadoCorrespondencia').prop('disabled', true);
	    }
   }
   //INIT
   tratarOperacaoCaixa = function(){
	   var codBanco = $('#banco').val();
	   if(codBanco == '104'){
		   var tipoPessoa = $("#rdPF").is(':checked') ? 'F' : 'J';
		   var tipoConta = $("#corrente").is(':checked') ? '0' : '2';
		   
		   tratarMensagemOperacao(tipoPessoa, tipoConta);
	   }
   }
   
   callServiceContaInvalida = function(data){	   
	   console.log('CRITICA DOMICILIO BANCARIO : ',  data); 
	   $.post({
		   url : hostContext()+'criticarDomicilioBancario',
		   data :data,
		   
		   success : function(resp) {
			   console.log('STATUS CRITICA VALIDACAO DOMICILO ', resp);
			   
		   },error : function(error){
			   console.log("ERRO AO CRITICAR DOMICILIO BANCARIO ");			 
		   }
	   });
   }
   
   popularCriticaContaInvalida = function(){
	   var $tipoPessoa = $("#rdPF").is(':checked') ? 'F' : 'J';	
	   var data = {}
	   data['cpfCnpj']= $tipoPessoa == 'F' ? $('#cpf').val() : $('#cnpj').val();
	   data['tipoPessoa'] = $tipoPessoa;
	   data['numeroProposta']=$('#numeroProposta').val();	
	   var $codBanco = $('#banco').val() ; 
	   data['banco']= $codBanco;
	   data['agencia']=$('#agencia').val();	   
	   var $conta;
	   if($codBanco == '104'){
		   var operacao = $('#operacaoCaixa').text();
		   $conta = operacao+$('#conta').val()+'-'+$('#digito').val();
	   }else{
		   $conta = $('#conta').val()+'-'+$('#digito').val();
	   }	   
	   data['conta']=$conta;
	   data['tipoConta']=$("#corrente").is(':checked') ? '0' : '2';
	   	//POPULAMOS A CRITICA	
	   callServiceContaInvalida(data)
   }
   
   exibirMsgDomicilio = function(codigo){
	   showLoadPage('H');
	   $('#msg-domicilio-bancario').show();
	   if(codigo == 0){
		   $('#msg-domicilio-bancario').removeClass('alert alert-danger');
		   $('#msg-domicilio-bancario').addClass('alert alert-success');
		   $('#msg-domicilio').text('CONTA VALIDA')	;	 
		   $('#infoAdicionalSubmit').prop('disabled', false);
	   }else{
		   $('#msg-domicilio-bancario').removeClass('alert alert-success');
		   $('#msg-domicilio-bancario').addClass('alert alert-danger');
		   if(codigo == 13){
			   $('#msg-domicilio').text('BANCO NAO ASSOCIADO')
		   }else if(codigo == 14){
			   $('#msg-domicilio').text('BANCO INVALIDO')			   
			   popularCriticaContaInvalida();			   
		   }else if(codigo == 15){
			   $('#msg-domicilio').text('AGENCIA INVALIDA')			   
			   popularCriticaContaInvalida();			   
		   }else if(codigo == 16){
			   $('#msg-domicilio').text('CONTA CORRENTE INVALIDA')			   
			   popularCriticaContaInvalida();			   
		   }else if(codigo == 99){
			   $('#msg-domicilio').text('DOMICILIO BANCARIO EXISTENTE NO SEC');
		   }else if(codigo == 100){
			   $('#msg-domicilio').text('FALHA SISTÊMICA NA VALIDAÇÃO DE DOMICÍLIO BANCÁRIO (CÁLCULO DO DÍGITO). FAVOR TENTAR NOVAMENTE');
		   }else if(codigo == 101){
			   $('#msg-domicilio').text('FALHA SISTÊMICA NA VALIDAÇÃO DE DOMICÍLIO BANCÁRIO EXISTENTE. FAVOR TENTAR NOVAMENTE');
		   }

		   $('#infoAdicionalSubmit').prop('disabled', true);
	   }
   }
   
   validarDomicilioObrigatorio = function(tipoConta, banco, agencia, conta, digito){
	   $(".panel-body").find('.error').remove(); 
	   var count = 0;
	   if(tipoConta == undefined){ $('span[id="message.tipoConta"]').after('<div class="error"><span style="color: red">Favor selecionar o Tipo de Conta</span></div>'); count++;}
	   if(banco == '0'){ $('span[id="message.banco"]').after('<div class="error"><span style="color: red">O campo Banco é obrigatório</span></div>'); count++;}
	   if(agencia == ''){ $('span[id="message.agencia"]').after('<div class="error"><span style="color: red">O campo Agência é obrigatório</span></div>'); count++;}
	   if(conta ==''){ $('span[id="message.conta"]').after('<div class="error"><span style="color: red">O campo Conta é obrigatório</span></div>'); count++;}
	   if(digito == ''){ $('span[id="message.digito"]').after('<div class="error"><span style="color: red">O campo Dígito é obrigatório</span></div>');count++;}
	   hideMessageError();
	   return count>0 ? false: true;
   }
   
   var codValDomicilio;
   validarDomicilioBancario = function(codigoBanco, numeroAgencia, numeroConta, tipoConta){
	   if(codigoBanco == 104)//CAIXA
		   numeroConta = $('#operacaoCaixa').text()+numeroConta;
		$.get({ 
			  url : hostContext()+'/validarVerificarDomicilioBancario/'+codigoBanco+'/'+numeroAgencia+'/'+numeroConta+'/'+tipoConta,
	          dataType: 'json',
	          async : false,
	          contentType: "application/json; charset=utf-8",
			  success : function(data) {
				  console.log(data);
				  codValDomicilio = data;
			  },
			  error : function(errorCode){
				  codValDomicilio = errorCode;//ERRO
			  }
		});
   }
   //VALIDAÇÃO DOMICILIO AUXILIAR
   validarDomicilioAux = function(digito){
	   
	   var banco = $('#banco').val();
	   var agencia = $('#agencia').val();
	   var conta = $('#conta').val();
	   var digito = digito;
	   var tipoConta = $("input:radio[name='tipoConta']:checked").val();
	   
	   var isDadosValidos = validarDomicilioObrigatorio(tipoConta, banco, agencia, conta, digito);
	   
	   if(isDadosValidos){
		   validarDomicilioBancario(banco, agencia, conta+''+digito, tipoConta);		
		   exibirMsgDomicilio(codValDomicilio);	
	   }
   }
   
	//VALIDACAO DOMICILIO BANCARIO
	$('#digito').focusout(function(){
		validarDomicilioAux($(this).val());
	});

   
	//PRÓXIMA PÁGINA
	nextPageContratacao = function(dataObject) {
		popularCamposForm(dataObject);
		afterInitDadosContratacao();
		nextPage();		
	}

	//SUBMIT FORM
	$('#infoAdicionalSubmit').click(function(e) {
		
		showLoadPage('S');
		e.preventDefault();
		
		//VALIDAMOS NOVAMENTE PARA GARANTIR QUE O USUÁRIO NÃO ALTEROU O DOMICILIO
		validarDomicilioAux($('#digito').val());
		if(codValDomicilio == 0){		
			$(this).prop('disabled', true);
			
			$('#nomeFantasia').prop('disabled', false);				
			var tipoPessoa = $("#rdPF").is(':checked') ? 'F' : 'J';	
			if(tipoPessoa == 'F'){$('.nome-plaqueta-pf').prop('disabled', false);}else{$('.nome-plaqueta-pj').prop('disabled', false);}
			
			disabledEnabledEndereco(false);

			$(".panel-body").find('.error').remove();
			
			$.post({
				url : hostContext()+'saveInfoAdicional',
				data : $("form[name=formCrm]").serialize(),	
				success : function(data) {
					if(data.validated){
						console.log(data.objectModel);
						//ATUALIZAMOS O RASCUNHO
						atualizarRascunho('atualizarInfoAdicional','step02')
						nextPageContratacao(data.objectModel);	
						disabledEnabledEndereco(true);
					}else{
						$("#infoAdicionalSubmit").prop('disabled', false);
						console.log(data);
						$.each(data.errorMessages, function(key, value) {
							$('span[id="message.' + key + '"]').after('<div class="error"><span style="color: red">'+ value + '</span></div>');
						});
						showLoadPage('H');
						setScroll(); 
						disabledEnabledEndereco(true);
						hideMessageError();
					}
				}
			});
		}else{
			  showLoadPage('H');
			  hideMessageError();
			  $('#infoAdicionalSubmit').prop('disabled', true);
		}
	});

})