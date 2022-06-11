# IPMFISCAL
Módulo de emissão de notas de serviço para o múnicipio de Gravataí - RS

## FUNÇÕES
- Emissão de NFS-e para o provedor IPMFISCAL  [Emissão](#emissão)
- Cancelamento de NFS-e para o provedor IPMFISCAL [Cancelamento](#cancelamento)
- Em breve será possivel fazer a solicitação de cancelamento.

## EMISSÃO
```javascript
const emissao = require("ipmfiscal")
const jsonDeEntrada = {
    nf:{
        valor_total: 150.5,// VALOR TOTAL DA NOTA
        valor_desconto: 0,// VALOR DO DESCONTO. ESTE VALOR NÃO AFETARÁ A BASE DE CÁLCULO DO IMPOSTO, APENAS ASSINALA NA NOTA
        valor_ir:0,// VALOR DO IMPOSTO DE RENDA RETIDO. ESTE VALOR NÃO AFETARÁ A BASE DE CÁLCULO DO IMPOSTO, APENAS ASSINALA NA NOTA.
        valor_inss:0,//VALOR DO INSS. ESTE VALOR NÃO AFETARÁ A BASE DE CÁLCULO DO IMPOSTO, APENAS ASSINALA NA NOTA.
        valor_contribuicao_social:0,// VALOR DA CONTRIBUIÇÃO SOCIAL. ESTE VALOR NÃO AFETARÁ A BASE DE CÁLCULO DO IMPOSTO, APENAS ASSINALA NA NOTA.
        valor_rps:0,// VALOR DO RPS (RETENÇÕES DA PREVIDÊNCIA SOCIAL). ESTE VALOR NÃO AFETARÁ A BASE DE CÁLCULO DO IMPOSTO, APENAS ASSINALA NA NOTA.
        valor_pis:0,// VALOR DO PIS. ESTE VALOR NÃO AFETARÁ A BASE DE CÁLCULO DO IMPOSTO, APENAS ASSINALA NA NOTA.
        valor_cofins:0,// VALOR DO COFINS. ESTE VALOR NÃO AFETARÁ A BASE DE CÁLCULO DO IMPOSTO, APENAS ASSINALA NA NOTA.
        observacao:"Texto ......"// OBSERVAÇÃO DA NOTA 
    },
    prestador:{
        cpfcnpj:5000,// CPF OU CNPJ DO PRESTADOR DE SERVIÇO, NO CASO QUEM ESTÁ FAZENDO O SERVIÇO
        cidade:5500// CÓDIGO IBGE DA CIDADE(CHAMADO DE CÓDIGO TOM EX: Brusque 8055, GRAVATAÍ 8683) 
    },
    tomador:{
        tipo:"F",//TIPO DA PESSOA, INFORMAR: J PARA PESSOA JURÍDICA OU F PARA PESSOA FÍSICA.
        cpfcnpj:"77777777777",// CPF OU CNPJ DO TOMADOR DO SERVIÇO.
        ie:"",//INSCRIÇÃO ESTADUAL DO TOMADOR
        nome_razao_social:"Luiz",// NOME OU RAZÃO SOCIAL DO TOMADOR 
        sobrenome_nome_fantasia:"Psidonik",// SOBRENOME OU NOME FANTASIA
        logradouro:"Rua joão pedro, n 11",//LOGRADOURO DO ENDEREÇO DO ESTABELECIMENTO OU RESIDÊNCIA DO TOMADOR DO(S) SERVIÇO(S).
        email:"luizpsidonik@gmail.com",//QUANDO NECESSÁRIO INFORMAR MAIS DE UM E-MAIL OS MESMOS DEVERÃO SER SEPARADOS POR (;) OU (,)
        complemento:"11",//COMPLEMENTO DO ENDEREÇO DO ESTABELECIMENTO OU RESIDÊNCIA 
        ponto_referencia:"casa",//PONTO DE REFERÊNCIA DO ENDEREÇO DO ESTABELECIMENTO OU RESIDÊNCIA
        bairro:"centro",//BAIRRO DO ENDEREÇO DO ESTABELECIMENTO OU RESIDÊNCIA
        cidade:"8683",//CÓDIGO DA CIDADE DO ENDEREÇO DO ESTABELECIMENTO OU RESIDÊNCIA DO TOMADOR
        cep:"94010210",//CEP DO ENDEREÇO DO ESTABELECIMENTO OU RESIDÊNCIA
        ddd_fone_comercial:"51",//CÓDIGO DE ÁREA DO TELEFONE DO ESTABELECIMENTO
        fone_comercial:"99999999",//TELEFONE DO ESTABELECIMENTO
        ddd_fone_residencial:"51",//CÓDIGO DE ÁREA DO TELEFONE RESIDENCIAL
        fone_residencial:"9999999",//CÓDIGO DE ÁREA DO FAX DO TOMADOR
        ddd_fax:"51",//CÓDIGO DE ÁREA DO FAX DO TOMADOR
        fone_fax:"9999999"//NÚMERO DO FAX DO TOMADOR
    },
    itens:[{
        codigo_local_prestacao_servico:11,//CÓDIGO DA CIDADE DO ENDEREÇO DO ESTABELECIMENTO OU RESIDÊNCIA DO PRESTADOR (EX: Brusque 8055, GRAVATAÍ 8683)
        codigo_item_lista_servico:11,//CÓDIGO DO SUBITEM DA LISTA DE SERVIÇOS, EM CONFORMIDADE COM A LEI COMPLEMENTAR 116/2003.
        descritivo:"Descrição do Serviço",//DESCRITIVO COLOQUIAL DO SERVIÇO PRESTADO.
        aliquota_item_lista_servico:3,//ALÍQUOTA QUE IRÁ INCIDIR SOBRE A BASE DE CÁLCULO.ESTA ALÍQUOTA SERÁ CONSISTIDA DE ACORDO COM A LEGISLAÇÃO DO MUNICÍPIO. ATENÇÃO: CASO SEJA INFORMADA INCORRETAMENTE, O SOFTWARE REJEITARÁ A NOTA.
        situacao_tributaria:1,//CÓDIGO DA SITUAÇÃO TRIBUTÁRIA. ESTE CÓDIGO CARACTERIZARÁ A FORMA DE COBRANÇA DO ISS. VEJA NO ABA SITUAÇÕES TRIBUTÁRIAS. 
        valor_tributavel:10,//VALOR DO ITEM QUE SERVIRÁ DE BASE DE CÁLCULO PARA O IMPOSTO, COM A DEDUÇÃO APLICADA, SE A SITUAÇÃO TRIBUTÁRIA PERMITIR.
        valor_deducao:0,//VALOR DA DEDUÇÃO, QUANDO HOUVER E SE A SITUAÇÃO TRIBUTÁRIA PERMITIR.
        valor_issrf:0,//VALOR DO ISS RETIDO NA FONTE, QUANDO HOUVER E SE A SITUAÇÃO TRIBUTÁRIA PERMITIR.
        tributa_municipio_prestador:1,//ESTA TAG SERVE PARA INFORMAR ONDE SERÁ RECOLHIDO O IMPOSTO E DEVE SER PREENCHIDA COM: "0" OU "N" QUANDO A TRIBUTAÇÃO OCORRE NO LOCAL DA PRESTAÇÃO DO SERVIÇO, OU; "1" OU "S" QUANDO A TRIBUTAÇÃO OCORRE NO MUNICÍPIO DO PRESTADOR.
        unidade_codigo:"",//CÓDIGO DAS UNIDADES DE SERVIÇOS PRÉCADASTRADAS. OBS: CÓDIGO SOBRE VARIAÇÕES DE PREFEITURA PARA PREFEITURA. CAMPO TORNA-SE OBRIGATÓRIO A PARTIR DO MOMENTO EM QUE O MUNICÍPIO UTILIZA ESTA CONFIGURAÇÃO.
        unidade_quantidade:"",//QUANTIDADE DOS SERVIÇOS PRESTADOS, RELATIVO À UNIDADE INFORMADA. OBS.: CAMPO TORNA-SE OBRIGATÓRIO A PARTIR DO MOMENTO EM QUE O MUNICÍPIO UTILIZA ESTA CONFIGURAÇÃO.
        unidade_valor_unitario:""//VALOR UNITÁRIO DO SERVIÇO, REFERENTE A UNIDADE INFORMADA. OBS: CAMPO TORNA-SE OBRIGATÓRIO A PARTIR DO MOMENTO EM QUE O MUNICÍPIO UTILIZA ESTA CONFIGURAÇÃO.
    }],
}

const url = "https://ws-gravatai.atende.net:7443/atende.php?pg=rest&service=WNERestServiceNFSe&cidade=padrao"//URL PADRÃO DE GRAVATAÍ
const username = "0000000000" // CNPJ da empresa ou CPF
const password = "123" // SENHA DO IPMFISCAL - https://www.nfs-e.net/

emissao.EnviarEmissao(url,username,password,jsonDeEntrada).then(console.log).catch(console.log)// O RETORNO É JSON DA EMISSÃO
```
O  [Código Tom](http://www.fazenda.mg.gov.br/governo/assuntos_municipais/codigomunicipio/codmunicoutest_rs.html) é fornecido e mantido pela Receita Federal do Brasil. E está disponível para consulta em diversas plataformas.
## CANCELAMENTO
```javascript
const emissao = require("ipmfiscal")
const jsonDeEntrada = {
    nf:{
        numero: "15123010510202",//NÚMERO DA NFS-E A SER CANCELADA.
        situacao:"C",//DEVERÁ SER PREENCHIDO COM O VALOR: C PARA CANCELAMENTO
        observacao:"Texto ......"// INFORMAR O MOTIVO DO CANCELAMENTO DA NFS-E.
    },
    prestador:{
        cpfcnpj:5000,// CPF OU CNPJ DO PRESTADOR DE SERVIÇO, NO CASO QUEM ESTÁ FAZENDO O SERVIÇO
        cidade:8683// CÓDIGO IBGE DA CIDADE(CHAMADO DE CÓDIGO TOM EX: Brusque 8055, GRAVATAÍ 8683) 
    }
}

const url = "https://ws-gravatai.atende.net:7443/atende.php?pg=rest&service=WNERestServiceNFSe&cidade=padrao"//URL PADRÃO DE GRAVATAÍ
const username = "0000000000" // CNPJ da empresa ou CPF
const password = "123" // SENHA DO IPMFISCAL - https://www.nfs-e.net/

emissao.EnviarCancelamento(url,username,password,jsonDeEntrada).then(console.log).catch(console.log)// O RETORNO É JSON DO CANCELAMENTO
```
# EXEMPLO DE RETORNO
```javascript
{
  mensagem: '00001 - Sucesso',
  numero_nfse: '2994',
  serie_nfse: '1',
  data_nfse: '01/08/2019',
  hora_nfse: '14:28:29',
  situacao_codigo_nfse: '1',
  arquivo_gerador_nfse: '2994_0182910023252403.xml',
  nome_arquivo_gerado_eletron: '2994_0182910023252403.xml',
  link_nfse: 'http://demonstracao.nfs-e.net/datacenter/include/nfw/nfw_imp_notas.php?codauten=0182910023252403',
  cod_verificador_autenticidade: '0182910023252403',
  codigo_html: '<!DOCTYPE html>\n' +
    '     <html>\n' +
    '         <head>\n' +
    '             <title>Nota Fiscal de Serviço Eletrônica - Série TESTE - DEMONSTRACAO Nº 2994</title>\n' +
    '             <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">\n' +
    '             ... 48085 more characters'
}
```
# SITUAÇÕES TRIBUTÁRIAS
- 0 - Tributada Integralmente (TI): O valor do imposto será lançado para o emissor da nota.
- 1 - Tributada Integralmente com ISSRF (TIRF): O valor do imposto não será lançado, pois será recolhido pelo tomador, caso seja órgão público municipal.
- 2 - Tributada Integralmente e sujeita à Substituição Tributária (TIST): O valor do imposto não será lançado, pois será recolhido pelo tomador (substituto tributário), caso não seja um órgão público municipal.
- 3 -Tributada com redução da base de cálculo (TRBC): O valor do imposto será lançado para o emissor da nota, porém, na apuração da base de cálculo, será descontado o valor da tag <valor_deducao> (esta situação tributária somente se  aplica, caso o serviço consignado seja o de código 1705).
- 4 - Tributada com redução da base de cálculo com ISSRF (TRBCRF): O valor do imposto não será lançado, pois será recolhido pelo tomador, caso seja órgão público municipal, porém na apuração da base de cálculo será descontado o valor da tag <valor_deducao> (esta situação tributária somente se aplica, caso o serviço consignado seja o de código 1705).
- 5 - Tributada com redução da base de cálculo e sujeita à Substituição Tributária (TRBCST):
O valor do imposto não será lançado, pois será recolhido pelo tomador, caso não seja um órgão público municipal, porém na apuração da base de cálculo será descontado o valor da tag | PG 028 <valor_deducao> (esta situação tributária somente se aplica, caso o serviço consignado seja o de código 1705).
- 6 - Isenta (ISE): Não irá gerar valor de imposto, pois o prestador é isento.
- 7 - Imune (IMU): Não irá gerar valor do imposto, pois o prestador é imune.
- 8 - Não Tributada - ISS regime Fixo (NTIFix): Não irá influenciar no cálculo do imposto, pois o valor é previamente calculado.
- 9 - Não Tributada - ISS regime Estimativa (NTIEs): Não irá influenciar no cálculo do imposto, pois o valor é previamente estimado.
- 10 - Não Tributada - ISS Construção Civil recolhido antecipadamente (NTICc): Não irá gerar valor de imposto, pois foi recolhido antecipadamente (esta situação tributária somente se aplica, caso os serviços consignados sejam os de código 1701, 1702, 1703, 1705, 1719).
- 15 - Não Tributada - Ato Cooperado (NTAC): Não irá gerar valor do imposto, pois a prestação de serviço para cooperados não está sujeita ao ISS; porém, mesmo que cooperativa e caso o serviço seja prestado para um não cooperado, deve-se utilizar das outras situações tributárias, de acordo com o caso.