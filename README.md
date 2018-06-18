# SharepointIntegrationUtils
Projeto de bibliotecas Javascript utilitárias para integração com os end-points Rest do Sharepoint

# CSOM
Os arquivos tem como objetivo a manipulação do Sharepoint através da camada REST confiando no mecanismo de segurança da mesma, o uso da camada CSOM é feita somente no arquivo "SharepointServerFunctions.js", dessa forma, todas as funções que necessitem ser escritas em CSOM ou que não tenham equivalentes REST, serão colocadas nele, confiando assim no mecanismo de segurança cliente/servidor do Sharepoint para tais funcionalidades
