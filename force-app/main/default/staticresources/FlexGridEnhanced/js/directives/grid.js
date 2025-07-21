flexGrid.directive('grid',['$compile','$sce',function($compile,$sce){
    var template =  
                    '<div class="row">'+
                        '<div class="col-md-12 alertMessages">'+
                            '<message messages="tableCommunicator.messages"/>'+
                        '</div>'+
                    '</div>'+


                    '<div  id="{{flexTableConfig.Name}}modalDiv" class="modal fade in bgColor-black" role="dialog" data-backdrop="static" tabindex="0" onkeyup="setFocusOnCloseModal()">'+
                        '<div class="modal-dialog" ng-style="{\'width\': windowWidth}">'+
                            //<!-- Modal content --> 
                            '<div class="modal-content">'+
                                '<div class="modal-header modal-header-ext">'+
                                    '<button type="button" id="{{flexTableConfig.Name}}modalDivCloseIcon" ng-click="tableCommunicator.checkModalRefreshBehaviour()" class="close close-ext" data-dismiss="modal" tabindex="0" aria-label="Close" >&times; <span class="hidden508">Close</span><span class="hidden-offscreen">{{windowTitle}}</span></button>'+
                                    '<p class="modal-title">{{windowTitle}}</p>'+
                                '</div>'+
                                '<div class="modal-body">'+
                                    '<div class="modalLoadIcon"><div id="holdon-content"><img id="govGrantsPleaseWaitHolderId"  src="{{communicator.govGrantPleaseWaitIconURL}}"  alt="GovGrants Logo" /></div></div>'+
                                    '<iframe id="{{flexTableConfig.Name}}iframeContentId" class="modal-iframe"   frameborder="0"  marginheight="0" marginwidth="0" onload="completedModalLoad(this.id)"/>'+  
                                '</div>'+                      
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    //<!-- SheetJS Upload/Download Modal Template -->
                    '<div  id="sheetJS{{flexTableConfig.Name}}" class="modal fade" role="dialog" data-backdrop="static" tabindex="0">'+
                        '<div  class="modal-dialog ">'+
                            //<!-- Modal content -->
                            '<div  class="modal-content">'+
                                '<div class="modal-header modal-header-ext">'+
                                    '<button type="button" id="sheetJSmodalDivCloseIcon" class="close close-ext" data-dismiss="modal" tabindex="0" aria-label="Close {!$Label.AttachmentAdd}window">&times;<span class="hidden508">Close</span></button>'+
                                    '<p class="modal-title">Download & Upload Wizard</p>'+
                                '</div>'+
                                '<div class="modal-body">'+
                                    '<iframe  class="modal-iframe" id="iframeSheetJS{{flexTableConfig.Name}}" src="" frameborder="0" height="100%" width="100%" marginheight="0" marginwidth="0" style="overflow-y: auto;overflow-x: scroll;" scrolling="auto"/>'+  
                                '</div>'+
                                '<div class="modal-footer">'+
                                    '<button type="button" ng-click="tableCommunicator.refreshGrid()" class="pull-right customBtn" data-dismiss="modal">Close</button>'+
                                '</div>'+                                                
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    
                    '<div class="panel">'+
                        '<div class="panel-heading" ng-if ="flexTableConfig.ShowHeaderPanel || communicator.flexGridMetaData.parentFlexTableId == flexTableConfig.FlexTableId || communicator.GridType == \'FlexTable\'">'+ 
                            '<div class="row">'+
                                '<div class="col-md-12">'+
                                    '<panel table-meta-data="tableMetaData" table-communicator="tableCommunicator" communicator="communicator" />'+ //panel-heading marginBottom20 displayFlexCenter
                                '</div>'+
                            '</div>'+
                        '</div>'+

                        '<div id="{{flexTableConfig.Name}}FlexToggle" class="panel-body" ng-class="(isSearchTable ? ( totalRecords < 1 ? \'collapse\': \'collapse in\') : \'collapse in\')">'+
                            '<div class="row" ng-if="flexTableConfig.SubHeader != undefined">'+
                                '<div class="col-md-12 col-sm-12 col-xs-12">'+
                                    '<span ng-bind-html="trustSrcHTML(flexTableConfig.SubHeader)"></span>' +
                                '</div>'+
                            '</div>'+
                            '<div class="row quickrow" ng-if="flexTableConfig.EnableQuickSearch || flexTableConfig.EnableFilter">'+
                                '<div class="" ng-if="isParentTargetLookupField || communicator.flexGridMetaData.parentFlexTableId == flexTableConfig.FlexTableId || communicator.GridType == \'FlexTable\'">'+                        
                                    '<div class="col-md-3 col-sm-6 col-xs-6 quickSearchBoxWrap">'+
                                        '<div class="input-group customInputGroup" ng-if="flexTableConfig.EnableQuickSearch" ng-class="{disabledOpacity:communicator[tableCommunicator.tableId].isEdit == true ||  communicator[tableCommunicator.tableId].isMassEdit == true}">'+
                                          '<input type="search" class="form-control" tabindex="0" id="{{flexTableConfig.Name}}_quickserchtext" ng-enter="search(quickSearchTerm);"  placeholder="Search..." ng-model="quickSearchTerm">'+
                                          '<span class="input-group-btn">'+
                                            '<button class="btn btn-default" tabindex="0" type="button" ng-click="search(quickSearchTerm)"><i class="fa fa-search" aria-label="Search"></i></button>'+
                                          '</span>'+
                                        '</div>'+
                                    '</div>'+
                                /*    '<div class="col-xs-1 searchHelpIcon" >'+
                                        '<helpicon help-text="quickSearchHelpText" help-text-id="quickSearchHelpTextId" ng-if="flexTableConfig.EnableQuickSearch"/>'+
                                    '</div>'+*/
                                    '<div class="col-md-8 col-sm-5 col-xs-3 pull-right">'+
                                        '<button type="button" ng-if="flexTableConfig.EnableFilter" ng-class="{disabledOpacity: communicator[tableCommunicator.tableId].isEdit == true ||  communicator[tableCommunicator.tableId].isMassEdit == true}" class="btn btn-info pull-right advf-button" tabindex="0" data-toggle="collapse" data-target="#advf{{flexTableConfig.Name}}">'+
                                            '<span class="fa fa-filter"></span>'+
                                            '<span class="hidden508">Advance Filter</span>'+
                                        '</button>'+
                                        '<span class="pull-right advfilter" ng-if="isAdvFilterExcluded" >'+
                                            'Advanced filter will not be applicable for <strong>Reference, Date, Date-time and Multi-pickList</strong> fields'+
                                        '</span>'+
                                    '</div>'+                        
                                '</div>'+
                            '</div>'+
                            '<div class="row" ng-if="flexTableConfig.EnableFilter">'+
                                '<div class="col-md-12">'+
                                //<!--Advance Filter-->
                                    '<advancefilter table-meta-data="tableMetaData" table-communicator="tableCommunicator"/>'+
                                '</div>'+
                            '</div>'+
                            '<div class="row">'+
                                '<div class="col-md-12">'+
                                    '<div ng-if="showSortMessage == true" class="sortFieldMsg text-right" tabindex="0">'+
                                        '* Records are sorted by <strong>{{sortFieldLabel}}</strong>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                            //User Story 131880: Flexwind - For tables, that are typically long, provide pagination at both the top and bottom. At a minimum provide, “Showing 10 of 11” at the top - Part 2
                            //    margin: 5px 0px 0px 0px;
                            '<div class="row displayFlexCenter" >'+
                                '<div class=" col-md-6 col-sm-6 col-xs-6 mobshowEntries cmobileEntries notranslate">'+
                                    '<span ng-if="flexTableConfig.EnableTotalRecordsCount && totalRecords.length !== 0 && totalRecords != null" class="showEntries displayFlex" ng-class="{disabledOpacity: communicator[tableCommunicator.tableId].isEdit == true}">'+
                                        '<span class="" tabindex="0">Showing {{totalRecords == 0 ? 0 :(pageSize.size * (pageNumber - 1) + 1)}} to {{pageSize.size * pageNumber > totalRecords ? totalRecords:pageSize.size * pageNumber}} of {{totalRecords}} records</span>'+                                       
                                    '</span>'+
                                '</div>'+
                                //<!--Total Records-->
                                //<!--'<div class="col-md-4 col-sm-12 col-xs-12 text-center totalRecords" >' +
                                        
                                //'</div>' + 
                                //<!--Pagination-->
                                '<div class="col-md-6 col-sm-6 col-xs-6 mobtable-pager notranslate" >'+
                                    '<span  class="pull-right table-pager spanTablePager" ng-if="!(totalRecords <= pageSize.size) && flexTableConfig.EnablePagination">'+//ng-if="totalRecords != null && totalRecords != 0"
                                        '<a tabIndex="0" href="javascript:void(0)"  ng-disabled="{{!hasPrevious}}" ng-class="{disabledCls:!hasPrevious}" title="First" ng-click="first();"><span class="fa fa-fast-backward" ></span><span class="hidden508">First</span></a>'+
                                        '<a tabIndex="0" href="javascript:void(0)"  ng-disabled="{{!hasPrevious}}" ng-class="{disabledCls:!hasPrevious}" title="Previous" ng-click="previous();"><span class="fa fa-backward" ></span><span class="hidden508">Previous</span></a>'+
                                        '<span class="separator">&nbsp;|&nbsp;</span>'+
                                        '<span class="bold">Page {{pageNumber}} of {{totalPages}}</span>' +
                                        '<span class="separator">&nbsp;|&nbsp;</span>'+
                                        '<a tabIndex="0" href="javascript:void(0)"  ng-disabled="{{!hasNext}}" ng-class="{disabledCls:!hasNext}"  title="Next"  ng-click="next();"><span class="fa fa-forward"></span><span class="hidden508">Next</span></a>'+
                                        '<a tabIndex="0" href="javascript:void(0)"  ng-disabled="{{!hasNext}}" ng-class="{disabledCls:!hasNext}" title="Last" ng-click="last();"><span class="fa fa-fast-forward" ></span><span class="hidden508">Last</span></a>'+
                                    '</span>'+
                                '</div>' +
                            '</div>'+
                                                   
                            '<div class="row" ng-if="isParentTargetLookupField || communicator.flexGridMetaData.parentFlexTableId == flexTableConfig.FlexTableId || communicator.GridType == \'FlexTable\'">'+
                                '<div class="col-md-12">'+
                                    '<div class="table-responsive tableGridWrap" ng-class="{\'fixedHeight\': tableCommunicator.recordsList.length > 9}"> '+  
                                    '<div class=""></div>'+                       
                                        '<table width="100%" cellpadding="0" cellspacing="0" border="0" id="{{flexTableConfig.Name}}resizable" class="table tableClass me-grid-section gridTable tableGrid">'+             
                                            '<thead id="myHeader"  class="thead-class-hidden" ng-class="{\'fixedHeader\':showFixedHeader}">'+
                                                '<tr>'+
                                                    //<!--th for expand collapase icon when child tables present-->
                                                        '<th ng-if="tableCommunicator.isEnableGroupedSubTotalRow != true && (child1MetaData != undefined || child2MetaData != undefined)" class="expColaIcon sticky-column" tabindex="0">'+
                                                    '</th>'+
                                                    //<!--Record Selection left side-->
                                                    '<th  id= "recordSelect"  class="sticky-column" ng-if="tableCommunicator.isEnableGroupedSubTotalRow != true && flexTableConfig.EnableRecordSelection == true && flexTableConfig.RecordSelectionColumnPosition != \'Right\'" >' +
                                                        '<div class="tableColumnHeader" tabindex="0">'+
                                                            '<input id="{{flexTableConfig.Name}}checkBox" type="checkbox" tabindex="0" ng-init="selectionAllChkBox=false" ng-checked="selectionAllChkBox = selectAll" ng-model="selectionAllChkBox" ng-click="selectAllRecords(!selectionAllChkBox)" ng-if="!singleRecordSelection" aria-label="Select All Check Box"><span class="hidden508">Select All</span><!-- 508 --></input>'+
                                                        '</div>'+
                                                    '</th>'+
                                                    //<!--Auto Index-->
                                                    '<th id="autoIndexCol" tabindex="0" ng-class="{\'sticky-column\': flexTableConfig.EnableAutoIndex == true}" ng-if="flexTableConfig.EnableAutoIndex == true">'+
                                                        '<span class="hidden508" ng-bind="autoIndexHeader"></span>'+
                                                        '<span ng-bind="autoIndexHeader"></span>'+
                                                    '</th>'+
                                                    //<!--Columns Header -->
                                                    '<th colHeader="angular" class="thDropMenuWrap" tabindex="0" ng-class="{\'sticky-column\': flexTableConfig.EnableAutoIndex && $index==0 || flexTableConfig.EnableRecordSelection && $index==0 || $index == 0}" ng-repeat="column in tableCommunicator.columnsList track by $index" ng-show="column != \'Id\' && (tableCommunicator.visibleColumns[column] == undefined ? true :tableCommunicator.visibleColumns[column])" column="column"'+ 
                                                                            'table-meta-data="tableMetaData" table-communicator="tableCommunicator"'+
                                                                            'sort-field="sortField" width="tableCommunicator.fieldWidthMap[column]"></th> '+                                            
                                                    //<!--Record Selection Right Side -->
                                                    '<th  ng-if="tableCommunicator.isEnableGroupedSubTotalRow != true && flexTableConfig.EnableRecordSelection == true && flexTableConfig.RecordSelectionColumnPosition == \'Right\'">' +
                                                        '<div class="tableColumnHeader"  tabindex="0">'+
                                                            '<input id="{{flexTableConfig.Name}}checkBox" type="checkbox" tabindex="0"  ng-init="selectionAllChkBox=false" ng-checked="selectionAllChkBox = selectAll" ng-model="selectionAllChkBox" ng-click="selectAllRecords(!selectionAllChkBox)" ng-if="!singleRecordSelection" aria-label="Select All Check Box"><span class="hidden508">Select All</span><!-- 508 --></input>'+
                                                        '</div>'+
                                                    '</th>'+
                                                    '<th tabindex="0" ng-if="(tableCommunicator.hideActionColumn != true || communicator[tableCommunicator.tableId].isEdit == true) && (tableCommunicator.isEnableGroupedSubTotalRow != true && ( flexTableActionMap[\'Row\'] != undefined || communicator[tableCommunicator.tableId].isEdit == true))">'+
                                                        'Actions'+
                                                    '</th>'+
                                                '</tr>'+       
                                            '</thead>'+
                                            //All Records Rendering
                                            '<tbody id="tableBody" ng-repeat="row in tableCommunicator.recordsList track by $index">'+
                                                '<tr class="groupedRow font-bold"  ng-repeat="groupingField in tableCommunicator.rowGroupingFieldList" ' +
                                                        'ng-if="tableCommunicator.isEnableGroupedSubTotalRow != true && ($parent.$index == 0 || (row.isSubTotal != true && row.isTotal != true && tableCommunicator.rowGroupMap[row.Id] != undefined && tableCommunicator.rowGroupMap[row.Id][groupingField] != undefined && tableCommunicator.rowGroupMap[row.Id][groupingField] == true))">'+
                                                         
                                                        '<td class="groupTitle" tabindex="0" colspan="{{colLength+1}}">'+
                                                            '<span ng-if="(row[groupingField] == undefined)" ng-bind="tableCommunicator.fieldLabelMap[groupingField] + \' : \'+ \'--\'"> </span>'+
                                                            
                                                            '<div class="clearfix" ng-if="(row[groupingField] != undefined && tableCommunicator.ReferenceDisplayFieldMap[row.Id][groupingField]==undefined)">'+
                                                            '<span class="pull-left" ng-bind="tableCommunicator.fieldLabelMap[groupingField] + \' :&nbsp;\'">'+' </span>'+
                                                            '<field class="pull-left" field-type="{{fieldMetaData[groupingField].Type}}" field-name="{{groupingField}}"  record="row" is-edit="false" field-info="fieldMetaData[groupingField]" table-meta-data="tableMetaData" table-communicator="tableCommunicator"></field>'+
                                                            '</div>'+
                                                            '<div class="clearfix" ng-if="(row[groupingField] != undefined && tableCommunicator.ReferenceDisplayFieldMap[row.Id][groupingField]!=undefined)">'+
                                                            '<span class="pull-left" ng-bind="tableCommunicator.fieldLabelMap[groupingField] + \' :&nbsp;\'">'+' </span>'+
                                                            '<field class="pull-left" field-type="{{fieldMetaData[groupingField].Type}}" field-name="{{groupingField}}"  record="row" is-edit="false" field-info="fieldMetaData[groupingField]" table-meta-data="tableMetaData" table-communicator="tableCommunicator"></field>'+
                                                            '</div>'+
                                                        '</td>'+
                                                    
                                                 

                                                '</tr>'+
                                                '<tr  >'+
                                                    //<!--Expand Collapase icon-->                                                     
                                                    '<td ng-if="tableCommunicator.isEnableGroupedSubTotalRow != true && (child1MetaData != undefined || child2MetaData != undefined)" class="expColaIcon sticky-column" tabindex="0">'+
                                                        '<a class="childAnchor" tabindex="0" ng-click="row.showChild = !row.showChild; maintainscope()" href="#!" ng-if="(!(row.isSubTotal == true || row.isTotal == true))"><i class="fa" ng-class="{\'fa-plus-square-o\':!row.showChild,\'fa-minus-square-o\':row.showChild}" ng-click="removeFixedHeader()" style="font-size:1.2em" ></i></a>'+
                                                    '</td>'+
                                                    //<!--Record Selection check box left side-->
                                                    '<td class="sticky-column" tabindex="0" ng-if="flexTableConfig.EnableRecordSelection == true && flexTableConfig.RecordSelectionColumnPosition != \'Right\'">'+
                                                        '<input type="checkbox" tabindex="0" ng-init="selectionChkBox=false" ng-checked="selectionChkBox = tableCommunicator.recordSelectionMap[row.Id]" '+
                                                        'ng-if="(!(row.isSubTotal == true || row.isTotal == true))" ng-model="selectionChkBox" ng-click="selectRecord(row.Id,!selectionChkBox)" '+
                                                        'aria-label="Select Record"><span class="hidden508">Select Record</span><!-- 508 --></input>'+
                                                    '</td> '+
                                                    //<!--Auto Indexing-->
                                                    '<td tabindex="0" ng-class="{\'sticky-column\':tableCommunicator.isEnableGroupedSubTotalRow != true && flexTableConfig.EnableAutoIndex == true}"' +
                                                    'ng-if="tableCommunicator.isEnableGroupedSubTotalRow != true && flexTableConfig.EnableAutoIndex == true">'+
                                                        '<span ng-if="flexTableConfig.AutoIndexBehaviour == \'AllRows\'" ng-bind="$index + offset + 1"></span>'+
                                                        '<span ng-if="flexTableConfig.AutoIndexBehaviour == \'ExcludeComputedRows\'" ng-bind="tableCommunicator.rowIndexMap[row.Id]"></span>'+
                                                    '</td> '+
                                                    '<td tabindex="0" ng-class="{\'sticky-column\':tableCommunicator.isEnableGroupedSubTotalRow == true && flexTableConfig.EnableAutoIndex == true}"'+ 
                                                    'ng-if="tableCommunicator.isEnableGroupedSubTotalRow == true && flexTableConfig.EnableAutoIndex == true">'+
                                                        '{{ $index +1 }}'+
                                                    '</td>'+
                                                    //<!--Records Values-->
                                                    '<td  tabindex="0" ng-show="tableCommunicator.visibleColumns[column] == undefined ? true :tableCommunicator.visibleColumns[column]" ng-repeat="column in tableCommunicator.columnsList track by $index" ng-if="column != \'Id\'" ' + 
                                                        'class="{{dataTableDetailMap[column].StyleClass}}" ng-class="{\'sticky-column\': flexTableConfig.EnableAutoIndex && $index==0 || flexTableConfig.EnableRecordSelection && $index==0 || $index == 0}" width="{{tableCommunicator.fieldWidthMap[column]}}"' +
                                                        ' ng-style="{ {{ ((fieldMetaData[column].Type == \'CURRENCY\' || fieldMetaData[column].Type == \'DOUBLE\') && row[column] < 0) ? dataTableDetailMap[column].StyleAttribute : \'\'}}  }" >'+
                                                        '<span ng-if="row.isSubTotal != true && row.isTotal != true">'+     
                                                            '<field field-type="{{fieldMetaData[column].Type}}" field-name="{{column}}"  record="row" ' +
                                                                'field-info="fieldMetaData[column]" table-meta-data="tableMetaData" table-communicator="tableCommunicator" change-handler="tableCommunicator.recordChangeHandler(record,fieldName,fieldValue)" '+
                                                                'is-edit="(communicator.editRowIdMap[row.Id] == undefined ? false : communicator.editRowIdMap[row.Id]) && !tableCommunicator.readOnlyTableCellMap[row.Id][column] && tableCommunicator.readOnlyTableColumnMap[column]" > </field>'+
                                                        '</span>'+
                                                        '<span class="font-bold" ng-if="(row.isSubTotal == true || row.isTotal == true)">'+ 
                                                            '<span  ng-if="fieldValue = (fieldValue == undefined ? 0 : fieldValue)" />'+ 
                                                            '<field field-type="{{fieldMetaData[column].Type}}" field-name="{{column}}"  record="row" is-edit="false" field-info="fieldMetaData[column]" table-meta-data="tableMetaData" table-communicator="tableCommunicator" change-handler="tableCommunicator.recordChangeHandler(record,fieldName,fieldValue)"> </field>'+
                                                        '</span>'+
                                                    '</td>'+
                                                    //<!--Record Selection check box right side-->
                                                    '<td tabindex="0" ng-if="tableCommunicator.isEnableGroupedSubTotalRow != true && flexTableConfig.EnableRecordSelection == true && flexTableConfig.RecordSelectionColumnPosition == \'Right\'">'+
                                                        '<input type="checkbox" tabindex="0" ng-init="selectionChkBox=false" ng-checked="selectionChkBox = tableCommunicator.recordSelectionMap[row.Id]" '+
                                                        'ng-if="(!(row.isSubTotal == true || row.isTotal == true  || row.isGroupedSubTotal == true))" ng-model="selectionChkBox" ng-click="selectRecord(row.Id,!selectionChkBox)" '+
                                                        'aria-label="Select Record"><span class="hidden508">Select Record</span><!-- 508 --></input>'+
                                                    '</td> '+
                                                    '<td tabindex="0" ng-if="(tableCommunicator.hideActionColumn != true || communicator[tableCommunicator.tableId].isEdit == true) && (tableCommunicator.isEnableGroupedSubTotalRow != true && ( flexTableActionMap[\'Row\'] != undefined || communicator[tableCommunicator.tableId].isEdit == true))">'+                                                    
                                                        '<div class="actionColIconWrap">'+    
                                                            '<a tabIndex="0" ng-if="tableCommunicator.ApprovalLockedRecordsMap[row.Id] && (!(row.isSubTotal == true || row.isTotal == true  || row.isGroupedSubTotal == true))" class="tableLinks cursorpointer" title="Locked" >'+                                                                            
                                                                '<i class="fa fa-lock" aria-hidden="true"></i>'+
                                                                    '<span class="hidden508">Locked</span>'+
                                                                '</i>'+
                                                            '</a>'+
                                                            '<span ng-if="(communicator.editRowIdMap[row.Id] == undefined ? true : !communicator.editRowIdMap[row.Id]) && (row.isSubTotal != true || row.isTotal != true || row.isGroupedSubTotal != true) && row.Id != undefined" ng-click="handleTableZIndex();">'+
                                                                '<action class="actionColIconWrap" actions="flexTableActionMap[\'Row\']"  row="row" communicator="communicator" table-communicator="tableCommunicator" "></action>'+
                                                            '</span>'+
                                                            '<a tabIndex="0" ng-if="(communicator.editRowIdMap[row.Id] == undefined ? false : communicator.editRowIdMap[row.Id])&& (row.Id.length == 15 || row.Id.length == 18)" class="tableLinks cursorpointer" ng-click="undoInlineMode(row);" title="Undo" >'+                                                                            
                                                                '<i class="fa fa-undo" aria-hidden="true">'+
                                                                    '<span class="hidden508">Undo</span>'+
                                                                '</i>'+
                                                            '</a>'+
                                                            '<a href="#!" tabIndex="0" class="tableLinks"  title="Remove record" ng-click="tableCommunicator.removeNewRecord(row)" ng-show="row.Id.length != 15 && row.Id.length != 18 && (row.isSubTotal != true || row.isTotal != true) && row.Id != undefined">'+
                                                                '<i class="fa fa-times cursorpointer">'+
                                                                '<span class="hidden508">Remove</span></i>'+
                                                            '</a>'+ 
                                                        '</div>'+ 
                                                    '</td>'+
                                                '</tr>'+
                                                //Grid Directive Recursion if child or Grandchild present
                                                '<tr ng-if="row.showChild && child1MetaData != undefined && level < 2 ">'+
                                                    '<td colspan = "{{colLength+1}}" class="paddingZero" tabindex="0">'+
                                                        '<grid table-meta-data="child1MetaData" level="level+1" communicator="communicator" parent-id="row.Id"></grid>'+
                                                    '</td>'+
                                                '</tr>'+
                                                '<tr ng-if="row.showChild && child2MetaData != undefined && level < 2">'+
                                                    '<td colspan = "{{colLength+1}}" class="paddingZero" tabindex="0">'+
                                                        '<grid table-meta-data="child2MetaData" level="level+1" communicator="communicator" parent-id="row.Id" ></grid>'+
                                                    '</td>'+
                                                '</tr>'+
                                            '</tbody>'+
                                            '<tbody>'+
                                                '<tr class ="childColumn" ng-if="tableCommunicator.isOverAllEnabled == true && tableCommunicator.recordsList.length > 0">'+
                                                    '<td ng-class="{\'sticky-column\': flexTableConfig.EnableAutoIndex == true}" ng-if="flexTableConfig.EnableAutoIndex == true" tabindex="0">        </td>'+
                                                    '<td ng-class="{\'sticky-column\': (child1MetaData != undefined || child2MetaData != undefined)}" ng-if="tableCommunicator.isEnableGroupedSubTotalRow != true && (child1MetaData != undefined || child2MetaData != undefined)" class="expColaIcon" tabindex="0">        </td>'+
                                                    '<td ng-class="{\'sticky-column\': flexTableConfig.EnableRecordSelection == true}" ng-if="flexTableConfig.EnableRecordSelection == true && flexTableConfig.RecordSelectionColumnPosition != \'Right\'" tabindex="0">        </td>'+
                                                    '<td ng-class="{\'sticky-column\': flexTableConfig.EnableAutoIndex && $index==0 ||  flexTableConfig.EnableRecordSelection && $index==0 || $index == 0}" ng-repeat="column in tableCommunicator.columnsList track by $index"  ng-if="column != \'Id\' && (tableCommunicator.visibleColumns[column] == undefined ? true :tableCommunicator.visibleColumns[column])"  tabindex="0" class="font-bold"'+
                                                        ' ng-class="{{dataTableDetailMap[column].StyleClass}}" width="{{tableCommunicator.fieldWidthMap[column]}}"' +
                                                        ' ng-style="{ {{ ((fieldMetaData[column].Type == \'CURRENCY\' || fieldMetaData[column].Type == \'DOUBLE\') && row[column] < 0) ? dataTableDetailMap[column].StyleAttribute : \'\'}}  }" >'+
                                                        
                                                        //'<span ng-if="tableCommunicator.overAllTotalValue[column][\'Label\'] != undefined" ng-bind="tableCommunicator.overAllTotalValue[column][\'Label\']"></span>'+
                                                        '<span ng-if="tableCommunicator.overAllTotalValue != undefined && tableCommunicator.overAllTotalValue[column] != undefined">'+
                                                            '<field field-type="{{fieldMetaData[column].Type}}" field-name="{{column}}" record="tableCommunicator.overAllTotalValue" is-edit="false" field-info="fieldMetaData[column]" table-meta-data="tableMetaData" table-communicator="tableCommunicator"> </field>'+
                                                        '</span>'+
                                                    '</td>'+                                                    
                                                    '<td ng-if="tableCommunicator.isEnableGroupedSubTotalRow != true && flexTableConfig.EnableRecordSelection == true && flexTableConfig.RecordSelectionColumnPosition == \'Right\'" tabindex="0">        </td>'+
                                                    '<td ng-if="(tableCommunicator.hideActionColumn != true || communicator[tableCommunicator.tableId].isEdit == true) && (tableCommunicator.isEnableGroupedSubTotalRow != true && ( flexTableActionMap[\'Row\'] != undefined || communicator[tableCommunicator.tableId].isEdit == true) )" tabindex="0">      </td>'+
                                                '</tr>'+
                                                '<tr ng-if="totalRecords <= 0">' + 
                                                    '<td colspan="{{colLength+1}}" >' + 
                                                    '<span class="col-md-12 col-sm-12 text-center totalRecords" tabindex="0"> ' + noRecordFound + '</span>' +
                                                    '</td>' +
                                                '</tr>'+
                                            '</tbody>'+
                                            
                                        '</table>'+
                                        '<div class="tableScrollArrow rightTableScroll"></div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                            '<div class="row displayFlexCenter" ng-if="totalRecords > 0 && ((flexTableConfig.EnablePageSize == true && !(totalRecords <= defaultPagesize))  || flexTableConfig.EnableTotalRecordsCount || (flexTableConfig.EnablePagination && !(totalRecords <= pageSize.size)))" ng-init="onTableInit()">'+
                                 //<!--Show Page Size-->
                                '<div class="col-md-4 col-sm-4 col-xs-4">'+
                                        '<span ng-if=" flexTableConfig.EnablePageSize == true && !(totalRecords <= defaultPagesize)" class="showEntries displayFlex" ng-class="{disabledOpacity: communicator[tableCommunicator.tableId].isEdit == true}">'+
                                                                        '<span class="" tabindex="0">Show</span>'+
                                                                        '<select class="form-control form-control-ext pageSelectOption" '+ 
                                                                            ' ng-model="pageSize.size" ng-change="changePageSize(pageSize.size);" '+
                                                                            ' aria-label="Form Control-Number of Entries"'+' name="{{flexTableConfig.Name}}resizable" onchange="singleSelectChangeValue(this.name)" '+
                                                                            ' ng-options="page.value as page.label for page in pageSizesMap" tabindex="0">'+                            
                                                                        '</select>'+
                                                                        '<span class="" tabindex="0">Entries</span>'+
                                                                    '</span>'+
                                                                '</div>'+
                                                                //<!--Total Records-->
                                                                '<div class="col-md-4 col-sm-4 col-xs-4 text-center totalRecords gridTotalrecords" tabindex="0">' +
                                                                        '<span ng-if = "flexTableConfig.EnableTotalRecordsCount">'+
                                                                        ' Total Records:'+ 
                                                                        '{{totalRecords}}</span>' +
                                                                        //<!--loading Icon-->
                                                                        '<span ng-if="totalRecords == null" >'+
                                                                            '<i class="fa fa-spinner fa-spin" style="font-size:24px"></i>'+
                                                                        '</span>'+
                                                                '</div>' +
                                                                //<!--Pagination-->
                                                                '<div class="col-md-4 col-sm-4 col-xs-4 notranslate">'+
                                                                    '<span  class="pull-right table-pager" ng-if="!(totalRecords <= pageSize.size) && flexTableConfig.EnablePagination">'+//ng-if="totalRecords != null && totalRecords != 0"
                                                                        '<a tabIndex="0" href="javascript:void(0)"  ng-disabled="{{!hasPrevious}}" ng-class="{disabledCls:!hasPrevious}" title="First" name="{{flexTableConfig.Name}}resizable" ng-click="first();" onclick="singleSelectChangeValue(this.name)"><span class="fa fa-fast-backward" ></span><span class="hidden508">First</span></a>'+
                                                                        '<a tabIndex="0" href="javascript:void(0)"  ng-disabled="{{!hasPrevious}}" ng-class="{disabledCls:!hasPrevious}" title="Previous" name="{{flexTableConfig.Name}}resizable" ng-click="previous();" onclick="singleSelectChangeValue(this.name)"><span class="fa fa-backward" ></span><span class="hidden508">Previous</span></a>'+
                                                                        '<span class="separator">&nbsp;|&nbsp;</span>'+
                                                                        '<span class="bold">Page {{pageNumber}} of {{totalPages}} </span>' +
                                                                        '<span class="separator">&nbsp;|&nbsp;</span>'+
                                                                        '<a tabIndex="0" href="javascript:void(0)"  ng-disabled="{{!hasNext}}" ng-class="{disabledCls:!hasNext}"  title="Next"  name="{{flexTableConfig.Name}}resizable" ng-click="next();" onclick="singleSelectChangeValue(this.name)"><span class="fa fa-forward"></span><span class="hidden508">Next</span></a>'+
                                                                        '<a tabIndex="0" href="javascript:void(0)"  ng-disabled="{{!hasNext}}" ng-class="{disabledCls:!hasNext}" title="Last" name="{{flexTableConfig.Name}}resizable" ng-click="last();" onclick="singleSelectChangeValue(this.name)"><span class="fa fa-fast-forward" ></span><span class="hidden508">Last</span></a>'+
                                                                    '</span>'+
                                                                '</div>' +
                                                            '</div>'+
                                                        '</div>'+

                                            '</div>'+
                        '</div>'+
                    '</div>';                    
               
    var linker = function(scope,element,attrs){
        element.html(template).show();
        $compile(element.contents())(scope);
    }
    return {
        restrict : 'EA', 
        controller: 'FlexGridController',
        scope : {
            level : '=',
            communicator : '=',
            tableMetaData : '=',
            parentId : '=' 
        },
        link : linker,
    }
}]);


