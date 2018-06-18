
/**
 * Função que espera até um elemento aparecer na tela
 * 
 * @param {String} selector O jQuery selector do elemento
 * @param {Function} callback A function a ser chamada quando o elemento aparecer; Exemplo: waitForElement($("#Whatevs"), function() { alert('element is present') }, 1, 10);
 * @param {Integer} startCount O tempo inicial que se deve esperar, Ex: 1 = (100ms x 1)
 * @param {Integer} endCount O tempo final que se deve esperar, Ex: 10 = (100ms x 10)
 */
var waitForElement = function (selector, callback, startCount, endCount) 
{
    if (jQuery(selector).length) 
    {
        callback();
    } 
    else 
    {
        setTimeout(function () {
            if (!startCount) 
            {
                startCount = 0;
            }
            startCount++;
            if (startCount < endCount) 
            {
                waitForElement(selector, callback, startCount, endCount);
            } 
            else 
            { 
                return; 
            }
        }, 100);
    }
};

/**
 * Função que espera até um elemento aparecer na tela
 * 
 * @param {String} selector O jQuery selector do elemento
 * @param {Function} callback A function a ser chamada quando o elemento aparecer; Exemplo: waitForElementByAnimation($("#Whatevs"), function() { alert('element is present') }, 1, 10);
 * @param {Integer} startCount O tempo inicial que se deve esperar, Ex: 1 = (100ms x 1)
 * @param {Integer} endCount O tempo final que se deve esperar, Ex: 10 = (100ms x 10)
 */
var waitForElementByAnimation = function (selector, callback, startCount, endCount) 
{
    if (!jQuery(selector).size()) 
    {
        setTimeout(function () 
        {
            if (!startCount) 
            {
                startCount = 0;
            }
            startCount++;
            if (startCount < endCount) 
            {
                window.requestAnimationFrame(function () { waitForElementByAnimation(selector, callback, startCount, endCount) });
            } 
            else 
            { 
                return; 
            }
        }, 100);
    } 
    else 
    {
        callback();
    }
};

/**
 * Função que previne que caracteres diferente de letras sejam digitados em um campo texto,
 * Exemplo de uso: onkeypress="return isNumberKey(event)"
 * 
 * @param {Event} evt O evento do teclado
 */
function isNumberKey(evt)
{
    var charCode = (evt.which) ? evt.which : event.keyCode
    return (!(charCode > 31 && (charCode < 48 || charCode > 57)));
}

/**
 * Método que transforma um XML em JSON
 * 
 * @param {XML} xml 
 */
