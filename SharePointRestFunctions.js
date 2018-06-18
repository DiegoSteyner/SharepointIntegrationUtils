//Importação Harcoded caso seja necessária
//$.getScript('./SuperGenerics.js', null);

/**
 * Método que cria um item em uma lista Sharepoint
 * 
 * @param {String} listName O nome da lista
 * @param {JSONArray} itemProperties O Json Array {key:par} com o InternalName das propriedades e os valores a serem atribuídos a elas
 */
function createListItem(listName, itemProperties) 
{
    var listEndpoint = Endpoints.listEndpoints
    var retorno = null;
    
    itemProperties["__metadata"] = { "type": GetListItemEntityType(listName) };
    var header = createSimpleHeaderData(ObtemTokenDeSeguranca(), false);
    var url = formatUrlEndPoint(listEndpoint.listByTitle.url+listEndpoint.listByTitle.parameters.allItens, [listName]);

    createAjaxCall(url, "POST", header, itemProperties)
    .done(
        function(data)
        {
            retorno = data.d;
        })
    .fail(
        function(error)
        { 
            console.log(JSON.stringify(error)); 
        }
    );

    return(retorno);
}

/**
 * Método que atualiza um item em uma lista Sharepoint
 * 
 * @param {String} listName O nome da lista
 * @param {Number} itemID O ID do item na lista
 * @param {JSONArray} itemProperties O Json Array {key:par} com o InternalName das propriedades e os valores a serem atribuídos a elas
 */
function updateListItem(listName, itemID, itemProperties)
{
    var listEndpoint = Endpoints.listEndpoints
    var retorno = null;
    
    itemProperties["__metadata"] = { "type": GetListItemEntityType(listName) };
    var header = createMergeHeaderData(ObtemTokenDeSeguranca());
    var url = formatUrlEndPoint(listEndpoint.listByTitle.url+listEndpoint.listByTitle.parameters.itemById, [listName, itemID]);
    
    createAjaxCall(url, "POST", header, itemProperties)
    .done(
        function(data)
        {
            retorno = [{"status": "sucess"}];
        }
    )
    .fail(
        function(error)
        { 
            console.log(JSON.stringify(error)); 
        }
    );

    return(retorno);
}

/**
 * Método que deleta um item em uma lista Sharepoint
 * 
 * @param {String} listName O nome da lista
 * @param {Number} itemID O ID do item na lista
 */
function deleteListItem(listName, itemID)
{
    var retorno = null;
    var listEndpoint = Endpoints.listEndpoints

    var header = createDeleteHeaderData(ObtemTokenDeSeguranca());
    var url = formatUrlEndPoint(listEndpoint.listByTitle.url+listEndpoint.listByTitle.parameters.itemById, [listName, itemID]);
    
    createAjaxCall(url, "POST", header, null)
    .done(
        function(data)
        {
            retorno = data;
        }
    )
    .fail(
        function(error)
        { 
            console.log(JSON.stringify(error)); 
        }
    );

    return(retorno);
}

/**
 * Método que efetua o download de um arquivo através de uma solicitação do binário (Blob) dele ao sharepoint
 * 
 * @param {String} fileurl A URL relativa do arquivo. Ex(/site/subsite/libraryInternalName/path)
 * @param {Boolean} nativeName Se True, o nome será definido pelo Browser
 * @param {String} filename O nome do arquivo a ser baixado.
 */
function downloadFileByBlobRequest(fileurl, nativeName, filename)
{
    var xhr = new XMLHttpRequest();
    var fileEndPoint = Endpoints.fileEndPoints

    var url = formatUrlEndPoint(fileEndPoint.fileByRelativePath.url+fileEndPoint.fileByRelativePath.parameters.downloadFileBinary, [fileurl]);

    xhr.open("GET", url);
    xhr.responseType = "arraybuffer";
    
    xhr.onload = function () 
    {
        if (this.status === 200) 
        {
            var blob = new Blob([xhr.response], {type: "application/octet-stream"});
            var objectUrl = URL.createObjectURL(blob);
            
            if(nativeName)
            {
                objectUrl.app
                window.open(objectUrl);
            }
            else
            {
                var a = document.createElement("a");
                a.href = objectUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(objectUrl);
                a.remove();
            }
        }
    };
    
    xhr.send();
}

