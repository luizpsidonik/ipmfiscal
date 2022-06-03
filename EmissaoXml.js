import xml from "xml"
import * as convert from "xml-js"

export function tratarRetorno(ObjRetorno){
    const json = {}
    Object.keys(ObjRetorno).forEach((item) => {
        if(item != "_comment"){
            if(item == 'mensagem'){
                json[item] = ObjRetorno[item]['codigo']['_text']
            }else{
                json[item] = ObjRetorno[item]['_text']
            }
        }
      });
    return json
}

export function GerarXml(ObjNota){
    return new Promise((resolve,reject)=>{
        let xmlNf;
        let xmlPrestador;
        let xmlTomador;
        let xmlItens = [];
        if(typeof ObjNota === "object"){
            if(ObjNota.hasOwnProperty("nf") && ObjNota.hasOwnProperty("prestador") && ObjNota.hasOwnProperty("tomador") && ObjNota.hasOwnProperty("itens")){
                try{
                    xmlNf = nf(ObjNota.nf)
                    xmlPrestador = prestador(ObjNota.prestador)
                    xmlTomador = tomador(ObjNota.tomador)
                    for(let i = 0; i < ObjNota.itens.length;i++){
                        var adicionarItem = lista(ObjNota.itens[i])
                        xmlItens.push(adicionarItem)
                    }
                }catch(erro){
                    reject(erro)
                }
                const notafinal = '<nfse>\n'+ xmlNf +'\n' + xmlPrestador+'\n' +xmlTomador+'\n' + '<itens>\n' +xmlItens.toString().replace("[","").replace("]","").replace(",","\n")+'\n</itens>\n</nfse>';
                const notafinalJSON = convert.xml2json(notafinal,{compact:true,spaces:4});
                const notafinalXML = convert.json2xml(notafinalJSON,{compact:true,spaces:4});
                resolve(notafinalXML);
            }else{
                reject("Erro na Geração da NFSe, pois os parametros do Objeto estão incompletos ou errados!");
            }
        }else{
            reject("Erro na Geração da NFSe, pois os parametros não foram informados em Objeto");
        }
        })
}

function nf({valor_total,valor_desconto=null,valor_ir=null,valor_inss=null,valor_contribuicao_social=null,valor_rps=null,valor_pis=null,valor_cofins=null,observacao=null}){
    
    let nfArray = [];
    if(valor_total){
        if(typeof valor_total === 'number'){
            nfArray.push({valor_total: valor_total.toString().replace(".",",")})
        }else{
            throw "Erro na emissão da NFS-E, campo valor_total não é do tipo Number!"
        }
    }else{
        throw "Erro na emissão da NFS-E, campo valor_total não foi informado!"
    }

    if(valor_desconto){
        if(typeof valor_desconto === 'number'){
            nfArray.push({valor_desconto: valor_desconto.toString().replace(".",",")})
        }else{
            throw "Erro na emissão da NFS-E, campo valor_desconto não é do tipo Number!"
        }
    }

    if(valor_ir){
        if(typeof valor_ir === 'number'){
            nfArray.push({valor_ir: valor_ir.toString().replace(".",",")})
        }else{
            throw "Erro na emissão da NFS-E, campo valor_ir não é do tipo Number!"
        }
    }

    if(valor_inss){
        if(typeof valor_inss === 'number'){
            nfArray.push({valor_inss: valor_inss.toString().replace(".",",")})
        }else{
            throw "Erro na emissão da NFS-E, campo valor_inss não é do tipo Number!"
        }
    }

    if(valor_contribuicao_social){
        if(typeof valor_contribuicao_social === 'number'){
            nfArray.push({valor_contribuicao_social: valor_contribuicao_social.toString().replace(".",",")})
        }else{
            throw "Erro na emissão da NFS-E, campo valor_contribuicao_social não é do tipo Number!"
        }
    }

    if(valor_rps){
        if(typeof valor_rps === 'number'){
            nfArray.push({valor_rps: valor_rps.toString().replace(".",",")})
        }else{
            throw "Erro na emissão da NFS-E, campo valor_rps não é do tipo Number!"
        }
    }

    if(valor_pis){
        if(typeof valor_pis === 'number'){
            nfArray.push({valor_pis: valor_pis.toString().replace(".",",")})
        }else{
            throw "Erro na emissão da NFS-E, campo valor_pis não é do tipo Number!"
        }
    }

    if(valor_cofins){
        if(typeof valor_cofins === 'number'){
            nfArray.push({valor_cofins: valor_cofins.toString().replace(".",",")})
        }else{
            throw "Erro na emissão da NFS-E, campo valor_cofins não é do tipo Number!"
        }
    }

    if(observacao){
        if(typeof observacao === 'string'){
            nfArray.push({observacao: observacao})
        }else{
            throw "Erro na emissão da NFS-E, campo observacao não é do tipo String!"
        }
    }

    const nf = [{nf:nfArray}]; 
    
    return xml(nf,{indent: true});

}

