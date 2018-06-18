/**
 * Método que recupera os dados de uma URL
 * 
 * @param {String} url A URL que se deseja recuperar os dados
 */
function getURLSync(url)
{
    return ($.ajax({ type: "GET", url: url, cache: false, async: false }).responseText);
}

/**
 * Método que formata uma URL para uso com o Sharepoint
 * 
 * @param {String} fullUrl A Url vinda do Endpoint
 * @param {Array} parameters Os valores a serem substituidos na URL
 * @param {Url do Site} siteUrl O site, caso não seja passado ou seja passado nulo, será preenchido com o site atual
 */
function formatUrlEndPoint(fullUrl, parameters, siteUrl)
{
    var site = getSiteUrl(siteUrl);
    var vetor = fullUrl.split(/\{\d\}/g);
    var normalizedUrl = "";

    if(!parameters)
    {
        parameters = [];
    }

    for(var i = 0; i < vetor.length; i++)
    {
        normalizedUrl = (vetor[i].toString().trim() == "") ? (normalizedUrl + "{"+i+"}") : (normalizedUrl + vetor[i] + "{"+i+"}")
    }

    parameters.unshift(site);

    for(var i = 0; i < parameters.length; i++)
    {
        normalizedUrl = normalizedUrl.replace("{"+i+"}", parameters[i]);
    }

    vetor = null;
    
    return(String.format(normalizedUrl, ""));
}

/**
 * Método que procura em toda a estrutura JSON por uma chave e retorna o valor
 * 
 * @param {JSON} json O JSON que se deseja pegar o valor
 * @param {String} key A chave, caso haja mais de uma chave no JSON, a primeira encontrada será retornada
 */
function getElementValue(json, key) 
{
    var keys = Object.keys(json);
    var retorno = "";

    for(var i = 0; i < keys.length; i++)
    {
        if(keys[i] == key)
        {
            return(json[keys[i]]);
        }

        if(typeof json[keys[i]] === 'object')
        {
            retorno = getElementValue(JSON.parse(JSON.stringify(json[keys[i]])), key);
        }
    }

    return(retorno);
}

/**
 * Método que retorna a URL atual do site
 * 
 * @param {String} urlSite A URL do site, caso não seja passada, será recupera a URL usando as variáveis do Sharepoint
 */
function getSiteUrl(urlSite)
{
    return(((urlSite) ? urlSite : window.parent._spPageContextInfo.webAbsoluteUrl));
}

/**
 * Método que cria um Header padrão
 * 
 * @param {String} token O token de segurança a ser incluído no Header
 */
function createDefaultHeaderData(token) 
{
    return (createHeaderData(
        [
            {
                "X-RequestDigest": token,
                "accept": "application/json;odata=verbose",
                "content-type": "application/json;odata=verbose",
                "Access-Control-Allow-Origin": "*",
                "IF-MATCH": "*"
            }
        ]
    ));
}

/**
 * Método que cria um Header padrão para operações de Update (Merge)
 * 
 * @param {String} token O token de segurança a ser incluído no Header
 */
function createMergeHeaderData(token) 
{
    return (createHeaderData(
        [
            {
                "Accept": "application/json;odata=verbose",  
                "Content-Type": "application/json;odata=verbose",  
                "X-RequestDigest": token,  
                "IF-MATCH": "*",  
                "X-HTTP-Method": "MERGE" 
            }
        ]
    ));
}

/**
 * Método que cria um Header padrão para operações de Criação (Insert)
 * 
 * @param {String} token O token de segurança a ser incluído no Header
 * @param {Boolean} includeContentType Se true, será incluído a parte content-type no Header
 */
function createSimpleHeaderData(token, includeContentType) 
{
    var simpleHeader = createHeaderData([{
                                            "Accept": "application/json;odata=verbose",
                                            "X-RequestDigest": token
                                        }]);
    
    if(includeContentType)
    {
        simpleHeader["content-type"] = "application/json;odata=verbose";
    }

    return (simpleHeader);
}

/**
 * Método que cria um Header padrão para operações de Deleção (Delete)
 * 
 * @param {String} token O token de segurança a ser incluído no Header
 */
