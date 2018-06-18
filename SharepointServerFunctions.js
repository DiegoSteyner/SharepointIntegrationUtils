
/**
 * Método que altera o valor de um campo de taxonomia de um item
 * 
 * @param {String} listName O nome da lista onde o item está
 * @param {String} fieldDisplayName O display name do campo na lista
 * @param {String} fieldInternalName O internal name do campo na lista
 * @param {String} itemID O ID do item que se deseja alterar o valor
 * @param {String} palavrasChaveValue O valor a ser colocado
 * @param {Function} callbackSucess A função a ser chamada em caso de sucesso
 */
function setPalavrasChaves(listName, fieldDisplayName, fieldInternalName, itemID, palavrasChaveValue, callbackSucess)
{
    var context = SP.ClientContext.get_current();
    var list = context.get_web().get_lists().getByTitle(listName);
    var item = list.getItemById(itemID);
    var field = list.get_fields().getByInternalNameOrTitle(fieldDisplayName);
    var taxField = context.castTo(field, SP.Taxonomy.TaxonomyField);
    var terms = new SP.Taxonomy.TaxonomyFieldValueCollection(context,palavrasChaveValue,taxField);

    item.set_item(fieldInternalName, palavrasChaveValue);
    item.update();
    context.load(terms);
    context.executeQueryAsync( callbackSucess, function (sender,args) {
        console.log(args.get_message() + '\n' + args.get_stackTrace());
    });
}

/**
 * Método que cria um novo contexto para o site
 * 
 * @param {String} siteUrl A URL do site
 */
function getNewContextForSite(siteUrl)
{
    return(new SP.ClientContext(siteUrl));
}