/**
 * Método que executa o download de um arquivo apenas delegando a requisição ao próprio sharepoint
 * 
 * @param {String} fileUrl A URL absoluta do arquivo no sharepoint. Ex(/site/subsite/libraryInternalName/path)
 */
function downloadFileBySharepointDelegate(fileUrl)
{
    location.href = formatUrlEndPoint(Endpoints.generalEndpoints.downloadFileByDelegation.url, [fileUrl]);
}

/**
 * Método que retorna os itens da lista
 * 
 * @param {String} listName O nome da lista
 */
function getListItens(listName)
{
    var retorno = null;
    var listEndpoint = Endpoints.listEndpoints;

    var header = createDefaultHeaderData(ObtemTokenDeSeguranca());
    var url = formatUrlEndPoint(listEndpoint.listByTitle.url+listEndpoint.listByTitle.parameters.allItens, [listName]);

    createAjaxCall(url, "GET", header, null)
    .done(
        function(data)
        {
            retorno = data.d;
        }
    )
    .fail(
        function(error)
        { 
            console.log(JSON.stringify(error)); 
        }
    );

    return(retorno);
}

/**
 * Método que retorna um item da lista baseado em seu ID
 * 
 * @param {String} listName O nome da lista
 */
function getListItemByID(listName, itemID)
{
    var retorno = null;
    var listEndpoint = Endpoints.listEndpoints;

    var header = createDefaultHeaderData(ObtemTokenDeSeguranca());
    var url = formatUrlEndPoint(listEndpoint.listByTitle.url+listEndpoint.listByTitle.parameters.itemById, [listName, itemID]);

    createAjaxCall(url, "GET", header, null)
    .done(
        function(data)
        {
            retorno = data.d;
        }
    )
    .fail(
        function(error)
        { 
            console.log(JSON.stringify(error)); 
        }
    );

    return(retorno);
}

/**
 * Método que retorna todas as colunas presentes em uma lista
 * 
 * @param {String} listName O nome da lista
 * @param {Boolean} onlyCustom Se True, Será retornado somente os campos customizados.
 */
function getAllColumnsList(listName, onlyCustom)
{
    var retorno = [];

    var listEndpoint = Endpoints.listEndpoints;
    var url = formatUrlEndPoint(listEndpoint.listByTitle.url+listEndpoint.listByTitle.parameters.allFields, [listName]);

    getAjaxCallToReadUrl(url, false, false)
    .success(function (result)
    {
        var data = xmlToJson(result);

        for(var i = 0; i < data.feed.entry.length; i++)
        {
            if(onlyCustom)
            {
                if(data.feed.entry[i].content["m:properties"]["d:FromBaseType"]["#text"] == 'false')
                {
                    retorno.push({  "EntityPropertyName":data.feed.entry[i].content["m:properties"]["d:EntityPropertyName"]["#text"], 
                                    "Description":data.feed.entry[i].content["m:properties"]["d:Description"]["#text"], 
                                    "FieldTypeKind":data.feed.entry[i].content["m:properties"]["d:FieldTypeKind"]["#text"], 
                                    "InternalName":data.feed.entry[i].content["m:properties"]["d:InternalName"]["#text"], 
                                    "StaticName":data.feed.entry[i].content["m:properties"]["d:StaticName"]["#text"], 
                                    "Title":data.feed.entry[i].content["m:properties"]["d:Title"]["#text"]
                                });
                }
            }
            else
            {
                retorno.push({  "EntityPropertyName":data.feed.entry[i].content["m:properties"]["d:EntityPropertyName"]["#text"], 
                                "Description":data.feed.entry[i].content["m:properties"]["d:Description"]["#text"], 
                                "FieldTypeKind":data.feed.entry[i].content["m:properties"]["d:FieldTypeKind"]["#text"], 
                                "InternalName":data.feed.entry[i].content["m:properties"]["d:InternalName"]["#text"], 
                                "StaticName":data.feed.entry[i].content["m:properties"]["d:StaticName"]["#text"], 
                                "Title":data.feed.entry[i].content["m:properties"]["d:Title"]["#text"]
                            });
            }
        }
    }).error(function (error)
    {
        console.log(JSON.stringify(error)); 
    });

    return(retorno);
}

