$(function(){

	$('#error-efetivar-credenciamento').hide();
	$('.divRecuperacao').hide();
	
	tratarBtoFinished = function(){
		if($("#codigoProducao").val() != ''){
			$(".finished").prop("disabled",false);
		}else{
			$(".finished").prop("disabled",true);
		}
	}
	
	$("#codigoProducao").on("keyup",function(event) {
		var value = event.target.value;
		if(value != ''){
			$(".finished").prop("disabled",false);
		}else{
			$(".finished").prop("disabled",true);
		}
	});
	
	//DADOS PROPRIETARIOS 2 E 3
	dadosProprietarios = function(){
		$('#resumoProprietarios').show();
		$('#resumoNomeProp2').text($('#nomeSegundoProp').val());
		$('#resumoCpfProp2').text($('#cpfSegundoProp').val());
		$('#resumoDtNascProp2').text($('#dtNascSegundoProp').val());		
		$('#resumoNomeProp3').text($('#nomeTerceiroProp').val());
		$('#resumoCpfProp3').text($('#cpfTerceiroProp').val());
		$('#resumoDtNascProp3').text($('#dtNascTerceiroProp').val());		
	}
	
	//POPULAR DADOS DONO
   popularDadosDono = function(tipoPessoa){
		$('#resumoDono').text($('#nome').val());
		$('#resumoCpf').text($('#cpf').val());
		$('#resumoDtNascimento').text($('#dtNascimento').val());
		$('#resumoTelPrincipal').text('('+$('#dddPrincipal').val()+') '+$('#telPrincipal').val());
		$('#resumoTelCelular').text('('+$('#dddCelular').val()+') '+$('#telCelular').val());	
		$('#resumoEmail').text($('#email').val() == '' ? 'E-mail não informado' : $('#email').val());	
		if(tipoPessoa =='F'){$('#resumoProprietarios').hide();}else{dadosProprietarios();}
		$('#resumoRamoAtividade').text($('#ramoAtividade :selected').text());
   }

 //SOLUCAO LIO DESCRICAO OPERADORA
   getDescricaoOperadora = function(codigo){
	   switch (codigo) {
	    case '1':
	        return "VIVO";	       
	    case '2':
	       return "CLARO";
	    case '3':
	        return "TIM";
	    case '4':
	        return "OI";
	   }
   }
   
   //SOLUCAO LIO TRATAMENTO OPERADORA
   infoOperadoras = function(solucaoCaptura){	   
	   var descricao;	   
	   if($('#naoInfoOperadora').is(':checked') == false){
		   $("input:checkbox[name='operadora']").each(function() {
				if ($(this).is(":checked")) {
					if(descricao == undefined){
						descricao = getDescricaoOperadora($(this).val());
					}else{
						descricao = descricao + ' | ' +getDescricaoOperadora($(this).val());
					}
				}
			});
	   }else{
		   descricao = 'Não soube informar';
	   }
	   return descricao;
   }
   
   //SOLUCAO LIO POSSUI OPERADORA <> NÃO
   isSolucaoLio = function(solucaoCaptura){
	   return  solucaoCaptura >= 21 &&  solucaoCaptura <= 24;
   }
   
   //POPULAR SOLUÇÃO CAPTURA
   popularSolucaoCaptura = function(){	  
	   $('#resumoSolCaptura').text($('#solCaptura :selected').text());
	   
	   if(isSolucaoLio($('#solCaptura :selected').val())){
		   $('.rsOperadora').show();
		   $('#resumoOperadora').text(infoOperadoras());
	   }else{$('.rsOperadora').hide();}
	   
	   var isArvChecked = $('#chkVendasArv').is(':checked');
	   if(isArvChecked){
		   $('#resumoDesejaArv').text('Sim');	   
		   $('#resumoTaxaArv').text($('input[name=txArv]:checked').val());
		   $('.rsTaxaArv').show();
	   }else{
		   $('#resumoDesejaArv').text('Não');	  
		   $('.rsTaxaArv').hide();
	   }
	   
	   $('#resumoPlano').text($("input:radio[name='tpPlano']:checked").parent('label').text());
	   var plano = $("input:radio[name='tpPlano']:checked").data('name');
	   var solucaoCaptura = $("#solCaptura").val();	   
	   $('#resumoQtdMaquinas').text(plano =='convencional' && solucaoCaptura !='26'? $("#qtdadeMaquinas").val() : '1');
	   $('#txt-dias-resumo-contratacao').text('');
	   switch(plano){
	   		case 'controle':
	   			$('#txt-dias-resumo-contratacao').text('Em quantos dias deseja receber suas vendas no crédito à vista?');
	   			$('#resumoDias').text($("input:radio[name='diasLiqControle']:checked").parent('label').text());
	   			break;
	   		case 'convencional':
	   			$('#txt-dias-resumo-contratacao').text('Recebimento de suas vendas');
	   			$('#resumoDias').text('Débito em 1 dia | Crédito em até 30 dias');
	   			break;
	   		case 'aluguelZero':
	   			$('#txt-dias-resumo-contratacao').text('Recebimento de suas vendas');
	   			$('#resumoDias').text('Débito em 1 dia | Crédito em 02 dias');

	   			break;
	   }
   }
   
   //POPULAR ESTABELECIMENTO
   popularEstabelecimento = function(tipoPessoa){	
	   if(tipoPessoa == 'J'){
		   $('.rsEstabelPj').show();
		   $('#resumoCnpj').text($('#cnpj').val());
		   $('#resumoRazaoSocial').text($('#razaoSocial').val());
		   $('#resumoNomeFantasia').text($('#nomeFantasia').val());
	   }else{
		   $('.rsEstabelPj').hide();
	   }
	   //COMERCIAL
	   $('#resumoCepComercial').text($('#cepComercial').val());
	   $('#resumoLogComercial').text($('#logradouroComercial').val());
	   $('#resumoNumComercial').text($('#numeroComercial').val());
	   $('#resumoComplComercial').text($('#complementoComercial').val());
	   $('#resumoCidadeComercial').text($('#cidadeComercial').val());
	   $('#resumoUfComercial').text($('#estadoComercial').val());
	  //CORRESPONDENCIA
	   if($('#endPrincMsmCorresp').is(':checked')){
		   $('.rsMsmEndereco').show();
		   $('#resumoMsmEndereco').text('O endereço de correspondência é o mesmo do principal');
		   $('.rsEnderecoDiferente').hide();
	   }else{
		   $('.rsEnderecoDiferente').show();
		   $('#resumoCepCorrespondencia').text($('#cepCorrespondencia').val());
		   $('#resumoLogCorrespondencia').text($('#logradouroCorrespondencia').val());
		   $('#resumoNumCorrespondencia').text($('#numeroCorrespondencia').val());
		   $('#resumoComplCorrespondencia').text($('#complementoCorrespondencia').val());
		   $('#resumoCidadeCorrespondencia').text($('#cidadeCorrespondencia').val());
		   $('#resumoUfCorrespondencia').text($('#estadoCorrespondencia').val());
		   $('.rsMsmEndereco').hide();
	   }
	   
	   var endEntrega = $("input[name='entregaMaquina']:checked").val();	   
	   $('#resumoEntregaMaquinas').text(endEntrega == '1'? 'Endereço do Cadastro' : 'Posto de Atendimento');
   }

   //POPULAR ESTABELECIMENTO
   popularDomicilioBancario = function(tipoPessoa){
	   var tipoConta = $("input[name='tipoConta']:checked").val(); //0-Corrente | 2-Poupança
	   $('#resumoTipoConta').text(tipoConta =='0'?'Corrente':'Poupança');
	   $('#resumoBanco').text($('#banco option:selected').text());
	   $('#resumoAgencia').text($('#agencia').val());
	   var codBanco = $('#banco').val();
	   $('#resumoConta').text(codBanco=='104' ? $('#operacaoCaixa').text()+leftPad($('#conta').val(),9) : $('#conta').val());
	   $('#resumoDigito').text($('#digito').val());
   }
   
   formatarNumLogico = function(data){
		var principal = data.substring(0, data.length -1);
		var digito = data.substring(data.length -1);
		return principal+'-'+digito;
   }
   
  //EXIBIE INFORMAÇÕES QUANDO HOUVER ENTREGA DE MAQUINA 
   exibirInfoEntregaMaquina = function(data){
	   console.log("dados : " , data);
		 $.each(data, function(key, valor){
			 var $group = data.length > 1 ?'<div class="col-xs-12 col-sm-06 col-md-6">' : '<div class="col-xs-12 col-sm-12 col-md-12">';
			     $group += '<ul class="list-group">';
					$group += '<li class="list-group-item list-group-item-info active"><label>Numero Logico </label> : <span>'+valor.numeroLogico+'-'+valor.digNumLogico+'</span></li>';
					$group += ' <li class="list-group-item list-group-item-info"><label>Código de Acesso </label> : <span>'+valor.codigoAcesso+'</span> </li>';
					//OPERADORAS
					 $.each(valor.listaOperadoras, function(k, v){
						$group += ' <li class="list-group-item list-group-item-info"><label>Operadora '+v.tipo+' </label> : <span>'+v.descricao+'</span></li>';
					 });				 
				   $group += '</ul>';
				$group += '</div>';
				$('#text-logico').after($group); 
			});
   }
   
   //EXIBIE INFORMAÇÕES QUANDO NAO HOUVER ENTREGA DE MAQUINA 
   exibirInfoNaoEntregaMaquina = function(data){
	   var isMobile = $('#solCaptura').val() == 18;//MOBILE
	    $.each(data, function(key, valor){
	    	 var $group = data.length > 1 ?'<div class="col-xs-12 col-sm-06 col-md-6">' : '<div class="col-xs-12 col-sm-12 col-md-12">';
	    	 	$group += '<ul class="list-group">';
	    	 		$group += '<li class="list-group-item list-group-item-info active"><label>Numero Logico </label> : <span>'+valor.numeroLogico+'-'+valor.digNumLogico+'</span></li>';
	    	 		if(!isMobile)
	    	 			$group += ' <li class="list-group-item list-group-item-info"><label>SLA Instalação </label> : <span>'+valor.slaInstalacao+'</span> </li>';
			   $group += '</ul>';
			 $group += '</div>';
			 $('#text-logico').after($group); 
	    });
   }
   
   //TRATAMENTO PARA EXIBIR AS INFORMAÇÕES PARA O CLIENTE
   tratarInfoExibicao = function(data){
	   $('.modal-body').find('.aguarde').remove();	
	   
	   if(isEntregaMaquinaNaHora()){
		   exibirInfoEntregaMaquina(data);
		   
	   }else{	   
		   exibirInfoNaoEntregaMaquina(data);
	   }
	   $('#myModal').modal({backdrop: 'static', keyboard: false});  
   }
   
   sendInfoSms = function(){
	   $('.modal-body').find('.aguarde').remove();	
		var $group = '<div class="col-xs-12 col-sm-12 col-md-12"><ul class="list-group process-logico">';
		$group += '<li class="list-group-item list-group-item-warning">O numero lógico será enviado por SMS</li>';
		$group += '<ul></div>';				  
	   $('#text-logico').after($group);	   
	   $('.divRecuperacao').show();
	   $('#btoNumeroLogico').prop('disabled', false);
	 }
   
   //OBTER O NUMERO LOGICO
   var countRetentar = 1;
   obterNumeroLogico = function(numeroProposta){
	   if(countRetentar < 4){// 2 TENTATIVAS NO CASO DE INSUCESSO
			$.get({
				url : hostContext()+'obterNumeroLogico/'+numeroProposta,
				success : function(data) {
					if(data == undefined || data.infoEquipamentos == null){
						setTimeout(explode,10000); 
						countRetentar++;
						if(countRetentar > 3){$('.tentativa').text('( última tentativa )')}else{$('.tentativa').text('( tentativa '+countRetentar+' )');}
					
					}else{						
						//EXIBICAO DAS INFORMAÇÕES
						tratarInfoExibicao(data.infoEquipamentos);
					}
				},
				error : function(error){
					    console.log('ERROR  : ', error);
					    sendInfoSms();
				}
			});
	   }else{
		   sendInfoSms();
	   }
   }
   
   //AGUARDANDO A BUSCA
   blink =  function(selector) {
	    $(selector).fadeOut('slow', function() {
	        $(this).fadeIn('slow', function() {
	            blink(this);
	        });
	    });
	}
  
   function explode(){	
	   obterNumeroLogico($('#numeroProposta').val());
   }

   cleanMessagesInfo = function(text, glyphicon){
	   	  $('#text-type-info').removeClass(text);
	   	   $('#text-process').removeClass(glyphicon);
		  $('.modal-body').find('.process-error').remove();
		  $('.modal-body').find('.process-logico').remove();
		  $('.modal-body').find('.process-ec').remove();
		  $('.modal-body').find('.title-process').remove();
		  $('.modal-body').find('.inside').remove();
   }
   
   isEntregaMaquinaNaHora = function(){
	   var isEntregaMaquina = $( "#solCaptura option:selected" ).attr('data-maq');
	   var codFerramenta = getCodigoFerramenta();
	   return isEntregaMaquina == 'S' && codFerramenta == 8 ;
	   
   }
   
   //AGUARDA GERACAO D ENUMERO LOGICO
   aguardarNumeroLogico = function(){
	  $('#text-logico').after('<div class="col-xs-12 col-sm-12 col-md-12"><p class="aguarde">Aguardando geração de número lógico ....<span class="tentativa"> ( tentativa 1 )</span></label></p></div>');
	  setTimeout(explode, 20000);
	  blink($('.aguarde'));
   }
   
   //TRATAMENTO PARA EXIBIÇÃO DAS INFORMAÇÕES DE CONCLUSÃO DA PROPOSTA
   showInfoProposta = function(data){	  
	   setScroll(); 
	   //SUCESSO
	   if(data.validated){		
		   cleanMessagesInfo('text-danger', 'glyphicon glyphicon-exclamation-sign');
	   	  $('#text-type-info').addClass('text-success');
		  $('#text-process').after('<div class="col-xs-12 col-sm-12 col-md-12"><span class="text-success glyphicon glyphicon-ok-circle"></span><span class="title-process"> Proposta incluída com sucesso !</span></div>');	 
		  
			var $group = '<div class="col-xs-12 col-sm-12 col-md-12"><ul class="list-group process-ec">';
				$group += '<li class="list-group-item list-group-item-success"><label>Número do EC </label> : <span>'+data.objectModel.numeroEc+'</span></li>';
				$group += '<ul></div>';
		  
		  $('#text-resumo').after($group);
		  
		  
		  if($('#solCaptura').val() == 18 || isEntregaMaquinaNaHora()){//MOBILE || (ENTREGA DE MAQUINA NOW - FEIRAS)
			  aguardarNumeroLogico();
		  }
		  $('#myModal').modal({backdrop: 'static', keyboard: false});  
		//ERROR
	   }else{	
		  cleanMessagesInfo('text-success', 'glyphicon glyphicon-ok-circle');
		  $('#text-type-info').addClass('text-danger');
		  $('#text-process').after('<div class="col-xs-12 col-sm-12 col-md-12"><span class="process-error"> Ocorreram inconsistências no processamento da proposta ! </span></div>');
		  
		    var html = '<hr/><div>';
		    html += '<ul class="inside">';
			$.each(data.errorMessages, function(key, value) {
				html += '<li><span>&nbsp; '+value+'</span></li>';
			});
		    html += '</ul>';
		    html +='</div>';
		    $('#text-resumo').after(html);
		    $('#myModal').modal();  
	   }
	  //$('#finished').click();
	  showLoadPage('H');
   }
   
	$('#credenciarSubmit').click(function(e) {
		
		$(".panel-body").find('.error').remove();
		showLoadPage('S');
		e.preventDefault();
		
		$(this).prop('disabled', true);

		$('.nome-plaqueta-pf').prop('disabled', false);
		$('.nome-plaqueta-pj').prop('disabled', false);
		$('#nomeFantasia').prop('disabled', false);		
		$('#cidadeComercial').prop('disabled', false);
		$('#estadoComercial').prop('disabled', false);
		$('#cidadeCorrespondencia').prop('disabled', false);
		$('#estadoCorrespondencia').prop('disabled', false);

			$.post({
				url : hostContext()+'credenciar',
				data : $("form[name=formCrm]").serialize(),	
				success : function(data) {	
					$('#error-efetivar-credenciamento').hide();
					console.log(data);
					showInfoProposta(data);
					nextPage();		
				},
				error : function (error){
					$('#credenciarSubmit').prop('disabled', false);
					$('#error-efetivar-credenciamento').show();
					showLoadPage('H');
					console.log(error);
					$('#message-error-efetivacao').text('O CREDENCIAMENTO NÃO PODE SER CONCLUÍDO POR FALHA SISTÊMICA. FAVOR TENTAR NOVAMENTE.');
				}
			});
	});

	//CONTIGENCIA RECUPERAÇÃO NUMERO LOGICO
	$('#btoNumeroLogico').on('click', function(){
		$('.divRecuperacao').hide();
		$('.modal-body').find('.process-logico').remove();	
		 countRetentar = 1;
		 aguardarNumeroLogico();
	})
})