flexGrid.controller('FlexGridController',['$scope','$window','$sce',
                    'griddataprovider','gridfactory', 
                    'MessageService','SearchFirstPageRecordsService',
                    'FirstPageRecordsService','AllRecordsCountService','AllRecordsService',
                    'ExpressionEvaluatorService','DataBaseService',
                    'GridHelperService','GridEventsHandlerService',
                     function($scope,$window,$sce,
                                griddataprovider,gridfactory,
                                MessageService,SearchFirstPageRecordsService,
                                FirstPageRecordsService,AllRecordsCountService,AllRecordsService,
                                ExpressionEvaluatorService,DataBaseService,
                                GridHelperService,GridEventsHandlerService){
    
    $scope.groupedFieldValue = [''];
    $scope.groupedFieldValueMap = {};
    // Declare the child directive communicator
    $scope.tableCommunicator = {};

    //General methods
     $scope.trustSrcHTML = function(src) {
        return $sce.trustAsHtml(src);
    };
	 $scope.maintainscope = function(src) {
       console.log('before child');
       $scope.communicator.scopeofparenttable = $scope.tableCommunicator;
       $scope.communicator.parentTableMetaData = $scope.tableMetaData;
    };
    $scope.onTableInit = function() {
        // setTimeout(function() {
        //     $('table.gridTable').each(function() {
        //         checkContainer(this.id); 
        //        checkparentContainer();
        //    });
        // },5000);       
        
        // function checkContainer(tableId) {
        //     if (j$('table#'+tableId).is(':visible')) { //if the container is visible on the page
        //         calWidth(tableId);
        //     }          
        // }

        // function checkparentContainer() {
        //     if (j$(' tr.childColumn>table.gridTable').is(':visible')) { //if the container is visible on the page
        //         childTableWidth();
        //         childTableWidth1();

        //     } else {
        //         setTimeout(checkparentContainer, 5000); //wait 1000 ms, then try again
        //         childTableWidth();
        //         childTableWidth1();

        //     }
        // }
    }

    $scope.handleTableZIndex = function () {
        setTimeout(function() {
            if (j$( ".modal" ).is( ":visible" ) && j$(".modal.tableGridWrap > table.gridTable").length > 0){
                j$(".tableGridWrap > table.gridTable > thead").addClass("no-z-index");
               
                j$('.tableGridWrap>table.gridTable>thead>tr>th.sticky-column').addClass("no-z-index");
                j$('.tableGridWrap  table.gridTable>tbody>tr>td.sticky-column').addClass("no-z-index");
        
                j$('.tableGridWrap  table.gridTable>tbody>tr>td.paddingZero').addClass("no-z-index");
                j$('.quickSearchBoxWrap').addClass("no-z-index");
                j$('.input-group-btn:last-child>.btn .quickSearchBtn .customBtn').addClass("no-z-index");
            }
        },300);    
    }

    $scope.removeFixedHeader = function() {
        setTimeout(function() {
            let expandedIcon = document.querySelector('.fa-minus-square-o');
            if(expandedIcon) {
                $scope.showFixedHeader = false;
                $scope.$apply();
            }else{
                $scope.showFixedHeader = true;
                $scope.$apply(); // need to use $apply() to add class fixedHeader back to tHeader on click of minus icon.
            }
        },1000);
    }
   

     $scope.tableCommunicator.replaceListParamters = function(filterString){
        if($scope.communicator.listParameters != undefined && 
            $scope.communicator.listParameters != '' &&
            filterString != null){
            angular.forEach($scope.communicator.listParameters, function (value, key) {
                if( (typeof filterString == 'string') && filterString.indexOf('{!'+key+'}') != -1){
                    filterString = filterString.replace(new RegExp('{!'+key+'}','g'),'(\''+value.join('\',\'')+'\')');     
                }
                
            });
        }
        return filterString;
    }
    
    $scope.tableCommunicator.replaceStringParamters = function(filterString){
        if($scope.communicator.stringParameters != undefined &&
             $scope.communicator.stringParameters != '' &&
             filterString != null){
            angular.forEach($scope.communicator.stringParameters, function (value, key) {
                if( (typeof filterString == 'string') && filterString.indexOf('{!'+key+'}') != -1){
                    filterString = filterString.replace(new RegExp('{!'+key+'}','g'),value.replace(/'/g, "\\'")); 
                }                    
            });
        }
        return filterString;
    }

    $scope.replaceAllMergeFields = function(filterString){
        filterString = $scope.tableCommunicator.replaceStringParamters(filterString);
        filterString = $scope.tableCommunicator.replaceListParamters(filterString);
        return filterString;
    }

    
    $scope.checkFilterClause = function() {
        let isMasterViewPresent = false;
        let listViewCount = 0;
        let masterListCount = 0;
        let isFilterClausePresent = false;
        let activeListWithoutFilterClause=false;
        let isFilterClausePresentWithMaster = false;
        let isActiveWithoutMaster = 0;
        let activeListFilterClause = '';
        $scope.isParentTargetLookupField = false;
        if ($scope.filterListViewList.length < 1) {
            return isMasterViewPresent;
        }
        for (let i = 0; i < $scope.filterListViewList.length; i++) {
            let filterListView = $scope.filterListViewList[i];
            if (filterListView.IsActive == true) {
                listViewCount++;
                //Check if it is MasterView and Filter Criteria is also Present
                if (filterListView.FilterClause != undefined) {
                    isFilterClausePresent = true;
                    if (filterListView.IsUserListView == true || (filterListView.IsUserListView == false && filterListView.IsMasterView == true)) {
						//$scope.tableCommunicator.updatedFlexHeader = filterListView.Label;
                        //isMasterViewPresent = true;
                        //masterListCount++;
                        isFilterClausePresentWithMaster = true;
                        $scope.masterFilterClause = filterListView.FilterClause;
                        if ($scope.parentId != undefined) {
                            if ($scope.flexTableConfig.ParentTargetLookupField != undefined) {
                                $scope.isParentTargetLookupField = true;
                                let appendClause = $scope.flexTableConfig.ParentTargetLookupField + ' = ' + '\'' + escape($scope.parentId) + '\'';
                                if ($scope.masterFilterClause != undefined) {
                                    if($scope.parentId.length >= 15){
                                        $scope.masterFilterClause = $scope.masterFilterClause.replace(new RegExp('{!parentId}', 'g'), escape($scope.parentId));
                                    } else {
                                        $scope.masterFilterClause = $scope.masterFilterClause.replace(new RegExp('{!parentId}', 'g'), '{{' + escape($scope.parentId) + '}}');
                                    }
                                } else {
                                    $scope.masterFilterClause = appendClause;
                                }
                            } else {
                                $scope.isParentTargetLookupField = false;
                                $scope.flexTableConfig.ShowHeaderPanel = false;
                                MessageService.push(null, $scope.tableCommunicator.messages, 'ParentTargetLookup');
                            }
                        }

                    } else {
                        activeListFilterClause = filterListView.FilterClause;
                        //$scope.tableCommunicator.listViewLabel = filterListView.Label;
                        isActiveWithoutMaster++;
                    }
                } else {
                    activeListWithoutFilterClause=true;
                    //if (filterListView.IsMasterView == true) {
                        //isMasterViewPresent = true;
                        //masterListCount++;
                    //}
                } 

            }
        }
        $scope.filterListViewList.forEach(item=>{
            if(item.IsMasterView){
                isMasterViewPresent = true;
                masterListCount++
            }                
        })
        if(listViewCount == 1) {
            if(isFilterClausePresentWithMaster == false && masterListCount > 0){
                $scope.masterFilterClause = 'Id = null';
                MessageService.push(null, $scope.tableCommunicator.messages, 'filterClauseMustForMaster');
            }else{
                if(isFilterClausePresent == false){
                    $scope.masterFilterClause = 'Id = null';
                    MessageService.push(null, $scope.tableCommunicator.messages, 'filterClauseMust');
                }
            }
            if (isActiveWithoutMaster == 1 ) {
                $scope.masterFilterClause = activeListFilterClause;
                if ($scope.parentId != undefined) {
                    if ($scope.flexTableConfig.ParentTargetLookupField != undefined) {
                        $scope.isParentTargetLookupField = true;
                        let appendClause = $scope.flexTableConfig.ParentTargetLookupField + ' = ' + '\'' + escape($scope.parentId) + '\'';
                        if ($scope.masterFilterClause != undefined) {
                             if($scope.parentId.length >= 15){
                                $scope.masterFilterClause = $scope.masterFilterClause.replace(new RegExp('{!parentId}', 'g'), escape($scope.parentId));
                            } else {
                                $scope.masterFilterClause = $scope.masterFilterClause.replace(new RegExp('{!parentId}', 'g'), '{{' + escape($scope.parentId) + '}}');
                            }
                        } else {
                            $scope.masterFilterClause = appendClause;
                        }
                    } else {
                        $scope.isParentTargetLookupField = false;
                        $scope.flexTableConfig.ShowHeaderPanel = false;
                        MessageService.push(null, $scope.tableCommunicator.messages, 'ParentTargetLookup');
                    }
                }
                return true;
            }
        }
        if (listViewCount > 1) {
            if ((isMasterViewPresent == false && isFilterClausePresentWithMaster == false) && (isFilterClausePresent == false)) {
                $scope.masterFilterClause = 'Id = null';
                MessageService.push(null, $scope.tableCommunicator.messages, 'noListView');
            }
            if (isMasterViewPresent == false) {
                $scope.masterFilterClause = 'Id = null';
                MessageService.push(null, $scope.tableCommunicator.messages, 'MustOneMasterList');
            }else{
                if (isFilterClausePresentWithMaster == false) {
                    $scope.masterFilterClause = 'Id = null';
                    MessageService.push(null, $scope.tableCommunicator.messages, 'filterClauseMustForMaster');
                }
            }
            if (isFilterClausePresent == false || activeListWithoutFilterClause == true) {
                $scope.masterFilterClause = 'Id = null';
                MessageService.push(null, $scope.tableCommunicator.messages, 'filterClauseMust');
            }
        }
        if (masterListCount > 1 && listViewCount > 1) {
            $scope.masterFilterClause = 'Id = null';
            MessageService.push(null, $scope.tableCommunicator.messages, 'OnlyOneMasterList');
        }
        if (listViewCount > 1) {
            $scope.tableCommunicator.showListViewDropDown = true;
        }
        //return isMasterViewPresent; 

        return isFilterClausePresentWithMaster;
    }
        
    
    
    // 1. Set all the record variables in this method
    $scope.setVariables = function(){
        // 1. Set all primary variables  
        console.log('$scope.tableMetaData:===',$scope.tableMetaData);    
        $scope.flexTableConfig = $scope.tableMetaData.FlexTableConfigMap.FlexTableConfig;        
        $scope.filterListViewList = $scope.tableMetaData.FlexTableFilterListViewList;
        $scope.fieldMetaData = $scope.tableMetaData.FlexTableConfigMap.FieldMetaData;
        $scope.dataTableDetailMap  = $scope.tableMetaData.DataTableDetailConfigMap;        
        $scope.flexTableActionMap = $scope.tableMetaData.FlexTableActionMap;     
        $scope.isAdvFilterExcluded = false;    
     
        $scope.tableCommunicator.enableGroupedSubTotalRow = $scope.flexTableConfig.EnableGroupedSubTotalRow;
        $scope.tableCommunicator.ParentRecord = {};
        if($scope.communicator.ParentRecord != undefined && $scope.tableMetaData.ParentRecord == undefined){
            $scope.tableMetaData.ParentRecord = $scope.communicator.ParentRecord;
        }
        if($scope.tableMetaData.ParentRecord != undefined){
            $scope.tableCommunicator.ParentRecord = $scope.tableMetaData.ParentRecord;
            $scope.tableCommunicator.ParentRecord.RecordType = $scope.tableCommunicator.ParentRecord.RecordType != undefined ? $scope.tableCommunicator.ParentRecord.RecordType : {};
            if($scope.tableCommunicator.ParentRecord.RecordTypeId == undefined && !jQuery.isEmptyObject($scope.tableCommunicator.ParentRecord.RecordType) && $scope.tableCommunicator.ParentRecord.RecordType.Id != undefined){
                $scope.tableCommunicator.ParentRecord['RecordTypeId'] = $scope.tableCommunicator.ParentRecord.RecordType.Id;
            }
            if($scope.tableMetaData.ParentRecordTypeName != undefined){
                $scope.tableCommunicator.ParentRecord.RecordType['DeveloperName'] = $scope.tableMetaData.ParentRecordTypeName;
            }
        }

        
        // 2. Set all secondary variables
        $scope.colLength = $scope.tableMetaData.FlexTableConfigMap.ColumnNamesList.length;
        if($scope.flexTableConfig.EnableAutoIndex == true){
            $scope.colLength = $scope.colLength + 1;
        }
        if($scope.flexTableConfig.EnableRecordSelection == true){
            $scope.colLength = $scope.colLength + 1;
        }
        if($scope.flexTableConfig.HeaderDescription != undefined){
            $scope.HeaderDescription = $scope.flexTableConfig.HeaderDescription;
        }
        if($scope.communicator.child1MetaData != undefined ||
                $scope.communicator.child2MetaData != undefined ){
            $scope.colLength = $scope.colLength + 1;
        }

            //Current Page URL 
        $scope.communicator.currentPageURL = flexGridEnhanced_currentPageURL;
            //Display Fields List
        $scope.tableCommunicator.columnsList = angular.copy($scope.tableMetaData.FlexTableConfigMap.ColumnNamesList);
            //Auto Index Header
        $scope.autoIndexHeader = autoIndexHeader;
            //Show Entries Map
        $scope.pageSizesMap = [];
        $scope.pageSizes = $scope.flexTableConfig.PageSizes.split(';');
        $scope.pageNumber = 1;
        $scope.tableCommunicator.pageRefreshNumber = '';      
        $scope.pageSize = {};
        $scope.pageSize.size = $scope.flexTableConfig.DefaultPageSizeEnhanced;
        $scope.defaultPagesize = $scope.flexTableConfig.DefaultPageSizeEnhanced;
        $scope.isSearchWithAll = false;
        for(var index = 0 ; index < $scope.pageSizes.length ; index++){
            $scope.pageSizesMap.push({'value' :  parseInt($scope.pageSizes[index]), 'label' : $scope.pageSizes[index]});
        }
        if($scope.flexTableConfig.DefaultPageSizeEnhanced != undefined){
            for(var index = 0 ; index < $scope.pageSizes.length ; index++){
                if($scope.pageSizes[index] == $scope.flexTableConfig.DefaultPageSizeEnhanced){
                    $scope.pageSize['size'] = $scope.pageSizes[index];
                }
            }
        }else{
            $scope.pageSize['size'] = $scope.pageSizes[2];
        }

        $scope.pageSize['size'] = parseInt($scope.pageSize['size']);
            //Maximum Records when we select "All" in Show Entries
        $scope.maxRecordsCount = $scope.flexTableConfig.MaxRecordsCount;
            //Sobject Name of FlexTable
        $scope.tableCommunicator.sobjectName = $scope.flexTableConfig.SObjectName;
            //AutoIndexBehaviour : Identifies whetherto show AutoIndex for all rows or only for actual database rows(Excluding the rows like Total/SubTotal)
        $scope.flexTableConfig.AutoIndexBehaviour = $scope.flexTableConfig.AutoIndexBehaviour != undefined ? $scope.flexTableConfig.AutoIndexBehaviour : 'ExcludeComputedRows';


        // 3. Declare all array variables
        $scope.tableCommunicator.messages = [];
        $scope.tableCommunicator.recordsList = [];

        // 4. Declare all object variables
        $scope.tableCommunicator.recordsShadowMap = {};
        $scope.tableCommunicator.recordsShadowMapWithId = {};
        $scope.tableCommunicator.recordSelectionMap = {};
        $scope.tableCommunicator.visibleColumns = {};
        $scope.tableCommunicator.fieldLabelMap ={};
        $scope.tableCommunicator.fieldLabelOriginalMap ={};
        
        $scope.tableCommunicator.defaultValueMap ={};
        $scope.tableCommunicator.updateRecordsMap = {};
        $scope.tableCommunicator.escapeHTMLMap = {};
        $scope.tableCommunicator.fieldMetaData = $scope.fieldMetaData;
        
        // 5. Declare all boolean variables
        $scope.showChild = false;
        $scope.selectAll = false;
        $scope.showSortMessage = false;
        $scope.showFixedHeader = true;
        
            //EditAll & Edit Selected capabilty is only Enabled if we Total records < Page size 
        $scope.tableCommunicator.showMassEditActions = false;
            // It becames true if we are in Mass Edit mode 
        $scope.isListViewPresent = false;
        $scope.tableCommunicator.showListViewDropDown = false;
        $scope.tableCommunicator.disableRowlevelAction = $scope.flexTableConfig.ShowHideDisabledAction == undefined ? false : $scope.flexTableConfig.ShowHideDisabledAction == 'Show'? true: false;
        
        // 6. Declare all text variables
        $scope.sortField = undefined;
        $scope.lokiSortField = undefined;
        $scope.sortFieldLabel = undefined;
        $scope.quickSearchHelpText = 'Quick Search is Case Sensitive';
        $scope.quickSearchHelpTextId = $scope.flexTableConfig.Name+'quickSearch';
        $scope.tableCommunicator.tableName = $scope.flexTableConfig.Name;
        $scope.tableCommunicator.tableId = $scope.flexTableConfig.FlexTableId;
        $scope.communicator[$scope.tableCommunicator.tableId] = {};
        $scope.communicator[$scope.tableCommunicator.tableId].requiredFieldsMap = {};
        $scope.communicator[$scope.tableCommunicator.tableId].isMassEdit = false;
        $scope.tableCommunicator.parentId = escape($scope.parentId);
        $scope.tableCommunicator.parentTargetLookupField = $scope.flexTableConfig.ParentTargetLookupField;
        $scope.communicator.gridName = $scope.communicator.flexGridMetaData.flexGridName;
        $scope.tableCommunicator.queryFieldsList = angular.copy($scope.tableMetaData.FlexTableConfigMap.QueryFieldsList);

        // 7. Declare all integer variables
        $scope.offset = 0;
        

        // 8. Get the master filter clause and store it in a variable
        $scope.isListViewPresent = $scope.checkFilterClause();
        
        if(!$scope.isListViewPresent){
            $scope.masterFilterClause = $scope.flexTableConfig.FilterCriteria != undefined ? $scope.flexTableConfig.FilterCriteria : '';
            if($scope.flexTableConfig.ParentTargetLookupField != undefined && $scope.parentId != undefined ){
                let appendClause = $scope.flexTableConfig.ParentTargetLookupField+' = '+'\''+escape($scope.parentId)+'\'';
                $scope.isParentTargetLookupField = true;
                ($scope.masterFilterClause == '' || $scope.masterFilterClause == undefined) ? appendClause :$scope.masterFilterClause;
                $scope.masterFilterClause = $scope.masterFilterClause.replace(new RegExp('{!parentId}', 'g'), escape($scope.parentId));
            }
            else{
                if($scope.communicator.flexGridMetaData != undefined && !(jQuery.isEmptyObject($scope.communicator.flexGridMetaData)) && $scope.communicator.flexGridMetaData.parentFlexTableId != $scope.flexTableConfig.FlexTableId){
                    $scope.isParentTargetLookupField = false;
                    $scope.flexTableConfig.ShowHeaderPanel = false;
                    MessageService.push(null,$scope.tableCommunicator.messages,'ParentTargetLookup');
                }
            }
            
        }       
        $scope.masterFilterClause =  $scope.replaceAllMergeFields($scope.masterFilterClause);           
        //9.Quick search Clause (Loki Object)
        $scope.quickSearchClause = undefined;
        $scope.quickSearchTerm = undefined;
        //10.Advacne Filter Clause (Loki Object)
        $scope.advFltrClause = undefined;

        //11. Evaluates the Expression provided in JSON format from HideCellJSON & ReadOnlyCellJSON, also Convert it ino LokiJS format.
        $scope.tableCommunicator.hideCellJSONMap = {};
        $scope.tableCommunicator.hideColumnJSONMap = {};
        $scope.tableCommunicator.hideTableColumnMap = {};

        $scope.tableCommunicator.hideActionMap = {};
        $scope.tableCommunicator.hideActionColumn = true;

        $scope.tableCommunicator.readOnlyCellJSONMap = {};
        $scope.tableCommunicator.readOnlyColumnJSONMap = {};
        $scope.tableCommunicator.readOnlyTableColumnMap = {};
        $scope.tableCommunicator.requiredFieldsMap = {};
        $scope.tableCommunicator.FormulaJSON = {};
        $scope.tableCommunicator.rowGroupingFieldList = [];        
        $scope.tableCommunicator.rowGroupingFieldMap = {};
        $scope.tableCommunicator.rowGroupHeaderFieldMap = {};        
        $scope.tableCommunicator.rowGroupSubTotalFieldMap = {};
        $scope.tableCommunicator.overAllTotalParams = {};
        $scope.tableCommunicator.overAllTotalParams['sObjectName'] = $scope.tableMetaData.FlexTableConfigMap.FlexTableConfig.SObjectName;        
        $scope.tableCommunicator.overAllTotalValue = {};
        $scope.tableCommunicator.saveTopAction = undefined;
        $scope.tableCommunicator.IsEnableGroupedSubTotalRow = false;
        $scope.tableCommunicator.columnTotalFieldList = [];
        $scope.tableCommunicator.columnSubtotalFieldMap = {};
        $scope.finalParentExpressionEval =undefined;
        
        let expressionFieldsArray = [];
        let expUserFieldsArray = [];
        let advFilterExcludedTypesCount = 0;
        $scope.tableCommunicator.ReferenceDisplayFieldMap = {};
        $scope.tableCommunicator.ReferenceDisplayFieldAPIName = {};
        
        let dataTableDetailConfigMap = $scope.tableMetaData.DataTableDetailConfigMap;
        {            
            let unOrderedRowGroupingFieldList = [];
            angular.forEach(dataTableDetailConfigMap, function (value, key) {
                
                if(value.EnableRowGrouping){
                    unOrderedRowGroupingFieldList.push(key);
                    $scope.tableCommunicator.rowGroupingFieldMap[key] = [''];
                    $scope.tableCommunicator.isRowGroupSubTotalEnabled = value.EnableSubTotal ? true : false;
                    $scope.tableCommunicator.rowGroupHeaderFieldMap[key] = true;
                    value.HideGroupingColumn = $scope.tableCommunicator.enableGroupedSubTotalRow == true ? false : value.HideGroupingColumn;
                    $scope.tableCommunicator.visibleColumns[key] = value.HideGroupingColumn ? true : false;
                    if($scope.tableCommunicator.enableGroupedSubTotalRow == true){
                        dataTableDetailConfigMap[key].FormulaJSON = undefined;
                    }
                }

                let keyField=$scope.tableMetaData.DataTableDetailConfigMap[key].DisplayField!= undefined? key.replace('__c', '__r') + '.' + $scope.tableMetaData.DataTableDetailConfigMap[key].DisplayField : key;
                let fieldType = $scope.tableCommunicator.fieldMetaData[keyField].Type != 'REFERENCE' ? $scope.tableCommunicator.fieldMetaData[keyField].Type : $scope.tableCommunicator.fieldMetaData[keyField].ReferenceFieldInfo.Type;
                //User Story 161384: LAHSA - Need Formula support in subtotals of tables. This should allow to show more advance items in subtotals such as Percentages - Part 2
                if(value.EnableColumnSubtotalPercentage){
                    value.EnableColumnSubtotalPercentage == true ? $scope.tableCommunicator.columnTotalFieldList.push(keyField) : '';
                    value.ColumnSubtotalPercentageJSON != undefined && value.EnableColumnSubtotalPercentage == true? $scope.tableCommunicator.columnSubtotalFieldMap[keyField] = value.ColumnSubtotalPercentageJSON : '';
                }
                ((value.EnableSubTotal) && (["INTEGER","PERCENT","DOUBLE","CURRENCY"].indexOf(fieldType) != -1)) ? $scope.tableCommunicator.rowGroupSubTotalFieldMap[key] = true : '';
                if($scope.fieldMetaData[key].Type == 'REFERENCE' && value.StyleClass != undefined) {
                   
                    let strFieldAPI = '';    
                    let fieldsAPIName = angular.copy(value.FieldAPIName);
                    if (fieldsAPIName.indexOf('__c') == -1) {
                        fieldsAPIName = $scope.tableCommunicator.validateStandardRefFields(fieldsAPIName); 
                    }
                    if(fieldsAPIName.indexOf('.') != -1){
                        let parts = fieldsAPIName.split('.'); 
                        for(let i = 0; i < parts.length; i++){
                            strFieldAPI = strFieldAPI + '[\'' + parts[i] + '\']';
                                                      
                        }
                    } else {
                        if(value.DisplayField != undefined){
                            strFieldAPI =  (fieldsAPIName.indexOf('__c') != -1 ? '[\'' + fieldsAPIName.replace('__c', '__r\']') : fieldsAPIName) ;
                        }
                        else{
                            strFieldAPI =  (fieldsAPIName.indexOf('__c') != -1 ? fieldsAPIName.replace('__c', '__r.Name') : fieldsAPIName) ;
                            let parts =strFieldAPI.split('.'); 
                            let stringFieldAPI = '';
                            for(let i = 0; i < parts.length; i++){
                                stringFieldAPI = stringFieldAPI + '[\'' + parts[i] + '\']' ;
                                strFieldAPI = stringFieldAPI ;                                                      
                            }
                        }
                       
                    }

                    let reffield = $scope.fieldMetaData[key].ReferenceFieldInfo.Type == 'REFERENCE' ? 'Name' : '';
                    reffield =  (value.DisplayField != undefined ?'[\'' + value.DisplayField + '\']': '') ;
                    reffield = (reffield == '[\'\']' ? '' :reffield);

                    value.StyleClass = value.StyleClass.replace('[column]', (strFieldAPI + reffield));
                } 

                if (dataTableDetailConfigMap[key] != undefined && dataTableDetailConfigMap[key].HideCellJSON != undefined) {
                    $scope.tableCommunicator.hideCellJSONMap[key] = ExpressionEvaluatorService.expressionEvaluator($scope, 
                                                angular.fromJson(dataTableDetailConfigMap[key].HideCellJSON), false, false);
                    if($scope.tableCommunicator.expressionFieldsArray != undefined && $scope.tableCommunicator.expressionFieldsArray.length > 0){
                        expressionFieldsArray.length > 0 ? expressionFieldsArray.concat($scope.tableCommunicator.expressionFieldsArray) : expressionFieldsArray = $scope.tableCommunicator.expressionFieldsArray;
                    }
                    if($scope.tableCommunicator.expressionUserFieldsArray != undefined && $scope.tableCommunicator.expressionUserFieldsArray.length > 0){
                        expUserFieldsArray.length > 0 ? expUserFieldsArray.concat($scope.tableCommunicator.expressionUserFieldsArray) : expUserFieldsArray = $scope.tableCommunicator.expressionUserFieldsArray;
                    }                    
                }
                if (dataTableDetailConfigMap[key] != undefined && dataTableDetailConfigMap[key].HideColumnJSON != undefined) {
                    let hideExpressionResult = ExpressionEvaluatorService.expressionEvaluator($scope, 
                                                angular.fromJson(dataTableDetailConfigMap[key].HideColumnJSON), true, true);
                    $scope.finalParentExpressionEval = undefined;                          
                    $scope.tableCommunicator.hideColumnJSONMap[key] = parentExpressionEval(hideExpressionResult);
                }

                if (dataTableDetailConfigMap[key] != undefined && dataTableDetailConfigMap[key].ReadOnlyCellJSON != undefined) {
                    $scope.tableCommunicator.readOnlyCellJSONMap[key] = ExpressionEvaluatorService.expressionEvaluator($scope,
                                                angular.fromJson(dataTableDetailConfigMap[key].ReadOnlyCellJSON), false, false);
                    if($scope.tableCommunicator.expressionFieldsArray != undefined && $scope.tableCommunicator.expressionFieldsArray.length > 0){
                        expressionFieldsArray.length > 0 ? expressionFieldsArray.concat($scope.tableCommunicator.expressionFieldsArray) : expressionFieldsArray = $scope.tableCommunicator.expressionFieldsArray;
                    }
                    if($scope.tableCommunicator.expressionUserFieldsArray != undefined && $scope.tableCommunicator.expressionUserFieldsArray.length > 0){
                        expUserFieldsArray.length > 0 ? expUserFieldsArray.concat($scope.tableCommunicator.expressionUserFieldsArray) : expUserFieldsArray = $scope.tableCommunicator.expressionUserFieldsArray;
                    }
                }
                if (dataTableDetailConfigMap[key] != undefined && dataTableDetailConfigMap[key].ReadOnlyColumnJSON != undefined) {
                    let hideExpressionResult = ExpressionEvaluatorService.expressionEvaluator($scope, 
                                                angular.fromJson(dataTableDetailConfigMap[key].ReadOnlyColumnJSON), true, true);
                    $scope.finalParentExpressionEval = undefined;  
                    $scope.tableCommunicator.readOnlyColumnJSONMap[key] = parentExpressionEval(hideExpressionResult);  
                }

                if($scope.tableCommunicator.hideColumnJSONMap[key] != undefined){
                    if($scope.tableCommunicator.hideColumnJSONMap[key]==true){
                        $scope.tableCommunicator.columnsList.remove(key);                        
                    }
                    /* Old Code Remove
                    if($scope.tableCommunicator.hideColumnJSONMap[key]["$and"] != undefined && $scope.tableCommunicator.hideColumnJSONMap[key]["$and"].length > 0){
                        $scope.tableCommunicator.hideTableColumnMap[key] = ($scope.tableCommunicator.hideColumnJSONMap[key]["$and"].indexOf(false) == -1) ? true : false;
                        if($scope.tableCommunicator.hideColumnJSONMap[key]["$and"].indexOf(false) == -1 && $scope.tableCommunicator.queryFieldsList.indexOf(key) != -1){
                            //$scope.tableCommunicator.queryFieldsList.remove(key);
                            $scope.tableCommunicator.columnsList.remove(key);
                            dataTableDetailConfigMap[key].FormulaJSON = undefined;
                        }
                    }
                    if($scope.tableCommunicator.hideColumnJSONMap[key]["$or"] != undefined && $scope.tableCommunicator.hideColumnJSONMap[key]["$or"].length > 0){                        
                        $scope.tableCommunicator.hideTableColumnMap[key] = ($scope.tableCommunicator.hideColumnJSONMap[key]["$or"].indexOf(true) != -1) ? true : false;
                        if($scope.tableCommunicator.hideColumnJSONMap[key]["$or"].indexOf(true) != -1 && $scope.tableCommunicator.queryFieldsList.indexOf(key) != -1){
                            //$scope.tableCommunicator.queryFieldsList.remove(key);
                            $scope.tableCommunicator.columnsList.remove(key);                            
                            dataTableDetailConfigMap[key].FormulaJSON = undefined;
                        }
                    }
                    */
                }
                else{
                    $scope.tableCommunicator.hideTableColumnMap[key] = true;
                }

                if($scope.tableCommunicator.readOnlyColumnJSONMap[key] != undefined){
                    if($scope.tableCommunicator.readOnlyColumnJSONMap[key] == true || $scope.tableCommunicator.readOnlyColumnJSONMap[key] == false){
                        $scope.tableCommunicator.readOnlyTableColumnMap[key] = !$scope.tableCommunicator.readOnlyColumnJSONMap[key];
                    }else{
                        if($scope.tableCommunicator.readOnlyColumnJSONMap[key]["$and"] != undefined && $scope.tableCommunicator.readOnlyColumnJSONMap[key]["$and"].length > 0){
                            $scope.tableCommunicator.readOnlyTableColumnMap[key] = ($scope.tableCommunicator.readOnlyColumnJSONMap[key]["$and"].indexOf(false) == -1) ? false : true;
                        }
                        if($scope.tableCommunicator.readOnlyColumnJSONMap[key]["$or"] != undefined && $scope.tableCommunicator.readOnlyColumnJSONMap[key]["$or"].length > 0){                        
                            $scope.tableCommunicator.readOnlyTableColumnMap[key] = ($scope.tableCommunicator.readOnlyColumnJSONMap[key]["$or"].indexOf(true) == -1) ? true : false;
                        }
                    }                    
                }
                else{
                    $scope.tableCommunicator.readOnlyTableColumnMap[key] = true;
                }

                $scope.tableCommunicator.fieldWidthMap = $scope.tableCommunicator.fieldWidthMap != undefined ? $scope.tableCommunicator.fieldWidthMap : {};
                  
                let columnWidth = value.FieldWidth;
                if(columnWidth != undefined ){
                    if(isNaN(columnWidth) && columnWidth.indexOf('px') != -1 || columnWidth.indexOf('%') != -1){
                        $scope.tableCommunicator.fieldWidthMap[key] = columnWidth;
                    }
                    else{
                        $scope.tableCommunicator.fieldWidthMap[key] = columnWidth + 'px';
                    }
                }

                if(dataTableDetailConfigMap[key].FormulaJSON != undefined){
                     let keyWiseFormulaJSON = angular.fromJson(dataTableDetailConfigMap[key].FormulaJSON);
                     angular.forEach(keyWiseFormulaJSON, function (jsonValue, rowKey) {
                        $scope.tableCommunicator.FormulaJSON[key] = $scope.tableCommunicator.FormulaJSON[key] != undefined ? $scope.tableCommunicator.FormulaJSON[key] : {};
                         $scope.tableCommunicator.FormulaJSON[key][rowKey] = jsonValue;
                         if(rowKey == 'GRANDTOTAL'){
                            $scope.tableCommunicator.overAllTotalValue = $scope.tableCommunicator.overAllTotalValue != undefined ? $scope.tableCommunicator.overAllTotalValue : {};
                            $scope.tableCommunicator.overAllTotalValue[key] = jsonValue;
                        }
                     });
                }
                $scope.tableCommunicator.ReferenceDisplayFieldAPIName[key] = (dataTableDetailConfigMap[key].DisplayField == undefined && $scope.tableCommunicator.fieldMetaData[key].Type == 'REFERENCE'&& key.indexOf('.')== -1) ? key.replace('__c','__r') + '.Name' : key;
            });

        //Create Field Label Map (APINAME VS LABEL)
        //Create Visible Columns Map (APINAME Vs isVisible)
       
        for (var i = 0; i < $scope.tableCommunicator.columnsList.length; i++) {
            let key = $scope.tableCommunicator.columnsList[i];
            $scope.tableCommunicator.fieldLabelMap[key] =  GridHelperService.getFieldLabel(key,$scope);
            $scope.tableCommunicator.visibleColumns[key] = $scope.tableCommunicator.visibleColumns[key] != undefined ? !$scope.tableMetaData.DataTableDetailConfigMap[key].HideGroupingColumn : true;

            if($scope.fieldMetaData[key] == undefined && $scope.fieldMetaData[key + 'Id'] != undefined )
            {
                $scope.fieldMetaData[key] = $scope.fieldMetaData[key + 'Id'];
            }
            
            if($scope.tableCommunicator.fieldMetaData && $scope.tableCommunicator.fieldMetaData[key] && $scope.tableCommunicator.fieldMetaData[key].DefaultValue){
                $scope.tableCommunicator.defaultValueMap[key] = $scope.tableCommunicator.fieldMetaData[key].DefaultValue;
            }  

            
            if($scope.tableCommunicator.readOnlyTableColumnMap[key] == undefined){                
                $scope.tableCommunicator.readOnlyTableColumnMap[key] = true;
            }
            if($scope.tableCommunicator.overAllTotalParams['columnList']){
                $scope.tableCommunicator.isOverAllEnabled = true;
            }
            if($scope.fieldMetaData[key].Type == 'REFERENCE' || 
                $scope.fieldMetaData[key].Type == 'DATE' || 
                $scope.fieldMetaData[key].Type == 'DATETIME' || 
                $scope.fieldMetaData[key].Type == 'MULTIPICKLIST'){
                    advFilterExcludedTypesCount++;
            }
            // by default over all total for currency field
            let keyField = key;
            let fieldType =  $scope.tableCommunicator.fieldMetaData[keyField].Type != 'REFERENCE' ? $scope.tableCommunicator.fieldMetaData[keyField].Type : $scope.tableCommunicator.fieldMetaData[keyField].ReferenceFieldInfo.Type;
            if(dataTableDetailConfigMap[key] != undefined){
                keyField=dataTableDetailConfigMap[key].DisplayField!= undefined? key.replace('__c', '__r') + '.' + dataTableDetailConfigMap[key].DisplayField : key;
                fieldType = $scope.tableCommunicator.fieldMetaData[keyField].Type != 'REFERENCE' ? $scope.tableCommunicator.fieldMetaData[keyField].Type : $scope.tableCommunicator.fieldMetaData[keyField].ReferenceFieldInfo.Type;
            }
            
           /* if(fieldType == 'CURRENCY' ){
                $scope.tableCommunicator.overAllTotalParams['columnList'] = $scope.tableCommunicator.overAllTotalParams['columnList'] != undefined ? $scope.tableCommunicator.overAllTotalParams['columnList'] : [];   
                ($scope.tableCommunicator.overAllTotalParams['columnList']).indexOf(keyField) == -1 ? $scope.tableCommunicator.overAllTotalParams['columnList'].push(keyField) : '';  
                $scope.tableCommunicator.overAllTotalParams['filterClause'] = $scope.tableCommunicator.overAllTotalParams['filterClause'] != undefined ? $scope.tableCommunicator.overAllTotalParams['filterClause'] : {}; 
                let filterClause = $scope.masterFilterClause;
                $scope.tableCommunicator.overAllTotalParams['filterClause'][keyField] = filterClause;
                $scope.tableCommunicator.rowGroupSubTotalFieldMap[key] = true
            }*/
            
        }

            let fieldNamesList = angular.copy($scope.tableMetaData.FlexTableConfigMap.ColumnNamesList);
            fieldNamesList.forEach( function (fieldValue, key) { 
                if(unOrderedRowGroupingFieldList.indexOf(fieldValue) != -1){
                    $scope.tableCommunicator.rowGroupingFieldList.push(fieldValue);
                }
            });

            if($scope.tableCommunicator.rowGroupingFieldList != undefined &&  $scope.tableCommunicator.rowGroupingFieldList.length == 0){
                $scope.tableCommunicator.rowGroupSubTotalFieldMap = {};
            }
            
            if($scope.tableCommunicator.enableGroupedSubTotalRow == true && $scope.tableCommunicator.rowGroupingFieldList.length > 0){
                $scope.tableCommunicator.IsEnableGroupedSubTotalRow = true;
                $scope.tableMetaData.FlexTableActionMap.Top = undefined;
                $scope.flexTableConfig.EnableRecordSelection = false;
                $scope.flexTableConfig.EnableQuickSearch = false;
                $scope.flexTableConfig.EnableFilter = false;
            }
            
            let recordSelectionActionCount = 0;
            let flexTableRowActionMap = $scope.tableMetaData.FlexTableActionMap.Row;
            angular.forEach(flexTableRowActionMap, function (actionValue, actionKey) {
                if (flexTableRowActionMap[actionKey] != undefined && flexTableRowActionMap[actionKey].HideExpressionJSON != undefined && flexTableRowActionMap[actionKey].EnableParentHideLogic != true) {
                    let hideActionJSON =  ExpressionEvaluatorService.expressionEvaluator($scope, angular.fromJson(flexTableRowActionMap[actionKey].HideExpressionJSON), false, false);
                    if($scope.tableCommunicator.expressionFieldsArray != undefined && $scope.tableCommunicator.expressionFieldsArray.length > 0){
                        expressionFieldsArray.length > 0 ? expressionFieldsArray.concat($scope.tableCommunicator.expressionFieldsArray) : expressionFieldsArray = $scope.tableCommunicator.expressionFieldsArray;
                    }
                    if($scope.tableCommunicator.expressionUserFieldsArray != undefined && $scope.tableCommunicator.expressionUserFieldsArray.length > 0){
                        expUserFieldsArray.length > 0 ? expUserFieldsArray.concat($scope.tableCommunicator.expressionUserFieldsArray) : expUserFieldsArray = $scope.tableCommunicator.expressionUserFieldsArray;
                    }
                }
                recordSelectionActionCount++;
            });
            // create top level action for upload sheetjs            
            
            if($scope.flexTableConfig.EnableDataImportExport){
                if($scope.tableMetaData.FlexTableActionMap.Top != undefined){
                    let topActionLenght = $scope.tableMetaData.FlexTableActionMap.Top.length;
                    if(!($scope.tableMetaData.FlexTableActionMap.Top[topActionLenght-1].ActionBehavior == "OpenSheetJSUrl")){
                        $scope.tableMetaData.FlexTableActionMap.Top[topActionLenght]={ActionBehavior: "OpenSheetJSUrl", DataTableConfig: $scope.tableCommunicator.tableId,DisplayArea: "Both",HeaderActionDisplayType: "Button",Location: "Top",Name: "Upload",RefreshBehaviour: "Close modal and refresh grid", RecordTypeName: "Action Grid",ModalTitle:"Download & Upload Wizard"}
                    }
                }else{
                    $scope.tableMetaData.FlexTableActionMap.Top = [];
                    $scope.tableMetaData.FlexTableActionMap.Top[0] = {ActionBehavior: "OpenSheetJSUrl", DataTableConfig: $scope.tableCommunicator.tableId,DisplayArea: "Both",HeaderActionDisplayType: "Button",Location: "Top",Name: "Upload",RefreshBehaviour: "Close modal and refresh grid", RecordTypeName: "Action Grid",ModalTitle:"Download & Upload Wizard"}
               }
            }
            
            let flexTableTopActionMap = $scope.tableMetaData.FlexTableActionMap.Top;
            angular.forEach(flexTableTopActionMap, function (actionValue, actionKey) {
                if (flexTableTopActionMap[actionKey] != undefined && flexTableTopActionMap[actionKey].HideExpressionJSON != undefined) {
                    let hideActionJSON =  ExpressionEvaluatorService.expressionEvaluator($scope, angular.fromJson(flexTableTopActionMap[actionKey].HideExpressionJSON), false, true);
                    if($scope.tableCommunicator.expressionUserFieldsArray != undefined && $scope.tableCommunicator.expressionUserFieldsArray.length > 0){
                        expUserFieldsArray.length > 0 ? expUserFieldsArray.concat($scope.tableCommunicator.expressionUserFieldsArray) : expUserFieldsArray = $scope.tableCommunicator.expressionUserFieldsArray;
                    }
                }
                //To provide Support of refreshBehaviour after save.
                if(flexTableTopActionMap[actionKey] != undefined && flexTableTopActionMap[actionKey].StandardAction == 'Save'){
                    $scope.tableCommunicator.saveTopAction = flexTableTopActionMap[actionKey];
                }
                recordSelectionActionCount++;
            });
            let showRecordSelectionCheckBox = recordSelectionActionCount > 0 ? true : false;
            $scope.flexTableConfig.EnableRecordSelection = $scope.flexTableConfig.EnableRecordSelection && showRecordSelectionCheckBox;

            
            // let flexTableTopActionMap = $scope.tableMetaData.FlexTableActionMap.Top;
            // angular.forEach(flexTableTopActionMap, function (actionValue, actionKey) {
            //     if (flexTableTopActionMap[actionKey] != undefined && flexTableTopActionMap[actionKey].HideExpressionJSON != undefined) {
            //         let hideActionJSON =  ExpressionEvaluatorService.expressionEvaluator($scope, angular.fromJson(flexTableTopActionMap[actionKey].HideExpressionJSON), false, true);
            //         if($scope.tableCommunicator.expressionParentFieldsArray != undefined && $scope.tableCommunicator.expressionParentFieldsArray.length > 0){
            //             expressionParentFieldsArray.length > 0 ? expressionParentFieldsArray.concat($scope.tableCommunicator.expressionParentFieldsArray) : expressionParentFieldsArray = $scope.tableCommunicator.expressionParentFieldsArray;
            //         }
            //     }
            // });

            if(expressionFieldsArray.length > 0){
                if($scope.tableCommunicator.queryFieldsList.length > 0 && $scope.tableCommunicator.queryFieldsList.indexOf(expressionFieldsArray) == -1){
                    $scope.tableCommunicator.queryFieldsList = $scope.tableCommunicator.queryFieldsList.concat(expressionFieldsArray);
                }
                else{
                    $scope.tableCommunicator.queryFieldsList = expressionFieldsArray;
                }
            }
            let fieldMetaData = $scope.tableMetaData.FlexTableConfigMap.FieldMetaData;
            angular.forEach(fieldMetaData, function (value, key) {
                if(!fieldMetaData[key].IsUpdateable){
                    $scope.tableCommunicator.readOnlyTableColumnMap[key] = false;
                }
            });
        }

        if(advFilterExcludedTypesCount == $scope.tableCommunicator.columnsList.length){
            $scope.tableMetaData.FlexTableConfigMap.FlexTableConfig.EnableFilter = false;
            $scope.flexTableConfig.EnableFilter = false;
            $scope.isAdvFilterExcluded = true;
        }
       
       
        //Create a Required FieldsMap
        if($scope.flexTableConfig.RequiredFields != undefined){
            let requiredFieldsArray = $scope.flexTableConfig.RequiredFields.split(',');
            for (var i = 0; i < requiredFieldsArray.length; i++) {
                if($scope.tableCommunicator.columnsList.indexOf(requiredFieldsArray[i]) != -1){
                    $scope.communicator[$scope.tableCommunicator.tableId].requiredFieldsMap[requiredFieldsArray[i]]= true;
                    $scope.tableCommunicator.requiredFieldsMap[requiredFieldsArray[i]]= true;
                }
            }
        }

        //Create DefaultValueMap
        if($scope.dataTableDetailMap != undefined){
            angular.forEach($scope.dataTableDetailMap, function (value, key) {
                if(value.EscapeHtml == true){
                    if($scope.fieldMetaData[$scope.dataTableDetailMap[key].FieldAPIName].Type == 'STRING' ||
                        $scope.fieldMetaData[$scope.dataTableDetailMap[key].FieldAPIName].Type == 'TEXTAREA'){
                        $scope.tableCommunicator.escapeHTMLMap[key] = true;    
                    }else if($scope.fieldMetaData[$scope.dataTableDetailMap[key].FieldAPIName].Type == 'REFERENCE'){
                        if($scope.fieldMetaData[$scope.dataTableDetailMap[key].FieldAPIName].ReferenceFieldInfo.Type == 'STRING'||
                           $scope.fieldMetaData[$scope.dataTableDetailMap[key].FieldAPIName].ReferenceFieldInfo.Type == 'TEXTAREA' ){
                             $scope.tableCommunicator.escapeHTMLMap[key] = true;  
                        }else{
                            let keyField=$scope.tableMetaData.DataTableDetailConfigMap[key].DisplayField!= undefined? key.replace('__c', '__r') + '.' + $scope.tableMetaData.DataTableDetailConfigMap[key].DisplayField : key;
                            let fieldType = $scope.tableCommunicator.fieldMetaData[keyField].Type != 'REFERENCE' ? $scope.tableCommunicator.fieldMetaData[keyField].Type : $scope.tableCommunicator.fieldMetaData[keyField].ReferenceFieldInfo.Type;
                            if(keyField != null && keyField != undefined &&(fieldType == 'STRING' || fieldType == 'TEXTAREA')){
                                $scope.tableCommunicator.escapeHTMLMap[keyField] = true; 
                            }
                        }
                    }

                } 
                if($scope.dataTableDetailMap[key].DefaultValue != undefined && $scope.dataTableDetailMap[key].FieldAPIName != undefined){
                    $scope.dataTableDetailMap[key].DefaultValue = $scope.replaceAllMergeFields($scope.dataTableDetailMap[key].DefaultValue);
                    if($scope.fieldMetaData[$scope.dataTableDetailMap[key].FieldAPIName].Type == 'INTEGER' ||
                        $scope.fieldMetaData[$scope.dataTableDetailMap[key].FieldAPIName].Type == 'CURRENCY' ||
                        $scope.fieldMetaData[$scope.dataTableDetailMap[key].FieldAPIName].Type == 'PERCENT' ||
                        $scope.fieldMetaData[$scope.dataTableDetailMap[key].FieldAPIName].Type == 'DOUBLE' ){
                        $scope.tableCommunicator.defaultValueMap[$scope.dataTableDetailMap[key].FieldAPIName] = parseFloat($scope.dataTableDetailMap[key].DefaultValue);
                    }else if($scope.fieldMetaData[$scope.dataTableDetailMap[key].FieldAPIName].Type == 'BOOLEAN'){
                        $scope.dataTableDetailMap[key].DefaultValue = $scope.dataTableDetailMap[key].DefaultValue == 'true' ? true : false;
                        $scope.tableCommunicator.defaultValueMap[$scope.dataTableDetailMap[key].FieldAPIName] = $scope.dataTableDetailMap[key].DefaultValue;
                    }else if($scope.fieldMetaData[$scope.dataTableDetailMap[key].FieldAPIName].Type == 'REFERENCE'){
                        let refobj = angular.fromJson($scope.dataTableDetailMap[key].DefaultValue);
                            angular.forEach(refobj, function (value1, key1) {
                                if(key1 == 'Id' || key1 == 'id'){
                                    $scope.tableCommunicator.defaultValueMap[$scope.dataTableDetailMap[key].FieldAPIName] = value1;
                                }if(key1 != 'Id' && key1 != 'id'){
                                    let fieldName = $scope.dataTableDetailMap[key].FieldAPIName.replace('__c','__r');
                                    $scope.tableCommunicator.defaultValueMap[fieldName] = refobj;
                                } 
                            });
                    }
                    else{
                        $scope.tableCommunicator.defaultValueMap[$scope.dataTableDetailMap[key].FieldAPIName] = $scope.dataTableDetailMap[key].DefaultValue; 
                    }
                }
            });
        }

        if(!(jQuery.isEmptyObject($scope.tableCommunicator.defaultValueMap))){
            for (var key in $scope.tableCommunicator.defaultValueMap){
                if(key.match(/(\_\_r)$/g) != null || $scope.tableCommunicator.fieldMetaData[key]){
	                if($scope.tableCommunicator.fieldMetaData[key].Type == 'DATETIME'){
	                    let value = $scope.tableCommunicator.defaultValueMap[key];
	                
	                    localeBasedEnhancedDateTimeFormat = sfFormatToJSFormat(userDateTimeFormat, true);
	                    let parts = value.split(" ");
	                    if(parts.length == 3){
	                        let datepart = parts[0].split("/");
	                        let timepart = parts[1].split(":");
	                        if(datepart.length == 3 && datepart[0].length > 0 && datepart[1].length > 0 && timepart.length == 2 && parts[2].length == 2){
	                            if(localeBasedEnhancedDateTimeFormat.indexOf('d/m/Y') == 0){
	                                value =  toEDateTime(datepart, timepart);
	                            }
	                            $scope.tableCommunicator.defaultValueMap[key] = Date.parse(value) - timeOffset - (new Date().getTimezoneOffset() * 60000);
	                        } 
	                    }
	                }
	                if($scope.tableCommunicator.fieldMetaData[key].Type == 'DATE'){
	                    let value = $scope.tableCommunicator.defaultValueMap[key];
	                
	                    localeBasedEnhancedDateFormat = sfFormatToJSFormat(userDateFormat, false);
	                     let parts = value.split("/");
	                    if(parts.length == 3 && parts[0].length > 0 && parts[1].length > 0){ 
	                        if(localeBasedEnhancedDateFormat.indexOf('d/m/Y') == 0){
	                            value =  toEDate(parts);
	                        }
	                        $scope.tableCommunicator.defaultValueMap[key] = Date.parse(value) - timeOffset - (new Date().getTimezoneOffset() * 60000);
	                    }
	                }
	                if($scope.tableCommunicator.fieldMetaData[key].Type == 'TIME'){                    
	                    let value = $scope.tableCommunicator.defaultValueMap[key];
	                    
	                    let valueParts = value.split(' ');
	                    let finalTimeValue = valueParts.length > 1 && value.match(/(am|pm)/gi) == null ? valueParts[1] : valueParts[0];
	                    let finalValueParts = finalTimeValue.toString().split(':');
	                    if(valueParts[1] != undefined && valueParts[1] == 'pm'){
	                        finalValueParts[0] = (typeof finalValueParts[0] != 'string') ? finalValueParts[0] : parseInt(finalValueParts[0]);
	                        finalValueParts[0] = finalValueParts[0] + 12;
	                    }                    
	                    $scope.tableCommunicator.defaultValueMap[key] = ((parseInt(finalValueParts[0]) * 60) + (parseInt(finalValueParts[1]))) * 60 * 1000;
	                }
                }
            }
        }

        $scope.communicator.queryfieldsMap[$scope.tableCommunicator.tableId] = $scope.tableCommunicator.queryFieldsList;
        //12. Masking character can be set from Configuration
        $scope.tableCommunicator.maskValue = '*****';
        
        
        GridHelperService.generateHideTopActionMap($scope);
        // Bind all events 
        GridEventsHandlerService.bindAllEvents($scope);
    }

    // 2. Set all the child table metadata based on the level
    $scope.setMetaData = function(){
        console.log('Level:===',$scope.level);
        if($scope.level == 0){
            if($scope.communicator.child1MetaData != undefined){
                $scope.child1MetaData = $scope.communicator.child1MetaData;   
            }
            if($scope.communicator.child2MetaData != undefined){
                $scope.child2MetaData = $scope.communicator.child2MetaData;   
            }
        }
        if($scope.level == 1){
            if($scope.communicator.grandChild1MetaData != undefined){
                $scope.child1MetaData = $scope.communicator.grandChild1MetaData;   
            }
            if($scope.communicator.grandChild2MetaData != undefined){
                $scope.child2MetaData = $scope.communicator.grandChild2MetaData;   
            }
        }
        // Once all the variables and metadata is set, let's initialize the Loki DB instance with flex table name
        DataBaseService.initializeLokiDB($scope.flexTableConfig.Name,$scope.tableCommunicator);        
    }

    // 3. Fetches the records for the first page
    $scope.getFirstPageRecords = function (){
        $scope.communicator.openLoadingPopUp(); 

        let getPageSize = GridHelperService.getPaginationCookie($scope,"pageSize");
        if( getPageSize != undefined && getPageSize !='' ) {
            $scope.pageSize['size'] = getPageSize['size'];
        }else{
            $scope.pageSize['size'] = $scope.flexTableConfig.DefaultPageSizeEnhanced;
        }

        $scope.tableCommunicator.pageRefreshNumber = $scope.pageNumber;
        $scope.offset = 0;
        $scope.sortFields = [];
        $scope.sortField = [];
        $scope.sortFieldNames = [];
        $scope.showSortMessage = false;
        $scope.quickSearchTerm = undefined;
        $scope.quickSearchClause = undefined;
       if(isPreview != 'true'){
            var firstPageRecordsParamsJSON = griddataprovider.getPageRecordsParams($scope,0,$scope.flexTableConfig.DefaultPageSizeEnhanced);
        gridfactory.getPageRecordsMap(firstPageRecordsParamsJSON,$scope.firstPageRecordsSuccessHandler,$scope.firstPageRecordsErrorHandler);        
  
        }else{
            $scope.communicator.closeLoadingPopUp(); 
        }
    }

    $scope.firstPageRecordsSuccessHandler = function(result, event){
        if(result.Success == true){
            FirstPageRecordsService.success($scope,result, event);
            $scope.tableCommunicator.query = result.query;
           // $scope.communicator.closeLoadingPopUp(); 
            $scope.getCountPageRecords();    
        }else if (result.Success == false){
            MessageService.push('danger',$scope.tableCommunicator.messages,result.Message);
            
        }
        $scope.$apply();
       
    }
    
    $scope.firstPageRecordsErrorHandler = function(result, event){
        FirstPageRecordsService.error($scope,result, event);
    }

    // 4.  Fetches the Total Count of records for the given Filter Criteria
    $scope.getCountPageRecords = function(){
        $scope.communicator.openLoadingPopUp(); 
        var allRecordsParamJson = griddataprovider.getCountPageRecordsParams($scope);
        gridfactory.getPageRecords(allRecordsParamJson,$scope.totalCountRecordSuccessHandler,$scope.totalCountRecordErrorHandler);     
    }   
     
    $scope.totalCountRecordSuccessHandler = function(result, event){
            AllRecordsCountService.success($scope,result, event);
            $scope.tableCommunicator.showMassEditActions = $scope.totalRecords <= $scope.pageSize['size'] ? true : false;
            // Fetch the remaining set of records only if the total count is more than the size of current set of records
            if($scope.totalRecords > $scope.flexTableConfig.DefaultPageSizeEnhanced){
                $scope.getAllRecords();   
            }else{
                let getSearchTerm = GridHelperService.getPaginationCookie($scope,"SearchTerm");
                if( getSearchTerm != undefined && getSearchTerm !='' ) {
                    $scope.quickSearch(getSearchTerm);
                }
                GridHelperService.initializeSortField($scope);
                if($scope.isSearchTable != true){
                    $scope.tableCommunicator.getOverAllTotal();
                } 
                $scope.communicator.closeLoadingPopUp();
            }   
            if((($scope.totalRecords <= $scope.pageSize['size']) && $scope.tableCommunicator.enableGroupedSubTotalRow != true) || ($scope.tableCommunicator.rowGroupingFieldList == undefined || $scope.tableCommunicator.rowGroupingFieldList.length == 0)){
                GridHelperService.evaluateFormulaJSON($scope);
            }  
           // $scope.communicator.closeLoadingPopUp();
           hideLoadingPopUp();//Bug 166418: LAHSA - The page is getting stuck in case of Refresh behavior ''Close Modal and Refresh grid''.
        $scope.$apply();
    }

    $scope.totalCountRecordErrorHandler = function(result, event){
        AllRecordsCountService.error($scope,result, event);
    }

    $scope.searchWithAllRecord = function( ) {
        let allRecordsParamJson = griddataprovider.getPageRecordsParams($scope,0,10000);
        gridfactory.searchWithAllRecord(allRecordsParamJson,$scope.searchFirstPageRecordsServiceHandler,$scope.allRecordErrorHandler); 
    }

    $scope.searchFirstPageRecordsServiceHandler = function(result, event){
        if(result.Success == true){
            SearchFirstPageRecordsService.success($scope,result, event);
            $scope.totalPages = Math.ceil($scope.totalRecords/$scope.pageSize['size']);
            let getpageNumber = GridHelperService.getPaginationCookie($scope,"pageNumber");
            if( getpageNumber != undefined && getpageNumber !='' ) {
                $scope.pageNumber = getpageNumber;
            }
            $scope.offset = $scope.pageSize['size'] * ($scope.pageNumber - 1);
            $scope.hasNext = true;
            $scope.hasPrevious = false;
            if($scope.pageNumber == 1 ){
                $scope.hasPrevious = false;
            }else if($scope.pageNumber < $scope.totalPages){       
                $scope.hasNext = true;
                $scope.hasPrevious = true;
            }else if($scope.pageNumber = $scope.totalPages){
                $scope.hasNext = false;
                $scope.hasPrevious = true;
            }   
        }else if (result.Success == false){
            MessageService.push('danger',$scope.tableCommunicator.messages,result.Message);
            
        }
        $scope.$apply();
       
    }
    
    // 5. Fetches All the records < 10000
    
    $scope.getAllRecords =function(){
        $scope.communicator.openLoadingPopUp(); 
        let allRecordsParamJson = griddataprovider.getPageRecordsParams($scope,0,$scope.totalRecords);
        gridfactory.getPageRecordsMap(allRecordsParamJson,$scope.allRecordSuccessHandler,$scope.allRecordErrorHandler);     
    }
    $scope.allRecordSuccessHandler = function(result, event){
       
        if(result.Success == true){
            AllRecordsService.success($scope,result, event);
            $scope.totalPages = Math.ceil($scope.totalRecords/$scope.pageSize['size']);
            let getpageNumber = GridHelperService.getPaginationCookie($scope,"pageNumber");
            let getSearchTerm = GridHelperService.getPaginationCookie($scope,"SearchTerm");
            if( getSearchTerm != undefined && getSearchTerm !='' ) {
                $scope.quickSearch(getSearchTerm);
                if(getpageNumber != undefined && getpageNumber != '' ) {
                    GridHelperService.setPaginationCookie($scope,"pageNumber", getpageNumber);
                }
            }
            if( getpageNumber != undefined && getpageNumber !='' ) {
                $scope.pageNumber = getpageNumber;
            }

            $scope.offset = $scope.pageSize['size'] * ($scope.pageNumber - 1);
            $scope.hasNext = true;
            $scope.hasPrevious = false;
            if($scope.pageNumber == 1 ){
                $scope.hasPrevious = false;
            }else if($scope.pageNumber < $scope.totalPages){       
                $scope.hasNext = true;
                $scope.hasPrevious = true;
            }else if($scope.pageNumber = $scope.totalPages){
                $scope.hasNext = false;
                $scope.hasPrevious = true;
            }
            if($scope.isSearchTable != true){
                $scope.tableCommunicator.getOverAllTotal();
            }
            
       }else if (result.Success == false){
            MessageService.push('danger',$scope.tableCommunicator.messages,result.Message);
       }
       $scope.tableCommunicator.recordsList = DataBaseService.navigatePage($scope);
       if((($scope.totalRecords <= $scope.pageSize['size']) && $scope.tableCommunicator.enableGroupedSubTotalRow == true) || ($scope.tableCommunicator.rowGroupingFieldList != undefined || $scope.tableCommunicator.rowGroupingFieldList.length != 0)){
            GridHelperService.evaluateFormulaJSON($scope);
       }
       GridHelperService.generateHideActionMap($scope);  
       $scope.communicator.closeLoadingPopUp();
        $scope.$apply();
    }
    $scope.allRecordErrorHandler = function(result, event){
        AllRecordsService.error($scope,result, event);
    }

    //6.
    $scope.tableCommunicator.getOverAllTotal =function(){
       let parentIdPrefix = '{{', parentIdSuffix = "}}";
        angular.forEach($scope.tableCommunicator.overAllTotalParams.filterClause, function (value, key) {
            let parentIdString = value.match(new RegExp(parentIdPrefix + '(.*)' + parentIdSuffix));
            if(parentIdString != undefined && parentIdString.length == 2){
                $scope.tableCommunicator.overAllTotalParams.filterClause[key] = value.replace(parentIdString[0], $scope.communicator.recordsIDMap[parentIdString[1]]);
            }
        });

        let overAllTotalParams = angular.toJson($scope.tableCommunicator.overAllTotalParams);  
        if($scope.tableCommunicator.overAllTotalParams['columnList'] != undefined){
            gridfactory.getOverAllTotal(overAllTotalParams, $scope.overAllTotalSuccessHandler, $scope.overAllTotalErrorHandler);
        }
    }
    $scope.overAllTotalSuccessHandler = function(result, event){
        $scope.$apply(function () {
            if(result.Success == true ){
                let overAllTotalValueMap = $scope.tableCommunicator.overAllTotalValue;
                $scope.tableCommunicator.overAllTotalValue = {}; // for dynamic update on Data update
                //$scope.tableCommunicator.overAllTotalValue = overAllTotalValueMap;
                let firstColumn = $scope.tableCommunicator.columnsList[0];
                angular.forEach(result.overAllTOtalValues, function (value, key) { 
                    $scope.tableCommunicator.overAllTotalValue = $scope.tableCommunicator.overAllTotalValue != undefined ? $scope.tableCommunicator.overAllTotalValue : {};
                    $scope.tableCommunicator.overAllTotalValue[key] = value;
                    $scope.tableCommunicator.overAllTotalValue['isGrandTotal'] = true;
                    $scope.tableCommunicator.isOverAllEnabled = true;
                });

                angular.forEach(overAllTotalValueMap, function (value, key) { 
                    if($scope.tableCommunicator.overAllTotalValue[key] == undefined && overAllTotalValueMap[key] != $scope.tableCommunicator.overAllTotalValue[key]){
                        $scope.tableCommunicator.overAllTotalValue[key] = overAllTotalValueMap[key];
                    }
                });

                angular.forEach($scope.tableCommunicator.overAllTotalParams.columnList, function (value, key) {
                    console.log("value    ",  value,"  key     ", key);                    
                    if($scope.tableCommunicator.overAllTotalValue[value] == undefined){
                        $scope.tableCommunicator.overAllTotalValue[value] = 0;
                    }

                    if(value.indexOf('__r.') != -1){
                        let fieldNameList = value.split('.'); 
                        let refFieldName = fieldNameList[0];
                        let displayFieldName = fieldNameList[1];
                        $scope.tableCommunicator.overAllTotalValue[refFieldName] = $scope.tableCommunicator.overAllTotalValue[refFieldName] != undefined ? $scope.tableCommunicator.overAllTotalValue[refFieldName] : {};
                        $scope.tableCommunicator.overAllTotalValue[refFieldName][displayFieldName] = $scope.tableCommunicator.overAllTotalValue[value];
                        $scope.tableCommunicator.overAllTotalValue[refFieldName.replace('__r', '__c')] = $scope.tableCommunicator.overAllTotalValue[value];
                    }
                });
                
                console.log('overAllTotalValue   ',$scope.tableCommunicator.overAllTotalValue)
            }else if (result.Success == false){
                    MessageService.push('danger',$scope.tableCommunicator.messages,result.Message);
            }
        });
    }
    $scope.overAllTotalErrorHandler = function(result, event){
        console.log(result);
    }
    // Convert standerd field into query field 
    $scope.tableCommunicator.validateStandardRefFields = function(fieldName){                   
        if(fieldName.indexOf('RecordTypeId') != -1){
            fieldName = fieldName.replace('RecordTypeId','RecordType');
        }
        if(fieldName.indexOf('ContentDocumentId') != -1){
            fieldName = fieldName.replace('ContentDocumentId','ContentDocument');
        }
        if(fieldName.indexOf('LinkedEntityId') != -1){
            fieldName = fieldName.replace('LinkedEntityId','LinkedEntity');
        }
        if(fieldName.indexOf('LastModifiedById') != -1){
            fieldName = fieldName.replace('LastModifiedById','LastModifiedBy');
        }
        if(fieldName.indexOf('CreatedById') != -1){
            fieldName = fieldName.replace('CreatedById','CreatedBy');
        }
        if(fieldName.indexOf('LinkedEntityId') != -1){
            fieldName = fieldName.replace('LinkedEntityId','LinkedEntity');
        }
        if(fieldName.indexOf('CollaborationGroupId') != -1){
            fieldName = fieldName.replace('CollaborationGroupId','CollaborationGroup');
        }
        if(fieldName.indexOf('MemberId') != -1){
            fieldName = fieldName.replace('MemberId','Member');
        }
        if(fieldName.indexOf('RequesterId') != -1){
            fieldName = fieldName.replace('RequesterId','Requester');
        }
        if(fieldName.indexOf('OwnerId') != -1){
            fieldName = fieldName.replace('OwnerId','Owner');
        }if(fieldName.indexOf('ParentId.') != -1){
            fieldName = fieldName.replace('ParentId','Parent');
        }
        if(fieldName.indexOf('ProfileId') != -1){
            fieldName = fieldName.replace('ProfileId','Profile');
        }
     return fieldName;
    }

    $scope.tableCommunicator.getReferenceFieldName = function(fieldName){ 
       
        $scope.isReadOnlyField = false;
        if ($scope.tableMetaData != undefined && fieldName != undefined) {
            
            if ($scope.tableMetaData.FlexTableConfigMap.FieldMetaData[fieldName] != undefined &&
                $scope.tableMetaData.FlexTableConfigMap.FieldMetaData[fieldName].Type == 'REFERENCE') {

                $scope.refFieldType = $scope.tableMetaData.FlexTableConfigMap.FieldMetaData[fieldName].ReferenceFieldInfo.Type;
                $scope.refFieldInfo = $scope.tableMetaData.FlexTableConfigMap.FieldMetaData[fieldName].ReferenceFieldInfo;
                let refIdField = '';
                //Original Display Field Name
                let orgFieldName = angular.copy(fieldName);
                refIdField = fieldName;               
                if (fieldName.indexOf('.') == -1) {
                    if (fieldName.indexOf('__c') == -1) {
                        refIdField = fieldName + '.Id';
                    } else {
                        refIdField = fieldName.replace('__c', '__r.Id');
                    }
                }              
              
                let strDisplayField = ($scope.tableMetaData.DataTableDetailConfigMap[fieldName] && $scope.tableMetaData.DataTableDetailConfigMap[fieldName].DisplayField) 
                                        ? $scope.tableMetaData.DataTableDetailConfigMap[fieldName].DisplayField 
                                        : undefined;

                if(strDisplayField) {
                    let refField = '';
                    if (fieldName.indexOf('__c') == -1) {
                       // refField = $scope.fieldName + '.';   
                       refField =$scope.tableCommunicator.validateStandardRefFields(fieldName) + '.';                       
                    }
                     else {
                        refField = fieldName.replace('__c', '__r.');
                    }
                    refField = refField + strDisplayField;                   
                    fieldName = refField;
                    
                    $scope.refFieldType = $scope.tableMetaData.FlexTableConfigMap.FieldMetaData[fieldName].ReferenceFieldInfo.Type;
                    $scope.refFieldInfo = $scope.tableMetaData.FlexTableConfigMap.FieldMetaData[fieldName].ReferenceFieldInfo;
                    
                    /*if (refField.indexOf('.') != -1) {                                    
                        $scope.isReadOnlyField = true;
                    }*/
                    
                } else {
                    let refField = fieldName;
                    if (refField.indexOf('.') == -1) {
                        switch(refField.toLowerCase()){
                            case 'lastmodifiedbyid':
                                refField = 'LastModifiedBy.Name';
                                break;
                            case 'createdbyid':
                                refField = 'CreatedBy.Name';
                                break;
                            case 'recordtypeid':
                                refField = 'RecordType.Name';
                                break;
                            case 'ownerid':
                                refField = 'Owner.Name';
                            break;
                            case 'parentid':
                                refField = 'Parent.Name';
                            break;
                            default:
                                if (fieldName.indexOf('__c') == -1) {
                                    refField = fieldName + '.Name';
                                } else {
                                    refField = fieldName.replace('__c', '__r.Name');
                                }
                                fieldName = refField;                                
                        }
                    } 
                   /* if(refField.match( /(\.Id)$/g)){           
                        refField = refField.replace('.Id', '.Name');                                            
                    }
                    if($scope.isReadOnlyField && $scope.refFieldType != 'REFERENCE'){ 
                        $scope.fieldType = $scope.refFieldType    
                    }*/
                  //  refField = $scope.getStandardFieldName(refField);
                }              
               
            }
        }
        return fieldName;
    }

    // This method evaluate expression result
    var parentExpressionEval = function(exp){
        let prevConditon;
         $scope.finalParentExpressionEval = undefined;
        if(exp.$or || exp.$and){
            let cond = (exp.$or ? exp.$or : exp.$and);
            let prevConditon = (exp.$or ? '||' : '&&');
            for(let i = 0; i < cond.length; i++){
                if(typeof cond[i] == 'object'){
                    cond[i] = parentExpressionEval(cond[i]);
                }
            }
            for(let i = 0; i < cond.length; i++){
                let condResult = typeof cond[i] == 'boolean' ? cond[i] : parentExpressionEval(cond[i]);
                if(prevConditon == '||'){
                    $scope.finalParentExpressionEval = $scope.finalParentExpressionEval != undefined ? $scope.finalParentExpressionEval : false;
                    $scope.finalParentExpressionEval = $scope.finalParentExpressionEval || condResult;
                }else{
                    $scope.finalParentExpressionEval = $scope.finalParentExpressionEval != undefined ? $scope.finalParentExpressionEval : true;
                    $scope.finalParentExpressionEval = $scope.finalParentExpressionEval && condResult;
                }
            }            
        }
        return $scope.finalParentExpressionEval;
    }    
    
    //These methods get called when we load the grid directive     
    $scope.setVariables();
    if($scope.communicator.GridType == 'FlexTable' || ($scope.isParentTargetLookupField || $scope.communicator.flexGridMetaData.parentFlexTableId == $scope.flexTableConfig.FlexTableId)){
        $scope.setMetaData(); 
        if(!($scope.parentId != undefined && $scope.parentId.length !=  15 && $scope.parentId.length != 18)){
            $scope.getFirstPageRecords();    
        } 
            
    }
    // IE not support Object.entries()    
    if (!Object.entries)
    Object.entries = function( obj ){
        var ownProps = Object.keys( obj ),
            i = ownProps.length,
            resArray = new Array(i); // preallocate the Array
        while (i--)
        resArray[i] = [ownProps[i], obj[ownProps[i]]]
        return resArray;
    };

}]);


//==============Freeze Pane US========================

// freeze the first three columns of the parent table

// function calWidth(tableId) {
//     var dWidth = j$('table#' + tableId + ' .sticky-column:nth-of-type(1)').outerWidth();
//     j$('table#' + tableId + '>thead>tr>th:nth-child(2)').css({ 'left': dWidth, 'z-index': 9 });
//     j$('table#' + tableId + '>tbody>tr>td:nth-child(2)').css({ 'left': dWidth });
//     if (j$('table#' + tableId + ' >thead>tr> th.expColaIcon+th#autoIndexCol').length || j$('table#' + tableId + ' >thead>tr> th.expColaIcon+th#recordSelect').length) {
//         var dWidth2 = j$('table#' + tableId + ' .sticky-column:nth-of-type(2)').outerWidth();
//         var thirdCol = dWidth + dWidth2;
//         j$('table#' + tableId + '>thead>tr>th:nth-child(3)').css({ 'left': thirdCol, 'z-index': 9 });
//         j$('table#' + tableId + '>tbody>tr>td:nth-child(3)').css({ 'left': thirdCol });
//     } else {
//         if (!j$('table#' + tableId + ' >thead>tr> th.expColaIcon').length && j$('table#' + tableId + ' >thead>tr> th#autoIndexCol').length && j$('table#' + tableId + ' >thead>tr>th#recordSelect').length) {
//             var dWidth2 = j$('table#' + tableId + ' .sticky-column:nth-of-type(2)').outerWidth();
//             var thirdCol = dWidth + dWidth2;
//             j$('table#' + tableId + '>thead>tr>th:nth-child(3)').css({ 'left': thirdCol, 'z-index': 9 });
//             j$('table#' + tableId + '>tbody>tr>td:nth-child(3)').css({ 'left': thirdCol });
//         }
//     }

//     if (j$('table#' + tableId + ' >thead>tr> th.expColaIcon+th#autoIndexCol').length && j$('table#' + tableId + ' >thead>tr> th.expColaIcon+th#recordSelect').length) {
//         var dWidth3 = j$('table#' + tableId + ' .sticky-column:nth-of-type(3)').outerWidth();
//         var fourthColLeft = dWidth + dWidth2 + dWidth3;
//         j$('table#' + tableId + '>thead>tr>th:nth-child(4)').css({ 'left': fourthColLeft, 'z-index': 9 });
//         j$('table#' + tableId + '>tbody>tr>td:nth-child(4)').css({ 'left': fourthColLeft });
//     }
// }

// // freeze first three columns of the child table

// function childTableWidth(){
//     var childtableId = j$('.childColumn table.gridTable').attr('Id');

//     var cWidth = j$('.tab-pane.active .childColumn table#'+childtableId+' .sticky-column:nth-child(1)').outerWidth( );
//     var cwidth = cWidth;
//     j$(' tr.childColumn grid table#'+childtableId+' thead tr th.sticky-column:nth-child(2)').css({ 'left': cwidth, 'z-index': 9 });
  

//     if (j$('.childColumn table#'+childtableId+' >thead>tr> th+th#autoIndexCol').length && j$('.childColumn table#'+childtableId+' >thead>tr> th#recordSelect').length) {
//         var cWidth1 = j$('.tab-pane.active .childColumn table#'+childtableId+' .sticky-column:nth-child(2)').outerWidth();
//         var cthird = cwidth + cWidth1;
//         j$(' tr.childColumn  grid table#'+childtableId+' thead tr th.sticky-column:nth-child(3)').css({ 'left': cthird, 'z-index': 8 });
//     }
// }

// function childTableWidth1(){

//     var childtableId = j$('.childColumn table.gridTable').attr('Id');
//     var cbodyWidth = j$('.tab-pane.active .childColumn table#'+childtableId+' tbody tr td.sticky-column:nth-child(1)').outerWidth( );
//     j$(' tr.childColumn grid table#'+childtableId+' tbody tr td.sticky-column:nth-child(2)').css({'left': cbodyWidth, 'z-index': 7 });
//     if (!j$('.childColumn table#'+childtableId+' >thead>tr> th#autoIndexCol').length && !j$('.childColumn table#'+childtableId+' >thead>tr> th#recordSelect').length ) {
//         j$(' tr.childColumn grid table#'+childtableId+' tbody tr td:nth-child(2)').css({'z-index': 6 });
//     }

//     if (j$('.childColumn table#'+childtableId+' >thead>tr> th+th#autoIndexCol').length && j$('.childColumn table#'+childtableId+' >thead>tr> th#recordSelect').length ) {
//         var cbodyWidth1 = j$('.tab-pane.active .childColumn table#'+childtableId+' tbody tr td.sticky-column:nth-child(2)').outerWidth();
//         var cbodyThird = cbodyWidth + cbodyWidth1;
//         j$(' tr.childColumn  grid table#'+childtableId+' tbody tr td.sticky-column:nth-child(3)').css({ 'left': cbodyThird });

//     }
// }

function singleSelectChangeValue(tableId) {
    console.log('tableID===', tableId);
    //Added settimeout to wait for loading of UI if page size changed
    setTimeout(calWidth, 2000, tableId);
}