/**
 * Método que extrai do location atual o endereço da pasta em que se está
 */
function getActualUrlFolder()
{
    var url = decodeURIComponent(window.parent.location);

    if(url.indexOf("RootFolder") != -1)
    {
        var lastIndex = -1;
        var firstIndex = url.indexOf('RootFolder=');
    
        if(url.indexOf('&') != -1)
        {
            lastIndex = url.indexOf('&');
        }
        else
        {
            lastIndex = url.length;
        }
    
        return(url.substring(((firstIndex == -1) ? 0 : firstIndex+'RootFolder='.length), lastIndex));
    }
    else
    {
        return("/");
    }
}

/**
 * Método que retorna as informações de um grupo especifico
 * 
 * @param {String} groupName O nome do grupo
 */
function getGroupByName(groupName)
{
    var retorno = null;
    var securityEndpoint = Endpoints.securityEndpoints;

    var header = createSimpleHeaderData(ObtemTokenDeSeguranca());
    var url = formatUrlEndPoint(securityEndpoint.siteGroups.url+"?"+securityEndpoint.siteGroups.parameters.groupByName, [groupName]);
    
    getAjaxCallWithData("GET", url, false, false, header, null)
    .success(function(data)
    {
        retorno = data.d.results;
    })
    .error(function (error)
    {
        console.log(JSON.stringify(error));
    });

    return(retorno);
}

/**
 * Método que retorna as informações de todos os grupos atualmente cadastrados no site
 */
function getAllGroups()
{
    var retorno = null;
    var securityEndpoint = Endpoints.securityEndpoints;

    var header = createSimpleHeaderData(ObtemTokenDeSeguranca());
    var url = formatUrlEndPoint(securityEndpoint.siteGroups.url);

    getAjaxCallWithData("GET", url, false, false, header, null)
    .success(function(data)
    {
        retorno = data.d.results;
    })
    .error(function (error)
    {
        console.log(JSON.stringify(error));
    });

    return(retorno);
}

/**
 * Método que retorna o conteúdo de uma pasta
 * 
 * @param {String} folderName O endereço relativo da pasta. Ex(/site/subsite/libraryInternalName/path)
 * @param {Boolean} files Se true, será retornado os files da pasta, do contrário, será retornada as pastas
 */
function getFolderContent(folderName, files)
{
    var retorno = null;

    var folderEndPoint = Endpoints.foldeEndpoints
    var type = ((files) ? folderEndPoint.folderByRelativeUrl.parameters.files : folderEndPoint.folderByRelativeUrl.parameters.folders);
    var url = formatUrlEndPoint(folderEndPoint.folderByRelativeUrl.url+type, [folderName]);

    createAjaxCall(url, "GET", createDefaultHeaderData(), null)
    .done(
        function(data)
        {
            retorno = data.d;
        }
    )
    .fail(
        function(error)
        { 
            console.log(JSON.stringify(error)); 
        }
    );

    return(retorno);
}

/**
 * Método que busca recursivamente todos os documentos e pastas dentro de uma pasta
 * 
 * @param {String} listName O nome da lista
 * @param {String} properties As propriedades ou filtros a serem incluídas na requisição
 */
function getAllContentInList(listName, properties)
{
    return(getAllContentInListQuery(listName, properties, '<View Scope="RecursiveAll"></View>'));
}