function createDeleteHeaderData(token)
{
    return (createHeaderData(
        [
            {
                "X-RequestDigest": token,  
                "IF-MATCH": "*",  
                "X-HTTP-Method": "DELETE"
            }
        ]
    ));
}

/**
 * Método que cria um Array de dados para o Header
 * 
 * @param {Array} json Os valores a serem incluídos no header, exemplo: [{ "X-RequestDigest": token, "IF-MATCH": "*", "X-HTTP-Method": "DELETE" }]
 */
function createHeaderData(json)
{
    var headers = headers || {};

    for(var i = 0; i < Object.keys(json[0]).length;i++) 
    {
        headers[Object.keys(json[0])[i]] = json[0][Object.keys(json[0])[i]];
    } 

    return(headers);
}

/**
 * Método que cria uma chamada Ajax sem body
 * 
 * @param {String} methodType O tipo da chamada, ex: GET, POST, PUT, Etc.
 * @param {String} methodUrl A URL da chamada
 * @param {Boolean} isToCache Se True, a chamada será armazenada em cache
 * @param {Boolean} isToAsync Se True, A chamada será assíncrona
 * @param {JSONArray} methodHeaders O Header da chamada
 * @param {String} methodData Os dados a serem colocados na chamada
 */
function getAjaxCallWithData(methodType, methodUrl, isToCache, isToAsync, methodHeaders, methodData)
{
    if(methodData != null)
    {
        return($.ajax({ 
                            type: methodType, 
                            url: methodUrl, 
                            cache: isToCache,
                            async: isToAsync,
                            headers: methodHeaders,
                            data: methodData
                        }));
    }

    return($.ajax({ 
                    type: methodType, 
                    url: methodUrl, 
                    cache: isToCache,
                    async: isToAsync,
                    headers: methodHeaders
                }));
}

/**
 * Método que cria uma chamada Ajax para leitura simples do conteúdo de uma URL
 */
function getAjaxCallToReadUrl(methodUrl, isToCache, isToAsync)
{
    return($.ajax({
                url: methodUrl,
                async: isToAsync,
                cache: isToCache
            }));
}

/**
 * Método que recupera dados JSON de um serviço
 * 
 * @param {String} url A url do serviço
 * @param {String} method O tipo de método de recuperação
 * @param {Array} headers O Header a ser incluído na requisição
 * @param {Array} queryData Dados adicionais a serem incluídos no "Body"
 */
function createAjaxCall(url, method, headers, queryData) 
{
    var ajaxOptions =
        {
            url: url,
            type: method,
            cache: false,
            async: false,
            contentType: "application/json;odata=verbose",
            headers: headers
        };

    if (typeof queryData != 'undefined') 
    {
        ajaxOptions.data = JSON.stringify(queryData);
    }

    var call = jQuery.ajax(ajaxOptions);
    return (call);
}

/**
 * Função para formatar o valor a ser colocado em um campo de palavras chaves (Taxonomia)
 * O campo de palavras chaves segue o padrão <int>;#<rótulo>|<guid> para um único valor e o
 * padrão <int>;#<rótulo>|<guid>;#<int>;#<rótulo>|<guid> para multiplos valores;
 * 
 * Ex 01: Único valor: -1;#Label01|9f3e8e20-593b-471d-a145-81ff8664fd96
 * Ex 02: Vários valores: -1;#Label01|9f3e8e20-593b-471d-a145-81ff8664fd96;#-1;#Label02|8b18f6df-22be-4548-92b4-8f240d8fbfe5
 * 
 * Os valores guid devem existir no repositório de termos cadastrados para a lista no Sharepoint, do contrário
 * um erro será lançado.
 * 
 * @param {Integer} id O ID do termo, caso não haja, pode ser passado -1
 * @param {String} label O label do termo a ser apresentado ao usuário
 * @param {String} termID O GUID do termo no repositório de termos cadastrados para a lista no Sharepoint
 */
function formatTaxonomyField(id, label, termID)
{
    String.format("{0};#{1}|{2}", id, label, termID)
}
