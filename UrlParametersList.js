window.Endpoints = Object.freeze({
    
    listEndpoints:{
        allList:{
            url:"{0}/_api/Web/Lists"
        },
        listByTitle:{
            url:"{0}/_api/Web/Lists/GetByTitle('{1}')", 
            parameters:{ 
                listEntityType:"$select=ListItemEntityTypeFullName",
                addFileOnFolder: "/RootFolder/Files/Add(url='{2}', overwrite={3})",
                allItens: "/Items",
                itemById: "/Items({2})",
                allFields: "/Fields",
                returnTop: "$skip={0}&$top={1}",
                addFileInList:"/RootFolder/Files/Add(url='{2}', overwrite={3})"
            }
        }
    },

    foldeEndpoints:{
        folderByRelativeUrl:{
            url:"{0}/_api/web/GetFolderByServerRelativeUrl('{1}')",
            parameters:{
                files:"/Files",
                folders:"/Folders"
            }
        }
    },

    fileEndPoints:{
        fileByRelativePath:{
            url:"{0}/_api/web/GetFileByServerRelativeUrl('{1}')",
            parameters:{
                downloadFileBinary: "/$value",
                checkout: "/CheckOut()",
                checkin:"/CheckIn(comment='{2}',checkintype=0)",
                undoCheckout:"/UndoCheckout()"
            }
        }
    },

    securityEndpoints:{
        siteGroups:{
            url:"{0}/_api/web/sitegroups",
            parameters:{
                groupByName:"$filter=startswith(Title,'{0}') eq true"
            }
        },
        siteUsers:{
            allUsers:{
                url: "{0}/_api/web/siteusers"
            },
            currentUser: {
                url: "{0}/_api/Web/CurrentUser"
            }
        }
    },

    generalEndpoints:{
        sendMail:{
            url:"{0}/_api/SP.Utilities.Utility.SendEmail"
        },
        
        fullText:{
            url:"{0}/_api/search/query?querytext='{1}'",
            parameters:{
                startRow:"startrow={0}",
                refineFilter:"refinementfilters='{1}",
                refineFilterByFileType: "refinementfilters='FileType:equals({2})",
                sortList:"sortlist={3}",
                sortListByPopularity:"sortlist='viewslifetime:ascending'",
                rowLimit:"rowlimit={4}",
                trimduplicate:"trimduplicates={5}"
            }
        },

        downloadFileByDelegation:{
            url:"{0}/_layouts/download.aspx?SourceUrl={1}",
            parameters:{

            }
        }
    }
});