/**
 * Método que retorna todo o conteúdo de uma lista baseado em uma consulta CAML
 * 
 * @param {String} listName O nome da lista
 * @param {String} parameters Os parametros a serem concatenados na URL
 * @param {String} viewXml A consulta CAML Query desejada
 */
function getAllContentInListQuery(listName, parameters, viewXml)
{
    var retorno = null;
    var query = {  
        'query' : 
        { 
            '__metadata': { 'type': 'SP.CamlQuery' },  
            'ViewXml' : viewXml
        } 
    };

    var listEndpoint = Endpoints.listEndpoints;
    var url = formatUrlEndPoint(listEndpoint.listByTitle.url+listEndpoint.listByTitle.parameters.allItens, [listName]);
    
    createAjaxCall(url+((parameters) ? parameters : ""), "GET", createDefaultHeaderData(), query)
    .done(
        function(data)
        {
            retorno = data.d;
        }
    )
    .fail(
        function(error)
        { 
            console.log(JSON.stringify(error)); 
        }
    );

    return(retorno);
}

/**
 * Método que executa uma URL e retorna o JSON
 * 
 * @param {String} url A URL que se deseja conseguir o JSON
 * @param {String} type O tipo da requisição HTTP tais como, GET, POST, PUSH, DEL, etc.
 */
function getJsonFromUrl(url, type)
{
    var retorno = null;
    
    createAjaxCall(url, type, createDefaultHeaderData(), null)
    .done(
        function(data)
        {
            retorno = data.d;
        }
    )
    .fail(
        function(error)
        { 
            console.log(JSON.stringify(error)); 
        }
    );

    return(retorno);
}

/**
 * Método que executa uma pesquisa no Sharepoint
 * 
 * @param {String} consulta A palavra que se deseja procurar
 * @param {String} parameters Os parametros a serem concatenados na URL
 */
function execSearch(consulta, parameters)
{
    var generalEndPoint = Endpoints.generalEndpoints
    var url = formatUrlEndPoint(generalEndPoint.fullText.url, [consulta]);

    return(getJsonFromUrl(url+((parameters) ? parameters : "")));
}

/**
 * Método que faz check-out de um arquivo
 * 
 * @param {String} fileServerRelativeUrl A URL relativa do arquivo no formato, Ex: "/site/subsite/listName/folder/file"
 */
function CheckoutFile(fileServerRelativeUrl)
{
    var retorno = null;

    var fileEndpoint = Endpoints.fileEndPoints;
    var url = formatUrlEndPoint(fileEndpoint.fileByRelativePath.url+fileEndpoint.fileByRelativePath.parameters.checkout, [fileServerRelativeUrl]);

    createAjaxCall(url, "POST", createSimpleHeaderData(ObtemTokenDeSeguranca(), false), null)
    .done(
        function(data)
        {
            retorno = data;
        }
    )
    .fail(
        function(error)
        { 
            console.log(JSON.stringify(error)); 
        }
    );

    return(retorno);
}


/**
 * Método que faz um check-in em um arquivo
 * 
 * @param {String} fileServerRelativeUrl A URL relativa do arquivo que se deseja fazer Check-in, Ex: "/site/subsite/listName/folder/file"
 * @param {String} comments O comentário a ser adicionado no check-in
 * 
 * @see Obs A requisição deve ocorrer dentro da página devido ao auto-refresh
 */
function CheckinFile(fileServerRelativeUrl, comments)
{
    var fileEndpoint = Endpoints.fileEndPoints;
    var url = formatUrlEndPoint(fileEndpoint.fileByRelativePath.url+fileEndpoint.fileByRelativePath.parameters.checkin, [fileServerRelativeUrl, comments]);

    var retorno = null;
    
    $.ajax({

        url: url,
        method: "POST", 
        async: false,
        cache: false,                                           
        headers: createSimpleHeaderData(ObtemTokenDeSeguranca(), false),                                                                                                                            
        success: function (data) 
        {                                           
            retorno = data;                                   
        },
        error: function (data) 
        {
            console.log(JSON.stringify(data));
            console.log(data.responseText);
        }
    });
}

