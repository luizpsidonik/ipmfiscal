import {GerarXml,tratarRetorno,cancelamento} from "./EmissaoXml.js"
import axios from 'axios';
import * as convert from "xml-js"
import { default as FormData } from "form-data"

export function EnviarEmissao(url,username,password,jsonDeEntrada){
    return new Promise((resolve,reject)=>{
        const formData = new FormData();
        GerarXml(jsonDeEntrada).then((xml)=>{
            const xmlBuffer = Buffer.from(xml, 'utf-8');
            formData.append('xml', xmlBuffer, "nota.xml");
            
            axios.post(url,formData, {
                    headers: {
                    'Authorization': 'Basic ' + Buffer.from(username + ":" + password).toString('base64'),
                    'Content-Type': 'multipart/form-data'
                    }
                }
                ).then(function (retorno) {
                    const converter = convert.xml2json(retorno.data,{compact: true,spaces:4})
                    resolve(tratarRetorno(JSON.parse(converter).retorno))
                })
                .catch(function (err) {
                    reject(err)
                });
            }).catch(reject)
        })
        
    
}

export function EnviarCancelamento(url,username,password,jsonDeEntrada){
    return new Promise((resolve,reject)=>{
        const formData = new FormData();
        cancelamento(jsonDeEntrada).then((xml)=>{
            const xmlBuffer = Buffer.from(xml, 'utf-8');
            formData.append('xml', xmlBuffer, "nota.xml");
            axios.post(url,formData, {
                    headers: {
                    'Authorization': 'Basic ' + Buffer.from(username + ":" + password).toString('base64'),
                    'Content-Type': 'multipart/form-data'
                    }
                }
                ).then(function (retorno) {
                    const converter = convert.xml2json(retorno.data,{compact: true,spaces:4})
                    resolve(tratarRetorno(JSON.parse(converter).retorno))
                })
                .catch(function (err) {
                    reject(err)
                });
            }).catch(reject)
        })
}