function prestador({cpfcnpj,cidade}){
    if(cpfcnpj == undefined || cidade == undefined){
        throw "Erro na emissão da NFS-E, campo cpfcnpj ou cidade não foi informado!"
    }else{
        if(typeof cpfcnpj === 'number' && typeof cidade === 'number'){
            const prestador = [{prestador:[{cpfcnpj:cpfcnpj},{cidade:cidade}]}]; 
            return xml(prestador,{indent: true});
        }else{
            throw "Erro na emissão da NFS-E, campo cpfcnpj ou cidade não é do tipo Number!"
        }
    }
}

function tomador({tipo,cpfcnpj=null,ie=null,nome_razao_social=null,sobrenome_nome_fantasia=null,logradouro=null,email=null,complemento=null,ponto_referencia=null,bairro=null,cidade=null,cep=null,ddd_fone_comercial=null,fone_comercial=null,ddd_fone_residencial=null,fone_residencial=null,ddd_fax=null,fone_fax=null}){

    let tomadorArray = [];

    if(tipo){
        if(typeof tipo === 'string' && tipo.length == 1){
            if(tipo == 'F' || tipo == 'J' || tipo == 'E'){
                tomadorArray.push({tipo: tipo})
            }else{
                throw "Erro na emissão da NFS-E, tipo não é do F(Pessoa Fisica),J(Pessoa Juridica) ou E(Estrageiro)!"
            }
        }else{
            throw "Erro na emissão da NFS-E, tipo não é do tipo String!"
        }
    }else{
        throw "Erro na emissão da NFS-E, campo tipo não foi informado!"
    }

    if(cpfcnpj){
        if(typeof cpfcnpj === 'number'){
            tomadorArray.push({cpfcnpj: cpfcnpj})
        }else{
            throw "Erro na emissão da NFS-E, campo cpfcnpj não é do tipo Number!"
        }
    }

    if(ie){
        if(typeof ie === 'number'){
            tomadorArray.push({ie: ie})
        }else{
            throw "Erro na emissão da NFS-E, campo ie não é do tipo Number!"
        }
    }

    if(nome_razao_social){
        if(typeof nome_razao_social === 'string'){
            tomadorArray.push({nome_razao_social: nome_razao_social})
        }else{
            throw "Erro na emissão da NFS-E, campo nome_razao_social não é do tipo String!"
        }
    }

    if(sobrenome_nome_fantasia){
        if(typeof sobrenome_nome_fantasia === 'string'){
            tomadorArray.push({sobrenome_nome_fantasia: sobrenome_nome_fantasia})
        }else{
            throw "Erro na emissão da NFS-E, campo sobrenome_nome_fantasia não é do tipo String!"
        }
    }

    if(logradouro){
        if(typeof logradouro === 'string'){
            tomadorArray.push({logradouro: logradouro})
        }else{
            throw "Erro na emissão da NFS-E, campo logradouro não é do tipo String!"
        }
    }

    if(email){
        if(typeof email === 'string'){
            tomadorArray.push({email: email})
        }else{
            throw "Erro na emissão da NFS-E, campo email não é do tipo String!"
        }
    }

    if(complemento){
        if(typeof complemento === 'string'){
            tomadorArray.push({complemento: complemento})
        }else{
            throw "Erro na emissão da NFS-E, campo complemento não é do tipo String!"
        }
    }
    
    if(ponto_referencia){
        if(typeof ponto_referencia === 'string'){
            tomadorArray.push({ponto_referencia: ponto_referencia})
        }else{
            throw "Erro na emissão da NFS-E, campo ponto_referencia não é do tipo String!"
        }
    }

    if(bairro){
        if(typeof bairro === 'string'){
            tomadorArray.push({bairro: bairro})
        }else{
            throw "Erro na emissão da NFS-E, campo bairro não é do tipo String!"
        }
    }
    if(cidade){
        if(typeof cidade === 'number'){
            tomadorArray.push({cidade: cidade})
        }else{
            throw "Erro na emissão da NFS-E, campo cidade não é do tipo Number!"
        }
    }
    if(cep){
        if(typeof cep === 'string'){
            tomadorArray.push({cep: cep.toString().replace(".","").replace("-","")})
        }else{
            throw "Erro na emissão da NFS-E, campo cep não é do tipo String!"
        }
    }
    if(ddd_fone_comercial){
        if(typeof ddd_fone_comercial === 'number'){
            tomadorArray.push({ddd_fone_comercial: ddd_fone_comercial})
        }else{
            throw "Erro na emissão da NFS-E, campo ddd_fone_comercial não é do tipo Number!"
        }
    }
    if(fone_comercial){
        if(typeof fone_comercial === 'number'){
            tomadorArray.push({fone_comercial: fone_comercial})
        }else{
            throw "Erro na emissão da NFS-E, campo fone_comercial não é do tipo Number!"
        }
    }
    if(ddd_fone_residencial){
        if(typeof ddd_fone_residencial === 'number'){
            tomadorArray.push({ddd_fone_residencial: ddd_fone_residencial})
        }else{
            throw "Erro na emissão da NFS-E, campo ddd_fone_residencial não é do tipo Number!"
        }
    }
    if(fone_residencial){
        if(typeof fone_residencial === 'number'){
            tomadorArray.push({fone_residencial: fone_residencial})
        }else{
            throw "Erro na emissão da NFS-E, campo fone_residencial não é do tipo Number!"
        }
    }
    if(ddd_fax){
        if(typeof ddd_fax === 'number'){
            tomadorArray.push({ddd_fax: ddd_fax})
        }else{
            throw "Erro na emissão da NFS-E, campo ddd_fax não é do tipo Number!"
        }
    }
    if(fone_fax){
        if(typeof fone_fax === 'number'){
            tomadorArray.push({fone_fax: fone_fax})
        }else{
            throw "Erro na emissão da NFS-E, campo fone_fax não é do tipo Number!"
        }
    }
    
    const tomador = [{tomador: tomadorArray}]; 
    
    return xml(tomador,{indent: true});
}
function lista({codigo_local_prestacao_servico,codigo_item_lista_servico,descritivo,aliquota_item_lista_servico,situacao_tributaria,valor_tributavel,valor_deducao=null,valor_issrf=null,tributa_municipio_prestador,unidade_codigo=null,unidade_quantidade=null,unidade_valor_unitario=null}){
    let listaArray = []
    if(codigo_local_prestacao_servico){
        if(typeof codigo_local_prestacao_servico === 'number'){
            listaArray.push({codigo_local_prestacao_servico: codigo_local_prestacao_servico})
        }else{
            throw "Erro na emissão da NFS-E, codigo_local_prestacao_servico não é do tipo Number!"
        }
    }else{
        throw "Erro na emissão da NFS-E, campo codigo_local_prestacao_servico não foi informado!"
    }

    if(codigo_item_lista_servico){
        if(typeof codigo_item_lista_servico === 'number'){
            listaArray.push({codigo_item_lista_servico: codigo_item_lista_servico})
        }else{
            throw "Erro na emissão da NFS-E, codigo_item_lista_servico não é do tipo Number!"
        }
    }else{
        throw "Erro na emissão da NFS-E, campo codigo_item_lista_servico não foi informado!"
    }

    if(descritivo){
        if(typeof descritivo === 'string'){
            listaArray.push({descritivo: descritivo})
        }else{
            throw "Erro na emissão da NFS-E, descritivo não é do tipo String!"
        }
    }else{
        throw "Erro na emissão da NFS-E, campo descritivo não foi informado!"
    }
    if(aliquota_item_lista_servico){
        if(typeof aliquota_item_lista_servico === 'number'){
            listaArray.push({aliquota_item_lista_servico: aliquota_item_lista_servico.toString().replace(".",",")})
        }else{
            throw "Erro na emissão da NFS-E, aliquota_item_lista_servico não é do tipo Number!"
        }
    }else{
        throw "Erro na emissão da NFS-E, campo aliquota_item_lista_servico não foi informado!"
    }
    if(situacao_tributaria){
        if(typeof situacao_tributaria === 'number'){
            if(situacao_tributaria >= 0 && situacao_tributaria <= 15){
                listaArray.push({situacao_tributaria: situacao_tributaria})
            }else{
                throw "Erro na emissão da NFS-E, situacao_tributaria foi informado um situação inexistente!"
            }
        }else{
            throw "Erro na emissão da NFS-E, situacao_tributaria não é do tipo Number!"
        }
    }else{
        throw "Erro na emissão da NFS-E, campo situacao_tributaria não foi informado!"
    }

    if(valor_tributavel){
        if(typeof valor_tributavel === 'number'){
            listaArray.push({valor_tributavel: valor_tributavel.toString().replace(".",",")})
        }else{
            throw "Erro na emissão da NFS-E, valor_tributavel não é do tipo Number!"
        }
    }else{
        throw "Erro na emissão da NFS-E, campo valor_tributavel não foi informado!"
    }

    if(valor_deducao){
        if(typeof valor_deducao === 'number'){
            listaArray.push({valor_deducao: valor_deducao.toString().replace(".",",")})
        }else{
            throw "Erro na emissão da NFS-E, campo valor_deducao não é do tipo Number!"
        }
    }
    
    if(valor_issrf){
        if(typeof valor_issrf === 'number'){
            listaArray.push({valor_issrf: valor_issrf.toString().replace(".",",")})
        }else{
            throw "Erro na emissão da NFS-E, campo valor_issrf não é do tipo Number!"
        }
    }

    if(tributa_municipio_prestador){
        if(typeof tributa_municipio_prestador === 'number'){
            if(tributa_municipio_prestador == 1 || tributa_municipio_prestador == 0){
                listaArray.push({tributa_municipio_prestador: tributa_municipio_prestador})
            }else{
                throw "Erro na emissão da NFS-E, tributa_municipio_prestador não é 0 ou 1!"
            }
        }else{
            throw "Erro na emissão da NFS-E, tributa_municipio_prestador não é do tipo Number!"
        }
    }else{
        throw "Erro na emissão da NFS-E, campo tributa_municipio_prestador não foi informado!"
    }
    
    if(unidade_codigo){
        if(typeof unidade_codigo === 'number'){
            listaArray.push({unidade_codigo: unidade_codigo.toString().replace(".",",")})
        }else{
            throw "Erro na emissão da NFS-E, campo unidade_codigo não é do tipo Number!"
        }
    }

    if(unidade_quantidade){
        if(typeof unidade_quantidade === 'number'){
            listaArray.push({unidade_quantidade: unidade_quantidade.toString().replace(".",",")})
        }else{
            throw "Erro na emissão da NFS-E, campo unidade_quantidade não é do tipo Number!"
        }
    }
    
    if(unidade_valor_unitario){
        if(typeof unidade_valor_unitario === 'number'){
            listaArray.push({unidade_valor_unitario: unidade_valor_unitario.toString().replace(".",",")})
        }else{
            throw "Erro na emissão da NFS-E, campo unidade_valor_unitario não é do tipo Number!"
        }
    }
    const lista = [{lista:listaArray}]; 
    return xml(lista,{indent: true});
}
export function cancelamento(ObjNota){
    function nf({numero,situacao,observacao}){
        let nfArray = [];
        if(numero){
            if(typeof numero === 'number'){
                nfArray.push({numero: numero.toString()})
            }else{
                throw "Erro no cancelamento da NFSe, campo numero não é do tipo Number!"
            }
        }
    
        if(situacao){
            if(typeof situacao === 'string'){
                if(situacao == "c" || situacao == "C"){
                    nfArray.push({situacao: situacao});
                }else{
                    throw "Erro no cancelamento da NFSe, campo situacao não é C ou c para cancelamento!";
                }
            }else{
                throw "Erro no cancelamento da NFSe, campo situacao não é do tipo String!"
            }
        }
        if(observacao){
            if(typeof observacao === 'string'){
                nfArray.push({observacao: observacao})
            }else{
                throw "Erro no cancelamento da NFSe, campo observacao não é do tipo String!"
            }
        }
    
        const nf = [{nf:nfArray}]; 
        
        return xml(nf,{indent: true});
    
    }
    function prestador({cpfcnpj,cidade}){
        if(cpfcnpj == undefined || cidade == undefined){
            throw "Erro no cancelamento da NFSe, campo cpfcnpj ou cidade não foi informado!"
        }else{
            if(typeof cpfcnpj === 'number' && typeof cidade === 'number'){
                const prestador = [{prestador:[{cpfcnpj:cpfcnpj},{cidade:cidade}]}]; 
                return xml(prestador,{indent: true});
            }else{
                throw "Erro no cancelamento da NFSe, campo cpfcnpj ou cidade não é do tipo Number!"
            }
        }
    }
    return new Promise((resolve,reject)=>{
        let xmlNf;
        let xmlPrestador;
        if(typeof ObjNota === "object"){
            if(ObjNota.hasOwnProperty("nf") && ObjNota.hasOwnProperty("prestador")){
                try{
                    xmlNf = nf(ObjNota.nf)
                    xmlPrestador = prestador(ObjNota.prestador)
                }catch(erro){
                    reject(erro)
                }
                const notafinal = '<nfse>\n'+ xmlNf +'\n' + xmlPrestador+'\n</nfse>';
                const notafinalJSON = convert.xml2json(notafinal,{compact:true,spaces:4});
                const notafinalXML = convert.json2xml(notafinalJSON,{compact:true,spaces:4});
                resolve(notafinalXML);
            }else{
                reject("Erro no cancelamento da NFSe, pois os parametros do Objeto estão incompletos ou errados!");
            }
        }else{
            reject("Erro no cancelamento da NFSe, pois os parametros não foram informados em Objeto");
        }
        })
}