/**
 * Método que retira o checkout de um arquivo
 * 
 * @param {String} fileServerRelativeUrl A URL relativa do arquivo que se deseja desfazer o Check-out, Ex: "/site/subsite/listName/folder/file"
 */
function UndoCheckoutFile(fileServerRelativeUrl)
{
    var retorno = null;

    var fileEndpoint = Endpoints.fileEndPoints;
    var url = formatUrlEndPoint(fileEndpoint.fileByRelativePath.url+fileEndpoint.fileByRelativePath.parameters.undoCheckout, [fileServerRelativeUrl]);

    createAjaxCall(url, "POST", createSimpleHeaderData(ObtemTokenDeSeguranca(), false), null)
    .done(
        function(data)
        {
            retorno = data;
        }
    )
    .fail(
        function(error)
        { 
            console.log(JSON.stringify(error)); 
        }
    );

    return(retorno);
}

/**
 * Método que cria uma coluna em uma lista
 * 
 * @param {String} listName O nome da lista
 * @param {String} title O nome da coluna
 * @param {String} staticName O nome estático da coluna
 * @param {String} internalName O nome interno da coluna
 * @param {Integer} type O tipo da coluna
 * @param {Boolean} required Se True, O campo é obrigatório
 * @param {Boolean} EnforceUniqueValues Se True, O campo só aceita valores únicos
 */
function createListColumn(listName, title, staticName, internalName, type, required, EnforceUniqueValues)
{
    var listas = getAllListInSiteContent().d.results;
    var retorno;

    var itemProperties = 
    {
        'StaticName': staticName,
        'Title': internalName, 
        'FieldTypeKind': type, 
        'Required': required, 
        'EnforceUniqueValues': EnforceUniqueValues
    };

    itemProperties["__metadata"] = { "type": "SP.Field" };

    for(var i = 0; i < listas.length; i++)
    {
        if(listas[i].Title == listName)
        {
            getAjaxCallWithData("POST", listas[i].Fields.__deferred.uri, false, false,  createSimpleHeaderData(ObtemTokenDeSeguranca(), true), JSON.stringify(itemProperties))
            .success(function (resulta)
            {
                itemProperties = null;
                itemProperties = { 'Title': title };
                itemProperties["__metadata"] = { "type": "SP.Field" };
                
                getAjaxCallWithData("POST", resulta.d.__metadata.uri, false, false,  createMergeHeaderData(ObtemTokenDeSeguranca()), JSON.stringify(itemProperties))
                .success(function (result)
                {
                    retorno = result;
                })
                .error(function (error)
                {
                    console.log(JSON.stringify(error));
                });
            })
            .error(function (error)
            {
                console.log(JSON.stringify(error));
            });

            break;
        }
    }

    return(retorno);
}

/**
 * Método que retorna todas as listas atualmente cadastradas no site
 */
function getAllListInSiteContent()
{
    var retorno = null;
    
    createAjaxCall(formatUrlEndPoint(Endpoints.listEndpoints.allList.url, []), "GET", createDefaultHeaderData(), null)
    .done(
        function(data)
        {
            retorno = data;
        }
    )
    .fail(
        function(error)
        { 
            console.log(JSON.stringify(error)); 
        }
    );

    return(retorno);
}

/**
 * Método que retorna as propriedades de uma lista
 * 
 * @param {String} listName O nome da lista
 */
function getSingleListProperties(listName)
{
    var retorno = null;
    createAjaxCall(formatUrlEndPoint(Endpoints.listEndpoints.listByTitle.url, [listName]), "GET", createDefaultHeaderData(), null)
    .done(
        function(data)
        {
            retorno = data.d;
        }
    )
    .fail(
        function(error)
        {
            console.log(JSON.stringify(error));
        }
    );

    return(retorno);
}

/**
 * Método que retorna as informações do usuário logado
 */
