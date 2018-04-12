$.jgrid.defaults.width = 780;
$.jgrid.defaults.responsive = true;
$.jgrid.defaults.styleUI = 'Bootstrap4';
$.jgrid.defaults.iconSet = "Octicons";

$(document).ready(function () {

           var load_flag = 0;

           $("#jqGrid").jqGrid({
                url: 'getData',
                datatype: "json",
                colModel: [
                    { label: '图片', name: 'image',  editable: true, formatter:function ( cellvalue, options, rowObject ){
                        return '<img src="'+cellvalue+ '" />';
                    }},
                    { label: '结果', name: 'result',  editable: true },
                    { label: '是否正确', name: 'correct',  sortable: false, editable: true,
                        formatter:function ( cellvalue, options, rowObject ) {
                            if (cellvalue) {
                                return "正确"
                            } else {
                                return "错误"
                            }
                    }},
                    { label: '记录时间', name: 'log_time',  sorttype: 'integer', editable: true }
                ],
                loadonce: true,
				altRows : true,
                width: 780,
                height: 'auto',
				colMenu : true,
				menubar: true,
				viewrecords : true,
				hoverrows : true,
                rowNum: 13,
				caption : '预测记录',
                // multiselect : true,
                // sortable: true,
                // grouping: true,
                // groupingView: {
                //     groupField: ["result"],
                //     groupColumnShow: [true],
                //     groupText: ["<b>{0}</b>"],
                //     groupOrder: ["asc"],
                //     groupSummary: [false],
                //     groupCollapse: false
                // },
                pager: "#jqGridPager",
                loadComplete: function(data) {
                        if (!load_flag){
                            var predict_correct = 0;
                            var predict_false = 0;

                            for (var i=0; i<data.length; i++) {
                                if (data[i]["correct"]) {
                                    predict_correct += 1
                                } else {
                                    predict_false += 1
                                }

                            }

                            var result = [
                               { label: "正确",  data: predict_correct},
                               { label: "错误",  data: predict_false}
                            ];

                           $.plot($("#pic_placeholder"), result, {
                               series: {
                                    pie: {
                                        show: true
                                    }
                               },
                               legend: {
                                    show: false
                               }
                           });

                           load_flag = 1
                        }

	        }
            });
            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" });
            $('#jqGrid').navGrid('#jqGridPager',
                // the buttons to appear on the toolbar of the grid
                { edit: true, add: true, del: true, search: true, refresh: true, view: true, position: "left", cloneToTop: false },
                // options for the Edit Dialog
                {
                    editCaption: "The Edit Dialog",
                    recreateForm: true,
					checkOnUpdate : true,
					checkOnSubmit : true,
                    closeAfterEdit: true,
                    errorTextFormat: function (data) {
                        return 'Error: ' + data.responseText
                    }
                },
                // options for the Add Dialog
                {
                    closeAfterAdd: true,
                    recreateForm: true,
                    errorTextFormat: function (data) {
                        return 'Error: ' + data.responseText
                    }
                },
                // options for the Delete Dailog
                {
                    errorTextFormat: function (data) {
                        return 'Error: ' + data.responseText
                    }
                },
				{ multipleSearch: true,
				showQuery: true} // search options - define multiple search
				);
			$("#jqGrid").jqGrid('menubarAdd',  [
				{
					id : 'das',
					//cloasoncall : true,
					title : 'Sort by Category',
					click : function ( event) {
						$("#jqGrid").jqGrid('sortGrid','CategoryName');
					}
				},
				{
					divider : true
				},
				{
					id : 'was',
					//cloasoncall : true,
					title : 'Toggle Visibility',
					click : function ( event) {
						var state = (this.p.gridstate === 'visible') ? 'hidden' : 'visible';
						$("#jqGrid").jqGrid('setGridState',state);
					}
				}
			]);

        });