function xmlToJson(xml) 
{
    //https://www.w3schools.com/xml/dom_nodetype.asp
    var retorno = {};
    var VALUE_ATTRIBUTE_NODE = 1;
    var VALUE_TEXT_NODE = 3;

    if (xml.nodeType == VALUE_ATTRIBUTE_NODE) 
    { 
		if (xml.attributes.length > 0) 
        {
            retorno["attributes"] = {};

            for (var j = 0; j < xml.attributes.length; j++) 
            {
				var attribute = xml.attributes.item(j);
				retorno["attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
    } 
    else if (xml.nodeType == VALUE_TEXT_NODE) 
    {   
		retorno = xml.nodeValue;
	}

	if (xml.hasChildNodes()) 
    {
        for(var i = 0; i < xml.childNodes.length; i++) 
        {
			var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            
            if (typeof(retorno[nodeName]) == "undefined") 
            {
				retorno[nodeName] = xmlToJson(item);
            } 
            else 
            {
                if (typeof(retorno[nodeName].push) == "undefined") 
                {
					var old = retorno[nodeName];
					retorno[nodeName] = [];
					retorno[nodeName].push(old);
				}
                
                retorno[nodeName].push(xmlToJson(item));
			}
		}
    }
    
	return (retorno);
};

/**
 * Método que adiciona zeros a esquerda de um número
 * 
 * @param {Integer} number O número que se deseja adicionar zeros a esquerda
 * @param {Integer} size O tamanho que a String deve ter, por exemplo, addZeroToLeft(50, 3) deve sair 050
 */
function addZeroToLeft(number, size) 
{
    return (new Array(size + 1).join('0') + number).slice(-size);
}

/**
 * Função para uso em index.sort(a,b)
 * 
 * @param {Number} a A primeira posição do swap
 * @param {Number} b A segunda posição do swap
 */
function ascendingSorting(a, b) 
{ 
    return (a - b) 
}

/**
 * Função para uso em index.sort(a,b)
 * 
 * @param {Number} a A primeira posição do swap
 * @param {Number} b A segunda posição do swap
 */
function descendingSorting(a, b)
{
    return b - a
}

/**
 * Método que executa um replace de todos os caracteres de uma String por outro
 * 
 * @param {String} str A String a ser alterada
 * @param {String} a A palavra procurar
 * @param {String} b A palavra a ser trocada
 */
function replaceAll(str, a, b)
{
    return(str.replace(new RegExp(a, 'g'), b));
}

/**
 * Função que escreve um conteúdo de um iframe
 * 
 * @param {String} iframeID O ID do Iframe na tela
 * @param {String} iframeContent O conteúdo a ser escrito no Iframe
 */
function writeIFrameContent(iframeID, iframeContent)
{
    var doc = document.getElementById(iframeID).contentWindow.document;
    doc.open();
    doc.write(iframeContent);
    doc.close();
}

/**
 * Método que filtra uma tabela baseada em seu conteúdo
 * 
 * @param {String} idTable O ID da tabela que se deseja filtrar
 * @param {String} filter O filtro que se deseja aplicar
 * @param {Integer} columnIndex O index da coluna que deve ser pesquisada
 * @param {Boolean} ignoreCase Se True, Os valores serão convertidos para LowerCase antes de serem avaliados
 */
function filterTable(idTable, filter, columnIndex, ignoreCase) 
{
    var table, tr, td, i;
    table = document.getElementById(idTable);
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) 
    {
        td = tr[i].getElementsByTagName("td")[columnIndex];
        if (td) 
        {
            if(ignoreCase)
            {
                if (td.innerHTML.toLowerCase().indexOf(filter.toLowerCase()) > -1) 
                {
                    tr[i].style.display = "";
                } 
                else 
                {
                    tr[i].style.display = "none";
                }
            }
            else
            {
                if (td.innerHTML.indexOf(filter) > -1) 
                {
                    tr[i].style.display = "";
                } 
                else 
                {
                    tr[i].style.display = "none";
                }
            }
        }
    }
}

/**
 * Função que troca os caracteres especiais de uma string pelos caracteres normais
 * 
 * @param {String} str A String que se deseja alterar os caracteres
 * @see http://seamons.com/projects/js/ascii_table.html
 */
function clearString(str)
{
    if(typeof str == 'undefined')
    {
        return str;
    }

    var fromstr = [142,158,159,199,208,209,215,216,221,231,241,248,253];
    var tostr = [90,122,89,67,68,78,88,79,89,99,110,111,121];

    for(var i = 192; i < 199; i++)
    {
        str =  str.replace(new RegExp(String.fromCharCode(i), 'g'), String.fromCharCode(41));
    }
    
    for(var i = 200; i < 204; i++)
    {
        str =  str.replace(new RegExp(String.fromCharCode(i), 'g'), String.fromCharCode(69));
    }
    
    for(var i = 204; i < 208; i++)
    {
        str =  str.replace(new RegExp(String.fromCharCode(i), 'g'), String.fromCharCode(73));
    }
    
    for(var i = 210; i < 215; i++)
    {
        str =  str.replace(new RegExp(String.fromCharCode(i), 'g'), String.fromCharCode(79));
    }
    
    for(var i = 217; i < 221; i++)
    {
        str =  str.replace(new RegExp(String.fromCharCode(i), 'g'), String.fromCharCode(85));
    }
    
    for(var i = 224; i < 231; i++)
    {
        str =  str.replace(new RegExp(String.fromCharCode(i), 'g'), String.fromCharCode(97));
    }
    
    for(var i = 232; i < 236; i++)
    {
        str =  str.replace(new RegExp(String.fromCharCode(i), 'g'), String.fromCharCode(101));
    }
    
    for(var i = 236; i < 240; i++)
    {
        str =  str.replace(new RegExp(String.fromCharCode(i), 'g'), String.fromCharCode(105));
    }
    
    for(var i = 242; i < 247; i++)
    {
        str =  str.replace(new RegExp(String.fromCharCode(i), 'g'), String.fromCharCode(111));
    }
    
    for(var i = 249; i < 253; i++)
    {
        str =  str.replace(new RegExp(String.fromCharCode(i), 'g'), String.fromCharCode(117));
    }
    
    for (var i = 0, l = tostr.length ; i < l ; i++) {
	    str = str.replace(new RegExp(String.fromCharCode(fromstr[i]), 'g'), String.fromCharCode(tostr[i]));
	}
    
    return(str);
}

/**
 * Método que força uma função executar de forma "assíncrona" através do uso da função setTimeout
 * 
 * @param {Function} func A função a ser executada de modo assíncrono: Ex function() { OtherInnerFunction() }
 * @param {Function} callback A função de Callback ou Null
 * @param {Integer} timeout O timeout a ser executado
 */
function execAsyncWithTimeout(func, callback, timeout) {
    setTimeout(function() {
        func();
        if (callback) 
        {
            callback();
        }
    }, timeout);
}