function getCurrentUser()
{
    var retorno = [];
    
    $.ajax({
        url: formatUrlEndPoint(Endpoints.securityEndpoints.siteUsers.currentUser.url, []),
        async: false,
        cache: false,
        success: function (result) 
        {
            retorno = xmlToJson(result);
        }
    });

    return(retorno);
}

/**
 * Método que faz o upload de um documento para uma pasta
 * 
 * @param {*} file O element.files[x] do arquivo que se deseja enviar
 * @param {String} fileName O nome do arquivo, caso o arquivo for ser enviado a uma pasta dentro da lista
 * @param {String} toRelativeFolder A pasta dentro lista para a qual o arquivo será enviado, a pasta deve ser relativa a propriedade EntityTypeName e não ao nome da lista
 * @param {String} listName O nome da lista ao qual o arquivo ou pasta é relativo
 * @param {Boolean} overwrite Se True, O arquivo será substituido caso ele exista na pasta
 * @param {Function} callbacksucess A função a ser chamada caso o upload ocorra com sucesso
 * @param {Function} callbackerror A função a ser chamada caso aconteça algum erro no upload
 */
function uploadDocument(file, listName, fileName, toRelativeFolder, overwrite, callbacksucess, callbackerror)
{
    var retorno = false;
    if (!window.FileReader) 
    {
        console.log("Esse navegador não suporta HTML5");
        return (retorno);
    }

    var reader = new FileReader();
    var listEndpoint = Endpoints.listEndpoints;
    
    reader.onload = function (e) 
    {
        var retorno = uploadFileByBuffer(e.target.result, fileName);
    }

    reader.onerror = callbackerror;
    reader.onloadend = callbacksucess;
    reader.readAsArrayBuffer(file);

    function uploadFileByBuffer(buffer, fileName) 
    {
        var retorno = false;
        var upload = uploadDocumentFunction(buffer, listName, fileName, toRelativeFolder, overwrite);

        upload.done(function (data, textStatus, jqXHR) 
        {
            var fileProperties = filePropertiesFunction(data.d);
            fileProperties.done(function (data, textStatus, jqXHR) 
            {
                retorno = true;
            });

            fileProperties.fail(function (jqXHR, textStatus, errorThrown) 
            {
                retorno = false;
                logFailException(jqXHR, textStatus, errorThrown);
            });
            
            retorno = true;
        });

        upload.fail(function (jqXHR, textStatus, errorThrown) 
        {
            logFailException(jqXHR, textStatus, errorThrown);
            
            retorno = false;
            return(false);
        });
    
        return(retorno);
    }

    function uploadDocumentFunction(buffer, listName, fileName, toRelativeFolder, overwrite) 
    {
        var relativePath = fileName;

        if(toRelativeFolder != null)
        {
            if(toRelativeFolder.length > 0)
            {
                relativePath = toRelativeFolder+fileName;
            }
        }

        var call = jQuery.ajax(
            {
                url: formatUrlEndPoint(listEndpoint.listByTitle.url+listEndpoint.listByTitle.parameters.addFileInList, [listName, relativePath, overwrite]),
                type: "POST",
                async: false,
                data: buffer,
                processData: false,
                headers: createDefaultHeaderData(ObtemTokenDeSeguranca())
            }
        );

        return (call);
    }

    function filePropertiesFunction(file) 
    {
        var call = jQuery.ajax(
            {
                url: file.ListItemAllFields.__deferred.uri,
                type: "GET",
                async: false,
                dataType: "json",
                headers: 
                {
                    Accept: "application/json;odata=verbose"
                }
            }
        );

        return (call);
    }

    function logFailException(jqXHR, textStatus, errorThrown) 
    {
        var response = JSON.parse(jqXHR.responseText);
        var message = response ? response.error.message.value : textStatus;
        console.log(message);
    }
}

/**
 * Método que retorna as propriedades de uma pasta
 * 
 * @param {String} folderName O nome da pasta dentro da lista
 */
function getFolderProperties(folderName)
{
    var retorno = null;
    
    createAjaxCall(formatUrlEndPoint(Endpoints.foldeEndpoints.folderByRelativeUrl.url, [folderName]), "GET", createDefaultHeaderData(), null)
    .done(
        function(data)
        {
            retorno = data.d;
        }
    )
    .fail(
        function(error)
        { 
            console.log(JSON.stringify(error)); 
        }
    );

    return(retorno);
}

/**
 * Método que retorna o tipo de uma lista
 * 
 * @param {String} listname 
 */
function GetListItemEntityType(listname)
{
    var retorno = null;

    var listEndpoint = Endpoints.listEndpoints;
    var url = formatUrlEndPoint(listEndpoint.listByTitle.url+"?"+listEndpoint.listByTitle.parameters.listEntityType, [listname]);
    var func = $.ajax({ type: "GET", url: url, cache: false,async: false });

    func.done(function( data ) 
    {
        var json = xmlToJson(data);
        retorno = getElementValue(json, "d:ListItemEntityTypeFullName")["#text"];
    });

    return(retorno);
}

/**
 * Método que envia um e-mail a um usuário usando o mecanismo do Sharepoint
 * 
 * @param {String} from O Remetente do e-mail
 * @param {String} to O destinatário do e-mail
 * @param {String} body O corpo do e-mail
 * @param {String} subject O assunto do e-mail
 */
function sendEmailTo(from, to, body, subject) 
{
    var retorno = null;

    var data = {

	       'properties': {
	           '__metadata': { 'type': 'SP.Utilities.EmailProperties' },
	           'From': from,
	           'To': { 'results': [to] },
	           'Body': body,
	           'Subject': subject
	       }
    }

    var header = createSimpleHeaderData(ObtemTokenDeSeguranca(), true);
    var url = formatUrlEndPoint(Endpoints.generalEndpoints.sendMail.url, []);
    
    getAjaxCallWithData("POST", url, false, true, header, JSON.stringify(data))
    .success(function(data)
    {
        retorno = data.d; 
    })
    .error(function (error)
    {
        console.log(JSON.stringify(error));
    });

    return(retorno);
}

/**
 * Método que retorna o nome interno de um campo em uma lista Sharepoint
 * 
 * @param {String} listname O nome da lista
 * @param {Array} fieldsNames Os nomes dos campos que se deseja saber o nome interno em formato array [Name1, Name2, ...]
 */
function GetInternalListFieldsNames(listname, fieldsNames)
{
    var retorno = [];
    retorno.length = fieldsNames.length;
    
    var listEndpoint = Endpoints.listEndpoints;
    var url = formatUrlEndPoint(listEndpoint.listByTitle.url+listEndpoint.listByTitle.parameters.allFields, [listname]);
    var func = $.ajax({ type: "GET", url: url, cache: false,async: false });

    func.done(function( data ) 
    {
        var json = xmlToJson(data);
        var fieldName = "";
        json = json["feed"]["entry"];
        
        for(var i = 0; i < json.length; i++)
        {
            fieldName = json[i]["content"]["m:properties"]["d:Title"]["#text"];
            
            for(var k = 0; k < fieldsNames.length; k++)
            {
                if(fieldName == fieldsNames[k])
                {
                    retorno[k] = json[i]["content"]["m:properties"]["d:EntityPropertyName"]["#text"];
                    break;
                }
            }
        }
    });

    return(retorno);
}

/**
 * Método que solicita um token de segurança ao Sharepoint
 * 
 * @param {String} urlSite A URL do site, caso não seja passada, será recupera a URL usando as variáveis do Sharepoint
 */
function ObtemTokenDeSeguranca(urlSite) 
{
    var token;

    $.ajax({
        url: getSiteUrl(urlSite) + "/_api/contextinfo", 
        type: "POST", 
        cache: false, 
        async: false,
        headers:
        {
            "Accept": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose"
        },
        success: function (response) { token = response.d.GetContextWebInformation.FormDigestValue; }
    });

    return (token);
}
