/*! DataTables 1.10.23
 * ©2008-2020 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     DataTables
 * @description Paginate, search and order HTML tables
 * @version     1.10.23
 * @file        jquery.dataTables.js
 * @author      SpryMedia Ltd
 * @contact     www.datatables.net
 * @copyright   Copyright 2008-2020 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

/*jslint evil: true, undef: true, browser: true */
/*globals $,require,jQuery,define,_selector_run,_selector_opts,_selector_first,_selector_row_indexes,_ext,_Api,_api_register,_api_registerPlural,_re_new_lines,_re_html,_re_formatted_numeric,_re_escape_regex,_empty,_intVal,_numToDecimal,_isNumber,_isHtml,_htmlNumeric,_pluck,_pluck_order,_range,_stripHtml,_unique,_fnBuildAjax,_fnAjaxUpdate,_fnAjaxParameters,_fnAjaxUpdateDraw,_fnAjaxDataSrc,_fnAddColumn,_fnColumnOptions,_fnAdjustColumnSizing,_fnVisibleToColumnIndex,_fnColumnIndexToVisible,_fnVisbleColumns,_fnGetColumns,_fnColumnTypes,_fnApplyColumnDefs,_fnHungarianMap,_fnCamelToHungarian,_fnLanguageCompat,_fnBrowserDetect,_fnAddData,_fnAddTr,_fnNodeToDataIndex,_fnNodeToColumnIndex,_fnGetCellData,_fnSetCellData,_fnSplitObjNotation,_fnGetObjectDataFn,_fnSetObjectDataFn,_fnGetDataMaster,_fnClearTable,_fnDeleteIndex,_fnInvalidate,_fnGetRowElements,_fnCreateTr,_fnBuildHead,_fnDrawHead,_fnDraw,_fnReDraw,_fnAddOptionsHtml,_fnDetectHeader,_fnGetUniqueThs,_fnFeatureHtmlFilter,_fnFilterComplete,_fnFilterCustom,_fnFilterColumn,_fnFilter,_fnFilterCreateSearch,_fnEscapeRegex,_fnFilterData,_fnFeatureHtmlInfo,_fnUpdateInfo,_fnInfoMacros,_fnInitialise,_fnInitComplete,_fnLengthChange,_fnFeatureHtmlLength,_fnFeatureHtmlPaginate,_fnPageChange,_fnFeatureHtmlProcessing,_fnProcessingDisplay,_fnFeatureHtmlTable,_fnScrollDraw,_fnApplyToChildren,_fnCalculateColumnWidths,_fnThrottle,_fnConvertToWidth,_fnGetWidestNode,_fnGetMaxLenString,_fnStringToCss,_fnSortFlatten,_fnSort,_fnSortAria,_fnSortListener,_fnSortAttachListener,_fnSortingClasses,_fnSortData,_fnSaveState,_fnLoadState,_fnSettingsFromNode,_fnLog,_fnMap,_fnBindAction,_fnCallbackReg,_fnCallbackFire,_fnLengthOverflow,_fnRenderer,_fnDataSource,_fnRowAttributes*/

(function( factory ) {
	"use strict";

	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				// CommonJS environments without a window global must pass a
				// root. This will give an error otherwise
				root = window;
			}

			if ( ! $ ) {
				$ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
					require('jquery') :
					require('jquery')( root );
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}
(function( $, window, document, undefined ) {
	"use strict";

	/**
	 * DataTables is a plug-in for the jQuery Javascript library. It is a highly
	 * flexible tool, based upon the foundations of progressive enhancement,
	 * which will add advanced interaction controls to any HTML table. For a
	 * full list of features please refer to
	 * [DataTables.net](href="http://datatables.net).
	 *
	 * Note that the `DataTable` object is not a global variable but is aliased
	 * to `jQuery.fn.DataTable` and `jQuery.fn.dataTable` through which it may
	 * be  accessed.
	 *
	 *  @class
	 *  @param {object} [init={}] Configuration object for DataTables. Options
	 *    are defined by {@link DataTable.defaults}
	 *  @requires jQuery 1.7+
	 *
	 *  @example
	 *    // Basic initialisation
	 *    $(document).ready( function {
	 *      $('#example').dataTable();
	 *    } );
	 *
	 *  @example
	 *    // Initialisation with configuration options - in this case, disable
	 *    // pagination and sorting.
	 *    $(document).ready( function {
	 *      $('#example').dataTable( {
	 *        "paginate": false,
	 *        "sort": false
	 *      } );
	 *    } );
	 */
	var DataTable = function ( options )
	{
		/**
		 * Perform a jQuery selector action on the table's TR elements (from the tbody) and
		 * return the resulting jQuery object.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select TR elements that meet the current filter
		 *    criterion ("applied") or all TR elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the TR elements in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {object} jQuery object, filtered by the given selector.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Highlight every second row
		 *      oTable.$('tr:odd').css('backgroundColor', 'blue');
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to rows with 'Webkit' in them, add a background colour and then
		 *      // remove the filter, thus highlighting the 'Webkit' rows only.
		 *      oTable.fnFilter('Webkit');
		 *      oTable.$('tr', {"search": "applied"}).css('backgroundColor', 'blue');
		 *      oTable.fnFilter('');
		 *    } );
		 */
		this.$ = function ( sSelector, oOpts )
		{
			return this.api(true).$( sSelector, oOpts );
		};
		
		
		/**
		 * Almost identical to $ in operation, but in this case returns the data for the matched
		 * rows - as such, the jQuery selector used should match TR row nodes or TD/TH cell nodes
		 * rather than any descendants, so the data can be obtained for the row/cell. If matching
		 * rows are found, the data returned is the original data array/object that was used to
		 * create the row (or a generated array if from a DOM source).
		 *
		 * This method is often useful in-combination with $ where both functions are given the
		 * same parameters and the array indexes will match identically.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select elements that meet the current filter
		 *    criterion ("applied") or all elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the data in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {array} Data for the matched elements. If any elements, as a result of the
		 *    selector, were not TR, TD or TH elements in the DataTable, they will have a null
		 *    entry in the array.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the data from the first row in the table
		 *      var data = oTable._('tr:first');
		 *
		 *      // Do something useful with the data
		 *      alert( "First cell is: "+data[0] );
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to 'Webkit' and get all data for
		 *      oTable.fnFilter('Webkit');
		 *      var data = oTable._('tr', {"search": "applied"});
		 *
		 *      // Do something with the data
		 *      alert( data.length+" rows matched the search" );
		 *    } );
		 */
		this._ = function ( sSelector, oOpts )
		{
			return this.api(true).rows( sSelector, oOpts ).data();
		};
		
		
		/**
		 * Create a DataTables Api instance, with the currently selected tables for
		 * the Api's context.
		 * @param {boolean} [traditional=false] Set the API instance's context to be
		 *   only the table referred to by the `DataTable.ext.iApiIndex` option, as was
		 *   used in the API presented by DataTables 1.9- (i.e. the traditional mode),
		 *   or if all tables captured in the jQuery object should be used.
		 * @return {DataTables.Api}
		 */
		this.api = function ( traditional )
		{
			return traditional ?
				new _Api(
					_fnSettingsFromNode( this[ _ext.iApiIndex ] )
				) :
				new _Api( this );
		};
		
		
		/**
		 * Add a single new row or multiple rows of data to the table. Please note
		 * that this is suitable for client-side processing only - if you are using
		 * server-side processing (i.e. "bServerSide": true), then to add data, you
		 * must add it to the data source, i.e. the server-side, through an Ajax call.
		 *  @param {array|object} data The data to be added to the table. This can be:
		 *    <ul>
		 *      <li>1D array of data - add a single row with the data provided</li>
		 *      <li>2D array of arrays - add multiple rows in a single call</li>
		 *      <li>object - data object when using <i>mData</i></li>
		 *      <li>array of objects - multiple data objects when using <i>mData</i></li>
		 *    </ul>
		 *  @param {bool} [redraw=true] redraw the table or not
		 *  @returns {array} An array of integers, representing the list of indexes in
		 *    <i>aoData</i> ({@link DataTable.models.oSettings}) that have been added to
		 *    the table.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Global var for counter
		 *    var giCount = 2;
		 *
		 *    $(document).ready(function() {
		 *      $('#example').dataTable();
		 *    } );
		 *
		 *    function fnClickAddRow() {
		 *      $('#example').dataTable().fnAddData( [
		 *        giCount+".1",
		 *        giCount+".2",
		 *        giCount+".3",
		 *        giCount+".4" ]
		 *      );
		 *
		 *      giCount++;
		 *    }
		 */
		this.fnAddData = function( data, redraw )
		{
			var api = this.api( true );
		
			/* Check if we want to add multiple rows or not */
			var rows = Array.isArray(data) && ( Array.isArray(data[0]) || $.isPlainObject(data[0]) ) ?
				api.rows.add( data ) :
				api.row.add( data );
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return rows.flatten().toArray();
		};
		
		
		/**
		 * This function will make DataTables recalculate the column sizes, based on the data
		 * contained in the table and the sizes applied to the columns (in the DOM, CSS or
		 * through the sWidth parameter). This can be useful when the width of the table's
		 * parent element changes (for example a window resize).
		 *  @param {boolean} [bRedraw=true] Redraw the table or not, you will typically want to
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable( {
		 *        "sScrollY": "200px",
		 *        "bPaginate": false
		 *      } );
		 *
		 *      $(window).on('resize', function () {
		 *        oTable.fnAdjustColumnSizing();
		 *      } );
		 *    } );
		 */
		this.fnAdjustColumnSizing = function ( bRedraw )
		{
			var api = this.api( true ).columns.adjust();
			var settings = api.settings()[0];
			var scroll = settings.oScroll;
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw( false );
			}
			else if ( scroll.sX !== "" || scroll.sY !== "" ) {
				/* If not redrawing, but scrolling, we want to apply the new column sizes anyway */
				_fnScrollDraw( settings );
			}
		};
		
		
		/**
		 * Quickly and simply clear a table
		 *  @param {bool} [bRedraw=true] redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately 'nuke' the current rows (perhaps waiting for an Ajax callback...)
		 *      oTable.fnClearTable();
		 *    } );
		 */
		this.fnClearTable = function( bRedraw )
		{
			var api = this.api( true ).clear();
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
		};
		
		
		/**
		 * The exact opposite of 'opening' a row, this function will close any rows which
		 * are currently 'open'.
		 *  @param {node} nTr the table row to 'close'
		 *  @returns {int} 0 on success, or 1 if failed (can't find the row)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnClose = function( nTr )
		{
			this.api( true ).row( nTr ).child.hide();
		};
		
		
		/**
		 * Remove a row for the table
		 *  @param {mixed} target The index of the row from aoData to be deleted, or
		 *    the TR element you want to delete
		 *  @param {function|null} [callBack] Callback function
		 *  @param {bool} [redraw=true] Redraw the table or not
		 *  @returns {array} The row that was deleted
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately remove the first row
		 *      oTable.fnDeleteRow( 0 );
		 *    } );
		 */
		this.fnDeleteRow = function( target, callback, redraw )
		{
			var api = this.api( true );
			var rows = api.rows( target );
			var settings = rows.settings()[0];
			var data = settings.aoData[ rows[0][0] ];
		
			rows.remove();
		
			if ( callback ) {
				callback.call( this, settings, data );
			}
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return data;
		};
		
		
		/**
		 * Restore the table to it's original state in the DOM by removing all of DataTables
		 * enhancements, alterations to the DOM structure of the table and event listeners.
		 *  @param {boolean} [remove=false] Completely remove the table from the DOM
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      // This example is fairly pointless in reality, but shows how fnDestroy can be used
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnDestroy();
		 *    } );
		 */
		this.fnDestroy = function ( remove )
		{
			this.api( true ).destroy( remove );
		};
		
		
		/**
		 * Redraw the table
		 *  @param {bool} [complete=true] Re-filter and resort (if enabled) the table before the draw.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Re-draw the table - you wouldn't want to do it here, but it's an example :-)
		 *      oTable.fnDraw();
		 *    } );
		 */
		this.fnDraw = function( complete )
		{
			// Note that this isn't an exact match to the old call to _fnDraw - it takes
			// into account the new data, but can hold position.
			this.api( true ).draw( complete );
		};
		
		
		/**
		 * Filter the input based on data
		 *  @param {string} sInput String to filter the table on
		 *  @param {int|null} [iColumn] Column to limit filtering to
		 *  @param {bool} [bRegex=false] Treat as regular expression or not
		 *  @param {bool} [bSmart=true] Perform smart filtering or not
		 *  @param {bool} [bShowGlobal=true] Show the input global filter in it's input box(es)
		 *  @param {bool} [bCaseInsensitive=true] Do case-insensitive matching (true) or not (false)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sometime later - filter...
		 *      oTable.fnFilter( 'test string' );
		 *    } );
		 */
		this.fnFilter = function( sInput, iColumn, bRegex, bSmart, bShowGlobal, bCaseInsensitive )
		{
			var api = this.api( true );
		
			if ( iColumn === null || iColumn === undefined ) {
				api.search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
			else {
				api.column( iColumn ).search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
		
			api.draw();
		};
		
		
		/**
		 * Get the data for the whole table, an individual row or an individual cell based on the
		 * provided parameters.
		 *  @param {int|node} [src] A TR row node, TD/TH cell node or an integer. If given as
		 *    a TR node then the data source for the whole row will be returned. If given as a
		 *    TD/TH cell node then iCol will be automatically calculated and the data for the
		 *    cell returned. If given as an integer, then this is treated as the aoData internal
		 *    data index for the row (see fnGetPosition) and the data for that row used.
		 *  @param {int} [col] Optional column index that you want the data of.
		 *  @returns {array|object|string} If mRow is undefined, then the data for all rows is
		 *    returned. If mRow is defined, just data for that row, and is iCol is
		 *    defined, only data for the designated cell is returned.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Row data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('tr').click( function () {
		 *        var data = oTable.fnGetData( this );
		 *        // ... do something with the array / object of data for the row
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Individual cell data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('td').click( function () {
		 *        var sData = oTable.fnGetData( this );
		 *        alert( 'The cell clicked on had the value of '+sData );
		 *      } );
		 *    } );
		 */
		this.fnGetData = function( src, col )
		{
			var api = this.api( true );
		
			if ( src !== undefined ) {
				var type = src.nodeName ? src.nodeName.toLowerCase() : '';
		
				return col !== undefined || type == 'td' || type == 'th' ?
					api.cell( src, col ).data() :
					api.row( src ).data() || null;
			}
		
			return api.data().toArray();
		};
		
		
		/**
		 * Get an array of the TR nodes that are used in the table's body. Note that you will
		 * typically want to use the '$' API method in preference to this as it is more
		 * flexible.
		 *  @param {int} [iRow] Optional row index for the TR element you want
		 *  @returns {array|node} If iRow is undefined, returns an array of all TR elements
		 *    in the table's body, or iRow is defined, just the TR element requested.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the nodes from the table
		 *      var nNodes = oTable.fnGetNodes( );
		 *    } );
		 */
		this.fnGetNodes = function( iRow )
		{
			var api = this.api( true );
		
			return iRow !== undefined ?
				api.row( iRow ).node() :
				api.rows().nodes().flatten().toArray();
		};
		
		
		/**
		 * Get the array indexes of a particular cell from it's DOM element
		 * and column index including hidden columns
		 *  @param {node} node this can either be a TR, TD or TH in the table's body
		 *  @returns {int} If nNode is given as a TR, then a single index is returned, or
		 *    if given as a cell, an array of [row index, column index (visible),
		 *    column index (all)] is given.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      $('#example tbody td').click( function () {
		 *        // Get the position of the current data from the node
		 *        var aPos = oTable.fnGetPosition( this );
		 *
		 *        // Get the data array for this row
		 *        var aData = oTable.fnGetData( aPos[0] );
		 *
		 *        // Update the data array and return the value
		 *        aData[ aPos[1] ] = 'clicked';
		 *        this.innerHTML = 'clicked';
		 *      } );
		 *
		 *      // Init DataTables
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnGetPosition = function( node )
		{
			var api = this.api( true );
			var nodeName = node.nodeName.toUpperCase();
		
			if ( nodeName == 'TR' ) {
				return api.row( node ).index();
			}
			else if ( nodeName == 'TD' || nodeName == 'TH' ) {
				var cell = api.cell( node ).index();
		
				return [
					cell.row,
					cell.columnVisible,
					cell.column
				];
			}
			return null;
		};
		
		
		/**
		 * Check to see if a row is 'open' or not.
		 *  @param {node} nTr the table row to check
		 *  @returns {boolean} true if the row is currently open, false otherwise
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnIsOpen = function( nTr )
		{
			return this.api( true ).row( nTr ).child.isShown();
		};
		
		
		/**
		 * This function will place a new row directly after a row which is currently
		 * on display on the page, with the HTML contents that is passed into the
		 * function. This can be used, for example, to ask for confirmation that a
		 * particular record should be deleted.
		 *  @param {node} nTr The table row to 'open'
		 *  @param {string|node|jQuery} mHtml The HTML to put into the row
		 *  @param {string} sClass Class to give the new TD cell
		 *  @returns {node} The row opened. Note that if the table row passed in as the
		 *    first parameter, is not found in the table, this method will silently
		 *    return.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnOpen = function( nTr, mHtml, sClass )
		{
			return this.api( true )
				.row( nTr )
				.child( mHtml, sClass )
				.show()
				.child()[0];
		};
		
		
		/**
		 * Change the pagination - provides the internal logic for pagination in a simple API
		 * function. With this function you can have a DataTables table go to the next,
		 * previous, first or last pages.
		 *  @param {string|int} mAction Paging action to take: "first", "previous", "next" or "last"
		 *    or page number to jump to (integer), note that page 0 is the first page.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnPageChange( 'next' );
		 *    } );
		 */
		this.fnPageChange = function ( mAction, bRedraw )
		{
			var api = this.api( true ).page( mAction );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw(false);
			}
		};
		
		
		/**
		 * Show a particular column
		 *  @param {int} iCol The column whose display should be changed
		 *  @param {bool} bShow Show (true) or hide (false) the column
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Hide the second column after initialisation
		 *      oTable.fnSetColumnVis( 1, false );
		 *    } );
		 */
		this.fnSetColumnVis = function ( iCol, bShow, bRedraw )
		{
			var api = this.api( true ).column( iCol ).visible( bShow );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.columns.adjust().draw();
			}
		};
		
		
		/**
		 * Get the settings for a particular table for external manipulation
		 *  @returns {object} DataTables settings object. See
		 *    {@link DataTable.models.oSettings}
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      var oSettings = oTable.fnSettings();
		 *
		 *      // Show an example parameter from the settings
		 *      alert( oSettings._iDisplayStart );
		 *    } );
		 */
		this.fnSettings = function()
		{
			return _fnSettingsFromNode( this[_ext.iApiIndex] );
		};
		
		
		/**
		 * Sort the table by a particular column
		 *  @param {int} iCol the data index to sort on. Note that this will not match the
		 *    'display index' if you have hidden data entries
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort immediately with columns 0 and 1
		 *      oTable.fnSort( [ [0,'asc'], [1,'asc'] ] );
		 *    } );
		 */
		this.fnSort = function( aaSort )
		{
			this.api( true ).order( aaSort ).draw();
		};
		
		
		/**
		 * Attach a sort listener to an element for a given column
		 *  @param {node} nNode the element to attach the sort listener to
		 *  @param {int} iColumn the column that a click on this node will sort on
		 *  @param {function} [fnCallback] callback function when sort is run
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort on column 1, when 'sorter' is clicked on
		 *      oTable.fnSortListener( document.getElementById('sorter'), 1 );
		 *    } );
		 */
		this.fnSortListener = function( nNode, iColumn, fnCallback )
		{
			this.api( true ).order.listener( nNode, iColumn, fnCallback );
		};
		
		
		/**
		 * Update a table cell or row - this method will accept either a single value to
		 * update the cell with, an array of values with one element for each column or
		 * an object in the same format as the original data source. The function is
		 * self-referencing in order to make the multi column updates easier.
		 *  @param {object|array|string} mData Data to update the cell/row with
		 *  @param {node|int} mRow TR element you want to update or the aoData index
		 *  @param {int} [iColumn] The column to update, give as null or undefined to
		 *    update a whole row.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @param {bool} [bAction=true] Perform pre-draw actions or not
		 *  @returns {int} 0 on success, 1 on error
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnUpdate( 'Example update', 0, 0 ); // Single cell
		 *      oTable.fnUpdate( ['a', 'b', 'c', 'd', 'e'], $('tbody tr')[0] ); // Row
		 *    } );
		 */
		this.fnUpdate = function( mData, mRow, iColumn, bRedraw, bAction )
		{
			var api = this.api( true );
		
			if ( iColumn === undefined || iColumn === null ) {
				api.row( mRow ).data( mData );
			}
			else {
				api.cell( mRow, iColumn ).data( mData );
			}
		
			if ( bAction === undefined || bAction ) {
				api.columns.adjust();
			}
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
			return 0;
		};
		
		
		/**
		 * Provide a common method for plug-ins to check the version of DataTables being used, in order
		 * to ensure compatibility.
		 *  @param {string} sVersion Version string to check for, in the format "X.Y.Z". Note that the
		 *    formats "X" and "X.Y" are also acceptable.
		 *  @returns {boolean} true if this version of DataTables is greater or equal to the required
		 *    version, or false if this version of DataTales is not suitable
		 *  @method
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      alert( oTable.fnVersionCheck( '1.9.0' ) );
		 *    } );
		 */
		this.fnVersionCheck = _ext.fnVersionCheck;
		

		var _that = this;
		var emptyInit = options === undefined;
		var len = this.length;

		if ( emptyInit ) {
			options = {};
		}

		this.oApi = this.internal = _ext.internal;

		// Extend with old style plug-in API methods
		for ( var fn in DataTable.ext.internal ) {
			if ( fn ) {
				this[fn] = _fnExternApiFunc(fn);
			}
		}

		this.each(function() {
			// For each initialisation we want to give it a clean initialisation
			// object that can be bashed around
			var o = {};
			var oInit = len > 1 ? // optimisation for single table case
				_fnExtend( o, options, true ) :
				options;

			/*global oInit,_that,emptyInit*/
			var i=0, iLen, j, jLen, k, kLen;
			var sId = this.getAttribute( 'id' );
			var bInitHandedOff = false;
			var defaults = DataTable.defaults;
			var $this = $(this);
			
			
			/* Sanity check */
			if ( this.nodeName.toLowerCase() != 'table' )
			{
				_fnLog( null, 0, 'Non-table node initialisation ('+this.nodeName+')', 2 );
				return;
			}
			
			/* Backwards compatibility for the defaults */
			_fnCompatOpts( defaults );
			_fnCompatCols( defaults.column );
			
			/* Convert the camel-case defaults to Hungarian */
			_fnCamelToHungarian( defaults, defaults, true );
			_fnCamelToHungarian( defaults.column, defaults.column, true );
			
			/* Setting up the initialisation object */
			_fnCamelToHungarian( defaults, $.extend( oInit, $this.data() ), true );
			
			
			
			/* Check to see if we are re-initialising a table */
			var allSettings = DataTable.settings;
			for ( i=0, iLen=allSettings.length ; i<iLen ; i++ )
			{
				var s = allSettings[i];
			
				/* Base check on table node */
				if (
					s.nTable == this ||
					(s.nTHead && s.nTHead.parentNode == this) ||
					(s.nTFoot && s.nTFoot.parentNode == this)
				) {
					var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve;
					var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy;
			
					if ( emptyInit || bRetrieve )
					{
						return s.oInstance;
					}
					else if ( bDestroy )
					{
						s.oInstance.fnDestroy();
						break;
					}
					else
					{
						_fnLog( s, 0, 'Cannot reinitialise DataTable', 3 );
						return;
					}
				}
			
				/* If the element we are initialising has the same ID as a table which was previously
				 * initialised, but the table nodes don't match (from before) then we destroy the old
				 * instance by simply deleting it. This is under the assumption that the table has been
				 * destroyed by other methods. Anyone using non-id selectors will need to do this manually
				 */
				if ( s.sTableId == this.id )
				{
					allSettings.splice( i, 1 );
					break;
				}
			}
			
			/* Ensure the table has an ID - required for accessibility */
			if ( sId === null || sId === "" )
			{
				sId = "DataTables_Table_"+(DataTable.ext._unique++);
				this.id = sId;
			}
			
			/* Create the settings object for this table and set some of the default parameters */
			var oSettings = $.extend( true, {}, DataTable.models.oSettings, {
				"sDestroyWidth": $this[0].style.width,
				"sInstance":     sId,
				"sTableId":      sId
			} );
			oSettings.nTable = this;
			oSettings.oApi   = _that.internal;
			oSettings.oInit  = oInit;
			
			allSettings.push( oSettings );
			
			// Need to add the instance after the instance after the settings object has been added
			// to the settings array, so we can self reference the table instance if more than one
			oSettings.oInstance = (_that.length===1) ? _that : $this.dataTable();
			
			// Backwards compatibility, before we apply all the defaults
			_fnCompatOpts( oInit );
			_fnLanguageCompat( oInit.oLanguage );
			
			// If the length menu is given, but the init display length is not, use the length menu
			if ( oInit.aLengthMenu && ! oInit.iDisplayLength )
			{
				oInit.iDisplayLength = Array.isArray( oInit.aLengthMenu[0] ) ?
					oInit.aLengthMenu[0][0] : oInit.aLengthMenu[0];
			}
			
			// Apply the defaults and init options to make a single init object will all
			// options defined from defaults and instance options.
			oInit = _fnExtend( $.extend( true, {}, defaults ), oInit );
			
			
			// Map the initialisation options onto the settings object
			_fnMap( oSettings.oFeatures, oInit, [
				"bPaginate",
				"bLengthChange",
				"bFilter",
				"bSort",
				"bSortMulti",
				"bInfo",
				"bProcessing",
				"bAutoWidth",
				"bSortClasses",
				"bServerSide",
				"bDeferRender"
			] );
			_fnMap( oSettings, oInit, [
				"asStripeClasses",
				"ajax",
				"fnServerData",
				"fnFormatNumber",
				"sServerMethod",
				"aaSorting",
				"aaSortingFixed",
				"aLengthMenu",
				"sPaginationType",
				"sAjaxSource",
				"sAjaxDataProp",
				"iStateDuration",
				"sDom",
				"bSortCellsTop",
				"iTabIndex",
				"fnStateLoadCallback",
				"fnStateSaveCallback",
				"renderer",
				"searchDelay",
				"rowId",
				[ "iCookieDuration", "iStateDuration" ], // backwards compat
				[ "oSearch", "oPreviousSearch" ],
				[ "aoSearchCols", "aoPreSearchCols" ],
				[ "iDisplayLength", "_iDisplayLength" ]
			] );
			_fnMap( oSettings.oScroll, oInit, [
				[ "sScrollX", "sX" ],
				[ "sScrollXInner", "sXInner" ],
				[ "sScrollY", "sY" ],
				[ "bScrollCollapse", "bCollapse" ]
			] );
			_fnMap( oSettings.oLanguage, oInit, "fnInfoCallback" );
			
			/* Callback functions which are array driven */
			_fnCallbackReg( oSettings, 'aoDrawCallback',       oInit.fnDrawCallback,      'user' );
			_fnCallbackReg( oSettings, 'aoServerParams',       oInit.fnServerParams,      'user' );
			_fnCallbackReg( oSettings, 'aoStateSaveParams',    oInit.fnStateSaveParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoadParams',    oInit.fnStateLoadParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoaded',        oInit.fnStateLoaded,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCallback',        oInit.fnRowCallback,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCreatedCallback', oInit.fnCreatedRow,        'user' );
			_fnCallbackReg( oSettings, 'aoHeaderCallback',     oInit.fnHeaderCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoFooterCallback',     oInit.fnFooterCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoInitComplete',       oInit.fnInitComplete,      'user' );
			_fnCallbackReg( oSettings, 'aoPreDrawCallback',    oInit.fnPreDrawCallback,   'user' );
			
			oSettings.rowIdFn = _fnGetObjectDataFn( oInit.rowId );
			
			/* Browser support detection */
			_fnBrowserDetect( oSettings );
			
			var oClasses = oSettings.oClasses;
			
			$.extend( oClasses, DataTable.ext.classes, oInit.oClasses );
			$this.addClass( oClasses.sTable );
			
			
			if ( oSettings.iInitDisplayStart === undefined )
			{
				/* Display start point, taking into account the save saving */
				oSettings.iInitDisplayStart = oInit.iDisplayStart;
				oSettings._iDisplayStart = oInit.iDisplayStart;
			}
			
			if ( oInit.iDeferLoading !== null )
			{
				oSettings.bDeferLoading = true;
				var tmp = Array.isArray( oInit.iDeferLoading );
				oSettings._iRecordsDisplay = tmp ? oInit.iDeferLoading[0] : oInit.iDeferLoading;
				oSettings._iRecordsTotal = tmp ? oInit.iDeferLoading[1] : oInit.iDeferLoading;
			}
			
			/* Language definitions */
			var oLanguage = oSettings.oLanguage;
			$.extend( true, oLanguage, oInit.oLanguage );
			
			if ( oLanguage.sUrl )
			{
				/* Get the language definitions from a file - because this Ajax call makes the language
				 * get async to the remainder of this function we use bInitHandedOff to indicate that
				 * _fnInitialise will be fired by the returned Ajax handler, rather than the constructor
				 */
				$.ajax( {
					dataType: 'json',
					url: oLanguage.sUrl,
					success: function ( json ) {
						_fnLanguageCompat( json );
						_fnCamelToHungarian( defaults.oLanguage, json );
						$.extend( true, oLanguage, json );
						_fnInitialise( oSettings );
					},
					error: function () {
						// Error occurred loading language file, continue on as best we can
						_fnInitialise( oSettings );
					}
				} );
				bInitHandedOff = true;
			}
			
			/*
			 * Stripes
			 */
			if ( oInit.asStripeClasses === null )
			{
				oSettings.asStripeClasses =[
					oClasses.sStripeOdd,
					oClasses.sStripeEven
				];
			}
			
			/* Remove row stripe classes if they are already on the table row */
			var stripeClasses = oSettings.asStripeClasses;
			var rowOne = $this.children('tbody').find('tr').eq(0);
			if ( $.inArray( true, $.map( stripeClasses, function(el, i) {
				return rowOne.hasClass(el);
			} ) ) !== -1 ) {
				$('tbody tr', this).removeClass( stripeClasses.join(' ') );
				oSettings.asDestroyStripes = stripeClasses.slice();
			}
			
			/*
			 * Columns
			 * See if we should load columns automatically or use defined ones
			 */
			var anThs = [];
			var aoColumnsInit;
			var nThead = this.getElementsByTagName('thead');
			if ( nThead.length !== 0 )
			{
				_fnDetectHeader( oSettings.aoHeader, nThead[0] );
				anThs = _fnGetUniqueThs( oSettings );
			}
			
			/* If not given a column array, generate one with nulls */
			if ( oInit.aoColumns === null )
			{
				aoColumnsInit = [];
				for ( i=0, iLen=anThs.length ; i<iLen ; i++ )
				{
					aoColumnsInit.push( null );
				}
			}
			else
			{
				aoColumnsInit = oInit.aoColumns;
			}
			
			/* Add the columns */
			for ( i=0, iLen=aoColumnsInit.length ; i<iLen ; i++ )
			{
				_fnAddColumn( oSettings, anThs ? anThs[i] : null );
			}
			
			/* Apply the column definitions */
			_fnApplyColumnDefs( oSettings, oInit.aoColumnDefs, aoColumnsInit, function (iCol, oDef) {
				_fnColumnOptions( oSettings, iCol, oDef );
			} );
			
			/* HTML5 attribute detection - build an mData object automatically if the
			 * attributes are found
			 */
			if ( rowOne.length ) {
				var a = function ( cell, name ) {
					return cell.getAttribute( 'data-'+name ) !== null ? name : null;
				};
			
				$( rowOne[0] ).children('th, td').each( function (i, cell) {
					var col = oSettings.aoColumns[i];
			
					if ( col.mData === i ) {
						var sort = a( cell, 'sort' ) || a( cell, 'order' );
						var filter = a( cell, 'filter' ) || a( cell, 'search' );
			
						if ( sort !== null || filter !== null ) {
							col.mData = {
								_:      i+'.display',
								sort:   sort !== null   ? i+'.@data-'+sort   : undefined,
								type:   sort !== null   ? i+'.@data-'+sort   : undefined,
								filter: filter !== null ? i+'.@data-'+filter : undefined
							};
			
							_fnColumnOptions( oSettings, i );
						}
					}
				} );
			}
			
			var features = oSettings.oFeatures;
			var loadedInit = function () {
				/*
				 * Sorting
				 * @todo For modularisation (1.11) this needs to do into a sort start up handler
				 */
			
				// If aaSorting is not defined, then we use the first indicator in asSorting
				// in case that has been altered, so the default sort reflects that option
				if ( oInit.aaSorting === undefined ) {
					var sorting = oSettings.aaSorting;
					for ( i=0, iLen=sorting.length ; i<iLen ; i++ ) {
						sorting[i][1] = oSettings.aoColumns[ i ].asSorting[0];
					}
				}
			
				/* Do a first pass on the sorting classes (allows any size changes to be taken into
				 * account, and also will apply sorting disabled classes if disabled
				 */
				_fnSortingClasses( oSettings );
			
				if ( features.bSort ) {
					_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
						if ( oSettings.bSorted ) {
							var aSort = _fnSortFlatten( oSettings );
							var sortedColumns = {};
			
							$.each( aSort, function (i, val) {
								sortedColumns[ val.src ] = val.dir;
							} );
			
							_fnCallbackFire( oSettings, null, 'order', [oSettings, aSort, sortedColumns] );
							_fnSortAria( oSettings );
						}
					} );
				}
			
				_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
					if ( oSettings.bSorted || _fnDataSource( oSettings ) === 'ssp' || features.bDeferRender ) {
						_fnSortingClasses( oSettings );
					}
				}, 'sc' );
			
			
				/*
				 * Final init
				 * Cache the header, body and footer as required, creating them if needed
				 */
			
				// Work around for Webkit bug 83867 - store the caption-side before removing from doc
				var captions = $this.children('caption').each( function () {
					this._captionSide = $(this).css('caption-side');
				} );
			
				var thead = $this.children('thead');
				if ( thead.length === 0 ) {
					thead = $('<thead/>').appendTo($this);
				}
				oSettings.nTHead = thead[0];
			
				var tbody = $this.children('tbody');
				if ( tbody.length === 0 ) {
					tbody = $('<tbody/>').appendTo($this);
				}
				oSettings.nTBody = tbody[0];
			
				var tfoot = $this.children('tfoot');
				if ( tfoot.length === 0 && captions.length > 0 && (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "") ) {
					// If we are a scrolling table, and no footer has been given, then we need to create
					// a tfoot element for the caption element to be appended to
					tfoot = $('<tfoot/>').appendTo($this);
				}
			
				if ( tfoot.length === 0 || tfoot.children().length === 0 ) {
					$this.addClass( oClasses.sNoFooter );
				}
				else if ( tfoot.length > 0 ) {
					oSettings.nTFoot = tfoot[0];
					_fnDetectHeader( oSettings.aoFooter, oSettings.nTFoot );
				}
			
				/* Check if there is data passing into the constructor */
				if ( oInit.aaData ) {
					for ( i=0 ; i<oInit.aaData.length ; i++ ) {
						_fnAddData( oSettings, oInit.aaData[ i ] );
					}
				}
				else if ( oSettings.bDeferLoading || _fnDataSource( oSettings ) == 'dom' ) {
					/* Grab the data from the page - only do this when deferred loading or no Ajax
					 * source since there is no point in reading the DOM data if we are then going
					 * to replace it with Ajax data
					 */
					_fnAddTr( oSettings, $(oSettings.nTBody).children('tr') );
				}
			
				/* Copy the data index array */
				oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
			
				/* Initialisation complete - table can be drawn */
				oSettings.bInitialised = true;
			
				/* Check if we need to initialise the table (it might not have been handed off to the
				 * language processor)
				 */
				if ( bInitHandedOff === false ) {
					_fnInitialise( oSettings );
				}
			};
			
			/* Must be done after everything which can be overridden by the state saving! */
			if ( oInit.bStateSave )
			{
				features.bStateSave = true;
				_fnCallbackReg( oSettings, 'aoDrawCallback', _fnSaveState, 'state_save' );
				_fnLoadState( oSettings, oInit, loadedInit );
			}
			else {
				loadedInit();
			}
			
		} );
		_that = null;
		return this;
	};

	
	/*
	 * It is useful to have variables which are scoped locally so only the
	 * DataTables functions can access them and they don't leak into global space.
	 * At the same time these functions are often useful over multiple files in the
	 * core and API, so we list, or at least document, all variables which are used
	 * by DataTables as private variables here. This also ensures that there is no
	 * clashing of variable names and that they can easily referenced for reuse.
	 */
	
	
	// Defined else where
	//  _selector_run
	//  _selector_opts
	//  _selector_first
	//  _selector_row_indexes
	
	var _ext; // DataTable.ext
	var _Api; // DataTable.Api
	var _api_register; // DataTable.Api.register
	var _api_registerPlural; // DataTable.Api.registerPlural
	
	var _re_dic = {};
	var _re_new_lines = /[\r\n\u2028]/g;
	var _re_html = /<.*?>/g;
	
	// This is not strict ISO8601 - Date.parse() is quite lax, although
	// implementations differ between browsers.
	var _re_date = /^\d{2,4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,2}([T ]{1}\d{1,2}[:\.]\d{2}([\.:]\d{2})?)?$/;
	
	// Escape regular expression special characters
	var _re_escape_regex = new RegExp( '(\\' + [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-' ].join('|\\') + ')', 'g' );
	
	// http://en.wikipedia.org/wiki/Foreign_exchange_market
	// - \u20BD - Russian ruble.
	// - \u20a9 - South Korean Won
	// - \u20BA - Turkish Lira
	// - \u20B9 - Indian Rupee
	// - R - Brazil (R$) and South Africa
	// - fr - Swiss Franc
	// - kr - Swedish krona, Norwegian krone and Danish krone
	// - \u2009 is thin space and \u202F is narrow no-break space, both used in many
	// - Ƀ - Bitcoin
	// - Ξ - Ethereum
	//   standards as thousands separators.
	var _re_formatted_numeric = /['\u00A0,$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfkɃΞ]/gi;
	
	
	var _empty = function ( d ) {
		return !d || d === true || d === '-' ? true : false;
	};
	
	
	var _intVal = function ( s ) {
		var integer = parseInt( s, 10 );
		return !isNaN(integer) && isFinite(s) ? integer : null;
	};
	
	// Convert from a formatted number with characters other than `.` as the
	// decimal place, to a Javascript number
	var _numToDecimal = function ( num, decimalPoint ) {
		// Cache created regular expressions for speed as this function is called often
		if ( ! _re_dic[ decimalPoint ] ) {
			_re_dic[ decimalPoint ] = new RegExp( _fnEscapeRegex( decimalPoint ), 'g' );
		}
		return typeof num === 'string' && decimalPoint !== '.' ?
			num.replace( /\./g, '' ).replace( _re_dic[ decimalPoint ], '.' ) :
			num;
	};
	
	
	var _isNumber = function ( d, decimalPoint, formatted ) {
		var strType = typeof d === 'string';
	
		// If empty return immediately so there must be a number if it is a
		// formatted string (this stops the string "k", or "kr", etc being detected
		// as a formatted number for currency
		if ( _empty( d ) ) {
			return true;
		}
	
		if ( decimalPoint && strType ) {
			d = _numToDecimal( d, decimalPoint );
		}
	
		if ( formatted && strType ) {
			d = d.replace( _re_formatted_numeric, '' );
		}
	
		return !isNaN( parseFloat(d) ) && isFinite( d );
	};
	
	
	// A string without HTML in it can be considered to be HTML still
	var _isHtml = function ( d ) {
		return _empty( d ) || typeof d === 'string';
	};
	
	
	var _htmlNumeric = function ( d, decimalPoint, formatted ) {
		if ( _empty( d ) ) {
			return true;
		}
	
		var html = _isHtml( d );
		return ! html ?
			null :
			_isNumber( _stripHtml( d ), decimalPoint, formatted ) ?
				true :
				null;
	};
	
	
	var _pluck = function ( a, prop, prop2 ) {
		var out = [];
		var i=0, ien=a.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[i] && a[i][ prop ] ) {
					out.push( a[i][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				if ( a[i] ) {
					out.push( a[i][ prop ] );
				}
			}
		}
	
		return out;
	};
	
	
	// Basically the same as _pluck, but rather than looping over `a` we use `order`
	// as the indexes to pick from `a`
	var _pluck_order = function ( a, order, prop, prop2 )
	{
		var out = [];
		var i=0, ien=order.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[ order[i] ][ prop ] ) {
					out.push( a[ order[i] ][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				out.push( a[ order[i] ][ prop ] );
			}
		}
	
		return out;
	};
	
	
	var _range = function ( len, start )
	{
		var out = [];
		var end;
	
		if ( start === undefined ) {
			start = 0;
			end = len;
		}
		else {
			end = start;
			start = len;
		}
	
		for ( var i=start ; i<end ; i++ ) {
			out.push( i );
		}
	
		return out;
	};
	
	
	var _removeEmpty = function ( a )
	{
		var out = [];
	
		for ( var i=0, ien=a.length ; i<ien ; i++ ) {
			if ( a[i] ) { // careful - will remove all falsy values!
				out.push( a[i] );
			}
		}
	
		return out;
	};
	
	
	var _stripHtml = function ( d ) {
		return d.replace( _re_html, '' );
	};
	
	
	/**
	 * Determine if all values in the array are unique. This means we can short
	 * cut the _unique method at the cost of a single loop. A sorted array is used
	 * to easily check the values.
	 *
	 * @param  {array} src Source array
	 * @return {boolean} true if all unique, false otherwise
	 * @ignore
	 */
	var _areAllUnique = function ( src ) {
		if ( src.length < 2 ) {
			return true;
		}
	
		var sorted = src.slice().sort();
		var last = sorted[0];
	
		for ( var i=1, ien=sorted.length ; i<ien ; i++ ) {
			if ( sorted[i] === last ) {
				return false;
			}
	
			last = sorted[i];
		}
	
		return true;
	};
	
	
	/**
	 * Find the unique elements in a source array.
	 *
	 * @param  {array} src Source array
	 * @return {array} Array of unique items
	 * @ignore
	 */
	var _unique = function ( src )
	{
		if ( _areAllUnique( src ) ) {
			return src.slice();
		}
	
		// A faster unique method is to use object keys to identify used values,
		// but this doesn't work with arrays or objects, which we must also
		// consider. See jsperf.com/compare-array-unique-versions/4 for more
		// information.
		var
			out = [],
			val,
			i, ien=src.length,
			j, k=0;
	
		again: for ( i=0 ; i<ien ; i++ ) {
			val = src[i];
	
			for ( j=0 ; j<k ; j++ ) {
				if ( out[j] === val ) {
					continue again;
				}
			}
	
			out.push( val );
			k++;
		}
	
		return out;
	};
	
	// Surprisingly this is faster than [].concat.apply
	// https://jsperf.com/flatten-an-array-loop-vs-reduce/2
	var _flatten = function (out, val) {
		if (Array.isArray(val)) {
			for (var i=0 ; i<val.length ; i++) {
				_flatten(out, val[i]);
			}
		}
		else {
			out.push(val);
		}
	  
		return out;
	}
	
	// Array.isArray polyfill.
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
	if (! Array.isArray) {
	    Array.isArray = function(arg) {
	        return Object.prototype.toString.call(arg) === '[object Array]';
	    };
	}
	
	// .trim() polyfill
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
	if (!String.prototype.trim) {
	  String.prototype.trim = function () {
	    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	  };
	}
	
	/**
	 * DataTables utility methods
	 * 
	 * This namespace provides helper methods that DataTables uses internally to
	 * create a DataTable, but which are not exclusively used only for DataTables.
	 * These methods can be used by extension authors to save the duplication of
	 * code.
	 *
	 *  @namespace
	 */
	DataTable.util = {
		/**
		 * Throttle the calls to a function. Arguments and context are maintained
		 * for the throttled function.
		 *
		 * @param {function} fn Function to be called
		 * @param {integer} freq Call frequency in mS
		 * @return {function} Wrapped function
		 */
		throttle: function ( fn, freq ) {
			var
				frequency = freq !== undefined ? freq : 200,
				last,
				timer;
	
			return function () {
				var
					that = this,
					now  = +new Date(),
					args = arguments;
	
				if ( last && now < last + frequency ) {
					clearTimeout( timer );
	
					timer = setTimeout( function () {
						last = undefined;
						fn.apply( that, args );
					}, frequency );
				}
				else {
					last = now;
					fn.apply( that, args );
				}
			};
		},
	
	
		/**
		 * Escape a string such that it can be used in a regular expression
		 *
		 *  @param {string} val string to escape
		 *  @returns {string} escaped string
		 */
		escapeRegex: function ( val ) {
			return val.replace( _re_escape_regex, '\\$1' );
		}
	};
	
	
	
	/**
	 * Create a mapping object that allows camel case parameters to be looked up
	 * for their Hungarian counterparts. The mapping is stored in a private
	 * parameter called `_hungarianMap` which can be accessed on the source object.
	 *  @param {object} o
	 *  @memberof DataTable#oApi
	 */
	function _fnHungarianMap ( o )
	{
		var
			hungarian = 'a aa ai ao as b fn i m o s ',
			match,
			newKey,
			map = {};
	
		$.each( o, function (key, val) {
			match = key.match(/^([^A-Z]+?)([A-Z])/);
	
			if ( match && hungarian.indexOf(match[1]+' ') !== -1 )
			{
				newKey = key.replace( match[0], match[2].toLowerCase() );
				map[ newKey ] = key;
	
				if ( match[1] === 'o' )
				{
					_fnHungarianMap( o[key] );
				}
			}
		} );
	
		o._hungarianMap = map;
	}
	
	
	/**
	 * Convert from camel case parameters to Hungarian, based on a Hungarian map
	 * created by _fnHungarianMap.
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 *  @memberof DataTable#oApi
	 */
	function _fnCamelToHungarian ( src, user, force )
	{
		if ( ! src._hungarianMap ) {
			_fnHungarianMap( src );
		}
	
		var hungarianKey;
	
		$.each( user, function (key, val) {
			hungarianKey = src._hungarianMap[ key ];
	
			if ( hungarianKey !== undefined && (force || user[hungarianKey] === undefined) )
			{
				// For objects, we need to buzz down into the object to copy parameters
				if ( hungarianKey.charAt(0) === 'o' )
				{
					// Copy the camelCase options over to the hungarian
					if ( ! user[ hungarianKey ] ) {
						user[ hungarianKey ] = {};
					}
					$.extend( true, user[hungarianKey], user[key] );
	
					_fnCamelToHungarian( src[hungarianKey], user[hungarianKey], force );
				}
				else {
					user[hungarianKey] = user[ key ];
				}
			}
		} );
	}
	
	
	/**
	 * Language compatibility - when certain options are given, and others aren't, we
	 * need to duplicate the values over, in order to provide backwards compatibility
	 * with older language files.
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnLanguageCompat( lang )
	{
		// Note the use of the Hungarian notation for the parameters in this method as
		// this is called after the mapping of camelCase to Hungarian
		var defaults = DataTable.defaults.oLanguage;
	
		// Default mapping
		var defaultDecimal = defaults.sDecimal;
		if ( defaultDecimal ) {
			_addNumericSort( defaultDecimal );
		}
	
		if ( lang ) {
			var zeroRecords = lang.sZeroRecords;
	
			// Backwards compatibility - if there is no sEmptyTable given, then use the same as
			// sZeroRecords - assuming that is given.
			if ( ! lang.sEmptyTable && zeroRecords &&
				defaults.sEmptyTable === "No data available in table" )
			{
				_fnMap( lang, lang, 'sZeroRecords', 'sEmptyTable' );
			}
	
			// Likewise with loading records
			if ( ! lang.sLoadingRecords && zeroRecords &&
				defaults.sLoadingRecords === "Loading..." )
			{
				_fnMap( lang, lang, 'sZeroRecords', 'sLoadingRecords' );
			}
	
			// Old parameter name of the thousands separator mapped onto the new
			if ( lang.sInfoThousands ) {
				lang.sThousands = lang.sInfoThousands;
			}
	
			var decimal = lang.sDecimal;
			if ( decimal && defaultDecimal !== decimal ) {
				_addNumericSort( decimal );
			}
		}
	}
	
	
	/**
	 * Map one parameter onto another
	 *  @param {object} o Object to map
	 *  @param {*} knew The new parameter name
	 *  @param {*} old The old parameter name
	 */
	var _fnCompatMap = function ( o, knew, old ) {
		if ( o[ knew ] !== undefined ) {
			o[ old ] = o[ knew ];
		}
	};
	
	
	/**
	 * Provide backwards compatibility for the main DT options. Note that the new
	 * options are mapped onto the old parameters, so this is an external interface
	 * change only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatOpts ( init )
	{
		_fnCompatMap( init, 'ordering',      'bSort' );
		_fnCompatMap( init, 'orderMulti',    'bSortMulti' );
		_fnCompatMap( init, 'orderClasses',  'bSortClasses' );
		_fnCompatMap( init, 'orderCellsTop', 'bSortCellsTop' );
		_fnCompatMap( init, 'order',         'aaSorting' );
		_fnCompatMap( init, 'orderFixed',    'aaSortingFixed' );
		_fnCompatMap( init, 'paging',        'bPaginate' );
		_fnCompatMap( init, 'pagingType',    'sPaginationType' );
		_fnCompatMap( init, 'pageLength',    'iDisplayLength' );
		_fnCompatMap( init, 'searching',     'bFilter' );
	
		// Boolean initialisation of x-scrolling
		if ( typeof init.sScrollX === 'boolean' ) {
			init.sScrollX = init.sScrollX ? '100%' : '';
		}
		if ( typeof init.scrollX === 'boolean' ) {
			init.scrollX = init.scrollX ? '100%' : '';
		}
	
		// Column search objects are in an array, so it needs to be converted
		// element by element
		var searchCols = init.aoSearchCols;
	
		if ( searchCols ) {
			for ( var i=0, ien=searchCols.length ; i<ien ; i++ ) {
				if ( searchCols[i] ) {
					_fnCamelToHungarian( DataTable.models.oSearch, searchCols[i] );
				}
			}
		}
	}
	
	
	/**
	 * Provide backwards compatibility for column options. Note that the new options
	 * are mapped onto the old parameters, so this is an external interface change
	 * only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatCols ( init )
	{
		_fnCompatMap( init, 'orderable',     'bSortable' );
		_fnCompatMap( init, 'orderData',     'aDataSort' );
		_fnCompatMap( init, 'orderSequence', 'asSorting' );
		_fnCompatMap( init, 'orderDataType', 'sortDataType' );
	
		// orderData can be given as an integer
		var dataSort = init.aDataSort;
		if ( typeof dataSort === 'number' && ! Array.isArray( dataSort ) ) {
			init.aDataSort = [ dataSort ];
		}
	}
	
	
	/**
	 * Browser feature detection for capabilities, quirks
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBrowserDetect( settings )
	{
		// We don't need to do this every time DataTables is constructed, the values
		// calculated are specific to the browser and OS configuration which we
		// don't expect to change between initialisations
		if ( ! DataTable.__browser ) {
			var browser = {};
			DataTable.__browser = browser;
	
			// Scrolling feature / quirks detection
			var n = $('<div/>')
				.css( {
					position: 'fixed',
					top: 0,
					left: $(window).scrollLeft()*-1, // allow for scrolling
					height: 1,
					width: 1,
					overflow: 'hidden'
				} )
				.append(
					$('<div/>')
						.css( {
							position: 'absolute',
							top: 1,
							left: 1,
							width: 100,
							overflow: 'scroll'
						} )
						.append(
							$('<div/>')
								.css( {
									width: '100%',
									height: 10
								} )
						)
				)
				.appendTo( 'body' );
	
			var outer = n.children();
			var inner = outer.children();
	
			// Numbers below, in order, are:
			// inner.offsetWidth, inner.clientWidth, outer.offsetWidth, outer.clientWidth
			//
			// IE6 XP:                           100 100 100  83
			// IE7 Vista:                        100 100 100  83
			// IE 8+ Windows:                     83  83 100  83
			// Evergreen Windows:                 83  83 100  83
			// Evergreen Mac with scrollbars:     85  85 100  85
			// Evergreen Mac without scrollbars: 100 100 100 100
	
			// Get scrollbar width
			browser.barWidth = outer[0].offsetWidth - outer[0].clientWidth;
	
			// IE6/7 will oversize a width 100% element inside a scrolling element, to
			// include the width of the scrollbar, while other browsers ensure the inner
			// element is contained without forcing scrolling
			browser.bScrollOversize = inner[0].offsetWidth === 100 && outer[0].clientWidth !== 100;
	
			// In rtl text layout, some browsers (most, but not all) will place the
			// scrollbar on the left, rather than the right.
			browser.bScrollbarLeft = Math.round( inner.offset().left ) !== 1;
	
			// IE8- don't provide height and width for getBoundingClientRect
			browser.bBounding = n[0].getBoundingClientRect().width ? true : false;
	
			n.remove();
		}
	
		$.extend( settings.oBrowser, DataTable.__browser );
		settings.oScroll.iBarWidth = DataTable.__browser.barWidth;
	}
	
	
	/**
	 * Array.prototype reduce[Right] method, used for browsers which don't support
	 * JS 1.6. Done this way to reduce code size, since we iterate either way
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnReduce ( that, fn, init, start, end, inc )
	{
		var
			i = start,
			value,
			isSet = false;
	
		if ( init !== undefined ) {
			value = init;
			isSet = true;
		}
	
		while ( i !== end ) {
			if ( ! that.hasOwnProperty(i) ) {
				continue;
			}
	
			value = isSet ?
				fn( value, that[i], i, that ) :
				that[i];
	
			isSet = true;
			i += inc;
		}
	
		return value;
	}
	
	/**
	 * Add a column to the list used for the table with default values
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nTh The th element for this column
	 *  @memberof DataTable#oApi
	 */
	function _fnAddColumn( oSettings, nTh )
	{
		// Add column to aoColumns array
		var oDefaults = DataTable.defaults.column;
		var iCol = oSettings.aoColumns.length;
		var oCol = $.extend( {}, DataTable.models.oColumn, oDefaults, {
			"nTh": nTh ? nTh : document.createElement('th'),
			"sTitle":    oDefaults.sTitle    ? oDefaults.sTitle    : nTh ? nTh.innerHTML : '',
			"aDataSort": oDefaults.aDataSort ? oDefaults.aDataSort : [iCol],
			"mData": oDefaults.mData ? oDefaults.mData : iCol,
			idx: iCol
		} );
		oSettings.aoColumns.push( oCol );
	
		// Add search object for column specific search. Note that the `searchCols[ iCol ]`
		// passed into extend can be undefined. This allows the user to give a default
		// with only some of the parameters defined, and also not give a default
		var searchCols = oSettings.aoPreSearchCols;
		searchCols[ iCol ] = $.extend( {}, DataTable.models.oSearch, searchCols[ iCol ] );
	
		// Use the default column options function to initialise classes etc
		_fnColumnOptions( oSettings, iCol, $(nTh).data() );
	}
	
	
	/**
	 * Apply options for a column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iCol column index to consider
	 *  @param {object} oOptions object with sType, bVisible and bSearchable etc
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnOptions( oSettings, iCol, oOptions )
	{
		var oCol = oSettings.aoColumns[ iCol ];
		var oClasses = oSettings.oClasses;
		var th = $(oCol.nTh);
	
		// Try to get width information from the DOM. We can't get it from CSS
		// as we'd need to parse the CSS stylesheet. `width` option can override
		if ( ! oCol.sWidthOrig ) {
			// Width attribute
			oCol.sWidthOrig = th.attr('width') || null;
	
			// Style attribute
			var t = (th.attr('style') || '').match(/width:\s*(\d+[pxem%]+)/);
			if ( t ) {
				oCol.sWidthOrig = t[1];
			}
		}
	
		/* User specified column options */
		if ( oOptions !== undefined && oOptions !== null )
		{
			// Backwards compatibility
			_fnCompatCols( oOptions );
	
			// Map camel case parameters to their Hungarian counterparts
			_fnCamelToHungarian( DataTable.defaults.column, oOptions, true );
	
			/* Backwards compatibility for mDataProp */
			if ( oOptions.mDataProp !== undefined && !oOptions.mData )
			{
				oOptions.mData = oOptions.mDataProp;
			}
	
			if ( oOptions.sType )
			{
				oCol._sManualType = oOptions.sType;
			}
	
			// `class` is a reserved word in Javascript, so we need to provide
			// the ability to use a valid name for the camel case input
			if ( oOptions.className && ! oOptions.sClass )
			{
				oOptions.sClass = oOptions.className;
			}
			if ( oOptions.sClass ) {
				th.addClass( oOptions.sClass );
			}
	
			$.extend( oCol, oOptions );
			_fnMap( oCol, oOptions, "sWidth", "sWidthOrig" );
	
			/* iDataSort to be applied (backwards compatibility), but aDataSort will take
			 * priority if defined
			 */
			if ( oOptions.iDataSort !== undefined )
			{
				oCol.aDataSort = [ oOptions.iDataSort ];
			}
			_fnMap( oCol, oOptions, "aDataSort" );
		}
	
		/* Cache the data get and set functions for speed */
		var mDataSrc = oCol.mData;
		var mData = _fnGetObjectDataFn( mDataSrc );
		var mRender = oCol.mRender ? _fnGetObjectDataFn( oCol.mRender ) : null;
	
		var attrTest = function( src ) {
			return typeof src === 'string' && src.indexOf('@') !== -1;
		};
		oCol._bAttrSrc = $.isPlainObject( mDataSrc ) && (
			attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter)
		);
		oCol._setter = null;
	
		oCol.fnGetData = function (rowData, type, meta) {
			var innerData = mData( rowData, type, undefined, meta );
	
			return mRender && type ?
				mRender( innerData, type, rowData, meta ) :
				innerData;
		};
		oCol.fnSetData = function ( rowData, val, meta ) {
			return _fnSetObjectDataFn( mDataSrc )( rowData, val, meta );
		};
	
		// Indicate if DataTables should read DOM data as an object or array
		// Used in _fnGetRowElements
		if ( typeof mDataSrc !== 'number' ) {
			oSettings._rowReadObject = true;
		}
	
		/* Feature sorting overrides column specific when off */
		if ( !oSettings.oFeatures.bSort )
		{
			oCol.bSortable = false;
			th.addClass( oClasses.sSortableNone ); // Have to add class here as order event isn't called
		}
	
		/* Check that the class assignment is correct for sorting */
		var bAsc = $.inArray('asc', oCol.asSorting) !== -1;
		var bDesc = $.inArray('desc', oCol.asSorting) !== -1;
		if ( !oCol.bSortable || (!bAsc && !bDesc) )
		{
			oCol.sSortingClass = oClasses.sSortableNone;
			oCol.sSortingClassJUI = "";
		}
		else if ( bAsc && !bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableAsc;
			oCol.sSortingClassJUI = oClasses.sSortJUIAscAllowed;
		}
		else if ( !bAsc && bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableDesc;
			oCol.sSortingClassJUI = oClasses.sSortJUIDescAllowed;
		}
		else
		{
			oCol.sSortingClass = oClasses.sSortable;
			oCol.sSortingClassJUI = oClasses.sSortJUI;
		}
	}
	
	
	/**
	 * Adjust the table column widths for new data. Note: you would probably want to
	 * do a redraw after calling this function!
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAdjustColumnSizing ( settings )
	{
		/* Not interested in doing column width calculation if auto-width is disabled */
		if ( settings.oFeatures.bAutoWidth !== false )
		{
			var columns = settings.aoColumns;
	
			_fnCalculateColumnWidths( settings );
			for ( var i=0 , iLen=columns.length ; i<iLen ; i++ )
			{
				columns[i].nTh.style.width = columns[i].sWidth;
			}
		}
	
		var scroll = settings.oScroll;
		if ( scroll.sY !== '' || scroll.sX !== '')
		{
			_fnScrollDraw( settings );
		}
	
		_fnCallbackFire( settings, null, 'column-sizing', [settings] );
	}
	
	
	/**
	 * Covert the index of a visible column to the index in the data array (take account
	 * of hidden columns)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iMatch Visible column index to lookup
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnVisibleToColumnIndex( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
	
		return typeof aiVis[iMatch] === 'number' ?
			aiVis[iMatch] :
			null;
	}
	
	
	/**
	 * Covert the index of an index in the data array and convert it to the visible
	 *   column index (take account of hidden columns)
	 *  @param {int} iMatch Column index to lookup
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnIndexToVisible( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
		var iPos = $.inArray( iMatch, aiVis );
	
		return iPos !== -1 ? iPos : null;
	}
	
	
	/**
	 * Get the number of visible columns
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the number of visible columns
	 *  @memberof DataTable#oApi
	 */
	function _fnVisbleColumns( oSettings )
	{
		var vis = 0;
	
		// No reduce in IE8, use a loop for now
		$.each( oSettings.aoColumns, function ( i, col ) {
			if ( col.bVisible && $(col.nTh).css('display') !== 'none' ) {
				vis++;
			}
		} );
	
		return vis;
	}
	
	
	/**
	 * Get an array of column indexes that match a given property
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sParam Parameter in aoColumns to look for - typically
	 *    bVisible or bSearchable
	 *  @returns {array} Array of indexes with matched properties
	 *  @memberof DataTable#oApi
	 */
	function _fnGetColumns( oSettings, sParam )
	{
		var a = [];
	
		$.map( oSettings.aoColumns, function(val, i) {
			if ( val[sParam] ) {
				a.push( i );
			}
		} );
	
		return a;
	}
	
	
	/**
	 * Calculate the 'type' of a column
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnTypes ( settings )
	{
		var columns = settings.aoColumns;
		var data = settings.aoData;
		var types = DataTable.ext.type.detect;
		var i, ien, j, jen, k, ken;
		var col, cell, detectedType, cache;
	
		// For each column, spin over the 
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			col = columns[i];
			cache = [];
	
			if ( ! col.sType && col._sManualType ) {
				col.sType = col._sManualType;
			}
			else if ( ! col.sType ) {
				for ( j=0, jen=types.length ; j<jen ; j++ ) {
					for ( k=0, ken=data.length ; k<ken ; k++ ) {
						// Use a cache array so we only need to get the type data
						// from the formatter once (when using multiple detectors)
						if ( cache[k] === undefined ) {
							cache[k] = _fnGetCellData( settings, k, i, 'type' );
						}
	
						detectedType = types[j]( cache[k], settings );
	
						// If null, then this type can't apply to this column, so
						// rather than testing all cells, break out. There is an
						// exception for the last type which is `html`. We need to
						// scan all rows since it is possible to mix string and HTML
						// types
						if ( ! detectedType && j !== types.length-1 ) {
							break;
						}
	
						// Only a single match is needed for html type since it is
						// bottom of the pile and very similar to string
						if ( detectedType === 'html' ) {
							break;
						}
					}
	
					// Type is valid for all data points in the column - use this
					// type
					if ( detectedType ) {
						col.sType = detectedType;
						break;
					}
				}
	
				// Fall back - if no type was detected, always use string
				if ( ! col.sType ) {
					col.sType = 'string';
				}
			}
		}
	}
	
	
	/**
	 * Take the column definitions and static columns arrays and calculate how
	 * they relate to column indexes. The callback function will then apply the
	 * definition found for a column to a suitable configuration object.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aoColDefs The aoColumnDefs array that is to be applied
	 *  @param {array} aoCols The aoColumns array that defines columns individually
	 *  @param {function} fn Callback function - takes two parameters, the calculated
	 *    column index and the definition for that column.
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyColumnDefs( oSettings, aoColDefs, aoCols, fn )
	{
		var i, iLen, j, jLen, k, kLen, def;
		var columns = oSettings.aoColumns;
	
		// Column definitions with aTargets
		if ( aoColDefs )
		{
			/* Loop over the definitions array - loop in reverse so first instance has priority */
			for ( i=aoColDefs.length-1 ; i>=0 ; i-- )
			{
				def = aoColDefs[i];
	
				/* Each definition can target multiple columns, as it is an array */
				var aTargets = def.targets !== undefined ?
					def.targets :
					def.aTargets;
	
				if ( ! Array.isArray( aTargets ) )
				{
					aTargets = [ aTargets ];
				}
	
				for ( j=0, jLen=aTargets.length ; j<jLen ; j++ )
				{
					if ( typeof aTargets[j] === 'number' && aTargets[j] >= 0 )
					{
						/* Add columns that we don't yet know about */
						while( columns.length <= aTargets[j] )
						{
							_fnAddColumn( oSettings );
						}
	
						/* Integer, basic index */
						fn( aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'number' && aTargets[j] < 0 )
					{
						/* Negative integer, right to left column counting */
						fn( columns.length+aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'string' )
					{
						/* Class name matching on TH element */
						for ( k=0, kLen=columns.length ; k<kLen ; k++ )
						{
							if ( aTargets[j] == "_all" ||
							     $(columns[k].nTh).hasClass( aTargets[j] ) )
							{
								fn( k, def );
							}
						}
					}
				}
			}
		}
	
		// Statically defined columns array
		if ( aoCols )
		{
			for ( i=0, iLen=aoCols.length ; i<iLen ; i++ )
			{
				fn( i, aoCols[i] );
			}
		}
	}
	
	/**
	 * Add a data array to the table, creating DOM node etc. This is the parallel to
	 * _fnGatherData, but for adding rows from a Javascript source, rather than a
	 * DOM source.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aData data array to be added
	 *  @param {node} [nTr] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @returns {int} >=0 if successful (index of new aoData entry), -1 if failed
	 *  @memberof DataTable#oApi
	 */
	function _fnAddData ( oSettings, aDataIn, nTr, anTds )
	{
		/* Create the object for storing information about this new row */
		var iRow = oSettings.aoData.length;
		var oData = $.extend( true, {}, DataTable.models.oRow, {
			src: nTr ? 'dom' : 'data',
			idx: iRow
		} );
	
		oData._aData = aDataIn;
		oSettings.aoData.push( oData );
	
		/* Create the cells */
		var nTd, sThisType;
		var columns = oSettings.aoColumns;
	
		// Invalidate the column types as the new data needs to be revalidated
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			columns[i].sType = null;
		}
	
		/* Add to the display array */
		oSettings.aiDisplayMaster.push( iRow );
	
		var id = oSettings.rowIdFn( aDataIn );
		if ( id !== undefined ) {
			oSettings.aIds[ id ] = oData;
		}
	
		/* Create the DOM information, or register it if already present */
		if ( nTr || ! oSettings.oFeatures.bDeferRender )
		{
			_fnCreateTr( oSettings, iRow, nTr, anTds );
		}
	
		return iRow;
	}
	
	
	/**
	 * Add one or more TR elements to the table. Generally we'd expect to
	 * use this for reading data from a DOM sourced table, but it could be
	 * used for an TR element. Note that if a TR is given, it is used (i.e.
	 * it is not cloned).
	 *  @param {object} settings dataTables settings object
	 *  @param {array|node|jQuery} trs The TR element(s) to add to the table
	 *  @returns {array} Array of indexes for the added rows
	 *  @memberof DataTable#oApi
	 */
	function _fnAddTr( settings, trs )
	{
		var row;
	
		// Allow an individual node to be passed in
		if ( ! (trs instanceof $) ) {
			trs = $(trs);
		}
	
		return trs.map( function (i, el) {
			row = _fnGetRowElements( settings, el );
			return _fnAddData( settings, row.data, el, row.cells );
		} );
	}
	
	
	/**
	 * Take a TR element and convert it to an index in aoData
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} n the TR element to find
	 *  @returns {int} index if the node is found, null if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToDataIndex( oSettings, n )
	{
		return (n._DT_RowIndex!==undefined) ? n._DT_RowIndex : null;
	}
	
	
	/**
	 * Take a TD element and convert it into a column data index (not the visible index)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow The row number the TD/TH can be found in
	 *  @param {node} n The TD/TH element to find
	 *  @returns {int} index if the node is found, -1 if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToColumnIndex( oSettings, iRow, n )
	{
		return $.inArray( n, oSettings.aoData[ iRow ].anCells );
	}
	
	
	/**
	 * Get the data for a given cell from the internal cache, taking into account data mapping
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {string} type data get type ('display', 'type' 'filter' 'sort')
	 *  @returns {*} Cell data
	 *  @memberof DataTable#oApi
	 */
	function _fnGetCellData( settings, rowIdx, colIdx, type )
	{
		var draw           = settings.iDraw;
		var col            = settings.aoColumns[colIdx];
		var rowData        = settings.aoData[rowIdx]._aData;
		var defaultContent = col.sDefaultContent;
		var cellData       = col.fnGetData( rowData, type, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		} );
	
		if ( cellData === undefined ) {
			if ( settings.iDrawError != draw && defaultContent === null ) {
				_fnLog( settings, 0, "Requested unknown parameter "+
					(typeof col.mData=='function' ? '{function}' : "'"+col.mData+"'")+
					" for row "+rowIdx+", column "+colIdx, 4 );
				settings.iDrawError = draw;
			}
			return defaultContent;
		}
	
		// When the data source is null and a specific data type is requested (i.e.
		// not the original data), we can use default column data
		if ( (cellData === rowData || cellData === null) && defaultContent !== null && type !== undefined ) {
			cellData = defaultContent;
		}
		else if ( typeof cellData === 'function' ) {
			// If the data source is a function, then we run it and use the return,
			// executing in the scope of the data object (for instances)
			return cellData.call( rowData );
		}
	
		if ( cellData === null && type == 'display' ) {
			return '';
		}
		return cellData;
	}
	
	
	/**
	 * Set the value for a specific cell, into the internal data cache
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {*} val Value to set
	 *  @memberof DataTable#oApi
	 */
	function _fnSetCellData( settings, rowIdx, colIdx, val )
	{
		var col     = settings.aoColumns[colIdx];
		var rowData = settings.aoData[rowIdx]._aData;
	
		col.fnSetData( rowData, val, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		}  );
	}
	
	
	// Private variable that is used to match action syntax in the data property object
	var __reArray = /\[.*?\]$/;
	var __reFn = /\(\)$/;
	
	/**
	 * Split string on periods, taking into account escaped periods
	 * @param  {string} str String to split
	 * @return {array} Split string
	 */
	function _fnSplitObjNotation( str )
	{
		return $.map( str.match(/(\\.|[^\.])+/g) || [''], function ( s ) {
			return s.replace(/\\\./g, '.');
		} );
	}
	
	
	/**
	 * Return a function that can be used to get data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data get function
	 *  @memberof DataTable#oApi
	 */
	function _fnGetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Build an object of get functions, and wrap them in a single call */
			var o = {};
			$.each( mSource, function (key, val) {
				if ( val ) {
					o[key] = _fnGetObjectDataFn( val );
				}
			} );
	
			return function (data, type, row, meta) {
				var t = o[type] || o._;
				return t !== undefined ?
					t(data, type, row, meta) :
					data;
			};
		}
		else if ( mSource === null )
		{
			/* Give an empty string for rendering / sorting etc */
			return function (data) { // type, row and meta also passed, but not used
				return data;
			};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, type, row, meta) {
				return mSource( data, type, row, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* If there is a . in the source string then the data source is in a
			 * nested object so we loop over the data for each level to get the next
			 * level down. On each loop we test for undefined, and if found immediately
			 * return. This allows entire objects to be missing and sDefaultContent to
			 * be used if defined, rather than throwing an error
			 */
			var fetchData = function (data, type, src) {
				var arrayNotation, funcNotation, out, innerSrc;
	
				if ( src !== "" )
				{
					var a = _fnSplitObjNotation( src );
	
					for ( var i=0, iLen=a.length ; i<iLen ; i++ )
					{
						// Check if we are dealing with special notation
						arrayNotation = a[i].match(__reArray);
						funcNotation = a[i].match(__reFn);
	
						if ( arrayNotation )
						{
							// Array notation
							a[i] = a[i].replace(__reArray, '');
	
							// Condition allows simply [] to be passed in
							if ( a[i] !== "" ) {
								data = data[ a[i] ];
							}
							out = [];
	
							// Get the remainder of the nested object to get
							a.splice( 0, i+1 );
							innerSrc = a.join('.');
	
							// Traverse each entry in the array getting the properties requested
							if ( Array.isArray( data ) ) {
								for ( var j=0, jLen=data.length ; j<jLen ; j++ ) {
									out.push( fetchData( data[j], type, innerSrc ) );
								}
							}
	
							// If a string is given in between the array notation indicators, that
							// is used to join the strings together, otherwise an array is returned
							var join = arrayNotation[0].substring(1, arrayNotation[0].length-1);
							data = (join==="") ? out : out.join(join);
	
							// The inner call to fetchData has already traversed through the remainder
							// of the source requested, so we exit from the loop
							break;
						}
						else if ( funcNotation )
						{
							// Function call
							a[i] = a[i].replace(__reFn, '');
							data = data[ a[i] ]();
							continue;
						}
	
						if ( data === null || data[ a[i] ] === undefined )
						{
							return undefined;
						}
						data = data[ a[i] ];
					}
				}
	
				return data;
			};
	
			return function (data, type) { // row and meta also passed, but not used
				return fetchData( data, type, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, type) { // row and meta also passed, but not used
				return data[mSource];
			};
		}
	}
	
	
	/**
	 * Return a function that can be used to set data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data set function
	 *  @memberof DataTable#oApi
	 */
	function _fnSetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Unlike get, only the underscore (global) option is used for for
			 * setting data since we don't know the type here. This is why an object
			 * option is not documented for `mData` (which is read/write), but it is
			 * for `mRender` which is read only.
			 */
			return _fnSetObjectDataFn( mSource._ );
		}
		else if ( mSource === null )
		{
			/* Nothing to do when the data source is null */
			return function () {};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, val, meta) {
				mSource( data, 'set', val, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* Like the get, we need to get data from a nested object */
			var setData = function (data, val, src) {
				var a = _fnSplitObjNotation( src ), b;
				var aLast = a[a.length-1];
				var arrayNotation, funcNotation, o, innerSrc;
	
				for ( var i=0, iLen=a.length-1 ; i<iLen ; i++ )
				{
					// Protect against prototype pollution
					if (a[i] === '__proto__' || a[i] === 'constructor') {
						throw new Error('Cannot set prototype values');
					}
	
					// Check if we are dealing with an array notation request
					arrayNotation = a[i].match(__reArray);
					funcNotation = a[i].match(__reFn);
	
					if ( arrayNotation )
					{
						a[i] = a[i].replace(__reArray, '');
						data[ a[i] ] = [];
	
						// Get the remainder of the nested object to set so we can recurse
						b = a.slice();
						b.splice( 0, i+1 );
						innerSrc = b.join('.');
	
						// Traverse each entry in the array setting the properties requested
						if ( Array.isArray( val ) )
						{
							for ( var j=0, jLen=val.length ; j<jLen ; j++ )
							{
								o = {};
								setData( o, val[j], innerSrc );
								data[ a[i] ].push( o );
							}
						}
						else
						{
							// We've been asked to save data to an array, but it
							// isn't array data to be saved. Best that can be done
							// is to just save the value.
							data[ a[i] ] = val;
						}
	
						// The inner call to setData has already traversed through the remainder
						// of the source and has set the data, thus we can exit here
						return;
					}
					else if ( funcNotation )
					{
						// Function call
						a[i] = a[i].replace(__reFn, '');
						data = data[ a[i] ]( val );
					}
	
					// If the nested object doesn't currently exist - since we are
					// trying to set the value - create it
					if ( data[ a[i] ] === null || data[ a[i] ] === undefined )
					{
						data[ a[i] ] = {};
					}
					data = data[ a[i] ];
				}
	
				// Last item in the input - i.e, the actual set
				if ( aLast.match(__reFn ) )
				{
					// Function call
					data = data[ aLast.replace(__reFn, '') ]( val );
				}
				else
				{
					// If array notation is used, we just want to strip it and use the property name
					// and assign the value. If it isn't used, then we get the result we want anyway
					data[ aLast.replace(__reArray, '') ] = val;
				}
			};
	
			return function (data, val) { // meta is also passed in, but not used
				return setData( data, val, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, val) { // meta is also passed in, but not used
				data[mSource] = val;
			};
		}
	}
	
	
	/**
	 * Return an array with the full table data
	 *  @param {object} oSettings dataTables settings object
	 *  @returns array {array} aData Master data array
	 *  @memberof DataTable#oApi
	 */
	function _fnGetDataMaster ( settings )
	{
		return _pluck( settings.aoData, '_aData' );
	}
	
	
	/**
	 * Nuke the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnClearTable( settings )
	{
		settings.aoData.length = 0;
		settings.aiDisplayMaster.length = 0;
		settings.aiDisplay.length = 0;
		settings.aIds = {};
	}
	
	
	 /**
	 * Take an array of integers (index array) and remove a target integer (value - not
	 * the key!)
	 *  @param {array} a Index array to target
	 *  @param {int} iTarget value to find
	 *  @memberof DataTable#oApi
	 */
	function _fnDeleteIndex( a, iTarget, splice )
	{
		var iTargetIndex = -1;
	
		for ( var i=0, iLen=a.length ; i<iLen ; i++ )
		{
			if ( a[i] == iTarget )
			{
				iTargetIndex = i;
			}
			else if ( a[i] > iTarget )
			{
				a[i]--;
			}
		}
	
		if ( iTargetIndex != -1 && splice === undefined )
		{
			a.splice( iTargetIndex, 1 );
		}
	}
	
	
	/**
	 * Mark cached data as invalid such that a re-read of the data will occur when
	 * the cached data is next requested. Also update from the data source object.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {int}    rowIdx   Row index to invalidate
	 * @param {string} [src]    Source to invalidate from: undefined, 'auto', 'dom'
	 *     or 'data'
	 * @param {int}    [colIdx] Column index to invalidate. If undefined the whole
	 *     row will be invalidated
	 * @memberof DataTable#oApi
	 *
	 * @todo For the modularisation of v1.11 this will need to become a callback, so
	 *   the sort and filter methods can subscribe to it. That will required
	 *   initialisation options for sorting, which is why it is not already baked in
	 */
	function _fnInvalidate( settings, rowIdx, src, colIdx )
	{
		var row = settings.aoData[ rowIdx ];
		var i, ien;
		var cellWrite = function ( cell, col ) {
			// This is very frustrating, but in IE if you just write directly
			// to innerHTML, and elements that are overwritten are GC'ed,
			// even if there is a reference to them elsewhere
			while ( cell.childNodes.length ) {
				cell.removeChild( cell.firstChild );
			}
	
			cell.innerHTML = _fnGetCellData( settings, rowIdx, col, 'display' );
		};
	
		// Are we reading last data from DOM or the data object?
		if ( src === 'dom' || ((! src || src === 'auto') && row.src === 'dom') ) {
			// Read the data from the DOM
			row._aData = _fnGetRowElements(
					settings, row, colIdx, colIdx === undefined ? undefined : row._aData
				)
				.data;
		}
		else {
			// Reading from data object, update the DOM
			var cells = row.anCells;
	
			if ( cells ) {
				if ( colIdx !== undefined ) {
					cellWrite( cells[colIdx], colIdx );
				}
				else {
					for ( i=0, ien=cells.length ; i<ien ; i++ ) {
						cellWrite( cells[i], i );
					}
				}
			}
		}
	
		// For both row and cell invalidation, the cached data for sorting and
		// filtering is nulled out
		row._aSortData = null;
		row._aFilterData = null;
	
		// Invalidate the type for a specific column (if given) or all columns since
		// the data might have changed
		var cols = settings.aoColumns;
		if ( colIdx !== undefined ) {
			cols[ colIdx ].sType = null;
		}
		else {
			for ( i=0, ien=cols.length ; i<ien ; i++ ) {
				cols[i].sType = null;
			}
	
			// Update DataTables special `DT_*` attributes for the row
			_fnRowAttributes( settings, row );
		}
	}
	
	
	/**
	 * Build a data source object from an HTML row, reading the contents of the
	 * cells that are in the row.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {node|object} TR element from which to read data or existing row
	 *   object from which to re-read the data from the cells
	 * @param {int} [colIdx] Optional column index
	 * @param {array|object} [d] Data source object. If `colIdx` is given then this
	 *   parameter should also be given and will be used to write the data into.
	 *   Only the column in question will be written
	 * @returns {object} Object with two parameters: `data` the data read, in
	 *   document order, and `cells` and array of nodes (they can be useful to the
	 *   caller, so rather than needing a second traversal to get them, just return
	 *   them from here).
	 * @memberof DataTable#oApi
	 */
	function _fnGetRowElements( settings, row, colIdx, d )
	{
		var
			tds = [],
			td = row.firstChild,
			name, col, o, i=0, contents,
			columns = settings.aoColumns,
			objectRead = settings._rowReadObject;
	
		// Allow the data object to be passed in, or construct
		d = d !== undefined ?
			d :
			objectRead ?
				{} :
				[];
	
		var attr = function ( str, td  ) {
			if ( typeof str === 'string' ) {
				var idx = str.indexOf('@');
	
				if ( idx !== -1 ) {
					var attr = str.substring( idx+1 );
					var setter = _fnSetObjectDataFn( str );
					setter( d, td.getAttribute( attr ) );
				}
			}
		};
	
		// Read data from a cell and store into the data object
		var cellProcess = function ( cell ) {
			if ( colIdx === undefined || colIdx === i ) {
				col = columns[i];
				contents = (cell.innerHTML).trim();
	
				if ( col && col._bAttrSrc ) {
					var setter = _fnSetObjectDataFn( col.mData._ );
					setter( d, contents );
	
					attr( col.mData.sort, cell );
					attr( col.mData.type, cell );
					attr( col.mData.filter, cell );
				}
				else {
					// Depending on the `data` option for the columns the data can
					// be read to either an object or an array.
					if ( objectRead ) {
						if ( ! col._setter ) {
							// Cache the setter function
							col._setter = _fnSetObjectDataFn( col.mData );
						}
						col._setter( d, contents );
					}
					else {
						d[i] = contents;
					}
				}
			}
	
			i++;
		};
	
		if ( td ) {
			// `tr` element was passed in
			while ( td ) {
				name = td.nodeName.toUpperCase();
	
				if ( name == "TD" || name == "TH" ) {
					cellProcess( td );
					tds.push( td );
				}
	
				td = td.nextSibling;
			}
		}
		else {
			// Existing row object passed in
			tds = row.anCells;
	
			for ( var j=0, jen=tds.length ; j<jen ; j++ ) {
				cellProcess( tds[j] );
			}
		}
	
		// Read the ID from the DOM if present
		var rowNode = row.firstChild ? row : row.nTr;
	
		if ( rowNode ) {
			var id = rowNode.getAttribute( 'id' );
	
			if ( id ) {
				_fnSetObjectDataFn( settings.rowId )( d, id );
			}
		}
	
		return {
			data: d,
			cells: tds
		};
	}
	/**
	 * Create a new TR element (and it's TD children) for a row
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow Row to consider
	 *  @param {node} [nTrIn] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @memberof DataTable#oApi
	 */
	function _fnCreateTr ( oSettings, iRow, nTrIn, anTds )
	{
		var
			row = oSettings.aoData[iRow],
			rowData = row._aData,
			cells = [],
			nTr, nTd, oCol,
			i, iLen, create;
	
		if ( row.nTr === null )
		{
			nTr = nTrIn || document.createElement('tr');
	
			row.nTr = nTr;
			row.anCells = cells;
	
			/* Use a private property on the node to allow reserve mapping from the node
			 * to the aoData array for fast look up
			 */
			nTr._DT_RowIndex = iRow;
	
			/* Special parameters can be given by the data source to be used on the row */
			_fnRowAttributes( oSettings, row );
	
			/* Process each column */
			for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
			{
				oCol = oSettings.aoColumns[i];
				create = nTrIn ? false : true;
	
				nTd = create ? document.createElement( oCol.sCellType ) : anTds[i];
				nTd._DT_CellIndex = {
					row: iRow,
					column: i
				};
				
				cells.push( nTd );
	
				// Need to create the HTML if new, or if a rendering function is defined
				if ( create || ((oCol.mRender || oCol.mData !== i) &&
					 (!$.isPlainObject(oCol.mData) || oCol.mData._ !== i+'.display')
				)) {
					nTd.innerHTML = _fnGetCellData( oSettings, iRow, i, 'display' );
				}
	
				/* Add user defined class */
				if ( oCol.sClass )
				{
					nTd.className += ' '+oCol.sClass;
				}
	
				// Visibility - add or remove as required
				if ( oCol.bVisible && ! nTrIn )
				{
					nTr.appendChild( nTd );
				}
				else if ( ! oCol.bVisible && nTrIn )
				{
					nTd.parentNode.removeChild( nTd );
				}
	
				if ( oCol.fnCreatedCell )
				{
					oCol.fnCreatedCell.call( oSettings.oInstance,
						nTd, _fnGetCellData( oSettings, iRow, i ), rowData, iRow, i
					);
				}
			}
	
			_fnCallbackFire( oSettings, 'aoRowCreatedCallback', null, [nTr, rowData, iRow, cells] );
		}
	}
	
	
	/**
	 * Add attributes to a row based on the special `DT_*` parameters in a data
	 * source object.
	 *  @param {object} settings DataTables settings object
	 *  @param {object} DataTables row object for the row to be modified
	 *  @memberof DataTable#oApi
	 */
	function _fnRowAttributes( settings, row )
	{
		var tr = row.nTr;
		var data = row._aData;
	
		if ( tr ) {
			var id = settings.rowIdFn( data );
	
			if ( id ) {
				tr.id = id;
			}
	
			if ( data.DT_RowClass ) {
				// Remove any classes added by DT_RowClass before
				var a = data.DT_RowClass.split(' ');
				row.__rowc = row.__rowc ?
					_unique( row.__rowc.concat( a ) ) :
					a;
	
				$(tr)
					.removeClass( row.__rowc.join(' ') )
					.addClass( data.DT_RowClass );
			}
	
			if ( data.DT_RowAttr ) {
				$(tr).attr( data.DT_RowAttr );
			}
	
			if ( data.DT_RowData ) {
				$(tr).data( data.DT_RowData );
			}
		}
	}
	
	
	/**
	 * Create the HTML header for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBuildHead( oSettings )
	{
		var i, ien, cell, row, column;
		var thead = oSettings.nTHead;
		var tfoot = oSettings.nTFoot;
		var createHeader = $('th, td', thead).length === 0;
		var classes = oSettings.oClasses;
		var columns = oSettings.aoColumns;
	
		if ( createHeader ) {
			row = $('<tr/>').appendTo( thead );
		}
	
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			column = columns[i];
			cell = $( column.nTh ).addClass( column.sClass );
	
			if ( createHeader ) {
				cell.appendTo( row );
			}
	
			// 1.11 move into sorting
			if ( oSettings.oFeatures.bSort ) {
				cell.addClass( column.sSortingClass );
	
				if ( column.bSortable !== false ) {
					cell
						.attr( 'tabindex', oSettings.iTabIndex )
						.attr( 'aria-controls', oSettings.sTableId );
	
					_fnSortAttachListener( oSettings, column.nTh, i );
				}
			}
	
			if ( column.sTitle != cell[0].innerHTML ) {
				cell.html( column.sTitle );
			}
	
			_fnRenderer( oSettings, 'header' )(
				oSettings, cell, column, classes
			);
		}
	
		if ( createHeader ) {
			_fnDetectHeader( oSettings.aoHeader, thead );
		}
		
		/* ARIA role for the rows */
		$(thead).children('tr').attr('role', 'row');
	
		/* Deal with the footer - add classes if required */
		$(thead).children('tr').children('th, td').addClass( classes.sHeaderTH );
		$(tfoot).children('tr').children('th, td').addClass( classes.sFooterTH );
	
		// Cache the footer cells. Note that we only take the cells from the first
		// row in the footer. If there is more than one row the user wants to
		// interact with, they need to use the table().foot() method. Note also this
		// allows cells to be used for multiple columns using colspan
		if ( tfoot !== null ) {
			var cells = oSettings.aoFooter[0];
	
			for ( i=0, ien=cells.length ; i<ien ; i++ ) {
				column = columns[i];
				column.nTf = cells[i].cell;
	
				if ( column.sClass ) {
					$(column.nTf).addClass( column.sClass );
				}
			}
		}
	}
	
	
	/**
	 * Draw the header (or footer) element based on the column visibility states. The
	 * methodology here is to use the layout array from _fnDetectHeader, modified for
	 * the instantaneous column visibility, to construct the new layout. The grid is
	 * traversed over cell at a time in a rows x columns grid fashion, although each
	 * cell insert can cover multiple elements in the grid - which is tracks using the
	 * aApplied array. Cell inserts in the grid will only occur where there isn't
	 * already a cell in that position.
	 *  @param {object} oSettings dataTables settings object
	 *  @param array {objects} aoSource Layout array from _fnDetectHeader
	 *  @param {boolean} [bIncludeHidden=false] If true then include the hidden columns in the calc,
	 *  @memberof DataTable#oApi
	 */
	function _fnDrawHead( oSettings, aoSource, bIncludeHidden )
	{
		var i, iLen, j, jLen, k, kLen, n, nLocalTr;
		var aoLocal = [];
		var aApplied = [];
		var iColumns = oSettings.aoColumns.length;
		var iRowspan, iColspan;
	
		if ( ! aoSource )
		{
			return;
		}
	
		if (  bIncludeHidden === undefined )
		{
			bIncludeHidden = false;
		}
	
		/* Make a copy of the master layout array, but without the visible columns in it */
		for ( i=0, iLen=aoSource.length ; i<iLen ; i++ )
		{
			aoLocal[i] = aoSource[i].slice();
			aoLocal[i].nTr = aoSource[i].nTr;
	
			/* Remove any columns which are currently hidden */
			for ( j=iColumns-1 ; j>=0 ; j-- )
			{
				if ( !oSettings.aoColumns[j].bVisible && !bIncludeHidden )
				{
					aoLocal[i].splice( j, 1 );
				}
			}
	
			/* Prep the applied array - it needs an element for each row */
			aApplied.push( [] );
		}
	
		for ( i=0, iLen=aoLocal.length ; i<iLen ; i++ )
		{
			nLocalTr = aoLocal[i].nTr;
	
			/* All cells are going to be replaced, so empty out the row */
			if ( nLocalTr )
			{
				while( (n = nLocalTr.firstChild) )
				{
					nLocalTr.removeChild( n );
				}
			}
	
			for ( j=0, jLen=aoLocal[i].length ; j<jLen ; j++ )
			{
				iRowspan = 1;
				iColspan = 1;
	
				/* Check to see if there is already a cell (row/colspan) covering our target
				 * insert point. If there is, then there is nothing to do.
				 */
				if ( aApplied[i][j] === undefined )
				{
					nLocalTr.appendChild( aoLocal[i][j].cell );
					aApplied[i][j] = 1;
	
					/* Expand the cell to cover as many rows as needed */
					while ( aoLocal[i+iRowspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i+iRowspan][j].cell )
					{
						aApplied[i+iRowspan][j] = 1;
						iRowspan++;
					}
	
					/* Expand the cell to cover as many columns as needed */
					while ( aoLocal[i][j+iColspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i][j+iColspan].cell )
					{
						/* Must update the applied array over the rows for the columns */
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aApplied[i+k][j+iColspan] = 1;
						}
						iColspan++;
					}
	
					/* Do the actual expansion in the DOM */
					$(aoLocal[i][j].cell)
						.attr('rowspan', iRowspan)
						.attr('colspan', iColspan);
				}
			}
		}
	}
	
	
	/**
	 * Insert the required TR nodes into the table for display
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnDraw( oSettings )
	{
		/* Provide a pre-callback function which can be used to cancel the draw is false is returned */
		var aPreDraw = _fnCallbackFire( oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings] );
		if ( $.inArray( false, aPreDraw ) !== -1 )
		{
			_fnProcessingDisplay( oSettings, false );
			return;
		}
	
		var i, iLen, n;
		var anRows = [];
		var iRowCount = 0;
		var asStripeClasses = oSettings.asStripeClasses;
		var iStripes = asStripeClasses.length;
		var iOpenRows = oSettings.aoOpenRows.length;
		var oLang = oSettings.oLanguage;
		var iInitDisplayStart = oSettings.iInitDisplayStart;
		var bServerSide = _fnDataSource( oSettings ) == 'ssp';
		var aiDisplay = oSettings.aiDisplay;
	
		oSettings.bDrawing = true;
	
		/* Check and see if we have an initial draw position from state saving */
		if ( iInitDisplayStart !== undefined && iInitDisplayStart !== -1 )
		{
			oSettings._iDisplayStart = bServerSide ?
				iInitDisplayStart :
				iInitDisplayStart >= oSettings.fnRecordsDisplay() ?
					0 :
					iInitDisplayStart;
	
			oSettings.iInitDisplayStart = -1;
		}
	
		var iDisplayStart = oSettings._iDisplayStart;
		var iDisplayEnd = oSettings.fnDisplayEnd();
	
		/* Server-side processing draw intercept */
		if ( oSettings.bDeferLoading )
		{
			oSettings.bDeferLoading = false;
			oSettings.iDraw++;
			_fnProcessingDisplay( oSettings, false );
		}
		else if ( !bServerSide )
		{
			oSettings.iDraw++;
		}
		else if ( !oSettings.bDestroying && !_fnAjaxUpdate( oSettings ) )
		{
			return;
		}
	
		if ( aiDisplay.length !== 0 )
		{
			var iStart = bServerSide ? 0 : iDisplayStart;
			var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;
	
			for ( var j=iStart ; j<iEnd ; j++ )
			{
				var iDataIndex = aiDisplay[j];
				var aoData = oSettings.aoData[ iDataIndex ];
				if ( aoData.nTr === null )
				{
					_fnCreateTr( oSettings, iDataIndex );
				}
	
				var nRow = aoData.nTr;
	
				/* Remove the old striping classes and then add the new one */
				if ( iStripes !== 0 )
				{
					var sStripe = asStripeClasses[ iRowCount % iStripes ];
					if ( aoData._sRowStripe != sStripe )
					{
						$(nRow).removeClass( aoData._sRowStripe ).addClass( sStripe );
						aoData._sRowStripe = sStripe;
					}
				}
	
				// Row callback functions - might want to manipulate the row
				// iRowCount and j are not currently documented. Are they at all
				// useful?
				_fnCallbackFire( oSettings, 'aoRowCallback', null,
					[nRow, aoData._aData, iRowCount, j, iDataIndex] );
	
				anRows.push( nRow );
				iRowCount++;
			}
		}
		else
		{
			/* Table is empty - create a row with an empty message in it */
			var sZero = oLang.sZeroRecords;
			if ( oSettings.iDraw == 1 &&  _fnDataSource( oSettings ) == 'ajax' )
			{
				sZero = oLang.sLoadingRecords;
			}
			else if ( oLang.sEmptyTable && oSettings.fnRecordsTotal() === 0 )
			{
				sZero = oLang.sEmptyTable;
			}
	
			anRows[ 0 ] = $( '<tr/>', { 'class': iStripes ? asStripeClasses[0] : '' } )
				.append( $('<td />', {
					'valign':  'top',
					'colSpan': _fnVisbleColumns( oSettings ),
					'class':   oSettings.oClasses.sRowEmpty
				} ).html( sZero ) )[0];
		}
	
		/* Header and footer callbacks */
		_fnCallbackFire( oSettings, 'aoHeaderCallback', 'header', [ $(oSettings.nTHead).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		_fnCallbackFire( oSettings, 'aoFooterCallback', 'footer', [ $(oSettings.nTFoot).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		var body = $(oSettings.nTBody);
	
		body.children().detach();
		body.append( $(anRows) );
	
		/* Call all required callback functions for the end of a draw */
		_fnCallbackFire( oSettings, 'aoDrawCallback', 'draw', [oSettings] );
	
		/* Draw is complete, sorting and filtering must be as well */
		oSettings.bSorted = false;
		oSettings.bFiltered = false;
		oSettings.bDrawing = false;
	}
	
	
	/**
	 * Redraw the table - taking account of the various features which are enabled
	 *  @param {object} oSettings dataTables settings object
	 *  @param {boolean} [holdPosition] Keep the current paging position. By default
	 *    the paging is reset to the first page
	 *  @memberof DataTable#oApi
	 */
	function _fnReDraw( settings, holdPosition )
	{
		var
			features = settings.oFeatures,
			sort     = features.bSort,
			filter   = features.bFilter;
	
		if ( sort ) {
			_fnSort( settings );
		}
	
		if ( filter ) {
			_fnFilterComplete( settings, settings.oPreviousSearch );
		}
		else {
			// No filtering, so we want to just use the display master
			settings.aiDisplay = settings.aiDisplayMaster.slice();
		}
	
		if ( holdPosition !== true ) {
			settings._iDisplayStart = 0;
		}
	
		// Let any modules know about the draw hold position state (used by
		// scrolling internally)
		settings._drawHold = holdPosition;
	
		_fnDraw( settings );
	
		settings._drawHold = false;
	}
	
	
	/**
	 * Add the options to the page HTML for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAddOptionsHtml ( oSettings )
	{
		var classes = oSettings.oClasses;
		var table = $(oSettings.nTable);
		var holding = $('<div/>').insertBefore( table ); // Holding element for speed
		var features = oSettings.oFeatures;
	
		// All DataTables are wrapped in a div
		var insert = $('<div/>', {
			id:      oSettings.sTableId+'_wrapper',
			'class': classes.sWrapper + (oSettings.nTFoot ? '' : ' '+classes.sNoFooter)
		} );
	
		oSettings.nHolding = holding[0];
		oSettings.nTableWrapper = insert[0];
		oSettings.nTableReinsertBefore = oSettings.nTable.nextSibling;
	
		/* Loop over the user set positioning and place the elements as needed */
		var aDom = oSettings.sDom.split('');
		var featureNode, cOption, nNewNode, cNext, sAttr, j;
		for ( var i=0 ; i<aDom.length ; i++ )
		{
			featureNode = null;
			cOption = aDom[i];
	
			if ( cOption == '<' )
			{
				/* New container div */
				nNewNode = $('<div/>')[0];
	
				/* Check to see if we should append an id and/or a class name to the container */
				cNext = aDom[i+1];
				if ( cNext == "'" || cNext == '"' )
				{
					sAttr = "";
					j = 2;
					while ( aDom[i+j] != cNext )
					{
						sAttr += aDom[i+j];
						j++;
					}
	
					/* Replace jQuery UI constants @todo depreciated */
					if ( sAttr == "H" )
					{
						sAttr = classes.sJUIHeader;
					}
					else if ( sAttr == "F" )
					{
						sAttr = classes.sJUIFooter;
					}
	
					/* The attribute can be in the format of "#id.class", "#id" or "class" This logic
					 * breaks the string into parts and applies them as needed
					 */
					if ( sAttr.indexOf('.') != -1 )
					{
						var aSplit = sAttr.split('.');
						nNewNode.id = aSplit[0].substr(1, aSplit[0].length-1);
						nNewNode.className = aSplit[1];
					}
					else if ( sAttr.charAt(0) == "#" )
					{
						nNewNode.id = sAttr.substr(1, sAttr.length-1);
					}
					else
					{
						nNewNode.className = sAttr;
					}
	
					i += j; /* Move along the position array */
				}
	
				insert.append( nNewNode );
				insert = $(nNewNode);
			}
			else if ( cOption == '>' )
			{
				/* End container div */
				insert = insert.parent();
			}
			// @todo Move options into their own plugins?
			else if ( cOption == 'l' && features.bPaginate && features.bLengthChange )
			{
				/* Length */
				featureNode = _fnFeatureHtmlLength( oSettings );
			}
			else if ( cOption == 'f' && features.bFilter )
			{
				/* Filter */
				featureNode = _fnFeatureHtmlFilter( oSettings );
			}
			else if ( cOption == 'r' && features.bProcessing )
			{
				/* pRocessing */
				featureNode = _fnFeatureHtmlProcessing( oSettings );
			}
			else if ( cOption == 't' )
			{
				/* Table */
				featureNode = _fnFeatureHtmlTable( oSettings );
			}
			else if ( cOption ==  'i' && features.bInfo )
			{
				/* Info */
				featureNode = _fnFeatureHtmlInfo( oSettings );
			}
			else if ( cOption == 'p' && features.bPaginate )
			{
				/* Pagination */
				featureNode = _fnFeatureHtmlPaginate( oSettings );
			}
			else if ( DataTable.ext.feature.length !== 0 )
			{
				/* Plug-in features */
				var aoFeatures = DataTable.ext.feature;
				for ( var k=0, kLen=aoFeatures.length ; k<kLen ; k++ )
				{
					if ( cOption == aoFeatures[k].cFeature )
					{
						featureNode = aoFeatures[k].fnInit( oSettings );
						break;
					}
				}
			}
	
			/* Add to the 2D features array */
			if ( featureNode )
			{
				var aanFeatures = oSettings.aanFeatures;
	
				if ( ! aanFeatures[cOption] )
				{
					aanFeatures[cOption] = [];
				}
	
				aanFeatures[cOption].push( featureNode );
				insert.append( featureNode );
			}
		}
	
		/* Built our DOM structure - replace the holding div with what we want */
		holding.replaceWith( insert );
		oSettings.nHolding = null;
	}
	
	
	/**
	 * Use the DOM source to create up an array of header cells. The idea here is to
	 * create a layout grid (array) of rows x columns, which contains a reference
	 * to the cell that that point in the grid (regardless of col/rowspan), such that
	 * any column / row could be removed and the new grid constructed
	 *  @param array {object} aLayout Array to store the calculated layout in
	 *  @param {node} nThead The header/footer element for the table
	 *  @memberof DataTable#oApi
	 */
	function _fnDetectHeader ( aLayout, nThead )
	{
		var nTrs = $(nThead).children('tr');
		var nTr, nCell;
		var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;
		var bUnique;
		var fnShiftCol = function ( a, i, j ) {
			var k = a[i];
	                while ( k[j] ) {
				j++;
			}
			return j;
		};
	
		aLayout.splice( 0, aLayout.length );
	
		/* We know how many rows there are in the layout - so prep it */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			aLayout.push( [] );
		}
	
		/* Calculate a layout array */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			nTr = nTrs[i];
			iColumn = 0;
	
			/* For every cell in the row... */
			nCell = nTr.firstChild;
			while ( nCell ) {
				if ( nCell.nodeName.toUpperCase() == "TD" ||
				     nCell.nodeName.toUpperCase() == "TH" )
				{
					/* Get the col and rowspan attributes from the DOM and sanitise them */
					iColspan = nCell.getAttribute('colspan') * 1;
					iRowspan = nCell.getAttribute('rowspan') * 1;
					iColspan = (!iColspan || iColspan===0 || iColspan===1) ? 1 : iColspan;
					iRowspan = (!iRowspan || iRowspan===0 || iRowspan===1) ? 1 : iRowspan;
	
					/* There might be colspan cells already in this row, so shift our target
					 * accordingly
					 */
					iColShifted = fnShiftCol( aLayout, i, iColumn );
	
					/* Cache calculation for unique columns */
					bUnique = iColspan === 1 ? true : false;
	
					/* If there is col / rowspan, copy the information into the layout grid */
					for ( l=0 ; l<iColspan ; l++ )
					{
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aLayout[i+k][iColShifted+l] = {
								"cell": nCell,
								"unique": bUnique
							};
							aLayout[i+k].nTr = nTr;
						}
					}
				}
				nCell = nCell.nextSibling;
			}
		}
	}
	
	
	/**
	 * Get an array of unique th elements, one for each column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nHeader automatically detect the layout from this node - optional
	 *  @param {array} aLayout thead/tfoot layout from _fnDetectHeader - optional
	 *  @returns array {node} aReturn list of unique th's
	 *  @memberof DataTable#oApi
	 */
	function _fnGetUniqueThs ( oSettings, nHeader, aLayout )
	{
		var aReturn = [];
		if ( !aLayout )
		{
			aLayout = oSettings.aoHeader;
			if ( nHeader )
			{
				aLayout = [];
				_fnDetectHeader( aLayout, nHeader );
			}
		}
	
		for ( var i=0, iLen=aLayout.length ; i<iLen ; i++ )
		{
			for ( var j=0, jLen=aLayout[i].length ; j<jLen ; j++ )
			{
				if ( aLayout[i][j].unique &&
					 (!aReturn[j] || !oSettings.bSortCellsTop) )
				{
					aReturn[j] = aLayout[i][j].cell;
				}
			}
		}
	
		return aReturn;
	}
	
	/**
	 * Create an Ajax call based on the table's settings, taking into account that
	 * parameters can have multiple forms, and backwards compatibility.
	 *
	 * @param {object} oSettings dataTables settings object
	 * @param {array} data Data to send to the server, required by
	 *     DataTables - may be augmented by developer callbacks
	 * @param {function} fn Callback function to run when data is obtained
	 */
	function _fnBuildAjax( oSettings, data, fn )
	{
		// Compatibility with 1.9-, allow fnServerData and event to manipulate
		_fnCallbackFire( oSettings, 'aoServerParams', 'serverParams', [data] );
	
		// Convert to object based for 1.10+ if using the old array scheme which can
		// come from server-side processing or serverParams
		if ( data && Array.isArray(data) ) {
			var tmp = {};
			var rbracket = /(.*?)\[\]$/;
	
			$.each( data, function (key, val) {
				var match = val.name.match(rbracket);
	
				if ( match ) {
					// Support for arrays
					var name = match[0];
	
					if ( ! tmp[ name ] ) {
						tmp[ name ] = [];
					}
					tmp[ name ].push( val.value );
				}
				else {
					tmp[val.name] = val.value;
				}
			} );
			data = tmp;
		}
	
		var ajaxData;
		var ajax = oSettings.ajax;
		var instance = oSettings.oInstance;
		var callback = function ( json ) {
			_fnCallbackFire( oSettings, null, 'xhr', [oSettings, json, oSettings.jqXHR] );
			fn( json );
		};
	
		if ( $.isPlainObject( ajax ) && ajax.data )
		{
			ajaxData = ajax.data;
	
			var newData = typeof ajaxData === 'function' ?
				ajaxData( data, oSettings ) :  // fn can manipulate data or return
				ajaxData;                      // an object object or array to merge
	
			// If the function returned something, use that alone
			data = typeof ajaxData === 'function' && newData ?
				newData :
				$.extend( true, data, newData );
	
			// Remove the data property as we've resolved it already and don't want
			// jQuery to do it again (it is restored at the end of the function)
			delete ajax.data;
		}
	
		var baseAjax = {
			"data": data,
			"success": function (json) {
				var error = json.error || json.sError;
				if ( error ) {
					_fnLog( oSettings, 0, error );
				}
	
				oSettings.json = json;
				callback( json );
			},
			"dataType": "json",
			"cache": false,
			"type": oSettings.sServerMethod,
			"error": function (xhr, error, thrown) {
				var ret = _fnCallbackFire( oSettings, null, 'xhr', [oSettings, null, oSettings.jqXHR] );
	
				if ( $.inArray( true, ret ) === -1 ) {
					if ( error == "parsererror" ) {
						_fnLog( oSettings, 0, 'Invalid JSON response', 1 );
					}
					else if ( xhr.readyState === 4 ) {
						_fnLog( oSettings, 0, 'Ajax error', 7 );
					}
				}
	
				_fnProcessingDisplay( oSettings, false );
			}
		};
	
		// Store the data submitted for the API
		oSettings.oAjaxData = data;
	
		// Allow plug-ins and external processes to modify the data
		_fnCallbackFire( oSettings, null, 'preXhr', [oSettings, data] );
	
		if ( oSettings.fnServerData )
		{
			// DataTables 1.9- compatibility
			oSettings.fnServerData.call( instance,
				oSettings.sAjaxSource,
				$.map( data, function (val, key) { // Need to convert back to 1.9 trad format
					return { name: key, value: val };
				} ),
				callback,
				oSettings
			);
		}
		else if ( oSettings.sAjaxSource || typeof ajax === 'string' )
		{
			// DataTables 1.9- compatibility
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, {
				url: ajax || oSettings.sAjaxSource
			} ) );
		}
		else if ( typeof ajax === 'function' )
		{
			// Is a function - let the caller define what needs to be done
			oSettings.jqXHR = ajax.call( instance, data, callback, oSettings );
		}
		else
		{
			// Object to extend the base settings
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, ajax ) );
	
			// Restore for next time around
			ajax.data = ajaxData;
		}
	}
	
	
	/**
	 * Update the table using an Ajax call
	 *  @param {object} settings dataTables settings object
	 *  @returns {boolean} Block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdate( settings )
	{
		if ( settings.bAjaxDataGet ) {
			settings.iDraw++;
			_fnProcessingDisplay( settings, true );
	
			_fnBuildAjax(
				settings,
				_fnAjaxParameters( settings ),
				function(json) {
					_fnAjaxUpdateDraw( settings, json );
				}
			);
	
			return false;
		}
		return true;
	}
	
	
	/**
	 * Build up the parameters in an object needed for a server-side processing
	 * request. Note that this is basically done twice, is different ways - a modern
	 * method which is used by default in DataTables 1.10 which uses objects and
	 * arrays, or the 1.9- method with is name / value pairs. 1.9 method is used if
	 * the sAjaxSource option is used in the initialisation, or the legacyAjax
	 * option is set.
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {bool} block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxParameters( settings )
	{
		var
			columns = settings.aoColumns,
			columnCount = columns.length,
			features = settings.oFeatures,
			preSearch = settings.oPreviousSearch,
			preColSearch = settings.aoPreSearchCols,
			i, data = [], dataProp, column, columnSearch,
			sort = _fnSortFlatten( settings ),
			displayStart = settings._iDisplayStart,
			displayLength = features.bPaginate !== false ?
				settings._iDisplayLength :
				-1;
	
		var param = function ( name, value ) {
			data.push( { 'name': name, 'value': value } );
		};
	
		// DataTables 1.9- compatible method
		param( 'sEcho',          settings.iDraw );
		param( 'iColumns',       columnCount );
		param( 'sColumns',       _pluck( columns, 'sName' ).join(',') );
		param( 'iDisplayStart',  displayStart );
		param( 'iDisplayLength', displayLength );
	
		// DataTables 1.10+ method
		var d = {
			draw:    settings.iDraw,
			columns: [],
			order:   [],
			start:   displayStart,
			length:  displayLength,
			search:  {
				value: preSearch.sSearch,
				regex: preSearch.bRegex
			}
		};
	
		for ( i=0 ; i<columnCount ; i++ ) {
			column = columns[i];
			columnSearch = preColSearch[i];
			dataProp = typeof column.mData=="function" ? 'function' : column.mData ;
	
			d.columns.push( {
				data:       dataProp,
				name:       column.sName,
				searchable: column.bSearchable,
				orderable:  column.bSortable,
				search:     {
					value: columnSearch.sSearch,
					regex: columnSearch.bRegex
				}
			} );
	
			param( "mDataProp_"+i, dataProp );
	
			if ( features.bFilter ) {
				param( 'sSearch_'+i,     columnSearch.sSearch );
				param( 'bRegex_'+i,      columnSearch.bRegex );
				param( 'bSearchable_'+i, column.bSearchable );
			}
	
			if ( features.bSort ) {
				param( 'bSortable_'+i, column.bSortable );
			}
		}
	
		if ( features.bFilter ) {
			param( 'sSearch', preSearch.sSearch );
			param( 'bRegex', preSearch.bRegex );
		}
	
		if ( features.bSort ) {
			$.each( sort, function ( i, val ) {
				d.order.push( { column: val.col, dir: val.dir } );
	
				param( 'iSortCol_'+i, val.col );
				param( 'sSortDir_'+i, val.dir );
			} );
	
			param( 'iSortingCols', sort.length );
		}
	
		// If the legacy.ajax parameter is null, then we automatically decide which
		// form to use, based on sAjaxSource
		var legacy = DataTable.ext.legacy.ajax;
		if ( legacy === null ) {
			return settings.sAjaxSource ? data : d;
		}
	
		// Otherwise, if legacy has been specified then we use that to decide on the
		// form
		return legacy ? data : d;
	}
	
	
	/**
	 * Data the data from the server (nuking the old) and redraw the table
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} json json data return from the server.
	 *  @param {string} json.sEcho Tracking flag for DataTables to match requests
	 *  @param {int} json.iTotalRecords Number of records in the data set, not accounting for filtering
	 *  @param {int} json.iTotalDisplayRecords Number of records in the data set, accounting for filtering
	 *  @param {array} json.aaData The data to display on this page
	 *  @param {string} [json.sColumns] Column ordering (sName, comma separated)
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdateDraw ( settings, json )
	{
		// v1.10 uses camelCase variables, while 1.9 uses Hungarian notation.
		// Support both
		var compat = function ( old, modern ) {
			return json[old] !== undefined ? json[old] : json[modern];
		};
	
		var data = _fnAjaxDataSrc( settings, json );
		var draw            = compat( 'sEcho',                'draw' );
		var recordsTotal    = compat( 'iTotalRecords',        'recordsTotal' );
		var recordsFiltered = compat( 'iTotalDisplayRecords', 'recordsFiltered' );
	
		if ( draw !== undefined ) {
			// Protect against out of sequence returns
			if ( draw*1 < settings.iDraw ) {
				return;
			}
			settings.iDraw = draw * 1;
		}
	
		_fnClearTable( settings );
		settings._iRecordsTotal   = parseInt(recordsTotal, 10);
		settings._iRecordsDisplay = parseInt(recordsFiltered, 10);
	
		for ( var i=0, ien=data.length ; i<ien ; i++ ) {
			_fnAddData( settings, data[i] );
		}
		settings.aiDisplay = settings.aiDisplayMaster.slice();
	
		settings.bAjaxDataGet = false;
		_fnDraw( settings );
	
		if ( ! settings._bInitComplete ) {
			_fnInitComplete( settings, json );
		}
	
		settings.bAjaxDataGet = true;
		_fnProcessingDisplay( settings, false );
	}
	
	
	/**
	 * Get the data from the JSON data source to use for drawing a table. Using
	 * `_fnGetObjectDataFn` allows the data to be sourced from a property of the
	 * source object, or from a processing function.
	 *  @param {object} oSettings dataTables settings object
	 *  @param  {object} json Data source object / array from the server
	 *  @return {array} Array of data to use
	 */
	function _fnAjaxDataSrc ( oSettings, json )
	{
		var dataSrc = $.isPlainObject( oSettings.ajax ) && oSettings.ajax.dataSrc !== undefined ?
			oSettings.ajax.dataSrc :
			oSettings.sAjaxDataProp; // Compatibility with 1.9-.
	
		// Compatibility with 1.9-. In order to read from aaData, check if the
		// default has been changed, if not, check for aaData
		if ( dataSrc === 'data' ) {
			return json.aaData || json[dataSrc];
		}
	
		return dataSrc !== "" ?
			_fnGetObjectDataFn( dataSrc )( json ) :
			json;
	}
	
	/**
	 * Generate the node required for filtering text
	 *  @returns {node} Filter control element
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlFilter ( settings )
	{
		var classes = settings.oClasses;
		var tableId = settings.sTableId;
		var language = settings.oLanguage;
		var previousSearch = settings.oPreviousSearch;
		var features = settings.aanFeatures;
		var input = '<input type="search" class="'+classes.sFilterInput+'"/>';
	
		var str = language.sSearch;
		str = str.match(/_INPUT_/) ?
			str.replace('_INPUT_', input) :
			str+input;
	
		var filter = $('<div/>', {
				'id': ! features.f ? tableId+'_filter' : null,
				'class': classes.sFilter
			} )
			.append( $('<label/>' ).append( str ) );
	
		var searchFn = function() {
			/* Update all other filter input elements for the new display */
			var n = features.f;
			var val = !this.value ? "" : this.value; // mental IE8 fix :-(
	
			/* Now do the filter */
			if ( val != previousSearch.sSearch ) {
				_fnFilterComplete( settings, {
					"sSearch": val,
					"bRegex": previousSearch.bRegex,
					"bSmart": previousSearch.bSmart ,
					"bCaseInsensitive": previousSearch.bCaseInsensitive
				} );
	
				// Need to redraw, without resorting
				settings._iDisplayStart = 0;
				_fnDraw( settings );
			}
		};
	
		var searchDelay = settings.searchDelay !== null ?
			settings.searchDelay :
			_fnDataSource( settings ) === 'ssp' ?
				400 :
				0;
	
		var jqFilter = $('input', filter)
			.val( previousSearch.sSearch )
			.attr( 'placeholder', language.sSearchPlaceholder )
			.on(
				'keyup.DT search.DT input.DT paste.DT cut.DT',
				searchDelay ?
					_fnThrottle( searchFn, searchDelay ) :
					searchFn
			)
			.on( 'mouseup', function(e) {
				// Edge fix! Edge 17 does not trigger anything other than mouse events when clicking
				// on the clear icon (Edge bug 17584515). This is safe in other browsers as `searchFn`
				// checks the value to see if it has changed. In other browsers it won't have.
				setTimeout( function () {
					searchFn.call(jqFilter[0]);
				}, 10);
			} )
			.on( 'keypress.DT', function(e) {
				/* Prevent form submission */
				if ( e.keyCode == 13 ) {
					return false;
				}
			} )
			.attr('aria-controls', tableId);
	
		// Update the input elements whenever the table is filtered
		$(settings.nTable).on( 'search.dt.DT', function ( ev, s ) {
			if ( settings === s ) {
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame...
				try {
					if ( jqFilter[0] !== document.activeElement ) {
						jqFilter.val( previousSearch.sSearch );
					}
				}
				catch ( e ) {}
			}
		} );
	
		return filter[0];
	}
	
	
	/**
	 * Filter the table using both the global filter and column based filtering
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oSearch search information
	 *  @param {int} [iForce] force a research of the master array (1) or not (undefined or 0)
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterComplete ( oSettings, oInput, iForce )
	{
		var oPrevSearch = oSettings.oPreviousSearch;
		var aoPrevSearch = oSettings.aoPreSearchCols;
		var fnSaveFilter = function ( oFilter ) {
			/* Save the filtering values */
			oPrevSearch.sSearch = oFilter.sSearch;
			oPrevSearch.bRegex = oFilter.bRegex;
			oPrevSearch.bSmart = oFilter.bSmart;
			oPrevSearch.bCaseInsensitive = oFilter.bCaseInsensitive;
		};
		var fnRegex = function ( o ) {
			// Backwards compatibility with the bEscapeRegex option
			return o.bEscapeRegex !== undefined ? !o.bEscapeRegex : o.bRegex;
		};
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo As per sort - can this be moved into an event handler?
		_fnColumnTypes( oSettings );
	
		/* In server-side processing all filtering is done by the server, so no point hanging around here */
		if ( _fnDataSource( oSettings ) != 'ssp' )
		{
			/* Global filter */
			_fnFilter( oSettings, oInput.sSearch, iForce, fnRegex(oInput), oInput.bSmart, oInput.bCaseInsensitive );
			fnSaveFilter( oInput );
	
			/* Now do the individual column filter */
			for ( var i=0 ; i<aoPrevSearch.length ; i++ )
			{
				_fnFilterColumn( oSettings, aoPrevSearch[i].sSearch, i, fnRegex(aoPrevSearch[i]),
					aoPrevSearch[i].bSmart, aoPrevSearch[i].bCaseInsensitive );
			}
	
			/* Custom filtering */
			_fnFilterCustom( oSettings );
		}
		else
		{
			fnSaveFilter( oInput );
		}
	
		/* Tell the draw function we have been filtering */
		oSettings.bFiltered = true;
		_fnCallbackFire( oSettings, null, 'search', [oSettings] );
	}
	
	
	/**
	 * Apply custom filtering functions
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCustom( settings )
	{
		var filters = DataTable.ext.search;
		var displayRows = settings.aiDisplay;
		var row, rowIdx;
	
		for ( var i=0, ien=filters.length ; i<ien ; i++ ) {
			var rows = [];
	
			// Loop over each row and see if it should be included
			for ( var j=0, jen=displayRows.length ; j<jen ; j++ ) {
				rowIdx = displayRows[ j ];
				row = settings.aoData[ rowIdx ];
	
				if ( filters[i]( settings, row._aFilterData, rowIdx, row._aData, j ) ) {
					rows.push( rowIdx );
				}
			}
	
			// So the array reference doesn't break set the results into the
			// existing array
			displayRows.length = 0;
			$.merge( displayRows, rows );
		}
	}
	
	
	/**
	 * Filter the table on a per-column basis
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sInput string to filter on
	 *  @param {int} iColumn column to filter
	 *  @param {bool} bRegex treat search string as a regular expression or not
	 *  @param {bool} bSmart use smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterColumn ( settings, searchStr, colIdx, regex, smart, caseInsensitive )
	{
		if ( searchStr === '' ) {
			return;
		}
	
		var data;
		var out = [];
		var display = settings.aiDisplay;
		var rpSearch = _fnFilterCreateSearch( searchStr, regex, smart, caseInsensitive );
	
		for ( var i=0 ; i<display.length ; i++ ) {
			data = settings.aoData[ display[i] ]._aFilterData[ colIdx ];
	
			if ( rpSearch.test( data ) ) {
				out.push( display[i] );
			}
		}
	
		settings.aiDisplay = out;
	}
	
	
	/**
	 * Filter the data table based on user input and draw the table
	 *  @param {object} settings dataTables settings object
	 *  @param {string} input string to filter on
	 *  @param {int} force optional - force a research of the master array (1) or not (undefined or 0)
	 *  @param {bool} regex treat as a regular expression or not
	 *  @param {bool} smart perform smart filtering or not
	 *  @param {bool} caseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilter( settings, input, force, regex, smart, caseInsensitive )
	{
		var rpSearch = _fnFilterCreateSearch( input, regex, smart, caseInsensitive );
		var prevSearch = settings.oPreviousSearch.sSearch;
		var displayMaster = settings.aiDisplayMaster;
		var display, invalidated, i;
		var filtered = [];
	
		// Need to take account of custom filtering functions - always filter
		if ( DataTable.ext.search.length !== 0 ) {
			force = true;
		}
	
		// Check if any of the rows were invalidated
		invalidated = _fnFilterData( settings );
	
		// If the input is blank - we just want the full data set
		if ( input.length <= 0 ) {
			settings.aiDisplay = displayMaster.slice();
		}
		else {
			// New search - start from the master array
			if ( invalidated ||
				 force ||
				 regex ||
				 prevSearch.length > input.length ||
				 input.indexOf(prevSearch) !== 0 ||
				 settings.bSorted // On resort, the display master needs to be
				                  // re-filtered since indexes will have changed
			) {
				settings.aiDisplay = displayMaster.slice();
			}
	
			// Search the display array
			display = settings.aiDisplay;
	
			for ( i=0 ; i<display.length ; i++ ) {
				if ( rpSearch.test( settings.aoData[ display[i] ]._sFilterRow ) ) {
					filtered.push( display[i] );
				}
			}
	
			settings.aiDisplay = filtered;
		}
	}
	
	
	/**
	 * Build a regular expression object suitable for searching a table
	 *  @param {string} sSearch string to search for
	 *  @param {bool} bRegex treat as a regular expression or not
	 *  @param {bool} bSmart perform smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insensitive matching or not
	 *  @returns {RegExp} constructed object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCreateSearch( search, regex, smart, caseInsensitive )
	{
		search = regex ?
			search :
			_fnEscapeRegex( search );
		
		if ( smart ) {
			/* For smart filtering we want to allow the search to work regardless of
			 * word order. We also want double quoted text to be preserved, so word
			 * order is important - a la google. So this is what we want to
			 * generate:
			 * 
			 * ^(?=.*?\bone\b)(?=.*?\btwo three\b)(?=.*?\bfour\b).*$
			 */
			var a = $.map( search.match( /"[^"]+"|[^ ]+/g ) || [''], function ( word ) {
				if ( word.charAt(0) === '"' ) {
					var m = word.match( /^"(.*)"$/ );
					word = m ? m[1] : word;
				}
	
				return word.replace('"', '');
			} );
	
			search = '^(?=.*?'+a.join( ')(?=.*?' )+').*$';
		}
	
		return new RegExp( search, caseInsensitive ? 'i' : '' );
	}
	
	
	/**
	 * Escape a string such that it can be used in a regular expression
	 *  @param {string} sVal string to escape
	 *  @returns {string} escaped string
	 *  @memberof DataTable#oApi
	 */
	var _fnEscapeRegex = DataTable.util.escapeRegex;
	
	var __filter_div = $('<div>')[0];
	var __filter_div_textContent = __filter_div.textContent !== undefined;
	
	// Update the filtering data for each row if needed (by invalidation or first run)
	function _fnFilterData ( settings )
	{
		var columns = settings.aoColumns;
		var column;
		var i, j, ien, jen, filterData, cellData, row;
		var fomatters = DataTable.ext.type.search;
		var wasInvalidated = false;
	
		for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aFilterData ) {
				filterData = [];
	
				for ( j=0, jen=columns.length ; j<jen ; j++ ) {
					column = columns[j];
	
					if ( column.bSearchable ) {
						cellData = _fnGetCellData( settings, i, j, 'filter' );
	
						if ( fomatters[ column.sType ] ) {
							cellData = fomatters[ column.sType ]( cellData );
						}
	
						// Search in DataTables 1.10 is string based. In 1.11 this
						// should be altered to also allow strict type checking.
						if ( cellData === null ) {
							cellData = '';
						}
	
						if ( typeof cellData !== 'string' && cellData.toString ) {
							cellData = cellData.toString();
						}
					}
					else {
						cellData = '';
					}
	
					// If it looks like there is an HTML entity in the string,
					// attempt to decode it so sorting works as expected. Note that
					// we could use a single line of jQuery to do this, but the DOM
					// method used here is much faster http://jsperf.com/html-decode
					if ( cellData.indexOf && cellData.indexOf('&') !== -1 ) {
						__filter_div.innerHTML = cellData;
						cellData = __filter_div_textContent ?
							__filter_div.textContent :
							__filter_div.innerText;
					}
	
					if ( cellData.replace ) {
						cellData = cellData.replace(/[\r\n\u2028]/g, '');
					}
	
					filterData.push( cellData );
				}
	
				row._aFilterData = filterData;
				row._sFilterRow = filterData.join('  ');
				wasInvalidated = true;
			}
		}
	
		return wasInvalidated;
	}
	
	
	/**
	 * Convert from the internal Hungarian notation to camelCase for external
	 * interaction
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToCamel ( obj )
	{
		return {
			search:          obj.sSearch,
			smart:           obj.bSmart,
			regex:           obj.bRegex,
			caseInsensitive: obj.bCaseInsensitive
		};
	}
	
	
	
	/**
	 * Convert from camelCase notation to the internal Hungarian. We could use the
	 * Hungarian convert function here, but this is cleaner
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToHung ( obj )
	{
		return {
			sSearch:          obj.search,
			bSmart:           obj.smart,
			bRegex:           obj.regex,
			bCaseInsensitive: obj.caseInsensitive
		};
	}
	
	/**
	 * Generate the node required for the info display
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Information element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlInfo ( settings )
	{
		var
			tid = settings.sTableId,
			nodes = settings.aanFeatures.i,
			n = $('<div/>', {
				'class': settings.oClasses.sInfo,
				'id': ! nodes ? tid+'_info' : null
			} );
	
		if ( ! nodes ) {
			// Update display on each draw
			settings.aoDrawCallback.push( {
				"fn": _fnUpdateInfo,
				"sName": "information"
			} );
	
			n
				.attr( 'role', 'status' )
				.attr( 'aria-live', 'polite' );
	
			// Table is described by our info div
			$(settings.nTable).attr( 'aria-describedby', tid+'_info' );
		}
	
		return n[0];
	}
	
	
	/**
	 * Update the information elements in the display
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnUpdateInfo ( settings )
	{
		/* Show information about the table */
		var nodes = settings.aanFeatures.i;
		if ( nodes.length === 0 ) {
			return;
		}
	
		var
			lang  = settings.oLanguage,
			start = settings._iDisplayStart+1,
			end   = settings.fnDisplayEnd(),
			max   = settings.fnRecordsTotal(),
			total = settings.fnRecordsDisplay(),
			out   = total ?
				lang.sInfo :
				lang.sInfoEmpty;
	
		if ( total !== max ) {
			/* Record set after filtering */
			out += ' ' + lang.sInfoFiltered;
		}
	
		// Convert the macros
		out += lang.sInfoPostFix;
		out = _fnInfoMacros( settings, out );
	
		var callback = lang.fnInfoCallback;
		if ( callback !== null ) {
			out = callback.call( settings.oInstance,
				settings, start, end, max, total, out
			);
		}
	
		$(nodes).html( out );
	}
	
	
	function _fnInfoMacros ( settings, str )
	{
		// When infinite scrolling, we are always starting at 1. _iDisplayStart is used only
		// internally
		var
			formatter  = settings.fnFormatNumber,
			start      = settings._iDisplayStart+1,
			len        = settings._iDisplayLength,
			vis        = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return str.
			replace(/_START_/g, formatter.call( settings, start ) ).
			replace(/_END_/g,   formatter.call( settings, settings.fnDisplayEnd() ) ).
			replace(/_MAX_/g,   formatter.call( settings, settings.fnRecordsTotal() ) ).
			replace(/_TOTAL_/g, formatter.call( settings, vis ) ).
			replace(/_PAGE_/g,  formatter.call( settings, all ? 1 : Math.ceil( start / len ) ) ).
			replace(/_PAGES_/g, formatter.call( settings, all ? 1 : Math.ceil( vis / len ) ) );
	}
	
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnInitialise ( settings )
	{
		var i, iLen, iAjaxStart=settings.iInitDisplayStart;
		var columns = settings.aoColumns, column;
		var features = settings.oFeatures;
		var deferLoading = settings.bDeferLoading; // value modified by the draw
	
		/* Ensure that the table data is fully initialised */
		if ( ! settings.bInitialised ) {
			setTimeout( function(){ _fnInitialise( settings ); }, 200 );
			return;
		}
	
		/* Show the display HTML options */
		_fnAddOptionsHtml( settings );
	
		/* Build and draw the header / footer for the table */
		_fnBuildHead( settings );
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );
	
		/* Okay to show that something is going on now */
		_fnProcessingDisplay( settings, true );
	
		/* Calculate sizes for columns */
		if ( features.bAutoWidth ) {
			_fnCalculateColumnWidths( settings );
		}
	
		for ( i=0, iLen=columns.length ; i<iLen ; i++ ) {
			column = columns[i];
	
			if ( column.sWidth ) {
				column.nTh.style.width = _fnStringToCss( column.sWidth );
			}
		}
	
		_fnCallbackFire( settings, null, 'preInit', [settings] );
	
		// If there is default sorting required - let's do it. The sort function
		// will do the drawing for us. Otherwise we draw the table regardless of the
		// Ajax source - this allows the table to look initialised for Ajax sourcing
		// data (show 'loading' message possibly)
		_fnReDraw( settings );
	
		// Server-side processing init complete is done by _fnAjaxUpdateDraw
		var dataSrc = _fnDataSource( settings );
		if ( dataSrc != 'ssp' || deferLoading ) {
			// if there is an ajax source load the data
			if ( dataSrc == 'ajax' ) {
				_fnBuildAjax( settings, [], function(json) {
					var aData = _fnAjaxDataSrc( settings, json );
	
					// Got the data - add it to the table
					for ( i=0 ; i<aData.length ; i++ ) {
						_fnAddData( settings, aData[i] );
					}
	
					// Reset the init display for cookie saving. We've already done
					// a filter, and therefore cleared it before. So we need to make
					// it appear 'fresh'
					settings.iInitDisplayStart = iAjaxStart;
	
					_fnReDraw( settings );
	
					_fnProcessingDisplay( settings, false );
					_fnInitComplete( settings, json );
				}, settings );
			}
			else {
				_fnProcessingDisplay( settings, false );
				_fnInitComplete( settings );
			}
		}
	}
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} [json] JSON from the server that completed the table, if using Ajax source
	 *    with client-side processing (optional)
	 *  @memberof DataTable#oApi
	 */
	function _fnInitComplete ( settings, json )
	{
		settings._bInitComplete = true;
	
		// When data was added after the initialisation (data or Ajax) we need to
		// calculate the column sizing
		if ( json || settings.oInit.aaData ) {
			_fnAdjustColumnSizing( settings );
		}
	
		_fnCallbackFire( settings, null, 'plugin-init', [settings, json] );
		_fnCallbackFire( settings, 'aoInitComplete', 'init', [settings, json] );
	}
	
	
	function _fnLengthChange ( settings, val )
	{
		var len = parseInt( val, 10 );
		settings._iDisplayLength = len;
	
		_fnLengthOverflow( settings );
	
		// Fire length change event
		_fnCallbackFire( settings, null, 'length', [settings, len] );
	}
	
	
	/**
	 * Generate the node required for user display length changing
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Display length feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlLength ( settings )
	{
		var
			classes  = settings.oClasses,
			tableId  = settings.sTableId,
			menu     = settings.aLengthMenu,
			d2       = Array.isArray( menu[0] ),
			lengths  = d2 ? menu[0] : menu,
			language = d2 ? menu[1] : menu;
	
		var select = $('<select/>', {
			'name':          tableId+'_length',
			'aria-controls': tableId,
			'class':         classes.sLengthSelect
		} );
	
		for ( var i=0, ien=lengths.length ; i<ien ; i++ ) {
			select[0][ i ] = new Option(
				typeof language[i] === 'number' ?
					settings.fnFormatNumber( language[i] ) :
					language[i],
				lengths[i]
			);
		}
	
		var div = $('<div><label/></div>').addClass( classes.sLength );
		if ( ! settings.aanFeatures.l ) {
			div[0].id = tableId+'_length';
		}
	
		div.children().append(
			settings.oLanguage.sLengthMenu.replace( '_MENU_', select[0].outerHTML )
		);
	
		// Can't use `select` variable as user might provide their own and the
		// reference is broken by the use of outerHTML
		$('select', div)
			.val( settings._iDisplayLength )
			.on( 'change.DT', function(e) {
				_fnLengthChange( settings, $(this).val() );
				_fnDraw( settings );
			} );
	
		// Update node value whenever anything changes the table's length
		$(settings.nTable).on( 'length.dt.DT', function (e, s, len) {
			if ( settings === s ) {
				$('select', div).val( len );
			}
		} );
	
		return div[0];
	}
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Note that most of the paging logic is done in
	 * DataTable.ext.pager
	 */
	
	/**
	 * Generate the node required for default pagination
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Pagination feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlPaginate ( settings )
	{
		var
			type   = settings.sPaginationType,
			plugin = DataTable.ext.pager[ type ],
			modern = typeof plugin === 'function',
			redraw = function( settings ) {
				_fnDraw( settings );
			},
			node = $('<div/>').addClass( settings.oClasses.sPaging + type )[0],
			features = settings.aanFeatures;
	
		if ( ! modern ) {
			plugin.fnInit( settings, node, redraw );
		}
	
		/* Add a draw callback for the pagination on first instance, to update the paging display */
		if ( ! features.p )
		{
			node.id = settings.sTableId+'_paginate';
	
			settings.aoDrawCallback.push( {
				"fn": function( settings ) {
					if ( modern ) {
						var
							start      = settings._iDisplayStart,
							len        = settings._iDisplayLength,
							visRecords = settings.fnRecordsDisplay(),
							all        = len === -1,
							page = all ? 0 : Math.ceil( start / len ),
							pages = all ? 1 : Math.ceil( visRecords / len ),
							buttons = plugin(page, pages),
							i, ien;
	
						for ( i=0, ien=features.p.length ; i<ien ; i++ ) {
							_fnRenderer( settings, 'pageButton' )(
								settings, features.p[i], i, buttons, page, pages
							);
						}
					}
					else {
						plugin.fnUpdate( settings, redraw );
					}
				},
				"sName": "pagination"
			} );
		}
	
		return node;
	}
	
	
	/**
	 * Alter the display settings to change the page
	 *  @param {object} settings DataTables settings object
	 *  @param {string|int} action Paging action to take: "first", "previous",
	 *    "next" or "last" or page number to jump to (integer)
	 *  @param [bool] redraw Automatically draw the update or not
	 *  @returns {bool} true page has changed, false - no change
	 *  @memberof DataTable#oApi
	 */
	function _fnPageChange ( settings, action, redraw )
	{
		var
			start     = settings._iDisplayStart,
			len       = settings._iDisplayLength,
			records   = settings.fnRecordsDisplay();
	
		if ( records === 0 || len === -1 )
		{
			start = 0;
		}
		else if ( typeof action === "number" )
		{
			start = action * len;
	
			if ( start > records )
			{
				start = 0;
			}
		}
		else if ( action == "first" )
		{
			start = 0;
		}
		else if ( action == "previous" )
		{
			start = len >= 0 ?
				start - len :
				0;
	
			if ( start < 0 )
			{
			  start = 0;
			}
		}
		else if ( action == "next" )
		{
			if ( start + len < records )
			{
				start += len;
			}
		}
		else if ( action == "last" )
		{
			start = Math.floor( (records-1) / len) * len;
		}
		else
		{
			_fnLog( settings, 0, "Unknown paging action: "+action, 5 );
		}
	
		var changed = settings._iDisplayStart !== start;
		settings._iDisplayStart = start;
	
		if ( changed ) {
			_fnCallbackFire( settings, null, 'page', [settings] );
	
			if ( redraw ) {
				_fnDraw( settings );
			}
		}
	
		return changed;
	}
	
	
	
	/**
	 * Generate the node required for the processing node
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Processing element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlProcessing ( settings )
	{
		return $('<div/>', {
				'id': ! settings.aanFeatures.r ? settings.sTableId+'_processing' : null,
				'class': settings.oClasses.sProcessing
			} )
			.html( settings.oLanguage.sProcessing )
			.insertBefore( settings.nTable )[0];
	}
	
	
	/**
	 * Display or hide the processing indicator
	 *  @param {object} settings dataTables settings object
	 *  @param {bool} show Show the processing indicator (true) or not (false)
	 *  @memberof DataTable#oApi
	 */
	function _fnProcessingDisplay ( settings, show )
	{
		if ( settings.oFeatures.bProcessing ) {
			$(settings.aanFeatures.r).css( 'display', show ? 'block' : 'none' );
		}
	
		_fnCallbackFire( settings, null, 'processing', [settings, show] );
	}
	
	/**
	 * Add any control elements for the table - specifically scrolling
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Node to add to the DOM
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlTable ( settings )
	{
		var table = $(settings.nTable);
	
		// Add the ARIA grid role to the table
		table.attr( 'role', 'grid' );
	
		// Scrolling from here on in
		var scroll = settings.oScroll;
	
		if ( scroll.sX === '' && scroll.sY === '' ) {
			return settings.nTable;
		}
	
		var scrollX = scroll.sX;
		var scrollY = scroll.sY;
		var classes = settings.oClasses;
		var caption = table.children('caption');
		var captionSide = caption.length ? caption[0]._captionSide : null;
		var headerClone = $( table[0].cloneNode(false) );
		var footerClone = $( table[0].cloneNode(false) );
		var footer = table.children('tfoot');
		var _div = '<div/>';
		var size = function ( s ) {
			return !s ? null : _fnStringToCss( s );
		};
	
		if ( ! footer.length ) {
			footer = null;
		}
	
		/*
		 * The HTML structure that we want to generate in this function is:
		 *  div - scroller
		 *    div - scroll head
		 *      div - scroll head inner
		 *        table - scroll head table
		 *          thead - thead
		 *    div - scroll body
		 *      table - table (master table)
		 *        thead - thead clone for sizing
		 *        tbody - tbody
		 *    div - scroll foot
		 *      div - scroll foot inner
		 *        table - scroll foot table
		 *          tfoot - tfoot
		 */
		var scroller = $( _div, { 'class': classes.sScrollWrapper } )
			.append(
				$(_div, { 'class': classes.sScrollHead } )
					.css( {
						overflow: 'hidden',
						position: 'relative',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollHeadInner } )
							.css( {
								'box-sizing': 'content-box',
								width: scroll.sXInner || '100%'
							} )
							.append(
								headerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'top' ? caption : null )
									.append(
										table.children('thead')
									)
							)
					)
			)
			.append(
				$(_div, { 'class': classes.sScrollBody } )
					.css( {
						position: 'relative',
						overflow: 'auto',
						width: size( scrollX )
					} )
					.append( table )
			);
	
		if ( footer ) {
			scroller.append(
				$(_div, { 'class': classes.sScrollFoot } )
					.css( {
						overflow: 'hidden',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollFootInner } )
							.append(
								footerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'bottom' ? caption : null )
									.append(
										table.children('tfoot')
									)
							)
					)
			);
		}
	
		var children = scroller.children();
		var scrollHead = children[0];
		var scrollBody = children[1];
		var scrollFoot = footer ? children[2] : null;
	
		// When the body is scrolled, then we also want to scroll the headers
		if ( scrollX ) {
			$(scrollBody).on( 'scroll.DT', function (e) {
				var scrollLeft = this.scrollLeft;
	
				scrollHead.scrollLeft = scrollLeft;
	
				if ( footer ) {
					scrollFoot.scrollLeft = scrollLeft;
				}
			} );
		}
	
		$(scrollBody).css('max-height', scrollY);
		if (! scroll.bCollapse) {
			$(scrollBody).css('height', scrollY);
		}
	
		settings.nScrollHead = scrollHead;
		settings.nScrollBody = scrollBody;
		settings.nScrollFoot = scrollFoot;
	
		// On redraw - align columns
		settings.aoDrawCallback.push( {
			"fn": _fnScrollDraw,
			"sName": "scrolling"
		} );
	
		return scroller[0];
	}
	
	
	
	/**
	 * Update the header, footer and body tables for resizing - i.e. column
	 * alignment.
	 *
	 * Welcome to the most horrible function DataTables. The process that this
	 * function follows is basically:
	 *   1. Re-create the table inside the scrolling div
	 *   2. Take live measurements from the DOM
	 *   3. Apply the measurements to align the columns
	 *   4. Clean up
	 *
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnScrollDraw ( settings )
	{
		// Given that this is such a monster function, a lot of variables are use
		// to try and keep the minimised size as small as possible
		var
			scroll         = settings.oScroll,
			scrollX        = scroll.sX,
			scrollXInner   = scroll.sXInner,
			scrollY        = scroll.sY,
			barWidth       = scroll.iBarWidth,
			divHeader      = $(settings.nScrollHead),
			divHeaderStyle = divHeader[0].style,
			divHeaderInner = divHeader.children('div'),
			divHeaderInnerStyle = divHeaderInner[0].style,
			divHeaderTable = divHeaderInner.children('table'),
			divBodyEl      = settings.nScrollBody,
			divBody        = $(divBodyEl),
			divBodyStyle   = divBodyEl.style,
			divFooter      = $(settings.nScrollFoot),
			divFooterInner = divFooter.children('div'),
			divFooterTable = divFooterInner.children('table'),
			header         = $(settings.nTHead),
			table          = $(settings.nTable),
			tableEl        = table[0],
			tableStyle     = tableEl.style,
			footer         = settings.nTFoot ? $(settings.nTFoot) : null,
			browser        = settings.oBrowser,
			ie67           = browser.bScrollOversize,
			dtHeaderCells  = _pluck( settings.aoColumns, 'nTh' ),
			headerTrgEls, footerTrgEls,
			headerSrcEls, footerSrcEls,
			headerCopy, footerCopy,
			headerWidths=[], footerWidths=[],
			headerContent=[], footerContent=[],
			idx, correction, sanityWidth,
			zeroOut = function(nSizer) {
				var style = nSizer.style;
				style.paddingTop = "0";
				style.paddingBottom = "0";
				style.borderTopWidth = "0";
				style.borderBottomWidth = "0";
				style.height = 0;
			};
	
		// If the scrollbar visibility has changed from the last draw, we need to
		// adjust the column sizes as the table width will have changed to account
		// for the scrollbar
		var scrollBarVis = divBodyEl.scrollHeight > divBodyEl.clientHeight;
		
		if ( settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== undefined ) {
			settings.scrollBarVis = scrollBarVis;
			_fnAdjustColumnSizing( settings );
			return; // adjust column sizing will call this function again
		}
		else {
			settings.scrollBarVis = scrollBarVis;
		}
	
		/*
		 * 1. Re-create the table inside the scrolling div
		 */
	
		// Remove the old minimised thead and tfoot elements in the inner table
		table.children('thead, tfoot').remove();
	
		if ( footer ) {
			footerCopy = footer.clone().prependTo( table );
			footerTrgEls = footer.find('tr'); // the original tfoot is in its own table and must be sized
			footerSrcEls = footerCopy.find('tr');
		}
	
		// Clone the current header and footer elements and then place it into the inner table
		headerCopy = header.clone().prependTo( table );
		headerTrgEls = header.find('tr'); // original header is in its own table
		headerSrcEls = headerCopy.find('tr');
		headerCopy.find('th, td').removeAttr('tabindex');
	
	
		/*
		 * 2. Take live measurements from the DOM - do not alter the DOM itself!
		 */
	
		// Remove old sizing and apply the calculated column widths
		// Get the unique column headers in the newly created (cloned) header. We want to apply the
		// calculated sizes to this header
		if ( ! scrollX )
		{
			divBodyStyle.width = '100%';
			divHeader[0].style.width = '100%';
		}
	
		$.each( _fnGetUniqueThs( settings, headerCopy ), function ( i, el ) {
			idx = _fnVisibleToColumnIndex( settings, i );
			el.style.width = settings.aoColumns[idx].sWidth;
		} );
	
		if ( footer ) {
			_fnApplyToChildren( function(n) {
				n.style.width = "";
			}, footerSrcEls );
		}
	
		// Size the table as a whole
		sanityWidth = table.outerWidth();
		if ( scrollX === "" ) {
			// No x scrolling
			tableStyle.width = "100%";
	
			// IE7 will make the width of the table when 100% include the scrollbar
			// - which is shouldn't. When there is a scrollbar we need to take this
			// into account.
			if ( ie67 && (table.find('tbody').height() > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( table.outerWidth() - barWidth);
			}
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
		else if ( scrollXInner !== "" ) {
			// legacy x scroll inner has been given - use it
			tableStyle.width = _fnStringToCss(scrollXInner);
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
	
		// Hidden header should have zero height, so remove padding and borders. Then
		// set the width based on the real headers
	
		// Apply all styles in one pass
		_fnApplyToChildren( zeroOut, headerSrcEls );
	
		// Read all widths in next pass
		_fnApplyToChildren( function(nSizer) {
			headerContent.push( nSizer.innerHTML );
			headerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
		}, headerSrcEls );
	
		// Apply all widths in final pass
		_fnApplyToChildren( function(nToSize, i) {
			// Only apply widths to the DataTables detected header cells - this
			// prevents complex headers from having contradictory sizes applied
			if ( $.inArray( nToSize, dtHeaderCells ) !== -1 ) {
				nToSize.style.width = headerWidths[i];
			}
		}, headerTrgEls );
	
		$(headerSrcEls).height(0);
	
		/* Same again with the footer if we have one */
		if ( footer )
		{
			_fnApplyToChildren( zeroOut, footerSrcEls );
	
			_fnApplyToChildren( function(nSizer) {
				footerContent.push( nSizer.innerHTML );
				footerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
			}, footerSrcEls );
	
			_fnApplyToChildren( function(nToSize, i) {
				nToSize.style.width = footerWidths[i];
			}, footerTrgEls );
	
			$(footerSrcEls).height(0);
		}
	
	
		/*
		 * 3. Apply the measurements
		 */
	
		// "Hide" the header and footer that we used for the sizing. We need to keep
		// the content of the cell so that the width applied to the header and body
		// both match, but we want to hide it completely. We want to also fix their
		// width to what they currently are
		_fnApplyToChildren( function(nSizer, i) {
			nSizer.innerHTML = '<div class="dataTables_sizing">'+headerContent[i]+'</div>';
			nSizer.childNodes[0].style.height = "0";
			nSizer.childNodes[0].style.overflow = "hidden";
			nSizer.style.width = headerWidths[i];
		}, headerSrcEls );
	
		if ( footer )
		{
			_fnApplyToChildren( function(nSizer, i) {
				nSizer.innerHTML = '<div class="dataTables_sizing">'+footerContent[i]+'</div>';
				nSizer.childNodes[0].style.height = "0";
				nSizer.childNodes[0].style.overflow = "hidden";
				nSizer.style.width = footerWidths[i];
			}, footerSrcEls );
		}
	
		// Sanity check that the table is of a sensible width. If not then we are going to get
		// misalignment - try to prevent this by not allowing the table to shrink below its min width
		if ( table.outerWidth() < sanityWidth )
		{
			// The min width depends upon if we have a vertical scrollbar visible or not */
			correction = ((divBodyEl.scrollHeight > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")) ?
					sanityWidth+barWidth :
					sanityWidth;
	
			// IE6/7 are a law unto themselves...
			if ( ie67 && (divBodyEl.scrollHeight >
				divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( correction-barWidth );
			}
	
			// And give the user a warning that we've stopped the table getting too small
			if ( scrollX === "" || scrollXInner !== "" ) {
				_fnLog( settings, 1, 'Possible column misalignment', 6 );
			}
		}
		else
		{
			correction = '100%';
		}
	
		// Apply to the container elements
		divBodyStyle.width = _fnStringToCss( correction );
		divHeaderStyle.width = _fnStringToCss( correction );
	
		if ( footer ) {
			settings.nScrollFoot.style.width = _fnStringToCss( correction );
		}
	
	
		/*
		 * 4. Clean up
		 */
		if ( ! scrollY ) {
			/* IE7< puts a vertical scrollbar in place (when it shouldn't be) due to subtracting
			 * the scrollbar height from the visible display, rather than adding it on. We need to
			 * set the height in order to sort this. Don't want to do it in any other browsers.
			 */
			if ( ie67 ) {
				divBodyStyle.height = _fnStringToCss( tableEl.offsetHeight+barWidth );
			}
		}
	
		/* Finally set the width's of the header and footer tables */
		var iOuterWidth = table.outerWidth();
		divHeaderTable[0].style.width = _fnStringToCss( iOuterWidth );
		divHeaderInnerStyle.width = _fnStringToCss( iOuterWidth );
	
		// Figure out if there are scrollbar present - if so then we need a the header and footer to
		// provide a bit more space to allow "overflow" scrolling (i.e. past the scrollbar)
		var bScrolling = table.height() > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll";
		var padding = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right' );
		divHeaderInnerStyle[ padding ] = bScrolling ? barWidth+"px" : "0px";
	
		if ( footer ) {
			divFooterTable[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style[padding] = bScrolling ? barWidth+"px" : "0px";
		}
	
		// Correct DOM ordering for colgroup - comes before the thead
		table.children('colgroup').insertBefore( table.children('thead') );
	
		/* Adjust the position of the header in case we loose the y-scrollbar */
		divBody.trigger('scroll');
	
		// If sorting or filtering has occurred, jump the scrolling back to the top
		// only if we aren't holding the position
		if ( (settings.bSorted || settings.bFiltered) && ! settings._drawHold ) {
			divBodyEl.scrollTop = 0;
		}
	}
	
	
	
	/**
	 * Apply a given function to the display child nodes of an element array (typically
	 * TD children of TR rows
	 *  @param {function} fn Method to apply to the objects
	 *  @param array {nodes} an1 List of elements to look through for display children
	 *  @param array {nodes} an2 Another list (identical structure to the first) - optional
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyToChildren( fn, an1, an2 )
	{
		var index=0, i=0, iLen=an1.length;
		var nNode1, nNode2;
	
		while ( i < iLen ) {
			nNode1 = an1[i].firstChild;
			nNode2 = an2 ? an2[i].firstChild : null;
	
			while ( nNode1 ) {
				if ( nNode1.nodeType === 1 ) {
					if ( an2 ) {
						fn( nNode1, nNode2, index );
					}
					else {
						fn( nNode1, index );
					}
	
					index++;
				}
	
				nNode1 = nNode1.nextSibling;
				nNode2 = an2 ? nNode2.nextSibling : null;
			}
	
			i++;
		}
	}
	
	
	
	var __re_html_remove = /<.*?>/g;
	
	
	/**
	 * Calculate the width of columns for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnCalculateColumnWidths ( oSettings )
	{
		var
			table = oSettings.nTable,
			columns = oSettings.aoColumns,
			scroll = oSettings.oScroll,
			scrollY = scroll.sY,
			scrollX = scroll.sX,
			scrollXInner = scroll.sXInner,
			columnCount = columns.length,
			visibleColumns = _fnGetColumns( oSettings, 'bVisible' ),
			headerCells = $('th', oSettings.nTHead),
			tableWidthAttr = table.getAttribute('width'), // from DOM element
			tableContainer = table.parentNode,
			userInputs = false,
			i, column, columnIdx, width, outerWidth,
			browser = oSettings.oBrowser,
			ie67 = browser.bScrollOversize;
	
		var styleWidth = table.style.width;
		if ( styleWidth && styleWidth.indexOf('%') !== -1 ) {
			tableWidthAttr = styleWidth;
		}
	
		/* Convert any user input sizes into pixel sizes */
		for ( i=0 ; i<visibleColumns.length ; i++ ) {
			column = columns[ visibleColumns[i] ];
	
			if ( column.sWidth !== null ) {
				column.sWidth = _fnConvertToWidth( column.sWidthOrig, tableContainer );
	
				userInputs = true;
			}
		}
	
		/* If the number of columns in the DOM equals the number that we have to
		 * process in DataTables, then we can use the offsets that are created by
		 * the web- browser. No custom sizes can be set in order for this to happen,
		 * nor scrolling used
		 */
		if ( ie67 || ! userInputs && ! scrollX && ! scrollY &&
		     columnCount == _fnVisbleColumns( oSettings ) &&
		     columnCount == headerCells.length
		) {
			for ( i=0 ; i<columnCount ; i++ ) {
				var colIdx = _fnVisibleToColumnIndex( oSettings, i );
	
				if ( colIdx !== null ) {
					columns[ colIdx ].sWidth = _fnStringToCss( headerCells.eq(i).width() );
				}
			}
		}
		else
		{
			// Otherwise construct a single row, worst case, table with the widest
			// node in the data, assign any user defined widths, then insert it into
			// the DOM and allow the browser to do all the hard work of calculating
			// table widths
			var tmpTable = $(table).clone() // don't use cloneNode - IE8 will remove events on the main table
				.css( 'visibility', 'hidden' )
				.removeAttr( 'id' );
	
			// Clean up the table body
			tmpTable.find('tbody tr').remove();
			var tr = $('<tr/>').appendTo( tmpTable.find('tbody') );
	
			// Clone the table header and footer - we can't use the header / footer
			// from the cloned table, since if scrolling is active, the table's
			// real header and footer are contained in different table tags
			tmpTable.find('thead, tfoot').remove();
			tmpTable
				.append( $(oSettings.nTHead).clone() )
				.append( $(oSettings.nTFoot).clone() );
	
			// Remove any assigned widths from the footer (from scrolling)
			tmpTable.find('tfoot th, tfoot td').css('width', '');
	
			// Apply custom sizing to the cloned header
			headerCells = _fnGetUniqueThs( oSettings, tmpTable.find('thead')[0] );
	
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				column = columns[ visibleColumns[i] ];
	
				headerCells[i].style.width = column.sWidthOrig !== null && column.sWidthOrig !== '' ?
					_fnStringToCss( column.sWidthOrig ) :
					'';
	
				// For scrollX we need to force the column width otherwise the
				// browser will collapse it. If this width is smaller than the
				// width the column requires, then it will have no effect
				if ( column.sWidthOrig && scrollX ) {
					$( headerCells[i] ).append( $('<div/>').css( {
						width: column.sWidthOrig,
						margin: 0,
						padding: 0,
						border: 0,
						height: 1
					} ) );
				}
			}
	
			// Find the widest cell for each column and put it into the table
			if ( oSettings.aoData.length ) {
				for ( i=0 ; i<visibleColumns.length ; i++ ) {
					columnIdx = visibleColumns[i];
					column = columns[ columnIdx ];
	
					$( _fnGetWidestNode( oSettings, columnIdx ) )
						.clone( false )
						.append( column.sContentPadding )
						.appendTo( tr );
				}
			}
	
			// Tidy the temporary table - remove name attributes so there aren't
			// duplicated in the dom (radio elements for example)
			$('[name]', tmpTable).removeAttr('name');
	
			// Table has been built, attach to the document so we can work with it.
			// A holding element is used, positioned at the top of the container
			// with minimal height, so it has no effect on if the container scrolls
			// or not. Otherwise it might trigger scrolling when it actually isn't
			// needed
			var holder = $('<div/>').css( scrollX || scrollY ?
					{
						position: 'absolute',
						top: 0,
						left: 0,
						height: 1,
						right: 0,
						overflow: 'hidden'
					} :
					{}
				)
				.append( tmpTable )
				.appendTo( tableContainer );
	
			// When scrolling (X or Y) we want to set the width of the table as 
			// appropriate. However, when not scrolling leave the table width as it
			// is. This results in slightly different, but I think correct behaviour
			if ( scrollX && scrollXInner ) {
				tmpTable.width( scrollXInner );
			}
			else if ( scrollX ) {
				tmpTable.css( 'width', 'auto' );
				tmpTable.removeAttr('width');
	
				// If there is no width attribute or style, then allow the table to
				// collapse
				if ( tmpTable.width() < tableContainer.clientWidth && tableWidthAttr ) {
					tmpTable.width( tableContainer.clientWidth );
				}
			}
			else if ( scrollY ) {
				tmpTable.width( tableContainer.clientWidth );
			}
			else if ( tableWidthAttr ) {
				tmpTable.width( tableWidthAttr );
			}
	
			// Get the width of each column in the constructed table - we need to
			// know the inner width (so it can be assigned to the other table's
			// cells) and the outer width so we can calculate the full width of the
			// table. This is safe since DataTables requires a unique cell for each
			// column, but if ever a header can span multiple columns, this will
			// need to be modified.
			var total = 0;
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				var cell = $(headerCells[i]);
				var border = cell.outerWidth() - cell.width();
	
				// Use getBounding... where possible (not IE8-) because it can give
				// sub-pixel accuracy, which we then want to round up!
				var bounding = browser.bBounding ?
					Math.ceil( headerCells[i].getBoundingClientRect().width ) :
					cell.outerWidth();
	
				// Total is tracked to remove any sub-pixel errors as the outerWidth
				// of the table might not equal the total given here (IE!).
				total += bounding;
	
				// Width for each column to use
				columns[ visibleColumns[i] ].sWidth = _fnStringToCss( bounding - border );
			}
	
			table.style.width = _fnStringToCss( total );
	
			// Finished with the table - ditch it
			holder.remove();
		}
	
		// If there is a width attr, we want to attach an event listener which
		// allows the table sizing to automatically adjust when the window is
		// resized. Use the width attr rather than CSS, since we can't know if the
		// CSS is a relative value or absolute - DOM read is always px.
		if ( tableWidthAttr ) {
			table.style.width = _fnStringToCss( tableWidthAttr );
		}
	
		if ( (tableWidthAttr || scrollX) && ! oSettings._reszEvt ) {
			var bindResize = function () {
				$(window).on('resize.DT-'+oSettings.sInstance, _fnThrottle( function () {
					_fnAdjustColumnSizing( oSettings );
				} ) );
			};
	
			// IE6/7 will crash if we bind a resize event handler on page load.
			// To be removed in 1.11 which drops IE6/7 support
			if ( ie67 ) {
				setTimeout( bindResize, 1000 );
			}
			else {
				bindResize();
			}
	
			oSettings._reszEvt = true;
		}
	}
	
	
	/**
	 * Throttle the calls to a function. Arguments and context are maintained for
	 * the throttled function
	 *  @param {function} fn Function to be called
	 *  @param {int} [freq=200] call frequency in mS
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#oApi
	 */
	var _fnThrottle = DataTable.util.throttle;
	
	
	/**
	 * Convert a CSS unit width to pixels (e.g. 2em)
	 *  @param {string} width width to be converted
	 *  @param {node} parent parent to get the with for (required for relative widths) - optional
	 *  @returns {int} width in pixels
	 *  @memberof DataTable#oApi
	 */
	function _fnConvertToWidth ( width, parent )
	{
		if ( ! width ) {
			return 0;
		}
	
		var n = $('<div/>')
			.css( 'width', _fnStringToCss( width ) )
			.appendTo( parent || document.body );
	
		var val = n[0].offsetWidth;
		n.remove();
	
		return val;
	}
	
	
	/**
	 * Get the widest node
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {node} widest table node
	 *  @memberof DataTable#oApi
	 */
	function _fnGetWidestNode( settings, colIdx )
	{
		var idx = _fnGetMaxLenString( settings, colIdx );
		if ( idx < 0 ) {
			return null;
		}
	
		var data = settings.aoData[ idx ];
		return ! data.nTr ? // Might not have been created when deferred rendering
			$('<td/>').html( _fnGetCellData( settings, idx, colIdx, 'display' ) )[0] :
			data.anCells[ colIdx ];
	}
	
	
	/**
	 * Get the maximum strlen for each data column
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {string} max string length for each column
	 *  @memberof DataTable#oApi
	 */
	function _fnGetMaxLenString( settings, colIdx )
	{
		var s, max=-1, maxIdx = -1;
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			s = _fnGetCellData( settings, i, colIdx, 'display' )+'';
			s = s.replace( __re_html_remove, '' );
			s = s.replace( /&nbsp;/g, ' ' );
	
			if ( s.length > max ) {
				max = s.length;
				maxIdx = i;
			}
		}
	
		return maxIdx;
	}
	
	
	/**
	 * Append a CSS unit (only if required) to a string
	 *  @param {string} value to css-ify
	 *  @returns {string} value with css unit
	 *  @memberof DataTable#oApi
	 */
	function _fnStringToCss( s )
	{
		if ( s === null ) {
			return '0px';
		}
	
		if ( typeof s == 'number' ) {
			return s < 0 ?
				'0px' :
				s+'px';
		}
	
		// Check it has a unit character already
		return s.match(/\d$/) ?
			s+'px' :
			s;
	}
	
	
	
	function _fnSortFlatten ( settings )
	{
		var
			i, iLen, k, kLen,
			aSort = [],
			aiOrig = [],
			aoColumns = settings.aoColumns,
			aDataSort, iCol, sType, srcCol,
			fixed = settings.aaSortingFixed,
			fixedObj = $.isPlainObject( fixed ),
			nestedSort = [],
			add = function ( a ) {
				if ( a.length && ! Array.isArray( a[0] ) ) {
					// 1D array
					nestedSort.push( a );
				}
				else {
					// 2D array
					$.merge( nestedSort, a );
				}
			};
	
		// Build the sort array, with pre-fix and post-fix options if they have been
		// specified
		if ( Array.isArray( fixed ) ) {
			add( fixed );
		}
	
		if ( fixedObj && fixed.pre ) {
			add( fixed.pre );
		}
	
		add( settings.aaSorting );
	
		if (fixedObj && fixed.post ) {
			add( fixed.post );
		}
	
		for ( i=0 ; i<nestedSort.length ; i++ )
		{
			srcCol = nestedSort[i][0];
			aDataSort = aoColumns[ srcCol ].aDataSort;
	
			for ( k=0, kLen=aDataSort.length ; k<kLen ; k++ )
			{
				iCol = aDataSort[k];
				sType = aoColumns[ iCol ].sType || 'string';
	
				if ( nestedSort[i]._idx === undefined ) {
					nestedSort[i]._idx = $.inArray( nestedSort[i][1], aoColumns[iCol].asSorting );
				}
	
				aSort.push( {
					src:       srcCol,
					col:       iCol,
					dir:       nestedSort[i][1],
					index:     nestedSort[i]._idx,
					type:      sType,
					formatter: DataTable.ext.type.order[ sType+"-pre" ]
				} );
			}
		}
	
		return aSort;
	}
	
	/**
	 * Change the order of the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 *  @todo This really needs split up!
	 */
	function _fnSort ( oSettings )
	{
		var
			i, ien, iLen, j, jLen, k, kLen,
			sDataType, nTh,
			aiOrig = [],
			oExtSort = DataTable.ext.type.order,
			aoData = oSettings.aoData,
			aoColumns = oSettings.aoColumns,
			aDataSort, data, iCol, sType, oSort,
			formatters = 0,
			sortCol,
			displayMaster = oSettings.aiDisplayMaster,
			aSort;
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo Can this be moved into a 'data-ready' handler which is called when
		//   data is going to be used in the table?
		_fnColumnTypes( oSettings );
	
		aSort = _fnSortFlatten( oSettings );
	
		for ( i=0, ien=aSort.length ; i<ien ; i++ ) {
			sortCol = aSort[i];
	
			// Track if we can use the fast sort algorithm
			if ( sortCol.formatter ) {
				formatters++;
			}
	
			// Load the data needed for the sort, for each cell
			_fnSortData( oSettings, sortCol.col );
		}
	
		/* No sorting required if server-side or no sorting array */
		if ( _fnDataSource( oSettings ) != 'ssp' && aSort.length !== 0 )
		{
			// Create a value - key array of the current row positions such that we can use their
			// current position during the sort, if values match, in order to perform stable sorting
			for ( i=0, iLen=displayMaster.length ; i<iLen ; i++ ) {
				aiOrig[ displayMaster[i] ] = i;
			}
	
			/* Do the sort - here we want multi-column sorting based on a given data source (column)
			 * and sorting function (from oSort) in a certain direction. It's reasonably complex to
			 * follow on it's own, but this is what we want (example two column sorting):
			 *  fnLocalSorting = function(a,b){
			 *    var iTest;
			 *    iTest = oSort['string-asc']('data11', 'data12');
			 *      if (iTest !== 0)
			 *        return iTest;
			 *    iTest = oSort['numeric-desc']('data21', 'data22');
			 *    if (iTest !== 0)
			 *      return iTest;
			 *    return oSort['numeric-asc']( aiOrig[a], aiOrig[b] );
			 *  }
			 * Basically we have a test for each sorting column, if the data in that column is equal,
			 * test the next column. If all columns match, then we use a numeric sort on the row
			 * positions in the original data array to provide a stable sort.
			 *
			 * Note - I know it seems excessive to have two sorting methods, but the first is around
			 * 15% faster, so the second is only maintained for backwards compatibility with sorting
			 * methods which do not have a pre-sort formatting function.
			 */
			if ( formatters === aSort.length ) {
				// All sort types have formatting functions
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, test, sort,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						test = x<y ? -1 : x>y ? 1 : 0;
						if ( test !== 0 ) {
							return sort.dir === 'asc' ? test : -test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
			else {
				// Depreciated - remove in 1.11 (providing a plug-in option)
				// Not all sort types have formatting methods, so we have to call their sorting
				// methods.
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, l, test, sort, fn,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						fn = oExtSort[ sort.type+"-"+sort.dir ] || oExtSort[ "string-"+sort.dir ];
						test = fn( x, y );
						if ( test !== 0 ) {
							return test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
		}
	
		/* Tell the draw function that we have sorted the data */
		oSettings.bSorted = true;
	}
	
	
	function _fnSortAria ( settings )
	{
		var label;
		var nextSort;
		var columns = settings.aoColumns;
		var aSort = _fnSortFlatten( settings );
		var oAria = settings.oLanguage.oAria;
	
		// ARIA attributes - need to loop all columns, to update all (removing old
		// attributes as needed)
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			var col = columns[i];
			var asSorting = col.asSorting;
			var sTitle = col.sTitle.replace( /<.*?>/g, "" );
			var th = col.nTh;
	
			// IE7 is throwing an error when setting these properties with jQuery's
			// attr() and removeAttr() methods...
			th.removeAttribute('aria-sort');
	
			/* In ARIA only the first sorting column can be marked as sorting - no multi-sort option */
			if ( col.bSortable ) {
				if ( aSort.length > 0 && aSort[0].col == i ) {
					th.setAttribute('aria-sort', aSort[0].dir=="asc" ? "ascending" : "descending" );
					nextSort = asSorting[ aSort[0].index+1 ] || asSorting[0];
				}
				else {
					nextSort = asSorting[0];
				}
	
				label = sTitle + ( nextSort === "asc" ?
					oAria.sSortAscending :
					oAria.sSortDescending
				);
			}
			else {
				label = sTitle;
			}
	
			th.setAttribute('aria-label', label);
		}
	}
	
	
	/**
	 * Function to run on user sort request
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {boolean} [append=false] Append the requested sort to the existing
	 *    sort if true (i.e. multi-column sort)
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortListener ( settings, colIdx, append, callback )
	{
		var col = settings.aoColumns[ colIdx ];
		var sorting = settings.aaSorting;
		var asSorting = col.asSorting;
		var nextSortIdx;
		var next = function ( a, overflow ) {
			var idx = a._idx;
			if ( idx === undefined ) {
				idx = $.inArray( a[1], asSorting );
			}
	
			return idx+1 < asSorting.length ?
				idx+1 :
				overflow ?
					null :
					0;
		};
	
		// Convert to 2D array if needed
		if ( typeof sorting[0] === 'number' ) {
			sorting = settings.aaSorting = [ sorting ];
		}
	
		// If appending the sort then we are multi-column sorting
		if ( append && settings.oFeatures.bSortMulti ) {
			// Are we already doing some kind of sort on this column?
			var sortIdx = $.inArray( colIdx, _pluck(sorting, '0') );
	
			if ( sortIdx !== -1 ) {
				// Yes, modify the sort
				nextSortIdx = next( sorting[sortIdx], true );
	
				if ( nextSortIdx === null && sorting.length === 1 ) {
					nextSortIdx = 0; // can't remove sorting completely
				}
	
				if ( nextSortIdx === null ) {
					sorting.splice( sortIdx, 1 );
				}
				else {
					sorting[sortIdx][1] = asSorting[ nextSortIdx ];
					sorting[sortIdx]._idx = nextSortIdx;
				}
			}
			else {
				// No sort on this column yet
				sorting.push( [ colIdx, asSorting[0], 0 ] );
				sorting[sorting.length-1]._idx = 0;
			}
		}
		else if ( sorting.length && sorting[0][0] == colIdx ) {
			// Single column - already sorting on this column, modify the sort
			nextSortIdx = next( sorting[0] );
	
			sorting.length = 1;
			sorting[0][1] = asSorting[ nextSortIdx ];
			sorting[0]._idx = nextSortIdx;
		}
		else {
			// Single column - sort only on this column
			sorting.length = 0;
			sorting.push( [ colIdx, asSorting[0] ] );
			sorting[0]._idx = 0;
		}
	
		// Run the sort by calling a full redraw
		_fnReDraw( settings );
	
		// callback used for async user interaction
		if ( typeof callback == 'function' ) {
			callback( settings );
		}
	}
	
	
	/**
	 * Attach a sort handler (click) to a node
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortAttachListener ( settings, attachTo, colIdx, callback )
	{
		var col = settings.aoColumns[ colIdx ];
	
		_fnBindAction( attachTo, {}, function (e) {
			/* If the column is not sortable - don't to anything */
			if ( col.bSortable === false ) {
				return;
			}
	
			// If processing is enabled use a timeout to allow the processing
			// display to be shown - otherwise to it synchronously
			if ( settings.oFeatures.bProcessing ) {
				_fnProcessingDisplay( settings, true );
	
				setTimeout( function() {
					_fnSortListener( settings, colIdx, e.shiftKey, callback );
	
					// In server-side processing, the draw callback will remove the
					// processing display
					if ( _fnDataSource( settings ) !== 'ssp' ) {
						_fnProcessingDisplay( settings, false );
					}
				}, 0 );
			}
			else {
				_fnSortListener( settings, colIdx, e.shiftKey, callback );
			}
		} );
	}
	
	
	/**
	 * Set the sorting classes on table's body, Note: it is safe to call this function
	 * when bSort and bSortClasses are false
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSortingClasses( settings )
	{
		var oldSort = settings.aLastSort;
		var sortClass = settings.oClasses.sSortColumn;
		var sort = _fnSortFlatten( settings );
		var features = settings.oFeatures;
		var i, ien, colIdx;
	
		if ( features.bSort && features.bSortClasses ) {
			// Remove old sorting classes
			for ( i=0, ien=oldSort.length ; i<ien ; i++ ) {
				colIdx = oldSort[i].src;
	
				// Remove column sorting
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.removeClass( sortClass + (i<2 ? i+1 : 3) );
			}
	
			// Add new column sorting
			for ( i=0, ien=sort.length ; i<ien ; i++ ) {
				colIdx = sort[i].src;
	
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.addClass( sortClass + (i<2 ? i+1 : 3) );
			}
		}
	
		settings.aLastSort = sort;
	}
	
	
	// Get the data to sort a column, be it from cache, fresh (populating the
	// cache), or from a sort formatter
	function _fnSortData( settings, idx )
	{
		// Custom sorting function - provided by the sort data type
		var column = settings.aoColumns[ idx ];
		var customSort = DataTable.ext.order[ column.sSortDataType ];
		var customData;
	
		if ( customSort ) {
			customData = customSort.call( settings.oInstance, settings, idx,
				_fnColumnIndexToVisible( settings, idx )
			);
		}
	
		// Use / populate cache
		var row, cellData;
		var formatter = DataTable.ext.type.order[ column.sType+"-pre" ];
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aSortData ) {
				row._aSortData = [];
			}
	
			if ( ! row._aSortData[idx] || customSort ) {
				cellData = customSort ?
					customData[i] : // If there was a custom sort function, use data from there
					_fnGetCellData( settings, i, idx, 'sort' );
	
				row._aSortData[ idx ] = formatter ?
					formatter( cellData ) :
					cellData;
			}
		}
	}
	
	
	
	/**
	 * Save the state of a table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSaveState ( settings )
	{
		if ( !settings.oFeatures.bStateSave || settings.bDestroying )
		{
			return;
		}
	
		/* Store the interesting variables */
		var state = {
			time:    +new Date(),
			start:   settings._iDisplayStart,
			length:  settings._iDisplayLength,
			order:   $.extend( true, [], settings.aaSorting ),
			search:  _fnSearchToCamel( settings.oPreviousSearch ),
			columns: $.map( settings.aoColumns, function ( col, i ) {
				return {
					visible: col.bVisible,
					search: _fnSearchToCamel( settings.aoPreSearchCols[i] )
				};
			} )
		};
	
		_fnCallbackFire( settings, "aoStateSaveParams", 'stateSaveParams', [settings, state] );
	
		settings.oSavedState = state;
		settings.fnStateSaveCallback.call( settings.oInstance, settings, state );
	}
	
	
	/**
	 * Attempt to load a saved table state
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oInit DataTables init object so we can override settings
	 *  @param {function} callback Callback to execute when the state has been loaded
	 *  @memberof DataTable#oApi
	 */
	function _fnLoadState ( settings, oInit, callback )
	{
		var i, ien;
		var columns = settings.aoColumns;
		var loaded = function ( s ) {
			if ( ! s || ! s.time ) {
				callback();
				return;
			}
	
			// Allow custom and plug-in manipulation functions to alter the saved data set and
			// cancelling of loading by returning false
			var abStateLoad = _fnCallbackFire( settings, 'aoStateLoadParams', 'stateLoadParams', [settings, s] );
			if ( $.inArray( false, abStateLoad ) !== -1 ) {
				callback();
				return;
			}
	
			// Reject old data
			var duration = settings.iStateDuration;
			if ( duration > 0 && s.time < +new Date() - (duration*1000) ) {
				callback();
				return;
			}
	
			// Number of columns have changed - all bets are off, no restore of settings
			if ( s.columns && columns.length !== s.columns.length ) {
				callback();
				return;
			}
	
			// Store the saved state so it might be accessed at any time
			settings.oLoadedState = $.extend( true, {}, s );
	
			// Restore key features - todo - for 1.11 this needs to be done by
			// subscribed events
			if ( s.start !== undefined ) {
				settings._iDisplayStart    = s.start;
				settings.iInitDisplayStart = s.start;
			}
			if ( s.length !== undefined ) {
				settings._iDisplayLength   = s.length;
			}
	
			// Order
			if ( s.order !== undefined ) {
				settings.aaSorting = [];
				$.each( s.order, function ( i, col ) {
					settings.aaSorting.push( col[0] >= columns.length ?
						[ 0, col[1] ] :
						col
					);
				} );
			}
	
			// Search
			if ( s.search !== undefined ) {
				$.extend( settings.oPreviousSearch, _fnSearchToHung( s.search ) );
			}
	
			// Columns
			//
			if ( s.columns ) {
				for ( i=0, ien=s.columns.length ; i<ien ; i++ ) {
					var col = s.columns[i];
	
					// Visibility
					if ( col.visible !== undefined ) {
						columns[i].bVisible = col.visible;
					}
	
					// Search
					if ( col.search !== undefined ) {
						$.extend( settings.aoPreSearchCols[i], _fnSearchToHung( col.search ) );
					}
				}
			}
	
			_fnCallbackFire( settings, 'aoStateLoaded', 'stateLoaded', [settings, s] );
			callback();
		};
	
		if ( ! settings.oFeatures.bStateSave ) {
			callback();
			return;
		}
	
		var state = settings.fnStateLoadCallback.call( settings.oInstance, settings, loaded );
	
		if ( state !== undefined ) {
			loaded( state );
		}
		// otherwise, wait for the loaded callback to be executed
	}
	
	
	/**
	 * Return the settings object for a particular table
	 *  @param {node} table table we are using as a dataTable
	 *  @returns {object} Settings object - or null if not found
	 *  @memberof DataTable#oApi
	 */
	function _fnSettingsFromNode ( table )
	{
		var settings = DataTable.settings;
		var idx = $.inArray( table, _pluck( settings, 'nTable' ) );
	
		return idx !== -1 ?
			settings[ idx ] :
			null;
	}
	
	
	/**
	 * Log an error message
	 *  @param {object} settings dataTables settings object
	 *  @param {int} level log error messages, or display them to the user
	 *  @param {string} msg error message
	 *  @param {int} tn Technical note id to get more information about the error.
	 *  @memberof DataTable#oApi
	 */
	function _fnLog( settings, level, msg, tn )
	{
		msg = 'DataTables warning: '+
			(settings ? 'table id='+settings.sTableId+' - ' : '')+msg;
	
		if ( tn ) {
			msg += '. For more information about this error, please see '+
			'http://datatables.net/tn/'+tn;
		}
	
		if ( ! level  ) {
			// Backwards compatibility pre 1.10
			var ext = DataTable.ext;
			var type = ext.sErrMode || ext.errMode;
	
			if ( settings ) {
				_fnCallbackFire( settings, null, 'error', [ settings, tn, msg ] );
			}
	
			if ( type == 'alert' ) {
				alert( msg );
			}
			else if ( type == 'throw' ) {
				throw new Error(msg);
			}
			else if ( typeof type == 'function' ) {
				type( settings, tn, msg );
			}
		}
		else if ( window.console && console.log ) {
			console.log( msg );
		}
	}
	
	
	/**
	 * See if a property is defined on one object, if so assign it to the other object
	 *  @param {object} ret target object
	 *  @param {object} src source object
	 *  @param {string} name property
	 *  @param {string} [mappedName] name to map too - optional, name used if not given
	 *  @memberof DataTable#oApi
	 */
	function _fnMap( ret, src, name, mappedName )
	{
		if ( Array.isArray( name ) ) {
			$.each( name, function (i, val) {
				if ( Array.isArray( val ) ) {
					_fnMap( ret, src, val[0], val[1] );
				}
				else {
					_fnMap( ret, src, val );
				}
			} );
	
			return;
		}
	
		if ( mappedName === undefined ) {
			mappedName = name;
		}
	
		if ( src[name] !== undefined ) {
			ret[mappedName] = src[name];
		}
	}
	
	
	/**
	 * Extend objects - very similar to jQuery.extend, but deep copy objects, and
	 * shallow copy arrays. The reason we need to do this, is that we don't want to
	 * deep copy array init values (such as aaSorting) since the dev wouldn't be
	 * able to override them, but we do want to deep copy arrays.
	 *  @param {object} out Object to extend
	 *  @param {object} extender Object from which the properties will be applied to
	 *      out
	 *  @param {boolean} breakRefs If true, then arrays will be sliced to take an
	 *      independent copy with the exception of the `data` or `aaData` parameters
	 *      if they are present. This is so you can pass in a collection to
	 *      DataTables and have that used as your data source without breaking the
	 *      references
	 *  @returns {object} out Reference, just for convenience - out === the return.
	 *  @memberof DataTable#oApi
	 *  @todo This doesn't take account of arrays inside the deep copied objects.
	 */
	function _fnExtend( out, extender, breakRefs )
	{
		var val;
	
		for ( var prop in extender ) {
			if ( extender.hasOwnProperty(prop) ) {
				val = extender[prop];
	
				if ( $.isPlainObject( val ) ) {
					if ( ! $.isPlainObject( out[prop] ) ) {
						out[prop] = {};
					}
					$.extend( true, out[prop], val );
				}
				else if ( breakRefs && prop !== 'data' && prop !== 'aaData' && Array.isArray(val) ) {
					out[prop] = val.slice();
				}
				else {
					out[prop] = val;
				}
			}
		}
	
		return out;
	}
	
	
	/**
	 * Bind an event handers to allow a click or return key to activate the callback.
	 * This is good for accessibility since a return on the keyboard will have the
	 * same effect as a click, if the element has focus.
	 *  @param {element} n Element to bind the action to
	 *  @param {object} oData Data object to pass to the triggered function
	 *  @param {function} fn Callback function for when the event is triggered
	 *  @memberof DataTable#oApi
	 */
	function _fnBindAction( n, oData, fn )
	{
		$(n)
			.on( 'click.DT', oData, function (e) {
					$(n).trigger('blur'); // Remove focus outline for mouse users
					fn(e);
				} )
			.on( 'keypress.DT', oData, function (e){
					if ( e.which === 13 ) {
						e.preventDefault();
						fn(e);
					}
				} )
			.on( 'selectstart.DT', function () {
					/* Take the brutal approach to cancelling text selection */
					return false;
				} );
	}
	
	
	/**
	 * Register a callback function. Easily allows a callback function to be added to
	 * an array store of callback functions that can then all be called together.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sStore Name of the array storage for the callbacks in oSettings
	 *  @param {function} fn Function to be called back
	 *  @param {string} sName Identifying name for the callback (i.e. a label)
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackReg( oSettings, sStore, fn, sName )
	{
		if ( fn )
		{
			oSettings[sStore].push( {
				"fn": fn,
				"sName": sName
			} );
		}
	}
	
	
	/**
	 * Fire callback functions and trigger events. Note that the loop over the
	 * callback array store is done backwards! Further note that you do not want to
	 * fire off triggers in time sensitive applications (for example cell creation)
	 * as its slow.
	 *  @param {object} settings dataTables settings object
	 *  @param {string} callbackArr Name of the array storage for the callbacks in
	 *      oSettings
	 *  @param {string} eventName Name of the jQuery custom event to trigger. If
	 *      null no trigger is fired
	 *  @param {array} args Array of arguments to pass to the callback function /
	 *      trigger
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackFire( settings, callbackArr, eventName, args )
	{
		var ret = [];
	
		if ( callbackArr ) {
			ret = $.map( settings[callbackArr].slice().reverse(), function (val, i) {
				return val.fn.apply( settings.oInstance, args );
			} );
		}
	
		if ( eventName !== null ) {
			var e = $.Event( eventName+'.dt' );
	
			$(settings.nTable).trigger( e, args );
	
			ret.push( e.result );
		}
	
		return ret;
	}
	
	
	function _fnLengthOverflow ( settings )
	{
		var
			start = settings._iDisplayStart,
			end = settings.fnDisplayEnd(),
			len = settings._iDisplayLength;
	
		/* If we have space to show extra rows (backing up from the end point - then do so */
		if ( start >= end )
		{
			start = end - len;
		}
	
		// Keep the start record on the current page
		start -= (start % len);
	
		if ( len === -1 || start < 0 )
		{
			start = 0;
		}
	
		settings._iDisplayStart = start;
	}
	
	
	function _fnRenderer( settings, type )
	{
		var renderer = settings.renderer;
		var host = DataTable.ext.renderer[type];
	
		if ( $.isPlainObject( renderer ) && renderer[type] ) {
			// Specific renderer for this type. If available use it, otherwise use
			// the default.
			return host[renderer[type]] || host._;
		}
		else if ( typeof renderer === 'string' ) {
			// Common renderer - if there is one available for this type use it,
			// otherwise use the default
			return host[renderer] || host._;
		}
	
		// Use the default
		return host._;
	}
	
	
	/**
	 * Detect the data source being used for the table. Used to simplify the code
	 * a little (ajax) and to make it compress a little smaller.
	 *
	 *  @param {object} settings dataTables settings object
	 *  @returns {string} Data source
	 *  @memberof DataTable#oApi
	 */
	function _fnDataSource ( settings )
	{
		if ( settings.oFeatures.bServerSide ) {
			return 'ssp';
		}
		else if ( settings.ajax || settings.sAjaxSource ) {
			return 'ajax';
		}
		return 'dom';
	}
	

	
	
	/**
	 * Computed structure of the DataTables API, defined by the options passed to
	 * `DataTable.Api.register()` when building the API.
	 *
	 * The structure is built in order to speed creation and extension of the Api
	 * objects since the extensions are effectively pre-parsed.
	 *
	 * The array is an array of objects with the following structure, where this
	 * base array represents the Api prototype base:
	 *
	 *     [
	 *       {
	 *         name:      'data'                -- string   - Property name
	 *         val:       function () {},       -- function - Api method (or undefined if just an object
	 *         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	 *         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	 *       },
	 *       {
	 *         name:     'row'
	 *         val:       {},
	 *         methodExt: [ ... ],
	 *         propExt:   [
	 *           {
	 *             name:      'data'
	 *             val:       function () {},
	 *             methodExt: [ ... ],
	 *             propExt:   [ ... ]
	 *           },
	 *           ...
	 *         ]
	 *       }
	 *     ]
	 *
	 * @type {Array}
	 * @ignore
	 */
	var __apiStruct = [];
	
	
	/**
	 * `Array.prototype` reference.
	 *
	 * @type object
	 * @ignore
	 */
	var __arrayProto = Array.prototype;
	
	
	/**
	 * Abstraction for `context` parameter of the `Api` constructor to allow it to
	 * take several different forms for ease of use.
	 *
	 * Each of the input parameter types will be converted to a DataTables settings
	 * object where possible.
	 *
	 * @param  {string|node|jQuery|object} mixed DataTable identifier. Can be one
	 *   of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 *   * `DataTables.Api` - API instance
	 * @return {array|null} Matching DataTables settings objects. `null` or
	 *   `undefined` is returned if no matching DataTable is found.
	 * @ignore
	 */
	var _toSettings = function ( mixed )
	{
		var idx, jq;
		var settings = DataTable.settings;
		var tables = $.map( settings, function (el, i) {
			return el.nTable;
		} );
	
		if ( ! mixed ) {
			return [];
		}
		else if ( mixed.nTable && mixed.oApi ) {
			// DataTables settings object
			return [ mixed ];
		}
		else if ( mixed.nodeName && mixed.nodeName.toLowerCase() === 'table' ) {
			// Table node
			idx = $.inArray( mixed, tables );
			return idx !== -1 ? [ settings[idx] ] : null;
		}
		else if ( mixed && typeof mixed.settings === 'function' ) {
			return mixed.settings().toArray();
		}
		else if ( typeof mixed === 'string' ) {
			// jQuery selector
			jq = $(mixed);
		}
		else if ( mixed instanceof $ ) {
			// jQuery object (also DataTables instance)
			jq = mixed;
		}
	
		if ( jq ) {
			return jq.map( function(i) {
				idx = $.inArray( this, tables );
				return idx !== -1 ? settings[idx] : null;
			} ).toArray();
		}
	};
	
	
	/**
	 * DataTables API class - used to control and interface with  one or more
	 * DataTables enhanced tables.
	 *
	 * The API class is heavily based on jQuery, presenting a chainable interface
	 * that you can use to interact with tables. Each instance of the API class has
	 * a "context" - i.e. the tables that it will operate on. This could be a single
	 * table, all tables on a page or a sub-set thereof.
	 *
	 * Additionally the API is designed to allow you to easily work with the data in
	 * the tables, retrieving and manipulating it as required. This is done by
	 * presenting the API class as an array like interface. The contents of the
	 * array depend upon the actions requested by each method (for example
	 * `rows().nodes()` will return an array of nodes, while `rows().data()` will
	 * return an array of objects or arrays depending upon your table's
	 * configuration). The API object has a number of array like methods (`push`,
	 * `pop`, `reverse` etc) as well as additional helper methods (`each`, `pluck`,
	 * `unique` etc) to assist your working with the data held in a table.
	 *
	 * Most methods (those which return an Api instance) are chainable, which means
	 * the return from a method call also has all of the methods available that the
	 * top level object had. For example, these two calls are equivalent:
	 *
	 *     // Not chained
	 *     api.row.add( {...} );
	 *     api.draw();
	 *
	 *     // Chained
	 *     api.row.add( {...} ).draw();
	 *
	 * @class DataTable.Api
	 * @param {array|object|string|jQuery} context DataTable identifier. This is
	 *   used to define which DataTables enhanced tables this API will operate on.
	 *   Can be one of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 * @param {array} [data] Data to initialise the Api instance with.
	 *
	 * @example
	 *   // Direct initialisation during DataTables construction
	 *   var api = $('#example').DataTable();
	 *
	 * @example
	 *   // Initialisation using a DataTables jQuery object
	 *   var api = $('#example').dataTable().api();
	 *
	 * @example
	 *   // Initialisation as a constructor
	 *   var api = new $.fn.DataTable.Api( 'table.dataTable' );
	 */
	_Api = function ( context, data )
	{
		if ( ! (this instanceof _Api) ) {
			return new _Api( context, data );
		}
	
		var settings = [];
		var ctxSettings = function ( o ) {
			var a = _toSettings( o );
			if ( a ) {
				settings.push.apply( settings, a );
			}
		};
	
		if ( Array.isArray( context ) ) {
			for ( var i=0, ien=context.length ; i<ien ; i++ ) {
				ctxSettings( context[i] );
			}
		}
		else {
			ctxSettings( context );
		}
	
		// Remove duplicates
		this.context = _unique( settings );
	
		// Initial data
		if ( data ) {
			$.merge( this, data );
		}
	
		// selector
		this.selector = {
			rows: null,
			cols: null,
			opts: null
		};
	
		_Api.extend( this, this, __apiStruct );
	};
	
	DataTable.Api = _Api;
	
	// Don't destroy the existing prototype, just extend it. Required for jQuery 2's
	// isPlainObject.
	$.extend( _Api.prototype, {
		any: function ()
		{
			return this.count() !== 0;
		},
	
	
		concat:  __arrayProto.concat,
	
	
		context: [], // array of table settings objects
	
	
		count: function ()
		{
			return this.flatten().length;
		},
	
	
		each: function ( fn )
		{
			for ( var i=0, ien=this.length ; i<ien; i++ ) {
				fn.call( this, this[i], i, this );
			}
	
			return this;
		},
	
	
		eq: function ( idx )
		{
			var ctx = this.context;
	
			return ctx.length > idx ?
				new _Api( ctx[idx], this[idx] ) :
				null;
		},
	
	
		filter: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.filter ) {
				a = __arrayProto.filter.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					if ( fn.call( this, this[i], i, this ) ) {
						a.push( this[i] );
					}
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		flatten: function ()
		{
			var a = [];
			return new _Api( this.context, a.concat.apply( a, this.toArray() ) );
		},
	
	
		join:    __arrayProto.join,
	
	
		indexOf: __arrayProto.indexOf || function (obj, start)
		{
			for ( var i=(start || 0), ien=this.length ; i<ien ; i++ ) {
				if ( this[i] === obj ) {
					return i;
				}
			}
			return -1;
		},
	
		iterator: function ( flatten, type, fn, alwaysNew ) {
			var
				a = [], ret,
				i, ien, j, jen,
				context = this.context,
				rows, items, item,
				selector = this.selector;
	
			// Argument shifting
			if ( typeof flatten === 'string' ) {
				alwaysNew = fn;
				fn = type;
				type = flatten;
				flatten = false;
			}
	
			for ( i=0, ien=context.length ; i<ien ; i++ ) {
				var apiInst = new _Api( context[i] );
	
				if ( type === 'table' ) {
					ret = fn.call( apiInst, context[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'columns' || type === 'rows' ) {
					// this has same length as context - one entry for each table
					ret = fn.call( apiInst, context[i], this[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'column' || type === 'column-rows' || type === 'row' || type === 'cell' ) {
					// columns and rows share the same structure.
					// 'this' is an array of column indexes for each context
					items = this[i];
	
					if ( type === 'column-rows' ) {
						rows = _selector_row_indexes( context[i], selector.opts );
					}
	
					for ( j=0, jen=items.length ; j<jen ; j++ ) {
						item = items[j];
	
						if ( type === 'cell' ) {
							ret = fn.call( apiInst, context[i], item.row, item.column, i, j );
						}
						else {
							ret = fn.call( apiInst, context[i], item, i, j, rows );
						}
	
						if ( ret !== undefined ) {
							a.push( ret );
						}
					}
				}
			}
	
			if ( a.length || alwaysNew ) {
				var api = new _Api( context, flatten ? a.concat.apply( [], a ) : a );
				var apiSelector = api.selector;
				apiSelector.rows = selector.rows;
				apiSelector.cols = selector.cols;
				apiSelector.opts = selector.opts;
				return api;
			}
			return this;
		},
	
	
		lastIndexOf: __arrayProto.lastIndexOf || function (obj, start)
		{
			// Bit cheeky...
			return this.indexOf.apply( this.toArray.reverse(), arguments );
		},
	
	
		length:  0,
	
	
		map: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.map ) {
				a = __arrayProto.map.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					a.push( fn.call( this, this[i], i ) );
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		pluck: function ( prop )
		{
			return this.map( function ( el ) {
				return el[ prop ];
			} );
		},
	
		pop:     __arrayProto.pop,
	
	
		push:    __arrayProto.push,
	
	
		// Does not return an API instance
		reduce: __arrayProto.reduce || function ( fn, init )
		{
			return _fnReduce( this, fn, init, 0, this.length, 1 );
		},
	
	
		reduceRight: __arrayProto.reduceRight || function ( fn, init )
		{
			return _fnReduce( this, fn, init, this.length-1, -1, -1 );
		},
	
	
		reverse: __arrayProto.reverse,
	
	
		// Object with rows, columns and opts
		selector: null,
	
	
		shift:   __arrayProto.shift,
	
	
		slice: function () {
			return new _Api( this.context, this );
		},
	
	
		sort:    __arrayProto.sort, // ? name - order?
	
	
		splice:  __arrayProto.splice,
	
	
		toArray: function ()
		{
			return __arrayProto.slice.call( this );
		},
	
	
		to$: function ()
		{
			return $( this );
		},
	
	
		toJQuery: function ()
		{
			return $( this );
		},
	
	
		unique: function ()
		{
			return new _Api( this.context, _unique(this) );
		},
	
	
		unshift: __arrayProto.unshift
	} );
	
	
	_Api.extend = function ( scope, obj, ext )
	{
		// Only extend API instances and static properties of the API
		if ( ! ext.length || ! obj || ( ! (obj instanceof _Api) && ! obj.__dt_wrapper ) ) {
			return;
		}
	
		var
			i, ien,
			struct,
			methodScoping = function ( scope, fn, struc ) {
				return function () {
					var ret = fn.apply( scope, arguments );
	
					// Method extension
					_Api.extend( ret, ret, struc.methodExt );
					return ret;
				};
			};
	
		for ( i=0, ien=ext.length ; i<ien ; i++ ) {
			struct = ext[i];
	
			// Value
			obj[ struct.name ] = struct.type === 'function' ?
				methodScoping( scope, struct.val, struct ) :
				struct.type === 'object' ?
					{} :
					struct.val;
	
			obj[ struct.name ].__dt_wrapper = true;
	
			// Property extension
			_Api.extend( scope, obj[ struct.name ], struct.propExt );
		}
	};
	
	
	// @todo - Is there need for an augment function?
	// _Api.augment = function ( inst, name )
	// {
	// 	// Find src object in the structure from the name
	// 	var parts = name.split('.');
	
	// 	_Api.extend( inst, obj );
	// };
	
	
	//     [
	//       {
	//         name:      'data'                -- string   - Property name
	//         val:       function () {},       -- function - Api method (or undefined if just an object
	//         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	//         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	//       },
	//       {
	//         name:     'row'
	//         val:       {},
	//         methodExt: [ ... ],
	//         propExt:   [
	//           {
	//             name:      'data'
	//             val:       function () {},
	//             methodExt: [ ... ],
	//             propExt:   [ ... ]
	//           },
	//           ...
	//         ]
	//       }
	//     ]
	
	_Api.register = _api_register = function ( name, val )
	{
		if ( Array.isArray( name ) ) {
			for ( var j=0, jen=name.length ; j<jen ; j++ ) {
				_Api.register( name[j], val );
			}
			return;
		}
	
		var
			i, ien,
			heir = name.split('.'),
			struct = __apiStruct,
			key, method;
	
		var find = function ( src, name ) {
			for ( var i=0, ien=src.length ; i<ien ; i++ ) {
				if ( src[i].name === name ) {
					return src[i];
				}
			}
			return null;
		};
	
		for ( i=0, ien=heir.length ; i<ien ; i++ ) {
			method = heir[i].indexOf('()') !== -1;
			key = method ?
				heir[i].replace('()', '') :
				heir[i];
	
			var src = find( struct, key );
			if ( ! src ) {
				src = {
					name:      key,
					val:       {},
					methodExt: [],
					propExt:   [],
					type:      'object'
				};
				struct.push( src );
			}
	
			if ( i === ien-1 ) {
				src.val = val;
				src.type = typeof val === 'function' ?
					'function' :
					$.isPlainObject( val ) ?
						'object' :
						'other';
			}
			else {
				struct = method ?
					src.methodExt :
					src.propExt;
			}
		}
	};
	
	_Api.registerPlural = _api_registerPlural = function ( pluralName, singularName, val ) {
		_Api.register( pluralName, val );
	
		_Api.register( singularName, function () {
			var ret = val.apply( this, arguments );
	
			if ( ret === this ) {
				// Returned item is the API instance that was passed in, return it
				return this;
			}
			else if ( ret instanceof _Api ) {
				// New API instance returned, want the value from the first item
				// in the returned array for the singular result.
				return ret.length ?
					Array.isArray( ret[0] ) ?
						new _Api( ret.context, ret[0] ) : // Array results are 'enhanced'
						ret[0] :
					undefined;
			}
	
			// Non-API return - just fire it back
			return ret;
		} );
	};
	
	
	/**
	 * Selector for HTML tables. Apply the given selector to the give array of
	 * DataTables settings objects.
	 *
	 * @param {string|integer} [selector] jQuery selector string or integer
	 * @param  {array} Array of DataTables settings objects to be filtered
	 * @return {array}
	 * @ignore
	 */
	var __table_selector = function ( selector, a )
	{
		if ( Array.isArray(selector) ) {
			return $.map( selector, function (item) {
				return __table_selector(item, a);
			} );
		}
	
		// Integer is used to pick out a table by index
		if ( typeof selector === 'number' ) {
			return [ a[ selector ] ];
		}
	
		// Perform a jQuery selector on the table nodes
		var nodes = $.map( a, function (el, i) {
			return el.nTable;
		} );
	
		return $(nodes)
			.filter( selector )
			.map( function (i) {
				// Need to translate back from the table node to the settings
				var idx = $.inArray( this, nodes );
				return a[ idx ];
			} )
			.toArray();
	};
	
	
	
	/**
	 * Context selector for the API's context (i.e. the tables the API instance
	 * refers to.
	 *
	 * @name    DataTable.Api#tables
	 * @param {string|integer} [selector] Selector to pick which tables the iterator
	 *   should operate on. If not given, all tables in the current context are
	 *   used. This can be given as a jQuery selector (for example `':gt(0)'`) to
	 *   select multiple tables or as an integer to select a single table.
	 * @returns {DataTable.Api} Returns a new API instance if a selector is given.
	 */
	_api_register( 'tables()', function ( selector ) {
		// A new instance is created if there was a selector specified
		return selector !== undefined && selector !== null ?
			new _Api( __table_selector( selector, this.context ) ) :
			this;
	} );
	
	
	_api_register( 'table()', function ( selector ) {
		var tables = this.tables( selector );
		var ctx = tables.context;
	
		// Truncate to the first matched table
		return ctx.length ?
			new _Api( ctx[0] ) :
			tables;
	} );
	
	
	_api_registerPlural( 'tables().nodes()', 'table().node()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTable;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().body()', 'table().body()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTBody;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().header()', 'table().header()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTHead;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().footer()', 'table().footer()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTFoot;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().containers()', 'table().container()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTableWrapper;
		}, 1 );
	} );
	
	
	
	/**
	 * Redraw the tables in the current context.
	 */
	_api_register( 'draw()', function ( paging ) {
		return this.iterator( 'table', function ( settings ) {
			if ( paging === 'page' ) {
				_fnDraw( settings );
			}
			else {
				if ( typeof paging === 'string' ) {
					paging = paging === 'full-hold' ?
						false :
						true;
				}
	
				_fnReDraw( settings, paging===false );
			}
		} );
	} );
	
	
	
	/**
	 * Get the current page index.
	 *
	 * @return {integer} Current page index (zero based)
	 *//**
	 * Set the current page.
	 *
	 * Note that if you attempt to show a page which does not exist, DataTables will
	 * not throw an error, but rather reset the paging.
	 *
	 * @param {integer|string} action The paging action to take. This can be one of:
	 *  * `integer` - The page index to jump to
	 *  * `string` - An action to take:
	 *    * `first` - Jump to first page.
	 *    * `next` - Jump to the next page
	 *    * `previous` - Jump to previous page
	 *    * `last` - Jump to the last page.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page()', function ( action ) {
		if ( action === undefined ) {
			return this.page.info().page; // not an expensive call
		}
	
		// else, have an action to take on all tables
		return this.iterator( 'table', function ( settings ) {
			_fnPageChange( settings, action );
		} );
	} );
	
	
	/**
	 * Paging information for the first table in the current context.
	 *
	 * If you require paging information for another table, use the `table()` method
	 * with a suitable selector.
	 *
	 * @return {object} Object with the following properties set:
	 *  * `page` - Current page index (zero based - i.e. the first page is `0`)
	 *  * `pages` - Total number of pages
	 *  * `start` - Display index for the first record shown on the current page
	 *  * `end` - Display index for the last record shown on the current page
	 *  * `length` - Display length (number of records). Note that generally `start
	 *    + length = end`, but this is not always true, for example if there are
	 *    only 2 records to show on the final page, with a length of 10.
	 *  * `recordsTotal` - Full data set length
	 *  * `recordsDisplay` - Data set length once the current filtering criterion
	 *    are applied.
	 */
	_api_register( 'page.info()', function ( action ) {
		if ( this.context.length === 0 ) {
			return undefined;
		}
	
		var
			settings   = this.context[0],
			start      = settings._iDisplayStart,
			len        = settings.oFeatures.bPaginate ? settings._iDisplayLength : -1,
			visRecords = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return {
			"page":           all ? 0 : Math.floor( start / len ),
			"pages":          all ? 1 : Math.ceil( visRecords / len ),
			"start":          start,
			"end":            settings.fnDisplayEnd(),
			"length":         len,
			"recordsTotal":   settings.fnRecordsTotal(),
			"recordsDisplay": visRecords,
			"serverSide":     _fnDataSource( settings ) === 'ssp'
		};
	} );
	
	
	/**
	 * Get the current page length.
	 *
	 * @return {integer} Current page length. Note `-1` indicates that all records
	 *   are to be shown.
	 *//**
	 * Set the current page length.
	 *
	 * @param {integer} Page length to set. Use `-1` to show all records.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page.len()', function ( len ) {
		// Note that we can't call this function 'length()' because `length`
		// is a Javascript property of functions which defines how many arguments
		// the function expects.
		if ( len === undefined ) {
			return this.context.length !== 0 ?
				this.context[0]._iDisplayLength :
				undefined;
		}
	
		// else, set the page length
		return this.iterator( 'table', function ( settings ) {
			_fnLengthChange( settings, len );
		} );
	} );
	
	
	
	var __reload = function ( settings, holdPosition, callback ) {
		// Use the draw event to trigger a callback
		if ( callback ) {
			var api = new _Api( settings );
	
			api.one( 'draw', function () {
				callback( api.ajax.json() );
			} );
		}
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			_fnReDraw( settings, holdPosition );
		}
		else {
			_fnProcessingDisplay( settings, true );
	
			// Cancel an existing request
			var xhr = settings.jqXHR;
			if ( xhr && xhr.readyState !== 4 ) {
				xhr.abort();
			}
	
			// Trigger xhr
			_fnBuildAjax( settings, [], function( json ) {
				_fnClearTable( settings );
	
				var data = _fnAjaxDataSrc( settings, json );
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					_fnAddData( settings, data[i] );
				}
	
				_fnReDraw( settings, holdPosition );
				_fnProcessingDisplay( settings, false );
			} );
		}
	};
	
	
	/**
	 * Get the JSON response from the last Ajax request that DataTables made to the
	 * server. Note that this returns the JSON from the first table in the current
	 * context.
	 *
	 * @return {object} JSON received from the server.
	 */
	_api_register( 'ajax.json()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].json;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Get the data submitted in the last Ajax request
	 */
	_api_register( 'ajax.params()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].oAjaxData;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Reload tables from the Ajax data source. Note that this function will
	 * automatically re-draw the table when the remote data has been loaded.
	 *
	 * @param {boolean} [reset=true] Reset (default) or hold the current paging
	 *   position. A full re-sort and re-filter is performed when this method is
	 *   called, which is why the pagination reset is the default action.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.reload()', function ( callback, resetPaging ) {
		return this.iterator( 'table', function (settings) {
			__reload( settings, resetPaging===false, callback );
		} );
	} );
	
	
	/**
	 * Get the current Ajax URL. Note that this returns the URL from the first
	 * table in the current context.
	 *
	 * @return {string} Current Ajax source URL
	 *//**
	 * Set the Ajax URL. Note that this will set the URL for all tables in the
	 * current context.
	 *
	 * @param {string} url URL to set.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url()', function ( url ) {
		var ctx = this.context;
	
		if ( url === undefined ) {
			// get
			if ( ctx.length === 0 ) {
				return undefined;
			}
			ctx = ctx[0];
	
			return ctx.ajax ?
				$.isPlainObject( ctx.ajax ) ?
					ctx.ajax.url :
					ctx.ajax :
				ctx.sAjaxSource;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( $.isPlainObject( settings.ajax ) ) {
				settings.ajax.url = url;
			}
			else {
				settings.ajax = url;
			}
			// No need to consider sAjaxSource here since DataTables gives priority
			// to `ajax` over `sAjaxSource`. So setting `ajax` here, renders any
			// value of `sAjaxSource` redundant.
		} );
	} );
	
	
	/**
	 * Load data from the newly set Ajax URL. Note that this method is only
	 * available when `ajax.url()` is used to set a URL. Additionally, this method
	 * has the same effect as calling `ajax.reload()` but is provided for
	 * convenience when setting a new URL. Like `ajax.reload()` it will
	 * automatically redraw the table once the remote data has been loaded.
	 *
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url().load()', function ( callback, resetPaging ) {
		// Same as a reload, but makes sense to present it for easy access after a
		// url change
		return this.iterator( 'table', function ( ctx ) {
			__reload( ctx, resetPaging===false, callback );
		} );
	} );
	
	
	
	
	var _selector_run = function ( type, selector, selectFn, settings, opts )
	{
		var
			out = [], res,
			a, i, ien, j, jen,
			selectorType = typeof selector;
	
		// Can't just check for isArray here, as an API or jQuery instance might be
		// given with their array like look
		if ( ! selector || selectorType === 'string' || selectorType === 'function' || selector.length === undefined ) {
			selector = [ selector ];
		}
	
		for ( i=0, ien=selector.length ; i<ien ; i++ ) {
			// Only split on simple strings - complex expressions will be jQuery selectors
			a = selector[i] && selector[i].split && ! selector[i].match(/[\[\(:]/) ?
				selector[i].split(',') :
				[ selector[i] ];
	
			for ( j=0, jen=a.length ; j<jen ; j++ ) {
				res = selectFn( typeof a[j] === 'string' ? (a[j]).trim() : a[j] );
	
				if ( res && res.length ) {
					out = out.concat( res );
				}
			}
		}
	
		// selector extensions
		var ext = _ext.selector[ type ];
		if ( ext.length ) {
			for ( i=0, ien=ext.length ; i<ien ; i++ ) {
				out = ext[i]( settings, opts, out );
			}
		}
	
		return _unique( out );
	};
	
	
	var _selector_opts = function ( opts )
	{
		if ( ! opts ) {
			opts = {};
		}
	
		// Backwards compatibility for 1.9- which used the terminology filter rather
		// than search
		if ( opts.filter && opts.search === undefined ) {
			opts.search = opts.filter;
		}
	
		return $.extend( {
			search: 'none',
			order: 'current',
			page: 'all'
		}, opts );
	};
	
	
	var _selector_first = function ( inst )
	{
		// Reduce the API instance to the first item found
		for ( var i=0, ien=inst.length ; i<ien ; i++ ) {
			if ( inst[i].length > 0 ) {
				// Assign the first element to the first item in the instance
				// and truncate the instance and context
				inst[0] = inst[i];
				inst[0].length = 1;
				inst.length = 1;
				inst.context = [ inst.context[i] ];
	
				return inst;
			}
		}
	
		// Not found - return an empty instance
		inst.length = 0;
		return inst;
	};
	
	
	var _selector_row_indexes = function ( settings, opts )
	{
		var
			i, ien, tmp, a=[],
			displayFiltered = settings.aiDisplay,
			displayMaster = settings.aiDisplayMaster;
	
		var
			search = opts.search,  // none, applied, removed
			order  = opts.order,   // applied, current, index (original - compatibility with 1.9)
			page   = opts.page;    // all, current
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			// In server-side processing mode, most options are irrelevant since
			// rows not shown don't exist and the index order is the applied order
			// Removed is a special case - for consistency just return an empty
			// array
			return search === 'removed' ?
				[] :
				_range( 0, displayMaster.length );
		}
		else if ( page == 'current' ) {
			// Current page implies that order=current and fitler=applied, since it is
			// fairly senseless otherwise, regardless of what order and search actually
			// are
			for ( i=settings._iDisplayStart, ien=settings.fnDisplayEnd() ; i<ien ; i++ ) {
				a.push( displayFiltered[i] );
			}
		}
		else if ( order == 'current' || order == 'applied' ) {
			if ( search == 'none') {
				a = displayMaster.slice();
			}
			else if ( search == 'applied' ) {
				a = displayFiltered.slice();
			}
			else if ( search == 'removed' ) {
				// O(n+m) solution by creating a hash map
				var displayFilteredMap = {};
	
				for ( var i=0, ien=displayFiltered.length ; i<ien ; i++ ) {
					displayFilteredMap[displayFiltered[i]] = null;
				}
	
				a = $.map( displayMaster, function (el) {
					return ! displayFilteredMap.hasOwnProperty(el) ?
						el :
						null;
				} );
			}
		}
		else if ( order == 'index' || order == 'original' ) {
			for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				if ( search == 'none' ) {
					a.push( i );
				}
				else { // applied | removed
					tmp = $.inArray( i, displayFiltered );
	
					if ((tmp === -1 && search == 'removed') ||
						(tmp >= 0   && search == 'applied') )
					{
						a.push( i );
					}
				}
			}
		}
	
		return a;
	};
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Rows
	 *
	 * {}          - no selector - use all available rows
	 * {integer}   - row aoData index
	 * {node}      - TR node
	 * {string}    - jQuery selector to apply to the TR elements
	 * {array}     - jQuery array of nodes, or simply an array of TR nodes
	 *
	 */
	var __row_selector = function ( settings, selector, opts )
	{
		var rows;
		var run = function ( sel ) {
			var selInt = _intVal( sel );
			var i, ien;
			var aoData = settings.aoData;
	
			// Short cut - selector is a number and no options provided (default is
			// all records, so no need to check if the index is in there, since it
			// must be - dev error if the index doesn't exist).
			if ( selInt !== null && ! opts ) {
				return [ selInt ];
			}
	
			if ( ! rows ) {
				rows = _selector_row_indexes( settings, opts );
			}
	
			if ( selInt !== null && $.inArray( selInt, rows ) !== -1 ) {
				// Selector - integer
				return [ selInt ];
			}
			else if ( sel === null || sel === undefined || sel === '' ) {
				// Selector - none
				return rows;
			}
	
			// Selector - function
			if ( typeof sel === 'function' ) {
				return $.map( rows, function (idx) {
					var row = aoData[ idx ];
					return sel( idx, row._aData, row.nTr ) ? idx : null;
				} );
			}
	
			// Selector - node
			if ( sel.nodeName ) {
				var rowIdx = sel._DT_RowIndex;  // Property added by DT for fast lookup
				var cellIdx = sel._DT_CellIndex;
	
				if ( rowIdx !== undefined ) {
					// Make sure that the row is actually still present in the table
					return aoData[ rowIdx ] && aoData[ rowIdx ].nTr === sel ?
						[ rowIdx ] :
						[];
				}
				else if ( cellIdx ) {
					return aoData[ cellIdx.row ] && aoData[ cellIdx.row ].nTr === sel.parentNode ?
						[ cellIdx.row ] :
						[];
				}
				else {
					var host = $(sel).closest('*[data-dt-row]');
					return host.length ?
						[ host.data('dt-row') ] :
						[];
				}
			}
	
			// ID selector. Want to always be able to select rows by id, regardless
			// of if the tr element has been created or not, so can't rely upon
			// jQuery here - hence a custom implementation. This does not match
			// Sizzle's fast selector or HTML4 - in HTML5 the ID can be anything,
			// but to select it using a CSS selector engine (like Sizzle or
			// querySelect) it would need to need to be escaped for some characters.
			// DataTables simplifies this for row selectors since you can select
			// only a row. A # indicates an id any anything that follows is the id -
			// unescaped.
			if ( typeof sel === 'string' && sel.charAt(0) === '#' ) {
				// get row index from id
				var rowObj = settings.aIds[ sel.replace( /^#/, '' ) ];
				if ( rowObj !== undefined ) {
					return [ rowObj.idx ];
				}
	
				// need to fall through to jQuery in case there is DOM id that
				// matches
			}
			
			// Get nodes in the order from the `rows` array with null values removed
			var nodes = _removeEmpty(
				_pluck_order( settings.aoData, rows, 'nTr' )
			);
	
			// Selector - jQuery selector string, array of nodes or jQuery object/
			// As jQuery's .filter() allows jQuery objects to be passed in filter,
			// it also allows arrays, so this will cope with all three options
			return $(nodes)
				.filter( sel )
				.map( function () {
					return this._DT_RowIndex;
				} )
				.toArray();
		};
	
		return _selector_run( 'row', selector, run, settings, opts );
	};
	
	
	_api_register( 'rows()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __row_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in __row_selector?
		inst.selector.rows = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_register( 'rows().nodes()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return settings.aoData[ row ].nTr || undefined;
		}, 1 );
	} );
	
	_api_register( 'rows().data()', function () {
		return this.iterator( true, 'rows', function ( settings, rows ) {
			return _pluck_order( settings.aoData, rows, '_aData' );
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().cache()', 'row().cache()', function ( type ) {
		return this.iterator( 'row', function ( settings, row ) {
			var r = settings.aoData[ row ];
			return type === 'search' ? r._aFilterData : r._aSortData;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().invalidate()', 'row().invalidate()', function ( src ) {
		return this.iterator( 'row', function ( settings, row ) {
			_fnInvalidate( settings, row, src );
		} );
	} );
	
	_api_registerPlural( 'rows().indexes()', 'row().index()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return row;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().ids()', 'row().id()', function ( hash ) {
		var a = [];
		var context = this.context;
	
		// `iterator` will drop undefined values, but in this case we want them
		for ( var i=0, ien=context.length ; i<ien ; i++ ) {
			for ( var j=0, jen=this[i].length ; j<jen ; j++ ) {
				var id = context[i].rowIdFn( context[i].aoData[ this[i][j] ]._aData );
				a.push( (hash === true ? '#' : '' )+ id );
			}
		}
	
		return new _Api( context, a );
	} );
	
	_api_registerPlural( 'rows().remove()', 'row().remove()', function () {
		var that = this;
	
		this.iterator( 'row', function ( settings, row, thatIdx ) {
			var data = settings.aoData;
			var rowData = data[ row ];
			var i, ien, j, jen;
			var loopRow, loopCells;
	
			data.splice( row, 1 );
	
			// Update the cached indexes
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				loopRow = data[i];
				loopCells = loopRow.anCells;
	
				// Rows
				if ( loopRow.nTr !== null ) {
					loopRow.nTr._DT_RowIndex = i;
				}
	
				// Cells
				if ( loopCells !== null ) {
					for ( j=0, jen=loopCells.length ; j<jen ; j++ ) {
						loopCells[j]._DT_CellIndex.row = i;
					}
				}
			}
	
			// Delete from the display arrays
			_fnDeleteIndex( settings.aiDisplayMaster, row );
			_fnDeleteIndex( settings.aiDisplay, row );
			_fnDeleteIndex( that[ thatIdx ], row, false ); // maintain local indexes
	
			// For server-side processing tables - subtract the deleted row from the count
			if ( settings._iRecordsDisplay > 0 ) {
				settings._iRecordsDisplay--;
			}
	
			// Check for an 'overflow' they case for displaying the table
			_fnLengthOverflow( settings );
	
			// Remove the row's ID reference if there is one
			var id = settings.rowIdFn( rowData._aData );
			if ( id !== undefined ) {
				delete settings.aIds[ id ];
			}
		} );
	
		this.iterator( 'table', function ( settings ) {
			for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				settings.aoData[i].idx = i;
			}
		} );
	
		return this;
	} );
	
	
	_api_register( 'rows.add()', function ( rows ) {
		var newRows = this.iterator( 'table', function ( settings ) {
				var row, i, ien;
				var out = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
						out.push( _fnAddTr( settings, row )[0] );
					}
					else {
						out.push( _fnAddData( settings, row ) );
					}
				}
	
				return out;
			}, 1 );
	
		// Return an Api.rows() extended instance, so rows().nodes() etc can be used
		var modRows = this.rows( -1 );
		modRows.pop();
		$.merge( modRows, newRows );
	
		return modRows;
	} );
	
	
	
	
	
	/**
	 *
	 */
	_api_register( 'row()', function ( selector, opts ) {
		return _selector_first( this.rows( selector, opts ) );
	} );
	
	
	_api_register( 'row().data()', function ( data ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// Get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._aData :
				undefined;
		}
	
		// Set
		var row = ctx[0].aoData[ this[0] ];
		row._aData = data;
	
		// If the DOM has an id, and the data source is an array
		if ( Array.isArray( data ) && row.nTr && row.nTr.id ) {
			_fnSetObjectDataFn( ctx[0].rowId )( data, row.nTr.id );
		}
	
		// Automatically invalidate
		_fnInvalidate( ctx[0], this[0], 'data' );
	
		return this;
	} );
	
	
	_api_register( 'row().node()', function () {
		var ctx = this.context;
	
		return ctx.length && this.length ?
			ctx[0].aoData[ this[0] ].nTr || null :
			null;
	} );
	
	
	_api_register( 'row.add()', function ( row ) {
		// Allow a jQuery object to be passed in - only a single row is added from
		// it though - the first element in the set
		if ( row instanceof $ && row.length ) {
			row = row[0];
		}
	
		var rows = this.iterator( 'table', function ( settings ) {
			if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
				return _fnAddTr( settings, row )[0];
			}
			return _fnAddData( settings, row );
		} );
	
		// Return an Api.rows() extended instance, with the newly added row selected
		return this.row( rows[0] );
	} );
	
	
	
	var __details_add = function ( ctx, row, data, klass )
	{
		// Convert to array of TR elements
		var rows = [];
		var addRow = function ( r, k ) {
			// Recursion to allow for arrays of jQuery objects
			if ( Array.isArray( r ) || r instanceof $ ) {
				for ( var i=0, ien=r.length ; i<ien ; i++ ) {
					addRow( r[i], k );
				}
				return;
			}
	
			// If we get a TR element, then just add it directly - up to the dev
			// to add the correct number of columns etc
			if ( r.nodeName && r.nodeName.toLowerCase() === 'tr' ) {
				rows.push( r );
			}
			else {
				// Otherwise create a row with a wrapper
				var created = $('<tr><td></td></tr>').addClass( k );
				$('td', created)
					.addClass( k )
					.html( r )
					[0].colSpan = _fnVisbleColumns( ctx );
	
				rows.push( created[0] );
			}
		};
	
		addRow( data, klass );
	
		if ( row._details ) {
			row._details.detach();
		}
	
		row._details = $(rows);
	
		// If the children were already shown, that state should be retained
		if ( row._detailsShow ) {
			row._details.insertAfter( row.nTr );
		}
	};
	
	
	var __details_remove = function ( api, idx )
	{
		var ctx = api.context;
	
		if ( ctx.length ) {
			var row = ctx[0].aoData[ idx !== undefined ? idx : api[0] ];
	
			if ( row && row._details ) {
				row._details.remove();
	
				row._detailsShow = undefined;
				row._details = undefined;
			}
		}
	};
	
	
	var __details_display = function ( api, show ) {
		var ctx = api.context;
	
		if ( ctx.length && api.length ) {
			var row = ctx[0].aoData[ api[0] ];
	
			if ( row._details ) {
				row._detailsShow = show;
	
				if ( show ) {
					row._details.insertAfter( row.nTr );
				}
				else {
					row._details.detach();
				}
	
				__details_events( ctx[0] );
			}
		}
	};
	
	
	var __details_events = function ( settings )
	{
		var api = new _Api( settings );
		var namespace = '.dt.DT_details';
		var drawEvent = 'draw'+namespace;
		var colvisEvent = 'column-visibility'+namespace;
		var destroyEvent = 'destroy'+namespace;
		var data = settings.aoData;
	
		api.off( drawEvent +' '+ colvisEvent +' '+ destroyEvent );
	
		if ( _pluck( data, '_details' ).length > 0 ) {
			// On each draw, insert the required elements into the document
			api.on( drawEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				api.rows( {page:'current'} ).eq(0).each( function (idx) {
					// Internal data grab
					var row = data[ idx ];
	
					if ( row._detailsShow ) {
						row._details.insertAfter( row.nTr );
					}
				} );
			} );
	
			// Column visibility change - update the colspan
			api.on( colvisEvent, function ( e, ctx, idx, vis ) {
				if ( settings !== ctx ) {
					return;
				}
	
				// Update the colspan for the details rows (note, only if it already has
				// a colspan)
				var row, visible = _fnVisbleColumns( ctx );
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					row = data[i];
	
					if ( row._details ) {
						row._details.children('td[colspan]').attr('colspan', visible );
					}
				}
			} );
	
			// Table destroyed - nuke any child rows
			api.on( destroyEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					if ( data[i]._details ) {
						__details_remove( api, i );
					}
				}
			} );
		}
	};
	
	// Strings for the method names to help minification
	var _emp = '';
	var _child_obj = _emp+'row().child';
	var _child_mth = _child_obj+'()';
	
	// data can be:
	//  tr
	//  string
	//  jQuery or array of any of the above
	_api_register( _child_mth, function ( data, klass ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._details :
				undefined;
		}
		else if ( data === true ) {
			// show
			this.child.show();
		}
		else if ( data === false ) {
			// remove
			__details_remove( this );
		}
		else if ( ctx.length && this.length ) {
			// set
			__details_add( ctx[0], ctx[0].aoData[ this[0] ], data, klass );
		}
	
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.show()',
		_child_mth+'.show()' // only when `child()` was called with parameters (without
	], function ( show ) {   // it returns an object and this method is not executed)
		__details_display( this, true );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.hide()',
		_child_mth+'.hide()' // only when `child()` was called with parameters (without
	], function () {         // it returns an object and this method is not executed)
		__details_display( this, false );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.remove()',
		_child_mth+'.remove()' // only when `child()` was called with parameters (without
	], function () {           // it returns an object and this method is not executed)
		__details_remove( this );
		return this;
	} );
	
	
	_api_register( _child_obj+'.isShown()', function () {
		var ctx = this.context;
	
		if ( ctx.length && this.length ) {
			// _detailsShown as false or undefined will fall through to return false
			return ctx[0].aoData[ this[0] ]._detailsShow || false;
		}
		return false;
	} );
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Columns
	 *
	 * {integer}           - column index (>=0 count from left, <0 count from right)
	 * "{integer}:visIdx"  - visible column index (i.e. translate to column index)  (>=0 count from left, <0 count from right)
	 * "{integer}:visible" - alias for {integer}:visIdx  (>=0 count from left, <0 count from right)
	 * "{string}:name"     - column name
	 * "{string}"          - jQuery selector on column header nodes
	 *
	 */
	
	// can be an array of these items, comma separated list, or an array of comma
	// separated lists
	
	var __re_column_selector = /^([^:]+):(name|visIdx|visible)$/;
	
	
	// r1 and r2 are redundant - but it means that the parameters match for the
	// iterator callback in columns().data()
	var __columnData = function ( settings, column, r1, r2, rows ) {
		var a = [];
		for ( var row=0, ien=rows.length ; row<ien ; row++ ) {
			a.push( _fnGetCellData( settings, rows[row], column ) );
		}
		return a;
	};
	
	
	var __column_selector = function ( settings, selector, opts )
	{
		var
			columns = settings.aoColumns,
			names = _pluck( columns, 'sName' ),
			nodes = _pluck( columns, 'nTh' );
	
		var run = function ( s ) {
			var selInt = _intVal( s );
	
			// Selector - all
			if ( s === '' ) {
				return _range( columns.length );
			}
	
			// Selector - index
			if ( selInt !== null ) {
				return [ selInt >= 0 ?
					selInt : // Count from left
					columns.length + selInt // Count from right (+ because its a negative value)
				];
			}
	
			// Selector = function
			if ( typeof s === 'function' ) {
				var rows = _selector_row_indexes( settings, opts );
	
				return $.map( columns, function (col, idx) {
					return s(
							idx,
							__columnData( settings, idx, 0, 0, rows ),
							nodes[ idx ]
						) ? idx : null;
				} );
			}
	
			// jQuery or string selector
			var match = typeof s === 'string' ?
				s.match( __re_column_selector ) :
				'';
	
			if ( match ) {
				switch( match[2] ) {
					case 'visIdx':
					case 'visible':
						var idx = parseInt( match[1], 10 );
						// Visible index given, convert to column index
						if ( idx < 0 ) {
							// Counting from the right
							var visColumns = $.map( columns, function (col,i) {
								return col.bVisible ? i : null;
							} );
							return [ visColumns[ visColumns.length + idx ] ];
						}
						// Counting from the left
						return [ _fnVisibleToColumnIndex( settings, idx ) ];
	
					case 'name':
						// match by name. `names` is column index complete and in order
						return $.map( names, function (name, i) {
							return name === match[1] ? i : null;
						} );
	
					default:
						return [];
				}
			}
	
			// Cell in the table body
			if ( s.nodeName && s._DT_CellIndex ) {
				return [ s._DT_CellIndex.column ];
			}
	
			// jQuery selector on the TH elements for the columns
			var jqResult = $( nodes )
				.filter( s )
				.map( function () {
					return $.inArray( this, nodes ); // `nodes` is column index complete and in order
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise a node which might have a `dt-column` data attribute, or be
			// a child or such an element
			var host = $(s).closest('*[data-dt-column]');
			return host.length ?
				[ host.data('dt-column') ] :
				[];
		};
	
		return _selector_run( 'column', selector, run, settings, opts );
	};
	
	
	var __setColumnVis = function ( settings, column, vis ) {
		var
			cols = settings.aoColumns,
			col  = cols[ column ],
			data = settings.aoData,
			row, cells, i, ien, tr;
	
		// Get
		if ( vis === undefined ) {
			return col.bVisible;
		}
	
		// Set
		// No change
		if ( col.bVisible === vis ) {
			return;
		}
	
		if ( vis ) {
			// Insert column
			// Need to decide if we should use appendChild or insertBefore
			var insertBefore = $.inArray( true, _pluck(cols, 'bVisible'), column+1 );
	
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				tr = data[i].nTr;
				cells = data[i].anCells;
	
				if ( tr ) {
					// insertBefore can act like appendChild if 2nd arg is null
					tr.insertBefore( cells[ column ], cells[ insertBefore ] || null );
				}
			}
		}
		else {
			// Remove column
			$( _pluck( settings.aoData, 'anCells', column ) ).detach();
		}
	
		// Common actions
		col.bVisible = vis;
	};
	
	
	_api_register( 'columns()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __column_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in _row_selector?
		inst.selector.cols = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_registerPlural( 'columns().header()', 'column().header()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTh;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().footer()', 'column().footer()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTf;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().data()', 'column().data()', function () {
		return this.iterator( 'column-rows', __columnData, 1 );
	} );
	
	_api_registerPlural( 'columns().dataSrc()', 'column().dataSrc()', function () {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].mData;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().cache()', 'column().cache()', function ( type ) {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows,
				type === 'search' ? '_aFilterData' : '_aSortData', column
			);
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().nodes()', 'column().nodes()', function () {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows, 'anCells', column ) ;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().visible()', 'column().visible()', function ( vis, calc ) {
		var that = this;
		var ret = this.iterator( 'column', function ( settings, column ) {
			if ( vis === undefined ) {
				return settings.aoColumns[ column ].bVisible;
			} // else
			__setColumnVis( settings, column, vis );
		} );
	
		// Group the column visibility changes
		if ( vis !== undefined ) {
			this.iterator( 'table', function ( settings ) {
				// Redraw the header after changes
				_fnDrawHead( settings, settings.aoHeader );
				_fnDrawHead( settings, settings.aoFooter );
		
				// Update colspan for no records display. Child rows and extensions will use their own
				// listeners to do this - only need to update the empty table item here
				if ( ! settings.aiDisplay.length ) {
					$(settings.nTBody).find('td[colspan]').attr('colspan', _fnVisbleColumns(settings));
				}
		
				_fnSaveState( settings );
	
				// Second loop once the first is done for events
				that.iterator( 'column', function ( settings, column ) {
					_fnCallbackFire( settings, null, 'column-visibility', [settings, column, vis, calc] );
				} );
	
				if ( calc === undefined || calc ) {
					that.columns.adjust();
				}
			});
		}
	
		return ret;
	} );
	
	_api_registerPlural( 'columns().indexes()', 'column().index()', function ( type ) {
		return this.iterator( 'column', function ( settings, column ) {
			return type === 'visible' ?
				_fnColumnIndexToVisible( settings, column ) :
				column;
		}, 1 );
	} );
	
	_api_register( 'columns.adjust()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnAdjustColumnSizing( settings );
		}, 1 );
	} );
	
	_api_register( 'column.index()', function ( type, idx ) {
		if ( this.context.length !== 0 ) {
			var ctx = this.context[0];
	
			if ( type === 'fromVisible' || type === 'toData' ) {
				return _fnVisibleToColumnIndex( ctx, idx );
			}
			else if ( type === 'fromData' || type === 'toVisible' ) {
				return _fnColumnIndexToVisible( ctx, idx );
			}
		}
	} );
	
	_api_register( 'column()', function ( selector, opts ) {
		return _selector_first( this.columns( selector, opts ) );
	} );
	
	var __cell_selector = function ( settings, selector, opts )
	{
		var data = settings.aoData;
		var rows = _selector_row_indexes( settings, opts );
		var cells = _removeEmpty( _pluck_order( data, rows, 'anCells' ) );
		var allCells = $(_flatten( [], cells ));
		var row;
		var columns = settings.aoColumns.length;
		var a, i, ien, j, o, host;
	
		var run = function ( s ) {
			var fnSelector = typeof s === 'function';
	
			if ( s === null || s === undefined || fnSelector ) {
				// All cells and function selectors
				a = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					for ( j=0 ; j<columns ; j++ ) {
						o = {
							row: row,
							column: j
						};
	
						if ( fnSelector ) {
							// Selector - function
							host = data[ row ];
	
							if ( s( o, _fnGetCellData(settings, row, j), host.anCells ? host.anCells[j] : null ) ) {
								a.push( o );
							}
						}
						else {
							// Selector - all
							a.push( o );
						}
					}
				}
	
				return a;
			}
			
			// Selector - index
			if ( $.isPlainObject( s ) ) {
				// Valid cell index and its in the array of selectable rows
				return s.column !== undefined && s.row !== undefined && $.inArray( s.row, rows ) !== -1 ?
					[s] :
					[];
			}
	
			// Selector - jQuery filtered cells
			var jqResult = allCells
				.filter( s )
				.map( function (i, el) {
					return { // use a new object, in case someone changes the values
						row:    el._DT_CellIndex.row,
						column: el._DT_CellIndex.column
	 				};
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise the selector is a node, and there is one last option - the
			// element might be a child of an element which has dt-row and dt-column
			// data attributes
			host = $(s).closest('*[data-dt-row]');
			return host.length ?
				[ {
					row: host.data('dt-row'),
					column: host.data('dt-column')
				} ] :
				[];
		};
	
		return _selector_run( 'cell', selector, run, settings, opts );
	};
	
	
	
	
	_api_register( 'cells()', function ( rowSelector, columnSelector, opts ) {
		// Argument shifting
		if ( $.isPlainObject( rowSelector ) ) {
			// Indexes
			if ( rowSelector.row === undefined ) {
				// Selector options in first parameter
				opts = rowSelector;
				rowSelector = null;
			}
			else {
				// Cell index objects in first parameter
				opts = columnSelector;
				columnSelector = null;
			}
		}
		if ( $.isPlainObject( columnSelector ) ) {
			opts = columnSelector;
			columnSelector = null;
		}
	
		// Cell selector
		if ( columnSelector === null || columnSelector === undefined ) {
			return this.iterator( 'table', function ( settings ) {
				return __cell_selector( settings, rowSelector, _selector_opts( opts ) );
			} );
		}
	
		// The default built in options need to apply to row and columns
		var internalOpts = opts ? {
			page: opts.page,
			order: opts.order,
			search: opts.search
		} : {};
	
		// Row + column selector
		var columns = this.columns( columnSelector, internalOpts );
		var rows = this.rows( rowSelector, internalOpts );
		var i, ien, j, jen;
	
		var cellsNoOpts = this.iterator( 'table', function ( settings, idx ) {
			var a = [];
	
			for ( i=0, ien=rows[idx].length ; i<ien ; i++ ) {
				for ( j=0, jen=columns[idx].length ; j<jen ; j++ ) {
					a.push( {
						row:    rows[idx][i],
						column: columns[idx][j]
					} );
				}
			}
	
			return a;
		}, 1 );
	
		// There is currently only one extension which uses a cell selector extension
		// It is a _major_ performance drag to run this if it isn't needed, so this is
		// an extension specific check at the moment
		var cells = opts && opts.selected ?
			this.cells( cellsNoOpts, opts ) :
			cellsNoOpts;
	
		$.extend( cells.selector, {
			cols: columnSelector,
			rows: rowSelector,
			opts: opts
		} );
	
		return cells;
	} );
	
	
	_api_registerPlural( 'cells().nodes()', 'cell().node()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			var data = settings.aoData[ row ];
	
			return data && data.anCells ?
				data.anCells[ column ] :
				undefined;
		}, 1 );
	} );
	
	
	_api_register( 'cells().data()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().cache()', 'cell().cache()', function ( type ) {
		type = type === 'search' ? '_aFilterData' : '_aSortData';
	
		return this.iterator( 'cell', function ( settings, row, column ) {
			return settings.aoData[ row ][ type ][ column ];
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().render()', 'cell().render()', function ( type ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column, type );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().indexes()', 'cell().index()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return {
				row: row,
				column: column,
				columnVisible: _fnColumnIndexToVisible( settings, column )
			};
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().invalidate()', 'cell().invalidate()', function ( src ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			_fnInvalidate( settings, row, src, column );
		} );
	} );
	
	
	
	_api_register( 'cell()', function ( rowSelector, columnSelector, opts ) {
		return _selector_first( this.cells( rowSelector, columnSelector, opts ) );
	} );
	
	
	_api_register( 'cell().data()', function ( data ) {
		var ctx = this.context;
		var cell = this[0];
	
		if ( data === undefined ) {
			// Get
			return ctx.length && cell.length ?
				_fnGetCellData( ctx[0], cell[0].row, cell[0].column ) :
				undefined;
		}
	
		// Set
		_fnSetCellData( ctx[0], cell[0].row, cell[0].column, data );
		_fnInvalidate( ctx[0], cell[0].row, 'data', cell[0].column );
	
		return this;
	} );
	
	
	
	/**
	 * Get current ordering (sorting) that has been applied to the table.
	 *
	 * @returns {array} 2D array containing the sorting information for the first
	 *   table in the current context. Each element in the parent array represents
	 *   a column being sorted upon (i.e. multi-sorting with two columns would have
	 *   2 inner arrays). The inner arrays may have 2 or 3 elements. The first is
	 *   the column index that the sorting condition applies to, the second is the
	 *   direction of the sort (`desc` or `asc`) and, optionally, the third is the
	 *   index of the sorting order from the `column.sorting` initialisation array.
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {integer} order Column index to sort upon.
	 * @param {string} direction Direction of the sort to be applied (`asc` or `desc`)
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 1D array of sorting information to be applied.
	 * @param {array} [...] Optional additional sorting conditions
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 2D array of sorting information to be applied.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order()', function ( order, dir ) {
		var ctx = this.context;
	
		if ( order === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].aaSorting :
				undefined;
		}
	
		// set
		if ( typeof order === 'number' ) {
			// Simple column / direction passed in
			order = [ [ order, dir ] ];
		}
		else if ( order.length && ! Array.isArray( order[0] ) ) {
			// Arguments passed in (list of 1D arrays)
			order = Array.prototype.slice.call( arguments );
		}
		// otherwise a 2D array was passed in
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSorting = order.slice();
		} );
	} );
	
	
	/**
	 * Attach a sort listener to an element for a given column
	 *
	 * @param {node|jQuery|string} node Identifier for the element(s) to attach the
	 *   listener to. This can take the form of a single DOM node, a jQuery
	 *   collection of nodes or a jQuery selector which will identify the node(s).
	 * @param {integer} column the column that a click on this node will sort on
	 * @param {function} [callback] callback function when sort is run
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order.listener()', function ( node, column, callback ) {
		return this.iterator( 'table', function ( settings ) {
			_fnSortAttachListener( settings, node, column, callback );
		} );
	} );
	
	
	_api_register( 'order.fixed()', function ( set ) {
		if ( ! set ) {
			var ctx = this.context;
			var fixed = ctx.length ?
				ctx[0].aaSortingFixed :
				undefined;
	
			return Array.isArray( fixed ) ?
				{ pre: fixed } :
				fixed;
		}
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSortingFixed = $.extend( true, {}, set );
		} );
	} );
	
	
	// Order by the selected column(s)
	_api_register( [
		'columns().order()',
		'column().order()'
	], function ( dir ) {
		var that = this;
	
		return this.iterator( 'table', function ( settings, i ) {
			var sort = [];
	
			$.each( that[i], function (j, col) {
				sort.push( [ col, dir ] );
			} );
	
			settings.aaSorting = sort;
		} );
	} );
	
	
	
	_api_register( 'search()', function ( input, regex, smart, caseInsen ) {
		var ctx = this.context;
	
		if ( input === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].oPreviousSearch.sSearch :
				undefined;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( ! settings.oFeatures.bFilter ) {
				return;
			}
	
			_fnFilterComplete( settings, $.extend( {}, settings.oPreviousSearch, {
				"sSearch": input+"",
				"bRegex":  regex === null ? false : regex,
				"bSmart":  smart === null ? true  : smart,
				"bCaseInsensitive": caseInsen === null ? true : caseInsen
			} ), 1 );
		} );
	} );
	
	
	_api_registerPlural(
		'columns().search()',
		'column().search()',
		function ( input, regex, smart, caseInsen ) {
			return this.iterator( 'column', function ( settings, column ) {
				var preSearch = settings.aoPreSearchCols;
	
				if ( input === undefined ) {
					// get
					return preSearch[ column ].sSearch;
				}
	
				// set
				if ( ! settings.oFeatures.bFilter ) {
					return;
				}
	
				$.extend( preSearch[ column ], {
					"sSearch": input+"",
					"bRegex":  regex === null ? false : regex,
					"bSmart":  smart === null ? true  : smart,
					"bCaseInsensitive": caseInsen === null ? true : caseInsen
				} );
	
				_fnFilterComplete( settings, settings.oPreviousSearch, 1 );
			} );
		}
	);
	
	/*
	 * State API methods
	 */
	
	_api_register( 'state()', function () {
		return this.context.length ?
			this.context[0].oSavedState :
			null;
	} );
	
	
	_api_register( 'state.clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			// Save an empty object
			settings.fnStateSaveCallback.call( settings.oInstance, settings, {} );
		} );
	} );
	
	
	_api_register( 'state.loaded()', function () {
		return this.context.length ?
			this.context[0].oLoadedState :
			null;
	} );
	
	
	_api_register( 'state.save()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnSaveState( settings );
		} );
	} );
	
	
	
	/**
	 * Provide a common method for plug-ins to check the version of DataTables being
	 * used, in order to ensure compatibility.
	 *
	 *  @param {string} version Version string to check for, in the format "X.Y.Z".
	 *    Note that the formats "X" and "X.Y" are also acceptable.
	 *  @returns {boolean} true if this version of DataTables is greater or equal to
	 *    the required version, or false if this version of DataTales is not
	 *    suitable
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    alert( $.fn.dataTable.versionCheck( '1.9.0' ) );
	 */
	DataTable.versionCheck = DataTable.fnVersionCheck = function( version )
	{
		var aThis = DataTable.version.split('.');
		var aThat = version.split('.');
		var iThis, iThat;
	
		for ( var i=0, iLen=aThat.length ; i<iLen ; i++ ) {
			iThis = parseInt( aThis[i], 10 ) || 0;
			iThat = parseInt( aThat[i], 10 ) || 0;
	
			// Parts are the same, keep comparing
			if (iThis === iThat) {
				continue;
			}
	
			// Parts are different, return immediately
			return iThis > iThat;
		}
	
		return true;
	};
	
	
	/**
	 * Check if a `<table>` node is a DataTable table already or not.
	 *
	 *  @param {node|jquery|string} table Table node, jQuery object or jQuery
	 *      selector for the table to test. Note that if more than more than one
	 *      table is passed on, only the first will be checked
	 *  @returns {boolean} true the table given is a DataTable, or false otherwise
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    if ( ! $.fn.DataTable.isDataTable( '#example' ) ) {
	 *      $('#example').dataTable();
	 *    }
	 */
	DataTable.isDataTable = DataTable.fnIsDataTable = function ( table )
	{
		var t = $(table).get(0);
		var is = false;
	
		if ( table instanceof DataTable.Api ) {
			return true;
		}
	
		$.each( DataTable.settings, function (i, o) {
			var head = o.nScrollHead ? $('table', o.nScrollHead)[0] : null;
			var foot = o.nScrollFoot ? $('table', o.nScrollFoot)[0] : null;
	
			if ( o.nTable === t || head === t || foot === t ) {
				is = true;
			}
		} );
	
		return is;
	};
	
	
	/**
	 * Get all DataTable tables that have been initialised - optionally you can
	 * select to get only currently visible tables.
	 *
	 *  @param {boolean} [visible=false] Flag to indicate if you want all (default)
	 *    or visible tables only.
	 *  @returns {array} Array of `table` nodes (not DataTable instances) which are
	 *    DataTables
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    $.each( $.fn.dataTable.tables(true), function () {
	 *      $(table).DataTable().columns.adjust();
	 *    } );
	 */
	DataTable.tables = DataTable.fnTables = function ( visible )
	{
		var api = false;
	
		if ( $.isPlainObject( visible ) ) {
			api = visible.api;
			visible = visible.visible;
		}
	
		var a = $.map( DataTable.settings, function (o) {
			if ( !visible || (visible && $(o.nTable).is(':visible')) ) {
				return o.nTable;
			}
		} );
	
		return api ?
			new _Api( a ) :
			a;
	};
	
	
	/**
	 * Convert from camel case parameters to Hungarian notation. This is made public
	 * for the extensions to provide the same ability as DataTables core to accept
	 * either the 1.9 style Hungarian notation, or the 1.10+ style camelCase
	 * parameters.
	 *
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 */
	DataTable.camelToHungarian = _fnCamelToHungarian;
	
	
	
	/**
	 *
	 */
	_api_register( '$()', function ( selector, opts ) {
		var
			rows   = this.rows( opts ).nodes(), // Get all rows
			jqRows = $(rows);
	
		return $( [].concat(
			jqRows.filter( selector ).toArray(),
			jqRows.find( selector ).toArray()
		) );
	} );
	
	
	// jQuery functions to operate on the tables
	$.each( [ 'on', 'one', 'off' ], function (i, key) {
		_api_register( key+'()', function ( /* event, handler */ ) {
			var args = Array.prototype.slice.call(arguments);
	
			// Add the `dt` namespace automatically if it isn't already present
			args[0] = $.map( args[0].split( /\s/ ), function ( e ) {
				return ! e.match(/\.dt\b/) ?
					e+'.dt' :
					e;
				} ).join( ' ' );
	
			var inst = $( this.tables().nodes() );
			inst[key].apply( inst, args );
			return this;
		} );
	} );
	
	
	_api_register( 'clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnClearTable( settings );
		} );
	} );
	
	
	_api_register( 'settings()', function () {
		return new _Api( this.context, this.context );
	} );
	
	
	_api_register( 'init()', function () {
		var ctx = this.context;
		return ctx.length ? ctx[0].oInit : null;
	} );
	
	
	_api_register( 'data()', function () {
		return this.iterator( 'table', function ( settings ) {
			return _pluck( settings.aoData, '_aData' );
		} ).flatten();
	} );
	
	
	_api_register( 'destroy()', function ( remove ) {
		remove = remove || false;
	
		return this.iterator( 'table', function ( settings ) {
			var orig      = settings.nTableWrapper.parentNode;
			var classes   = settings.oClasses;
			var table     = settings.nTable;
			var tbody     = settings.nTBody;
			var thead     = settings.nTHead;
			var tfoot     = settings.nTFoot;
			var jqTable   = $(table);
			var jqTbody   = $(tbody);
			var jqWrapper = $(settings.nTableWrapper);
			var rows      = $.map( settings.aoData, function (r) { return r.nTr; } );
			var i, ien;
	
			// Flag to note that the table is currently being destroyed - no action
			// should be taken
			settings.bDestroying = true;
	
			// Fire off the destroy callbacks for plug-ins etc
			_fnCallbackFire( settings, "aoDestroyCallback", "destroy", [settings] );
	
			// If not being removed from the document, make all columns visible
			if ( ! remove ) {
				new _Api( settings ).columns().visible( true );
			}
	
			// Blitz all `DT` namespaced events (these are internal events, the
			// lowercase, `dt` events are user subscribed and they are responsible
			// for removing them
			jqWrapper.off('.DT').find(':not(tbody *)').off('.DT');
			$(window).off('.DT-'+settings.sInstance);
	
			// When scrolling we had to break the table up - restore it
			if ( table != thead.parentNode ) {
				jqTable.children('thead').detach();
				jqTable.append( thead );
			}
	
			if ( tfoot && table != tfoot.parentNode ) {
				jqTable.children('tfoot').detach();
				jqTable.append( tfoot );
			}
	
			settings.aaSorting = [];
			settings.aaSortingFixed = [];
			_fnSortingClasses( settings );
	
			$( rows ).removeClass( settings.asStripeClasses.join(' ') );
	
			$('th, td', thead).removeClass( classes.sSortable+' '+
				classes.sSortableAsc+' '+classes.sSortableDesc+' '+classes.sSortableNone
			);
	
			// Add the TR elements back into the table in their original order
			jqTbody.children().detach();
			jqTbody.append( rows );
	
			// Remove the DataTables generated nodes, events and classes
			var removedMethod = remove ? 'remove' : 'detach';
			jqTable[ removedMethod ]();
			jqWrapper[ removedMethod ]();
	
			// If we need to reattach the table to the document
			if ( ! remove && orig ) {
				// insertBefore acts like appendChild if !arg[1]
				orig.insertBefore( table, settings.nTableReinsertBefore );
	
				// Restore the width of the original table - was read from the style property,
				// so we can restore directly to that
				jqTable
					.css( 'width', settings.sDestroyWidth )
					.removeClass( classes.sTable );
	
				// If the were originally stripe classes - then we add them back here.
				// Note this is not fool proof (for example if not all rows had stripe
				// classes - but it's a good effort without getting carried away
				ien = settings.asDestroyStripes.length;
	
				if ( ien ) {
					jqTbody.children().each( function (i) {
						$(this).addClass( settings.asDestroyStripes[i % ien] );
					} );
				}
			}
	
			/* Remove the settings object from the settings array */
			var idx = $.inArray( settings, DataTable.settings );
			if ( idx !== -1 ) {
				DataTable.settings.splice( idx, 1 );
			}
		} );
	} );
	
	
	// Add the `every()` method for rows, columns and cells in a compact form
	$.each( [ 'column', 'row', 'cell' ], function ( i, type ) {
		_api_register( type+'s().every()', function ( fn ) {
			var opts = this.selector.opts;
			var api = this;
	
			return this.iterator( type, function ( settings, arg1, arg2, arg3, arg4 ) {
				// Rows and columns:
				//  arg1 - index
				//  arg2 - table counter
				//  arg3 - loop counter
				//  arg4 - undefined
				// Cells:
				//  arg1 - row index
				//  arg2 - column index
				//  arg3 - table counter
				//  arg4 - loop counter
				fn.call(
					api[ type ](
						arg1,
						type==='cell' ? arg2 : opts,
						type==='cell' ? opts : undefined
					),
					arg1, arg2, arg3, arg4
				);
			} );
		} );
	} );
	
	
	// i18n method for extensions to be able to use the language object from the
	// DataTable
	_api_register( 'i18n()', function ( token, def, plural ) {
		var ctx = this.context[0];
		var resolved = _fnGetObjectDataFn( token )( ctx.oLanguage );
	
		if ( resolved === undefined ) {
			resolved = def;
		}
	
		if ( plural !== undefined && $.isPlainObject( resolved ) ) {
			resolved = resolved[ plural ] !== undefined ?
				resolved[ plural ] :
				resolved._;
		}
	
		return resolved.replace( '%d', plural ); // nb: plural might be undefined,
	} );
	/**
	 * Version string for plug-ins to check compatibility. Allowed format is
	 * `a.b.c-d` where: a:int, b:int, c:int, d:string(dev|beta|alpha). `d` is used
	 * only for non-release builds. See http://semver.org/ for more information.
	 *  @member
	 *  @type string
	 *  @default Version number
	 */
	DataTable.version = "1.10.23";

	/**
	 * Private data store, containing all of the settings objects that are
	 * created for the tables on a given page.
	 *
	 * Note that the `DataTable.settings` object is aliased to
	 * `jQuery.fn.dataTableExt` through which it may be accessed and
	 * manipulated, or `jQuery.fn.dataTable.settings`.
	 *  @member
	 *  @type array
	 *  @default []
	 *  @private
	 */
	DataTable.settings = [];

	/**
	 * Object models container, for the various models that DataTables has
	 * available to it. These models define the objects that are used to hold
	 * the active state and configuration of the table.
	 *  @namespace
	 */
	DataTable.models = {};
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * search information for the global filter and individual column filters.
	 *  @namespace
	 */
	DataTable.models.oSearch = {
		/**
		 * Flag to indicate if the filtering should be case insensitive or not
		 *  @type boolean
		 *  @default true
		 */
		"bCaseInsensitive": true,
	
		/**
		 * Applied search term
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sSearch": "",
	
		/**
		 * Flag to indicate if the search term should be interpreted as a
		 * regular expression (true) or not (false) and therefore and special
		 * regex characters escaped.
		 *  @type boolean
		 *  @default false
		 */
		"bRegex": false,
	
		/**
		 * Flag to indicate if DataTables is to use its smart filtering or not.
		 *  @type boolean
		 *  @default true
		 */
		"bSmart": true
	};
	
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * each individual row. This is the object format used for the settings
	 * aoData array.
	 *  @namespace
	 */
	DataTable.models.oRow = {
		/**
		 * TR element for the row
		 *  @type node
		 *  @default null
		 */
		"nTr": null,
	
		/**
		 * Array of TD elements for each row. This is null until the row has been
		 * created.
		 *  @type array nodes
		 *  @default []
		 */
		"anCells": null,
	
		/**
		 * Data object from the original data source for the row. This is either
		 * an array if using the traditional form of DataTables, or an object if
		 * using mData options. The exact type will depend on the passed in
		 * data from the data source, or will be an array if using DOM a data
		 * source.
		 *  @type array|object
		 *  @default []
		 */
		"_aData": [],
	
		/**
		 * Sorting data cache - this array is ostensibly the same length as the
		 * number of columns (although each index is generated only as it is
		 * needed), and holds the data that is used for sorting each column in the
		 * row. We do this cache generation at the start of the sort in order that
		 * the formatting of the sort data need be done only once for each cell
		 * per sort. This array should not be read from or written to by anything
		 * other than the master sorting methods.
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aSortData": null,
	
		/**
		 * Per cell filtering data cache. As per the sort data cache, used to
		 * increase the performance of the filtering in DataTables
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aFilterData": null,
	
		/**
		 * Filtering data cache. This is the same as the cell filtering cache, but
		 * in this case a string rather than an array. This is easily computed with
		 * a join on `_aFilterData`, but is provided as a cache so the join isn't
		 * needed on every search (memory traded for performance)
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_sFilterRow": null,
	
		/**
		 * Cache of the class name that DataTables has applied to the row, so we
		 * can quickly look at this variable rather than needing to do a DOM check
		 * on className for the nTr property.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *  @private
		 */
		"_sRowStripe": "",
	
		/**
		 * Denote if the original data source was from the DOM, or the data source
		 * object. This is used for invalidating data, so DataTables can
		 * automatically read data from the original source, unless uninstructed
		 * otherwise.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"src": null,
	
		/**
		 * Index in the aoData array. This saves an indexOf lookup when we have the
		 * object, but want to know the index
		 *  @type integer
		 *  @default -1
		 *  @private
		 */
		"idx": -1
	};
	
	
	/**
	 * Template object for the column information object in DataTables. This object
	 * is held in the settings aoColumns array and contains all the information that
	 * DataTables needs about each individual column.
	 *
	 * Note that this object is related to {@link DataTable.defaults.column}
	 * but this one is the internal data store for DataTables's cache of columns.
	 * It should NOT be manipulated outside of DataTables. Any configuration should
	 * be done through the initialisation options.
	 *  @namespace
	 */
	DataTable.models.oColumn = {
		/**
		 * Column index. This could be worked out on-the-fly with $.inArray, but it
		 * is faster to just hold it as a variable
		 *  @type integer
		 *  @default null
		 */
		"idx": null,
	
		/**
		 * A list of the columns that sorting should occur on when this column
		 * is sorted. That this property is an array allows multi-column sorting
		 * to be defined for a column (for example first name / last name columns
		 * would benefit from this). The values are integers pointing to the
		 * columns to be sorted on (typically it will be a single integer pointing
		 * at itself, but that doesn't need to be the case).
		 *  @type array
		 */
		"aDataSort": null,
	
		/**
		 * Define the sorting directions that are applied to the column, in sequence
		 * as the column is repeatedly sorted upon - i.e. the first value is used
		 * as the sorting direction when the column if first sorted (clicked on).
		 * Sort it again (click again) and it will move on to the next index.
		 * Repeat until loop.
		 *  @type array
		 */
		"asSorting": null,
	
		/**
		 * Flag to indicate if the column is searchable, and thus should be included
		 * in the filtering or not.
		 *  @type boolean
		 */
		"bSearchable": null,
	
		/**
		 * Flag to indicate if the column is sortable or not.
		 *  @type boolean
		 */
		"bSortable": null,
	
		/**
		 * Flag to indicate if the column is currently visible in the table or not
		 *  @type boolean
		 */
		"bVisible": null,
	
		/**
		 * Store for manual type assignment using the `column.type` option. This
		 * is held in store so we can manipulate the column's `sType` property.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"_sManualType": null,
	
		/**
		 * Flag to indicate if HTML5 data attributes should be used as the data
		 * source for filtering or sorting. True is either are.
		 *  @type boolean
		 *  @default false
		 *  @private
		 */
		"_bAttrSrc": false,
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} nTd The TD node that has been created
		 *  @param {*} sData The Data for the cell
		 *  @param {array|object} oData The data for the whole row
		 *  @param {int} iRow The row index for the aoData data store
		 *  @default null
		 */
		"fnCreatedCell": null,
	
		/**
		 * Function to get data from a cell in a column. You should <b>never</b>
		 * access data directly through _aData internally in DataTables - always use
		 * the method attached to this property. It allows mData to function as
		 * required. This function is automatically assigned by the column
		 * initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {string} sSpecific The specific data type you want to get -
		 *    'display', 'type' 'filter' 'sort'
		 *  @returns {*} The data for the cell from the given row's data
		 *  @default null
		 */
		"fnGetData": null,
	
		/**
		 * Function to set data for a cell in the column. You should <b>never</b>
		 * set the data directly to _aData internally in DataTables - always use
		 * this method. It allows mData to function as required. This function
		 * is automatically assigned by the column initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {*} sValue Value to set
		 *  @default null
		 */
		"fnSetData": null,
	
		/**
		 * Property to read the value for the cells in the column from the data
		 * source array / object. If null, then the default content is used, if a
		 * function is given then the return from the function is used.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mData": null,
	
		/**
		 * Partner property to mData which is used (only when defined) to get
		 * the data - i.e. it is basically the same as mData, but without the
		 * 'set' option, and also the data fed to it is the result from mData.
		 * This is the rendering method to match the data method of mData.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mRender": null,
	
		/**
		 * Unique header TH/TD element for this column - this is what the sorting
		 * listener is attached to (if sorting is enabled.)
		 *  @type node
		 *  @default null
		 */
		"nTh": null,
	
		/**
		 * Unique footer TH/TD element for this column (if there is one). Not used
		 * in DataTables as such, but can be used for plug-ins to reference the
		 * footer for each column.
		 *  @type node
		 *  @default null
		 */
		"nTf": null,
	
		/**
		 * The class to apply to all TD elements in the table's TBODY for the column
		 *  @type string
		 *  @default null
		 */
		"sClass": null,
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 *  @type string
		 */
		"sContentPadding": null,
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because mData
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 */
		"sDefaultContent": null,
	
		/**
		 * Name for the column, allowing reference to the column by name as well as
		 * by index (needs a lookup to work by name).
		 *  @type string
		 */
		"sName": null,
	
		/**
		 * Custom sorting data type - defines which of the available plug-ins in
		 * afnSortData the custom sorting will use - if any is defined.
		 *  @type string
		 *  @default std
		 */
		"sSortDataType": 'std',
	
		/**
		 * Class to be applied to the header element when sorting on this column
		 *  @type string
		 *  @default null
		 */
		"sSortingClass": null,
	
		/**
		 * Class to be applied to the header element when sorting on this column -
		 * when jQuery UI theming is used.
		 *  @type string
		 *  @default null
		 */
		"sSortingClassJUI": null,
	
		/**
		 * Title of the column - what is seen in the TH element (nTh).
		 *  @type string
		 */
		"sTitle": null,
	
		/**
		 * Column sorting and filtering type
		 *  @type string
		 *  @default null
		 */
		"sType": null,
	
		/**
		 * Width of the column
		 *  @type string
		 *  @default null
		 */
		"sWidth": null,
	
		/**
		 * Width of the column when it was first "encountered"
		 *  @type string
		 *  @default null
		 */
		"sWidthOrig": null
	};
	
	
	/*
	 * Developer note: The properties of the object below are given in Hungarian
	 * notation, that was used as the interface for DataTables prior to v1.10, however
	 * from v1.10 onwards the primary interface is camel case. In order to avoid
	 * breaking backwards compatibility utterly with this change, the Hungarian
	 * version is still, internally the primary interface, but is is not documented
	 * - hence the @name tags in each doc comment. This allows a Javascript function
	 * to create a map from Hungarian notation to camel case (going the other direction
	 * would require each property to be listed, which would add around 3K to the size
	 * of DataTables, while this method is about a 0.5K hit).
	 *
	 * Ultimately this does pave the way for Hungarian notation to be dropped
	 * completely, but that is a massive amount of work and will break current
	 * installs (therefore is on-hold until v2).
	 */
	
	/**
	 * Initialisation options that can be given to DataTables at initialisation
	 * time.
	 *  @namespace
	 */
	DataTable.defaults = {
		/**
		 * An array of data to use for the table, passed in at initialisation which
		 * will be used in preference to any data which is already in the DOM. This is
		 * particularly useful for constructing tables purely in Javascript, for
		 * example with a custom Ajax call.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.data
		 *
		 *  @example
		 *    // Using a 2D array data source
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          ['Trident', 'Internet Explorer 4.0', 'Win 95+', 4, 'X'],
		 *          ['Trident', 'Internet Explorer 5.0', 'Win 95+', 5, 'C'],
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine" },
		 *          { "title": "Browser" },
		 *          { "title": "Platform" },
		 *          { "title": "Version" },
		 *          { "title": "Grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using an array of objects as a data source (`data`)
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 4.0",
		 *            "platform": "Win 95+",
		 *            "version":  4,
		 *            "grade":    "X"
		 *          },
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 5.0",
		 *            "platform": "Win 95+",
		 *            "version":  5,
		 *            "grade":    "C"
		 *          }
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine",   "data": "engine" },
		 *          { "title": "Browser",  "data": "browser" },
		 *          { "title": "Platform", "data": "platform" },
		 *          { "title": "Version",  "data": "version" },
		 *          { "title": "Grade",    "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"aaData": null,
	
	
		/**
		 * If ordering is enabled, then DataTables will perform a first pass sort on
		 * initialisation. You can define which column(s) the sort is performed
		 * upon, and the sorting direction, with this variable. The `sorting` array
		 * should contain an array for each column to be sorted initially containing
		 * the column's index and a direction string ('asc' or 'desc').
		 *  @type array
		 *  @default [[0,'asc']]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.order
		 *
		 *  @example
		 *    // Sort by 3rd column first, and then 4th column
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": [[2,'asc'], [3,'desc']]
		 *      } );
		 *    } );
		 *
		 *    // No initial sorting
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": []
		 *      } );
		 *    } );
		 */
		"aaSorting": [[0,'asc']],
	
	
		/**
		 * This parameter is basically identical to the `sorting` parameter, but
		 * cannot be overridden by user interaction with the table. What this means
		 * is that you could have a column (visible or hidden) which the sorting
		 * will always be forced on first - any sorting after that (from the user)
		 * will then be performed as required. This can be useful for grouping rows
		 * together.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.orderFixed
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderFixed": [[0,'asc']]
		 *      } );
		 *    } )
		 */
		"aaSortingFixed": [],
	
	
		/**
		 * DataTables can be instructed to load data to display in the table from a
		 * Ajax source. This option defines how that Ajax call is made and where to.
		 *
		 * The `ajax` property has three different modes of operation, depending on
		 * how it is defined. These are:
		 *
		 * * `string` - Set the URL from where the data should be loaded from.
		 * * `object` - Define properties for `jQuery.ajax`.
		 * * `function` - Custom data get function
		 *
		 * `string`
		 * --------
		 *
		 * As a string, the `ajax` property simply defines the URL from which
		 * DataTables will load data.
		 *
		 * `object`
		 * --------
		 *
		 * As an object, the parameters in the object are passed to
		 * [jQuery.ajax](http://api.jquery.com/jQuery.ajax/) allowing fine control
		 * of the Ajax request. DataTables has a number of default parameters which
		 * you can override using this option. Please refer to the jQuery
		 * documentation for a full description of the options available, although
		 * the following parameters provide additional options in DataTables or
		 * require special consideration:
		 *
		 * * `data` - As with jQuery, `data` can be provided as an object, but it
		 *   can also be used as a function to manipulate the data DataTables sends
		 *   to the server. The function takes a single parameter, an object of
		 *   parameters with the values that DataTables has readied for sending. An
		 *   object may be returned which will be merged into the DataTables
		 *   defaults, or you can add the items to the object that was passed in and
		 *   not return anything from the function. This supersedes `fnServerParams`
		 *   from DataTables 1.9-.
		 *
		 * * `dataSrc` - By default DataTables will look for the property `data` (or
		 *   `aaData` for compatibility with DataTables 1.9-) when obtaining data
		 *   from an Ajax source or for server-side processing - this parameter
		 *   allows that property to be changed. You can use Javascript dotted
		 *   object notation to get a data source for multiple levels of nesting, or
		 *   it my be used as a function. As a function it takes a single parameter,
		 *   the JSON returned from the server, which can be manipulated as
		 *   required, with the returned value being that used by DataTables as the
		 *   data source for the table. This supersedes `sAjaxDataProp` from
		 *   DataTables 1.9-.
		 *
		 * * `success` - Should not be overridden it is used internally in
		 *   DataTables. To manipulate / transform the data returned by the server
		 *   use `ajax.dataSrc`, or use `ajax` as a function (see below).
		 *
		 * `function`
		 * ----------
		 *
		 * As a function, making the Ajax call is left up to yourself allowing
		 * complete control of the Ajax request. Indeed, if desired, a method other
		 * than Ajax could be used to obtain the required data, such as Web storage
		 * or an AIR database.
		 *
		 * The function is given four parameters and no return is required. The
		 * parameters are:
		 *
		 * 1. _object_ - Data to send to the server
		 * 2. _function_ - Callback function that must be executed when the required
		 *    data has been obtained. That data should be passed into the callback
		 *    as the only parameter
		 * 3. _object_ - DataTables settings object for the table
		 *
		 * Note that this supersedes `fnServerData` from DataTables 1.9-.
		 *
		 *  @type string|object|function
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.ajax
		 *  @since 1.10.0
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax.
		 *   // Note DataTables expects data in the form `{ data: [ ...data... ] }` by default).
		 *   $('#example').dataTable( {
		 *     "ajax": "data.json"
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to change
		 *   // `data` to `tableData` (i.e. `{ tableData: [ ...data... ] }`)
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": "tableData"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to read data
		 *   // from a plain array rather than an array in an object
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": ""
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Manipulate the data returned from the server - add a link to data
		 *   // (note this can, should, be done using `render` for the column - this
		 *   // is just a simple example of how the data can be manipulated).
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": function ( json ) {
		 *         for ( var i=0, ien=json.length ; i<ien ; i++ ) {
		 *           json[i][0] = '<a href="/message/'+json[i][0]+'>View message</a>';
		 *         }
		 *         return json;
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Add data to the request
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "data": function ( d ) {
		 *         return {
		 *           "extra_search": $('#extra').val()
		 *         };
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Send request as POST
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "type": "POST"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get the data from localStorage (could interface with a form for
		 *   // adding, editing and removing rows).
		 *   $('#example').dataTable( {
		 *     "ajax": function (data, callback, settings) {
		 *       callback(
		 *         JSON.parse( localStorage.getItem('dataTablesData') )
		 *       );
		 *     }
		 *   } );
		 */
		"ajax": null,
	
	
		/**
		 * This parameter allows you to readily specify the entries in the length drop
		 * down menu that DataTables shows when pagination is enabled. It can be
		 * either a 1D array of options which will be used for both the displayed
		 * option and the value, or a 2D array which will use the array in the first
		 * position as the value, and the array in the second position as the
		 * displayed options (useful for language strings such as 'All').
		 *
		 * Note that the `pageLength` property will be automatically set to the
		 * first value given in this array, unless `pageLength` is also provided.
		 *  @type array
		 *  @default [ 10, 25, 50, 100 ]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.lengthMenu
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
		 *      } );
		 *    } );
		 */
		"aLengthMenu": [ 10, 25, 50, 100 ],
	
	
		/**
		 * The `columns` option in the initialisation parameter allows you to define
		 * details about the way individual columns behave. For a full list of
		 * column options that can be set, please see
		 * {@link DataTable.defaults.column}. Note that if you use `columns` to
		 * define your columns, you must have an entry in the array for every single
		 * column that you have in your table (these can be null if you don't which
		 * to specify any options).
		 *  @member
		 *
		 *  @name DataTable.defaults.column
		 */
		"aoColumns": null,
	
		/**
		 * Very similar to `columns`, `columnDefs` allows you to target a specific
		 * column, multiple columns, or all columns, using the `targets` property of
		 * each object in the array. This allows great flexibility when creating
		 * tables, as the `columnDefs` arrays can be of any length, targeting the
		 * columns you specifically want. `columnDefs` may use any of the column
		 * options available: {@link DataTable.defaults.column}, but it _must_
		 * have `targets` defined in each object in the array. Values in the `targets`
		 * array may be:
		 *   <ul>
		 *     <li>a string - class name will be matched on the TH for the column</li>
		 *     <li>0 or a positive integer - column index counting from the left</li>
		 *     <li>a negative integer - column index counting from the right</li>
		 *     <li>the string "_all" - all columns (i.e. assign a default)</li>
		 *   </ul>
		 *  @member
		 *
		 *  @name DataTable.defaults.columnDefs
		 */
		"aoColumnDefs": null,
	
	
		/**
		 * Basically the same as `search`, this parameter defines the individual column
		 * filtering state at initialisation time. The array must be of the same size
		 * as the number of columns, and each element be an object with the parameters
		 * `search` and `escapeRegex` (the latter is optional). 'null' is also
		 * accepted and the default will be used.
		 *  @type array
		 *  @default []
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.searchCols
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchCols": [
		 *          null,
		 *          { "search": "My filter" },
		 *          null,
		 *          { "search": "^[0-9]", "escapeRegex": false }
		 *        ]
		 *      } );
		 *    } )
		 */
		"aoSearchCols": [],
	
	
		/**
		 * An array of CSS classes that should be applied to displayed rows. This
		 * array may be of any length, and DataTables will apply each class
		 * sequentially, looping when required.
		 *  @type array
		 *  @default null <i>Will take the values determined by the `oClasses.stripe*`
		 *    options</i>
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.stripeClasses
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stripeClasses": [ 'strip1', 'strip2', 'strip3' ]
		 *      } );
		 *    } )
		 */
		"asStripeClasses": null,
	
	
		/**
		 * Enable or disable automatic column width calculation. This can be disabled
		 * as an optimisation (it takes some time to calculate the widths) if the
		 * tables widths are passed in using `columns`.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.autoWidth
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "autoWidth": false
		 *      } );
		 *    } );
		 */
		"bAutoWidth": true,
	
	
		/**
		 * Deferred rendering can provide DataTables with a huge speed boost when you
		 * are using an Ajax or JS data source for the table. This option, when set to
		 * true, will cause DataTables to defer the creation of the table elements for
		 * each row until they are needed for a draw - saving a significant amount of
		 * time.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.deferRender
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajax": "sources/arrays.txt",
		 *        "deferRender": true
		 *      } );
		 *    } );
		 */
		"bDeferRender": false,
	
	
		/**
		 * Replace a DataTable which matches the given selector and replace it with
		 * one which has the properties of the new initialisation object passed. If no
		 * table matches the selector, then the new DataTable will be constructed as
		 * per normal.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.destroy
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "srollY": "200px",
		 *        "paginate": false
		 *      } );
		 *
		 *      // Some time later....
		 *      $('#example').dataTable( {
		 *        "filter": false,
		 *        "destroy": true
		 *      } );
		 *    } );
		 */
		"bDestroy": false,
	
	
		/**
		 * Enable or disable filtering of data. Filtering in DataTables is "smart" in
		 * that it allows the end user to input multiple words (space separated) and
		 * will match a row containing those words, even if not in the order that was
		 * specified (this allow matching across multiple columns). Note that if you
		 * wish to use filtering in DataTables this must remain 'true' - to remove the
		 * default filtering input box and retain filtering abilities, please use
		 * {@link DataTable.defaults.dom}.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.searching
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "searching": false
		 *      } );
		 *    } );
		 */
		"bFilter": true,
	
	
		/**
		 * Enable or disable the table information display. This shows information
		 * about the data that is currently visible on the page, including information
		 * about filtered data if that action is being performed.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.info
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "info": false
		 *      } );
		 *    } );
		 */
		"bInfo": true,
	
	
		/**
		 * Allows the end user to select the size of a formatted page from a select
		 * menu (sizes are 10, 25, 50 and 100). Requires pagination (`paginate`).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.lengthChange
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "lengthChange": false
		 *      } );
		 *    } );
		 */
		"bLengthChange": true,
	
	
		/**
		 * Enable or disable pagination.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.paging
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "paging": false
		 *      } );
		 *    } );
		 */
		"bPaginate": true,
	
	
		/**
		 * Enable or disable the display of a 'processing' indicator when the table is
		 * being processed (e.g. a sort). This is particularly useful for tables with
		 * large amounts of data where it can take a noticeable amount of time to sort
		 * the entries.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.processing
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "processing": true
		 *      } );
		 *    } );
		 */
		"bProcessing": false,
	
	
		/**
		 * Retrieve the DataTables object for the given selector. Note that if the
		 * table has already been initialised, this parameter will cause DataTables
		 * to simply return the object that has already been set up - it will not take
		 * account of any changes you might have made to the initialisation object
		 * passed to DataTables (setting this parameter to true is an acknowledgement
		 * that you understand this). `destroy` can be used to reinitialise a table if
		 * you need.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.retrieve
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      initTable();
		 *      tableActions();
		 *    } );
		 *
		 *    function initTable ()
		 *    {
		 *      return $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false,
		 *        "retrieve": true
		 *      } );
		 *    }
		 *
		 *    function tableActions ()
		 *    {
		 *      var table = initTable();
		 *      // perform API operations with oTable
		 *    }
		 */
		"bRetrieve": false,
	
	
		/**
		 * When vertical (y) scrolling is enabled, DataTables will force the height of
		 * the table's viewport to the given height at all times (useful for layout).
		 * However, this can look odd when filtering data down to a small data set,
		 * and the footer is left "floating" further down. This parameter (when
		 * enabled) will cause DataTables to collapse the table's viewport down when
		 * the result set will fit within the given Y height.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollCollapse
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200",
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"bScrollCollapse": false,
	
	
		/**
		 * Configure DataTables to use server-side processing. Note that the
		 * `ajax` parameter must also be given in order to give DataTables a
		 * source to obtain the required data for each draw.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverSide
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "xhr.php"
		 *      } );
		 *    } );
		 */
		"bServerSide": false,
	
	
		/**
		 * Enable or disable sorting of columns. Sorting of individual columns can be
		 * disabled by the `sortable` option for each column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.ordering
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "ordering": false
		 *      } );
		 *    } );
		 */
		"bSort": true,
	
	
		/**
		 * Enable or display DataTables' ability to sort multiple columns at the
		 * same time (activated by shift-click by the user).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderMulti
		 *
		 *  @example
		 *    // Disable multiple column sorting ability
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderMulti": false
		 *      } );
		 *    } );
		 */
		"bSortMulti": true,
	
	
		/**
		 * Allows control over whether DataTables should use the top (true) unique
		 * cell that is found for a single column, or the bottom (false - default).
		 * This is useful when using complex headers.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderCellsTop
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderCellsTop": true
		 *      } );
		 *    } );
		 */
		"bSortCellsTop": false,
	
	
		/**
		 * Enable or disable the addition of the classes `sorting\_1`, `sorting\_2` and
		 * `sorting\_3` to the columns which are currently being sorted on. This is
		 * presented as a feature switch as it can increase processing time (while
		 * classes are removed and added) so for large data sets you might want to
		 * turn this off.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.orderClasses
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderClasses": false
		 *      } );
		 *    } );
		 */
		"bSortClasses": true,
	
	
		/**
		 * Enable or disable state saving. When enabled HTML5 `localStorage` will be
		 * used to save table display information such as pagination information,
		 * display length, filtering and sorting. As such when the end user reloads
		 * the page the display display will match what thy had previously set up.
		 *
		 * Due to the use of `localStorage` the default state saving is not supported
		 * in IE6 or 7. If state saving is required in those browsers, use
		 * `stateSaveCallback` to provide a storage solution such as cookies.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.stateSave
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "stateSave": true
		 *      } );
		 *    } );
		 */
		"bStateSave": false,
	
	
		/**
		 * This function is called when a TR element is created (and all TD child
		 * elements have been inserted), or registered if using a DOM source, allowing
		 * manipulation of the TR element (adding classes etc).
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} dataIndex The index of this row in the internal aoData array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.createdRow
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "createdRow": function( row, data, dataIndex ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" )
		 *          {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnCreatedRow": null,
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify any aspect you want about the created DOM.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.drawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "drawCallback": function( settings ) {
		 *          alert( 'DataTables has redrawn the table' );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnDrawCallback": null,
	
	
		/**
		 * Identical to fnHeaderCallback() but for the table footer this function
		 * allows you to modify the table footer on every 'draw' event.
		 *  @type function
		 *  @param {node} foot "TR" element for the footer
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.footerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "footerCallback": function( tfoot, data, start, end, display ) {
		 *          tfoot.getElementsByTagName('th')[0].innerHTML = "Starting index is "+start;
		 *        }
		 *      } );
		 *    } )
		 */
		"fnFooterCallback": null,
	
	
		/**
		 * When rendering large numbers in the information element for the table
		 * (i.e. "Showing 1 to 10 of 57 entries") DataTables will render large numbers
		 * to have a comma separator for the 'thousands' units (e.g. 1 million is
		 * rendered as "1,000,000") to help readability for the end user. This
		 * function will override the default method DataTables uses.
		 *  @type function
		 *  @member
		 *  @param {int} toFormat number to be formatted
		 *  @returns {string} formatted string for DataTables to show the number
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.formatNumber
		 *
		 *  @example
		 *    // Format a number using a single quote for the separator (note that
		 *    // this can also be done with the language.thousands option)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "formatNumber": function ( toFormat ) {
		 *          return toFormat.toString().replace(
		 *            /\B(?=(\d{3})+(?!\d))/g, "'"
		 *          );
		 *        };
		 *      } );
		 *    } );
		 */
		"fnFormatNumber": function ( toFormat ) {
			return toFormat.toString().replace(
				/\B(?=(\d{3})+(?!\d))/g,
				this.oLanguage.sThousands
			);
		},
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify the header row. This can be used to calculate and
		 * display useful information about the table.
		 *  @type function
		 *  @param {node} head "TR" element for the header
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.headerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "fheaderCallback": function( head, data, start, end, display ) {
		 *          head.getElementsByTagName('th')[0].innerHTML = "Displaying "+(end-start)+" records";
		 *        }
		 *      } );
		 *    } )
		 */
		"fnHeaderCallback": null,
	
	
		/**
		 * The information element can be used to convey information about the current
		 * state of the table. Although the internationalisation options presented by
		 * DataTables are quite capable of dealing with most customisations, there may
		 * be times where you wish to customise the string further. This callback
		 * allows you to do exactly that.
		 *  @type function
		 *  @param {object} oSettings DataTables settings object
		 *  @param {int} start Starting position in data for the draw
		 *  @param {int} end End position in data for the draw
		 *  @param {int} max Total number of rows in the table (regardless of
		 *    filtering)
		 *  @param {int} total Total number of rows in the data set, after filtering
		 *  @param {string} pre The string that DataTables has formatted using it's
		 *    own rules
		 *  @returns {string} The string to be displayed in the information element.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.infoCallback
		 *
		 *  @example
		 *    $('#example').dataTable( {
		 *      "infoCallback": function( settings, start, end, max, total, pre ) {
		 *        return start +" to "+ end;
		 *      }
		 *    } );
		 */
		"fnInfoCallback": null,
	
	
		/**
		 * Called when the table has been initialised. Normally DataTables will
		 * initialise sequentially and there will be no need for this function,
		 * however, this does not hold true when using external language information
		 * since that is obtained using an async XHR call.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} json The JSON object request from the server - only
		 *    present if client-side Ajax sourced data is used
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.initComplete
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "initComplete": function(settings, json) {
		 *          alert( 'DataTables has finished its initialisation.' );
		 *        }
		 *      } );
		 *    } )
		 */
		"fnInitComplete": null,
	
	
		/**
		 * Called at the very start of each table draw and can be used to cancel the
		 * draw by returning false, any other return (including undefined) results in
		 * the full draw occurring).
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @returns {boolean} False will cancel the draw, anything else (including no
		 *    return) will allow it to complete.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.preDrawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "preDrawCallback": function( settings ) {
		 *          if ( $('#test').val() == 1 ) {
		 *            return false;
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnPreDrawCallback": null,
	
	
		/**
		 * This function allows you to 'post process' each row after it have been
		 * generated for each table draw, but before it is rendered on screen. This
		 * function might be used for setting the row class name etc.
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} displayIndex The display index for the current table draw
		 *  @param {int} displayIndexFull The index of the data in the full list of
		 *    rows (after filtering)
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.rowCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "rowCallback": function( row, data, displayIndex, displayIndexFull ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" ) {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnRowCallback": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * This parameter allows you to override the default function which obtains
		 * the data from the server so something more suitable for your application.
		 * For example you could use POST data, or pull information from a Gears or
		 * AIR database.
		 *  @type function
		 *  @member
		 *  @param {string} source HTTP source to obtain the data from (`ajax`)
		 *  @param {array} data A key/value pair object containing the data to send
		 *    to the server
		 *  @param {function} callback to be called on completion of the data get
		 *    process that will draw the data on the page.
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverData
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerData": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 *  It is often useful to send extra data to the server when making an Ajax
		 * request - for example custom filtering information, and this callback
		 * function makes it trivial to send extra information to the server. The
		 * passed in parameter is the data set that has been constructed by
		 * DataTables, and you can add to this or modify it as you require.
		 *  @type function
		 *  @param {array} data Data array (array of objects which are name/value
		 *    pairs) that has been constructed by DataTables and will be sent to the
		 *    server. In the case of Ajax sourced data with server-side processing
		 *    this will be an empty array, for server-side processing there will be a
		 *    significant number of parameters!
		 *  @returns {undefined} Ensure that you modify the data array passed in,
		 *    as this is passed by reference.
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverParams
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerParams": null,
	
	
		/**
		 * Load the table state. With this function you can define from where, and how, the
		 * state of a table is loaded. By default DataTables will load from `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} callback Callback that can be executed when done. It
		 *    should be passed the loaded state object.
		 *  @return {object} The DataTables state object to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadCallback": function (settings, callback) {
		 *          $.ajax( {
		 *            "url": "/state_load",
		 *            "dataType": "json",
		 *            "success": function (json) {
		 *              callback( json );
		 *            }
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadCallback": function ( settings ) {
			try {
				return JSON.parse(
					(settings.iStateDuration === -1 ? sessionStorage : localStorage).getItem(
						'DataTables_'+settings.sInstance+'_'+location.pathname
					)
				);
			} catch (e) {
				return {};
			}
		},
	
	
		/**
		 * Callback which allows modification of the saved state prior to loading that state.
		 * This callback is called when the table is loading state from the stored data, but
		 * prior to the settings object being modified by the saved state. Note that for
		 * plug-in authors, you should use the `stateLoadParams` event to load parameters for
		 * a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that is to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never loaded
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Disallow state loading by returning false
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          return false;
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadParams": null,
	
	
		/**
		 * Callback that is called when the state has been loaded from the state saving method
		 * and the DataTables settings object has been modified as a result of the loaded state.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that was loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoaded
		 *
		 *  @example
		 *    // Show an alert with the filtering value that was saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoaded": function (settings, data) {
		 *          alert( 'Saved filter was: '+data.oSearch.sSearch );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoaded": null,
	
	
		/**
		 * Save the table state. This function allows you to define where and how the state
		 * information for the table is stored By default DataTables will use `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveCallback": function (settings, data) {
		 *          // Send an Ajax request to the server with the state object
		 *          $.ajax( {
		 *            "url": "/state_save",
		 *            "data": data,
		 *            "dataType": "json",
		 *            "method": "POST"
		 *            "success": function () {}
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveCallback": function ( settings, data ) {
			try {
				(settings.iStateDuration === -1 ? sessionStorage : localStorage).setItem(
					'DataTables_'+settings.sInstance+'_'+location.pathname,
					JSON.stringify( data )
				);
			} catch (e) {}
		},
	
	
		/**
		 * Callback which allows modification of the state to be saved. Called when the table
		 * has changed state a new state save is required. This method allows modification of
		 * the state saving object prior to actually doing the save, including addition or
		 * other state properties or modification. Note that for plug-in authors, you should
		 * use the `stateSaveParams` event to save parameters for a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveParams": null,
	
	
		/**
		 * Duration for which the saved state information is considered valid. After this period
		 * has elapsed the state will be returned to the default.
		 * Value is given in seconds.
		 *  @type int
		 *  @default 7200 <i>(2 hours)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.stateDuration
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateDuration": 60*60*24; // 1 day
		 *      } );
		 *    } )
		 */
		"iStateDuration": 7200,
	
	
		/**
		 * When enabled DataTables will not make a request to the server for the first
		 * page draw - rather it will use the data already on the page (no sorting etc
		 * will be applied to it), thus saving on an XHR at load time. `deferLoading`
		 * is used to indicate that deferred loading is required, but it is also used
		 * to tell DataTables how many records there are in the full table (allowing
		 * the information element and pagination to be displayed correctly). In the case
		 * where a filtering is applied to the table on initial load, this can be
		 * indicated by giving the parameter as an array, where the first element is
		 * the number of records available after filtering and the second element is the
		 * number of records without filtering (allowing the table information element
		 * to be shown correctly).
		 *  @type int | array
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.deferLoading
		 *
		 *  @example
		 *    // 57 records available in the table, no filtering applied
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": 57
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // 57 records after filtering, 100 without filtering (an initial filter applied)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": [ 57, 100 ],
		 *        "search": {
		 *          "search": "my_filter"
		 *        }
		 *      } );
		 *    } );
		 */
		"iDeferLoading": null,
	
	
		/**
		 * Number of rows to display on a single page when using pagination. If
		 * feature enabled (`lengthChange`) then the end user will be able to override
		 * this to a custom setting using a pop-up menu.
		 *  @type int
		 *  @default 10
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pageLength
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pageLength": 50
		 *      } );
		 *    } )
		 */
		"iDisplayLength": 10,
	
	
		/**
		 * Define the starting point for data display when using DataTables with
		 * pagination. Note that this parameter is the number of records, rather than
		 * the page number, so if you have 10 records per page and want to start on
		 * the third page, it should be "20".
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.displayStart
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "displayStart": 20
		 *      } );
		 *    } )
		 */
		"iDisplayStart": 0,
	
	
		/**
		 * By default DataTables allows keyboard navigation of the table (sorting, paging,
		 * and filtering) by adding a `tabindex` attribute to the required elements. This
		 * allows you to tab through the controls and press the enter key to activate them.
		 * The tabindex is default 0, meaning that the tab follows the flow of the document.
		 * You can overrule this using this parameter if you wish. Use a value of -1 to
		 * disable built-in keyboard navigation.
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.tabIndex
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "tabIndex": 1
		 *      } );
		 *    } );
		 */
		"iTabIndex": 0,
	
	
		/**
		 * Classes that DataTables assigns to the various components and features
		 * that it adds to the HTML table. This allows classes to be configured
		 * during initialisation in addition to through the static
		 * {@link DataTable.ext.oStdClasses} object).
		 *  @namespace
		 *  @name DataTable.defaults.classes
		 */
		"oClasses": {},
	
	
		/**
		 * All strings that DataTables uses in the user interface that it creates
		 * are defined in this object, allowing you to modified them individually or
		 * completely replace them all as required.
		 *  @namespace
		 *  @name DataTable.defaults.language
		 */
		"oLanguage": {
			/**
			 * Strings that are used for WAI-ARIA labels and controls only (these are not
			 * actually visible on the page, but will be read by screenreaders, and thus
			 * must be internationalised as well).
			 *  @namespace
			 *  @name DataTable.defaults.language.aria
			 */
			"oAria": {
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted ascending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortAscending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortAscending": " - click/return to sort ascending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortAscending": ": activate to sort column ascending",
	
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted descending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortDescending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortDescending": " - click/return to sort descending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortDescending": ": activate to sort column descending"
			},
	
			/**
			 * Pagination string used by DataTables for the built-in pagination
			 * control types.
			 *  @namespace
			 *  @name DataTable.defaults.language.paginate
			 */
			"oPaginate": {
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the first page.
				 *  @type string
				 *  @default First
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.first
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "first": "First page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sFirst": "First",
	
	
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the last page.
				 *  @type string
				 *  @default Last
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.last
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "last": "Last page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sLast": "Last",
	
	
				/**
				 * Text to use for the 'next' pagination button (to take the user to the
				 * next page).
				 *  @type string
				 *  @default Next
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.next
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "next": "Next page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sNext": "Next",
	
	
				/**
				 * Text to use for the 'previous' pagination button (to take the user to
				 * the previous page).
				 *  @type string
				 *  @default Previous
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.previous
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "previous": "Previous page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sPrevious": "Previous"
			},
	
			/**
			 * This string is shown in preference to `zeroRecords` when the table is
			 * empty of data (regardless of filtering). Note that this is an optional
			 * parameter - if it is not given, the value of `zeroRecords` will be used
			 * instead (either the default or given value).
			 *  @type string
			 *  @default No data available in table
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.emptyTable
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "emptyTable": "No data available in table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sEmptyTable": "No data available in table",
	
	
			/**
			 * This string gives information to the end user about the information
			 * that is current on display on the page. The following tokens can be
			 * used in the string and will be dynamically replaced as the table
			 * display updates. This tokens can be placed anywhere in the string, or
			 * removed as needed by the language requires:
			 *
			 * * `\_START\_` - Display index of the first record on the current page
			 * * `\_END\_` - Display index of the last record on the current page
			 * * `\_TOTAL\_` - Number of records in the table after filtering
			 * * `\_MAX\_` - Number of records in the table without filtering
			 * * `\_PAGE\_` - Current page number
			 * * `\_PAGES\_` - Total number of pages of data in the table
			 *
			 *  @type string
			 *  @default Showing _START_ to _END_ of _TOTAL_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.info
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "info": "Showing page _PAGE_ of _PAGES_"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
	
	
			/**
			 * Display information string for when the table is empty. Typically the
			 * format of this string should match `info`.
			 *  @type string
			 *  @default Showing 0 to 0 of 0 entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoEmpty
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoEmpty": "No entries to show"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoEmpty": "Showing 0 to 0 of 0 entries",
	
	
			/**
			 * When a user filters the information in a table, this string is appended
			 * to the information (`info`) to give an idea of how strong the filtering
			 * is. The variable _MAX_ is dynamically updated.
			 *  @type string
			 *  @default (filtered from _MAX_ total entries)
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoFiltered
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoFiltered": " - filtering from _MAX_ records"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoFiltered": "(filtered from _MAX_ total entries)",
	
	
			/**
			 * If can be useful to append extra information to the info string at times,
			 * and this variable does exactly that. This information will be appended to
			 * the `info` (`infoEmpty` and `infoFiltered` in whatever combination they are
			 * being used) at all times.
			 *  @type string
			 *  @default <i>Empty string</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoPostFix
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoPostFix": "All records shown are derived from real information."
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoPostFix": "",
	
	
			/**
			 * This decimal place operator is a little different from the other
			 * language options since DataTables doesn't output floating point
			 * numbers, so it won't ever use this for display of a number. Rather,
			 * what this parameter does is modify the sort methods of the table so
			 * that numbers which are in a format which has a character other than
			 * a period (`.`) as a decimal place will be sorted numerically.
			 *
			 * Note that numbers with different decimal places cannot be shown in
			 * the same table and still be sortable, the table must be consistent.
			 * However, multiple different tables on the page can use different
			 * decimal place characters.
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.decimal
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "decimal": ","
			 *          "thousands": "."
			 *        }
			 *      } );
			 *    } );
			 */
			"sDecimal": "",
	
	
			/**
			 * DataTables has a build in number formatter (`formatNumber`) which is
			 * used to format large numbers that are used in the table information.
			 * By default a comma is used, but this can be trivially changed to any
			 * character you wish with this parameter.
			 *  @type string
			 *  @default ,
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.thousands
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "thousands": "'"
			 *        }
			 *      } );
			 *    } );
			 */
			"sThousands": ",",
	
	
			/**
			 * Detail the action that will be taken when the drop down menu for the
			 * pagination length option is changed. The '_MENU_' variable is replaced
			 * with a default select list of 10, 25, 50 and 100, and can be replaced
			 * with a custom select box if required.
			 *  @type string
			 *  @default Show _MENU_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.lengthMenu
			 *
			 *  @example
			 *    // Language change only
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": "Display _MENU_ records"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Language and options change
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": 'Display <select>'+
			 *            '<option value="10">10</option>'+
			 *            '<option value="20">20</option>'+
			 *            '<option value="30">30</option>'+
			 *            '<option value="40">40</option>'+
			 *            '<option value="50">50</option>'+
			 *            '<option value="-1">All</option>'+
			 *            '</select> records'
			 *        }
			 *      } );
			 *    } );
			 */
			"sLengthMenu": "Show _MENU_ entries",
	
	
			/**
			 * When using Ajax sourced data and during the first draw when DataTables is
			 * gathering the data, this message is shown in an empty row in the table to
			 * indicate to the end user the the data is being loaded. Note that this
			 * parameter is not used when loading data by server-side processing, just
			 * Ajax sourced data with client-side processing.
			 *  @type string
			 *  @default Loading...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.loadingRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "loadingRecords": "Please wait - loading..."
			 *        }
			 *      } );
			 *    } );
			 */
			"sLoadingRecords": "Loading...",
	
	
			/**
			 * Text which is displayed when the table is processing a user action
			 * (usually a sort command or similar).
			 *  @type string
			 *  @default Processing...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.processing
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "processing": "DataTables is currently busy"
			 *        }
			 *      } );
			 *    } );
			 */
			"sProcessing": "Processing...",
	
	
			/**
			 * Details the actions that will be taken when the user types into the
			 * filtering input text box. The variable "_INPUT_", if used in the string,
			 * is replaced with the HTML text box for the filtering input allowing
			 * control over where it appears in the string. If "_INPUT_" is not given
			 * then the input box is appended to the string automatically.
			 *  @type string
			 *  @default Search:
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.search
			 *
			 *  @example
			 *    // Input text box will be appended at the end automatically
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Filter records:"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Specify where the filter should appear
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Apply filter _INPUT_ to table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sSearch": "Search:",
	
	
			/**
			 * Assign a `placeholder` attribute to the search `input` element
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.searchPlaceholder
			 */
			"sSearchPlaceholder": "",
	
	
			/**
			 * All of the language information can be stored in a file on the
			 * server-side, which DataTables will look up if this parameter is passed.
			 * It must store the URL of the language file, which is in a JSON format,
			 * and the object has the same properties as the oLanguage object in the
			 * initialiser object (i.e. the above parameters). Please refer to one of
			 * the example language files to see how this works in action.
			 *  @type string
			 *  @default <i>Empty string - i.e. disabled</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.url
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "url": "http://www.sprymedia.co.uk/dataTables/lang.txt"
			 *        }
			 *      } );
			 *    } );
			 */
			"sUrl": "",
	
	
			/**
			 * Text shown inside the table records when the is no information to be
			 * displayed after filtering. `emptyTable` is shown when there is simply no
			 * information in the table at all (regardless of filtering).
			 *  @type string
			 *  @default No matching records found
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.zeroRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "zeroRecords": "No records to display"
			 *        }
			 *      } );
			 *    } );
			 */
			"sZeroRecords": "No matching records found"
		},
	
	
		/**
		 * This parameter allows you to have define the global filtering state at
		 * initialisation time. As an object the `search` parameter must be
		 * defined, but all other parameters are optional. When `regex` is true,
		 * the search string will be treated as a regular expression, when false
		 * (default) it will be treated as a straight string. When `smart`
		 * DataTables will use it's smart filtering methods (to word match at
		 * any point in the data), when false this will not be done.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.search
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "search": {"search": "Initial search"}
		 *      } );
		 *    } )
		 */
		"oSearch": $.extend( {}, DataTable.models.oSearch ),
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * By default DataTables will look for the property `data` (or `aaData` for
		 * compatibility with DataTables 1.9-) when obtaining data from an Ajax
		 * source or for server-side processing - this parameter allows that
		 * property to be changed. You can use Javascript dotted object notation to
		 * get a data source for multiple levels of nesting.
		 *  @type string
		 *  @default data
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxDataProp
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxDataProp": "data",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * You can instruct DataTables to load data from an external
		 * source using this parameter (use aData if you want to pass data in you
		 * already have). Simply provide a url a JSON object can be obtained from.
		 *  @type string
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxSource
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxSource": null,
	
	
		/**
		 * This initialisation variable allows you to specify exactly where in the
		 * DOM you want DataTables to inject the various controls it adds to the page
		 * (for example you might want the pagination controls at the top of the
		 * table). DIV elements (with or without a custom class) can also be added to
		 * aid styling. The follow syntax is used:
		 *   <ul>
		 *     <li>The following options are allowed:
		 *       <ul>
		 *         <li>'l' - Length changing</li>
		 *         <li>'f' - Filtering input</li>
		 *         <li>'t' - The table!</li>
		 *         <li>'i' - Information</li>
		 *         <li>'p' - Pagination</li>
		 *         <li>'r' - pRocessing</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following constants are allowed:
		 *       <ul>
		 *         <li>'H' - jQueryUI theme "header" classes ('fg-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix')</li>
		 *         <li>'F' - jQueryUI theme "footer" classes ('fg-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix')</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following syntax is expected:
		 *       <ul>
		 *         <li>'&lt;' and '&gt;' - div elements</li>
		 *         <li>'&lt;"class" and '&gt;' - div with a class</li>
		 *         <li>'&lt;"#id" and '&gt;' - div with an ID</li>
		 *       </ul>
		 *     </li>
		 *     <li>Examples:
		 *       <ul>
		 *         <li>'&lt;"wrapper"flipt&gt;'</li>
		 *         <li>'&lt;lf&lt;t&gt;ip&gt;'</li>
		 *       </ul>
		 *     </li>
		 *   </ul>
		 *  @type string
		 *  @default lfrtip <i>(when `jQueryUI` is false)</i> <b>or</b>
		 *    <"H"lfr>t<"F"ip> <i>(when `jQueryUI` is true)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.dom
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "dom": '&lt;"top"i&gt;rt&lt;"bottom"flp&gt;&lt;"clear"&gt;'
		 *      } );
		 *    } );
		 */
		"sDom": "lfrtip",
	
	
		/**
		 * Search delay option. This will throttle full table searches that use the
		 * DataTables provided search input element (it does not effect calls to
		 * `dt-api search()`, providing a delay before the search is made.
		 *  @type integer
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.searchDelay
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchDelay": 200
		 *      } );
		 *    } )
		 */
		"searchDelay": null,
	
	
		/**
		 * DataTables features six different built-in options for the buttons to
		 * display for pagination control:
		 *
		 * * `numbers` - Page number buttons only
		 * * `simple` - 'Previous' and 'Next' buttons only
		 * * 'simple_numbers` - 'Previous' and 'Next' buttons, plus page numbers
		 * * `full` - 'First', 'Previous', 'Next' and 'Last' buttons
		 * * `full_numbers` - 'First', 'Previous', 'Next' and 'Last' buttons, plus page numbers
		 * * `first_last_numbers` - 'First' and 'Last' buttons, plus page numbers
		 *  
		 * Further methods can be added using {@link DataTable.ext.oPagination}.
		 *  @type string
		 *  @default simple_numbers
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pagingType
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pagingType": "full_numbers"
		 *      } );
		 *    } )
		 */
		"sPaginationType": "simple_numbers",
	
	
		/**
		 * Enable horizontal scrolling. When a table is too wide to fit into a
		 * certain layout, or you have a large number of columns in the table, you
		 * can enable x-scrolling to show the table in a viewport, which can be
		 * scrolled. This property can be `true` which will allow the table to
		 * scroll horizontally when needed, or any CSS unit, or a number (in which
		 * case it will be treated as a pixel measurement). Setting as simply `true`
		 * is recommended.
		 *  @type boolean|string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollX
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": true,
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"sScrollX": "",
	
	
		/**
		 * This property can be used to force a DataTable to use more width than it
		 * might otherwise do when x-scrolling is enabled. For example if you have a
		 * table which requires to be well spaced, this parameter is useful for
		 * "over-sizing" the table, and thus forcing scrolling. This property can by
		 * any CSS unit, or a number (in which case it will be treated as a pixel
		 * measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollXInner
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": "100%",
		 *        "scrollXInner": "110%"
		 *      } );
		 *    } );
		 */
		"sScrollXInner": "",
	
	
		/**
		 * Enable vertical scrolling. Vertical scrolling will constrain the DataTable
		 * to the given height, and enable scrolling for any data which overflows the
		 * current viewport. This can be used as an alternative to paging to display
		 * a lot of data in a small area (although paging and scrolling can both be
		 * enabled at the same time). This property can be any CSS unit, or a number
		 * (in which case it will be treated as a pixel measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollY
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false
		 *      } );
		 *    } );
		 */
		"sScrollY": "",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * Set the HTTP method that is used to make the Ajax call for server-side
		 * processing or Ajax sourced data.
		 *  @type string
		 *  @default GET
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverMethod
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sServerMethod": "GET",
	
	
		/**
		 * DataTables makes use of renderers when displaying HTML elements for
		 * a table. These renderers can be added or modified by plug-ins to
		 * generate suitable mark-up for a site. For example the Bootstrap
		 * integration plug-in for DataTables uses a paging button renderer to
		 * display pagination buttons in the mark-up required by Bootstrap.
		 *
		 * For further information about the renderers available see
		 * DataTable.ext.renderer
		 *  @type string|object
		 *  @default null
		 *
		 *  @name DataTable.defaults.renderer
		 *
		 */
		"renderer": null,
	
	
		/**
		 * Set the data property name that DataTables should use to get a row's id
		 * to set as the `id` property in the node.
		 *  @type string
		 *  @default DT_RowId
		 *
		 *  @name DataTable.defaults.rowId
		 */
		"rowId": "DT_RowId"
	};
	
	_fnHungarianMap( DataTable.defaults );
	
	
	
	/*
	 * Developer note - See note in model.defaults.js about the use of Hungarian
	 * notation and camel case.
	 */
	
	/**
	 * Column options that can be given to DataTables at initialisation time.
	 *  @namespace
	 */
	DataTable.defaults.column = {
		/**
		 * Define which column(s) an order will occur on for this column. This
		 * allows a column's ordering to take multiple columns into account when
		 * doing a sort or use the data from a different column. For example first
		 * name / last name columns make sense to do a multi-column sort over the
		 * two columns.
		 *  @type array|int
		 *  @default null <i>Takes the value of the column index automatically</i>
		 *
		 *  @name DataTable.defaults.column.orderData
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderData": [ 0, 1 ], "targets": [ 0 ] },
		 *          { "orderData": [ 1, 0 ], "targets": [ 1 ] },
		 *          { "orderData": 2, "targets": [ 2 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderData": [ 0, 1 ] },
		 *          { "orderData": [ 1, 0 ] },
		 *          { "orderData": 2 },
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"aDataSort": null,
		"iDataSort": -1,
	
	
		/**
		 * You can control the default ordering direction, and even alter the
		 * behaviour of the sort handler (i.e. only allow ascending ordering etc)
		 * using this parameter.
		 *  @type array
		 *  @default [ 'asc', 'desc' ]
		 *
		 *  @name DataTable.defaults.column.orderSequence
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderSequence": [ "asc" ], "targets": [ 1 ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ], "targets": [ 2 ] },
		 *          { "orderSequence": [ "desc" ], "targets": [ 3 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          { "orderSequence": [ "asc" ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ] },
		 *          { "orderSequence": [ "desc" ] },
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"asSorting": [ 'asc', 'desc' ],
	
	
		/**
		 * Enable or disable filtering on the data in this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.searchable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "searchable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "searchable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSearchable": true,
	
	
		/**
		 * Enable or disable ordering on this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.orderable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSortable": true,
	
	
		/**
		 * Enable or disable the display of this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.visible
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "visible": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "visible": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bVisible": true,
	
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} td The TD node that has been created
		 *  @param {*} cellData The Data for the cell
		 *  @param {array|object} rowData The data for the whole row
		 *  @param {int} row The row index for the aoData data store
		 *  @param {int} col The column index for aoColumns
		 *
		 *  @name DataTable.defaults.column.createdCell
		 *  @dtopt Columns
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [3],
		 *          "createdCell": function (td, cellData, rowData, row, col) {
		 *            if ( cellData == "1.7" ) {
		 *              $(td).css('color', 'blue')
		 *            }
		 *          }
		 *        } ]
		 *      });
		 *    } );
		 */
		"fnCreatedCell": null,
	
	
		/**
		 * This parameter has been replaced by `data` in DataTables to ensure naming
		 * consistency. `dataProp` can still be used, as there is backwards
		 * compatibility in DataTables for this option, but it is strongly
		 * recommended that you use `data` in preference to `dataProp`.
		 *  @name DataTable.defaults.column.dataProp
		 */
	
	
		/**
		 * This property can be used to read data from any data source property,
		 * including deeply nested objects / properties. `data` can be given in a
		 * number of different ways which effect its behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object. Note that
		 *      function notation is recommended for use in `render` rather than
		 *      `data` as it is much simpler to use as a renderer.
		 * * `null` - use the original data source for the row rather than plucking
		 *   data directly from it. This action has effects on two other
		 *   initialisation options:
		 *    * `defaultContent` - When null is given as the `data` option and
		 *      `defaultContent` is specified for the column, the value defined by
		 *      `defaultContent` will be used for the cell.
		 *    * `render` - When null is used for the `data` option and the `render`
		 *      option is specified for the column, the whole data source for the
		 *      row is used for the renderer.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * `{array|object}` The data source for the row
		 *      * `{string}` The type call data requested - this will be 'set' when
		 *        setting data or 'filter', 'display', 'type', 'sort' or undefined
		 *        when gathering data. Note that when `undefined` is given for the
		 *        type DataTables expects to get the raw data for the object back<
		 *      * `{*}` Data to set when the second parameter is 'set'.
		 *    * Return:
		 *      * The return value from the function is not required when 'set' is
		 *        the type of call, but otherwise the return is what will be used
		 *        for the data requested.
		 *
		 * Note that `data` is a getter and setter option. If you just require
		 * formatting of data for output, you will likely want to use `render` which
		 * is simply a getter and thus simpler to use.
		 *
		 * Note that prior to DataTables 1.9.2 `data` was called `mDataProp`. The
		 * name change reflects the flexibility of this property and is consistent
		 * with the naming of mRender. If 'mDataProp' is given, then it will still
		 * be used by DataTables, as it automatically maps the old name to the new
		 * if required.
		 *
		 *  @type string|int|function|null
		 *  @default null <i>Use automatically calculated column index</i>
		 *
		 *  @name DataTable.defaults.column.data
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Read table data from objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {value},
		 *    //      "version": {value},
		 *    //      "grade": {value}
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/objects.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform" },
		 *          { "data": "version" },
		 *          { "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Read information from deeply nested objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {
		 *    //         "inner": {value}
		 *    //      },
		 *    //      "details": [
		 *    //         {value}, {value}
		 *    //      ]
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform.inner" },
		 *          { "data": "details.0" },
		 *          { "data": "details.1" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `data` as a function to provide different information for
		 *    // sorting, filtering and display. In this case, currency (price)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": function ( source, type, val ) {
		 *            if (type === 'set') {
		 *              source.price = val;
		 *              // Store the computed dislay and filter values for efficiency
		 *              source.price_display = val=="" ? "" : "$"+numberFormat(val);
		 *              source.price_filter  = val=="" ? "" : "$"+numberFormat(val)+" "+val;
		 *              return;
		 *            }
		 *            else if (type === 'display') {
		 *              return source.price_display;
		 *            }
		 *            else if (type === 'filter') {
		 *              return source.price_filter;
		 *            }
		 *            // 'sort', 'type' and undefined all just use the integer
		 *            return source.price;
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using default content
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null,
		 *          "defaultContent": "Click to edit"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using array notation - outputting a list from an array
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "name[, ]"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 */
		"mData": null,
	
	
		/**
		 * This property is the rendering partner to `data` and it is suggested that
		 * when you want to manipulate data for display (including filtering,
		 * sorting etc) without altering the underlying data for the table, use this
		 * property. `render` can be considered to be the the read only companion to
		 * `data` which is read / write (then as such more complex). Like `data`
		 * this option can be given in a number of different ways to effect its
		 * behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object.
		 * * `object` - use different data for the different data types requested by
		 *   DataTables ('filter', 'display', 'type' or 'sort'). The property names
		 *   of the object is the data type the property refers to and the value can
		 *   defined using an integer, string or function using the same rules as
		 *   `render` normally does. Note that an `_` option _must_ be specified.
		 *   This is the default value to use if you haven't specified a value for
		 *   the data type requested by DataTables.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * {array|object} The data source for the row (based on `data`)
		 *      * {string} The type call data requested - this will be 'filter',
		 *        'display', 'type' or 'sort'.
		 *      * {array|object} The full data source for the row (not based on
		 *        `data`)
		 *    * Return:
		 *      * The return value from the function is what will be used for the
		 *        data requested.
		 *
		 *  @type string|int|function|object|null
		 *  @default null Use the data source value.
		 *
		 *  @name DataTable.defaults.column.render
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Create a comma separated list from an array of objects
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          {
		 *            "data": "platform",
		 *            "render": "[, ].name"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Execute a function to obtain data
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": "browserName()"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // As an object, extracting different data for the different types
		 *    // This would be used with a data source such as:
		 *    //   { "phone": 5552368, "phone_filter": "5552368 555-2368", "phone_display": "555-2368" }
		 *    // Here the `phone` integer is used for sorting and type detection, while `phone_filter`
		 *    // (which has both forms) is used for filtering for if a user inputs either format, while
		 *    // the formatted phone number is the one that is shown in the table.
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": {
		 *            "_": "phone",
		 *            "filter": "phone_filter",
		 *            "display": "phone_display"
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Use as a function to create a link from the data source
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "download_link",
		 *          "render": function ( data, type, full ) {
		 *            return '<a href="'+data+'">Download</a>';
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 */
		"mRender": null,
	
	
		/**
		 * Change the cell type created for the column - either TD cells or TH cells. This
		 * can be useful as TH cells have semantic meaning in the table body, allowing them
		 * to act as a header for a row (you may wish to add scope='row' to the TH elements).
		 *  @type string
		 *  @default td
		 *
		 *  @name DataTable.defaults.column.cellType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Make the first column use TH cells
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "cellType": "th"
		 *        } ]
		 *      } );
		 *    } );
		 */
		"sCellType": "td",
	
	
		/**
		 * Class to give to each cell in this column.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.class
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "class": "my_class", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "class": "my_class" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sClass": "",
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 * Generally you shouldn't need this!
		 *  @type string
		 *  @default <i>Empty string<i>
		 *
		 *  @name DataTable.defaults.column.contentPadding
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "contentPadding": "mmm"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sContentPadding": "",
	
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because `data`
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 *
		 *  @name DataTable.defaults.column.defaultContent
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit",
		 *            "targets": [ -1 ]
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sDefaultContent": null,
	
	
		/**
		 * This parameter is only used in DataTables' server-side processing. It can
		 * be exceptionally useful to know what columns are being displayed on the
		 * client side, and to map these to database fields. When defined, the names
		 * also allow DataTables to reorder information from the server if it comes
		 * back in an unexpected order (i.e. if you switch your columns around on the
		 * client-side, your server-side code does not also need updating).
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.name
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "name": "engine", "targets": [ 0 ] },
		 *          { "name": "browser", "targets": [ 1 ] },
		 *          { "name": "platform", "targets": [ 2 ] },
		 *          { "name": "version", "targets": [ 3 ] },
		 *          { "name": "grade", "targets": [ 4 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "name": "engine" },
		 *          { "name": "browser" },
		 *          { "name": "platform" },
		 *          { "name": "version" },
		 *          { "name": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sName": "",
	
	
		/**
		 * Defines a data source type for the ordering which can be used to read
		 * real-time information from the table (updating the internally cached
		 * version) prior to ordering. This allows ordering to occur on user
		 * editable elements such as form inputs.
		 *  @type string
		 *  @default std
		 *
		 *  @name DataTable.defaults.column.orderDataType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderDataType": "dom-text", "targets": [ 2, 3 ] },
		 *          { "type": "numeric", "targets": [ 3 ] },
		 *          { "orderDataType": "dom-select", "targets": [ 4 ] },
		 *          { "orderDataType": "dom-checkbox", "targets": [ 5 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          { "orderDataType": "dom-text" },
		 *          { "orderDataType": "dom-text", "type": "numeric" },
		 *          { "orderDataType": "dom-select" },
		 *          { "orderDataType": "dom-checkbox" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sSortDataType": "std",
	
	
		/**
		 * The title of this column.
		 *  @type string
		 *  @default null <i>Derived from the 'TH' value for this column in the
		 *    original HTML table.</i>
		 *
		 *  @name DataTable.defaults.column.title
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "title": "My column title", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "title": "My column title" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sTitle": null,
	
	
		/**
		 * The type allows you to specify how the data for this column will be
		 * ordered. Four types (string, numeric, date and html (which will strip
		 * HTML tags before ordering)) are currently available. Note that only date
		 * formats understood by Javascript's Date() object will be accepted as type
		 * date. For example: "Mar 26, 2008 5:03 PM". May take the values: 'string',
		 * 'numeric', 'date' or 'html' (by default). Further types can be adding
		 * through plug-ins.
		 *  @type string
		 *  @default null <i>Auto-detected from raw data</i>
		 *
		 *  @name DataTable.defaults.column.type
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "type": "html", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "type": "html" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sType": null,
	
	
		/**
		 * Defining the width of the column, this parameter may take any CSS value
		 * (3em, 20px etc). DataTables applies 'smart' widths to columns which have not
		 * been given a specific width through this interface ensuring that the table
		 * remains readable.
		 *  @type string
		 *  @default null <i>Automatic</i>
		 *
		 *  @name DataTable.defaults.column.width
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "width": "20%", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "width": "20%" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sWidth": null
	};
	
	_fnHungarianMap( DataTable.defaults.column );
	
	
	
	/**
	 * DataTables settings object - this holds all the information needed for a
	 * given table, including configuration, data and current application of the
	 * table options. DataTables does not have a single instance for each DataTable
	 * with the settings attached to that instance, but rather instances of the
	 * DataTable "class" are created on-the-fly as needed (typically by a
	 * $().dataTable() call) and the settings object is then applied to that
	 * instance.
	 *
	 * Note that this object is related to {@link DataTable.defaults} but this
	 * one is the internal data store for DataTables's cache of columns. It should
	 * NOT be manipulated outside of DataTables. Any configuration should be done
	 * through the initialisation options.
	 *  @namespace
	 *  @todo Really should attach the settings object to individual instances so we
	 *    don't need to create new instances on each $().dataTable() call (if the
	 *    table already exists). It would also save passing oSettings around and
	 *    into every single function. However, this is a very significant
	 *    architecture change for DataTables and will almost certainly break
	 *    backwards compatibility with older installations. This is something that
	 *    will be done in 2.0.
	 */
	DataTable.models.oSettings = {
		/**
		 * Primary features of DataTables and their enablement state.
		 *  @namespace
		 */
		"oFeatures": {
	
			/**
			 * Flag to say if DataTables should automatically try to calculate the
			 * optimum table and columns widths (true) or not (false).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bAutoWidth": null,
	
			/**
			 * Delay the creation of TR and TD elements until they are actually
			 * needed by a driven page draw. This can give a significant speed
			 * increase for Ajax source and Javascript source data, but makes no
			 * difference at all fro DOM and server-side processing tables.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bDeferRender": null,
	
			/**
			 * Enable filtering on the table or not. Note that if this is disabled
			 * then there is no filtering at all on the table, including fnFilter.
			 * To just remove the filtering input use sDom and remove the 'f' option.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bFilter": null,
	
			/**
			 * Table information element (the 'Showing x of y records' div) enable
			 * flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bInfo": null,
	
			/**
			 * Present a user control allowing the end user to change the page size
			 * when pagination is enabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bLengthChange": null,
	
			/**
			 * Pagination enabled or not. Note that if this is disabled then length
			 * changing must also be disabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bPaginate": null,
	
			/**
			 * Processing indicator enable flag whenever DataTables is enacting a
			 * user request - typically an Ajax request for server-side processing.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bProcessing": null,
	
			/**
			 * Server-side processing enabled flag - when enabled DataTables will
			 * get all data from the server for every draw - there is no filtering,
			 * sorting or paging done on the client-side.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bServerSide": null,
	
			/**
			 * Sorting enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSort": null,
	
			/**
			 * Multi-column sorting
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortMulti": null,
	
			/**
			 * Apply a class to the columns which are being sorted to provide a
			 * visual highlight or not. This can slow things down when enabled since
			 * there is a lot of DOM interaction.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortClasses": null,
	
			/**
			 * State saving enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bStateSave": null
		},
	
	
		/**
		 * Scrolling settings for a table.
		 *  @namespace
		 */
		"oScroll": {
			/**
			 * When the table is shorter in height than sScrollY, collapse the
			 * table container down to the height of the table (when true).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bCollapse": null,
	
			/**
			 * Width of the scrollbar for the web-browser's platform. Calculated
			 * during table initialisation.
			 *  @type int
			 *  @default 0
			 */
			"iBarWidth": 0,
	
			/**
			 * Viewport width for horizontal scrolling. Horizontal scrolling is
			 * disabled if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sX": null,
	
			/**
			 * Width to expand the table to when using x-scrolling. Typically you
			 * should not need to use this.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 *  @deprecated
			 */
			"sXInner": null,
	
			/**
			 * Viewport height for vertical scrolling. Vertical scrolling is disabled
			 * if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sY": null
		},
	
		/**
		 * Language information for the table.
		 *  @namespace
		 *  @extends DataTable.defaults.oLanguage
		 */
		"oLanguage": {
			/**
			 * Information callback function. See
			 * {@link DataTable.defaults.fnInfoCallback}
			 *  @type function
			 *  @default null
			 */
			"fnInfoCallback": null
		},
	
		/**
		 * Browser support parameters
		 *  @namespace
		 */
		"oBrowser": {
			/**
			 * Indicate if the browser incorrectly calculates width:100% inside a
			 * scrolling element (IE6/7)
			 *  @type boolean
			 *  @default false
			 */
			"bScrollOversize": false,
	
			/**
			 * Determine if the vertical scrollbar is on the right or left of the
			 * scrolling container - needed for rtl language layout, although not
			 * all browsers move the scrollbar (Safari).
			 *  @type boolean
			 *  @default false
			 */
			"bScrollbarLeft": false,
	
			/**
			 * Flag for if `getBoundingClientRect` is fully supported or not
			 *  @type boolean
			 *  @default false
			 */
			"bBounding": false,
	
			/**
			 * Browser scrollbar width
			 *  @type integer
			 *  @default 0
			 */
			"barWidth": 0
		},
	
	
		"ajax": null,
	
	
		/**
		 * Array referencing the nodes which are used for the features. The
		 * parameters of this object match what is allowed by sDom - i.e.
		 *   <ul>
		 *     <li>'l' - Length changing</li>
		 *     <li>'f' - Filtering input</li>
		 *     <li>'t' - The table!</li>
		 *     <li>'i' - Information</li>
		 *     <li>'p' - Pagination</li>
		 *     <li>'r' - pRocessing</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aanFeatures": [],
	
		/**
		 * Store data information - see {@link DataTable.models.oRow} for detailed
		 * information.
		 *  @type array
		 *  @default []
		 */
		"aoData": [],
	
		/**
		 * Array of indexes which are in the current display (after filtering etc)
		 *  @type array
		 *  @default []
		 */
		"aiDisplay": [],
	
		/**
		 * Array of indexes for display - no filtering
		 *  @type array
		 *  @default []
		 */
		"aiDisplayMaster": [],
	
		/**
		 * Map of row ids to data indexes
		 *  @type object
		 *  @default {}
		 */
		"aIds": {},
	
		/**
		 * Store information about each column that is in use
		 *  @type array
		 *  @default []
		 */
		"aoColumns": [],
	
		/**
		 * Store information about the table's header
		 *  @type array
		 *  @default []
		 */
		"aoHeader": [],
	
		/**
		 * Store information about the table's footer
		 *  @type array
		 *  @default []
		 */
		"aoFooter": [],
	
		/**
		 * Store the applied global search information in case we want to force a
		 * research or compare the old search to a new one.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 */
		"oPreviousSearch": {},
	
		/**
		 * Store the applied search for each column - see
		 * {@link DataTable.models.oSearch} for the format that is used for the
		 * filtering information for each column.
		 *  @type array
		 *  @default []
		 */
		"aoPreSearchCols": [],
	
		/**
		 * Sorting that is applied to the table. Note that the inner arrays are
		 * used in the following manner:
		 * <ul>
		 *   <li>Index 0 - column number</li>
		 *   <li>Index 1 - current sorting direction</li>
		 * </ul>
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @todo These inner arrays should really be objects
		 */
		"aaSorting": null,
	
		/**
		 * Sorting that is always applied to the table (i.e. prefixed in front of
		 * aaSorting).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aaSortingFixed": [],
	
		/**
		 * Classes to use for the striping of a table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"asStripeClasses": null,
	
		/**
		 * If restoring a table - we should restore its striping classes as well
		 *  @type array
		 *  @default []
		 */
		"asDestroyStripes": [],
	
		/**
		 * If restoring a table - we should restore its width
		 *  @type int
		 *  @default 0
		 */
		"sDestroyWidth": 0,
	
		/**
		 * Callback functions array for every time a row is inserted (i.e. on a draw).
		 *  @type array
		 *  @default []
		 */
		"aoRowCallback": [],
	
		/**
		 * Callback functions for the header on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoHeaderCallback": [],
	
		/**
		 * Callback function for the footer on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoFooterCallback": [],
	
		/**
		 * Array of callback functions for draw callback functions
		 *  @type array
		 *  @default []
		 */
		"aoDrawCallback": [],
	
		/**
		 * Array of callback functions for row created function
		 *  @type array
		 *  @default []
		 */
		"aoRowCreatedCallback": [],
	
		/**
		 * Callback functions for just before the table is redrawn. A return of
		 * false will be used to cancel the draw.
		 *  @type array
		 *  @default []
		 */
		"aoPreDrawCallback": [],
	
		/**
		 * Callback functions for when the table has been initialised.
		 *  @type array
		 *  @default []
		 */
		"aoInitComplete": [],
	
	
		/**
		 * Callbacks for modifying the settings to be stored for state saving, prior to
		 * saving state.
		 *  @type array
		 *  @default []
		 */
		"aoStateSaveParams": [],
	
		/**
		 * Callbacks for modifying the settings that have been stored for state saving
		 * prior to using the stored values to restore the state.
		 *  @type array
		 *  @default []
		 */
		"aoStateLoadParams": [],
	
		/**
		 * Callbacks for operating on the settings object once the saved state has been
		 * loaded
		 *  @type array
		 *  @default []
		 */
		"aoStateLoaded": [],
	
		/**
		 * Cache the table ID for quick access
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sTableId": "",
	
		/**
		 * The TABLE node for the main table
		 *  @type node
		 *  @default null
		 */
		"nTable": null,
	
		/**
		 * Permanent ref to the thead element
		 *  @type node
		 *  @default null
		 */
		"nTHead": null,
	
		/**
		 * Permanent ref to the tfoot element - if it exists
		 *  @type node
		 *  @default null
		 */
		"nTFoot": null,
	
		/**
		 * Permanent ref to the tbody element
		 *  @type node
		 *  @default null
		 */
		"nTBody": null,
	
		/**
		 * Cache the wrapper node (contains all DataTables controlled elements)
		 *  @type node
		 *  @default null
		 */
		"nTableWrapper": null,
	
		/**
		 * Indicate if when using server-side processing the loading of data
		 * should be deferred until the second draw.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 *  @default false
		 */
		"bDeferLoading": false,
	
		/**
		 * Indicate if all required information has been read in
		 *  @type boolean
		 *  @default false
		 */
		"bInitialised": false,
	
		/**
		 * Information about open rows. Each object in the array has the parameters
		 * 'nTr' and 'nParent'
		 *  @type array
		 *  @default []
		 */
		"aoOpenRows": [],
	
		/**
		 * Dictate the positioning of DataTables' control elements - see
		 * {@link DataTable.model.oInit.sDom}.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sDom": null,
	
		/**
		 * Search delay (in mS)
		 *  @type integer
		 *  @default null
		 */
		"searchDelay": null,
	
		/**
		 * Which type of pagination should be used.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default two_button
		 */
		"sPaginationType": "two_button",
	
		/**
		 * The state duration (for `stateSave`) in seconds.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type int
		 *  @default 0
		 */
		"iStateDuration": 0,
	
		/**
		 * Array of callback functions for state saving. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the JSON string to save that has been thus far created. Returns
		 *       a JSON string to be inserted into a json object
		 *       (i.e. '"param": [ 0, 1, 2]')</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateSave": [],
	
		/**
		 * Array of callback functions for state loading. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the object stored. May return false to cancel state loading</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateLoad": [],
	
		/**
		 * State that was saved. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oSavedState": null,
	
		/**
		 * State that was loaded. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oLoadedState": null,
	
		/**
		 * Source url for AJAX data for the table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sAjaxSource": null,
	
		/**
		 * Property from a given object from which to read the table data from. This
		 * can be an empty string (when not server-side processing), in which case
		 * it is  assumed an an array is given directly.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sAjaxDataProp": null,
	
		/**
		 * Note if draw should be blocked while getting data
		 *  @type boolean
		 *  @default true
		 */
		"bAjaxDataGet": true,
	
		/**
		 * The last jQuery XHR object that was used for server-side data gathering.
		 * This can be used for working with the XHR information in one of the
		 * callbacks
		 *  @type object
		 *  @default null
		 */
		"jqXHR": null,
	
		/**
		 * JSON returned from the server in the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"json": undefined,
	
		/**
		 * Data submitted as part of the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"oAjaxData": undefined,
	
		/**
		 * Function to get the server-side data.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnServerData": null,
	
		/**
		 * Functions which are called prior to sending an Ajax request so extra
		 * parameters can easily be sent to the server
		 *  @type array
		 *  @default []
		 */
		"aoServerParams": [],
	
		/**
		 * Send the XHR HTTP method - GET or POST (could be PUT or DELETE if
		 * required).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sServerMethod": null,
	
		/**
		 * Format numbers for display.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnFormatNumber": null,
	
		/**
		 * List of options that can be used for the user selectable length menu.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aLengthMenu": null,
	
		/**
		 * Counter for the draws that the table does. Also used as a tracker for
		 * server-side processing
		 *  @type int
		 *  @default 0
		 */
		"iDraw": 0,
	
		/**
		 * Indicate if a redraw is being done - useful for Ajax
		 *  @type boolean
		 *  @default false
		 */
		"bDrawing": false,
	
		/**
		 * Draw index (iDraw) of the last error when parsing the returned data
		 *  @type int
		 *  @default -1
		 */
		"iDrawError": -1,
	
		/**
		 * Paging display length
		 *  @type int
		 *  @default 10
		 */
		"_iDisplayLength": 10,
	
		/**
		 * Paging start point - aiDisplay index
		 *  @type int
		 *  @default 0
		 */
		"_iDisplayStart": 0,
	
		/**
		 * Server-side processing - number of records in the result set
		 * (i.e. before filtering), Use fnRecordsTotal rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type int
		 *  @default 0
		 *  @private
		 */
		"_iRecordsTotal": 0,
	
		/**
		 * Server-side processing - number of records in the current display set
		 * (i.e. after filtering). Use fnRecordsDisplay rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type boolean
		 *  @default 0
		 *  @private
		 */
		"_iRecordsDisplay": 0,
	
		/**
		 * The classes to use for the table
		 *  @type object
		 *  @default {}
		 */
		"oClasses": {},
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if filtering has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bFiltered": false,
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if sorting has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bSorted": false,
	
		/**
		 * Indicate that if multiple rows are in the header and there is more than
		 * one unique cell per column, if the top one (true) or bottom one (false)
		 * should be used for sorting / title by DataTables.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bSortCellsTop": null,
	
		/**
		 * Initialisation object that is used for the table
		 *  @type object
		 *  @default null
		 */
		"oInit": null,
	
		/**
		 * Destroy callback functions - for plug-ins to attach themselves to the
		 * destroy so they can clean up markup and events.
		 *  @type array
		 *  @default []
		 */
		"aoDestroyCallback": [],
	
	
		/**
		 * Get the number of records in the current record set, before filtering
		 *  @type function
		 */
		"fnRecordsTotal": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsTotal * 1 :
				this.aiDisplayMaster.length;
		},
	
		/**
		 * Get the number of records in the current record set, after filtering
		 *  @type function
		 */
		"fnRecordsDisplay": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsDisplay * 1 :
				this.aiDisplay.length;
		},
	
		/**
		 * Get the display end point - aiDisplay index
		 *  @type function
		 */
		"fnDisplayEnd": function ()
		{
			var
				len      = this._iDisplayLength,
				start    = this._iDisplayStart,
				calc     = start + len,
				records  = this.aiDisplay.length,
				features = this.oFeatures,
				paginate = features.bPaginate;
	
			if ( features.bServerSide ) {
				return paginate === false || len === -1 ?
					start + records :
					Math.min( start+len, this._iRecordsDisplay );
			}
			else {
				return ! paginate || calc>records || len===-1 ?
					records :
					calc;
			}
		},
	
		/**
		 * The DataTables object for this table
		 *  @type object
		 *  @default null
		 */
		"oInstance": null,
	
		/**
		 * Unique identifier for each instance of the DataTables object. If there
		 * is an ID on the table node, then it takes that value, otherwise an
		 * incrementing internal counter is used.
		 *  @type string
		 *  @default null
		 */
		"sInstance": null,
	
		/**
		 * tabindex attribute value that is added to DataTables control elements, allowing
		 * keyboard navigation of the table and its controls.
		 */
		"iTabIndex": 0,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollHead": null,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollFoot": null,
	
		/**
		 * Last applied sort
		 *  @type array
		 *  @default []
		 */
		"aLastSort": [],
	
		/**
		 * Stored plug-in instances
		 *  @type object
		 *  @default {}
		 */
		"oPlugins": {},
	
		/**
		 * Function used to get a row's id from the row's data
		 *  @type function
		 *  @default null
		 */
		"rowIdFn": null,
	
		/**
		 * Data location where to store a row's id
		 *  @type string
		 *  @default null
		 */
		"rowId": null
	};

	/**
	 * Extension object for DataTables that is used to provide all extension
	 * options.
	 *
	 * Note that the `DataTable.ext` object is available through
	 * `jQuery.fn.dataTable.ext` where it may be accessed and manipulated. It is
	 * also aliased to `jQuery.fn.dataTableExt` for historic reasons.
	 *  @namespace
	 *  @extends DataTable.models.ext
	 */
	
	
	/**
	 * DataTables extensions
	 * 
	 * This namespace acts as a collection area for plug-ins that can be used to
	 * extend DataTables capabilities. Indeed many of the build in methods
	 * use this method to provide their own capabilities (sorting methods for
	 * example).
	 *
	 * Note that this namespace is aliased to `jQuery.fn.dataTableExt` for legacy
	 * reasons
	 *
	 *  @namespace
	 */
	DataTable.ext = _ext = {
		/**
		 * Buttons. For use with the Buttons extension for DataTables. This is
		 * defined here so other extensions can define buttons regardless of load
		 * order. It is _not_ used by DataTables core.
		 *
		 *  @type object
		 *  @default {}
		 */
		buttons: {},
	
	
		/**
		 * Element class names
		 *
		 *  @type object
		 *  @default {}
		 */
		classes: {},
	
	
		/**
		 * DataTables build type (expanded by the download builder)
		 *
		 *  @type string
		 */
		builder: "-source-",
	
	
		/**
		 * Error reporting.
		 * 
		 * How should DataTables report an error. Can take the value 'alert',
		 * 'throw', 'none' or a function.
		 *
		 *  @type string|function
		 *  @default alert
		 */
		errMode: "alert",
	
	
		/**
		 * Feature plug-ins.
		 * 
		 * This is an array of objects which describe the feature plug-ins that are
		 * available to DataTables. These feature plug-ins are then available for
		 * use through the `dom` initialisation option.
		 * 
		 * Each feature plug-in is described by an object which must have the
		 * following properties:
		 * 
		 * * `fnInit` - function that is used to initialise the plug-in,
		 * * `cFeature` - a character so the feature can be enabled by the `dom`
		 *   instillation option. This is case sensitive.
		 *
		 * The `fnInit` function has the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 *
		 * And the following return is expected:
		 * 
		 * * {node|null} The element which contains your feature. Note that the
		 *   return may also be void if your plug-in does not require to inject any
		 *   DOM elements into DataTables control (`dom`) - for example this might
		 *   be useful when developing a plug-in which allows table control via
		 *   keyboard entry
		 *
		 *  @type array
		 *
		 *  @example
		 *    $.fn.dataTable.ext.features.push( {
		 *      "fnInit": function( oSettings ) {
		 *        return new TableTools( { "oDTSettings": oSettings } );
		 *      },
		 *      "cFeature": "T"
		 *    } );
		 */
		feature: [],
	
	
		/**
		 * Row searching.
		 * 
		 * This method of searching is complimentary to the default type based
		 * searching, and a lot more comprehensive as it allows you complete control
		 * over the searching logic. Each element in this array is a function
		 * (parameters described below) that is called for every row in the table,
		 * and your logic decides if it should be included in the searching data set
		 * or not.
		 *
		 * Searching functions have the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{array|object}` Data for the row to be processed (same as the
		 *    original format that was passed in as the data source, or an array
		 *    from a DOM data source
		 * 3. `{int}` Row index ({@link DataTable.models.oSettings.aoData}), which
		 *    can be useful to retrieve the `TR` element if you need DOM interaction.
		 *
		 * And the following return is expected:
		 *
		 * * {boolean} Include the row in the searched result set (true) or not
		 *   (false)
		 *
		 * Note that as with the main search ability in DataTables, technically this
		 * is "filtering", since it is subtractive. However, for consistency in
		 * naming we call it searching here.
		 *
		 *  @type array
		 *  @default []
		 *
		 *  @example
		 *    // The following example shows custom search being applied to the
		 *    // fourth column (i.e. the data[3] index) based on two input values
		 *    // from the end-user, matching the data in a certain range.
		 *    $.fn.dataTable.ext.search.push(
		 *      function( settings, data, dataIndex ) {
		 *        var min = document.getElementById('min').value * 1;
		 *        var max = document.getElementById('max').value * 1;
		 *        var version = data[3] == "-" ? 0 : data[3]*1;
		 *
		 *        if ( min == "" && max == "" ) {
		 *          return true;
		 *        }
		 *        else if ( min == "" && version < max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && "" == max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && version < max ) {
		 *          return true;
		 *        }
		 *        return false;
		 *      }
		 *    );
		 */
		search: [],
	
	
		/**
		 * Selector extensions
		 *
		 * The `selector` option can be used to extend the options available for the
		 * selector modifier options (`selector-modifier` object data type) that
		 * each of the three built in selector types offer (row, column and cell +
		 * their plural counterparts). For example the Select extension uses this
		 * mechanism to provide an option to select only rows, columns and cells
		 * that have been marked as selected by the end user (`{selected: true}`),
		 * which can be used in conjunction with the existing built in selector
		 * options.
		 *
		 * Each property is an array to which functions can be pushed. The functions
		 * take three attributes:
		 *
		 * * Settings object for the host table
		 * * Options object (`selector-modifier` object type)
		 * * Array of selected item indexes
		 *
		 * The return is an array of the resulting item indexes after the custom
		 * selector has been applied.
		 *
		 *  @type object
		 */
		selector: {
			cell: [],
			column: [],
			row: []
		},
	
	
		/**
		 * Internal functions, exposed for used in plug-ins.
		 * 
		 * Please note that you should not need to use the internal methods for
		 * anything other than a plug-in (and even then, try to avoid if possible).
		 * The internal function may change between releases.
		 *
		 *  @type object
		 *  @default {}
		 */
		internal: {},
	
	
		/**
		 * Legacy configuration options. Enable and disable legacy options that
		 * are available in DataTables.
		 *
		 *  @type object
		 */
		legacy: {
			/**
			 * Enable / disable DataTables 1.9 compatible server-side processing
			 * requests
			 *
			 *  @type boolean
			 *  @default null
			 */
			ajax: null
		},
	
	
		/**
		 * Pagination plug-in methods.
		 * 
		 * Each entry in this object is a function and defines which buttons should
		 * be shown by the pagination rendering method that is used for the table:
		 * {@link DataTable.ext.renderer.pageButton}. The renderer addresses how the
		 * buttons are displayed in the document, while the functions here tell it
		 * what buttons to display. This is done by returning an array of button
		 * descriptions (what each button will do).
		 *
		 * Pagination types (the four built in options and any additional plug-in
		 * options defined here) can be used through the `paginationType`
		 * initialisation parameter.
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{int} page` The current page index
		 * 2. `{int} pages` The number of pages in the table
		 *
		 * Each function is expected to return an array where each element of the
		 * array can be one of:
		 *
		 * * `first` - Jump to first page when activated
		 * * `last` - Jump to last page when activated
		 * * `previous` - Show previous page when activated
		 * * `next` - Show next page when activated
		 * * `{int}` - Show page of the index given
		 * * `{array}` - A nested array containing the above elements to add a
		 *   containing 'DIV' element (might be useful for styling).
		 *
		 * Note that DataTables v1.9- used this object slightly differently whereby
		 * an object with two functions would be defined for each plug-in. That
		 * ability is still supported by DataTables 1.10+ to provide backwards
		 * compatibility, but this option of use is now decremented and no longer
		 * documented in DataTables 1.10+.
		 *
		 *  @type object
		 *  @default {}
		 *
		 *  @example
		 *    // Show previous, next and current page buttons only
		 *    $.fn.dataTableExt.oPagination.current = function ( page, pages ) {
		 *      return [ 'previous', page, 'next' ];
		 *    };
		 */
		pager: {},
	
	
		renderer: {
			pageButton: {},
			header: {}
		},
	
	
		/**
		 * Ordering plug-ins - custom data source
		 * 
		 * The extension options for ordering of data available here is complimentary
		 * to the default type based ordering that DataTables typically uses. It
		 * allows much greater control over the the data that is being used to
		 * order a column, but is necessarily therefore more complex.
		 * 
		 * This type of ordering is useful if you want to do ordering based on data
		 * live from the DOM (for example the contents of an 'input' element) rather
		 * than just the static string that DataTables knows of.
		 * 
		 * The way these plug-ins work is that you create an array of the values you
		 * wish to be ordering for the column in question and then return that
		 * array. The data in the array much be in the index order of the rows in
		 * the table (not the currently ordering order!). Which order data gathering
		 * function is run here depends on the `dt-init columns.orderDataType`
		 * parameter that is used for the column (if any).
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{int}` Target column index
		 *
		 * Each function is expected to return an array:
		 *
		 * * `{array}` Data for the column to be ordering upon
		 *
		 *  @type array
		 *
		 *  @example
		 *    // Ordering using `input` node values
		 *    $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
		 *    {
		 *      return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
		 *        return $('input', td).val();
		 *      } );
		 *    }
		 */
		order: {},
	
	
		/**
		 * Type based plug-ins.
		 *
		 * Each column in DataTables has a type assigned to it, either by automatic
		 * detection or by direct assignment using the `type` option for the column.
		 * The type of a column will effect how it is ordering and search (plug-ins
		 * can also make use of the column type if required).
		 *
		 * @namespace
		 */
		type: {
			/**
			 * Type detection functions.
			 *
			 * The functions defined in this object are used to automatically detect
			 * a column's type, making initialisation of DataTables super easy, even
			 * when complex data is in the table.
			 *
			 * The functions defined take two parameters:
			 *
		     *  1. `{*}` Data from the column cell to be analysed
		     *  2. `{settings}` DataTables settings object. This can be used to
		     *     perform context specific type detection - for example detection
		     *     based on language settings such as using a comma for a decimal
		     *     place. Generally speaking the options from the settings will not
		     *     be required
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Data type detected, or null if unknown (and thus
			 *   pass it on to the other type detection functions.
			 *
			 *  @type array
			 *
			 *  @example
			 *    // Currency type detection plug-in:
			 *    $.fn.dataTable.ext.type.detect.push(
			 *      function ( data, settings ) {
			 *        // Check the numeric part
			 *        if ( ! data.substring(1).match(/[0-9]/) ) {
			 *          return null;
			 *        }
			 *
			 *        // Check prefixed by currency
			 *        if ( data.charAt(0) == '$' || data.charAt(0) == '&pound;' ) {
			 *          return 'currency';
			 *        }
			 *        return null;
			 *      }
			 *    );
			 */
			detect: [],
	
	
			/**
			 * Type based search formatting.
			 *
			 * The type based searching functions can be used to pre-format the
			 * data to be search on. For example, it can be used to strip HTML
			 * tags or to de-format telephone numbers for numeric only searching.
			 *
			 * Note that is a search is not defined for a column of a given type,
			 * no search formatting will be performed.
			 * 
			 * Pre-processing of searching data plug-ins - When you assign the sType
			 * for a column (or have it automatically detected for you by DataTables
			 * or a type detection plug-in), you will typically be using this for
			 * custom sorting, but it can also be used to provide custom searching
			 * by allowing you to pre-processing the data and returning the data in
			 * the format that should be searched upon. This is done by adding
			 * functions this object with a parameter name which matches the sType
			 * for that target column. This is the corollary of <i>afnSortData</i>
			 * for searching data.
			 *
			 * The functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for searching
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Formatted string that will be used for the searching.
			 *
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    $.fn.dataTable.ext.type.search['title-numeric'] = function ( d ) {
			 *      return d.replace(/\n/g," ").replace( /<.*?>/g, "" );
			 *    }
			 */
			search: {},
	
	
			/**
			 * Type based ordering.
			 *
			 * The column type tells DataTables what ordering to apply to the table
			 * when a column is sorted upon. The order for each type that is defined,
			 * is defined by the functions available in this object.
			 *
			 * Each ordering option can be described by three properties added to
			 * this object:
			 *
			 * * `{type}-pre` - Pre-formatting function
			 * * `{type}-asc` - Ascending order function
			 * * `{type}-desc` - Descending order function
			 *
			 * All three can be used together, only `{type}-pre` or only
			 * `{type}-asc` and `{type}-desc` together. It is generally recommended
			 * that only `{type}-pre` is used, as this provides the optimal
			 * implementation in terms of speed, although the others are provided
			 * for compatibility with existing Javascript sort functions.
			 *
			 * `{type}-pre`: Functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for ordering
			 *
			 * And return:
			 *
			 * * `{*}` Data to be sorted upon
			 *
			 * `{type}-asc` and `{type}-desc`: Functions are typical Javascript sort
			 * functions, taking two parameters:
			 *
		     *  1. `{*}` Data to compare to the second parameter
		     *  2. `{*}` Data to compare to the first parameter
			 *
			 * And returning:
			 *
			 * * `{*}` Ordering match: <0 if first parameter should be sorted lower
			 *   than the second parameter, ===0 if the two parameters are equal and
			 *   >0 if the first parameter should be sorted height than the second
			 *   parameter.
			 * 
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    // Numeric ordering of formatted numbers with a pre-formatter
			 *    $.extend( $.fn.dataTable.ext.type.order, {
			 *      "string-pre": function(x) {
			 *        a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
			 *        return parseFloat( a );
			 *      }
			 *    } );
			 *
			 *  @example
			 *    // Case-sensitive string ordering, with no pre-formatting method
			 *    $.extend( $.fn.dataTable.ext.order, {
			 *      "string-case-asc": function(x,y) {
			 *        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			 *      },
			 *      "string-case-desc": function(x,y) {
			 *        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
			 *      }
			 *    } );
			 */
			order: {}
		},
	
		/**
		 * Unique DataTables instance counter
		 *
		 * @type int
		 * @private
		 */
		_unique: 0,
	
	
		//
		// Depreciated
		// The following properties are retained for backwards compatiblity only.
		// The should not be used in new projects and will be removed in a future
		// version
		//
	
		/**
		 * Version check function.
		 *  @type function
		 *  @depreciated Since 1.10
		 */
		fnVersionCheck: DataTable.fnVersionCheck,
	
	
		/**
		 * Index for what 'this' index API functions should use
		 *  @type int
		 *  @deprecated Since v1.10
		 */
		iApiIndex: 0,
	
	
		/**
		 * jQuery UI class container
		 *  @type object
		 *  @deprecated Since v1.10
		 */
		oJUIClasses: {},
	
	
		/**
		 * Software version
		 *  @type string
		 *  @deprecated Since v1.10
		 */
		sVersion: DataTable.version
	};
	
	
	//
	// Backwards compatibility. Alias to pre 1.10 Hungarian notation counter parts
	//
	$.extend( _ext, {
		afnFiltering: _ext.search,
		aTypes:       _ext.type.detect,
		ofnSearch:    _ext.type.search,
		oSort:        _ext.type.order,
		afnSortData:  _ext.order,
		aoFeatures:   _ext.feature,
		oApi:         _ext.internal,
		oStdClasses:  _ext.classes,
		oPagination:  _ext.pager
	} );
	
	
	$.extend( DataTable.ext.classes, {
		"sTable": "dataTable",
		"sNoFooter": "no-footer",
	
		/* Paging buttons */
		"sPageButton": "paginate_button",
		"sPageButtonActive": "current",
		"sPageButtonDisabled": "disabled",
	
		/* Striping classes */
		"sStripeOdd": "odd",
		"sStripeEven": "even",
	
		/* Empty row */
		"sRowEmpty": "dataTables_empty",
	
		/* Features */
		"sWrapper": "dataTables_wrapper",
		"sFilter": "dataTables_filter",
		"sInfo": "dataTables_info",
		"sPaging": "dataTables_paginate paging_", /* Note that the type is postfixed */
		"sLength": "dataTables_length",
		"sProcessing": "dataTables_processing",
	
		/* Sorting */
		"sSortAsc": "sorting_asc",
		"sSortDesc": "sorting_desc",
		"sSortable": "sorting", /* Sortable in both directions */
		"sSortableAsc": "sorting_asc_disabled",
		"sSortableDesc": "sorting_desc_disabled",
		"sSortableNone": "sorting_disabled",
		"sSortColumn": "sorting_", /* Note that an int is postfixed for the sorting order */
	
		/* Filtering */
		"sFilterInput": "",
	
		/* Page length */
		"sLengthSelect": "",
	
		/* Scrolling */
		"sScrollWrapper": "dataTables_scroll",
		"sScrollHead": "dataTables_scrollHead",
		"sScrollHeadInner": "dataTables_scrollHeadInner",
		"sScrollBody": "dataTables_scrollBody",
		"sScrollFoot": "dataTables_scrollFoot",
		"sScrollFootInner": "dataTables_scrollFootInner",
	
		/* Misc */
		"sHeaderTH": "",
		"sFooterTH": "",
	
		// Deprecated
		"sSortJUIAsc": "",
		"sSortJUIDesc": "",
		"sSortJUI": "",
		"sSortJUIAscAllowed": "",
		"sSortJUIDescAllowed": "",
		"sSortJUIWrapper": "",
		"sSortIcon": "",
		"sJUIHeader": "",
		"sJUIFooter": ""
	} );
	
	
	var extPagination = DataTable.ext.pager;
	
	function _numbers ( page, pages ) {
		var
			numbers = [],
			buttons = extPagination.numbers_length,
			half = Math.floor( buttons / 2 ),
			i = 1;
	
		if ( pages <= buttons ) {
			numbers = _range( 0, pages );
		}
		else if ( page <= half ) {
			numbers = _range( 0, buttons-2 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
		}
		else if ( page >= pages - 1 - half ) {
			numbers = _range( pages-(buttons-2), pages );
			numbers.splice( 0, 0, 'ellipsis' ); // no unshift in ie6
			numbers.splice( 0, 0, 0 );
		}
		else {
			numbers = _range( page-half+2, page+half-1 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
			numbers.splice( 0, 0, 'ellipsis' );
			numbers.splice( 0, 0, 0 );
		}
	
		numbers.DT_el = 'span';
		return numbers;
	}
	
	
	$.extend( extPagination, {
		simple: function ( page, pages ) {
			return [ 'previous', 'next' ];
		},
	
		full: function ( page, pages ) {
			return [  'first', 'previous', 'next', 'last' ];
		},
	
		numbers: function ( page, pages ) {
			return [ _numbers(page, pages) ];
		},
	
		simple_numbers: function ( page, pages ) {
			return [ 'previous', _numbers(page, pages), 'next' ];
		},
	
		full_numbers: function ( page, pages ) {
			return [ 'first', 'previous', _numbers(page, pages), 'next', 'last' ];
		},
		
		first_last_numbers: function (page, pages) {
	 		return ['first', _numbers(page, pages), 'last'];
	 	},
	
		// For testing and plug-ins to use
		_numbers: _numbers,
	
		// Number of number buttons (including ellipsis) to show. _Must be odd!_
		numbers_length: 7
	} );
	
	
	$.extend( true, DataTable.ext.renderer, {
		pageButton: {
			_: function ( settings, host, idx, buttons, page, pages ) {
				var classes = settings.oClasses;
				var lang = settings.oLanguage.oPaginate;
				var aria = settings.oLanguage.oAria.paginate || {};
				var btnDisplay, btnClass, counter=0;
	
				var attach = function( container, buttons ) {
					var i, ien, node, button, tabIndex;
					var disabledClass = classes.sPageButtonDisabled;
					var clickHandler = function ( e ) {
						_fnPageChange( settings, e.data.action, true );
					};
	
					for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
						button = buttons[i];
	
						if ( Array.isArray( button ) ) {
							var inner = $( '<'+(button.DT_el || 'div')+'/>' )
								.appendTo( container );
							attach( inner, button );
						}
						else {
							btnDisplay = null;
							btnClass = button;
							tabIndex = settings.iTabIndex;
	
							switch ( button ) {
								case 'ellipsis':
									container.append('<span class="ellipsis">&#x2026;</span>');
									break;
	
								case 'first':
									btnDisplay = lang.sFirst;
	
									if ( page === 0 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								case 'previous':
									btnDisplay = lang.sPrevious;
	
									if ( page === 0 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								case 'next':
									btnDisplay = lang.sNext;
	
									if ( pages === 0 || page === pages-1 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								case 'last':
									btnDisplay = lang.sLast;
	
									if ( pages === 0 || page === pages-1 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								default:
									btnDisplay = settings.fnFormatNumber( button + 1 );
									btnClass = page === button ?
										classes.sPageButtonActive : '';
									break;
							}
	
							if ( btnDisplay !== null ) {
								node = $('<a>', {
										'class': classes.sPageButton+' '+btnClass,
										'aria-controls': settings.sTableId,
										'aria-label': aria[ button ],
										'data-dt-idx': counter,
										'tabindex': tabIndex,
										'id': idx === 0 && typeof button === 'string' ?
											settings.sTableId +'_'+ button :
											null
									} )
									.html( btnDisplay )
									.appendTo( container );
	
								_fnBindAction(
									node, {action: button}, clickHandler
								);
	
								counter++;
							}
						}
					}
				};
	
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame. Try / catch the error. Not good for
				// accessibility, but neither are frames.
				var activeEl;
	
				try {
					// Because this approach is destroying and recreating the paging
					// elements, focus is lost on the select button which is bad for
					// accessibility. So we want to restore focus once the draw has
					// completed
					activeEl = $(host).find(document.activeElement).data('dt-idx');
				}
				catch (e) {}
	
				attach( $(host).empty(), buttons );
	
				if ( activeEl !== undefined ) {
					$(host).find( '[data-dt-idx='+activeEl+']' ).trigger('focus');
				}
			}
		}
	} );
	
	
	
	// Built in type detection. See model.ext.aTypes for information about
	// what is required from this methods.
	$.extend( DataTable.ext.type.detect, [
		// Plain numbers - first since V8 detects some plain numbers as dates
		// e.g. Date.parse('55') (but not all, e.g. Date.parse('22')...).
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal ) ? 'num'+decimal : null;
		},
	
		// Dates (only those recognised by the browser's Date.parse)
		function ( d, settings )
		{
			// V8 tries _very_ hard to make a string passed into `Date.parse()`
			// valid, so we need to use a regex to restrict date formats. Use a
			// plug-in for anything other than ISO8601 style strings
			if ( d && !(d instanceof Date) && ! _re_date.test(d) ) {
				return null;
			}
			var parsed = Date.parse(d);
			return (parsed !== null && !isNaN(parsed)) || _empty(d) ? 'date' : null;
		},
	
		// Formatted numbers
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal, true ) ? 'num-fmt'+decimal : null;
		},
	
		// HTML numeric
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal ) ? 'html-num'+decimal : null;
		},
	
		// HTML numeric, formatted
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal, true ) ? 'html-num-fmt'+decimal : null;
		},
	
		// HTML (this is strict checking - there must be html)
		function ( d, settings )
		{
			return _empty( d ) || (typeof d === 'string' && d.indexOf('<') !== -1) ?
				'html' : null;
		}
	] );
	
	
	
	// Filter formatting functions. See model.ext.ofnSearch for information about
	// what is required from these methods.
	// 
	// Note that additional search methods are added for the html numbers and
	// html formatted numbers by `_addNumericSort()` when we know what the decimal
	// place is
	
	
	$.extend( DataTable.ext.type.search, {
		html: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data
						.replace( _re_new_lines, " " )
						.replace( _re_html, "" ) :
					'';
		},
	
		string: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data.replace( _re_new_lines, " " ) :
					data;
		}
	} );
	
	
	
	var __numericReplace = function ( d, decimalPlace, re1, re2 ) {
		if ( d !== 0 && (!d || d === '-') ) {
			return -Infinity;
		}
	
		// If a decimal place other than `.` is used, it needs to be given to the
		// function so we can detect it and replace with a `.` which is the only
		// decimal place Javascript recognises - it is not locale aware.
		if ( decimalPlace ) {
			d = _numToDecimal( d, decimalPlace );
		}
	
		if ( d.replace ) {
			if ( re1 ) {
				d = d.replace( re1, '' );
			}
	
			if ( re2 ) {
				d = d.replace( re2, '' );
			}
		}
	
		return d * 1;
	};
	
	
	// Add the numeric 'deformatting' functions for sorting and search. This is done
	// in a function to provide an easy ability for the language options to add
	// additional methods if a non-period decimal place is used.
	function _addNumericSort ( decimalPlace ) {
		$.each(
			{
				// Plain numbers
				"num": function ( d ) {
					return __numericReplace( d, decimalPlace );
				},
	
				// Formatted numbers
				"num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_formatted_numeric );
				},
	
				// HTML numeric
				"html-num": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html );
				},
	
				// HTML numeric, formatted
				"html-num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html, _re_formatted_numeric );
				}
			},
			function ( key, fn ) {
				// Add the ordering method
				_ext.type.order[ key+decimalPlace+'-pre' ] = fn;
	
				// For HTML types add a search formatter that will strip the HTML
				if ( key.match(/^html\-/) ) {
					_ext.type.search[ key+decimalPlace ] = _ext.type.search.html;
				}
			}
		);
	}
	
	
	// Default sort methods
	$.extend( _ext.type.order, {
		// Dates
		"date-pre": function ( d ) {
			var ts = Date.parse( d );
			return isNaN(ts) ? -Infinity : ts;
		},
	
		// html
		"html-pre": function ( a ) {
			return _empty(a) ?
				'' :
				a.replace ?
					a.replace( /<.*?>/g, "" ).toLowerCase() :
					a+'';
		},
	
		// string
		"string-pre": function ( a ) {
			// This is a little complex, but faster than always calling toString,
			// http://jsperf.com/tostring-v-check
			return _empty(a) ?
				'' :
				typeof a === 'string' ?
					a.toLowerCase() :
					! a.toString ?
						'' :
						a.toString();
		},
	
		// string-asc and -desc are retained only for compatibility with the old
		// sort methods
		"string-asc": function ( x, y ) {
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		},
	
		"string-desc": function ( x, y ) {
			return ((x < y) ? 1 : ((x > y) ? -1 : 0));
		}
	} );
	
	
	// Numeric sorting types - order doesn't matter here
	_addNumericSort( '' );
	
	
	$.extend( true, DataTable.ext.renderer, {
		header: {
			_: function ( settings, cell, column, classes ) {
				// No additional mark-up required
				// Attach a sort listener to update on sort - note that using the
				// `DT` namespace will allow the event to be removed automatically
				// on destroy, while the `dt` namespaced event is the one we are
				// listening for
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) { // need to check this this is the host
						return;               // table, not a nested one
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass(
							column.sSortingClass +' '+
							classes.sSortAsc +' '+
							classes.sSortDesc
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
				} );
			},
	
			jqueryui: function ( settings, cell, column, classes ) {
				$('<div/>')
					.addClass( classes.sSortJUIWrapper )
					.append( cell.contents() )
					.append( $('<span/>')
						.addClass( classes.sSortIcon+' '+column.sSortingClassJUI )
					)
					.appendTo( cell );
	
				// Attach a sort listener to update on sort
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) {
						return;
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass( classes.sSortAsc +" "+classes.sSortDesc )
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
	
					cell
						.find( 'span.'+classes.sSortIcon )
						.removeClass(
							classes.sSortJUIAsc +" "+
							classes.sSortJUIDesc +" "+
							classes.sSortJUI +" "+
							classes.sSortJUIAscAllowed +" "+
							classes.sSortJUIDescAllowed
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortJUIAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortJUIDesc :
								column.sSortingClassJUI
						);
				} );
			}
		}
	} );
	
	/*
	 * Public helper functions. These aren't used internally by DataTables, or
	 * called by any of the options passed into DataTables, but they can be used
	 * externally by developers working with DataTables. They are helper functions
	 * to make working with DataTables a little bit easier.
	 */
	
	var __htmlEscapeEntities = function ( d ) {
		return typeof d === 'string' ?
			d
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;') :
			d;
	};
	
	/**
	 * Helpers for `columns.render`.
	 *
	 * The options defined here can be used with the `columns.render` initialisation
	 * option to provide a display renderer. The following functions are defined:
	 *
	 * * `number` - Will format numeric data (defined by `columns.data`) for
	 *   display, retaining the original unformatted data for sorting and filtering.
	 *   It takes 5 parameters:
	 *   * `string` - Thousands grouping separator
	 *   * `string` - Decimal point indicator
	 *   * `integer` - Number of decimal points to show
	 *   * `string` (optional) - Prefix.
	 *   * `string` (optional) - Postfix (/suffix).
	 * * `text` - Escape HTML to help prevent XSS attacks. It has no optional
	 *   parameters.
	 *
	 * @example
	 *   // Column definition using the number renderer
	 *   {
	 *     data: "salary",
	 *     render: $.fn.dataTable.render.number( '\'', '.', 0, '$' )
	 *   }
	 *
	 * @namespace
	 */
	DataTable.render = {
		number: function ( thousands, decimal, precision, prefix, postfix ) {
			return {
				display: function ( d ) {
					if ( typeof d !== 'number' && typeof d !== 'string' ) {
						return d;
					}
	
					var negative = d < 0 ? '-' : '';
					var flo = parseFloat( d );
	
					// If NaN then there isn't much formatting that we can do - just
					// return immediately, escaping any HTML (this was supposed to
					// be a number after all)
					if ( isNaN( flo ) ) {
						return __htmlEscapeEntities( d );
					}
	
					flo = flo.toFixed( precision );
					d = Math.abs( flo );
	
					var intPart = parseInt( d, 10 );
					var floatPart = precision ?
						decimal+(d - intPart).toFixed( precision ).substring( 2 ):
						'';
	
					return negative + (prefix||'') +
						intPart.toString().replace(
							/\B(?=(\d{3})+(?!\d))/g, thousands
						) +
						floatPart +
						(postfix||'');
				}
			};
		},
	
		text: function () {
			return {
				display: __htmlEscapeEntities,
				filter: __htmlEscapeEntities
			};
		}
	};
	
	
	/*
	 * This is really a good bit rubbish this method of exposing the internal methods
	 * publicly... - To be fixed in 2.0 using methods on the prototype
	 */
	
	
	/**
	 * Create a wrapper function for exporting an internal functions to an external API.
	 *  @param {string} fn API function name
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#internal
	 */
	function _fnExternApiFunc (fn)
	{
		return function() {
			var args = [_fnSettingsFromNode( this[DataTable.ext.iApiIndex] )].concat(
				Array.prototype.slice.call(arguments)
			);
			return DataTable.ext.internal[fn].apply( this, args );
		};
	}
	
	
	/**
	 * Reference to internal functions for use by plug-in developers. Note that
	 * these methods are references to internal functions and are considered to be
	 * private. If you use these methods, be aware that they are liable to change
	 * between versions.
	 *  @namespace
	 */
	$.extend( DataTable.ext.internal, {
		_fnExternApiFunc: _fnExternApiFunc,
		_fnBuildAjax: _fnBuildAjax,
		_fnAjaxUpdate: _fnAjaxUpdate,
		_fnAjaxParameters: _fnAjaxParameters,
		_fnAjaxUpdateDraw: _fnAjaxUpdateDraw,
		_fnAjaxDataSrc: _fnAjaxDataSrc,
		_fnAddColumn: _fnAddColumn,
		_fnColumnOptions: _fnColumnOptions,
		_fnAdjustColumnSizing: _fnAdjustColumnSizing,
		_fnVisibleToColumnIndex: _fnVisibleToColumnIndex,
		_fnColumnIndexToVisible: _fnColumnIndexToVisible,
		_fnVisbleColumns: _fnVisbleColumns,
		_fnGetColumns: _fnGetColumns,
		_fnColumnTypes: _fnColumnTypes,
		_fnApplyColumnDefs: _fnApplyColumnDefs,
		_fnHungarianMap: _fnHungarianMap,
		_fnCamelToHungarian: _fnCamelToHungarian,
		_fnLanguageCompat: _fnLanguageCompat,
		_fnBrowserDetect: _fnBrowserDetect,
		_fnAddData: _fnAddData,
		_fnAddTr: _fnAddTr,
		_fnNodeToDataIndex: _fnNodeToDataIndex,
		_fnNodeToColumnIndex: _fnNodeToColumnIndex,
		_fnGetCellData: _fnGetCellData,
		_fnSetCellData: _fnSetCellData,
		_fnSplitObjNotation: _fnSplitObjNotation,
		_fnGetObjectDataFn: _fnGetObjectDataFn,
		_fnSetObjectDataFn: _fnSetObjectDataFn,
		_fnGetDataMaster: _fnGetDataMaster,
		_fnClearTable: _fnClearTable,
		_fnDeleteIndex: _fnDeleteIndex,
		_fnInvalidate: _fnInvalidate,
		_fnGetRowElements: _fnGetRowElements,
		_fnCreateTr: _fnCreateTr,
		_fnBuildHead: _fnBuildHead,
		_fnDrawHead: _fnDrawHead,
		_fnDraw: _fnDraw,
		_fnReDraw: _fnReDraw,
		_fnAddOptionsHtml: _fnAddOptionsHtml,
		_fnDetectHeader: _fnDetectHeader,
		_fnGetUniqueThs: _fnGetUniqueThs,
		_fnFeatureHtmlFilter: _fnFeatureHtmlFilter,
		_fnFilterComplete: _fnFilterComplete,
		_fnFilterCustom: _fnFilterCustom,
		_fnFilterColumn: _fnFilterColumn,
		_fnFilter: _fnFilter,
		_fnFilterCreateSearch: _fnFilterCreateSearch,
		_fnEscapeRegex: _fnEscapeRegex,
		_fnFilterData: _fnFilterData,
		_fnFeatureHtmlInfo: _fnFeatureHtmlInfo,
		_fnUpdateInfo: _fnUpdateInfo,
		_fnInfoMacros: _fnInfoMacros,
		_fnInitialise: _fnInitialise,
		_fnInitComplete: _fnInitComplete,
		_fnLengthChange: _fnLengthChange,
		_fnFeatureHtmlLength: _fnFeatureHtmlLength,
		_fnFeatureHtmlPaginate: _fnFeatureHtmlPaginate,
		_fnPageChange: _fnPageChange,
		_fnFeatureHtmlProcessing: _fnFeatureHtmlProcessing,
		_fnProcessingDisplay: _fnProcessingDisplay,
		_fnFeatureHtmlTable: _fnFeatureHtmlTable,
		_fnScrollDraw: _fnScrollDraw,
		_fnApplyToChildren: _fnApplyToChildren,
		_fnCalculateColumnWidths: _fnCalculateColumnWidths,
		_fnThrottle: _fnThrottle,
		_fnConvertToWidth: _fnConvertToWidth,
		_fnGetWidestNode: _fnGetWidestNode,
		_fnGetMaxLenString: _fnGetMaxLenString,
		_fnStringToCss: _fnStringToCss,
		_fnSortFlatten: _fnSortFlatten,
		_fnSort: _fnSort,
		_fnSortAria: _fnSortAria,
		_fnSortListener: _fnSortListener,
		_fnSortAttachListener: _fnSortAttachListener,
		_fnSortingClasses: _fnSortingClasses,
		_fnSortData: _fnSortData,
		_fnSaveState: _fnSaveState,
		_fnLoadState: _fnLoadState,
		_fnSettingsFromNode: _fnSettingsFromNode,
		_fnLog: _fnLog,
		_fnMap: _fnMap,
		_fnBindAction: _fnBindAction,
		_fnCallbackReg: _fnCallbackReg,
		_fnCallbackFire: _fnCallbackFire,
		_fnLengthOverflow: _fnLengthOverflow,
		_fnRenderer: _fnRenderer,
		_fnDataSource: _fnDataSource,
		_fnRowAttributes: _fnRowAttributes,
		_fnExtend: _fnExtend,
		_fnCalculateEnd: function () {} // Used by a lot of plug-ins, but redundant
		                                // in 1.10, so this dead-end function is
		                                // added to prevent errors
	} );
	

	// jQuery access
	$.fn.dataTable = DataTable;

	// Provide access to the host jQuery object (circular reference)
	DataTable.$ = $;

	// Legacy aliases
	$.fn.dataTableSettings = DataTable.settings;
	$.fn.dataTableExt = DataTable.ext;

	// With a capital `D` we return a DataTables API instance rather than a
	// jQuery object
	$.fn.DataTable = function ( opts ) {
		return $(this).dataTable( opts ).api();
	};

	// All properties that are available to $.fn.dataTable should also be
	// available on $.fn.DataTable
	$.each( DataTable, function ( prop, val ) {
		$.fn.DataTable[ prop ] = val;
	} );


	// Information about events fired by DataTables - for documentation.
	/**
	 * Draw event, fired whenever the table is redrawn on the page, at the same
	 * point as fnDrawCallback. This may be useful for binding events or
	 * performing calculations when the table is altered at all.
	 *  @name DataTable#draw.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Search event, fired when the searching applied to the table (using the
	 * built-in global search, or column filters) is altered.
	 *  @name DataTable#search.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page change event, fired when the paging of the table is altered.
	 *  @name DataTable#page.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Order event, fired when the ordering applied to the table is altered.
	 *  @name DataTable#order.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * DataTables initialisation complete event, fired when the table is fully
	 * drawn, including Ajax data loaded, if Ajax data is required.
	 *  @name DataTable#init.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The JSON object request from the server - only
	 *    present if client-side Ajax sourced data is used</li></ol>
	 */

	/**
	 * State save event, fired when the table has changed state a new state save
	 * is required. This event allows modification of the state saving object
	 * prior to actually doing the save, including addition or other state
	 * properties (for plug-ins) or modification of a DataTables core property.
	 *  @name DataTable#stateSaveParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The state information to be saved
	 */

	/**
	 * State load event, fired when the table is loading state from the stored
	 * data, but prior to the settings object being modified by the saved state
	 * - allowing modification of the saved state is required or loading of
	 * state for a plug-in.
	 *  @name DataTable#stateLoadParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * State loaded event, fired when state has been loaded from stored data and
	 * the settings object has been modified by the loaded data.
	 *  @name DataTable#stateLoaded.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * Processing event, fired when DataTables is doing some kind of processing
	 * (be it, order, search or anything else). It can be used to indicate to
	 * the end user that there is something happening, or that something has
	 * finished.
	 *  @name DataTable#processing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {boolean} bShow Flag for if DataTables is doing processing or not
	 */

	/**
	 * Ajax (XHR) event, fired whenever an Ajax request is completed from a
	 * request to made to the server for new data. This event is called before
	 * DataTables processed the returned data, so it can also be used to pre-
	 * process the data returned from the server, if needed.
	 *
	 * Note that this trigger is called in `fnServerData`, if you override
	 * `fnServerData` and which to use this event, you need to trigger it in you
	 * success function.
	 *  @name DataTable#xhr.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {object} json JSON returned from the server
	 *
	 *  @example
	 *     // Use a custom property returned from the server in another DOM element
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       $('#status').html( json.status );
	 *     } );
	 *
	 *  @example
	 *     // Pre-process the data returned from the server
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       for ( var i=0, ien=json.aaData.length ; i<ien ; i++ ) {
	 *         json.aaData[i].sum = json.aaData[i].one + json.aaData[i].two;
	 *       }
	 *       // Note no return - manipulate the data directly in the JSON object.
	 *     } );
	 */

	/**
	 * Destroy event, fired when the DataTable is destroyed by calling fnDestroy
	 * or passing the bDestroy:true parameter in the initialisation object. This
	 * can be used to remove bound events, added DOM nodes, etc.
	 *  @name DataTable#destroy.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page length change event, fired when number of records to show on each
	 * page (the length) is changed.
	 *  @name DataTable#length.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {integer} len New length
	 */

	/**
	 * Column sizing has changed.
	 *  @name DataTable#column-sizing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Column visibility has changed.
	 *  @name DataTable#column-visibility.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {int} column Column index
	 *  @param {bool} vis `false` if column now hidden, or `true` if visible
	 */

	return $.fn.dataTable;
}));

/*! DataTables Bootstrap 4 integration
 * ©2011-2017 SpryMedia Ltd - datatables.net/license
 */

/**
 * DataTables integration for Bootstrap 4. This requires Bootstrap 4 and
 * DataTables 1.10 or newer.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Bootstrap. See http://datatables.net/manual/styling/bootstrap
 * for further information.
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				// Require DataTables, which attaches to jQuery, including
				// jQuery if needed and have a $ property so we can access the
				// jQuery object that is used
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/* Set the defaults for DataTables initialisation */
$.extend( true, DataTable.defaults, {
	dom:
		"<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
		"<'row'<'col-sm-12'tr>>" +
		"<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
	renderer: 'bootstrap'
} );


/* Default class modification */
$.extend( DataTable.ext.classes, {
	sWrapper:      "dataTables_wrapper dt-bootstrap4",
	sFilterInput:  "form-control form-control-sm",
	sLengthSelect: "custom-select custom-select-sm form-control form-control-sm",
	sProcessing:   "dataTables_processing card",
	sPageButton:   "paginate_button page-item"
} );


/* Bootstrap paging button renderer */
DataTable.ext.renderer.pageButton.bootstrap = function ( settings, host, idx, buttons, page, pages ) {
	var api     = new DataTable.Api( settings );
	var classes = settings.oClasses;
	var lang    = settings.oLanguage.oPaginate;
	var aria = settings.oLanguage.oAria.paginate || {};
	var btnDisplay, btnClass, counter=0;

	var attach = function( container, buttons ) {
		var i, ien, node, button;
		var clickHandler = function ( e ) {
			e.preventDefault();
			if ( !$(e.currentTarget).hasClass('disabled') && api.page() != e.data.action ) {
				api.page( e.data.action ).draw( 'page' );
			}
		};

		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( Array.isArray( button ) ) {
				attach( container, button );
			}
			else {
				btnDisplay = '';
				btnClass = '';

				switch ( button ) {
					case 'ellipsis':
						btnDisplay = '&#x2026;';
						btnClass = 'disabled';
						break;

					case 'first':
						btnDisplay = lang.sFirst;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'previous':
						btnDisplay = lang.sPrevious;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'next':
						btnDisplay = lang.sNext;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					case 'last':
						btnDisplay = lang.sLast;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					default:
						btnDisplay = button + 1;
						btnClass = page === button ?
							'active' : '';
						break;
				}

				if ( btnDisplay ) {
					node = $('<li>', {
							'class': classes.sPageButton+' '+btnClass,
							'id': idx === 0 && typeof button === 'string' ?
								settings.sTableId +'_'+ button :
								null
						} )
						.append( $('<a>', {
								'href': '#',
								'aria-controls': settings.sTableId,
								'aria-label': aria[ button ],
								'data-dt-idx': counter,
								'tabindex': settings.iTabIndex,
								'class': 'page-link'
							} )
							.html( btnDisplay )
						)
						.appendTo( container );

					settings.oApi._fnBindAction(
						node, {action: button}, clickHandler
					);

					counter++;
				}
			}
		}
	};

	// IE9 throws an 'unknown error' if document.activeElement is used
	// inside an iframe or frame. 
	var activeEl;

	try {
		// Because this approach is destroying and recreating the paging
		// elements, focus is lost on the select button which is bad for
		// accessibility. So we want to restore focus once the draw has
		// completed
		activeEl = $(host).find(document.activeElement).data('dt-idx');
	}
	catch (e) {}

	attach(
		$(host).empty().html('<ul class="pagination"/>').children('ul'),
		buttons
	);

	if ( activeEl !== undefined ) {
		$(host).find( '[data-dt-idx='+activeEl+']' ).trigger('focus');
	}
};


return DataTable;
}));

"use strict";
var defaults = {
	"language": {
		"paginate": {
			"first": '<i class="ki ki-double-arrow-back"></i>',
			"last": '<i class="ki ki-double-arrow-next"></i>',
			"next": '<i class="ki ki-arrow-next"></i>',
			"previous": '<i class="ki ki-arrow-back"></i>'
		}
	}
};

if (KTUtil.isRTL()) {
	defaults = {
		"language": {
			"paginate": {
				"first": '<i class="ki ki-double-arrow-next"></i>',
				"last": '<i class="ki ki-double-arrow-back"></i>',
				"next": '<i class="ki ki-arrow-back"></i>',
				"previous": '<i class="ki ki-arrow-next"></i>'
			}
		}
	}
}

$.extend(true, $.fn.dataTable.defaults, defaults);

// fix dropdown overflow inside datatable
KTApp.initAbsoluteDropdown('.dataTables_wrapper');

/*!
 AutoFill 2.3.5
 ©2008-2020 SpryMedia Ltd - datatables.net/license
*/
(function(e){"function"===typeof define&&define.amd?define(["jquery","datatables.net"],function(g){return e(g,window,document)}):"object"===typeof exports?module.exports=function(g,i){g||(g=window);if(!i||!i.fn.dataTable)i=require("datatables.net")(g,i).$;return e(i,g,g.document)}:e(jQuery,window,document)})(function(e,g,i,r){var l=e.fn.dataTable,t=0,k=function(b,c){if(!l.versionCheck||!l.versionCheck("1.10.8"))throw"Warning: AutoFill requires DataTables 1.10.8 or greater";this.c=e.extend(!0,{},l.defaults.autoFill,
k.defaults,c);this.s={dt:new l.Api(b),namespace:".autoFill"+t++,scroll:{},scrollInterval:null,handle:{height:0,width:0},enabled:!1};this.dom={handle:e('<div class="dt-autofill-handle"/>'),select:{top:e('<div class="dt-autofill-select top"/>'),right:e('<div class="dt-autofill-select right"/>'),bottom:e('<div class="dt-autofill-select bottom"/>'),left:e('<div class="dt-autofill-select left"/>')},background:e('<div class="dt-autofill-background"/>'),list:e('<div class="dt-autofill-list">'+this.s.dt.i18n("autoFill.info",
"")+"<ul/></div>"),dtScroll:null,offsetParent:null};this._constructor()};e.extend(k.prototype,{enabled:function(){return this.s.enabled},enable:function(b){var c=this;if(!1===b)return this.disable();this.s.enabled=!0;this._focusListener();this.dom.handle.on("mousedown",function(a){c._mousedown(a);return!1});return this},disable:function(){this.s.enabled=!1;this._focusListenerRemove();return this},_constructor:function(){var b=this,c=this.s.dt,a=e("div.dataTables_scrollBody",this.s.dt.table().container());
c.settings()[0].autoFill=this;a.length&&(this.dom.dtScroll=a,"static"===a.css("position")&&a.css("position","relative"));!1!==this.c.enable&&this.enable();c.on("destroy.autoFill",function(){b._focusListenerRemove()})},_attach:function(b){var c=this.s.dt,a=c.cell(b).index(),d=this.dom.handle,f=this.s.handle;if(!a||-1===c.columns(this.c.columns).indexes().indexOf(a.column))this._detach();else{this.dom.offsetParent||(this.dom.offsetParent=e(c.table().node()).offsetParent());if(!f.height||!f.width)d.appendTo("body"),
f.height=d.outerHeight(),f.width=d.outerWidth();c=this._getPosition(b,this.dom.offsetParent);this.dom.attachedTo=b;d.css({top:c.top+b.offsetHeight-f.height,left:c.left+b.offsetWidth-f.width}).appendTo(this.dom.offsetParent)}},_actionSelector:function(b){var c=this,a=this.s.dt,d=k.actions,f=[];e.each(d,function(c,d){d.available(a,b)&&f.push(c)});if(1===f.length&&!1===this.c.alwaysAsk){var j=d[f[0]].execute(a,b);this._update(j,b)}else if(1<f.length){var h=this.dom.list.children("ul").empty();f.push("cancel");
e.each(f,function(f,j){h.append(e("<li/>").append('<div class="dt-autofill-question">'+d[j].option(a,b)+"<div>").append(e('<div class="dt-autofill-button">').append(e('<button class="'+k.classes.btn+'">'+a.i18n("autoFill.button","&gt;")+"</button>").on("click",function(){var f=d[j].execute(a,b,e(this).closest("li"));c._update(f,b);c.dom.background.remove();c.dom.list.remove()}))))});this.dom.background.appendTo("body");this.dom.list.appendTo("body");this.dom.list.css("margin-top",-1*(this.dom.list.outerHeight()/
2))}},_detach:function(){this.dom.attachedTo=null;this.dom.handle.detach()},_drawSelection:function(b){var c=this.s.dt,a=this.s.start,d=e(this.dom.start),f={row:this.c.vertical?c.rows({page:"current"}).nodes().indexOf(b.parentNode):a.row,column:this.c.horizontal?e(b).index():a.column},b=c.column.index("toData",f.column),j=c.row(":eq("+f.row+")",{page:"current"}),j=e(c.cell(j.index(),b).node());if(c.cell(j).any()&&-1!==c.columns(this.c.columns).indexes().indexOf(b)){this.s.end=f;var h,c=a.row<f.row?
d:j;h=a.row<f.row?j:d;b=a.column<f.column?d:j;d=a.column<f.column?j:d;c=this._getPosition(c.get(0)).top;b=this._getPosition(b.get(0)).left;a=this._getPosition(h.get(0)).top+h.outerHeight()-c;d=this._getPosition(d.get(0)).left+d.outerWidth()-b;f=this.dom.select;f.top.css({top:c,left:b,width:d});f.left.css({top:c,left:b,height:a});f.bottom.css({top:c+a,left:b,width:d});f.right.css({top:c,left:b+d,height:a})}},_editor:function(b){var c=this.s.dt,a=this.c.editor;if(a){for(var d={},f=[],e=a.fields(),h=
0,i=b.length;h<i;h++)for(var p=0,k=b[h].length;p<k;p++){var n=b[h][p],g=c.settings()[0].aoColumns[n.index.column],o=g.editField;if(o===r)for(var g=g.mData,q=0,l=e.length;q<l;q++){var s=a.field(e[q]);if(s.dataSrc()===g){o=s.name();break}}if(!o)throw"Could not automatically determine field data. Please see https://datatables.net/tn/11";d[o]||(d[o]={});g=c.row(n.index.row).id();d[o][g]=n.set;f.push(n.index)}a.bubble(f,!1).multiSet(d).submit()}},_emitEvent:function(b,c){this.s.dt.iterator("table",function(a){e(a.nTable).triggerHandler(b+
".dt",c)})},_focusListener:function(){var b=this,c=this.s.dt,a=this.s.namespace,d=null!==this.c.focus?this.c.focus:c.init().keys||c.settings()[0].keytable?"focus":"hover";if("focus"===d)c.on("key-focus.autoFill",function(a,c,d){b._attach(d.node())}).on("key-blur.autoFill",function(){b._detach()});else if("click"===d)e(c.table().body()).on("click"+a,"td, th",function(){b._attach(this)}),e(i.body).on("click"+a,function(a){e(a.target).parents().filter(c.table().body()).length||b._detach()});else e(c.table().body()).on("mouseenter"+
a,"td, th",function(){b._attach(this)}).on("mouseleave"+a,function(a){e(a.relatedTarget).hasClass("dt-autofill-handle")||b._detach()})},_focusListenerRemove:function(){var b=this.s.dt;b.off(".autoFill");e(b.table().body()).off(this.s.namespace);e(i.body).off(this.s.namespace)},_getPosition:function(b,c){var a=b,d,f=0,j=0;c||(c=e(e(this.s.dt.table().node())[0].offsetParent));do{var h=a.offsetTop,i=a.offsetLeft;d=e(a.offsetParent);f+=h+1*parseInt(d.css("border-top-width"));j+=i+1*parseInt(d.css("border-left-width"));
if("body"===a.nodeName.toLowerCase())break;a=d.get(0)}while(d.get(0)!==c.get(0));return{top:f,left:j}},_mousedown:function(b){var c=this,a=this.s.dt;this.dom.start=this.dom.attachedTo;this.s.start={row:a.rows({page:"current"}).nodes().indexOf(e(this.dom.start).parent()[0]),column:e(this.dom.start).index()};e(i.body).on("mousemove.autoFill",function(a){c._mousemove(a)}).on("mouseup.autoFill",function(a){c._mouseup(a)});var d=this.dom.select,a=e(a.table().node()).offsetParent();d.top.appendTo(a);d.left.appendTo(a);
d.right.appendTo(a);d.bottom.appendTo(a);this._drawSelection(this.dom.start,b);this.dom.handle.css("display","none");b=this.dom.dtScroll;this.s.scroll={windowHeight:e(g).height(),windowWidth:e(g).width(),dtTop:b?b.offset().top:null,dtLeft:b?b.offset().left:null,dtHeight:b?b.outerHeight():null,dtWidth:b?b.outerWidth():null}},_mousemove:function(b){var c=b.target.nodeName.toLowerCase();"td"!==c&&"th"!==c||(this._drawSelection(b.target,b),this._shiftScroll(b))},_mouseup:function(b){e(i.body).off(".autoFill");
var c=this,a=this.s.dt,d=this.dom.select;d.top.remove();d.left.remove();d.right.remove();d.bottom.remove();this.dom.handle.css("display","block");var d=this.s.start,f=this.s.end;if(!(d.row===f.row&&d.column===f.column)){var j=a.cell(":eq("+d.row+")",d.column+":visible",{page:"current"});if(e("div.DTE",j.node()).length){var h=a.editor();h.on("submitSuccess.dtaf close.dtaf",function(){h.off(".dtaf");setTimeout(function(){c._mouseup(b)},100)}).on("submitComplete.dtaf preSubmitCancelled.dtaf close.dtaf",
function(){h.off(".dtaf")});h.submit()}else{for(var g=this._range(d.row,f.row),d=this._range(d.column,f.column),f=[],k=a.settings()[0],l=k.aoColumns,n=a.columns(this.c.columns).indexes(),m=0;m<g.length;m++)f.push(e.map(d,function(b){var c=a.row(":eq("+g[m]+")",{page:"current"}),b=a.cell(c.index(),b+":visible"),c=b.data(),d=b.index(),f=l[d.column].editField;f!==r&&(c=k.oApi._fnGetObjectDataFn(f)(a.row(d.row).data()));if(-1!==n.indexOf(d.column))return{cell:b,data:c,label:b.data(),index:d}}));this._actionSelector(f);
clearInterval(this.s.scrollInterval);this.s.scrollInterval=null}}},_range:function(b,c){var a=[],d;if(b<=c)for(d=b;d<=c;d++)a.push(d);else for(d=b;d>=c;d--)a.push(d);return a},_shiftScroll:function(b){var c=this,a=this.s.scroll,d=!1,f=b.pageY-i.body.scrollTop,e=b.pageX-i.body.scrollLeft,h,g,k,l;65>f?h=-5:f>a.windowHeight-65&&(h=5);65>e?g=-5:e>a.windowWidth-65&&(g=5);null!==a.dtTop&&b.pageY<a.dtTop+65?k=-5:null!==a.dtTop&&b.pageY>a.dtTop+a.dtHeight-65&&(k=5);null!==a.dtLeft&&b.pageX<a.dtLeft+65?l=
-5:null!==a.dtLeft&&b.pageX>a.dtLeft+a.dtWidth-65&&(l=5);h||g||k||l?(a.windowVert=h,a.windowHoriz=g,a.dtVert=k,a.dtHoriz=l,d=!0):this.s.scrollInterval&&(clearInterval(this.s.scrollInterval),this.s.scrollInterval=null);!this.s.scrollInterval&&d&&(this.s.scrollInterval=setInterval(function(){if(a.windowVert)i.body.scrollTop=i.body.scrollTop+a.windowVert;if(a.windowHoriz)i.body.scrollLeft=i.body.scrollLeft+a.windowHoriz;if(a.dtVert||a.dtHoriz){var b=c.dom.dtScroll[0];if(a.dtVert)b.scrollTop=b.scrollTop+
a.dtVert;if(a.dtHoriz)b.scrollLeft=b.scrollLeft+a.dtHoriz}},20))},_update:function(b,c){if(!1!==b){var a=this.s.dt,d,f=a.columns(this.c.columns).indexes();this._emitEvent("preAutoFill",[a,c]);this._editor(c);if(null!==this.c.update?this.c.update:!this.c.editor){for(var e=0,h=c.length;e<h;e++)for(var g=0,i=c[e].length;g<i;g++)d=c[e][g],-1!==f.indexOf(d.index.column)&&d.cell.data(d.set);a.draw(!1)}this._emitEvent("autoFill",[a,c])}}});k.actions={increment:{available:function(b,c){var a=c[0][0].label;
return!isNaN(a-parseFloat(a))},option:function(b){return b.i18n("autoFill.increment",'Increment / decrement each cell by: <input type="number" value="1">')},execute:function(b,c,a){for(var b=1*c[0][0].data,a=1*e("input",a).val(),d=0,f=c.length;d<f;d++)for(var j=0,g=c[d].length;j<g;j++)c[d][j].set=b,b+=a}},fill:{available:function(){return!0},option:function(b,c){return b.i18n("autoFill.fill","Fill all cells with <i>"+c[0][0].label+"</i>")},execute:function(b,c){for(var a=c[0][0].data,d=0,f=c.length;d<
f;d++)for(var e=0,g=c[d].length;e<g;e++)c[d][e].set=a}},fillHorizontal:{available:function(b,c){return 1<c.length&&1<c[0].length},option:function(b){return b.i18n("autoFill.fillHorizontal","Fill cells horizontally")},execute:function(b,c){for(var a=0,d=c.length;a<d;a++)for(var f=0,e=c[a].length;f<e;f++)c[a][f].set=c[a][0].data}},fillVertical:{available:function(b,c){return 1<c.length},option:function(b){return b.i18n("autoFill.fillVertical","Fill cells vertically")},execute:function(b,c){for(var a=
0,d=c.length;a<d;a++)for(var e=0,g=c[a].length;e<g;e++)c[a][e].set=c[0][e].data}},cancel:{available:function(){return!1},option:function(b){return b.i18n("autoFill.cancel","Cancel")},execute:function(){return!1}}};k.version="2.3.5";k.defaults={alwaysAsk:!1,focus:null,columns:"",enable:!0,update:null,editor:null,vertical:!0,horizontal:!0};k.classes={btn:"btn"};var m=e.fn.dataTable.Api;m.register("autoFill()",function(){return this});m.register("autoFill().enabled()",function(){var b=this.context[0];
return b.autoFill?b.autoFill.enabled():!1});m.register("autoFill().enable()",function(b){return this.iterator("table",function(c){c.autoFill&&c.autoFill.enable(b)})});m.register("autoFill().disable()",function(){return this.iterator("table",function(b){b.autoFill&&b.autoFill.disable()})});e(i).on("preInit.dt.autofill",function(b,c){if("dt"===b.namespace){var a=c.oInit.autoFill,d=l.defaults.autoFill;if(a||d)d=e.extend({},a,d),!1!==a&&new k(c,d)}});l.AutoFill=k;return l.AutoFill=k});

/*!
 Bootstrap integration for DataTables' AutoFill
 ©2015 SpryMedia Ltd - datatables.net/license
*/
(function(a){"function"===typeof define&&define.amd?define(["jquery","datatables.net-bs4","datatables.net-autofill"],function(b){return a(b,window,document)}):"object"===typeof exports?module.exports=function(b,c){b||(b=window);if(!c||!c.fn.dataTable)c=require("datatables.net-bs4")(b,c).$;c.fn.dataTable.AutoFill||require("datatables.net-autofill")(b,c);return a(c,b,b.document)}:a(jQuery,window,document)})(function(a){a=a.fn.dataTable;a.AutoFill.classes.btn="btn btn-primary";return a});

/*!

JSZip v3.5.0 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/master/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/master/LICENSE
*/

!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).JSZip=t()}}(function(){return function s(a,o,h){function u(r,t){if(!o[r]){if(!a[r]){var e="function"==typeof require&&require;if(!t&&e)return e(r,!0);if(l)return l(r,!0);var i=new Error("Cannot find module '"+r+"'");throw i.code="MODULE_NOT_FOUND",i}var n=o[r]={exports:{}};a[r][0].call(n.exports,function(t){var e=a[r][1][t];return u(e||t)},n,n.exports,s,a,o,h)}return o[r].exports}for(var l="function"==typeof require&&require,t=0;t<h.length;t++)u(h[t]);return u}({1:[function(t,e,r){"use strict";var c=t("./utils"),d=t("./support"),p="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";r.encode=function(t){for(var e,r,i,n,s,a,o,h=[],u=0,l=t.length,f=l,d="string"!==c.getTypeOf(t);u<t.length;)f=l-u,i=d?(e=t[u++],r=u<l?t[u++]:0,u<l?t[u++]:0):(e=t.charCodeAt(u++),r=u<l?t.charCodeAt(u++):0,u<l?t.charCodeAt(u++):0),n=e>>2,s=(3&e)<<4|r>>4,a=1<f?(15&r)<<2|i>>6:64,o=2<f?63&i:64,h.push(p.charAt(n)+p.charAt(s)+p.charAt(a)+p.charAt(o));return h.join("")},r.decode=function(t){var e,r,i,n,s,a,o=0,h=0,u="data:";if(t.substr(0,u.length)===u)throw new Error("Invalid base64 input, it looks like a data url.");var l,f=3*(t=t.replace(/[^A-Za-z0-9\+\/\=]/g,"")).length/4;if(t.charAt(t.length-1)===p.charAt(64)&&f--,t.charAt(t.length-2)===p.charAt(64)&&f--,f%1!=0)throw new Error("Invalid base64 input, bad content length.");for(l=d.uint8array?new Uint8Array(0|f):new Array(0|f);o<t.length;)e=p.indexOf(t.charAt(o++))<<2|(n=p.indexOf(t.charAt(o++)))>>4,r=(15&n)<<4|(s=p.indexOf(t.charAt(o++)))>>2,i=(3&s)<<6|(a=p.indexOf(t.charAt(o++))),l[h++]=e,64!==s&&(l[h++]=r),64!==a&&(l[h++]=i);return l}},{"./support":30,"./utils":32}],2:[function(t,e,r){"use strict";var i=t("./external"),n=t("./stream/DataWorker"),s=t("./stream/DataLengthProbe"),a=t("./stream/Crc32Probe");s=t("./stream/DataLengthProbe");function o(t,e,r,i,n){this.compressedSize=t,this.uncompressedSize=e,this.crc32=r,this.compression=i,this.compressedContent=n}o.prototype={getContentWorker:function(){var t=new n(i.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new s("data_length")),e=this;return t.on("end",function(){if(this.streamInfo.data_length!==e.uncompressedSize)throw new Error("Bug : uncompressed data size mismatch")}),t},getCompressedWorker:function(){return new n(i.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}},o.createWorkerFrom=function(t,e,r){return t.pipe(new a).pipe(new s("uncompressedSize")).pipe(e.compressWorker(r)).pipe(new s("compressedSize")).withStreamInfo("compression",e)},e.exports=o},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(t,e,r){"use strict";var i=t("./stream/GenericWorker");r.STORE={magic:"\0\0",compressWorker:function(t){return new i("STORE compression")},uncompressWorker:function(){return new i("STORE decompression")}},r.DEFLATE=t("./flate")},{"./flate":7,"./stream/GenericWorker":28}],4:[function(t,e,r){"use strict";var i=t("./utils");var o=function(){for(var t,e=[],r=0;r<256;r++){t=r;for(var i=0;i<8;i++)t=1&t?3988292384^t>>>1:t>>>1;e[r]=t}return e}();e.exports=function(t,e){return void 0!==t&&t.length?"string"!==i.getTypeOf(t)?function(t,e,r,i){var n=o,s=i+r;t^=-1;for(var a=i;a<s;a++)t=t>>>8^n[255&(t^e[a])];return-1^t}(0|e,t,t.length,0):function(t,e,r,i){var n=o,s=i+r;t^=-1;for(var a=i;a<s;a++)t=t>>>8^n[255&(t^e.charCodeAt(a))];return-1^t}(0|e,t,t.length,0):0}},{"./utils":32}],5:[function(t,e,r){"use strict";r.base64=!1,r.binary=!1,r.dir=!1,r.createFolders=!0,r.date=null,r.compression=null,r.compressionOptions=null,r.comment=null,r.unixPermissions=null,r.dosPermissions=null},{}],6:[function(t,e,r){"use strict";var i=null;i="undefined"!=typeof Promise?Promise:t("lie"),e.exports={Promise:i}},{lie:37}],7:[function(t,e,r){"use strict";var i="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array,n=t("pako"),s=t("./utils"),a=t("./stream/GenericWorker"),o=i?"uint8array":"array";function h(t,e){a.call(this,"FlateWorker/"+t),this._pako=null,this._pakoAction=t,this._pakoOptions=e,this.meta={}}r.magic="\b\0",s.inherits(h,a),h.prototype.processChunk=function(t){this.meta=t.meta,null===this._pako&&this._createPako(),this._pako.push(s.transformTo(o,t.data),!1)},h.prototype.flush=function(){a.prototype.flush.call(this),null===this._pako&&this._createPako(),this._pako.push([],!0)},h.prototype.cleanUp=function(){a.prototype.cleanUp.call(this),this._pako=null},h.prototype._createPako=function(){this._pako=new n[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var e=this;this._pako.onData=function(t){e.push({data:t,meta:e.meta})}},r.compressWorker=function(t){return new h("Deflate",t)},r.uncompressWorker=function(){return new h("Inflate",{})}},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(t,e,r){"use strict";function A(t,e){var r,i="";for(r=0;r<e;r++)i+=String.fromCharCode(255&t),t>>>=8;return i}function i(t,e,r,i,n,s){var a,o,h=t.file,u=t.compression,l=s!==O.utf8encode,f=I.transformTo("string",s(h.name)),d=I.transformTo("string",O.utf8encode(h.name)),c=h.comment,p=I.transformTo("string",s(c)),m=I.transformTo("string",O.utf8encode(c)),_=d.length!==h.name.length,g=m.length!==c.length,b="",v="",y="",w=h.dir,k=h.date,x={crc32:0,compressedSize:0,uncompressedSize:0};e&&!r||(x.crc32=t.crc32,x.compressedSize=t.compressedSize,x.uncompressedSize=t.uncompressedSize);var S=0;e&&(S|=8),l||!_&&!g||(S|=2048);var z=0,C=0;w&&(z|=16),"UNIX"===n?(C=798,z|=function(t,e){var r=t;return t||(r=e?16893:33204),(65535&r)<<16}(h.unixPermissions,w)):(C=20,z|=function(t){return 63&(t||0)}(h.dosPermissions)),a=k.getUTCHours(),a<<=6,a|=k.getUTCMinutes(),a<<=5,a|=k.getUTCSeconds()/2,o=k.getUTCFullYear()-1980,o<<=4,o|=k.getUTCMonth()+1,o<<=5,o|=k.getUTCDate(),_&&(v=A(1,1)+A(B(f),4)+d,b+="up"+A(v.length,2)+v),g&&(y=A(1,1)+A(B(p),4)+m,b+="uc"+A(y.length,2)+y);var E="";return E+="\n\0",E+=A(S,2),E+=u.magic,E+=A(a,2),E+=A(o,2),E+=A(x.crc32,4),E+=A(x.compressedSize,4),E+=A(x.uncompressedSize,4),E+=A(f.length,2),E+=A(b.length,2),{fileRecord:R.LOCAL_FILE_HEADER+E+f+b,dirRecord:R.CENTRAL_FILE_HEADER+A(C,2)+E+A(p.length,2)+"\0\0\0\0"+A(z,4)+A(i,4)+f+b+p}}var I=t("../utils"),n=t("../stream/GenericWorker"),O=t("../utf8"),B=t("../crc32"),R=t("../signature");function s(t,e,r,i){n.call(this,"ZipFileWorker"),this.bytesWritten=0,this.zipComment=e,this.zipPlatform=r,this.encodeFileName=i,this.streamFiles=t,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[]}I.inherits(s,n),s.prototype.push=function(t){var e=t.meta.percent||0,r=this.entriesCount,i=this._sources.length;this.accumulate?this.contentBuffer.push(t):(this.bytesWritten+=t.data.length,n.prototype.push.call(this,{data:t.data,meta:{currentFile:this.currentFile,percent:r?(e+100*(r-i-1))/r:100}}))},s.prototype.openedSource=function(t){this.currentSourceOffset=this.bytesWritten,this.currentFile=t.file.name;var e=this.streamFiles&&!t.file.dir;if(e){var r=i(t,e,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:r.fileRecord,meta:{percent:0}})}else this.accumulate=!0},s.prototype.closedSource=function(t){this.accumulate=!1;var e=this.streamFiles&&!t.file.dir,r=i(t,e,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(r.dirRecord),e)this.push({data:function(t){return R.DATA_DESCRIPTOR+A(t.crc32,4)+A(t.compressedSize,4)+A(t.uncompressedSize,4)}(t),meta:{percent:100}});else for(this.push({data:r.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null},s.prototype.flush=function(){for(var t=this.bytesWritten,e=0;e<this.dirRecords.length;e++)this.push({data:this.dirRecords[e],meta:{percent:100}});var r=this.bytesWritten-t,i=function(t,e,r,i,n){var s=I.transformTo("string",n(i));return R.CENTRAL_DIRECTORY_END+"\0\0\0\0"+A(t,2)+A(t,2)+A(e,4)+A(r,4)+A(s.length,2)+s}(this.dirRecords.length,r,t,this.zipComment,this.encodeFileName);this.push({data:i,meta:{percent:100}})},s.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume()},s.prototype.registerPrevious=function(t){this._sources.push(t);var e=this;return t.on("data",function(t){e.processChunk(t)}),t.on("end",function(){e.closedSource(e.previous.streamInfo),e._sources.length?e.prepareNextSource():e.end()}),t.on("error",function(t){e.error(t)}),this},s.prototype.resume=function(){return!!n.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},s.prototype.error=function(t){var e=this._sources;if(!n.prototype.error.call(this,t))return!1;for(var r=0;r<e.length;r++)try{e[r].error(t)}catch(t){}return!0},s.prototype.lock=function(){n.prototype.lock.call(this);for(var t=this._sources,e=0;e<t.length;e++)t[e].lock()},e.exports=s},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(t,e,r){"use strict";var u=t("../compressions"),i=t("./ZipFileWorker");r.generateWorker=function(t,a,e){var o=new i(a.streamFiles,e,a.platform,a.encodeFileName),h=0;try{t.forEach(function(t,e){h++;var r=function(t,e){var r=t||e,i=u[r];if(!i)throw new Error(r+" is not a valid compression method !");return i}(e.options.compression,a.compression),i=e.options.compressionOptions||a.compressionOptions||{},n=e.dir,s=e.date;e._compressWorker(r,i).withStreamInfo("file",{name:t,dir:n,date:s,comment:e.comment||"",unixPermissions:e.unixPermissions,dosPermissions:e.dosPermissions}).pipe(o)}),o.entriesCount=h}catch(t){o.error(t)}return o}},{"../compressions":3,"./ZipFileWorker":8}],10:[function(t,e,r){"use strict";function i(){if(!(this instanceof i))return new i;if(arguments.length)throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files={},this.comment=null,this.root="",this.clone=function(){var t=new i;for(var e in this)"function"!=typeof this[e]&&(t[e]=this[e]);return t}}(i.prototype=t("./object")).loadAsync=t("./load"),i.support=t("./support"),i.defaults=t("./defaults"),i.version="3.5.0",i.loadAsync=function(t,e){return(new i).loadAsync(t,e)},i.external=t("./external"),e.exports=i},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(t,e,r){"use strict";var i=t("./utils"),n=t("./external"),o=t("./utf8"),h=(i=t("./utils"),t("./zipEntries")),s=t("./stream/Crc32Probe"),u=t("./nodejsUtils");function l(i){return new n.Promise(function(t,e){var r=i.decompressed.getContentWorker().pipe(new s);r.on("error",function(t){e(t)}).on("end",function(){r.streamInfo.crc32!==i.decompressed.crc32?e(new Error("Corrupted zip : CRC32 mismatch")):t()}).resume()})}e.exports=function(t,s){var a=this;return s=i.extend(s||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:o.utf8decode}),u.isNode&&u.isStream(t)?n.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")):i.prepareContent("the loaded zip file",t,!0,s.optimizedBinaryString,s.base64).then(function(t){var e=new h(s);return e.load(t),e}).then(function(t){var e=[n.Promise.resolve(t)],r=t.files;if(s.checkCRC32)for(var i=0;i<r.length;i++)e.push(l(r[i]));return n.Promise.all(e)}).then(function(t){for(var e=t.shift(),r=e.files,i=0;i<r.length;i++){var n=r[i];a.file(n.fileNameStr,n.decompressed,{binary:!0,optimizedBinaryString:!0,date:n.date,dir:n.dir,comment:n.fileCommentStr.length?n.fileCommentStr:null,unixPermissions:n.unixPermissions,dosPermissions:n.dosPermissions,createFolders:s.createFolders})}return e.zipComment.length&&(a.comment=e.zipComment),a})}},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(t,e,r){"use strict";var i=t("../utils"),n=t("../stream/GenericWorker");function s(t,e){n.call(this,"Nodejs stream input adapter for "+t),this._upstreamEnded=!1,this._bindStream(e)}i.inherits(s,n),s.prototype._bindStream=function(t){var e=this;(this._stream=t).pause(),t.on("data",function(t){e.push({data:t,meta:{percent:0}})}).on("error",function(t){e.isPaused?this.generatedError=t:e.error(t)}).on("end",function(){e.isPaused?e._upstreamEnded=!0:e.end()})},s.prototype.pause=function(){return!!n.prototype.pause.call(this)&&(this._stream.pause(),!0)},s.prototype.resume=function(){return!!n.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},e.exports=s},{"../stream/GenericWorker":28,"../utils":32}],13:[function(t,e,r){"use strict";var n=t("readable-stream").Readable;function i(t,e,r){n.call(this,e),this._helper=t;var i=this;t.on("data",function(t,e){i.push(t)||i._helper.pause(),r&&r(e)}).on("error",function(t){i.emit("error",t)}).on("end",function(){i.push(null)})}t("../utils").inherits(i,n),i.prototype._read=function(){this._helper.resume()},e.exports=i},{"../utils":32,"readable-stream":16}],14:[function(t,e,r){"use strict";e.exports={isNode:"undefined"!=typeof Buffer,newBufferFrom:function(t,e){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(t,e);if("number"==typeof t)throw new Error('The "data" argument must not be a number');return new Buffer(t,e)},allocBuffer:function(t){if(Buffer.alloc)return Buffer.alloc(t);var e=new Buffer(t);return e.fill(0),e},isBuffer:function(t){return Buffer.isBuffer(t)},isStream:function(t){return t&&"function"==typeof t.on&&"function"==typeof t.pause&&"function"==typeof t.resume}}},{}],15:[function(t,e,r){"use strict";function s(t,e,r){var i,n=u.getTypeOf(e),s=u.extend(r||{},f);s.date=s.date||new Date,null!==s.compression&&(s.compression=s.compression.toUpperCase()),"string"==typeof s.unixPermissions&&(s.unixPermissions=parseInt(s.unixPermissions,8)),s.unixPermissions&&16384&s.unixPermissions&&(s.dir=!0),s.dosPermissions&&16&s.dosPermissions&&(s.dir=!0),s.dir&&(t=g(t)),s.createFolders&&(i=_(t))&&b.call(this,i,!0);var a="string"===n&&!1===s.binary&&!1===s.base64;r&&void 0!==r.binary||(s.binary=!a),(e instanceof d&&0===e.uncompressedSize||s.dir||!e||0===e.length)&&(s.base64=!1,s.binary=!0,e="",s.compression="STORE",n="string");var o=null;o=e instanceof d||e instanceof l?e:p.isNode&&p.isStream(e)?new m(t,e):u.prepareContent(t,e,s.binary,s.optimizedBinaryString,s.base64);var h=new c(t,o,s);this.files[t]=h}var n=t("./utf8"),u=t("./utils"),l=t("./stream/GenericWorker"),a=t("./stream/StreamHelper"),f=t("./defaults"),d=t("./compressedObject"),c=t("./zipObject"),o=t("./generate"),p=t("./nodejsUtils"),m=t("./nodejs/NodejsStreamInputAdapter"),_=function(t){"/"===t.slice(-1)&&(t=t.substring(0,t.length-1));var e=t.lastIndexOf("/");return 0<e?t.substring(0,e):""},g=function(t){return"/"!==t.slice(-1)&&(t+="/"),t},b=function(t,e){return e=void 0!==e?e:f.createFolders,t=g(t),this.files[t]||s.call(this,t,null,{dir:!0,createFolders:e}),this.files[t]};function h(t){return"[object RegExp]"===Object.prototype.toString.call(t)}var i={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(t){var e,r,i;for(e in this.files)this.files.hasOwnProperty(e)&&(i=this.files[e],(r=e.slice(this.root.length,e.length))&&e.slice(0,this.root.length)===this.root&&t(r,i))},filter:function(r){var i=[];return this.forEach(function(t,e){r(t,e)&&i.push(e)}),i},file:function(t,e,r){if(1!==arguments.length)return t=this.root+t,s.call(this,t,e,r),this;if(h(t)){var i=t;return this.filter(function(t,e){return!e.dir&&i.test(t)})}var n=this.files[this.root+t];return n&&!n.dir?n:null},folder:function(r){if(!r)return this;if(h(r))return this.filter(function(t,e){return e.dir&&r.test(t)});var t=this.root+r,e=b.call(this,t),i=this.clone();return i.root=e.name,i},remove:function(r){r=this.root+r;var t=this.files[r];if(t||("/"!==r.slice(-1)&&(r+="/"),t=this.files[r]),t&&!t.dir)delete this.files[r];else for(var e=this.filter(function(t,e){return e.name.slice(0,r.length)===r}),i=0;i<e.length;i++)delete this.files[e[i].name];return this},generate:function(t){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(t){var e,r={};try{if((r=u.extend(t||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:n.utf8encode})).type=r.type.toLowerCase(),r.compression=r.compression.toUpperCase(),"binarystring"===r.type&&(r.type="string"),!r.type)throw new Error("No output type specified.");u.checkSupport(r.type),"darwin"!==r.platform&&"freebsd"!==r.platform&&"linux"!==r.platform&&"sunos"!==r.platform||(r.platform="UNIX"),"win32"===r.platform&&(r.platform="DOS");var i=r.comment||this.comment||"";e=o.generateWorker(this,r,i)}catch(t){(e=new l("error")).error(t)}return new a(e,r.type||"string",r.mimeType)},generateAsync:function(t,e){return this.generateInternalStream(t).accumulate(e)},generateNodeStream:function(t,e){return(t=t||{}).type||(t.type="nodebuffer"),this.generateInternalStream(t).toNodejsStream(e)}};e.exports=i},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(t,e,r){e.exports=t("stream")},{stream:void 0}],17:[function(t,e,r){"use strict";var i=t("./DataReader");function n(t){i.call(this,t);for(var e=0;e<this.data.length;e++)t[e]=255&t[e]}t("../utils").inherits(n,i),n.prototype.byteAt=function(t){return this.data[this.zero+t]},n.prototype.lastIndexOfSignature=function(t){for(var e=t.charCodeAt(0),r=t.charCodeAt(1),i=t.charCodeAt(2),n=t.charCodeAt(3),s=this.length-4;0<=s;--s)if(this.data[s]===e&&this.data[s+1]===r&&this.data[s+2]===i&&this.data[s+3]===n)return s-this.zero;return-1},n.prototype.readAndCheckSignature=function(t){var e=t.charCodeAt(0),r=t.charCodeAt(1),i=t.charCodeAt(2),n=t.charCodeAt(3),s=this.readData(4);return e===s[0]&&r===s[1]&&i===s[2]&&n===s[3]},n.prototype.readData=function(t){if(this.checkOffset(t),0===t)return[];var e=this.data.slice(this.zero+this.index,this.zero+this.index+t);return this.index+=t,e},e.exports=n},{"../utils":32,"./DataReader":18}],18:[function(t,e,r){"use strict";var i=t("../utils");function n(t){this.data=t,this.length=t.length,this.index=0,this.zero=0}n.prototype={checkOffset:function(t){this.checkIndex(this.index+t)},checkIndex:function(t){if(this.length<this.zero+t||t<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+t+"). Corrupted zip ?")},setIndex:function(t){this.checkIndex(t),this.index=t},skip:function(t){this.setIndex(this.index+t)},byteAt:function(t){},readInt:function(t){var e,r=0;for(this.checkOffset(t),e=this.index+t-1;e>=this.index;e--)r=(r<<8)+this.byteAt(e);return this.index+=t,r},readString:function(t){return i.transformTo("string",this.readData(t))},readData:function(t){},lastIndexOfSignature:function(t){},readAndCheckSignature:function(t){},readDate:function(){var t=this.readInt(4);return new Date(Date.UTC(1980+(t>>25&127),(t>>21&15)-1,t>>16&31,t>>11&31,t>>5&63,(31&t)<<1))}},e.exports=n},{"../utils":32}],19:[function(t,e,r){"use strict";var i=t("./Uint8ArrayReader");function n(t){i.call(this,t)}t("../utils").inherits(n,i),n.prototype.readData=function(t){this.checkOffset(t);var e=this.data.slice(this.zero+this.index,this.zero+this.index+t);return this.index+=t,e},e.exports=n},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(t,e,r){"use strict";var i=t("./DataReader");function n(t){i.call(this,t)}t("../utils").inherits(n,i),n.prototype.byteAt=function(t){return this.data.charCodeAt(this.zero+t)},n.prototype.lastIndexOfSignature=function(t){return this.data.lastIndexOf(t)-this.zero},n.prototype.readAndCheckSignature=function(t){return t===this.readData(4)},n.prototype.readData=function(t){this.checkOffset(t);var e=this.data.slice(this.zero+this.index,this.zero+this.index+t);return this.index+=t,e},e.exports=n},{"../utils":32,"./DataReader":18}],21:[function(t,e,r){"use strict";var i=t("./ArrayReader");function n(t){i.call(this,t)}t("../utils").inherits(n,i),n.prototype.readData=function(t){if(this.checkOffset(t),0===t)return new Uint8Array(0);var e=this.data.subarray(this.zero+this.index,this.zero+this.index+t);return this.index+=t,e},e.exports=n},{"../utils":32,"./ArrayReader":17}],22:[function(t,e,r){"use strict";var i=t("../utils"),n=t("../support"),s=t("./ArrayReader"),a=t("./StringReader"),o=t("./NodeBufferReader"),h=t("./Uint8ArrayReader");e.exports=function(t){var e=i.getTypeOf(t);return i.checkSupport(e),"string"!==e||n.uint8array?"nodebuffer"===e?new o(t):n.uint8array?new h(i.transformTo("uint8array",t)):new s(i.transformTo("array",t)):new a(t)}},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(t,e,r){"use strict";r.LOCAL_FILE_HEADER="PK",r.CENTRAL_FILE_HEADER="PK",r.CENTRAL_DIRECTORY_END="PK",r.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK",r.ZIP64_CENTRAL_DIRECTORY_END="PK",r.DATA_DESCRIPTOR="PK\b"},{}],24:[function(t,e,r){"use strict";var i=t("./GenericWorker"),n=t("../utils");function s(t){i.call(this,"ConvertWorker to "+t),this.destType=t}n.inherits(s,i),s.prototype.processChunk=function(t){this.push({data:n.transformTo(this.destType,t.data),meta:t.meta})},e.exports=s},{"../utils":32,"./GenericWorker":28}],25:[function(t,e,r){"use strict";var i=t("./GenericWorker"),n=t("../crc32");function s(){i.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0)}t("../utils").inherits(s,i),s.prototype.processChunk=function(t){this.streamInfo.crc32=n(t.data,this.streamInfo.crc32||0),this.push(t)},e.exports=s},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(t,e,r){"use strict";var i=t("../utils"),n=t("./GenericWorker");function s(t){n.call(this,"DataLengthProbe for "+t),this.propName=t,this.withStreamInfo(t,0)}i.inherits(s,n),s.prototype.processChunk=function(t){if(t){var e=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=e+t.data.length}n.prototype.processChunk.call(this,t)},e.exports=s},{"../utils":32,"./GenericWorker":28}],27:[function(t,e,r){"use strict";var i=t("../utils"),n=t("./GenericWorker");function s(t){n.call(this,"DataWorker");var e=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type="",this._tickScheduled=!1,t.then(function(t){e.dataIsReady=!0,e.data=t,e.max=t&&t.length||0,e.type=i.getTypeOf(t),e.isPaused||e._tickAndRepeat()},function(t){e.error(t)})}i.inherits(s,n),s.prototype.cleanUp=function(){n.prototype.cleanUp.call(this),this.data=null},s.prototype.resume=function(){return!!n.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,i.delay(this._tickAndRepeat,[],this)),!0)},s.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(i.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0))},s.prototype._tick=function(){if(this.isPaused||this.isFinished)return!1;var t=null,e=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case"string":t=this.data.substring(this.index,e);break;case"uint8array":t=this.data.subarray(this.index,e);break;case"array":case"nodebuffer":t=this.data.slice(this.index,e)}return this.index=e,this.push({data:t,meta:{percent:this.max?this.index/this.max*100:0}})},e.exports=s},{"../utils":32,"./GenericWorker":28}],28:[function(t,e,r){"use strict";function i(t){this.name=t||"default",this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null}i.prototype={push:function(t){this.emit("data",t)},end:function(){if(this.isFinished)return!1;this.flush();try{this.emit("end"),this.cleanUp(),this.isFinished=!0}catch(t){this.emit("error",t)}return!0},error:function(t){return!this.isFinished&&(this.isPaused?this.generatedError=t:(this.isFinished=!0,this.emit("error",t),this.previous&&this.previous.error(t),this.cleanUp()),!0)},on:function(t,e){return this._listeners[t].push(e),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[]},emit:function(t,e){if(this._listeners[t])for(var r=0;r<this._listeners[t].length;r++)this._listeners[t][r].call(this,e)},pipe:function(t){return t.registerPrevious(this)},registerPrevious:function(t){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.streamInfo=t.streamInfo,this.mergeStreamInfo(),this.previous=t;var e=this;return t.on("data",function(t){e.processChunk(t)}),t.on("end",function(){e.end()}),t.on("error",function(t){e.error(t)}),this},pause:function(){return!this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return!1;var t=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),t=!0),this.previous&&this.previous.resume(),!t},flush:function(){},processChunk:function(t){this.push(t)},withStreamInfo:function(t,e){return this.extraStreamInfo[t]=e,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var t in this.extraStreamInfo)this.extraStreamInfo.hasOwnProperty(t)&&(this.streamInfo[t]=this.extraStreamInfo[t])},lock:function(){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.isLocked=!0,this.previous&&this.previous.lock()},toString:function(){var t="Worker "+this.name;return this.previous?this.previous+" -> "+t:t}},e.exports=i},{}],29:[function(t,e,r){"use strict";var h=t("../utils"),n=t("./ConvertWorker"),s=t("./GenericWorker"),u=t("../base64"),i=t("../support"),a=t("../external"),o=null;if(i.nodestream)try{o=t("../nodejs/NodejsStreamOutputAdapter")}catch(t){}function l(t,o){return new a.Promise(function(e,r){var i=[],n=t._internalType,s=t._outputType,a=t._mimeType;t.on("data",function(t,e){i.push(t),o&&o(e)}).on("error",function(t){i=[],r(t)}).on("end",function(){try{var t=function(t,e,r){switch(t){case"blob":return h.newBlob(h.transformTo("arraybuffer",e),r);case"base64":return u.encode(e);default:return h.transformTo(t,e)}}(s,function(t,e){var r,i=0,n=null,s=0;for(r=0;r<e.length;r++)s+=e[r].length;switch(t){case"string":return e.join("");case"array":return Array.prototype.concat.apply([],e);case"uint8array":for(n=new Uint8Array(s),r=0;r<e.length;r++)n.set(e[r],i),i+=e[r].length;return n;case"nodebuffer":return Buffer.concat(e);default:throw new Error("concat : unsupported type '"+t+"'")}}(n,i),a);e(t)}catch(t){r(t)}i=[]}).resume()})}function f(t,e,r){var i=e;switch(e){case"blob":case"arraybuffer":i="uint8array";break;case"base64":i="string"}try{this._internalType=i,this._outputType=e,this._mimeType=r,h.checkSupport(i),this._worker=t.pipe(new n(i)),t.lock()}catch(t){this._worker=new s("error"),this._worker.error(t)}}f.prototype={accumulate:function(t){return l(this,t)},on:function(t,e){var r=this;return"data"===t?this._worker.on(t,function(t){e.call(r,t.data,t.meta)}):this._worker.on(t,function(){h.delay(e,arguments,r)}),this},resume:function(){return h.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(t){if(h.checkSupport("nodestream"),"nodebuffer"!==this._outputType)throw new Error(this._outputType+" is not supported by this method");return new o(this,{objectMode:"nodebuffer"!==this._outputType},t)}},e.exports=f},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(t,e,r){"use strict";if(r.base64=!0,r.array=!0,r.string=!0,r.arraybuffer="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array,r.nodebuffer="undefined"!=typeof Buffer,r.uint8array="undefined"!=typeof Uint8Array,"undefined"==typeof ArrayBuffer)r.blob=!1;else{var i=new ArrayBuffer(0);try{r.blob=0===new Blob([i],{type:"application/zip"}).size}catch(t){try{var n=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);n.append(i),r.blob=0===n.getBlob("application/zip").size}catch(t){r.blob=!1}}}try{r.nodestream=!!t("readable-stream").Readable}catch(t){r.nodestream=!1}},{"readable-stream":16}],31:[function(t,e,s){"use strict";for(var o=t("./utils"),h=t("./support"),r=t("./nodejsUtils"),i=t("./stream/GenericWorker"),u=new Array(256),n=0;n<256;n++)u[n]=252<=n?6:248<=n?5:240<=n?4:224<=n?3:192<=n?2:1;u[254]=u[254]=1;function a(){i.call(this,"utf-8 decode"),this.leftOver=null}function l(){i.call(this,"utf-8 encode")}s.utf8encode=function(t){return h.nodebuffer?r.newBufferFrom(t,"utf-8"):function(t){var e,r,i,n,s,a=t.length,o=0;for(n=0;n<a;n++)55296==(64512&(r=t.charCodeAt(n)))&&n+1<a&&56320==(64512&(i=t.charCodeAt(n+1)))&&(r=65536+(r-55296<<10)+(i-56320),n++),o+=r<128?1:r<2048?2:r<65536?3:4;for(e=h.uint8array?new Uint8Array(o):new Array(o),n=s=0;s<o;n++)55296==(64512&(r=t.charCodeAt(n)))&&n+1<a&&56320==(64512&(i=t.charCodeAt(n+1)))&&(r=65536+(r-55296<<10)+(i-56320),n++),r<128?e[s++]=r:(r<2048?e[s++]=192|r>>>6:(r<65536?e[s++]=224|r>>>12:(e[s++]=240|r>>>18,e[s++]=128|r>>>12&63),e[s++]=128|r>>>6&63),e[s++]=128|63&r);return e}(t)},s.utf8decode=function(t){return h.nodebuffer?o.transformTo("nodebuffer",t).toString("utf-8"):function(t){var e,r,i,n,s=t.length,a=new Array(2*s);for(e=r=0;e<s;)if((i=t[e++])<128)a[r++]=i;else if(4<(n=u[i]))a[r++]=65533,e+=n-1;else{for(i&=2===n?31:3===n?15:7;1<n&&e<s;)i=i<<6|63&t[e++],n--;1<n?a[r++]=65533:i<65536?a[r++]=i:(i-=65536,a[r++]=55296|i>>10&1023,a[r++]=56320|1023&i)}return a.length!==r&&(a.subarray?a=a.subarray(0,r):a.length=r),o.applyFromCharCode(a)}(t=o.transformTo(h.uint8array?"uint8array":"array",t))},o.inherits(a,i),a.prototype.processChunk=function(t){var e=o.transformTo(h.uint8array?"uint8array":"array",t.data);if(this.leftOver&&this.leftOver.length){if(h.uint8array){var r=e;(e=new Uint8Array(r.length+this.leftOver.length)).set(this.leftOver,0),e.set(r,this.leftOver.length)}else e=this.leftOver.concat(e);this.leftOver=null}var i=function(t,e){var r;for((e=e||t.length)>t.length&&(e=t.length),r=e-1;0<=r&&128==(192&t[r]);)r--;return r<0?e:0===r?e:r+u[t[r]]>e?r:e}(e),n=e;i!==e.length&&(h.uint8array?(n=e.subarray(0,i),this.leftOver=e.subarray(i,e.length)):(n=e.slice(0,i),this.leftOver=e.slice(i,e.length))),this.push({data:s.utf8decode(n),meta:t.meta})},a.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:s.utf8decode(this.leftOver),meta:{}}),this.leftOver=null)},s.Utf8DecodeWorker=a,o.inherits(l,i),l.prototype.processChunk=function(t){this.push({data:s.utf8encode(t.data),meta:t.meta})},s.Utf8EncodeWorker=l},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(t,e,a){"use strict";var o=t("./support"),h=t("./base64"),r=t("./nodejsUtils"),i=t("set-immediate-shim"),u=t("./external");function n(t){return t}function l(t,e){for(var r=0;r<t.length;++r)e[r]=255&t.charCodeAt(r);return e}a.newBlob=function(e,r){a.checkSupport("blob");try{return new Blob([e],{type:r})}catch(t){try{var i=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return i.append(e),i.getBlob(r)}catch(t){throw new Error("Bug : can't construct the Blob.")}}};var s={stringifyByChunk:function(t,e,r){var i=[],n=0,s=t.length;if(s<=r)return String.fromCharCode.apply(null,t);for(;n<s;)"array"===e||"nodebuffer"===e?i.push(String.fromCharCode.apply(null,t.slice(n,Math.min(n+r,s)))):i.push(String.fromCharCode.apply(null,t.subarray(n,Math.min(n+r,s)))),n+=r;return i.join("")},stringifyByChar:function(t){for(var e="",r=0;r<t.length;r++)e+=String.fromCharCode(t[r]);return e},applyCanBeUsed:{uint8array:function(){try{return o.uint8array&&1===String.fromCharCode.apply(null,new Uint8Array(1)).length}catch(t){return!1}}(),nodebuffer:function(){try{return o.nodebuffer&&1===String.fromCharCode.apply(null,r.allocBuffer(1)).length}catch(t){return!1}}()}};function f(t){var e=65536,r=a.getTypeOf(t),i=!0;if("uint8array"===r?i=s.applyCanBeUsed.uint8array:"nodebuffer"===r&&(i=s.applyCanBeUsed.nodebuffer),i)for(;1<e;)try{return s.stringifyByChunk(t,r,e)}catch(t){e=Math.floor(e/2)}return s.stringifyByChar(t)}function d(t,e){for(var r=0;r<t.length;r++)e[r]=t[r];return e}a.applyFromCharCode=f;var c={};c.string={string:n,array:function(t){return l(t,new Array(t.length))},arraybuffer:function(t){return c.string.uint8array(t).buffer},uint8array:function(t){return l(t,new Uint8Array(t.length))},nodebuffer:function(t){return l(t,r.allocBuffer(t.length))}},c.array={string:f,array:n,arraybuffer:function(t){return new Uint8Array(t).buffer},uint8array:function(t){return new Uint8Array(t)},nodebuffer:function(t){return r.newBufferFrom(t)}},c.arraybuffer={string:function(t){return f(new Uint8Array(t))},array:function(t){return d(new Uint8Array(t),new Array(t.byteLength))},arraybuffer:n,uint8array:function(t){return new Uint8Array(t)},nodebuffer:function(t){return r.newBufferFrom(new Uint8Array(t))}},c.uint8array={string:f,array:function(t){return d(t,new Array(t.length))},arraybuffer:function(t){return t.buffer},uint8array:n,nodebuffer:function(t){return r.newBufferFrom(t)}},c.nodebuffer={string:f,array:function(t){return d(t,new Array(t.length))},arraybuffer:function(t){return c.nodebuffer.uint8array(t).buffer},uint8array:function(t){return d(t,new Uint8Array(t.length))},nodebuffer:n},a.transformTo=function(t,e){if(e=e||"",!t)return e;a.checkSupport(t);var r=a.getTypeOf(e);return c[r][t](e)},a.getTypeOf=function(t){return"string"==typeof t?"string":"[object Array]"===Object.prototype.toString.call(t)?"array":o.nodebuffer&&r.isBuffer(t)?"nodebuffer":o.uint8array&&t instanceof Uint8Array?"uint8array":o.arraybuffer&&t instanceof ArrayBuffer?"arraybuffer":void 0},a.checkSupport=function(t){if(!o[t.toLowerCase()])throw new Error(t+" is not supported by this platform")},a.MAX_VALUE_16BITS=65535,a.MAX_VALUE_32BITS=-1,a.pretty=function(t){var e,r,i="";for(r=0;r<(t||"").length;r++)i+="\\x"+((e=t.charCodeAt(r))<16?"0":"")+e.toString(16).toUpperCase();return i},a.delay=function(t,e,r){i(function(){t.apply(r||null,e||[])})},a.inherits=function(t,e){function r(){}r.prototype=e.prototype,t.prototype=new r},a.extend=function(){var t,e,r={};for(t=0;t<arguments.length;t++)for(e in arguments[t])arguments[t].hasOwnProperty(e)&&void 0===r[e]&&(r[e]=arguments[t][e]);return r},a.prepareContent=function(r,t,i,n,s){return u.Promise.resolve(t).then(function(i){return o.blob&&(i instanceof Blob||-1!==["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(i)))&&"undefined"!=typeof FileReader?new u.Promise(function(e,r){var t=new FileReader;t.onload=function(t){e(t.target.result)},t.onerror=function(t){r(t.target.error)},t.readAsArrayBuffer(i)}):i}).then(function(t){var e=a.getTypeOf(t);return e?("arraybuffer"===e?t=a.transformTo("uint8array",t):"string"===e&&(s?t=h.decode(t):i&&!0!==n&&(t=function(t){return l(t,o.uint8array?new Uint8Array(t.length):new Array(t.length))}(t))),t):u.Promise.reject(new Error("Can't read the data of '"+r+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))})}},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,"set-immediate-shim":54}],33:[function(t,e,r){"use strict";var i=t("./reader/readerFor"),n=t("./utils"),s=t("./signature"),a=t("./zipEntry"),o=(t("./utf8"),t("./support"));function h(t){this.files=[],this.loadOptions=t}h.prototype={checkSignature:function(t){if(!this.reader.readAndCheckSignature(t)){this.reader.index-=4;var e=this.reader.readString(4);throw new Error("Corrupted zip or bug: unexpected signature ("+n.pretty(e)+", expected "+n.pretty(t)+")")}},isSignature:function(t,e){var r=this.reader.index;this.reader.setIndex(t);var i=this.reader.readString(4)===e;return this.reader.setIndex(r),i},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var t=this.reader.readData(this.zipCommentLength),e=o.uint8array?"uint8array":"array",r=n.transformTo(e,t);this.zipComment=this.loadOptions.decodeFileName(r)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var t,e,r,i=this.zip64EndOfCentralSize-44;0<i;)t=this.reader.readInt(2),e=this.reader.readInt(4),r=this.reader.readData(e),this.zip64ExtensibleData[t]={id:t,length:e,value:r}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var t,e;for(t=0;t<this.files.length;t++)e=this.files[t],this.reader.setIndex(e.localHeaderOffset),this.checkSignature(s.LOCAL_FILE_HEADER),e.readLocalPart(this.reader),e.handleUTF8(),e.processAttributes()},readCentralDir:function(){var t;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER);)(t=new a({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(t);if(this.centralDirRecords!==this.files.length&&0!==this.centralDirRecords&&0===this.files.length)throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var t=this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);if(t<0)throw!this.isSignature(0,s.LOCAL_FILE_HEADER)?new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html"):new Error("Corrupted zip: can't find end of central directory");this.reader.setIndex(t);var e=t;if(this.checkSignature(s.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===n.MAX_VALUE_16BITS||this.diskWithCentralDirStart===n.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===n.MAX_VALUE_16BITS||this.centralDirRecords===n.MAX_VALUE_16BITS||this.centralDirSize===n.MAX_VALUE_32BITS||this.centralDirOffset===n.MAX_VALUE_32BITS){if(this.zip64=!0,(t=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");if(this.reader.setIndex(t),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,s.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}var r=this.centralDirOffset+this.centralDirSize;this.zip64&&(r+=20,r+=12+this.zip64EndOfCentralSize);var i=e-r;if(0<i)this.isSignature(e,s.CENTRAL_FILE_HEADER)||(this.reader.zero=i);else if(i<0)throw new Error("Corrupted zip: missing "+Math.abs(i)+" bytes.")},prepareReader:function(t){this.reader=i(t)},load:function(t){this.prepareReader(t),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},e.exports=h},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utf8":31,"./utils":32,"./zipEntry":34}],34:[function(t,e,r){"use strict";var i=t("./reader/readerFor"),s=t("./utils"),n=t("./compressedObject"),a=t("./crc32"),o=t("./utf8"),h=t("./compressions"),u=t("./support");function l(t,e){this.options=t,this.loadOptions=e}l.prototype={isEncrypted:function(){return 1==(1&this.bitFlag)},useUTF8:function(){return 2048==(2048&this.bitFlag)},readLocalPart:function(t){var e,r;if(t.skip(22),this.fileNameLength=t.readInt(2),r=t.readInt(2),this.fileName=t.readData(this.fileNameLength),t.skip(r),-1===this.compressedSize||-1===this.uncompressedSize)throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");if(null===(e=function(t){for(var e in h)if(h.hasOwnProperty(e)&&h[e].magic===t)return h[e];return null}(this.compressionMethod)))throw new Error("Corrupted zip : compression "+s.pretty(this.compressionMethod)+" unknown (inner file : "+s.transformTo("string",this.fileName)+")");this.decompressed=new n(this.compressedSize,this.uncompressedSize,this.crc32,e,t.readData(this.compressedSize))},readCentralPart:function(t){this.versionMadeBy=t.readInt(2),t.skip(2),this.bitFlag=t.readInt(2),this.compressionMethod=t.readString(2),this.date=t.readDate(),this.crc32=t.readInt(4),this.compressedSize=t.readInt(4),this.uncompressedSize=t.readInt(4);var e=t.readInt(2);if(this.extraFieldsLength=t.readInt(2),this.fileCommentLength=t.readInt(2),this.diskNumberStart=t.readInt(2),this.internalFileAttributes=t.readInt(2),this.externalFileAttributes=t.readInt(4),this.localHeaderOffset=t.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");t.skip(e),this.readExtraFields(t),this.parseZIP64ExtraField(t),this.fileComment=t.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var t=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),0==t&&(this.dosPermissions=63&this.externalFileAttributes),3==t&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||"/"!==this.fileNameStr.slice(-1)||(this.dir=!0)},parseZIP64ExtraField:function(t){if(this.extraFields[1]){var e=i(this.extraFields[1].value);this.uncompressedSize===s.MAX_VALUE_32BITS&&(this.uncompressedSize=e.readInt(8)),this.compressedSize===s.MAX_VALUE_32BITS&&(this.compressedSize=e.readInt(8)),this.localHeaderOffset===s.MAX_VALUE_32BITS&&(this.localHeaderOffset=e.readInt(8)),this.diskNumberStart===s.MAX_VALUE_32BITS&&(this.diskNumberStart=e.readInt(4))}},readExtraFields:function(t){var e,r,i,n=t.index+this.extraFieldsLength;for(this.extraFields||(this.extraFields={});t.index+4<n;)e=t.readInt(2),r=t.readInt(2),i=t.readData(r),this.extraFields[e]={id:e,length:r,value:i};t.setIndex(n)},handleUTF8:function(){var t=u.uint8array?"uint8array":"array";if(this.useUTF8())this.fileNameStr=o.utf8decode(this.fileName),this.fileCommentStr=o.utf8decode(this.fileComment);else{var e=this.findExtraFieldUnicodePath();if(null!==e)this.fileNameStr=e;else{var r=s.transformTo(t,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(r)}var i=this.findExtraFieldUnicodeComment();if(null!==i)this.fileCommentStr=i;else{var n=s.transformTo(t,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(n)}}},findExtraFieldUnicodePath:function(){var t=this.extraFields[28789];if(t){var e=i(t.value);return 1!==e.readInt(1)?null:a(this.fileName)!==e.readInt(4)?null:o.utf8decode(e.readData(t.length-5))}return null},findExtraFieldUnicodeComment:function(){var t=this.extraFields[25461];if(t){var e=i(t.value);return 1!==e.readInt(1)?null:a(this.fileComment)!==e.readInt(4)?null:o.utf8decode(e.readData(t.length-5))}return null}},e.exports=l},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(t,e,r){"use strict";function i(t,e,r){this.name=t,this.dir=r.dir,this.date=r.date,this.comment=r.comment,this.unixPermissions=r.unixPermissions,this.dosPermissions=r.dosPermissions,this._data=e,this._dataBinary=r.binary,this.options={compression:r.compression,compressionOptions:r.compressionOptions}}var s=t("./stream/StreamHelper"),n=t("./stream/DataWorker"),a=t("./utf8"),o=t("./compressedObject"),h=t("./stream/GenericWorker");i.prototype={internalStream:function(t){var e=null,r="string";try{if(!t)throw new Error("No output type specified.");var i="string"===(r=t.toLowerCase())||"text"===r;"binarystring"!==r&&"text"!==r||(r="string"),e=this._decompressWorker();var n=!this._dataBinary;n&&!i&&(e=e.pipe(new a.Utf8EncodeWorker)),!n&&i&&(e=e.pipe(new a.Utf8DecodeWorker))}catch(t){(e=new h("error")).error(t)}return new s(e,r,"")},async:function(t,e){return this.internalStream(t).accumulate(e)},nodeStream:function(t,e){return this.internalStream(t||"nodebuffer").toNodejsStream(e)},_compressWorker:function(t,e){if(this._data instanceof o&&this._data.compression.magic===t.magic)return this._data.getCompressedWorker();var r=this._decompressWorker();return this._dataBinary||(r=r.pipe(new a.Utf8EncodeWorker)),o.createWorkerFrom(r,t,e)},_decompressWorker:function(){return this._data instanceof o?this._data.getContentWorker():this._data instanceof h?this._data:new n(this._data)}};for(var u=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"],l=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},f=0;f<u.length;f++)i.prototype[u[f]]=l;e.exports=i},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(t,l,e){(function(e){"use strict";var r,i,t=e.MutationObserver||e.WebKitMutationObserver;if(t){var n=0,s=new t(u),a=e.document.createTextNode("");s.observe(a,{characterData:!0}),r=function(){a.data=n=++n%2}}else if(e.setImmediate||void 0===e.MessageChannel)r="document"in e&&"onreadystatechange"in e.document.createElement("script")?function(){var t=e.document.createElement("script");t.onreadystatechange=function(){u(),t.onreadystatechange=null,t.parentNode.removeChild(t),t=null},e.document.documentElement.appendChild(t)}:function(){setTimeout(u,0)};else{var o=new e.MessageChannel;o.port1.onmessage=u,r=function(){o.port2.postMessage(0)}}var h=[];function u(){var t,e;i=!0;for(var r=h.length;r;){for(e=h,h=[],t=-1;++t<r;)e[t]();r=h.length}i=!1}l.exports=function(t){1!==h.push(t)||i||r()}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],37:[function(t,e,r){"use strict";var n=t("immediate");function u(){}var l={},s=["REJECTED"],a=["FULFILLED"],i=["PENDING"];function o(t){if("function"!=typeof t)throw new TypeError("resolver must be a function");this.state=i,this.queue=[],this.outcome=void 0,t!==u&&c(this,t)}function h(t,e,r){this.promise=t,"function"==typeof e&&(this.onFulfilled=e,this.callFulfilled=this.otherCallFulfilled),"function"==typeof r&&(this.onRejected=r,this.callRejected=this.otherCallRejected)}function f(e,r,i){n(function(){var t;try{t=r(i)}catch(t){return l.reject(e,t)}t===e?l.reject(e,new TypeError("Cannot resolve promise with itself")):l.resolve(e,t)})}function d(t){var e=t&&t.then;if(t&&("object"==typeof t||"function"==typeof t)&&"function"==typeof e)return function(){e.apply(t,arguments)}}function c(e,t){var r=!1;function i(t){r||(r=!0,l.reject(e,t))}function n(t){r||(r=!0,l.resolve(e,t))}var s=p(function(){t(n,i)});"error"===s.status&&i(s.value)}function p(t,e){var r={};try{r.value=t(e),r.status="success"}catch(t){r.status="error",r.value=t}return r}(e.exports=o).prototype.finally=function(e){if("function"!=typeof e)return this;var r=this.constructor;return this.then(function(t){return r.resolve(e()).then(function(){return t})},function(t){return r.resolve(e()).then(function(){throw t})})},o.prototype.catch=function(t){return this.then(null,t)},o.prototype.then=function(t,e){if("function"!=typeof t&&this.state===a||"function"!=typeof e&&this.state===s)return this;var r=new this.constructor(u);this.state!==i?f(r,this.state===a?t:e,this.outcome):this.queue.push(new h(r,t,e));return r},h.prototype.callFulfilled=function(t){l.resolve(this.promise,t)},h.prototype.otherCallFulfilled=function(t){f(this.promise,this.onFulfilled,t)},h.prototype.callRejected=function(t){l.reject(this.promise,t)},h.prototype.otherCallRejected=function(t){f(this.promise,this.onRejected,t)},l.resolve=function(t,e){var r=p(d,e);if("error"===r.status)return l.reject(t,r.value);var i=r.value;if(i)c(t,i);else{t.state=a,t.outcome=e;for(var n=-1,s=t.queue.length;++n<s;)t.queue[n].callFulfilled(e)}return t},l.reject=function(t,e){t.state=s,t.outcome=e;for(var r=-1,i=t.queue.length;++r<i;)t.queue[r].callRejected(e);return t},o.resolve=function(t){if(t instanceof this)return t;return l.resolve(new this(u),t)},o.reject=function(t){var e=new this(u);return l.reject(e,t)},o.all=function(t){var r=this;if("[object Array]"!==Object.prototype.toString.call(t))return this.reject(new TypeError("must be an array"));var i=t.length,n=!1;if(!i)return this.resolve([]);var s=new Array(i),a=0,e=-1,o=new this(u);for(;++e<i;)h(t[e],e);return o;function h(t,e){r.resolve(t).then(function(t){s[e]=t,++a!==i||n||(n=!0,l.resolve(o,s))},function(t){n||(n=!0,l.reject(o,t))})}},o.race=function(t){var e=this;if("[object Array]"!==Object.prototype.toString.call(t))return this.reject(new TypeError("must be an array"));var r=t.length,i=!1;if(!r)return this.resolve([]);var n=-1,s=new this(u);for(;++n<r;)a=t[n],e.resolve(a).then(function(t){i||(i=!0,l.resolve(s,t))},function(t){i||(i=!0,l.reject(s,t))});var a;return s}},{immediate:36}],38:[function(t,e,r){"use strict";var i={};(0,t("./lib/utils/common").assign)(i,t("./lib/deflate"),t("./lib/inflate"),t("./lib/zlib/constants")),e.exports=i},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(t,e,r){"use strict";var a=t("./zlib/deflate"),o=t("./utils/common"),h=t("./utils/strings"),n=t("./zlib/messages"),s=t("./zlib/zstream"),u=Object.prototype.toString,l=0,f=-1,d=0,c=8;function p(t){if(!(this instanceof p))return new p(t);this.options=o.assign({level:f,method:c,chunkSize:16384,windowBits:15,memLevel:8,strategy:d,to:""},t||{});var e=this.options;e.raw&&0<e.windowBits?e.windowBits=-e.windowBits:e.gzip&&0<e.windowBits&&e.windowBits<16&&(e.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new s,this.strm.avail_out=0;var r=a.deflateInit2(this.strm,e.level,e.method,e.windowBits,e.memLevel,e.strategy);if(r!==l)throw new Error(n[r]);if(e.header&&a.deflateSetHeader(this.strm,e.header),e.dictionary){var i;if(i="string"==typeof e.dictionary?h.string2buf(e.dictionary):"[object ArrayBuffer]"===u.call(e.dictionary)?new Uint8Array(e.dictionary):e.dictionary,(r=a.deflateSetDictionary(this.strm,i))!==l)throw new Error(n[r]);this._dict_set=!0}}function i(t,e){var r=new p(e);if(r.push(t,!0),r.err)throw r.msg||n[r.err];return r.result}p.prototype.push=function(t,e){var r,i,n=this.strm,s=this.options.chunkSize;if(this.ended)return!1;i=e===~~e?e:!0===e?4:0,"string"==typeof t?n.input=h.string2buf(t):"[object ArrayBuffer]"===u.call(t)?n.input=new Uint8Array(t):n.input=t,n.next_in=0,n.avail_in=n.input.length;do{if(0===n.avail_out&&(n.output=new o.Buf8(s),n.next_out=0,n.avail_out=s),1!==(r=a.deflate(n,i))&&r!==l)return this.onEnd(r),!(this.ended=!0);0!==n.avail_out&&(0!==n.avail_in||4!==i&&2!==i)||("string"===this.options.to?this.onData(h.buf2binstring(o.shrinkBuf(n.output,n.next_out))):this.onData(o.shrinkBuf(n.output,n.next_out)))}while((0<n.avail_in||0===n.avail_out)&&1!==r);return 4===i?(r=a.deflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===l):2!==i||(this.onEnd(l),!(n.avail_out=0))},p.prototype.onData=function(t){this.chunks.push(t)},p.prototype.onEnd=function(t){t===l&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=o.flattenChunks(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg},r.Deflate=p,r.deflate=i,r.deflateRaw=function(t,e){return(e=e||{}).raw=!0,i(t,e)},r.gzip=function(t,e){return(e=e||{}).gzip=!0,i(t,e)}},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(t,e,r){"use strict";var d=t("./zlib/inflate"),c=t("./utils/common"),p=t("./utils/strings"),m=t("./zlib/constants"),i=t("./zlib/messages"),n=t("./zlib/zstream"),s=t("./zlib/gzheader"),_=Object.prototype.toString;function a(t){if(!(this instanceof a))return new a(t);this.options=c.assign({chunkSize:16384,windowBits:0,to:""},t||{});var e=this.options;e.raw&&0<=e.windowBits&&e.windowBits<16&&(e.windowBits=-e.windowBits,0===e.windowBits&&(e.windowBits=-15)),!(0<=e.windowBits&&e.windowBits<16)||t&&t.windowBits||(e.windowBits+=32),15<e.windowBits&&e.windowBits<48&&0==(15&e.windowBits)&&(e.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new n,this.strm.avail_out=0;var r=d.inflateInit2(this.strm,e.windowBits);if(r!==m.Z_OK)throw new Error(i[r]);this.header=new s,d.inflateGetHeader(this.strm,this.header)}function o(t,e){var r=new a(e);if(r.push(t,!0),r.err)throw r.msg||i[r.err];return r.result}a.prototype.push=function(t,e){var r,i,n,s,a,o,h=this.strm,u=this.options.chunkSize,l=this.options.dictionary,f=!1;if(this.ended)return!1;i=e===~~e?e:!0===e?m.Z_FINISH:m.Z_NO_FLUSH,"string"==typeof t?h.input=p.binstring2buf(t):"[object ArrayBuffer]"===_.call(t)?h.input=new Uint8Array(t):h.input=t,h.next_in=0,h.avail_in=h.input.length;do{if(0===h.avail_out&&(h.output=new c.Buf8(u),h.next_out=0,h.avail_out=u),(r=d.inflate(h,m.Z_NO_FLUSH))===m.Z_NEED_DICT&&l&&(o="string"==typeof l?p.string2buf(l):"[object ArrayBuffer]"===_.call(l)?new Uint8Array(l):l,r=d.inflateSetDictionary(this.strm,o)),r===m.Z_BUF_ERROR&&!0===f&&(r=m.Z_OK,f=!1),r!==m.Z_STREAM_END&&r!==m.Z_OK)return this.onEnd(r),!(this.ended=!0);h.next_out&&(0!==h.avail_out&&r!==m.Z_STREAM_END&&(0!==h.avail_in||i!==m.Z_FINISH&&i!==m.Z_SYNC_FLUSH)||("string"===this.options.to?(n=p.utf8border(h.output,h.next_out),s=h.next_out-n,a=p.buf2string(h.output,n),h.next_out=s,h.avail_out=u-s,s&&c.arraySet(h.output,h.output,n,s,0),this.onData(a)):this.onData(c.shrinkBuf(h.output,h.next_out)))),0===h.avail_in&&0===h.avail_out&&(f=!0)}while((0<h.avail_in||0===h.avail_out)&&r!==m.Z_STREAM_END);return r===m.Z_STREAM_END&&(i=m.Z_FINISH),i===m.Z_FINISH?(r=d.inflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===m.Z_OK):i!==m.Z_SYNC_FLUSH||(this.onEnd(m.Z_OK),!(h.avail_out=0))},a.prototype.onData=function(t){this.chunks.push(t)},a.prototype.onEnd=function(t){t===m.Z_OK&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=c.flattenChunks(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg},r.Inflate=a,r.inflate=o,r.inflateRaw=function(t,e){return(e=e||{}).raw=!0,o(t,e)},r.ungzip=o},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(t,e,r){"use strict";var i="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;r.assign=function(t){for(var e=Array.prototype.slice.call(arguments,1);e.length;){var r=e.shift();if(r){if("object"!=typeof r)throw new TypeError(r+"must be non-object");for(var i in r)r.hasOwnProperty(i)&&(t[i]=r[i])}}return t},r.shrinkBuf=function(t,e){return t.length===e?t:t.subarray?t.subarray(0,e):(t.length=e,t)};var n={arraySet:function(t,e,r,i,n){if(e.subarray&&t.subarray)t.set(e.subarray(r,r+i),n);else for(var s=0;s<i;s++)t[n+s]=e[r+s]},flattenChunks:function(t){var e,r,i,n,s,a;for(e=i=0,r=t.length;e<r;e++)i+=t[e].length;for(a=new Uint8Array(i),e=n=0,r=t.length;e<r;e++)s=t[e],a.set(s,n),n+=s.length;return a}},s={arraySet:function(t,e,r,i,n){for(var s=0;s<i;s++)t[n+s]=e[r+s]},flattenChunks:function(t){return[].concat.apply([],t)}};r.setTyped=function(t){t?(r.Buf8=Uint8Array,r.Buf16=Uint16Array,r.Buf32=Int32Array,r.assign(r,n)):(r.Buf8=Array,r.Buf16=Array,r.Buf32=Array,r.assign(r,s))},r.setTyped(i)},{}],42:[function(t,e,r){"use strict";var h=t("./common"),n=!0,s=!0;try{String.fromCharCode.apply(null,[0])}catch(t){n=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(t){s=!1}for(var u=new h.Buf8(256),i=0;i<256;i++)u[i]=252<=i?6:248<=i?5:240<=i?4:224<=i?3:192<=i?2:1;function l(t,e){if(e<65537&&(t.subarray&&s||!t.subarray&&n))return String.fromCharCode.apply(null,h.shrinkBuf(t,e));for(var r="",i=0;i<e;i++)r+=String.fromCharCode(t[i]);return r}u[254]=u[254]=1,r.string2buf=function(t){var e,r,i,n,s,a=t.length,o=0;for(n=0;n<a;n++)55296==(64512&(r=t.charCodeAt(n)))&&n+1<a&&56320==(64512&(i=t.charCodeAt(n+1)))&&(r=65536+(r-55296<<10)+(i-56320),n++),o+=r<128?1:r<2048?2:r<65536?3:4;for(e=new h.Buf8(o),n=s=0;s<o;n++)55296==(64512&(r=t.charCodeAt(n)))&&n+1<a&&56320==(64512&(i=t.charCodeAt(n+1)))&&(r=65536+(r-55296<<10)+(i-56320),n++),r<128?e[s++]=r:(r<2048?e[s++]=192|r>>>6:(r<65536?e[s++]=224|r>>>12:(e[s++]=240|r>>>18,e[s++]=128|r>>>12&63),e[s++]=128|r>>>6&63),e[s++]=128|63&r);return e},r.buf2binstring=function(t){return l(t,t.length)},r.binstring2buf=function(t){for(var e=new h.Buf8(t.length),r=0,i=e.length;r<i;r++)e[r]=t.charCodeAt(r);return e},r.buf2string=function(t,e){var r,i,n,s,a=e||t.length,o=new Array(2*a);for(r=i=0;r<a;)if((n=t[r++])<128)o[i++]=n;else if(4<(s=u[n]))o[i++]=65533,r+=s-1;else{for(n&=2===s?31:3===s?15:7;1<s&&r<a;)n=n<<6|63&t[r++],s--;1<s?o[i++]=65533:n<65536?o[i++]=n:(n-=65536,o[i++]=55296|n>>10&1023,o[i++]=56320|1023&n)}return l(o,i)},r.utf8border=function(t,e){var r;for((e=e||t.length)>t.length&&(e=t.length),r=e-1;0<=r&&128==(192&t[r]);)r--;return r<0?e:0===r?e:r+u[t[r]]>e?r:e}},{"./common":41}],43:[function(t,e,r){"use strict";e.exports=function(t,e,r,i){for(var n=65535&t|0,s=t>>>16&65535|0,a=0;0!==r;){for(r-=a=2e3<r?2e3:r;s=s+(n=n+e[i++]|0)|0,--a;);n%=65521,s%=65521}return n|s<<16|0}},{}],44:[function(t,e,r){"use strict";e.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],45:[function(t,e,r){"use strict";var o=function(){for(var t,e=[],r=0;r<256;r++){t=r;for(var i=0;i<8;i++)t=1&t?3988292384^t>>>1:t>>>1;e[r]=t}return e}();e.exports=function(t,e,r,i){var n=o,s=i+r;t^=-1;for(var a=i;a<s;a++)t=t>>>8^n[255&(t^e[a])];return-1^t}},{}],46:[function(t,e,r){"use strict";var h,d=t("../utils/common"),u=t("./trees"),c=t("./adler32"),p=t("./crc32"),i=t("./messages"),l=0,f=4,m=0,_=-2,g=-1,b=4,n=2,v=8,y=9,s=286,a=30,o=19,w=2*s+1,k=15,x=3,S=258,z=S+x+1,C=42,E=113,A=1,I=2,O=3,B=4;function R(t,e){return t.msg=i[e],e}function T(t){return(t<<1)-(4<t?9:0)}function D(t){for(var e=t.length;0<=--e;)t[e]=0}function F(t){var e=t.state,r=e.pending;r>t.avail_out&&(r=t.avail_out),0!==r&&(d.arraySet(t.output,e.pending_buf,e.pending_out,r,t.next_out),t.next_out+=r,e.pending_out+=r,t.total_out+=r,t.avail_out-=r,e.pending-=r,0===e.pending&&(e.pending_out=0))}function N(t,e){u._tr_flush_block(t,0<=t.block_start?t.block_start:-1,t.strstart-t.block_start,e),t.block_start=t.strstart,F(t.strm)}function U(t,e){t.pending_buf[t.pending++]=e}function P(t,e){t.pending_buf[t.pending++]=e>>>8&255,t.pending_buf[t.pending++]=255&e}function L(t,e){var r,i,n=t.max_chain_length,s=t.strstart,a=t.prev_length,o=t.nice_match,h=t.strstart>t.w_size-z?t.strstart-(t.w_size-z):0,u=t.window,l=t.w_mask,f=t.prev,d=t.strstart+S,c=u[s+a-1],p=u[s+a];t.prev_length>=t.good_match&&(n>>=2),o>t.lookahead&&(o=t.lookahead);do{if(u[(r=e)+a]===p&&u[r+a-1]===c&&u[r]===u[s]&&u[++r]===u[s+1]){s+=2,r++;do{}while(u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&s<d);if(i=S-(d-s),s=d-S,a<i){if(t.match_start=e,o<=(a=i))break;c=u[s+a-1],p=u[s+a]}}}while((e=f[e&l])>h&&0!=--n);return a<=t.lookahead?a:t.lookahead}function j(t){var e,r,i,n,s,a,o,h,u,l,f=t.w_size;do{if(n=t.window_size-t.lookahead-t.strstart,t.strstart>=f+(f-z)){for(d.arraySet(t.window,t.window,f,f,0),t.match_start-=f,t.strstart-=f,t.block_start-=f,e=r=t.hash_size;i=t.head[--e],t.head[e]=f<=i?i-f:0,--r;);for(e=r=f;i=t.prev[--e],t.prev[e]=f<=i?i-f:0,--r;);n+=f}if(0===t.strm.avail_in)break;if(a=t.strm,o=t.window,h=t.strstart+t.lookahead,u=n,l=void 0,l=a.avail_in,u<l&&(l=u),r=0===l?0:(a.avail_in-=l,d.arraySet(o,a.input,a.next_in,l,h),1===a.state.wrap?a.adler=c(a.adler,o,l,h):2===a.state.wrap&&(a.adler=p(a.adler,o,l,h)),a.next_in+=l,a.total_in+=l,l),t.lookahead+=r,t.lookahead+t.insert>=x)for(s=t.strstart-t.insert,t.ins_h=t.window[s],t.ins_h=(t.ins_h<<t.hash_shift^t.window[s+1])&t.hash_mask;t.insert&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[s+x-1])&t.hash_mask,t.prev[s&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=s,s++,t.insert--,!(t.lookahead+t.insert<x)););}while(t.lookahead<z&&0!==t.strm.avail_in)}function Z(t,e){for(var r,i;;){if(t.lookahead<z){if(j(t),t.lookahead<z&&e===l)return A;if(0===t.lookahead)break}if(r=0,t.lookahead>=x&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+x-1])&t.hash_mask,r=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!==r&&t.strstart-r<=t.w_size-z&&(t.match_length=L(t,r)),t.match_length>=x)if(i=u._tr_tally(t,t.strstart-t.match_start,t.match_length-x),t.lookahead-=t.match_length,t.match_length<=t.max_lazy_match&&t.lookahead>=x){for(t.match_length--;t.strstart++,t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+x-1])&t.hash_mask,r=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart,0!=--t.match_length;);t.strstart++}else t.strstart+=t.match_length,t.match_length=0,t.ins_h=t.window[t.strstart],t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+1])&t.hash_mask;else i=u._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++;if(i&&(N(t,!1),0===t.strm.avail_out))return A}return t.insert=t.strstart<x-1?t.strstart:x-1,e===f?(N(t,!0),0===t.strm.avail_out?O:B):t.last_lit&&(N(t,!1),0===t.strm.avail_out)?A:I}function W(t,e){for(var r,i,n;;){if(t.lookahead<z){if(j(t),t.lookahead<z&&e===l)return A;if(0===t.lookahead)break}if(r=0,t.lookahead>=x&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+x-1])&t.hash_mask,r=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),t.prev_length=t.match_length,t.prev_match=t.match_start,t.match_length=x-1,0!==r&&t.prev_length<t.max_lazy_match&&t.strstart-r<=t.w_size-z&&(t.match_length=L(t,r),t.match_length<=5&&(1===t.strategy||t.match_length===x&&4096<t.strstart-t.match_start)&&(t.match_length=x-1)),t.prev_length>=x&&t.match_length<=t.prev_length){for(n=t.strstart+t.lookahead-x,i=u._tr_tally(t,t.strstart-1-t.prev_match,t.prev_length-x),t.lookahead-=t.prev_length-1,t.prev_length-=2;++t.strstart<=n&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+x-1])&t.hash_mask,r=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!=--t.prev_length;);if(t.match_available=0,t.match_length=x-1,t.strstart++,i&&(N(t,!1),0===t.strm.avail_out))return A}else if(t.match_available){if((i=u._tr_tally(t,0,t.window[t.strstart-1]))&&N(t,!1),t.strstart++,t.lookahead--,0===t.strm.avail_out)return A}else t.match_available=1,t.strstart++,t.lookahead--}return t.match_available&&(i=u._tr_tally(t,0,t.window[t.strstart-1]),t.match_available=0),t.insert=t.strstart<x-1?t.strstart:x-1,e===f?(N(t,!0),0===t.strm.avail_out?O:B):t.last_lit&&(N(t,!1),0===t.strm.avail_out)?A:I}function M(t,e,r,i,n){this.good_length=t,this.max_lazy=e,this.nice_length=r,this.max_chain=i,this.func=n}function H(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=v,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new d.Buf16(2*w),this.dyn_dtree=new d.Buf16(2*(2*a+1)),this.bl_tree=new d.Buf16(2*(2*o+1)),D(this.dyn_ltree),D(this.dyn_dtree),D(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new d.Buf16(k+1),this.heap=new d.Buf16(2*s+1),D(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new d.Buf16(2*s+1),D(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function G(t){var e;return t&&t.state?(t.total_in=t.total_out=0,t.data_type=n,(e=t.state).pending=0,e.pending_out=0,e.wrap<0&&(e.wrap=-e.wrap),e.status=e.wrap?C:E,t.adler=2===e.wrap?0:1,e.last_flush=l,u._tr_init(e),m):R(t,_)}function K(t){var e=G(t);return e===m&&function(t){t.window_size=2*t.w_size,D(t.head),t.max_lazy_match=h[t.level].max_lazy,t.good_match=h[t.level].good_length,t.nice_match=h[t.level].nice_length,t.max_chain_length=h[t.level].max_chain,t.strstart=0,t.block_start=0,t.lookahead=0,t.insert=0,t.match_length=t.prev_length=x-1,t.match_available=0,t.ins_h=0}(t.state),e}function Y(t,e,r,i,n,s){if(!t)return _;var a=1;if(e===g&&(e=6),i<0?(a=0,i=-i):15<i&&(a=2,i-=16),n<1||y<n||r!==v||i<8||15<i||e<0||9<e||s<0||b<s)return R(t,_);8===i&&(i=9);var o=new H;return(t.state=o).strm=t,o.wrap=a,o.gzhead=null,o.w_bits=i,o.w_size=1<<o.w_bits,o.w_mask=o.w_size-1,o.hash_bits=n+7,o.hash_size=1<<o.hash_bits,o.hash_mask=o.hash_size-1,o.hash_shift=~~((o.hash_bits+x-1)/x),o.window=new d.Buf8(2*o.w_size),o.head=new d.Buf16(o.hash_size),o.prev=new d.Buf16(o.w_size),o.lit_bufsize=1<<n+6,o.pending_buf_size=4*o.lit_bufsize,o.pending_buf=new d.Buf8(o.pending_buf_size),o.d_buf=1*o.lit_bufsize,o.l_buf=3*o.lit_bufsize,o.level=e,o.strategy=s,o.method=r,K(t)}h=[new M(0,0,0,0,function(t,e){var r=65535;for(r>t.pending_buf_size-5&&(r=t.pending_buf_size-5);;){if(t.lookahead<=1){if(j(t),0===t.lookahead&&e===l)return A;if(0===t.lookahead)break}t.strstart+=t.lookahead,t.lookahead=0;var i=t.block_start+r;if((0===t.strstart||t.strstart>=i)&&(t.lookahead=t.strstart-i,t.strstart=i,N(t,!1),0===t.strm.avail_out))return A;if(t.strstart-t.block_start>=t.w_size-z&&(N(t,!1),0===t.strm.avail_out))return A}return t.insert=0,e===f?(N(t,!0),0===t.strm.avail_out?O:B):(t.strstart>t.block_start&&(N(t,!1),t.strm.avail_out),A)}),new M(4,4,8,4,Z),new M(4,5,16,8,Z),new M(4,6,32,32,Z),new M(4,4,16,16,W),new M(8,16,32,32,W),new M(8,16,128,128,W),new M(8,32,128,256,W),new M(32,128,258,1024,W),new M(32,258,258,4096,W)],r.deflateInit=function(t,e){return Y(t,e,v,15,8,0)},r.deflateInit2=Y,r.deflateReset=K,r.deflateResetKeep=G,r.deflateSetHeader=function(t,e){return t&&t.state?2!==t.state.wrap?_:(t.state.gzhead=e,m):_},r.deflate=function(t,e){var r,i,n,s;if(!t||!t.state||5<e||e<0)return t?R(t,_):_;if(i=t.state,!t.output||!t.input&&0!==t.avail_in||666===i.status&&e!==f)return R(t,0===t.avail_out?-5:_);if(i.strm=t,r=i.last_flush,i.last_flush=e,i.status===C)if(2===i.wrap)t.adler=0,U(i,31),U(i,139),U(i,8),i.gzhead?(U(i,(i.gzhead.text?1:0)+(i.gzhead.hcrc?2:0)+(i.gzhead.extra?4:0)+(i.gzhead.name?8:0)+(i.gzhead.comment?16:0)),U(i,255&i.gzhead.time),U(i,i.gzhead.time>>8&255),U(i,i.gzhead.time>>16&255),U(i,i.gzhead.time>>24&255),U(i,9===i.level?2:2<=i.strategy||i.level<2?4:0),U(i,255&i.gzhead.os),i.gzhead.extra&&i.gzhead.extra.length&&(U(i,255&i.gzhead.extra.length),U(i,i.gzhead.extra.length>>8&255)),i.gzhead.hcrc&&(t.adler=p(t.adler,i.pending_buf,i.pending,0)),i.gzindex=0,i.status=69):(U(i,0),U(i,0),U(i,0),U(i,0),U(i,0),U(i,9===i.level?2:2<=i.strategy||i.level<2?4:0),U(i,3),i.status=E);else{var a=v+(i.w_bits-8<<4)<<8;a|=(2<=i.strategy||i.level<2?0:i.level<6?1:6===i.level?2:3)<<6,0!==i.strstart&&(a|=32),a+=31-a%31,i.status=E,P(i,a),0!==i.strstart&&(P(i,t.adler>>>16),P(i,65535&t.adler)),t.adler=1}if(69===i.status)if(i.gzhead.extra){for(n=i.pending;i.gzindex<(65535&i.gzhead.extra.length)&&(i.pending!==i.pending_buf_size||(i.gzhead.hcrc&&i.pending>n&&(t.adler=p(t.adler,i.pending_buf,i.pending-n,n)),F(t),n=i.pending,i.pending!==i.pending_buf_size));)U(i,255&i.gzhead.extra[i.gzindex]),i.gzindex++;i.gzhead.hcrc&&i.pending>n&&(t.adler=p(t.adler,i.pending_buf,i.pending-n,n)),i.gzindex===i.gzhead.extra.length&&(i.gzindex=0,i.status=73)}else i.status=73;if(73===i.status)if(i.gzhead.name){n=i.pending;do{if(i.pending===i.pending_buf_size&&(i.gzhead.hcrc&&i.pending>n&&(t.adler=p(t.adler,i.pending_buf,i.pending-n,n)),F(t),n=i.pending,i.pending===i.pending_buf_size)){s=1;break}s=i.gzindex<i.gzhead.name.length?255&i.gzhead.name.charCodeAt(i.gzindex++):0,U(i,s)}while(0!==s);i.gzhead.hcrc&&i.pending>n&&(t.adler=p(t.adler,i.pending_buf,i.pending-n,n)),0===s&&(i.gzindex=0,i.status=91)}else i.status=91;if(91===i.status)if(i.gzhead.comment){n=i.pending;do{if(i.pending===i.pending_buf_size&&(i.gzhead.hcrc&&i.pending>n&&(t.adler=p(t.adler,i.pending_buf,i.pending-n,n)),F(t),n=i.pending,i.pending===i.pending_buf_size)){s=1;break}s=i.gzindex<i.gzhead.comment.length?255&i.gzhead.comment.charCodeAt(i.gzindex++):0,U(i,s)}while(0!==s);i.gzhead.hcrc&&i.pending>n&&(t.adler=p(t.adler,i.pending_buf,i.pending-n,n)),0===s&&(i.status=103)}else i.status=103;if(103===i.status&&(i.gzhead.hcrc?(i.pending+2>i.pending_buf_size&&F(t),i.pending+2<=i.pending_buf_size&&(U(i,255&t.adler),U(i,t.adler>>8&255),t.adler=0,i.status=E)):i.status=E),0!==i.pending){if(F(t),0===t.avail_out)return i.last_flush=-1,m}else if(0===t.avail_in&&T(e)<=T(r)&&e!==f)return R(t,-5);if(666===i.status&&0!==t.avail_in)return R(t,-5);if(0!==t.avail_in||0!==i.lookahead||e!==l&&666!==i.status){var o=2===i.strategy?function(t,e){for(var r;;){if(0===t.lookahead&&(j(t),0===t.lookahead)){if(e===l)return A;break}if(t.match_length=0,r=u._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++,r&&(N(t,!1),0===t.strm.avail_out))return A}return t.insert=0,e===f?(N(t,!0),0===t.strm.avail_out?O:B):t.last_lit&&(N(t,!1),0===t.strm.avail_out)?A:I}(i,e):3===i.strategy?function(t,e){for(var r,i,n,s,a=t.window;;){if(t.lookahead<=S){if(j(t),t.lookahead<=S&&e===l)return A;if(0===t.lookahead)break}if(t.match_length=0,t.lookahead>=x&&0<t.strstart&&(i=a[n=t.strstart-1])===a[++n]&&i===a[++n]&&i===a[++n]){s=t.strstart+S;do{}while(i===a[++n]&&i===a[++n]&&i===a[++n]&&i===a[++n]&&i===a[++n]&&i===a[++n]&&i===a[++n]&&i===a[++n]&&n<s);t.match_length=S-(s-n),t.match_length>t.lookahead&&(t.match_length=t.lookahead)}if(t.match_length>=x?(r=u._tr_tally(t,1,t.match_length-x),t.lookahead-=t.match_length,t.strstart+=t.match_length,t.match_length=0):(r=u._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++),r&&(N(t,!1),0===t.strm.avail_out))return A}return t.insert=0,e===f?(N(t,!0),0===t.strm.avail_out?O:B):t.last_lit&&(N(t,!1),0===t.strm.avail_out)?A:I}(i,e):h[i.level].func(i,e);if(o!==O&&o!==B||(i.status=666),o===A||o===O)return 0===t.avail_out&&(i.last_flush=-1),m;if(o===I&&(1===e?u._tr_align(i):5!==e&&(u._tr_stored_block(i,0,0,!1),3===e&&(D(i.head),0===i.lookahead&&(i.strstart=0,i.block_start=0,i.insert=0))),F(t),0===t.avail_out))return i.last_flush=-1,m}return e!==f?m:i.wrap<=0?1:(2===i.wrap?(U(i,255&t.adler),U(i,t.adler>>8&255),U(i,t.adler>>16&255),U(i,t.adler>>24&255),U(i,255&t.total_in),U(i,t.total_in>>8&255),U(i,t.total_in>>16&255),U(i,t.total_in>>24&255)):(P(i,t.adler>>>16),P(i,65535&t.adler)),F(t),0<i.wrap&&(i.wrap=-i.wrap),0!==i.pending?m:1)},r.deflateEnd=function(t){var e;return t&&t.state?(e=t.state.status)!==C&&69!==e&&73!==e&&91!==e&&103!==e&&e!==E&&666!==e?R(t,_):(t.state=null,e===E?R(t,-3):m):_},r.deflateSetDictionary=function(t,e){var r,i,n,s,a,o,h,u,l=e.length;if(!t||!t.state)return _;if(2===(s=(r=t.state).wrap)||1===s&&r.status!==C||r.lookahead)return _;for(1===s&&(t.adler=c(t.adler,e,l,0)),r.wrap=0,l>=r.w_size&&(0===s&&(D(r.head),r.strstart=0,r.block_start=0,r.insert=0),u=new d.Buf8(r.w_size),d.arraySet(u,e,l-r.w_size,r.w_size,0),e=u,l=r.w_size),a=t.avail_in,o=t.next_in,h=t.input,t.avail_in=l,t.next_in=0,t.input=e,j(r);r.lookahead>=x;){for(i=r.strstart,n=r.lookahead-(x-1);r.ins_h=(r.ins_h<<r.hash_shift^r.window[i+x-1])&r.hash_mask,r.prev[i&r.w_mask]=r.head[r.ins_h],r.head[r.ins_h]=i,i++,--n;);r.strstart=i,r.lookahead=x-1,j(r)}return r.strstart+=r.lookahead,r.block_start=r.strstart,r.insert=r.lookahead,r.lookahead=0,r.match_length=r.prev_length=x-1,r.match_available=0,t.next_in=o,t.input=h,t.avail_in=a,r.wrap=s,m},r.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(t,e,r){"use strict";e.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}},{}],48:[function(t,e,r){"use strict";e.exports=function(t,e){var r,i,n,s,a,o,h,u,l,f,d,c,p,m,_,g,b,v,y,w,k,x,S,z,C;r=t.state,i=t.next_in,z=t.input,n=i+(t.avail_in-5),s=t.next_out,C=t.output,a=s-(e-t.avail_out),o=s+(t.avail_out-257),h=r.dmax,u=r.wsize,l=r.whave,f=r.wnext,d=r.window,c=r.hold,p=r.bits,m=r.lencode,_=r.distcode,g=(1<<r.lenbits)-1,b=(1<<r.distbits)-1;t:do{p<15&&(c+=z[i++]<<p,p+=8,c+=z[i++]<<p,p+=8),v=m[c&g];e:for(;;){if(c>>>=y=v>>>24,p-=y,0===(y=v>>>16&255))C[s++]=65535&v;else{if(!(16&y)){if(0==(64&y)){v=m[(65535&v)+(c&(1<<y)-1)];continue e}if(32&y){r.mode=12;break t}t.msg="invalid literal/length code",r.mode=30;break t}w=65535&v,(y&=15)&&(p<y&&(c+=z[i++]<<p,p+=8),w+=c&(1<<y)-1,c>>>=y,p-=y),p<15&&(c+=z[i++]<<p,p+=8,c+=z[i++]<<p,p+=8),v=_[c&b];r:for(;;){if(c>>>=y=v>>>24,p-=y,!(16&(y=v>>>16&255))){if(0==(64&y)){v=_[(65535&v)+(c&(1<<y)-1)];continue r}t.msg="invalid distance code",r.mode=30;break t}if(k=65535&v,p<(y&=15)&&(c+=z[i++]<<p,(p+=8)<y&&(c+=z[i++]<<p,p+=8)),h<(k+=c&(1<<y)-1)){t.msg="invalid distance too far back",r.mode=30;break t}if(c>>>=y,p-=y,(y=s-a)<k){if(l<(y=k-y)&&r.sane){t.msg="invalid distance too far back",r.mode=30;break t}if(S=d,(x=0)===f){if(x+=u-y,y<w){for(w-=y;C[s++]=d[x++],--y;);x=s-k,S=C}}else if(f<y){if(x+=u+f-y,(y-=f)<w){for(w-=y;C[s++]=d[x++],--y;);if(x=0,f<w){for(w-=y=f;C[s++]=d[x++],--y;);x=s-k,S=C}}}else if(x+=f-y,y<w){for(w-=y;C[s++]=d[x++],--y;);x=s-k,S=C}for(;2<w;)C[s++]=S[x++],C[s++]=S[x++],C[s++]=S[x++],w-=3;w&&(C[s++]=S[x++],1<w&&(C[s++]=S[x++]))}else{for(x=s-k;C[s++]=C[x++],C[s++]=C[x++],C[s++]=C[x++],2<(w-=3););w&&(C[s++]=C[x++],1<w&&(C[s++]=C[x++]))}break}}break}}while(i<n&&s<o);i-=w=p>>3,c&=(1<<(p-=w<<3))-1,t.next_in=i,t.next_out=s,t.avail_in=i<n?n-i+5:5-(i-n),t.avail_out=s<o?o-s+257:257-(s-o),r.hold=c,r.bits=p}},{}],49:[function(t,e,r){"use strict";var I=t("../utils/common"),O=t("./adler32"),B=t("./crc32"),R=t("./inffast"),T=t("./inftrees"),D=1,F=2,N=0,U=-2,P=1,i=852,n=592;function L(t){return(t>>>24&255)+(t>>>8&65280)+((65280&t)<<8)+((255&t)<<24)}function s(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new I.Buf16(320),this.work=new I.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function a(t){var e;return t&&t.state?(e=t.state,t.total_in=t.total_out=e.total=0,t.msg="",e.wrap&&(t.adler=1&e.wrap),e.mode=P,e.last=0,e.havedict=0,e.dmax=32768,e.head=null,e.hold=0,e.bits=0,e.lencode=e.lendyn=new I.Buf32(i),e.distcode=e.distdyn=new I.Buf32(n),e.sane=1,e.back=-1,N):U}function o(t){var e;return t&&t.state?((e=t.state).wsize=0,e.whave=0,e.wnext=0,a(t)):U}function h(t,e){var r,i;return t&&t.state?(i=t.state,e<0?(r=0,e=-e):(r=1+(e>>4),e<48&&(e&=15)),e&&(e<8||15<e)?U:(null!==i.window&&i.wbits!==e&&(i.window=null),i.wrap=r,i.wbits=e,o(t))):U}function u(t,e){var r,i;return t?(i=new s,(t.state=i).window=null,(r=h(t,e))!==N&&(t.state=null),r):U}var l,f,d=!0;function j(t){if(d){var e;for(l=new I.Buf32(512),f=new I.Buf32(32),e=0;e<144;)t.lens[e++]=8;for(;e<256;)t.lens[e++]=9;for(;e<280;)t.lens[e++]=7;for(;e<288;)t.lens[e++]=8;for(T(D,t.lens,0,288,l,0,t.work,{bits:9}),e=0;e<32;)t.lens[e++]=5;T(F,t.lens,0,32,f,0,t.work,{bits:5}),d=!1}t.lencode=l,t.lenbits=9,t.distcode=f,t.distbits=5}function Z(t,e,r,i){var n,s=t.state;return null===s.window&&(s.wsize=1<<s.wbits,s.wnext=0,s.whave=0,s.window=new I.Buf8(s.wsize)),i>=s.wsize?(I.arraySet(s.window,e,r-s.wsize,s.wsize,0),s.wnext=0,s.whave=s.wsize):(i<(n=s.wsize-s.wnext)&&(n=i),I.arraySet(s.window,e,r-i,n,s.wnext),(i-=n)?(I.arraySet(s.window,e,r-i,i,0),s.wnext=i,s.whave=s.wsize):(s.wnext+=n,s.wnext===s.wsize&&(s.wnext=0),s.whave<s.wsize&&(s.whave+=n))),0}r.inflateReset=o,r.inflateReset2=h,r.inflateResetKeep=a,r.inflateInit=function(t){return u(t,15)},r.inflateInit2=u,r.inflate=function(t,e){var r,i,n,s,a,o,h,u,l,f,d,c,p,m,_,g,b,v,y,w,k,x,S,z,C=0,E=new I.Buf8(4),A=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!t||!t.state||!t.output||!t.input&&0!==t.avail_in)return U;12===(r=t.state).mode&&(r.mode=13),a=t.next_out,n=t.output,h=t.avail_out,s=t.next_in,i=t.input,o=t.avail_in,u=r.hold,l=r.bits,f=o,d=h,x=N;t:for(;;)switch(r.mode){case P:if(0===r.wrap){r.mode=13;break}for(;l<16;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(2&r.wrap&&35615===u){E[r.check=0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0),l=u=0,r.mode=2;break}if(r.flags=0,r.head&&(r.head.done=!1),!(1&r.wrap)||(((255&u)<<8)+(u>>8))%31){t.msg="incorrect header check",r.mode=30;break}if(8!=(15&u)){t.msg="unknown compression method",r.mode=30;break}if(l-=4,k=8+(15&(u>>>=4)),0===r.wbits)r.wbits=k;else if(k>r.wbits){t.msg="invalid window size",r.mode=30;break}r.dmax=1<<k,t.adler=r.check=1,r.mode=512&u?10:12,l=u=0;break;case 2:for(;l<16;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(r.flags=u,8!=(255&r.flags)){t.msg="unknown compression method",r.mode=30;break}if(57344&r.flags){t.msg="unknown header flags set",r.mode=30;break}r.head&&(r.head.text=u>>8&1),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0,r.mode=3;case 3:for(;l<32;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}r.head&&(r.head.time=u),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,E[2]=u>>>16&255,E[3]=u>>>24&255,r.check=B(r.check,E,4,0)),l=u=0,r.mode=4;case 4:for(;l<16;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}r.head&&(r.head.xflags=255&u,r.head.os=u>>8),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0,r.mode=5;case 5:if(1024&r.flags){for(;l<16;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}r.length=u,r.head&&(r.head.extra_len=u),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0}else r.head&&(r.head.extra=null);r.mode=6;case 6:if(1024&r.flags&&(o<(c=r.length)&&(c=o),c&&(r.head&&(k=r.head.extra_len-r.length,r.head.extra||(r.head.extra=new Array(r.head.extra_len)),I.arraySet(r.head.extra,i,s,c,k)),512&r.flags&&(r.check=B(r.check,i,c,s)),o-=c,s+=c,r.length-=c),r.length))break t;r.length=0,r.mode=7;case 7:if(2048&r.flags){if(0===o)break t;for(c=0;k=i[s+c++],r.head&&k&&r.length<65536&&(r.head.name+=String.fromCharCode(k)),k&&c<o;);if(512&r.flags&&(r.check=B(r.check,i,c,s)),o-=c,s+=c,k)break t}else r.head&&(r.head.name=null);r.length=0,r.mode=8;case 8:if(4096&r.flags){if(0===o)break t;for(c=0;k=i[s+c++],r.head&&k&&r.length<65536&&(r.head.comment+=String.fromCharCode(k)),k&&c<o;);if(512&r.flags&&(r.check=B(r.check,i,c,s)),o-=c,s+=c,k)break t}else r.head&&(r.head.comment=null);r.mode=9;case 9:if(512&r.flags){for(;l<16;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(u!==(65535&r.check)){t.msg="header crc mismatch",r.mode=30;break}l=u=0}r.head&&(r.head.hcrc=r.flags>>9&1,r.head.done=!0),t.adler=r.check=0,r.mode=12;break;case 10:for(;l<32;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}t.adler=r.check=L(u),l=u=0,r.mode=11;case 11:if(0===r.havedict)return t.next_out=a,t.avail_out=h,t.next_in=s,t.avail_in=o,r.hold=u,r.bits=l,2;t.adler=r.check=1,r.mode=12;case 12:if(5===e||6===e)break t;case 13:if(r.last){u>>>=7&l,l-=7&l,r.mode=27;break}for(;l<3;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}switch(r.last=1&u,l-=1,3&(u>>>=1)){case 0:r.mode=14;break;case 1:if(j(r),r.mode=20,6!==e)break;u>>>=2,l-=2;break t;case 2:r.mode=17;break;case 3:t.msg="invalid block type",r.mode=30}u>>>=2,l-=2;break;case 14:for(u>>>=7&l,l-=7&l;l<32;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if((65535&u)!=(u>>>16^65535)){t.msg="invalid stored block lengths",r.mode=30;break}if(r.length=65535&u,l=u=0,r.mode=15,6===e)break t;case 15:r.mode=16;case 16:if(c=r.length){if(o<c&&(c=o),h<c&&(c=h),0===c)break t;I.arraySet(n,i,s,c,a),o-=c,s+=c,h-=c,a+=c,r.length-=c;break}r.mode=12;break;case 17:for(;l<14;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(r.nlen=257+(31&u),u>>>=5,l-=5,r.ndist=1+(31&u),u>>>=5,l-=5,r.ncode=4+(15&u),u>>>=4,l-=4,286<r.nlen||30<r.ndist){t.msg="too many length or distance symbols",r.mode=30;break}r.have=0,r.mode=18;case 18:for(;r.have<r.ncode;){for(;l<3;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}r.lens[A[r.have++]]=7&u,u>>>=3,l-=3}for(;r.have<19;)r.lens[A[r.have++]]=0;if(r.lencode=r.lendyn,r.lenbits=7,S={bits:r.lenbits},x=T(0,r.lens,0,19,r.lencode,0,r.work,S),r.lenbits=S.bits,x){t.msg="invalid code lengths set",r.mode=30;break}r.have=0,r.mode=19;case 19:for(;r.have<r.nlen+r.ndist;){for(;g=(C=r.lencode[u&(1<<r.lenbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(b<16)u>>>=_,l-=_,r.lens[r.have++]=b;else{if(16===b){for(z=_+2;l<z;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(u>>>=_,l-=_,0===r.have){t.msg="invalid bit length repeat",r.mode=30;break}k=r.lens[r.have-1],c=3+(3&u),u>>>=2,l-=2}else if(17===b){for(z=_+3;l<z;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}l-=_,k=0,c=3+(7&(u>>>=_)),u>>>=3,l-=3}else{for(z=_+7;l<z;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}l-=_,k=0,c=11+(127&(u>>>=_)),u>>>=7,l-=7}if(r.have+c>r.nlen+r.ndist){t.msg="invalid bit length repeat",r.mode=30;break}for(;c--;)r.lens[r.have++]=k}}if(30===r.mode)break;if(0===r.lens[256]){t.msg="invalid code -- missing end-of-block",r.mode=30;break}if(r.lenbits=9,S={bits:r.lenbits},x=T(D,r.lens,0,r.nlen,r.lencode,0,r.work,S),r.lenbits=S.bits,x){t.msg="invalid literal/lengths set",r.mode=30;break}if(r.distbits=6,r.distcode=r.distdyn,S={bits:r.distbits},x=T(F,r.lens,r.nlen,r.ndist,r.distcode,0,r.work,S),r.distbits=S.bits,x){t.msg="invalid distances set",r.mode=30;break}if(r.mode=20,6===e)break t;case 20:r.mode=21;case 21:if(6<=o&&258<=h){t.next_out=a,t.avail_out=h,t.next_in=s,t.avail_in=o,r.hold=u,r.bits=l,R(t,d),a=t.next_out,n=t.output,h=t.avail_out,s=t.next_in,i=t.input,o=t.avail_in,u=r.hold,l=r.bits,12===r.mode&&(r.back=-1);break}for(r.back=0;g=(C=r.lencode[u&(1<<r.lenbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(g&&0==(240&g)){for(v=_,y=g,w=b;g=(C=r.lencode[w+((u&(1<<v+y)-1)>>v)])>>>16&255,b=65535&C,!(v+(_=C>>>24)<=l);){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}u>>>=v,l-=v,r.back+=v}if(u>>>=_,l-=_,r.back+=_,r.length=b,0===g){r.mode=26;break}if(32&g){r.back=-1,r.mode=12;break}if(64&g){t.msg="invalid literal/length code",r.mode=30;break}r.extra=15&g,r.mode=22;case 22:if(r.extra){for(z=r.extra;l<z;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}r.length+=u&(1<<r.extra)-1,u>>>=r.extra,l-=r.extra,r.back+=r.extra}r.was=r.length,r.mode=23;case 23:for(;g=(C=r.distcode[u&(1<<r.distbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(0==(240&g)){for(v=_,y=g,w=b;g=(C=r.distcode[w+((u&(1<<v+y)-1)>>v)])>>>16&255,b=65535&C,!(v+(_=C>>>24)<=l);){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}u>>>=v,l-=v,r.back+=v}if(u>>>=_,l-=_,r.back+=_,64&g){t.msg="invalid distance code",r.mode=30;break}r.offset=b,r.extra=15&g,r.mode=24;case 24:if(r.extra){for(z=r.extra;l<z;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}r.offset+=u&(1<<r.extra)-1,u>>>=r.extra,l-=r.extra,r.back+=r.extra}if(r.offset>r.dmax){t.msg="invalid distance too far back",r.mode=30;break}r.mode=25;case 25:if(0===h)break t;if(c=d-h,r.offset>c){if((c=r.offset-c)>r.whave&&r.sane){t.msg="invalid distance too far back",r.mode=30;break}p=c>r.wnext?(c-=r.wnext,r.wsize-c):r.wnext-c,c>r.length&&(c=r.length),m=r.window}else m=n,p=a-r.offset,c=r.length;for(h<c&&(c=h),h-=c,r.length-=c;n[a++]=m[p++],--c;);0===r.length&&(r.mode=21);break;case 26:if(0===h)break t;n[a++]=r.length,h--,r.mode=21;break;case 27:if(r.wrap){for(;l<32;){if(0===o)break t;o--,u|=i[s++]<<l,l+=8}if(d-=h,t.total_out+=d,r.total+=d,d&&(t.adler=r.check=r.flags?B(r.check,n,d,a-d):O(r.check,n,d,a-d)),d=h,(r.flags?u:L(u))!==r.check){t.msg="incorrect data check",r.mode=30;break}l=u=0}r.mode=28;case 28:if(r.wrap&&r.flags){for(;l<32;){if(0===o)break t;o--,u+=i[s++]<<l,l+=8}if(u!==(4294967295&r.total)){t.msg="incorrect length check",r.mode=30;break}l=u=0}r.mode=29;case 29:x=1;break t;case 30:x=-3;break t;case 31:return-4;case 32:default:return U}return t.next_out=a,t.avail_out=h,t.next_in=s,t.avail_in=o,r.hold=u,r.bits=l,(r.wsize||d!==t.avail_out&&r.mode<30&&(r.mode<27||4!==e))&&Z(t,t.output,t.next_out,d-t.avail_out)?(r.mode=31,-4):(f-=t.avail_in,d-=t.avail_out,t.total_in+=f,t.total_out+=d,r.total+=d,r.wrap&&d&&(t.adler=r.check=r.flags?B(r.check,n,d,t.next_out-d):O(r.check,n,d,t.next_out-d)),t.data_type=r.bits+(r.last?64:0)+(12===r.mode?128:0)+(20===r.mode||15===r.mode?256:0),(0==f&&0===d||4===e)&&x===N&&(x=-5),x)},r.inflateEnd=function(t){if(!t||!t.state)return U;var e=t.state;return e.window&&(e.window=null),t.state=null,N},r.inflateGetHeader=function(t,e){var r;return t&&t.state?0==(2&(r=t.state).wrap)?U:((r.head=e).done=!1,N):U},r.inflateSetDictionary=function(t,e){var r,i=e.length;return t&&t.state?0!==(r=t.state).wrap&&11!==r.mode?U:11===r.mode&&O(1,e,i,0)!==r.check?-3:Z(t,e,i,i)?(r.mode=31,-4):(r.havedict=1,N):U},r.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(t,e,r){"use strict";var D=t("../utils/common"),F=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],N=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],U=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],P=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];e.exports=function(t,e,r,i,n,s,a,o){var h,u,l,f,d,c,p,m,_,g=o.bits,b=0,v=0,y=0,w=0,k=0,x=0,S=0,z=0,C=0,E=0,A=null,I=0,O=new D.Buf16(16),B=new D.Buf16(16),R=null,T=0;for(b=0;b<=15;b++)O[b]=0;for(v=0;v<i;v++)O[e[r+v]]++;for(k=g,w=15;1<=w&&0===O[w];w--);if(w<k&&(k=w),0===w)return n[s++]=20971520,n[s++]=20971520,o.bits=1,0;for(y=1;y<w&&0===O[y];y++);for(k<y&&(k=y),b=z=1;b<=15;b++)if(z<<=1,(z-=O[b])<0)return-1;if(0<z&&(0===t||1!==w))return-1;for(B[1]=0,b=1;b<15;b++)B[b+1]=B[b]+O[b];for(v=0;v<i;v++)0!==e[r+v]&&(a[B[e[r+v]]++]=v);if(c=0===t?(A=R=a,19):1===t?(A=F,I-=257,R=N,T-=257,256):(A=U,R=P,-1),b=y,d=s,S=v=E=0,l=-1,f=(C=1<<(x=k))-1,1===t&&852<C||2===t&&592<C)return 1;for(;;){for(p=b-S,_=a[v]<c?(m=0,a[v]):a[v]>c?(m=R[T+a[v]],A[I+a[v]]):(m=96,0),h=1<<b-S,y=u=1<<x;n[d+(E>>S)+(u-=h)]=p<<24|m<<16|_|0,0!==u;);for(h=1<<b-1;E&h;)h>>=1;if(0!==h?(E&=h-1,E+=h):E=0,v++,0==--O[b]){if(b===w)break;b=e[r+a[v]]}if(k<b&&(E&f)!==l){for(0===S&&(S=k),d+=y,z=1<<(x=b-S);x+S<w&&!((z-=O[x+S])<=0);)x++,z<<=1;if(C+=1<<x,1===t&&852<C||2===t&&592<C)return 1;n[l=E&f]=k<<24|x<<16|d-s|0}}return 0!==E&&(n[d+E]=b-S<<24|64<<16|0),o.bits=k,0}},{"../utils/common":41}],51:[function(t,e,r){"use strict";e.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],52:[function(t,e,r){"use strict";var n=t("../utils/common"),o=0,h=1;function i(t){for(var e=t.length;0<=--e;)t[e]=0}var s=0,a=29,u=256,l=u+1+a,f=30,d=19,_=2*l+1,g=15,c=16,p=7,m=256,b=16,v=17,y=18,w=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],k=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],x=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],S=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],z=new Array(2*(l+2));i(z);var C=new Array(2*f);i(C);var E=new Array(512);i(E);var A=new Array(256);i(A);var I=new Array(a);i(I);var O,B,R,T=new Array(f);function D(t,e,r,i,n){this.static_tree=t,this.extra_bits=e,this.extra_base=r,this.elems=i,this.max_length=n,this.has_stree=t&&t.length}function F(t,e){this.dyn_tree=t,this.max_code=0,this.stat_desc=e}function N(t){return t<256?E[t]:E[256+(t>>>7)]}function U(t,e){t.pending_buf[t.pending++]=255&e,t.pending_buf[t.pending++]=e>>>8&255}function P(t,e,r){t.bi_valid>c-r?(t.bi_buf|=e<<t.bi_valid&65535,U(t,t.bi_buf),t.bi_buf=e>>c-t.bi_valid,t.bi_valid+=r-c):(t.bi_buf|=e<<t.bi_valid&65535,t.bi_valid+=r)}function L(t,e,r){P(t,r[2*e],r[2*e+1])}function j(t,e){for(var r=0;r|=1&t,t>>>=1,r<<=1,0<--e;);return r>>>1}function Z(t,e,r){var i,n,s=new Array(g+1),a=0;for(i=1;i<=g;i++)s[i]=a=a+r[i-1]<<1;for(n=0;n<=e;n++){var o=t[2*n+1];0!==o&&(t[2*n]=j(s[o]++,o))}}function W(t){var e;for(e=0;e<l;e++)t.dyn_ltree[2*e]=0;for(e=0;e<f;e++)t.dyn_dtree[2*e]=0;for(e=0;e<d;e++)t.bl_tree[2*e]=0;t.dyn_ltree[2*m]=1,t.opt_len=t.static_len=0,t.last_lit=t.matches=0}function M(t){8<t.bi_valid?U(t,t.bi_buf):0<t.bi_valid&&(t.pending_buf[t.pending++]=t.bi_buf),t.bi_buf=0,t.bi_valid=0}function H(t,e,r,i){var n=2*e,s=2*r;return t[n]<t[s]||t[n]===t[s]&&i[e]<=i[r]}function G(t,e,r){for(var i=t.heap[r],n=r<<1;n<=t.heap_len&&(n<t.heap_len&&H(e,t.heap[n+1],t.heap[n],t.depth)&&n++,!H(e,i,t.heap[n],t.depth));)t.heap[r]=t.heap[n],r=n,n<<=1;t.heap[r]=i}function K(t,e,r){var i,n,s,a,o=0;if(0!==t.last_lit)for(;i=t.pending_buf[t.d_buf+2*o]<<8|t.pending_buf[t.d_buf+2*o+1],n=t.pending_buf[t.l_buf+o],o++,0===i?L(t,n,e):(L(t,(s=A[n])+u+1,e),0!==(a=w[s])&&P(t,n-=I[s],a),L(t,s=N(--i),r),0!==(a=k[s])&&P(t,i-=T[s],a)),o<t.last_lit;);L(t,m,e)}function Y(t,e){var r,i,n,s=e.dyn_tree,a=e.stat_desc.static_tree,o=e.stat_desc.has_stree,h=e.stat_desc.elems,u=-1;for(t.heap_len=0,t.heap_max=_,r=0;r<h;r++)0!==s[2*r]?(t.heap[++t.heap_len]=u=r,t.depth[r]=0):s[2*r+1]=0;for(;t.heap_len<2;)s[2*(n=t.heap[++t.heap_len]=u<2?++u:0)]=1,t.depth[n]=0,t.opt_len--,o&&(t.static_len-=a[2*n+1]);for(e.max_code=u,r=t.heap_len>>1;1<=r;r--)G(t,s,r);for(n=h;r=t.heap[1],t.heap[1]=t.heap[t.heap_len--],G(t,s,1),i=t.heap[1],t.heap[--t.heap_max]=r,t.heap[--t.heap_max]=i,s[2*n]=s[2*r]+s[2*i],t.depth[n]=(t.depth[r]>=t.depth[i]?t.depth[r]:t.depth[i])+1,s[2*r+1]=s[2*i+1]=n,t.heap[1]=n++,G(t,s,1),2<=t.heap_len;);t.heap[--t.heap_max]=t.heap[1],function(t,e){var r,i,n,s,a,o,h=e.dyn_tree,u=e.max_code,l=e.stat_desc.static_tree,f=e.stat_desc.has_stree,d=e.stat_desc.extra_bits,c=e.stat_desc.extra_base,p=e.stat_desc.max_length,m=0;for(s=0;s<=g;s++)t.bl_count[s]=0;for(h[2*t.heap[t.heap_max]+1]=0,r=t.heap_max+1;r<_;r++)p<(s=h[2*h[2*(i=t.heap[r])+1]+1]+1)&&(s=p,m++),h[2*i+1]=s,u<i||(t.bl_count[s]++,a=0,c<=i&&(a=d[i-c]),o=h[2*i],t.opt_len+=o*(s+a),f&&(t.static_len+=o*(l[2*i+1]+a)));if(0!==m){do{for(s=p-1;0===t.bl_count[s];)s--;t.bl_count[s]--,t.bl_count[s+1]+=2,t.bl_count[p]--,m-=2}while(0<m);for(s=p;0!==s;s--)for(i=t.bl_count[s];0!==i;)u<(n=t.heap[--r])||(h[2*n+1]!==s&&(t.opt_len+=(s-h[2*n+1])*h[2*n],h[2*n+1]=s),i--)}}(t,e),Z(s,u,t.bl_count)}function X(t,e,r){var i,n,s=-1,a=e[1],o=0,h=7,u=4;for(0===a&&(h=138,u=3),e[2*(r+1)+1]=65535,i=0;i<=r;i++)n=a,a=e[2*(i+1)+1],++o<h&&n===a||(o<u?t.bl_tree[2*n]+=o:0!==n?(n!==s&&t.bl_tree[2*n]++,t.bl_tree[2*b]++):o<=10?t.bl_tree[2*v]++:t.bl_tree[2*y]++,s=n,u=(o=0)===a?(h=138,3):n===a?(h=6,3):(h=7,4))}function V(t,e,r){var i,n,s=-1,a=e[1],o=0,h=7,u=4;for(0===a&&(h=138,u=3),i=0;i<=r;i++)if(n=a,a=e[2*(i+1)+1],!(++o<h&&n===a)){if(o<u)for(;L(t,n,t.bl_tree),0!=--o;);else 0!==n?(n!==s&&(L(t,n,t.bl_tree),o--),L(t,b,t.bl_tree),P(t,o-3,2)):o<=10?(L(t,v,t.bl_tree),P(t,o-3,3)):(L(t,y,t.bl_tree),P(t,o-11,7));s=n,u=(o=0)===a?(h=138,3):n===a?(h=6,3):(h=7,4)}}i(T);var q=!1;function J(t,e,r,i){P(t,(s<<1)+(i?1:0),3),function(t,e,r,i){M(t),i&&(U(t,r),U(t,~r)),n.arraySet(t.pending_buf,t.window,e,r,t.pending),t.pending+=r}(t,e,r,!0)}r._tr_init=function(t){q||(function(){var t,e,r,i,n,s=new Array(g+1);for(i=r=0;i<a-1;i++)for(I[i]=r,t=0;t<1<<w[i];t++)A[r++]=i;for(A[r-1]=i,i=n=0;i<16;i++)for(T[i]=n,t=0;t<1<<k[i];t++)E[n++]=i;for(n>>=7;i<f;i++)for(T[i]=n<<7,t=0;t<1<<k[i]-7;t++)E[256+n++]=i;for(e=0;e<=g;e++)s[e]=0;for(t=0;t<=143;)z[2*t+1]=8,t++,s[8]++;for(;t<=255;)z[2*t+1]=9,t++,s[9]++;for(;t<=279;)z[2*t+1]=7,t++,s[7]++;for(;t<=287;)z[2*t+1]=8,t++,s[8]++;for(Z(z,l+1,s),t=0;t<f;t++)C[2*t+1]=5,C[2*t]=j(t,5);O=new D(z,w,u+1,l,g),B=new D(C,k,0,f,g),R=new D(new Array(0),x,0,d,p)}(),q=!0),t.l_desc=new F(t.dyn_ltree,O),t.d_desc=new F(t.dyn_dtree,B),t.bl_desc=new F(t.bl_tree,R),t.bi_buf=0,t.bi_valid=0,W(t)},r._tr_stored_block=J,r._tr_flush_block=function(t,e,r,i){var n,s,a=0;0<t.level?(2===t.strm.data_type&&(t.strm.data_type=function(t){var e,r=4093624447;for(e=0;e<=31;e++,r>>>=1)if(1&r&&0!==t.dyn_ltree[2*e])return o;if(0!==t.dyn_ltree[18]||0!==t.dyn_ltree[20]||0!==t.dyn_ltree[26])return h;for(e=32;e<u;e++)if(0!==t.dyn_ltree[2*e])return h;return o}(t)),Y(t,t.l_desc),Y(t,t.d_desc),a=function(t){var e;for(X(t,t.dyn_ltree,t.l_desc.max_code),X(t,t.dyn_dtree,t.d_desc.max_code),Y(t,t.bl_desc),e=d-1;3<=e&&0===t.bl_tree[2*S[e]+1];e--);return t.opt_len+=3*(e+1)+5+5+4,e}(t),n=t.opt_len+3+7>>>3,(s=t.static_len+3+7>>>3)<=n&&(n=s)):n=s=r+5,r+4<=n&&-1!==e?J(t,e,r,i):4===t.strategy||s===n?(P(t,2+(i?1:0),3),K(t,z,C)):(P(t,4+(i?1:0),3),function(t,e,r,i){var n;for(P(t,e-257,5),P(t,r-1,5),P(t,i-4,4),n=0;n<i;n++)P(t,t.bl_tree[2*S[n]+1],3);V(t,t.dyn_ltree,e-1),V(t,t.dyn_dtree,r-1)}(t,t.l_desc.max_code+1,t.d_desc.max_code+1,a+1),K(t,t.dyn_ltree,t.dyn_dtree)),W(t),i&&M(t)},r._tr_tally=function(t,e,r){return t.pending_buf[t.d_buf+2*t.last_lit]=e>>>8&255,t.pending_buf[t.d_buf+2*t.last_lit+1]=255&e,t.pending_buf[t.l_buf+t.last_lit]=255&r,t.last_lit++,0===e?t.dyn_ltree[2*r]++:(t.matches++,e--,t.dyn_ltree[2*(A[r]+u+1)]++,t.dyn_dtree[2*N(e)]++),t.last_lit===t.lit_bufsize-1},r._tr_align=function(t){P(t,2,3),L(t,m,z),function(t){16===t.bi_valid?(U(t,t.bi_buf),t.bi_buf=0,t.bi_valid=0):8<=t.bi_valid&&(t.pending_buf[t.pending++]=255&t.bi_buf,t.bi_buf>>=8,t.bi_valid-=8)}(t)}},{"../utils/common":41}],53:[function(t,e,r){"use strict";e.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}},{}],54:[function(t,e,r){"use strict";e.exports="function"==typeof setImmediate?setImmediate:function(){var t=[].slice.apply(arguments);t.splice(1,0,0),setTimeout.apply(null,t)}},{}]},{},[10])(10)});
/*! pdfmake v0.1.70, @license MIT, @link http://pdfmake.org */

this.pdfMake = this.pdfMake || {}; this.pdfMake.vfs = {
    "Roboto-Italic.ttf":"AAEAAAAWAQAABABgRFNJR3mY7RoAAeAIAAAVZEdERUYXzxk8AAHE9AAAAHBHUE9TgZR3/gABxWQAAAxIR1NVQrxJJMUAAdGsAAAOMkxJTk/i+xgjAAHf4AAAAChMVFNI/MqnIQAAOkgAAAIyT1MvMidOuT4AAAHoAAAAYFZETVjxGtxFAAA8fAAAC7pjbWFwxdTSsQAAKGgAAA1+Y3Z0IAmXAhgAAEpUAAAAKGZwZ20GWZw3AABI4AAAAXNnYXNwABMACQAAAkgAAAAQZ2x5ZqjmHJUAAFM0AAFfqGhlYWTreEC1AAABbAAAADZoaGVhCUEDzwAAAaQAAAAkaG10eH9mHVsAAEp8AAAIuGtlcm4Niw0yAAHClAAAAl5sb2Nh0rt6kgAANegAAARebWF4cARXD04AAAHIAAAAIG5hbWX+pO0VAAACWAAAJg1wb3N0cYf+swABstwAAA+1cHJlcJlpJRkAAEg4AAAAqAABAAAAAQAAPjBmCF8PPPUAGQPoAAAAAMN5b44AAAAAxJKNjP8//cEE/wT0AAEACQACAAAAAAAAAAEAAAUA/bwAAAVJ/z/+mwT/AAEAAAAAAAAAAAAAAAAAAAIuAAEAAAIuAx8AFwByAAUAAQAAAAAACgAAAgALuwACAAEAAwI2ArwABQAEArwCigAAAIwCvAKKAAAB3QAyAPoAAAEAAAAAAAAAAACAACCvwACgSgAAAAgAAAAATElOTwAgAAD+/AL8/xQDXAUAAkQgAABBAAAAAAHgAsQAAAAgAAAAAAADAAgAAgAMAAH//wADAAAAHgFuAAEAAAAAAAAC1AAAAAEAAAAAAAEACALUAAEAAAAAAAIABALcAAEAAAAAAAMAIALgAAEAAAAAAAQADQMAAAEAAAAAAAUAEgMNAAEAAAAAAAYADAMfAAEAAAAAAAcA5gMrAAEAAAAAAAgAFQQRAAEAAAAAAAkAIgQmAAEAAAAAAAoDwwRIAAEAAAAAAAsAFwgLAAEAAAAAAAwAJQgiAAEAAAAAAA0DzwhHAAEAAAAAAA4AHwwWAAMAAQQJAAAFqAw1AAMAAQQJAAEAEBHdAAMAAQQJAAIACBHtAAMAAQQJAAMAQBH1AAMAAQQJAAQAGhI1AAMAAQQJAAUAJBJPAAMAAQQJAAYAGBJzAAMAAQQJAAcBzBKLAAMAAQQJAAgAKhRXAAMAAQQJAAkARBSBAAMAAQQJAAoHhhTFAAMAAQQJAAsALhxLAAMAAQQJAAwAShx5AAMAAQQJAA0HnhzDAAMAAQQJAA4APiRhUGFydCBvZiB0aGUgZGlnaXRhbGx5IGVuY29kZWQgbWFjaGluZSByZWFkYWJsZSBvdXRsaW5lIGRhdGEgZm9yIHByb2R1Y2luZyB0aGUgVHlwZWZhY2VzIHByb3ZpZGVkIGlzIGNvcHlyaWdodGVkIKkgMTk4OCAtIDIwMDcgTGlub3R5cGUgR21iSCwgd3d3Lmxpbm90eXBlLmNvbS4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gVGhpcyBzb2Z0d2FyZSBpcyB0aGUgcHJvcGVydHkgb2YgTGlub3R5cGUgR21iSCwgYW5kIG1heSBub3QgYmUgcmVwcm9kdWNlZCwgdXNlZCwgZGlzcGxheWVkLCBtb2RpZmllZCwgZGlzY2xvc2VkIG9yIHRyYW5zZmVycmVkIHdpdGhvdXQgdGhlIGV4cHJlc3Mgd3JpdHRlbiBhcHByb3ZhbCBvZiBMaW5vdHlwZSBHbWJILiBUaGUgZGlnaXRhbGx5IGVuY29kZWQgbWFjaGluZSByZWFkYWJsZSBzb2Z0d2FyZSBmb3IgcHJvZHVjaW5nIHRoZSBUeXBlZmFjZXMgbGljZW5zZWQgdG8geW91IGlzIGNvcHlyaWdodGVkIChjKSAxOTg5LCAxOTkwIEFkb2JlIFN5c3RlbXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuIFRoaXMgc29mdHdhcmUgaXMgdGhlIHByb3BlcnR5IG9mIEFkb2JlIFN5c3RlbXMgSW5jb3Jwb3JhdGVkIGFuZCBpdHMgbGljZW5zb3JzLCBhbmQgbWF5IG5vdCBiZSByZXByb2R1Y2VkLCB1c2VkLCBkaXNwbGF5ZWQsIG1vZGlmaWVkLCBkaXNjbG9zZWQgb3IgdHJhbnNmZXJyZWQgd2l0aG91dCB0aGUgZXhwcmVzcyB3cml0dGVuIGFwcHJvdmFsIG9mIEFkb2JlLkphbm5hIExUQm9sZExpbm90eXBlIEdtYkg6SmFubmEgTFQgQm9sZDoyMDA3SmFubmEgTFQgQm9sZFZlcnNpb24gMS4wMDsgMjAwN0phbm5hTFQtQm9sZEphbm5hIGlzIGEgdHJhZGVtYXJrIG9mIExpbm90eXBlIENvcnAuIGFuZCBtYXkgYmUgcmVnaXN0ZXJlZCBpbiBjZXJ0YWluIGp1cmlzZGljdGlvbnMuIEF2ZW5pciBpcyBhIHRyYWRlbWFyayBvZiBMaW5vdHlwZSBHbWJIIHJlZ2lzdGVyZWQgaW4gdGhlIFUuUy4gUGF0ZW50IGFuZCBUcmFkZW1hcmsgT2ZmaWNlIGFuZCBtYXkgYmUgcmVnaXN0ZXJlZCBpbiBjZXJ0YWluIG90aGVyIGp1cmlzZGljdGlvbnMuQWRvYmUgLyBMaW5vdHlwZSBHbWJITmFkaW5lIENoYWhpbmUgYW5kIEFkcmlhbiBGcnV0aWdlckphbm5hIGlzIGRlc2lnbmVkIGJ5IExlYmFuZXNlIGRlc2lnbmVyIE5hZGluZSBDaGFoaW5lLiBJdCBpcyBiYXNlZCBvbiB0aGUgS3VmaSBzdHlsZSBidXQgaW5jb3Jwb3JhdGVzIGFzcGVjdHMgb2YgUnVxYWEgYW5kIE5hc2toIGluIHRoZSBsZXR0ZXIgZm9ybSBkZXNpZ25zLiBUaGlzIHJlc3VsdHMgaW4gd2hhdCBjb3VsZCBiZSBsYWJlbGVkIGFzIGEgaHVtYW5pc3QgS3VmaSwgYSBLdWZpIHN0eWxlIHRoYXQgcmVmZXJzIHRvIGhhbmR3cml0aW5nIHN0cnVjdHVyZXMgYW5kIHNsaWdodCBtb2R1bGF0aW9uIHRvIGFjaGlldmUgYSBtb3JlIGluZm9ybWFsIGFuZCBmcmllbmRseSB2ZXJzaW9uIG9mIHRoZSBvdGhlcndpc2UgaGlnaGx5IHN0cnVjdHVyZWQgYW5kIGdlb21ldHJpYyBLdWZpIHN0eWxlcy4gSmFubmEsIHdoaWNoIG1lYW5zICJoZWF2ZW4iIGluIEFyYWJpYyB3YXMgZmlyc3QgZGVzaWduZWQgaW4gMjAwNCBhcyBhIHNpZ25hZ2UgZmFjZSBmb3IgdGhlIEFtZXJpY2FuIFVuaXZlcnNpdHkgb2YgQmVpcnV0LiBTbywgdGhlIGRlc2lnbiBpcyB0YXJnZXRlZCB0b3dhcmRzIHNpZ25hZ2UgYXBwbGljYXRpb25zIGJ1dCBpcyBhbHNvIHF1aXRlIHN1aXRlZCBmb3IgdmFyaW91cyBhcHBsaWNhdGlvbnMgZnJvbSBsb3cgcmVzb2x1dGlvbiBkaXNwbGF5IGRldmljZXMgdG8gYWR2ZXJ0aXNpbmcgaGVhZGxpbmVzIHRvIGNvcnBvcmF0ZSBpZGVudGl0eSBhbmQgYnJhbmRpbmcgYXBwbGljYXRpb25zLiBUaGUgTGF0aW4gY29tcGFuaW9uIHRvIEphbm5hIGlzIEFkcmlhbiBGcnV0aWdlcidzIEF2ZW5pciB3aGljaCBpcyBpbmNsdWRlZCBhbHNvIGluIHRoZSBmb250LiBUaGUgZm9udCBhbHNvIGluY2x1ZGVzIHN1cHBvcnQgZm9yIEFyYWJpYywgUGVyc2lhbiwgYW5kIFVyZHUgYXMgd2VsbCBhcyBwcm9wb3J0aW9uYWwgYW5kIHRhYnVsYXIgbnVtZXJhbHMgZm9yIHRoZSBzdXBwb3J0ZWQgbGFuZ3VhZ2VzLmh0dHA6Ly93d3cubGlub3R5cGUuY29taHR0cDovL3d3dy5saW5vdHlwZS5jb20vZm9udGRlc2lnbmVyc05PVElGSUNBVElPTiBPRiBMSUNFTlNFIEFHUkVFTUVOVA0KDQpZb3UgaGF2ZSBvYnRhaW5lZCB0aGlzIGZvbnQgc29mdHdhcmUgZWl0aGVyIGRpcmVjdGx5IGZyb20gTGlub3R5cGUgR21iSCBvciB0b2dldGhlciB3aXRoIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIGJ5IG9uZSBvZiBMaW5vdHlwZSdzIGxpY2Vuc2Vlcy4NCg0KVGhpcyBmb250IHNvZnR3YXJlIGlzIGEgdmFsdWFibGUgYXNzZXQgb2YgTGlub3R5cGUgR21iSC4gVW5sZXNzIHlvdSBoYXZlIGVudGVyZWQgaW50byBhIHNwZWNpZmljIGxpY2Vuc2UgYWdyZWVtZW50IGdyYW50aW5nIHlvdSBhZGRpdGlvbmFsIHJpZ2h0cywgeW91ciB1c2Ugb2YgdGhpcyBmb250IHNvZnR3YXJlIGlzIGxpbWl0ZWQgdG8geW91ciB3b3Jrc3RhdGlvbiBmb3IgeW91ciBvd24gdXNlLiBZb3UgbWF5IG5vdCBjb3B5IG9yIGRpc3RyaWJ1dGUgdGhpcyBmb250IHNvZnR3YXJlLiBJZiB5b3UgaGF2ZSBhbnkgcXVlc3Rpb25zIHJlZ2FyZGluZyB5b3VyIGxpY2Vuc2UgdGVybXMsIHBsZWFzZSByZXZpZXcgdGhlIGxpY2Vuc2UgYWdyZWVtZW50IHlvdSByZWNlaXZlZCB3aXRoIHRoZSBzb2Z0d2FyZS4NCg0KR2VuZXJhbCBsaWNlbnNlIHRlcm1zIGFuZCB1c2FnZSByaWdodHMgY2FuIGJlIHZpZXdlZCBhdCB3d3cubGlub3R5cGUuY29tL2xpY2Vuc2UuDQoNCkdlbmVyZWxsZSBMaXplbnpiZWRpbmd1bmdlbiB1bmQgTnV0enVuZ3NyZWNodGUgZmluZGVuIFNpZSB1bnRlciB3d3cubGlub3R5cGUuY29tL2xpY2Vuc2UuDQoNClBvdXIgcGx1cyBkJ2luZm9ybWF0aW9ucyBjb25jZXJuYW50IGxlIGNvbnRyYXQgZCd1dGlsaXNhdGlvbiBkdSBsb2dpY2llbCBkZSBwb2xpY2VzLCB2ZXVpbGxleiBjb25zdWx0ZXIgbm90cmUgc2l0ZSB3ZWIgd3d3Lmxpbm90eXBlLmNvbS9saWNlbnNlLg0KDQpMaW5vdHlwZSBHbWJIIGNhbiBiZSBjb250YWN0ZWQgYXQ6DQoNClRlbC46ICs0OSgwKTYxNzIgNDg0LTQxOGh0dHA6Ly93d3cubGlub3R5cGUuY29tL2xpY2Vuc2UAUABhAHIAdAAgAG8AZgAgAHQAaABlACAAZABpAGcAaQB0AGEAbABsAHkAIABlAG4AYwBvAGQAZQBkACAAbQBhAGMAaABpAG4AZQAgAHIAZQBhAGQAYQBiAGwAZQAgAG8AdQB0AGwAaQBuAGUAIABkAGEAdABhACAAZgBvAHIAIABwAHIAbwBkAHUAYwBpAG4AZwAgAHQAaABlACAAVAB5AHAAZQBmAGEAYwBlAHMAIABwAHIAbwB2AGkAZABlAGQAIABpAHMAIABjAG8AcAB5AHIAaQBnAGgAdABlAGQAIACpACAAMQA5ADgAOAAgAC0AIAAyADAAMAA3ACAATABpAG4AbwB0AHkAcABlACAARwBtAGIASAAsACAAdwB3AHcALgBsAGkAbgBvAHQAeQBwAGUALgBjAG8AbQAuACAAQQBsAGwAIAByAGkAZwBoAHQAcwAgAHIAZQBzAGUAcgB2AGUAZAAuACAAVABoAGkAcwAgAHMAbwBmAHQAdwBhAHIAZQAgAGkAcwAgAHQAaABlACAAcAByAG8AcABlAHIAdAB5ACAAbwBmACAATABpAG4AbwB0AHkAcABlACAARwBtAGIASAAsACAAYQBuAGQAIABtAGEAeQAgAG4AbwB0ACAAYgBlACAAcgBlAHAAcgBvAGQAdQBjAGUAZAAsACAAdQBzAGUAZAAsACAAZABpAHMAcABsAGEAeQBlAGQALAAgAG0AbwBkAGkAZgBpAGUAZAAsACAAZABpAHMAYwBsAG8AcwBlAGQAIABvAHIAIAB0AHIAYQBuAHMAZgBlAHIAcgBlAGQAIAB3AGkAdABoAG8AdQB0ACAAdABoAGUAIABlAHgAcAByAGUAcwBzACAAdwByAGkAdAB0AGUAbgAgAGEAcABwAHIAbwB2AGEAbAAgAG8AZgAgAEwAaQBuAG8AdAB5AHAAZQAgAEcAbQBiAEgALgAgAFQAaABlACAAZABpAGcAaQB0AGEAbABsAHkAIABlAG4AYwBvAGQAZQBkACAAbQBhAGMAaABpAG4AZQAgAHIAZQBhAGQAYQBiAGwAZQAgAHMAbwBmAHQAdwBhAHIAZQAgAGYAbwByACAAcAByAG8AZAB1AGMAaQBuAGcAIAB0AGgAZQAgAFQAeQBwAGUAZgBhAGMAZQBzACAAbABpAGMAZQBuAHMAZQBkACAAdABvACAAeQBvAHUAIABpAHMAIABjAG8AcAB5AHIAaQBnAGgAdABlAGQAIAAoAGMAKQAgADEAOQA4ADkALAAgADEAOQA5ADAAIABBAGQAbwBiAGUAIABTAHkAcwB0AGUAbQBzAC4AIABBAGwAbAAgAFIAaQBnAGgAdABzACAAUgBlAHMAZQByAHYAZQBkAC4AIABUAGgAaQBzACAAcwBvAGYAdAB3AGEAcgBlACAAaQBzACAAdABoAGUAIABwAHIAbwBwAGUAcgB0AHkAIABvAGYAIABBAGQAbwBiAGUAIABTAHkAcwB0AGUAbQBzACAASQBuAGMAbwByAHAAbwByAGEAdABlAGQAIABhAG4AZAAgAGkAdABzACAAbABpAGMAZQBuAHMAbwByAHMALAAgAGEAbgBkACAAbQBhAHkAIABuAG8AdAAgAGIAZQAgAHIAZQBwAHIAbwBkAHUAYwBlAGQALAAgAHUAcwBlAGQALAAgAGQAaQBzAHAAbABhAHkAZQBkACwAIABtAG8AZABpAGYAaQBlAGQALAAgAGQAaQBzAGMAbABvAHMAZQBkACAAbwByACAAdAByAGEAbgBzAGYAZQByAHIAZQBkACAAdwBpAHQAaABvAHUAdAAgAHQAaABlACAAZQB4AHAAcgBlAHMAcwAgAHcAcgBpAHQAdABlAG4AIABhAHAAcAByAG8AdgBhAGwAIABvAGYAIABBAGQAbwBiAGUALgBKAGEAbgBuAGEAIABMAFQAQgBvAGwAZABMAGkAbgBvAHQAeQBwAGUAIABHAG0AYgBIADoASgBhAG4AbgBhACAATABUACAAQgBvAGwAZAA6ADIAMAAwADcASgBhAG4AbgBhACAATABUACAAQgBvAGwAZABWAGUAcgBzAGkAbwBuACAAMQAuADAAMAA7ACAAMgAwADAANwBKAGEAbgBuAGEATABUAC0AQgBvAGwAZABKAGEAbgBuAGEAIABpAHMAIABhACAAdAByAGEAZABlAG0AYQByAGsAIABvAGYAIABMAGkAbgBvAHQAeQBwAGUAIABDAG8AcgBwAC4AIABhAG4AZAAgAG0AYQB5ACAAYgBlACAAcgBlAGcAaQBzAHQAZQByAGUAZAAgAGkAbgAgAGMAZQByAHQAYQBpAG4AIABqAHUAcgBpAHMAZABpAGMAdABpAG8AbgBzAC4AIABBAHYAZQBuAGkAcgAgAGkAcwAgAGEAIAB0AHIAYQBkAGUAbQBhAHIAawAgAG8AZgAgAEwAaQBuAG8AdAB5AHAAZQAgAEcAbQBiAEgAIAByAGUAZwBpAHMAdABlAHIAZQBkACAAaQBuACAAdABoAGUAIABVAC4AUwAuACAAUABhAHQAZQBuAHQAIABhAG4AZAAgAFQAcgBhAGQAZQBtAGEAcgBrACAATwBmAGYAaQBjAGUAIABhAG4AZAAgAG0AYQB5ACAAYgBlACAAcgBlAGcAaQBzAHQAZQByAGUAZAAgAGkAbgAgAGMAZQByAHQAYQBpAG4AIABvAHQAaABlAHIAIABqAHUAcgBpAHMAZABpAGMAdABpAG8AbgBzAC4AQQBkAG8AYgBlACAALwAgAEwAaQBuAG8AdAB5AHAAZQAgAEcAbQBiAEgATgBhAGQAaQBuAGUAIABDAGgAYQBoAGkAbgBlACAAYQBuAGQAIABBAGQAcgBpAGEAbgAgAEYAcgB1AHQAaQBnAGUAcgBKAGEAbgBuAGEAIABpAHMAIABkAGUAcwBpAGcAbgBlAGQAIABiAHkAIABMAGUAYgBhAG4AZQBzAGUAIABkAGUAcwBpAGcAbgBlAHIAIABOAGEAZABpAG4AZQAgAEMAaABhAGgAaQBuAGUALgAgAEkAdAAgAGkAcwAgAGIAYQBzAGUAZAAgAG8AbgAgAHQAaABlACAASwB1AGYAaQAgAHMAdAB5AGwAZQAgAGIAdQB0ACAAaQBuAGMAbwByAHAAbwByAGEAdABlAHMAIABhAHMAcABlAGMAdABzACAAbwBmACAAUgB1AHEAYQBhACAAYQBuAGQAIABOAGEAcwBrAGgAIABpAG4AIAB0AGgAZQAgAGwAZQB0AHQAZQByACAAZgBvAHIAbQAgAGQAZQBzAGkAZwBuAHMALgAgAFQAaABpAHMAIAByAGUAcwB1AGwAdABzACAAaQBuACAAdwBoAGEAdAAgAGMAbwB1AGwAZAAgAGIAZQAgAGwAYQBiAGUAbABlAGQAIABhAHMAIABhACAAaAB1AG0AYQBuAGkAcwB0ACAASwB1AGYAaQAsACAAYQAgAEsAdQBmAGkAIABzAHQAeQBsAGUAIAB0AGgAYQB0ACAAcgBlAGYAZQByAHMAIAB0AG8AIABoAGEAbgBkAHcAcgBpAHQAaQBuAGcAIABzAHQAcgB1AGMAdAB1AHIAZQBzACAAYQBuAGQAIABzAGwAaQBnAGgAdAAgAG0AbwBkAHUAbABhAHQAaQBvAG4AIAB0AG8AIABhAGMAaABpAGUAdgBlACAAYQAgAG0AbwByAGUAIABpAG4AZgBvAHIAbQBhAGwAIABhAG4AZAAgAGYAcgBpAGUAbgBkAGwAeQAgAHYAZQByAHMAaQBvAG4AIABvAGYAIAB0AGgAZQAgAG8AdABoAGUAcgB3AGkAcwBlACAAaABpAGcAaABsAHkAIABzAHQAcgB1AGMAdAB1AHIAZQBkACAAYQBuAGQAIABnAGUAbwBtAGUAdAByAGkAYwAgAEsAdQBmAGkAIABzAHQAeQBsAGUAcwAuACAASgBhAG4AbgBhACwAIAB3AGgAaQBjAGgAIABtAGUAYQBuAHMAIAAiAGgAZQBhAHYAZQBuACIAIABpAG4AIABBAHIAYQBiAGkAYwAgAHcAYQBzACAAZgBpAHIAcwB0ACAAZABlAHMAaQBnAG4AZQBkACAAaQBuACAAMgAwADAANAAgAGEAcwAgAGEAIABzAGkAZwBuAGEAZwBlACAAZgBhAGMAZQAgAGYAbwByACAAdABoAGUAIABBAG0AZQByAGkAYwBhAG4AIABVAG4AaQB2AGUAcgBzAGkAdAB5ACAAbwBmACAAQgBlAGkAcgB1AHQALgAgAFMAbwAsACAAdABoAGUAIABkAGUAcwBpAGcAbgAgAGkAcwAgAHQAYQByAGcAZQB0AGUAZAAgAHQAbwB3AGEAcgBkAHMAIABzAGkAZwBuAGEAZwBlACAAYQBwAHAAbABpAGMAYQB0AGkAbwBuAHMAIABiAHUAdAAgAGkAcwAgAGEAbABzAG8AIABxAHUAaQB0AGUAIABzAHUAaQB0AGUAZAAgAGYAbwByACAAdgBhAHIAaQBvAHUAcwAgAGEAcABwAGwAaQBjAGEAdABpAG8AbgBzACAAZgByAG8AbQAgAGwAbwB3ACAAcgBlAHMAbwBsAHUAdABpAG8AbgAgAGQAaQBzAHAAbABhAHkAIABkAGUAdgBpAGMAZQBzACAAdABvACAAYQBkAHYAZQByAHQAaQBzAGkAbgBnACAAaABlAGEAZABsAGkAbgBlAHMAIAB0AG8AIABjAG8AcgBwAG8AcgBhAHQAZQAgAGkAZABlAG4AdABpAHQAeQAgAGEAbgBkACAAYgByAGEAbgBkAGkAbgBnACAAYQBwAHAAbABpAGMAYQB0AGkAbwBuAHMALgAgAFQAaABlACAATABhAHQAaQBuACAAYwBvAG0AcABhAG4AaQBvAG4AIAB0AG8AIABKAGEAbgBuAGEAIABpAHMAIABBAGQAcgBpAGEAbgAgAEYAcgB1AHQAaQBnAGUAcgAnAHMAIABBAHYAZQBuAGkAcgAgAHcAaABpAGMAaAAgAGkAcwAgAGkAbgBjAGwAdQBkAGUAZAAgAGEAbABzAG8AIABpAG4AIAB0AGgAZQAgAGYAbwBuAHQALgAgAFQAaABlACAAZgBvAG4AdAAgAGEAbABzAG8AIABpAG4AYwBsAHUAZABlAHMAIABzAHUAcABwAG8AcgB0ACAAZgBvAHIAIABBAHIAYQBiAGkAYwAsACAAUABlAHIAcwBpAGEAbgAsACAAYQBuAGQAIABVAHIAZAB1ACAAYQBzACAAdwBlAGwAbAAgAGEAcwAgAHAAcgBvAHAAbwByAHQAaQBvAG4AYQBsACAAYQBuAGQAIAB0AGEAYgB1AGwAYQByACAAbgB1AG0AZQByAGEAbABzACAAZgBvAHIAIAB0AGgAZQAgAHMAdQBwAHAAbwByAHQAZQBkACAAbABhAG4AZwB1AGEAZwBlAHMALgBoAHQAdABwADoALwAvAHcAdwB3AC4AbABpAG4AbwB0AHkAcABlAC4AYwBvAG0AaAB0AHQAcAA6AC8ALwB3AHcAdwAuAGwAaQBuAG8AdAB5AHAAZQAuAGMAbwBtAC8AZgBvAG4AdABkAGUAcwBpAGcAbgBlAHIAcwBOAE8AVABJAEYASQBDAEEAVABJAE8ATgAgAE8ARgAgAEwASQBDAEUATgBTAEUAIABBAEcAUgBFAEUATQBFAE4AVAANAAoADQAKAFkAbwB1ACAAaABhAHYAZQAgAG8AYgB0AGEAaQBuAGUAZAAgAHQAaABpAHMAIABmAG8AbgB0ACAAcwBvAGYAdAB3AGEAcgBlACAAZQBpAHQAaABlAHIAIABkAGkAcgBlAGMAdABsAHkAIABmAHIAbwBtACAATABpAG4AbwB0AHkAcABlACAARwBtAGIASAAgAG8AcgAgAHQAbwBnAGUAdABoAGUAcgAgAHcAaQB0AGgAIABzAG8AZgB0AHcAYQByAGUAIABkAGkAcwB0AHIAaQBiAHUAdABlAGQAIABiAHkAIABvAG4AZQAgAG8AZgAgAEwAaQBuAG8AdAB5AHAAZQAnAHMAIABsAGkAYwBlAG4AcwBlAGUAcwAuAA0ACgANAAoAVABoAGkAcwAgAGYAbwBuAHQAIABzAG8AZgB0AHcAYQByAGUAIABpAHMAIABhACAAdgBhAGwAdQBhAGIAbABlACAAYQBzAHMAZQB0ACAAbwBmACAATABpAG4AbwB0AHkAcABlACAARwBtAGIASAAuACAAVQBuAGwAZQBzAHMAIAB5AG8AdQAgAGgAYQB2AGUAIABlAG4AdABlAHIAZQBkACAAaQBuAHQAbwAgAGEAIABzAHAAZQBjAGkAZgBpAGMAIABsAGkAYwBlAG4AcwBlACAAYQBnAHIAZQBlAG0AZQBuAHQAIABnAHIAYQBuAHQAaQBuAGcAIAB5AG8AdQAgAGEAZABkAGkAdABpAG8AbgBhAGwAIAByAGkAZwBoAHQAcwAsACAAeQBvAHUAcgAgAHUAcwBlACAAbwBmACAAdABoAGkAcwAgAGYAbwBuAHQAIABzAG8AZgB0AHcAYQByAGUAIABpAHMAIABsAGkAbQBpAHQAZQBkACAAdABvACAAeQBvAHUAcgAgAHcAbwByAGsAcwB0AGEAdABpAG8AbgAgAGYAbwByACAAeQBvAHUAcgAgAG8AdwBuACAAdQBzAGUALgAgAFkAbwB1ACAAbQBhAHkAIABuAG8AdAAgAGMAbwBwAHkAIABvAHIAIABkAGkAcwB0AHIAaQBiAHUAdABlACAAdABoAGkAcwAgAGYAbwBuAHQAIABzAG8AZgB0AHcAYQByAGUALgAgAEkAZgAgAHkAbwB1ACAAaABhAHYAZQAgAGEAbgB5ACAAcQB1AGUAcwB0AGkAbwBuAHMAIAByAGUAZwBhAHIAZABpAG4AZwAgAHkAbwB1AHIAIABsAGkAYwBlAG4AcwBlACAAdABlAHIAbQBzACwAIABwAGwAZQBhAHMAZQAgAHIAZQB2AGkAZQB3ACAAdABoAGUAIABsAGkAYwBlAG4AcwBlACAAYQBnAHIAZQBlAG0AZQBuAHQAIAB5AG8AdQAgAHIAZQBjAGUAaQB2AGUAZAAgAHcAaQB0AGgAIAB0AGgAZQAgAHMAbwBmAHQAdwBhAHIAZQAuAA0ACgANAAoARwBlAG4AZQByAGEAbAAgAGwAaQBjAGUAbgBzAGUAIAB0AGUAcgBtAHMAIABhAG4AZAAgAHUAcwBhAGcAZQAgAHIAaQBnAGgAdABzACAAYwBhAG4AIABiAGUAIAB2AGkAZQB3AGUAZAAgAGEAdAAgAHcAdwB3AC4AbABpAG4AbwB0AHkAcABlAC4AYwBvAG0ALwBsAGkAYwBlAG4AcwBlAC4ADQAKAA0ACgBHAGUAbgBlAHIAZQBsAGwAZQAgAEwAaQB6AGUAbgB6AGIAZQBkAGkAbgBnAHUAbgBnAGUAbgAgAHUAbgBkACAATgB1AHQAegB1AG4AZwBzAHIAZQBjAGgAdABlACAAZgBpAG4AZABlAG4AIABTAGkAZQAgAHUAbgB0AGUAcgAgAHcAdwB3AC4AbABpAG4AbwB0AHkAcABlAC4AYwBvAG0ALwBsAGkAYwBlAG4AcwBlAC4ADQAKAA0ACgBQAG8AdQByACAAcABsAHUAcwAgAGQAJwBpAG4AZgBvAHIAbQBhAHQA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ABkAIP/yABoAIf/xABsAIv/wABwAI//wAB0AJf/wAB4AJv/vAB8AJ//uACAAKf/uACEAKv/tACIAK//tACMALP/rACQALf/rACUAL//rACYAMP/rACcAMv/pACgAM//pACkANP/pACoANf/oACsANv/nACwAOP/nAC0AOv/mAC4AO//mAC8AO//lADAAPf/kADEAPv/kADIAP//kADMAQP/jADQAQv/iADUAQ//iADYARP/hADcARv/gADgAR//gADkASP/fADoASf/fADsAS//eADwATP/eAD0ATv/dAD4AT//dAD8AUP/bAEAAUf/bAEEAU//bAEIAVP/aAEMAVf/ZAEQAVv/ZAEUAV//ZAEYAWf/YAEcAWv/XAEgAW//XAEkAXP/WAEoAXv/WAEsAYP/UAEwAYP/UAE0AYf/UAE4AY//UAE8AZf/SAFAAZf/SAFEAZv/SAFIAaP/RAFMAav/QAFQAa//PAFUAa//PAFYAbf/PAFcAbv/OAFgAcP/NAFkAcf/NAFoAcv/NAFsAc//LAFwAdf/LAF0Adv/LAF4Ad//KAF8Aef/JAGAAev/JAGEAfP/IAGIAff/IAGMAff/HAGQAfv/HAGUAgf/GAGYAgv/GAGcAg//EAGgAg//EAGkAhf/EAGoAh//DAGsAiP/CAGwAiP/CAG0Aiv/CAG4AjP/BAG8Ajf/AAHAAjv+/AHEAj/+/AHIAkP+/AHMAkv+9AHQAlP+9AHUAlf+9AHYAlv+9AHcAl/+7AHgAmf+7AHkAmv+7AHoAm/+6AHsAm/+5AHwAnv+4AH0An/+4AH4AoP+4AH8Aof+3AIAAo/+2AIEApP+2AIIApf+2AIMApv+0AIQAp/+0AIUAqf+zAIYAqv+zAIcArP+yAIgArf+yAIkArv+xAIoAr/+xAIsAsf+wAIwAsv+vAI0Asv+vAI4AtP+vAI8Atv+tAJAAt/+tAJEAuP+tAJIAuf+sAJMAu/+rAJQAvP+rAJUAvf+rAJYAvv+qAJcAwP+pAJgAwf+oAJkAwv+oAJoAxP+oAJsAxf+mAJwAxv+mAJ0Ax/+mAJ4Ayf+mAJ8Ayv+kAKAAy/+kAKEAzP+jAKIAzv+jAKMAz/+iAKQA0P+hAKUA0f+hAKYA0/+hAKcA1P+gAKgA1f+fAKkA1v+fAKoA2P+fAKsA2f+dAKwA2v+dAK0A3P+cAK4A3f+c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CD5ZuQAMAAP0QQsABwAMABcADAAnAAwANwAMAEcADAAFXTAxJRQOAiMiJic3HgEzMjY1ETMBqhs1UDVVahF2Bi0hNid+xCpOOyNOVRwjKklAAdsAAAEATwAAArgCxAAMAGO7AAEABgAAAAQruAABELgACtAAuAAARVi4AAAvG7kAAAAQPlm4AABFWLgABC8buQAEABA+WbgAAEVYuAAHLxu5AAcACD5ZuAAARVi4AAsvG7kACwAIPlm7AAMAAgAJAAQrMDETMxEzATMJASMBIxEjT34GASWq/rUBYbH+zQd+AsT+1AEs/rn+gwFc/qQAAAEATwAAAfoCxAAFADW7AAEABgAAAAQrALgAAEVYuAAALxu5AAAAED5ZuAAARVi4AAQvG7kABAAIPlm5AAIAA/QwMRMzESEVIU9+AS3+VQLE/a5yAAEAUgAAA0wCxAAOALy4AA8vuAAGL7gADxC4AADQuAAAL7gABhC5AAUABvS6AAIAAAAFERI5uAAGELgACNC4AAgvuAAAELkADAAG9LgABRC4ABDcALgAAEVYuAAALxu5AAAAED5ZuAAARVi4AAMvG7kAAwAQPlm4AABFWLgABS8buQAFAAg+WbgAAEVYuAAJLxu5AAkACD5ZuAAARVi4AA0vG7kADQAIPlm6AAIABQAAERI5ugAIAAUAABESOboADAAFAAAREjkwMRMzGwEzESMRIwMjAyMRI1LAvb++eALXWNcCeALE/hAB8P08Akz9tAJM/bQAAAAAAQBPAAACzQLEAAsAi7gADC+4AAMvuAAMELgAANC4AAAvuAADELkABgAG9LgAABC5AAkABvS4AAYQuAAN3AC4AABFWLgAAC8buQAAABA+WbgAAEVYuAAELxu5AAQAED5ZuAAARVi4AAYvG7kABgAIPlm4AABFWLgACi8buQAKAAg+WboAAwAGAAAREjm6AAkABgAAERI5MDETMwEzETMRIwEjESNPpwFXAn6g/qICfgLE/fICDv08Ah/94QACACn/7gMYAtYAEwAnAMm4ACgvuAAeL7gAKBC4AADQuAAAL0ELAAkAHgAZAB4AKQAeADkAHgBJAB4ABV24AB4QuQAKAAb0uAAAELkAFAAG9EELAAYAFAAWABQAJgAUADYAFABGABQABV24AAoQuAAp3AC4AABFWLgABS8buQAFABA+WbgAAEVYuAAP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//8ALP/0AhICxAImAEgAAAAHAEMAnQAA//8ALP/0AhICxAImAEgAAAAHANYAnQAA//8ALP/0AhICxAImAEgAAAAHAI4AnQAA//8ARgAAATMCxAImANUAAAAGAI31AAAA////0gAAAL4CxAImANUAAAAGAEMMAAAA////zAAAATgCxAImANUAAAAGANYAAAAA////zgAAATYCxAImANUAAAAGAI4AAAAA//8ARAAAAfoCvAImAFEAAAAHANcAnQAA//8ALP/0AjYCxAImAFIAAAAHAI0ArwAA//8ALP/0AjYCxAImAFIAAAAHAEMArwAA//8ALP/0AjYCxAImAFIAAAAHANYArwAA//8ALP/0AjYCxAImAFIAAAAHAI4ArwAA//8ALP/0AjYCvAImAFIAAAAHANcArwAA//8ARP/0AfoCxAImAFgAAAAHAI0AnQAA//8ARP/0AfoCxAImAFgAAAAHAEMAnQAA//8ARP/0AfoCxAImAFgAAAAHANYAnQAA//8ARP/0AfoCxAImAFgAAAAHAI4AnQAAAAEAKf+CAigCxAALAEi7AAQABQAFAAQruAAEELgAANC4AAUQuAAJ0AC4AABFWLgACi8buQAKABA+WbsAAQACAAIABCu4AAIQuAAG0LgAARC4AAjQMDEBMxUjESMRIzUzNTMBYcfHcsbGcgH5YP3pAhdgywAAAgAoAZABaALQABMAHwDNuAAgL7gAGi+4ACAQuAAA0LgAAC9BCwAJABoAGQAaACkAGgA5ABoASQAaAAVduAAaELkACgAH9LgAABC5ABQAB/RBCwAGABQAFgAUACYAFAA2ABQARgAUAAVduAAKELgAIdwAuAAARVi4ABcvG7kAFwAOPlm4AABFWLgABS8buQAFABA+WbgAFxC5AA8AAvRBCwAIAA8AGAAPACgADwA4AA8ASAAPAAVduAAFELkAHQAC9EELAAgAHQAYAB0AKAAdADgAHQBIAB0ABV0wMRM0PgIzMh4CFRQOAiMiLgI3FBYzMjY1NCYjIgYoGSw6ISE6LBkZLDohITosGU4wIiIwMCIiMAIwITosGRksOiEhOiwZGSw6ISIwMCIiMDAAAgBO/6wCDAIvABsAIgC8uwAfAAUAFgAEK7sADwAHABAABCu4AA8QuAAA0LgADxC4AAbQuAAQELgAGdC4ABAQuAAc0EELAAYAHwAW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AQs0KwwgESEp5rkSDhAcB1N5ckQQDA4OtgM/Ow4RKyA8NBMTGRRz/agQCz0IFAAA//8AAAAAAuYC+wImAh0AAAAHAckBAgAA////4gAAATgC+wImAXcAAAAGAck3AAAA////4gAAAYoC+wImAXgAAAAGAckyAAAA//8AAgAAA4UC+wImAh4AAAAHAckBAAAA//8AAP7HAuYBjgImAh0AAAAHAisBCgAA////4v7HAUEBjgImAXcAAAAGAis7AAAA////4v7HAYoBjgImAXgAAAAGAitKAAAA//8AAv7HA4UBjgImAh4AAAAHAisA+wAA//8AAP60AfsBtAImAScAAABHAisA1wAVLNoskv///+L+xwHAAbQCJgEoAAAABgIraQAAAP///+L+xwH4AbQCJgEpAAAABgIragAAAP//AAD+tAIyAbQCJgEqAAAARwIrANYAFSzNLKL//wAlAAABqQL7AiYBLwAAAAYByVQAAAD//wAmAAACOgL7AiYBMAAAAAYByVIAAAD////x/zoBTQL7AiYBMwAAAAYByUwAAAD////y/zoBnwL7AiYBNAAAAAYByUgAAAD////x/zoBXQLkAiYBMwAAAAYCJhgAAAD////y/zoBnwLkAiYBNAAAAAYCJhIAAAD//wAAAAADXALkAiYCHwAAAAcCJgHqAAD////iAAAB/QLkAiYCIAAAAAcCJgCCAAD////iAAACdQLkAiYCIQAAAAYCJnkAAAD//wAAAAAD1ALkAiYCIgAAAAcCJgHoAAAAAQAAAAAC5wLTACAAf7gAIS+4AAEvuAAhELgAGNC4ABgvuAABELkAEQAF9LoACwAYABEREjm4ABgQuQAbAAX0uAARELgAItwAuAAARVi4AAkvG7kACQAQPlm4AABFWLgAEi8buQASAAg+WbsACwAEAAYABCu4ABIQuQAAAAP0uAAGELgAGdC4ABkvMDElNTQuAisBNRMXBzMyHgIdASEiLgI9ATMVFB4CMwJ2EyArGHrCXpgKKEs6Iv2nJzYiD3IGCQ0GdF8kKRUFZQE0P+sSLlA93BgoNh2plREVCgMAAP///+IAAAGjAtMCBgFgAAD////iAAACOQLTAgYBYQAAAAEAAgAAA4MC1AAzAMW4ADQvuAADL0ELAAkAAwAZAAMAKQADADkAAwBJAAMABV24ADQQuAAr0LgAKy+4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AAkAAgAKAAQruwATAAIAAgAEK7gACRC4AAzQMDEXJiMiBhUUFjsBFSM1My4BNTQ2MzIWFz0SEg8UGx0fqS0IDiwtDBsLjQUREQ8aNTULGhEdLAQDAAH/8gMhABUDzgADAB26AAEAAAADK7gAARC4AAXcALsAAQABAAIABCswMQMzFSMOIyMDzq0AAAAAAf/y/rkAFf9mAAMAHboAAQAAAAMruAABELgABdwAuwABAAEAAgAEKzAxBzMVIw4jI5qtAAH/qAKXAE4DOQAZARq4ABovuAAJL7gAGhC4ABbQuAAWL7gAA9xBGwAGAAMAFgADACYAAwA2AAMARgADAFYAAwBmAAMAdgADAIYAAwCWAAMApgADALYAAwDGAAMADV1BBQDVAAMA5QADAAJdQQUA2gAJAOoACQACXUEbAAkACQAZAAkAKQAJADkACQBJAAkAWQAJAGkACQB5AAkAiQAJAJkACQCpAAkAuQAJAMkACQANXbgACRC4AA3QuAANL7gACRC4ABDcuAAb3AC4AABFWLgABi8buQAGABA+WbgAE9xBBQDZABMA6QATAAJdQRsACAATABgAEwAoABMAOAATAEgAEwBYABMAaAATAHgAEwCIABMAmAATAKgAEwC4ABMAyAATAA1dMDEDDgEVFBYzMjY1NCYnNx4BFRQGIyImNTQ2Nx4KEBwZGxgJCBAOES0lKioZEQMtChkTFB8fEw8XCwwLKBQkMS8gGisOAAAC//sB+AEBAvsADAAUAGq4ABUvuAANL7gAFRC4AAHQuAABL7gAE9y4AAPQuAANELgACty6AAQAAQAKERI5uAAW3AC4AABFWLgAAi8buQACABI+WbsAFAACAAsABCu6AAcAEAADK7gAFBC4AADQugAEABAABxESOTAxAzM1MxU+ATMyFh0BITc0JiMiBgczBSYxDysZKzH++tYbFhovBX8CKNOBFxQ0Kk9HIBcpJQAA////ZgMfAJAExgImAcEAAAAHAbwAHgD2////cQMOAJAE7wInAcEAAAEtAAYBuwAA////cQMfAJAE9AImAcEAAAAHAbv//gEH////cgMfAJEEiwImAcEBAAAHAb7/9gEE////cQMfAJAEvQImAcEAAAAHAb8ACQDw////cQMOAJAEaQImAb4AAAAHAcEAAACn////cQMfAJAErQImAcEAAAAHAcYAAADf////mgMgAG0E5wImAcQAAAAHAbsAAAD6////mwMgAG4EgQImAcQAAAAHAb4AAQD6////SAMgAGMEygImAcQAAAAHAbwAAAD6////fgMgAG0EuQImAcQAAAAHAb8AAwDs////pAMgAFgEtAImAcQAAAAHAcIAAAFG////mv4gAG3/rAImAcUAAAAHAcAAAP7/////mv3BAG3/rAImAcUAAAAHAb0AAP8HAAEAHQAAAk4CzAAJAFu4AAovuAAIL7kAAQAF9LgAChC4AATQuAAEL7kABwAF9LgAARC4AAvcALgAAEVYuAAALxu5AAAAED5ZuAAARVi4AAEvG7kAAQAIPlm5AAMAA/S4AAfQuAAI0DAxAREhNTMRMxEzEQJO/c/NcoACzP00dAGd/mMCWAAAAAABAB4AAALmAswAHgCIuAAfL7gAEC+5ABMABfS6AAMAEAATERI5uAAfELgACdC4AAkvuQAMAAX0uAATELgAINwAuAAARVi4ABEvG7kAEQAQPlm4AABFWLgAAC8buQAAAAg+WbgAAEVYuAAGLxu5AAYACD5ZuQAIAAP0ugADAAYACBESObgADNC4AA3QuAAW0LgAF9AwMSEiJicOASMhNTMRMxEzMjY1ETMRFBY7ATIWHQEUBiMCpSg3EBFCJv5hznJaFw5zJTIjEAwNDyoZIiF0AZ3+YxwYAiT+BCg0EAs9CBQAAP//AB0AAAJOAtQCJgHYAAAABwHDAPz/UP//AB4AAALmAtQCJgHZAAAABwHDAQf/UP//AB0AAAJOA0sCJgHYAAAABwHEASj/d///AB4AAALmA0sCJgHZAAAABwHEAST/d///AB3++AJOAswCJgHYAAAABwHFASQAAP//AB7++ALmAswCJgHZAAAABwHFASsAAAADAB0AAAJOAvUACwATAB0A9rsAGwAFABgABCu7ABUABQAcAAQrugAJAAwAAyu6ABIAGAAbERI5uAAVELgAH9wAuAAARVi4AAYvG7kABgASPlm4AABFWLgAAi8buQACABA+WbgAAEVYuAAVLxu5ABUACD5ZuAAGELgAD9xBBQDZAA8A6QAPAAJdQRsACAAPABgADwAoAA8AOAAPAEgADwBYAA8AaAAPAHgADwCIAA8AmAAPAKgADwC4AA8AyAAPAA1duAAU0LgAFC+4AB3QuAAdL7kACgAC9LgAE9y4AADQ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DV26AJcApwCZERI5ugCbAD0AABESObgAmRC4AJ3QugCgAKcAmRESObgAlBC4AKHQugC0AMgArRESObgAwBC4ALXQQRsABgC7ABYAuwAmALsANgC7AEYAuwBWALsAZgC7AHYAuwCGALsAlgC7AKYAuwC2ALsAxgC7AA1dQQUA1QC7AOUAuwACXboAwgDIAK0REjm4AMgQuADD0LoAxgA9AAAREjm4AI0QuADN0LgAzS+6AM8AiQCNERI5uACJELgA0dC4ANEvugDTAD0AABESOboA1ADIAK0REjm6ANkApwCZERI5ugDcAIkAzBESOQC4AABFWLgAWS8buQBZABI+WbgAAEVYuABCLxu5AEIADD5ZuAAARVi4AEQvG7kARAAMPlm4AABFWLgAci8buQByAAw+WbgAAEVYuACJLxu5AIkADD5ZuAAARVi4AI0vG7kAjQAMPlm4AABFWLgAQC8buQBAAAw+WbgAAEVYuABwLxu5AHAADD5ZugDdACoAAyu6AE4AegADK7sAsAACAM0ABCu6AKIAAgADK7sAyQACAMMABCu6AJgAnQADK7gAsBC4AArQuAAKL7gAKhC4ABPQuAATL7gAKhC4ACbQuAAmL7gAsBC4ADHQuACJELkARwAC9EELAAgARwAYAEcAKABHADgARwBIAEcABV24AE4QuABT0LgAUy+4AE4QuABj0LgAYy+4AEcQuABt0LgAbS+6AIEAQABZERI5uAB6ELgAhtC4AIYvugCMAEAAWRESOboAjwCJAEcREjm4AMkQuACU0LgAlC+6AJUAiQBHERI5uADJELgAl9C4AJcvuACiELgAntC4AJ4vuACZ3LoAmwDDAMkREjm4AMMQuACf0LgAny+6AKAAogCeERI5ugChAM0AsBESObgAbRC4AKrQugC0AMkAlBESOboAtQCJAEcREjm4AKIQuAC/0LoAwADNALAREjm4AKIQuADC0LgAwi+4AJ0QuADE0LgAxC+6AMYAwwDJERI5uACZELgAyNC4AMgvugDLAM0AsBESObgAzRC4ANDQuADdELgA1NC4ANQvMDEBFAcVFCMiLwEmIyIVFB8BFhUULwEGFRQXHgEXFhUUIyInJicuAScHIyI1ND8BNjU0IyIPAQYjIj0BJicmNTQ3NTQzMh8BFjMyNTQvASY1NDMyHwE2NzY3NjMyFRQHBgcGFRQX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AHkAegB7AHwAfQB+AH8AgACBAIIAgwCEAIUAhgCHAIgAiQCKAIsAjACNAI4AjwCQAJEAkgCTAJQAlQCWAQMAmACZAJoAmwCcAJ0AngEEAKAAoQCiAKMApAClAKYApwEFAKkAqgCrAK0ArgCvALAAsQCyALMAtAC1ALYAtwC4ALkAugC7ALwBBgC+AL8AwADBAMIBBwDEAMUAxgDHAMgAyQDKAMsAzADNAM4AzwDQANEA0wDUANUA1gDXANgA2QEIANsA3ADdAN4A3wDgAOEA4gDkAOsA5gDpAO0A4wDlAOwA5wDqAO4A6AC9APEA8gDzAPUA9AD2AO8A8AEJAQoBCwEMAQ0BDgEPARABEQESARMBFAEVARYBFwEYARkBGgEbARwBHQEeAR8BIAEhASIBIwEkASUBJgEnASgBKQEqASsBLAEtAS4BLwEwATEBMgEzATQBNQE2ATcBOAE5AToBOwE8AT0BPgE/AUABQQFCAUMBRAFFAUYBRwFIAUkBSgFLAUwBTQFOAU8BUAFRAVIBUwFUAVUBVgFXAVgBWQFaAVsBXAFdAV4BXwFgAWEBYgFjAWQBZQFmAWcBaAFpAWoBawFsAW0BbgFvAXABcQFyAXMBdAF1AXYBdwF4AXkBegF7AXwBfQF+AX8BgAGBAYIBgwGEAYUBhgGHAYgBiQGKAYsBjAGNAY4BjwGQAZEBkgGTAZQBlQGWAZcBmAGZAZoBmwGcAZ0BngGfAaABoQGiAaMBpAGlAaYBpwGoAakBqgGrAawBrQGuAa8BsAGxAbIBswG0AbUBtgG3AbgBuQG6AbsBvAG9Ab4BvwHAAcEBwgHDAcQBxQHGAccByAHJAcoBywHMAc0BzgHPAdAB0QHSAdMB1AHVAdYB1wHYAdkB2gHbAdwB3QHeAd8B4AHhAeIB4wHkAeUB5gHnAegB6QHqAesB7AHtAe4B7wHwAfEB8gHzAfQB9QH2AfcB+AH5AfoB+wH8Af0B/gH/AgACAQICAgMCBAIFAgYCBwIIAgkCCgILAgwCDQIOAg8CEAIRAhICEwIUAhUCFgIXAhgCGQIaAhsCHAIdAh4CHwIgAiECIgIjAiQCJQImAicCKAIpAioCKwIsAi0CLgIvAjACMQIyAjMCNAI1AjYCNwI4AjkCOgI7AjwCPQI+Aj8CQAUubnVsbAd1bmkwMEI1B3VuaTIxMjYHdW5pMjIwNgRFdXJvDnBlcmlvZGNlbnRlcmVkBm1hY3Jvbgllc3RpbWF0ZWQJYWZpaTYxMjg5B3VuaTI1Q0MHdW5pMjAwQwd1bmkyMDBEB3VuaTIwMEUHdW5pMjAwRgd1bmkyMDJBB3VuaTIwMkIHdW5pMjAyQwd1bmkyMDJEB3VuaTIwMkUHdW5pMjAwMgd1bmkyMDAzB3VuaTIwMDkHdW5pMjAwQQd1bmkwNjIxB3VuaTA2MjIHdW5pRkU4Mgd1bmkwNjIzB3VuaUZFODQHdW5pMDYyNAd1bmlGRTg2B3VuaTA2MjUHdW5pRkU4OAd1bmkwNjI2B3VuaUZFOEIHdW5pRkU4Qwd1bmlGRThBB3VuaTA2MjcHdW5pRkU4RQd1bmkwNjI4B3VuaUZFOTEHdW5pRkU5Mgd1bmlGRTkwB3VuaTA2MjkHdW5pRkU5NAd1bmkwNjJBB3VuaUZFOTcHdW5pRkU5OAd1bmlGRTk2B3VuaTA2MkIHdW5pRkU5Qgd1bmlGRTlDB3VuaUZFOUEHdW5pMDYyQwd1bmlGRTlGB3VuaUZFQTAHdW5pRkU5RQd1bmkwNjJEB3VuaUZFQTMHdW5pRkVBNAd1bmlGRUEyB3VuaTA2MkUHdW5pRkVBNwd1bmlGRUE4B3VuaUZFQTYHdW5pMDYyRgd1bmlGRUFBB3VuaTA2MzAHdW5pRkVBQwd1bmkwNjMxB3VuaUZFQUUHdW5pMDYzMgd1bmlGRUIwB3VuaTA2MzMHdW5pRkVCMwd1bmlGRUI0B3VuaUZFQjIHdW5pMDYzNAd1bmlGRUI3B3VuaUZFQjgHdW5pRkVCNgd1bmkwNjM1B3VuaUZFQkIHdW5pRkVCQwd1bmlGRUJBB3VuaTA2MzYHdW5pRkVCRgd1bmlGRUMwB3VuaUZFQkUHdW5pMDYzNwd1bmlGRUMzB3VuaUZFQzQHdW5pRkVDMgd1bmkwNjM4B3VuaUZFQzcHdW5pRkVDOAd1bmlGRUM2B3VuaTA2MzkHdW5pRkVDQgd1bmlGRUNDB3VuaUZFQ0EHdW5pMDYzQQd1bmlGRUNGB3VuaUZFRDAHdW5pRkVDRQd1bmkwNjQxB3VuaUZFRDMHdW5pRkVENAd1bmlGRUQyB3VuaTA2NDIHdW5pRkVENwd1bmlGRUQ4B3VuaUZFRDYHdW5pMDY0Mwd1bmlGRURCB3VuaUZFREMHdW5pRkVEQQd1bmkwNjQ0B3VuaUZFREYHdW5pRkVFMAd1bmlGRURFB3VuaTA2NDUHdW5pRkVFMwd1bmlGRUU0B3VuaUZFRTIHdW5pMDY0Ngd1bmlGRUU3B3VuaUZFRTgHdW5pRkVFNgd1bmkwNjQ3B3VuaUZFRTkHdW5pRkVFQgd1bmlGRUVDB3VuaUZFRUEHdW5pMDY0OAd1bmlGRUVFB3VuaTA2NDkHdW5pRkJFOAd1bmlGQkU5B3VuaUZFRjAHdW5pMDY0QQd1bmlGRUYzB3VuaUZFRjQHdW5pRkVGMgd1bmkwNjcxB3VuaUZCNTEHdW5pMDY3OQd1bmlGQjY4B3VuaUZCNjkHdW5pRkI2Nwd1bmkwNjdFB3VuaUZCNTgHdW5pRkI1OQd1bmlGQjU3B3VuaTA2ODYHdW5pRkI3Qwd1bmlGQjdEB3VuaUZCN0IHdW5pMDY4OAd1bmlGQjg5B3VuaTA2OTEHdW5pRkI4RAd1bmkwNjk4B3VuaUZCOEIHdW5pMDZBNAd1bmlGQjZDB3VuaUZCNkQHdW5pRkI2Qgd1bmkwNkE5B3VuaUZCOTAHdW5pRkI5MQd1bmlGQjhGB3VuaTA2QUYHdW5pRkI5NAd1bmlGQjk1B3VuaUZCOTMHdW5pMDZCQQd1bmlGQjlGB3VuaTA2QkUHdW5pRkJBQwd1bmlGQkFEB3VuaUZCQUIHdW5pMDZDMAd1bmlGQkE1B3VuaTA2QzEHdW5pRkJBOAd1bmlGQkE5B3VuaUZCQTcHdW5pMDZDMgx1bmkwNkMyLmZpbmEHdW5pMDZDMwx1bmkwNkMzLmZpbmEHdW5pMDZDQwd1bmlGQkZFB3VuaUZCRkYHdW5pRkJGRAd1bmkwNkQyB3VuaUZCQUYHdW5pMDZEMwd1bmlGQkIxB3VuaTA2RDUMdW5pMDZENS5maW5hB3VuaTA2NDAOdW5pMDY0MC5uYXJyb3cMdW5pMDY0MC5sb25nB3VuaTA2NEIHdW5pMDY0Qwd1bmkwNjREB3VuaTA2NEUHdW5pMDY0Rgd1bmkwNjUwB3VuaTA2NTEHdW5pMDY1Mgd1bmkwNjUzB3VuaTA2NTQHdW5pMDY1NQd1bmkwNjcwB3VuaTA2NTYHdW5pMDY1OAd1bmkwNjE1C3VuaTA2NEMwNjUxC3VuaTA2NEQwNjUxC3VuaTA2NEIwNjUxC3VuaTA2NEUwNjUxC3VuaTA2NEYwNjUxC3VuaTA2NTAwNjUxC3VuaTA2NTEwNjcwC3VuaTA2NTQwNjUxC3VuaTA2NTQwNjRFC3VuaTA2NTQwNjRDC3VuaTA2NTQwNjRGC3VuaTA2NTQwNjUyC3VuaTA2NTUwNjUwC3VuaTA2NTUwNjREB3VuaUZFRkIHdW5pRkVGQwd1bmlGRUY1B3VuaUZFRjYHdW5pRkVGNwd1bmlGRUY4B3VuaUZFRjkHdW5pRkVGQQt1bmkwNjQ0MDY3MRB1bmkwNjQ0MDY3MS5maW5hB3VuaUZERjIPdW5pMDY0NDA2NDQwNjQ3B3VuaUZERkENdW5pRkRGQS5GYXJzaQd1bmkwNjYwB3VuaTA2NjEHdW5pMDY2Mgd1bmkwNjYzB3VuaTA2NjQHdW5pMDY2NQd1bmkwNjY2B3VuaTA2NjcHdW5pMDY2OAd1bmkwNjY5DHVuaTA2NjAucG51bQx1bmkwNjYxLnBudW0MdW5pMDY2Mi5wbnVtDHVuaTA2NjMucG51bQx1bmkwNjY0LnBudW0MdW5pMDY2NS5wbnVtDHVuaTA2NjYucG51bQx1bmkwNjY3LnBudW0MdW5pMDY2OC5wbnVtDHVuaTA2NjkucG51bQd1bmkwNkYwB3VuaTA2RjEHdW5pMDZGMgd1bmkwNkYzB3VuaTA2RjQHdW5pMDZGNQd1bmkwNkY2B3VuaTA2RjcHdW5pMDZGOAd1bmkwNkY5DHVuaTA2RjAucG51bQx1bmkwNkYxLnBudW0MdW5pMDZGMi5wbnVtDHVuaTA2RjMucG51bQx1bmkwNkY0LnBudW0MdW5pMDZGNS5wbnVtDHVuaTA2RjYucG51bQx1bmkwNkY3LnBudW0MdW5pMDZGOC5wbnVtDHVuaTA2RjkucG51bQx1bmkwNkY0LlVyZHUMdW5pMDZGNy5VcmR1EHVuaTA2RjQuVXJkdXBudW0QdW5pMDZGNy5VcmR1cG51bQd1bmkwNjZBB3VuaTA2NkIHdW5pMDY2Qwd1bmkwNjBDB3VuaTA2MUIHdW5pMDYxRgd1bmlGRDNFB3VuaUZEM0YHdW5pMDZENAd1bmkwNjZEB3VuaTI3NEEGeHguYmVoC3h4LmJlaC5maW5hBnh4LmZlaAt4eC5mZWguaW5pdAt4eC5mZWgubWVkaQt4eC5mZWguZmluYQZ4eC5x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ADwACABJAEkACQBVAFUACgBZAFoACwBcAFwADQC1ALYADgHwAfAAEAHyAfMAEQH1AfUAEwH3AfgAFAABA1wDZgACAAwAggAdAAAF+gAABfoAAQX6AAAF+gAABfoAAQX6AAAF+gAABfoAAAX6AAAF+gABBfoAAAX6AAEF+gAABfoAAAX6AAAF+gAABfoAAAX6AAAF+gAABfoAAAX6AAAF+gAABfoAAAX6AAAF+gAABfoAAAX6AAEF+gABBfoAtgawBwoGtgdYBrwHXga8B14GvAdeBrwHXgbCBrYGwga2BsgHZAbIB2QGzga2Bg4GDgYOBg4Gzga2BsgHXgbIB14F8AcEBeQF5AXkBeQF8AcEBg4GDgYOBg4F9gcKBg4GDgYOBg4F9gcKBfYHCgYOBg4GDgYOBfYHCgXkB2oF5AXkBeQF5AXkB2oF5AdqBeQGDgXkBg4F5AdqBg4HagYOBg4GDgYOBg4HagXkBwoF5AcKBg4HCgYOBwoF5AdwBeQHcAYOB3AGDgd2BtQG4AbaBuYG2gbmBtQG4AbgBuAG5gbmBuYG5gbgBuAG1AbgBuwG8gbsBvIG1AbgBuAG4AbyBvIG8gbyBuAG4Ab4BvIG+AbyBvgG8gb4BvIG+AbyBvgG8gb4BvIG/gbyBwQHfAcEBwoHBAXqBwQHfAcKB3wHCgcKBwoHggcKB3wHEAcKBeoF6gXqBeoHEAcKBvIHiAXqBeoF6gXqBvIHiAb4BwoGDgYOBg4GDgb4BwoF9geOBg4GDgYOBg4F9geOBxAHlAcWBfYHFgX2BxAHlAcWB44GDgYOBg4GDgcWB5oF5AYOBeQGDgcQB6AHFgemBeQGDgcWBrYHFga2BwQGtgXkB6wF5AYOBwQGtgcEB3wF5AXkBeQF5AcEB3wGvAdeBrwHXgccBwoHIgYOByIGDgccBwoF8AeyBeQHuAXkB7gF8AeyBeQHagXkB3AF5AdwBeQHagciBwoHIgcKByIHcAciB3AGDgdwBg4HcAcoBwoF6gXqBeoF6gcoBwoHLgcKBg4GDgYOBg4HLgcKBwoHCgYOBg4GDgYOBwoHCgcEB74HBAfEBxAHoAcQB6AHFgfKBzQH0AYOBg4GDgYOBeQGDgXkBeQHOgfWBeQGDgYOBg4F5AYOBg4GDgYOBg4HBAa2BeQF5AXkBeQHBAa2BeQHCgXkBrYHQAcKBeQGtgXkBg4F5AYOB0YH3AdMB+IHUgdeAAIAAQG7AdcAAAACAAIA+AD4AAABBgG6AAEAAQEgASoAAgAMAIIAHQAAAoQAAAKEAAEChAAAAoQAAAKEAAEChAAAAoQAAAKEAAAChAAAAoQAAQKEAAAChAABAoQAAAKEAAAChAAAAoQAAAKEAAAChAAAAoQAAAKEAAAChAAAAoQAAAKEAAAChAAAAoQAAAKEAAAChAABAoQAAQKEAAwAGgAkAC4AOABCAEwAVgBgAGoAdAB+AJAAAgIkAiQCKgJaAAICGgIaAiACUAACAhACEAIcAkYAAgIGAgYCEgI8AAIB/AH8Ag4CMgACAfIB8gIEAigAAgHoAegB7gIkAAIB3gHeAeQCGgACAdQB1AHsAhYAAgHKAcoB4gIMAAQB3gIIAeQCDgHqAhQB8AIaAAMB0gH8AdgCAgHeAggAAgABAbsB1wAAAAIAAQHYAeMAAAABAJoAvAABAAwAagAXAAABUAAAAeAAAAFQAAAB5gAAAVAAAAHgAAAB7AAAAfIAAAH4AAAB4AAAAewAAAFQAAABUAAAAVAAAAFQAAABUAAAAVAAAAFQAAAB8gAAAfIAAAHyAAAB8gAAAfIAFwGgAaYBrAGyAbgBvgHEAbIBygG+AdAB1gHcAeIB6AHuAfQB+gIAAgYCDAISAhgAAgAFAbsBvAAAAb4BvwACAcEBxAAEAcYBxgAIAcgB1QAJAAIABQG7AbwAAAG+Ab8AAgHBAcQABAHGAcYACAHIAdUACQABADQAVgABAAwAJgAGAAAAcgAAAHIAAAB4AAAAfgAAAHgAAAB4AAYAUgBqAHAAdgB8AIIAAgAFAb0BvQAAAcABwAABAcUBxQACAccBxwADAdYB1wAEAAIABQG9Ab0AAAHAAcAAAQHFAcUAAgHHAccAAwHWAdcABAABAAD/BgABAAAAAAABAAAAQQABAAAALQABAAD/mwABAA//UgABAAD/UgABAA/+7QABAA/+lwABAiYAAAABAQ7/dAABAQ4AMgABARgAZAABARgAMgABBKAAAAABA7YAAAABAooAAAABAJb/OAABAPoAAAABASz/OAABASwAAAABBJ8AAAABA4UAAAABAlYAAAABAJYAAAABAAD/8QABAAD/+wABAAD/4gABABH/6gABAAD/9gABAAAA+gABAAAA3QABAAAAZQABAAAA3AABAAAApQABAAAAzgABAAAAoQABAAAAzQABAAABAgABAAABfQABAAABbQABAAABYAABAAABAAABAAABfAABAAABIgABAAABcgABAAABlwABAAABQQABAAABtAABAAABswABAAABqgABALf+9wABAMj/BgABAHgAyAABAPoAMgABAHgAMgABAH3/nAABAu7/OAABAfT/OAABAu4AAAABAfQAAAABAZD/OAABAZAAAAABAV4AAAABALUAOQABAMj/OAABAMgAAAABAV7/OAABAPr/OAABASwAZAABAJYAZAABAV7/agABAMj/agABAUH/OAABAOv/OAABAJb/nAABAEf/OAABADL/OAABAGT/OAABALkAAAABAHgAAAABAHj/BgABAJb+ogABAJb/BgABAJX/BgABAMj+ogABAQQAAAABASz+1AABAPr/BgABAVgAAAABAQ3/JAABAUYAAAABAPj+1AABAI4AAAABAGQAAAABAJb+1AABAQj/BgABAQ3/BgABARv+1AABATb+1AABAOD/BgABAEsAAAABACsAAAABAAAACgCiApIAAmFyYWIADmxhdG4AjAAyAANBUkEgABZGQVIgAEpVUkQgAGQAAP//AAsAAAAIABAABAAVABkAGgAdACEAJQAMAAD//wAJAAEACQARAAUAFgAeACIAJgANAAD//wAKAAIACgASAAYAFwAbAB8AIwAnAA4AAP//AAoAAwALABMABwAYABwAIAAkACgADwAEAAAAAP//AAEAFAApY2FsdAD4Y2FsdAEAY2FsdAEGY2FsdAEMY2NtcAESY2NtcAEYY2NtcAEeY2NtcAEkZGxpZwEqZGxpZwEwZGxpZwE2ZGxpZwE8ZmluYQFCZmluYQFIZmluYQFOZmluYQFUZnJhYwFaZnJhYwFgZnJhYwFmZnJhYwFsZnJhYwFyaW5pdAF4aW5pdAF+aW5pdAGEaW5pdAGKaXNvbAGQbG9jbAGWbG9jbAGcbG9jbAGibWVkaQGobWVkaQGubWVkaQG0bWVkaQG6cG51bQHAcG51bQHGcG51bQHMcG51bQHScmxpZwHYcmxpZwHecmxpZwHkcmxpZwHqAAAAAgAMAA0AAAABAA0AAAABAA0AAAABAA0AAAABAAMAAAABAAMAAAABAAMAAAABAAMAAAABAAkAAAABAAkAAAABAAkAAAABAAkAAAABAAQAAAABAAQAAAABAAQAAAABAAQAAAABAAoAAAABAAoAAAABAAoAAAABAAoAAAABAAoAAAABAAYAAAABAAYAAAABAAYAAAABAAYAAAABAAcAAAABAAAAAAABAAEAAAABAAIAAAABAAUAAAABAAUAAAABAAUAAAABAAUAAAABAAsAAAABAAsAAAABAAsAAAABAAsAAAABAAgAAAABAAgAAAABAAgAAAABAAgAEQAkACwANAA8AEQATABUAFwAZABsAHQAfACEAIwAmACgAKgAAQABAAEAjAABAAEAAQCSAAEAAQABAJgABAABAAEAtAABAAEAAQHOAAEAAQABA4oAAQABAAEElgAGAAEAAQWiAAQACQABBogABAABAAEG5gAEAAAAAQcKAAEAAQABB1QABgABAAEHlAAGAQEAAwh6CIwIoAABAAEAAQraAAEAAQABCuAAAQEBAAEK5gACAAgAAQFwAAEAAQFvAAIACAABAeUAAQABAeQAAgAOAAQB5QIOAewCDwACAAMB5AHkAAAB/gH+AAECAAIBAAIAAQESAAsAHAAuAEAAUgBkAHYAiADCAMwA9gEIAAIABgAMAcwAAgHBAdEAAgHEAAIABgAMAcoAAgHBAdMAAgHEAAIABgAMAcsAAgHBAdcAAgHFAAIABgAMAc0AAgHBAdIAAgHEAAIABgAMAc4AAgHBAdQAAgHEAAIABgAMAc8AAgHBAdYAAgHFAAcAEAAWABwAIgAoAC4ANAHKAAIBvAHLAAIBvQHMAAIBuwHNAAIBvgHOAAIBvwHPAAIBwAHQAAIBxgABAAQB1QACAcQABQAMABIAGAAeACQB0QACAbsB0gACAb4B0wACAbwB1AACAb8B1QACAcIAAgAGAAwB1gACAcAB1wACAb0AAQAEAdAAAgHBAAIAAgG7AcIAAAHEAcYACAACAHYAOAEIAQoBDAEOARIBFAEYARoBHgEiASYBKgEuATABMgE0ATYBOgE+AUIBRgFKAU4BUgFWAVoBXgFiAWYBagFuAXMBcwF1AXkBfQF/AYMBhwGLAY0BjwGRAZUBmQGdAZ8BowGlAakBqwGtAbEBswG1AbcAAgA3AQcBBwAAAQkBCQABAQsBCwACAQ0BDQADAQ8BDwAEARMBEwAFARUBFQAGARkBGQAHARsBGwAIAR8BHwAJASMBIwAKAScBJwALASsBKwAMAS8BLwANATEBMQAOATMBMwAPATUBNQAQATcBNwARATsBOwASAT8BPwATAUMBQwAUAUcBRwAVAUsBSwAWAU8BTwAXAVMBUwAYAVcBVwAZAVsBWwAaAV8BXwAbAWMBYwAcAWcBZwAdAWsBawAeAW8BcAAfAXQBdAAhAXYBdgAiAXoBegAjAX4BfgAkAYABgAAlAYQBhAAmAYgBiAAnAYwBjAAoAY4BjgApAZABkAAqAZIBkgArAZYBlgAsAZoBmgAtAZ4BngAuAaABoAAvAaQBpAAwAaYBpgAxAaoBqgAyAawBrAAzAa4BrgA0AbIBsgA1AbQBtAA2AbYBtgA3AAIASgAiAREBFwEdASEBJQEpAS0BOQE9AUEBRQFJAU0BUQFVAVkBXQFhAWUBaQFtAXIBcgF4AXwBggGGAYoBlAGYAZwBogGoAbAAAgAhAQ8BDwAAARUBFQABARsBGwACAR8BHwADASMBIwAEAScBJwAFASsBKwAGATcBNwAHATsBOwAIAT8BPwAJAUMBQwAKAUcBRwALAUsBSwAMAU8BTwANAVMBUwAOAVcBVwAPAVsBWwAQAV8BXwARAWMBYwASAWcBZwATAWsBawAUAW8BcAAVAXYBdgAXAXoBegAYAYABgAAZAYQBhAAaAYgBiAAbAZIBkgAcAZYBlgAdAZoBmgAeAaABoAAfAaYBpgAgAa4BrgAhAAIASgAiARABFgEcASABJAEoASwBOAE8AUABRAFIAUwBUAFUAVgBXAFgAWQBaAFsAXEBcQF3AXsBgQGFAYkBkwGXAZsBoQGnAa8AAgAhAQ8BDwAAARUBFQABARsBGwACAR8BHwADASMBIwAEAScBJwAFASsBKwAGATcBNwAHATsBOwAIAT8BPwAJAUMBQwAKAUcBRwALAUsBSwAMAU8BTwANAVMBUwAOAVcBVwAPAVsBWwAQAV8BXwARAWMBYwASAWcBZwATAWsBawAUAW8BcAAVAXYBdgAXAXoBegAYAYABgAAZAYQBhAAaAYgBiAAbAZIBkgAcAZYBlgAdAZoBmgAeAaABoAAfAaYBpgAgAa4BrgAhAAMAAQAYAAEAEgAAAAEAAAAOAAEAAQFwAAIAIwEGAQ8AAAESARUACgEYARsADgEeAR8AEgEiASMAFAEmAScAFgEqASsAGAEuATcAGgE6ATsAJAE+AT8AJgFCAUMAKAFG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" ,
    "Roboto-Medium.ttf":"AAEAAAAWAQAABABgRFNJR3mY7RoAAeAIAAAVZEdERUYXzxk8AAHE9AAAAHBHUE9TgZR3/gABxWQAAAxIR1NVQrxJJMUAAdGsAAAOMkxJTk/i+xgjAAHf4AAAAChMVFNI/MqnIQAAOkgAAAIyT1MvMidOuT4AAAHoAAAAYFZETVjxGtxFAAA8fAAAC7pjbWFwxdTSsQAAKGgAAA1+Y3Z0IAmXAhgAAEpUAAAAKGZwZ20GWZw3AABI4AAAAXNnYXNwABMACQAAAkgAAAAQZ2x5ZqjmHJUAAFM0AAFfqGhlYWTreEC1AAABbAAAADZoaGVhCUEDzwAAAaQAAAAkaG10eH9mHVsAAEp8AAAIuGtlcm4Niw0yAAHClAAAAl5sb2Nh0rt6kgAANegAAARebWF4cARXD04AAAHIAAAAIG5hbWX+pO0VAAACWAAAJg1wb3N0cYf+swABstwAAA+1cHJlcJlpJRkAAEg4AAAAqAABAAAAAQAAPjBmCF8PPPUAGQPoAAAAAMN5b44AAAAAxJKNjP8//cEE/wT0AAEACQACAAAAAAAAAAEAAAUA/bwAAAVJ/z/+mwT/AAEAAAAAAAAAAAAAAAAAAAIuAAEAAAIuAx8AFwByAAUAAQAAAAAACgAAAgALuwACAAEAAwI2ArwABQAEArwCigAAAIwCvAKKAAAB3QAyAPoAAAEAAAAAAAAAAACAACCvwACgSgAAAAgAAAAATElOTwAgAAD+/AL8/xQDXAUAAkQgAABBAAAAAAHgAsQAAAAgAAAAAAADAAgAAgAMAAH//wADAAAAHgFuAAEAAAAAAAAC1AAAAAEAAAAAAAEACALUAAEAAAAAAAIABALcAAEAAAAAAAMAIALgAAEAAAAAAAQADQMAAAEAAAAAAAUAEgMNAAEAAAAAAAYADAMfAAEAAAAAAAcA5gMrAAEAAAAAAAgAFQQRAAEAAAAAAAkAIgQmAAEAAAAAAAoDwwRIAAEAAAAAAAsAFwgLAAEAAAAAAAwAJQgiAAEAAAAAAA0DzwhHAAEAAAAAAA4AHwwWAAMAAQQJAAAFqAw1AAMAAQQJAAEAEBHdAAMAAQQJAAIACBHtAAMAAQQJAAMAQBH1AAMAAQQJAAQAGhI1AAMAAQQJAAUAJBJPAAMAAQQJAAYAGBJzAAMAAQQJAAcBzBKLAAMAAQQJAAgAKhRXAAMAAQQJAAkARBSBAAMAAQQJAAoHhhTFAAMAAQQJAAsALhxLAAMAAQQJAAwAShx5AAMAAQQJAA0HnhzDAAMAAQQJAA4APiRhUGFydCBvZiB0aGUgZGlnaXRhbGx5IGVuY29kZWQgbWFjaGluZSByZWFkYWJsZSBvdXRsaW5lIGRhdGEgZm9yIHByb2R1Y2luZyB0aGUgVHlwZWZhY2VzIHByb3ZpZGVkIGlzIGNvcHlyaWdodGVkIKkgMTk4OCAtIDIwMDcgTGlub3R5cGUgR21iSCwgd3d3Lmxpbm90eXBlLmNvbS4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gVGhpcyBzb2Z0d2FyZSBpcyB0aGUgcHJvcGVydHkgb2YgTGlub3R5cGUgR21iSCwgYW5kIG1heSBub3QgYmUgcmVwcm9kdWNlZCwgdXNlZCwgZGlzcGxheWVkLCBtb2RpZmllZCwgZGlzY2xvc2VkIG9yIHRyYW5zZmVycmVkIHdpdGhvdXQgdGhlIGV4cHJlc3Mgd3JpdHRlbiBhcHByb3ZhbCBvZiBMaW5vdHlwZSBHbWJILiBUaGUgZGlnaXRhbGx5IGVuY29kZWQgbWFjaGluZSByZWFkYWJsZSBzb2Z0d2FyZSBmb3IgcHJvZHVjaW5nIHRoZSBUeXBlZmFjZXMgbGljZW5zZWQgdG8geW91IGlzIGNvcHlyaWdodGVkIChjKSAxOTg5LCAxOTkwIEFkb2JlIFN5c3RlbXMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuIFRoaXMgc29mdHdhcmUgaXMgdGhlIHByb3BlcnR5IG9mIEFkb2JlIFN5c3RlbXMgSW5jb3Jwb3JhdGVkIGFuZCBpdHMgbGljZW5zb3JzLCBhbmQgbWF5IG5vdCBiZSByZXByb2R1Y2VkLCB1c2VkLCBkaXNwbGF5ZWQsIG1vZGlmaWVkLCBkaXNjbG9zZWQgb3IgdHJhbnNmZXJyZWQgd2l0aG91dCB0aGUgZXhwcmVzcyB3cml0dGVuIGFwcHJvdmFsIG9mIEFkb2JlLkphbm5hIExUQm9sZExpbm90eXBlIEdtYkg6SmFubmEgTFQgQm9sZDoyMDA3SmFubmEgTFQgQm9sZFZlcnNpb24gMS4wMDsgMjAwN0phbm5hTFQtQm9sZEphbm5hIGlzIGEgdHJhZGVtYXJrIG9mIExpbm90eXBlIENvcnAuIGFuZCBtYXkgYmUgcmVnaXN0ZXJlZCBpbiBjZXJ0YWluIGp1cmlzZGljdGlvbnMuIEF2ZW5pciBpcyBhIHRyYWRlbWFyayBvZiBMaW5vdHlwZSBHbWJIIHJlZ2lzdGVyZWQgaW4gdGhlIFUuUy4gUGF0ZW50IGFuZCBUcmFkZW1hcmsgT2ZmaWNlIGFuZCBtYXkgYmUgcmVnaXN0ZXJlZCBpbiBjZXJ0YWluIG90aGVyIGp1cmlzZGljdGlvbnMuQWRvYmUgLyBMaW5vdHlwZSBHbWJITmFkaW5lIENoYWhpbmUgYW5kIEFkcmlhbiBGcnV0aWdlckphbm5hIGlzIGRlc2lnbmVkIGJ5IExlYmFuZXNlIGRlc2lnbmVyIE5hZGluZSBDaGFoaW5lLiBJdCBpcyBiYXNlZCBvbiB0aGUgS3VmaSBzdHlsZSBidXQgaW5jb3Jwb3JhdGVzIGFzcGVjdHMgb2YgUnVxYWEgYW5kIE5hc2toIGluIHRoZSBsZXR0ZXIgZm9ybSBkZXNpZ25zLiBUaGlzIHJlc3VsdHMgaW4gd2hhdCBjb3VsZCBiZSBsYWJlbGVkIGFzIGEgaHVtYW5pc3QgS3VmaSwgYSBLdWZpIHN0eWxlIHRoYXQgcmVmZXJzIHRvIGhhbmR3cml0aW5nIHN0cnVjdHVyZXMgYW5kIHNsaWdodCBtb2R1bGF0aW9uIHRvIGFjaGlldmUgYSBtb3JlIGluZm9ybWFsIGFuZCBmcmllbmRseSB2ZXJzaW9uIG9mIHRoZSBvdGhlcndpc2UgaGlnaGx5IHN0cnVjdHVyZWQgYW5kIGdlb21ldHJpYyBLdWZpIHN0eWxlcy4gSmFubmEsIHdoaWNoIG1lYW5zICJoZWF2ZW4iIGluIEFyYWJpYyB3YXMgZmlyc3QgZGVzaWduZWQgaW4gMjAwNCBhcyBhIHNpZ25hZ2UgZmFjZSBmb3IgdGhlIEFtZXJpY2FuIFVuaXZlcnNpdHkgb2YgQmVpcnV0LiBTbywgdGhlIGRlc2lnbiBpcyB0YXJnZXRlZCB0b3dhcmRzIHNpZ25hZ2UgYXBwbGljYXRpb25zIGJ1dCBpcyBhbHNvIHF1aXRlIHN1aXRlZCBmb3IgdmFyaW91cyBhcHBsaWNhdGlvbnMgZnJvbSBsb3cgcmVzb2x1dGlvbiBkaXNwbGF5IGRldmljZXMgdG8gYWR2ZXJ0aXNpbmcgaGVhZGxpbmVzIHRvIGNvcnBvcmF0ZSBpZGVudGl0eSBhbmQgYnJhbmRpbmcgYXBwbGljYXRpb25zLiBUaGUgTGF0aW4gY29tcGFuaW9uIHRvIEphbm5hIGlzIEFkcmlhbiBGcnV0aWdlcidzIEF2ZW5pciB3aGljaCBpcyBpbmNsdWRlZCBhbHNvIGluIHRoZSBmb250LiBUaGUgZm9udCBhbHNvIGluY2x1ZGVzIHN1cHBvcnQgZm9yIEFyYWJpYywgUGVyc2lhbiwgYW5kIFVyZHUgYXMgd2VsbCBhcyBwcm9wb3J0aW9uYWwgYW5kIHRhYnVsYXIgbnVtZXJhbHMgZm9yIHRoZSBzdXBwb3J0ZWQgbGFuZ3VhZ2VzLmh0dHA6Ly93d3cubGlub3R5cGUuY29taHR0cDovL3d3dy5saW5vdHlwZS5jb20vZm9udGRlc2lnbmVyc05PVElGSUNBVElPTiBPRiBMSUNFTlNFIEFHUkVFTUVOVA0KDQpZb3UgaGF2ZSBvYnRhaW5lZCB0aGlzIGZvbnQgc29mdHdhcmUgZWl0aGVyIGRpcmVjdGx5IGZyb20gTGlub3R5cGUgR21iSCBvciB0b2dldGhlciB3aXRoIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIGJ5IG9uZSBvZiBMaW5vdHlwZSdzIGxpY2Vuc2Vlcy4NCg0KVGhpcyBmb250IHNvZnR3YXJlIGlzIGEgdmFsdWFibGUgYXNzZXQgb2YgTGlub3R5cGUgR21iSC4gVW5sZXNzIHlvdSBoYXZlIGVudGVyZWQgaW50byBhIHNwZWNpZmljIGxpY2Vuc2UgYWdyZWVtZW50IGdyYW50aW5nIHlvdSBhZGRpdGlvbmFsIHJpZ2h0cywgeW91ciB1c2Ugb2YgdGhpcyBmb250IHNvZnR3YXJlIGlzIGxpbWl0ZWQgdG8geW91ciB3b3Jrc3RhdGlvbiBmb3IgeW91ciBvd24gdXNlLiBZb3UgbWF5IG5vdCBjb3B5IG9yIGRpc3RyaWJ1dGUgdGhpcyBmb250IHNvZnR3YXJlLiBJZiB5b3UgaGF2ZSBhbnkgcXVlc3Rpb25zIHJlZ2FyZGluZyB5b3VyIGxpY2Vuc2UgdGVybXMsIHBsZWFzZSByZXZpZXcgdGhlIGxpY2Vuc2UgYWdyZWVtZW50IHlvdSByZWNlaXZlZCB3aXRoIHRoZSBzb2Z0d2FyZS4NCg0KR2VuZXJhbCBsaWNlbnNlIHRlcm1zIGFuZCB1c2FnZSByaWdodHMgY2FuIGJlIHZpZXdlZCBhdCB3d3cubGlub3R5cGUuY29tL2xpY2Vuc2UuDQoNCkdlbmVyZWxsZSBMaXplbnpiZWRpbmd1bmdlbiB1bmQgTnV0enVuZ3NyZWNodGUgZmluZGVuIFNpZSB1bnRlciB3d3cubGlub3R5cGUuY29tL2xpY2Vuc2UuDQoNClBvdXIgcGx1cyBkJ2luZm9ybWF0aW9ucyBjb25jZXJuYW50IGxlIGNvbnRyYXQgZCd1dGlsaXNhdGlvbiBkdSBsb2dpY2llbCBkZSBwb2xpY2VzLCB2ZXVpbGxleiBjb25zdWx0ZXIgbm90cmUgc2l0ZSB3ZWIgd3d3Lmxpbm90eXBlLmNvbS9saWNlbnNlLg0KDQpMaW5vdHlwZSBHbWJIIGNhbiBiZSBjb250YWN0ZWQgYXQ6DQoNClRlbC46ICs0OSgwKTYxNzIgNDg0LTQxOGh0dHA6Ly93d3cubGlub3R5cGUuY29tL2xpY2Vuc2UAUABhAHIAdAAgAG8AZgAgAHQAaABlACAAZABpAGcAaQB0AGEAbABsAHkAIABlAG4AYwBvAGQAZQBkACAAbQBhAGMAaABpAG4AZQAgAHIAZQBhAGQAYQBiAGwAZQAgAG8AdQB0AGwAaQBuAGUAIABkAGEAdABhACAAZgBvAHIAIABwAHIAbwBkAHUAYwBpAG4AZwAgAHQAaABlACAAVAB5AHAAZQBmAGEAYwBlAHMAIABwAHIAbwB2AGkAZABlAGQAIABpAHMAIABjAG8AcAB5AHIAaQBnAGgAdABlAGQAIACpACAAMQA5ADgAOAAgAC0AIAAyADAAMAA3ACAATABpAG4AbwB0AHkAcABlACAARwBtAGIASAAsACAAdwB3AHcALgBsAGkAbgBvAHQAeQBwAGUALgBjAG8AbQAuACAAQQBsAGwAIAByAGkAZwBoAHQAcwAgAHIAZQBzAGUAcgB2AGUAZAAuACAAVABoAGkAcwAgAHMAbwBmAHQAdwBhAHIAZQAgAGkAcwAgAHQAaABlACAAcAByAG8AcABlAHIAdAB5ACAAbwBmACAATABpAG4AbwB0AHkAcABlACAARwBtAGIASAAsACAAYQBuAGQAIABtAGEAeQAgAG4AbwB0ACAAYgBlACAAcgBlAHAAcgBvAGQAdQBjAGUAZAAsACAAdQBzAGUAZAAsACAAZABpAHMAcABsAGEAeQBlAGQALAAgAG0AbwBkAGkAZgBpAGUAZAAsACAAZABpAHMAYwBsAG8AcwBlAGQAIABvAHIAIAB0AHIAYQBuAHMAZgBlAHIAcgBlAGQAIAB3AGkAdABoAG8AdQB0ACAAdABoAGUAIABlAHgAcAByAGUAcwBzACAAdwByAGkAdAB0AGUAbgAgAGEAcABwAHIAbwB2AGEAbAAgAG8AZgAgAEwAaQBuAG8AdAB5AHAAZQAgAEcAbQBiAEgALgAgAFQAaABlACAAZABpAGcAaQB0AGEAbABsAHkAIABlAG4AYwBvAGQAZQBkACAAbQBhAGMAaABpAG4AZQAgAHIAZQBhAGQAYQBiAGwAZQAgAHMAbwBmAHQAdwBhAHIAZQAgAGYAbwByACAAcAByAG8AZAB1AGMAaQBuAGcAIAB0AGgAZQAgAFQAeQBwAGUAZgBhAGMAZQBzACAAbABpAGMAZQBuAHMAZQBkACAAdABvACAAeQBvAHUAIABpAHMAIABjAG8AcAB5AHIAaQBnAGgAdABlAGQAIAAoAGMAKQAgADEAOQA4ADkALAAgADEAOQA5ADAAIABBAGQAbwBiAGUAIABTAHkAcwB0AGUAbQBzAC4AIABBAGwAbAAgAFIAaQBnAGgAdABzACAAUgBlAHMAZQByAHYAZQBkAC4AIABUAGgAaQBzACAAcwBvAGYAdAB3AGEAcgBlACAAaQBzACAAdABoAGUAIABwAHIAbwBwAGUAcgB0AHkAIABvAGYAIABBAGQAbwBiAGUAIABTAHkAcwB0AGUAbQBzACAASQBuAGMAbwByAHAAbwByAGEAdABlAGQAIABhAG4AZAAgAGkAdABzACAAbABpAGMAZQBuAHMAbwByAHMALAAgAGEAbgBkACAAbQBhAHkAIABuAG8AdAAgAGIAZQAgAHIAZQBwAHIAbwBkAHUAYwBlAGQALAAgAHUAcwBlAGQALAAgAGQAaQBzAHAAbABhAHkAZQBkACwAIABtAG8AZABpAGYAaQBlAGQALAAgAGQAaQBzAGMAbABvAHMAZQBkACAAbwByACAAdAByAGEAbgBzAGYAZQByAHIAZQBkACAAdwBpAHQAaABvAHUAdAAgAHQAaABlACAAZQB4AHAAcgBlAHMAcwAgAHcAcgBpAHQAdABlAG4AIABhAHAAcAByAG8AdgBhAGwAIABvAGYAIABBAGQAbwBiAGUALgBKAGEAbgBuAGEAIABMAFQAQgBvAGwAZABMAGkAbgBvAHQAeQBwAGUAIABHAG0AYgBIADoASgBhAG4AbgBhACAATABUACAAQgBvAGwAZAA6ADIAMAAwADcASgBhAG4AbgBhACAATABUACAAQgBvAGwAZABWAGUAcgBzAGkAbwBuACAAMQAuADAAMAA7ACAAMgAwADAANwBKAGEAbgBuAGEATABUAC0AQgBvAGwAZABKAGEAbgBuAGEAIABpAHMAIABhACAAdAByAGEAZABlAG0AYQByAGsAIABvAGYAIABMAGkAbgBvAHQAeQBwAGUAIABDAG8AcgBwAC4AIABhAG4AZAAgAG0AYQB5ACAAYgBlACAAcgBlAGcAaQBzAHQAZQByAGUAZAAgAGkAbgAgAGMAZQByAHQAYQBpAG4AIABqAHUAcgBpAHMAZABpAGMAdABpAG8AbgBzAC4AIABBAHYAZQBuAGkAcgAgAGkAcwAgAGEAIAB0AHIAYQBkAGUAbQBhAHIAawAgAG8AZgAgAEwAaQBuAG8AdAB5AHAAZQAgAEcAbQBiAEgAIAByAGUAZwBpAHMAdABlAHIAZQBkACAAaQBuACAAdABoAGUAIABVAC4AUwAuACAAUABhAHQAZQBuAHQAIABhAG4AZAAgAFQAcgBhAGQAZQBtAGEAcgBrACAATwBmAGYAaQBjAGUAIABhAG4AZAAgAG0AYQB5ACAAYgBlACAAcgBlAGcAaQBzAHQAZQByAGUAZAAgAGkAbgAgAGMAZQByAHQAYQBpAG4AIABvAHQAaABlAHIAIABqAHUAcgBpAHMAZABpAGMAdABpAG8AbgBzAC4AQQBkAG8AYgBlACAALwAgAEwAaQBuAG8AdAB5AHAAZQAgAEcAbQBiAEgATgBhAGQAaQBuAGUAIABDAGgAYQBoAGkAbgBlACAAYQBuAGQAIABBAGQAcgBpAGEAbgAgAEYAcgB1AHQAaQBnAGUAcgBKAGEAbgBuAGEAIABpAHMAIABkAGUAcwBpAGcAbgBlAGQAIABiAHkAIABMAGUAYgBhAG4AZQBzAGUAIABkAGUAcwBpAGcAbgBlAHIAIABOAGEAZABpAG4AZQAgAEMAaABhAGgAaQBuAGUALgAgAEkAdAAgAGkAcwAgAGIAYQBzAGUAZAAgAG8AbgAgAHQAaABlACAASwB1AGYAaQAgAHMAdAB5AGwAZQAgAGIAdQB0ACAAaQBuAGMAbwByAHAAbwByAGEAdABlAHMAIABhAHMAcABlAGMAdABzACAAbwBmACAAUgB1AHEAYQBhACAAYQBuAGQAIABOAGEAcwBrAGgAIABpAG4AIAB0AGgAZQAgAGwAZQB0AHQAZQByACAAZgBvAHIAbQAgAGQAZQBzAGkAZwBuAHMALgAgAFQAaABpAHMAIAByAGUAcwB1AGwAdABzACAAaQBuACAAdwBoAGEAdAAgAGMAbwB1AGwAZAAgAGIAZQAgAGwAYQBiAGUAbABlAGQAIABhAHMAIABhACAAaAB1AG0AYQBuAGkAcwB0ACAASwB1AGYAaQAsACAAYQAgAEsAdQBmAGkAIABzAHQAeQBsAGUAIAB0AGgAYQB0ACAAcgBlAGYAZQByAHMAIAB0AG8AIABoAGEAbgBkAHcAcgBpAHQAaQBuAGcAIABzAHQAcgB1AGMAdAB1AHIAZQBzACAAYQBuAGQAIABzAGwAaQBnAGgAdAAgAG0AbwBkAHUAbABhAHQAaQBvAG4AIAB0AG8AIABhAGMAaABpAGUAdgBlACAAYQAgAG0AbwByAGUAIABpAG4AZgBvAHIAbQBhAGwAIABhAG4AZAAgAGYAcgBpAGUAbgBkAGwAeQAgAHYAZQByAHMAaQBvAG4AIABvAGYAIAB0AGgAZQAgAG8AdABoAGUAcgB3AGkAcwBlACAAaABpAGcAaABsAHkAIABzAHQAcgB1AGMAdAB1AHIAZQBkACAAYQBuAGQAIABnAGUAbwBtAGUAdAByAGkAYwAgAEsAdQBmAGkAIABzAHQAeQBsAGUAcwAuACAASgBhAG4AbgBhACwAIAB3AGgAaQBjAGgAIABtAGUAYQBuAHMAIAAiAGgAZQBhAHYAZQBuACIAIABpAG4AIABBAHIAYQBiAGkAYwAgAHcAYQBzACAAZgBpAHIAcwB0ACAAZABlAHMAaQBnAG4AZQBkACAAaQBuACAAMgAwADAANAAgAGEAcwAgAGEAIABzAGkAZwBuAGEAZwBlACAAZgBhAGMAZQAgAGYAbwByACAAdABoAGUAIABBAG0AZQByAGkAYwBhAG4AIABVAG4AaQB2AGUAcgBzAGkAdAB5ACAAbwBmACAAQgBlAGkAcgB1AHQALgAgAFMAbwAsACAAdABoAGUAIABkAGUAcwBpAGcAbgAgAGkAcwAgAHQAYQByAGcAZQB0AGUAZAAgAHQAbwB3AGEAcgBkAHMAIABzAGkAZwBuAGEAZwBlACAAYQBwAHAAbABpAGMAYQB0AGkAbwBuAHMAIABiAHUAdAAgAGkAcwAgAGEAbABzAG8AIABxAHUAaQB0AGUAIABzAHUAaQB0AGUAZAAgAGYAbwByACAAdgBhAHIAaQBvAHUAcwAgAGEAcABwAGwAaQBjAGEAdABpAG8AbgBzACAAZgByAG8AbQAgAGwAbwB3ACAAcgBlAHMAbwBsAHUAdABpAG8AbgAgAGQAaQBzAHAAbABhAHkAIABkAGUAdgBpAGMAZQBzACAAdABvACAAYQBkAHYAZQByAHQAaQBzAGkAbgBnACAAaABlAGEAZABsAGkAbgBlAHMAIAB0AG8AIABjAG8AcgBwAG8AcgBhAHQAZQAgAGkAZABlAG4AdABpAHQAeQAgAGEAbgBkACAAYgByAGEAbgBkAGkAbgBnACAAYQBwAHAAbABpAGMAYQB0AGkAbwBuAHMALgAgAFQAaABlACAATABhAHQAaQBuACAAYwBvAG0AcABhAG4AaQBvAG4AIAB0AG8AIABKAGEAbgBuAGEAIABpAHMAIABBAGQAcgBpAGEAbgAgAEYAcgB1AHQAaQBnAGUAcgAnAHMAIABBAHYAZQBuAGkAcgAgAHcAaABpAGMAaAAgAGkAcwAgAGkAbgBjAGwAdQBkAGUAZAAgAGEAbABzAG8AIABpAG4AIAB0AGgAZQAgAGYAbwBuAHQALgAgAFQAaABlACAAZgBvAG4AdAAgAGEAbABzAG8AIABpAG4AYwBsAHUAZABlAHMAIABzAHUAcABwAG8AcgB0ACAAZgBvAHIAIABBAHIAYQBiAGkAYwAsACAAUABlAHIAcwBpAGEAbgAsACAAYQBuAGQAIABVAHIAZAB1ACAAYQBzACAAdwBlAGwAbAAgAGEAcwAgAHAAcgBvAHAAbwByAHQAaQBvAG4AYQBsACAAYQBuAGQAIAB0AGEAYgB1AGwAYQByACAAbgB1AG0AZQByAGEAbABzACAAZgBvAHIAIAB0AGgAZQAgAHMAdQBwAHAAbwByAHQAZQBkACAAbABhAG4AZwB1AGEAZwBlAHMALgBoAHQAdABwADoALwAvAHcAdwB3AC4AbABpAG4AbwB0AHkAcABlAC4AYwBvAG0AaAB0AHQAcAA6AC8ALwB3AHcAdwAuAGwAaQBuAG8AdAB5AHAAZQAuAGMAbwBtAC8AZgBvAG4AdABkAGUAcwBpAGcAbgBlAHIAcwBOAE8AVABJAEYASQBDAEEAVABJAE8ATgAgAE8ARgAgAEwASQBDAEUATgBTAEUAIABBAEcAUgBFAEUATQBFAE4AVAANAAoADQAKAFkAbwB1ACAAaABhAHYAZQAgAG8AYgB0AGEAaQBuAGUAZAAgAHQAaABpAHMAIABmAG8AbgB0ACAAcwBvAGYAdAB3AGEAcgBlACAAZQBpAHQAaABlAHIAIABkAGkAcgBlAGMAdABsAHkAIABmAHIAbwBtACAATABpAG4AbwB0AHkAcABlACAARwBtAGIASAAgAG8AcgAgAHQAbwBnAGUAdABoAGUAcgAgAHcAaQB0AGgAIABzAG8AZgB0AHcAYQByAGUAIABkAGkAcwB0AHIAaQBiAHUAdABlAGQAIABiAHkAIABvAG4AZQAgAG8AZgAgAEwAaQBuAG8AdAB5AHAAZQAnAHMAIABsAGkAYwBlAG4AcwBlAGUAcwAuAA0ACgANAAoAVABoAGkAcwAgAGYAbwBuAHQAIABzAG8AZgB0AHcAYQByAGUAIABpAHMAIABhACAAdgBhAGwAdQBhAGIAbABlACAAYQBzAHMAZQB0ACAAbwBmACAATABpAG4AbwB0AHkAcABlACAARwBtAGIASAAuACAAVQBuAGwAZQBzAHMAIAB5AG8AdQAgAGgAYQB2AGUAIABlAG4AdABlAHIAZQBkACAAaQBuAHQAbwAgAGEAIABzAHAAZQBjAGkAZgBpAGMAIABsAGkAYwBlAG4AcwBlACAAYQBnAHIAZQBlAG0AZQBuAHQAIABnAHIAYQBuAHQAaQBuAGcAIAB5AG8AdQAgAGEAZABkAGkAdABpAG8AbgBhAGwAIAByAGkAZwBoAHQAcwAsACAAeQBvAHUAcgAgAHUAcwBlACAAbwBmACAAdABoAGkAcwAgAGYAbwBuAHQAIABzAG8AZgB0AHcAYQByAGUAIABpAHMAIABsAGkAbQBpAHQAZQBkACAAdABvACAAeQBvAHUAcgAgAHcAbwByAGsAcwB0AGEAdABpAG8AbgAgAGYAbwByACAAeQBvAHUAcgAgAG8AdwBuACAAdQBzAGUALgAgAFkAbwB1ACAAbQBhAHkAIABuAG8AdAAgAGMAbwBwAHkAIABvAHIAIABkAGkAcwB0AHIAaQBiAHUAdABlACAAdABoAGkAcwAgAGYAbwBuAHQAIABzAG8AZgB0AHcAYQByAGUALgAgAEkAZgAgAHkAbwB1ACAAaABhAHYAZQAgAGEAbgB5ACAAcQB1AGUAcwB0AGkAbwBuAHMAIAByAGUAZwBhAHIAZABpAG4AZwAgAHkAbwB1AHIAIABsAGkAYwBlAG4AcwBlACAAdABlAHIAbQBzACwAIABwAGwAZQBhAHMAZQAgAHIAZQB2AGkAZQB3ACAAdABoAGUAIABsAGkAYwBlAG4AcwBlACAAYQBnAHIAZQBlAG0AZQBuAHQAIAB5AG8AdQAgAHIAZQBjAGUAaQB2AGUAZAAgAHcAaQB0AGgAIAB0AGgAZQAgAHMAbwBmAHQAdwBhAHIAZQAuAA0ACgANAAoARwBlAG4AZQByAGEAbAAgAGwAaQBjAGUAbgBzAGUAIAB0AGUAcgBtAHMAIABhAG4AZAAgAHUAcwBhAGcAZQAgAHIAaQBnAGgAdABzACAAYwBhAG4AIABiAGUAIAB2AGkAZQB3AGUAZAAgAGEAdAAgAHcAdwB3AC4AbABpAG4AbwB0AHkAcABlAC4AYwBvAG0ALwBsAGkAYwBlAG4AcwBlAC4ADQAKAA0ACgBHAGUAbgBlAHIAZQBsAGwAZQAgAEwAaQB6AGUAbgB6AGIAZQBkAGkAbgBnAHUAbgBnAGUAbgAgAHUAbgBkACAATgB1AHQAegB1AG4AZwBzAHIAZQBjAGgAdABlACAAZgBpAG4AZABlAG4AIABTAGkAZQAgAHUAbgB0AGUAcgAgAHcAdwB3AC4AbABpAG4AbwB0AHkAcABlAC4AYwBvAG0ALwBsAGkAYwBlAG4AcwBlAC4ADQAKAA0ACgBQAG8AdQByACAAcABsAHUAcwAgAGQAJwBpAG4AZgBvAHIAbQBhAHQA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ABkAIP/yABoAIf/xABsAIv/wABwAI//wAB0AJf/wAB4AJv/vAB8AJ//uACAAKf/uACEAKv/tACIAK//tACMALP/rACQALf/rACUAL//rACYAMP/rACcAMv/pACgAM//pACkANP/pACoANf/oACsANv/nACwAOP/nAC0AOv/mAC4AO//mAC8AO//lADAAPf/kADEAPv/kADIAP//kADMAQP/jADQAQv/iADUAQ//iADYARP/hADcARv/gADgAR//gADkASP/fADoASf/fADsAS//eADwATP/eAD0ATv/dAD4AT//dAD8AUP/bAEAAUf/bAEEAU//bAEIAVP/aAEMAVf/ZAEQAVv/ZAEUAV//ZAEYAWf/YAEcAWv/XAEgAW//XAEkAXP/WAEoAXv/WAEsAYP/UAEwAYP/UAE0AYf/UAE4AY//UAE8AZf/SAFAAZf/SAFEAZv/SAFIAaP/RAFMAav/QAFQAa//PAFUAa//PAFYAbf/PAFcAbv/OAFgAcP/NAFkAcf/NAFoAcv/NAFsAc//LAFwAdf/LAF0Adv/LAF4Ad//KAF8Aef/JAGAAev/JAGEAfP/IAGIAff/IAGMAff/HAGQAfv/HAGUAgf/GAGYAgv/GAGcAg//EAGgAg//EAGkAhf/EAGoAh//DAGsAiP/CAGwAiP/CAG0Aiv/CAG4AjP/BAG8Ajf/AAHAAjv+/AHEAj/+/AHIAkP+/AHMAkv+9AHQAlP+9AHUAlf+9AHYAlv+9AHcAl/+7AHgAmf+7AHkAmv+7AHoAm/+6AHsAm/+5AHwAnv+4AH0An/+4AH4AoP+4AH8Aof+3AIAAo/+2AIEApP+2AIIApf+2AIMApv+0AIQAp/+0AIUAqf+zAIYAqv+zAIcArP+yAIgArf+yAIkArv+xAIoAr/+xAIsAsf+wAIwAsv+vAI0Asv+vAI4AtP+vAI8Atv+tAJAAt/+tAJEAuP+tAJIAuf+sAJMAu/+rAJQAvP+rAJUAvf+rAJYAvv+qAJcAwP+pAJgAwf+oAJkAwv+oAJoAxP+oAJsAxf+mAJwAxv+mAJ0Ax/+mAJ4Ayf+mAJ8Ayv+kAKAAy/+kAKEAzP+jAKIAzv+jAKMAz/+iAKQA0P+hAKUA0f+hAKYA0/+hAKcA1P+gAKgA1f+fAKkA1v+fAKoA2P+fAKsA2f+dAKwA2v+dAK0A3P+cAK4A3f+cAK8A3v+bALAA3/+bALEA4f+bALIA4v+aALMA4/+ZALQA5P+YALUA5v+YALYA5/+XALcA6P+WALgA6f+WALkA6/+WALoA7P+WALsA7f+UALwA7v+UAL0A8P+TAL4A8f+TAL8A8v+SAMAA9P+RAMEA9f+RAMIA9v+RAMMA9/+QAMQA+f+PAMUA+v+PAMYA+/+PAMcA/P+NAMgA/v+NAMkA//+MAMoBAP+MAMsBAf+LAMwBA/+LAM0BBP+KAM4BBf+KAM8BBv+JANABCP+IANEBCf+IANIBCv+HANMBDP+GANQBDf+GANUBDv+FANYBD/+FANcBEf+EANgBEv+EANkBE/+DANoBFP+DANsBFv+CANwBF/+BAN0BGP+BAN4BGf+AAN8BG/9/AOABHP9/AOEBHf9/AOIBHv9/AOMBIP99AOQBIf99AOUBIv98AOYBI/98AOcBJf96AOgBJv96AOkBJ/96AOoBKf96AOsBKv95AOwBK/94AO0BLP94AO4BLv93AO8BL/92APABMP92APEBMf91APIBM/91APMBNP91APQBNf90APUBNv9zAPYBOP9zAPcBOf9zAPgBOv9xAPkBO/9xAPoBPf9wAPsBPv9wAPwBP/9vAP0BQf9vAP4BQv9uAP8BQ/9uAAC4AAArALoAAQAEAAIrAboABQADAAIrAb8ABQAvACgAIAAXAA4AAAAIK78ABgAuACgAIAAXAA4AAAAIK78ABwA2ACgAIAAXAA4AAAAIKwC/AAEALwAoACAAFwAOAAAACCu/AAIAOgAvACAAFwAOAAAACCu/AAMAMAAoACAAFwAOAAAACCu/AAQAMwAoACAAFwAOAAAACCsAugAIAAYAByu4AAAgRX1pGES4AAAsS7gACVBYsQEBjlm4Af+FuABEHbkACQADX14tuAABLCAgRWlEsAFgLbgAAiy4AAEqIS24AAMsIEawAyVGUlgjWSCKIIpJZIogRiBoYWSwBCVGIGhhZFJYI2WKWS8gsABTWGkgsABUWCGwQFkbaSCwAFRYIbBAZVlZOi24AAQsIEawBCVGUlgjilkgRiBqYWSwBCVGIGphZFJYI4pZL/0tuAAFLEsgsAMmUFhRWLCARBuwQERZGyEhIEWwwFBYsMBEGyFZWS24AAYsICBFaUSwAWAgIEV9aRhEsAFgLbgAByy4AAYqLbgACCxLILADJlNYsEAbsABZioogsAMmU1gjIbCAioobiiNZILADJlNYIyG4AMCKihuKI1kgsAMmU1gjIbgBAIqKG4ojWSCwAyZTWCMhuAFAioobiiNZILgAAyZTWLADJUW4AYBQWCMhuAGAIyEbsAMlRSMhIyFZGyFZRC24AAksS1NYRUQbISFZLQAAFAB2AGAAdABsAHYAeABmAAAAEv8cAAwBiwAKAeAADALEABIC9AAMAfkAAAHzAAAAwgAAAPoAAAEoAEQCBwB4AlAALwJQAB8DiwAeAuUAMAEoAGEBKAAwASgAEQHPABwCmgA+ASgAJgE7ACIBKABEAYX/9wJQACgCUABBAlAAOwJQAC4CUAAiAlAALAJQACwCUAAqAlAAOQJQACwBKABEASgAJgKaAFACmgA+ApoAUAIHADADIAAgAtIAAAKIAE8CrQApAvcATwJjAE8CPgBPAwoAKQLlAE8BFgBMAfQABQKtAE8CBwBPA54AUgMcAE8DQQApAmMATwNUACkCdgBPAj4AHwI+AAcC0gBMApv//QPVAAACrQAAAnb/8gJjACMBFgBCAYUAAwEWABQCmgBFAfQAAAEE/8YCGQAkAnYARAHiACwCdgAsAj4ALAFgAAwCdgAsAj4ARAEEADUBBP/bAhkARAEEAEYDZgA/Aj4ARAJiACwCdgBEAnYALAGFAEQBvAAZAYUADAI+AEQCBwADAxwAAwIZ//8CBwADAeIAIgEWAAAA3gA8ARb/3QKaAGUC0gAAAtIAAAKtACkCYwBPAxwATwNBACkC0gBMAhkAJAIZACQCGQAkAhkAJAIZACQCGQAkAeIALAI+ACwCPgAsAj4ALAI+ACwBBABGAQT/0gEE/8wBBP/OAj4ARAJiACwCYgAsAmIALAJiACwCYgAsAj4ARAI+AEQCPgBEAj4ARAJRACkBkAAoAlAATgJQAEICUQA1AfQASQJYAB8CYwA4AyAAHAMgABwD6AAoAQQAUwEE/84CUQAjA+j/+gNBACkDLwAtApoAPgJRACMCUQAjAlAADAI+AEQCLAAoAogAGQLlAD4CUQABAmMAWwFdABwBjQAfAvcALgNUACQCYgAkAgcAGwEoAEQCmgA+Ahn/9AJQ//wCUQAbAq0ACAIHAB4CBwAmA+gAVwLSAAAC0gAAA0EAKQPoADIDngAkAfQAAAPoAAACBwA6AgcAOgEoADQBKAA0ApoAPgJRAEUCBwADAnb/8gCn/1oCUAAPASgAHgEoACYCUQAMAlEADAJRAC8BKABEASgANAIHADsEjwAHAtIAAAJjAE8C0gAAAmMATwJjAE8BFgBMARb/1QEW/9cBFv/PA0EAKQNBACkDQQApAtIATALSAEwC0gBMAQQARgEE/8wBBP/KAQT/4gEE/9gBBAA1AQQAGQEEADUBBP/sAQT//wEE/80CBwAJAj4AHwJ2//ICYwAjAvcADQJjAE8BBAABAbwAGQIHAAMB4gAiAmIALAJ2AEQA3gA8AlAAJAGBACgBgQAfAYEAGwN5AB0DeQAgA3kAFwKaAD4CmgBNAlgALAH+AEkBkgAcAAD/uwAA/50AAP+1AAD/oQAA/6sAAP+hAAD/uwAA/5kAAP+PAfQAAAPoAAAAZAAAABQAAAGGABQBBf+7AP//xAEFACkA/wArAhAAOQItADoBBQAmAP8AKQLs//QBQ//iAWz/4gOw//QBBQBKAP8ASwM2AAABQ//iAWz/4gNnAAIB2P/9AdkAAAM2AAABQ//iAWz/4gNnAAIDNgAAAUP/4gFs/+IDZwACAisAAAHw/+IB2v/iAhQAAAIrAAAB8P/iAdr/4gIUAAACKwAAAfD/4gHa/+ICFAAAAewAJQIcACYB7AAlAhwAJgFT//EBgf/yAVP/8QGB//IEmgAAA57/4gPN/+IEwAAABJoAAAOe/+IDzf/iBMAAAARQAAADAv/iAzr/4gR5AAAEUAAAAwL/4gM6/+IEeQAAAukAAAMB/+IDMv/iAwsAAALpAAADAf/iAzL/4gMLAAAB8gAAAd//4gIX/+IB+QAAAfIAAAHf/+ICF//iAfr//wOkAAACQ//iAlf/4gO2AAACyQAAAkP/4gJX/+IDBQACAzcAAAHm/+ICG//iA2UAAAKUAAABPf/iAW3/4gKzAAACsAAAAjH/4gJw/+IC7QAAAnX//wFD/+IBbP/iAqcAAAHY//0B2P/9AuP/4gIp/+IB2QAAAhAAOQItADoC7AAAAUP/4gFs/+IDsAADAuwAAAFD/+IBbP/iA7AAAwEFAA4A/wALAzYAAAFD/+IBbP/iA2cAAgM2AAABQ//iAWz/4gNnAAICKwAAAfD/4gHa/+ICFAAAAewAJQIcACYBU//xAYH/8gFT//EBgf/yA6QAAAJD/+ICV//iA7YAAAMtAAAB5v/iAhv/4gNlAAIDLQAAAgr/3gJJ/9oDZQACAnX//wKnAAAC9AAAAuP/4gIx/+YCdQAAAdj//QHZAAAB2P/9AUP/4gHl/+IBRv/9Adj//QFG//0B2P/9AdkAAALsAAABQ//iAWz/4gOwAAMDegABAb4AAQN6AAEBvgABAdj//QHZAAAAov/iAEH/4gDq/+IAAP+aAAD/SAAA/5oAAP+aAAD/ewAA/5oAAP9xAAD/qQAA/z8AAP+kAAD/pAAA//IAAP/yAAD/qAAA//sAAP9mAAD/cQAA/3EAAP9yAAD/cQAA/3EAAP9xAAD/mgAA/5sAAP9IAAD/fgAA/6QAAP+aAAD/mgKoAB0CyAAeAqgAHQLIAB4CqAAdAsgAHgKoAB0CyAAeAqgAHQLIAB4FSQAABF4AAQQhACMEIQAaAfMAvgHzAMAB8wB3AfMAOgHzAGIB8wA/AfMANwHzAAoB8wAJAfMANwHzAL4BKwBdAXEAJgHiACcBegAqAcQAKAGlAAkB8wAKAfMACQGsABwB8wC+AfMAwAHzAHcB8wA6AiYAIwImADICJgBBAfMACgHzAAkB8wA3AfMAvgErAF0BcQAmAeIAJwH+ACcB8QAXAdcAHgHzAAoB8wAJAawAHAH0AGAB9ABMAb8AOwHLADcCbwBFASgAJgEOACYBNAAyAT4ARAIHADACYwA9AmMAMQFpADkB0gAyAXwAFgM2AAADZwACA6QAAAJD/+ICV//iA7YAAALJAAAC/wACAWUAMQFlADEBZQA1AYsAUwEZAE8BOABgAYH/8gMqAAEDKgABAAQAAAAAAfkCxAADACgALAAwANG6ACwALwADK7oAFgAXAAMruwADAAcAAAAEK7sAIAAHAA8ABCu6AC4AKQADK7gAABC4AAXQuAAFL0ELAAkADwAZAA8AKQAPADkADwBJAA8ABV24AAMQuAAo0LgAKC+4AC4QuAAy3AC4AABFWLgALS8buQAtABA+WbgAAEVYuAAuLxu5AC4ACD5ZuwABAAIAAAAEK7gALRC5ABMAAfRBCwAIABMAGAATACgAEwA4ABMASAATAAVduQAbAAL0uAAuELkAKQAC9LgALRC5ACoAAvQwMTc1MxUvATQ2NzY3PgE3NjU0JyYjIgYHJzY3NjMyFhcWFRQHBgcGBwYVFxEhEQERIRHbNzQCBwUNIg8UBAkWFSAeLQYwBiUlNBsrESQNCicjCAa9/mkByP4Hc0JCdBAcKAwZIg8XCBIRIxkYKjMHRiEhExEkOh8bFiYgExI1tgJg/aACk/08AsQAAAAAAgBE//oA5ALEAAMADwCDuwAKAAYABAAEK0ELAAYACgAWAAoAJgAKADYACgBGAAoABV26AAEABAAKERI5uAABL7kAAAAG9LgAChC4ABHcALgAAEVYuAACLxu5AAIAED5ZuAAARVi4AA0vG7kADQAIPlm5AAcAAfRBCwAHAAcAFwAHACcABwA3AAcARwAHAAVdMDE3IxEzAzQ2MzIWFRQGIyIm0Hh4jC8hIDAvISAw3gHm/YIgLiwgIC4sAAACAHgBvAGPAsQAAwAHAF24AAgvuAAEL7gACBC4AADQuAAAL7kAAQAH9LgABBC5AAUAB/S4AAncALgAAEVYuAAALxu5AAAAED5ZuAAARVi4AAQvG7kABAAQPlm4AALcuAAD0LgABtC4AAfQMDETMxEjEzMRI3hmZrFmZgLE/vgBCP74AAACAC8AAAIhAsQAGwAfAJsAuAAARVi4AAgvG7kACAAQPlm4AABFWLgADC8buQAMABA+WbgAAEVYuAAWLxu5ABYACD5ZuAAARVi4ABovG7kAGgAIPlm7AAMAAgAAAAQruwAHAAIABAAEK7gABxC4AArQuAAHELgADtC4AAQQuAAQ0LgAAxC4ABLQuAAAELgAFNC4AAAQuAAY0LgABBC4ABzQuAADELgAHdAwMTcjNTM3IzUzNzMHMzczBzMVIwczFSMHIzcjByMTBzM3iVplElplHlgeZx5XHlpmEVpkH1ceaB5XkhFnEdFUelTR0dHRVHpU0dHRAZ96egAAAAADAB//rQIjAxIALAA1AEABC7sAMAAGACUABCu7ABUABwAWAAQruwAPAAYAOwAEK7gAFRC4AADQuAAVELgACNC4ABYQuAAe0LgAFhC4ACrQuAAWELgALdBBCwAGADAAFgAwACYAMAA2ADAARgAwAAVdugA1ACUADxESObgAFRC4ADbQQQsACQA7ABkAOwApADsAOQA7AEkAOwAFXboAQAAlAA8REjm4AA8QuABC3AC4AABFWLgAAC8buQAAABA+WbgAAEVYuAAqLxu5ACoAED5ZuAAARVi4ABQvG7kAFAAIPlm4AABFWLgAFy8buQAXAAg+WbgAABC5AAgABPS4ABcQuQAeAAT0ugA1ABcAABESOboAQAAXAAAREjkwMQEzMhYXBy4BIxUXHgMVFA4CBxUjNQYmJzceARc1Jy4DNTQ+Ajc1MwcOARUUHgIXEz4DNTQuAicBPgkzayZTF0AjBCpRPyckPlMwNkJ5LlsYTCoFKkw7IiQ8Tio2NiM3DxghEjYVJRwREx4kEgLQIyJdGR3IAQscLUQzMk03IAVIRwEqMF0iJATTAQweLkMyLUg1IARDsAYvJhccFA0I/rUEEBojFhYeFA4GAAAFAB7/4ANtAuQAEwAfADMAPwBDARO7ADoABwAgAAQruwAqAAcANAAEK7sAGgAHAAAABCu7AAoABwAUAAQrQQsACQAAABkAAAApAAAAOQAAAEkAAAAFXUELAAkAFAAZABQAKQAUADkAFABJABQABV1BCwAGACoAFgAqACYAKgA2ACoARgAqAAVdQQsABgA6ABYAOgAmADoANgA6AEYAOgAFXbgAChC4AEXcALgAAEVYuAAlLxu5ACUAED5ZuAAARVi4AA8vG7kADwAIPlm7AAUAAgAXAAQruwA9AAIALwAEK7gADxC5AB0AAvRBCwAHAB0AFwAdACcAHQA3AB0ARwAdAAVduAAlELkANwAC9EELAAgANwAYADcAKAA3ADgANwBIADcABV0wMSU0PgIzMh4CFRQOAiMiLgIlNCYjIgYVFBYzMjYBND4CMzIeAhUUDgIjIi4CJTQmIyIGFRQWMzI2JRcBJwH5HTNDJydDMx0dM0MnJ0MzHQEUNCYmNDQmJjT9ER0zQycnQzMdHTNDJydDMx0BFDQmJjQ0JiY0ATtT/mBTridDMx0dM0MnJ0MzHR0zQycmNDQmJjQ0AY4nQzMdHTNDJydDMx0dM0MnJjQ0JiY0NPQm/SImAAAAAAMAMP/uAtcC1gAnADcARQEIuwA9AAYACwAEK7sAHwAGADUABCtBCwAGAD0AFgA9ACYAPQA2AD0ARgA9AAVdugAVAAsAPRESObgAFS+5ACsABvS6ABAAFQArERI5ugAkAAsAHxESOUELAAkANQAZADUAKQA1ADkANQBJADUABV0AuAAARVi4ABovG7kAGgAQPlm4AABFWLgAAS8buQABAAg+WbgAAEVYuAAGLxu5AAYACD5ZugAQAAYAGhESOboAJAAGABoREjm6ACcABgAaERI5uAAaELkAKAAE9EELAAgAKAAYACgAKAAoADgAKABIACgABV24AAYQuQBCAAT0QQsABwBCABcAQgAnAEIANwBCAEcAQgAFXTAxJRcjJw4BIyIuAjU0PgI3LgM1ND4CMzIeAhUUDgIHFzczJSIGFRQeAhc+AzU0JgMOAxUUHgIzMjY3Aj6Zm0srYUUvV0IoGCk4IBEdFg0hOEkpKEg3IRgoMxpyT43+eSMyDBQXDA8iHRIuUBIiHBESHygXKT4bp6dRMzAbNU0zIz4zJwwTJCYsGitCKxYUKUArITcuJA17ePYnIA4bGxkKCBUbIBQdJf7UCxccJBcXKBwQLBoAAAAAAQBhAbwAxwLEAAMAIrsAAQAHAAAABCsAuAAARVi4AAAvG7kAAAAQPlm4AALcMDETMxEjYWZmAsT++AAAAQAw/2QBFwLcAA4ALrsABAAHAAsABCtBCwAGAAQAFgAEACYABAA2AAQARgAEAAVdALoADgAIAAMrMDEBBw4BFRQWFwcuATU0NjcBFwE8REQ8VEVNTUUCqARVyGdpx1U3YOB8e+FgAAABABH/ZAD4AtwADgA2uwALAAcABAAEK0ELAAkABAAZAAQAKQAEADkABABJAAQABV24AAsQuAAQ3AC6AAgADgADKzAxFzc+ATU0Jic3HgEVFAYHEQE8REQ8VEVNTUVoBFXIZ2nGVThg4Hx74WAAAAAAAQAcAT8BswLEAA4AXrsAAAAHAAwABCu6AAYADAAAERI5ALgAAEVYuAANLxu5AA0AED5ZuAAARVi4AAMvG7kAAwAOPlm4AABFWLgACS8buQAJAA4+WboAAAADAA0REjm6AAwAAwANERI5MDEBNxcHFwcnByc3JzcXNTMBEocaiFZFVlRDVokaiFQCNixQLHUydnMzcS9QL44AAAAAAQA+ACACXAI+AAsAN7sAAwAHAAAABCu4AAMQuAAG0LgAABC4AAjQALsABAACAAUABCu4AAQQuAAA0LgABRC4AAnQMDEBNTMVMxUjFSM1IzUBGmbc3GbcAWLc3Gbc3GYAAQAm/4IA5gCKAAMAHbsAAQAGAAMABCu4AAEQuAAF3AC6AAAAAgADKzAxNzMDI2x6VWuK/vgAAAABACIAwwEZASkAAwAVugAAAAEAAysAuwADAAIAAAAEKzAxJSM1MwEZ9/fDZgAAAAABAET/+gDkAJQACwBeuwAGAAYAAAAEK0ELAAYABgAWAAYAJgAGADYABgBGAAYABV24AAYQuAAN3AC4AABFWLgACS8buQAJAAg+WbkAAwAB9EELAAcAAwAXAAMAJwADADcAAwBHAAMABV0wMTc0NjMyFhUUBiMiJkQvISAwLyEgMEYgLiwgIC4sAAAAAAH/9//QAYIC9gADADYAuAAARVi4AAIvG7kAAgASPlm4AABFWLgAAy8buQADABA+WbgAAEVYuAABLxu5AAEACD5ZMDEXJwEXSlMBOFMwHgMIIAAAAAIAKP/0AigC0AAbAC8AybgAMC+4ACYvuAAwELgAANC4AAAvQQsACQAmABkAJgApACYAOQAmAEkAJgAFXbgAJhC5AA4ABvS4AAAQuQAcAAb0QQsABgAcABYAHAAmABwANgAcAEYAHAAFXbgADhC4ADHcALgAAEVYuAAHLxu5AAcAED5ZuAAARVi4ABUvG7kAFQAIPlm5ACEAA/RBCwAHACEAFwAhACcAIQA3ACEARwAhAAVduAAHELkAKwAD9EELAAgAKwAYACsAKAArADgAKwBIACsABV0wMRM0PgQzMh4EFRQOBCMiLgQ3FB4CMzI+AjU0LgIjIg4CKBssNzk1FBQ1OTcsGxssNzk1FBQ1OTcsG3gJHDYtLTYcCQkcNi0tNhwJAWJUd1ExGQgIGTFRd1RUd1ExGQgIGTFRd1QhV042Nk5XISFXTjY2TlcAAQBBAAABhALEAAYAObsABAAGAAAABCsAuAAARVi4AAMvG7kAAwAQPlm4AABFWLgABS8buQAFAAg+WboAAAAFAAMREjkwMQEHJzczESMBDIVG1m14Ajp7U7L9PAABADsAAAIVAtAAIACluAAhL7gABi9BCwAJAAYAGQAGACkABgA5AAYASQAGAAVduAAhELgAD9C4AA8vuQAOAAb0uAAGELkAGQAG9LoAHQAPABkREjm4AB7QuAAZELgAItwAuAAARVi4ABQvG7kAFAAQPlm4AABFWLgAHy8buQAfAAg+WbgAFBC5AAsAA/RBCwAIAAsAGAALACgACwA4AAsASAALAAVduAAfELkAHQAE9DAxNwE+AzU0LgIjIgYHJz4DMzIeAhUUBg8BIRUhOwETDBoVDhEcJRUtOgZ+BCc+UjAwUz4kPTDbAUj+Jn8BCgwbHiESFiIYDTMtCjFLMhoZMUwzQ2Esy2wAAAAAAQAu//QCEALQADcA17sAHgAGADEABCtBCwAJADEAGQAxACkAMQA5ADEASQAxAAVdugAXADEAHhESObgAFy+5AAYABvRBCwAJAAYAGQAGACkABgA5AAYASQAGAAVduAAeELgAOdwAuAAARVi4ABIvG7kAEgAQPlm4AABFWLgAIy8buQAjAAg+WbsAAQAEADYABCu4ABIQuQAJAAT0QQsACAAJABgACQAoAAkAOAAJAEgACQAFXboAGwA2AAEREjm4ACMQuQAsAAT0QQsABwAsABcALAAnACwANwAsAEcALAAFXTAxEzMyPgI1NCYjIgYHJz4DMzIeAhUUBgcVHgEVFA4CIyIuAic3HgEzMj4CNTQuAisB3h8ZMicYOC0kOQ1/DCw8SCcuUj4lQDlFRSdCVy8sTj8uDIALODAYKyETHS04Gx0BpwYUJiAqMyklIic6JRIYL0cvOVkOAgpgQjNONRsTKD8sIi0vEB0pGSIrFwgAAAAAAgAiAAACLgLEAAoADgBruwAIAAYAAAAEK7gACBC4AATQuAAAELgAC9C4AAgQuAAQ3AC4AABFWLgAAy8buQADABA+WbgAAEVYuAAJLxu5AAkACD5ZuwAOAAQAAAAEK7gADhC4AAXQuAAAELgAB9C6AAwACQADERI5MDElITUBMxEzFSMVIxEjAzMBT/7TAR2IZ2d4ArGzkHcBvf44bJACGv7iAAABACz/9AIRAsQAJQCnuAAmL7gAGy+4ACYQuAAj0LgAIy+5AAIABvRBCwAJABsAGQAbACkAGwA5ABsASQAbAAVduAAbELkACgAG9LgAJ9wAuAAARVi4ACQvG7kAJAAQPlm4AABFWLgADy8buQAPAAg+WbsABQAEACAABCu4ACQQuQAAAAT0ugACACAABRESObgADxC5ABYAA/RBCwAHABYAFwAWACcAFgA3ABYARwAWAAVdMDEBIQc+ATMyHgIVFA4CIyImJzceATMyPgI1NC4CIyIGBxMhAfn+4wMOKxM0Vz4jJ0VeNlV3GX4MOi4bLSESGy48ISdNIAcBkwJYjQUEIT5WNjlbPyJQUiImLBIhLBolNCEPEhABfgAAAAIALP/0AiQCxAAYACwAyrgALS+4ACMvQQsACQAjABkAIwApACMAOQAjAEkAIwAFXbkACgAG9LoAAAAjAAoREjm4AC0QuAAU0LgAFC+6AAIAFAAKERI5uQAZAAb0QQsABgAZABYAGQAmABkANgAZAEYAGQAFXbgAChC4AC7cALgAAEVYuAAALxu5AAAAED5ZuAAARVi4AA8vG7kADwAIPlm7AAUAAgAoAAQrugACACgABRESObgADxC5AB4AA/RBCwAHAB4AFwAeACcAHgA3AB4ARwAeAAVdMDEBAxc+ATMyHgIVFA4CIyIuAjU0NjcTAxQeAjMyPgI1NC4CIyIOAgG1qgILJRIvTjkfJkNdNjhcQyUlHbV5FCMvGxsvIxQUIy8bGy8jFALE/voCBgYkPlIuOFk/IiE+Wjg5WTABHf4jGy8jFBQjLxsbLyMUFCMvAAEAKgAAAgsCxAAGAC8AuAAARVi4AAAvG7kAAAAQPlm4AABFWLgAAy8buQADAAg+WbgAABC5AAUAA/QwMRMhFQEjASEqAeH+5Y0BIf6mAsRu/aoCUgAAAAADADn/9AIXAtAAJQAzAEMBLLsAKQAGACEABCu7AAUABgAxAAQrQQsACQAxABkAMQApADEAOQAxAEkAMQAFXboACQAxAAUREjm6AD8AMQAFERI5uAA/L0ELAAkAPwAZAD8AKQA/ADkAPwBJAD8ABV25AA4ABvRBCwAGACkAFgApACYAKQA2ACkARgApAAVdugA5ACEAKRESObgAOS+5ABgABvS6AB4AIQApERI5uAAOELgARdwAuAAARVi4AAAvG7kAAAAQPlm4AABFWLgAEy8buQATAAg+WbsALAACADQABCu6AAkANAAsERI5ugAeADQALBESObgAABC5ACYAAvRBCwAIACYAGAAmACgAJgA4ACYASAAmAAVduAATELkAPAAD9EELAAcAPAAXADwAJwA8ADcAPABHADwABV0wMQEyHgIVFAYHFR4DFRQOAiMiLgI1ND4CNzUuATU0PgIXIgYVFBYzMj4CNTQmAyIOAhUUFjMyNjU0LgIBKC1POyI1NhkvJBUmQFgxMldAJhUkLho2NSI7Ty0uMzQtFCMbDzcqGCwgE0M0NEMTICwC0BkvRS05VhACBR8tOiE1TzYbGzZPNSE6LR8FAhBWOS1FLxlmOCgqOQ8bJBUoOP7dEB4pGDM/PzMYKR4QAAIALAAAAiQC0AAYACwAyrgALS+4ABkvuAAtELgACtC4AAovuQAjAAb0QQsABgAjABYAIwAmACMANgAjAEYAIwAFXboAAAAKACMREjlBCwAJABkAGQAZACkAGQA5ABkASQAZAAVduAAZELkAFAAG9LoAAgAKABQREjm4AC7cALgAAEVYuAAPLxu5AA8AED5ZuAAARVi4AAAvG7kAAAAIPlm7ACgAAgAFAAQrugACAAUAKBESObgADxC5AB4AA/RBCwAIAB4AGAAeACgAHgA4AB4ASAAeAAVdMDEzEycOASMiLgI1ND4CMzIeAhUUBgcDEzQuAiMiDgIVFB4CMzI+ApuqAgslEi9OOR8mQ102N11DJSUdtXkUIy8bGy8jFBQjLxsbLyMUAQYCBgYkPlIuN1o/IiE+Wjg5WTD+4wHdGy8jFBQjLxsbLyMUFCMvAAAAAAIARP/6AOQB5wALABcAorsABgAGAAAABCtBCwAGAAYAFgAGACYABgA2AAYARgAGAAVduAAAELgADNC4AAYQuAAS0LgABhC4ABncALgAAEVYuAAPLxu5AA8ADj5ZuAAARVi4AAkvG7kACQAIPlm5AAMAAfRBCwAHAAMAFwADACcAAwA3AAMARwADAAVduAAPELkAFQAB9EELAAgAFQAYABUAKAAVADgAFQBIABUABV0wMTc0NjMyFhUUBiMiJhE0NjMyFhUUBiMiJkQvISAwLyEgMC8hIDAvISAwRiAuLCAgLiwBcyAuLCAgLiwAAgAm/4IA5gHnAAMADwBquwAKAAYABAAEK0ELAAkABAAZAAQAKQAEADkABABJAAQABV24AAoQuAAR3AC4AABFWLgABy8buQAHAA4+WboAAAACAAMruAAHELkADQAB9EELAAgADQAYAA0AKAANADgADQBIAA0ABV0wMTczAyMTNDYzMhYVFAYjIiZselVrHi8hIDAvISAwiv74AhcgLiwgIC4sAAABAFAAKgJKAjQABgAtugAFAAAAAyu4AAUQuAAC0LgABRC4AAjcALoAAgAGAAMrugAEAAYAAhESOTAxEzUlFQ0BFVAB+v6uAVIBC0jhbpeXbgAAAAACAD4AogJcAbwAAwAHABcAuwAEAAIABQAEK7sAAAACAAEABCswMQEVITUFFSE1Alz94gIe/eIBvGZmtGZmAAAAAQBQACoCSgI0AAYALboAAQADAAMruAADELgABdC4AAEQuAAI3AC6AAYAAgADK7oABAACAAYREjkwMQEVBTUtATUCSv4GAVL+rgFTSOFul5duAAAAAgAw//oB7ALWACMALwDNuwAYAAYACQAEK7sAKgAGACQABCtBCwAGACoAFgAqACYAKgA2ACoARgAqAAVdugAAACQAKhESObgAAC9BCwAJAAkAGQAJACkACQA5AAkASQAJAAVduQAjAAb0uAAYELgAMdwAuAAARVi4ABMvG7kAEwAQPlm4AABFWLgALS8buQAtAAg+WbgAExC5AAwAA/RBCwAIAAwAGAAMACgADAA4AAwASAAMAAVduAAtELkAJwAB9EELAAcAJwAXACcAJwAnADcAJwBHACcABV0wMTc1ND4CPwE2NTQmIyIGByc+ATMyHgIVFA4CBw4DHQEHNDYzMhYVFAYjIibSBgwVD00ZMycqNgSADHxhLU05IBIeJxYOFA0GjC8hIDAvISAw0TcXHhgYEE4ZKCcxOCoKYWkaMUkvITIqJhUNFBUbEyaLIC4sICAuLAAAAAACACD/7gMAAtYAEQBgAXC7AFgABwAaAAQruwAFAAcANwAEK7sARgAHAA8ABCu7ACQABwBOAAQrQQsABgAFABYABQAmAAUANgAFAEYABQAFXUELAAkADwAZAA8AKQAPADkADwBJAA8ABV1BCwAJAE4AGQBOACkATgA5AE4ASQBOAAVdugASAE4AJBESOboALwAaACQREjm6AEAADwBGERI5QQsABgBYABYAWAAmAFgANgBYAEYAWAAFXbgAJBC4AGLcALgAAEVYuAA/Lxu5AD8ADj5ZuAAARVi4AB8vG7kAHwAQPlm4AABFWLgAFS8buQAVAAg+WbsASQACACsABCu7ADwAAgAAAAQruABJELgACtC6ABIAFQAfERI5ugAvACsASRESObgAKxC4ADLQugBAAAAAPBESObgAHxC5AFMAAvRBCwAIAFMAGABTACgAUwA4AFMASABTAAVduAAVELkAXQAC9EELAAcAXQAXAF0AJwBdADcAXQBHAF0ABV0wMQEiDgIVFB4CMzI+AjU0JgEOASMiLgI1ND4CMzIeAhUUDgQjIiYnIw4BIyIuAjU0PgIzMhYXMzczBw4BFRQWMzI+AjU0LgIjIg4CFRQeAjMyNjcBkRonGw4DDyIfHCYWCSQBIDagXVCNaj08aItPQn9kPRknMTEtDyokAQIUPDAgNSYVHDNKLyg1DwIIXiUDBgsQEB8YDydFYDk+ZkkoLE9sPzlfJQHIEyEsGQgfHhcWIysVKDT+vUtMN2KJUU+JZDkrVHtPNU42IhIHIhQUIhksPiUsUT8lGh8txQ4cDxITESU4JzxbPh8qTGg9QmhIJyAdAAAAAgAAAAAC0gLEAAcACgBAALgAAEVYuAAALxu5AAAAED5ZuAAARVi4AAIvG7kAAgAIPlm4AABFWLgABi8buQAGAAg+WbsACAAEAAQABCswMQEzASMnIQcjAQsBATRtATGQQv7NQI0B1G1vAsT9PKKiAQ4BIP7gAAAAAwBPAAACWgLEABUAHgApAMG7AB4ABgAAAAQruwAPAAYAJQAEK0ELAAkAJQAZACUAKQAlADkAJQBJACUABV26AAYAJQAPERI5uAAGL7kAGgAG9EELAAkAGgAZABoAKQAaADkAGgBJABoABV26AAoABgAaERI5uAAeELgAH9C4AA8QuAAr3AC4AABFWLgAAC8buQAAABA+WbgAAEVYuAAULxu5ABQACD5ZuwAXAAQAKAAEK7oACgAoABcREjm4AAAQuQAdAAT0uAAUELkAHwAE9DAxEyEyHgIVFAYHFR4DFRQOAisBEzMyNjU0JisBETMyPgI1NCYrAU8BFChOPSZENyE5KBcuS2Ey/35zPz9BSGh0GDcuHkhOeQLEEytEMDxOEQIEHS07IjpNLxQBpDEoLi3+FAYWKSM5KwAAAAEAKf/uAqcC1gAhAI67AAgABgAZAAQrQQsABgAIABYACAAmAAgANgAIAEYACAAFXQC4AABFWLgAHi8buQAeABA+WbgAAEVYuAAULxu5ABQACD5ZuAAeELkAAwAD9EELAAgAAwAYAAMAKAADADgAAwBIAAMABV24ABQQuQANAAP0QQsABwANABcADQAnAA0ANwANAEcADQAFXTAxAS4BIyIOAhUUHgIzMjY3Fw4BIyIuAjU0PgIzMhYXAjUnSSU3WUAjI0BZNytRI2gwik5SiWM4OGOJUkh6NgIeKhwnRVw1OWBGKCktSkI8NWGIU1WLYjUzPQACAE8AAALOAsQADAAZAH64ABovuAASL7gAGhC4AADQuAAAL0ELAAkAEgAZABIAKQASADkAEgBJABIABV24ABIQuQAGAAb0uAAAELkAGAAG9LgABhC4ABvcALgAAEVYuAAALxu5AAAAED5ZuAAARVi4AAsvG7kACwAIPlm5AA0AA/S4AAAQuQAXAAP0MDETITIeAhUUDgIjITcyPgI1NC4CKwERTwEXRoJkPEVthUD++Nw7aU4tKEdhOnMCxCtYhVpbhVcrchs5W0FAXDkb/iAAAQBPAAACNgLEAAsAVbsAAwAGAAAABCu4AAMQuAAH0AC4AABFWLgAAC8buQAAABA+WbgAAEVYuAAKLxu5AAoACD5ZuwAFAAMABgAEK7gAABC5AAIAA/S4AAoQuQAIAAP0MDETIRUhFSEVIRUhFSFPAdX+qQFF/rsBaf4ZAsRyrnLAcgAAAQBPAAACGALEAAkAS7sAAwAGAAAABCu4AAMQuAAH0AC4AABFWLgAAC8buQAAABA+WbgAAEVYuAAILxu5AAgACD5ZuwAFAAMABgAEK7gAABC5AAIAA/QwMRMhFSEVIRUhESNPAcn+tQE4/sh+AsRyunL+2gABACn/7gLEAtYAJAC2uAAlL7gAIC+5AAAABvS4ACUQuAAH0LgABy+5ABgABvRBCwAGABgAFgAYACYAGAA2ABgARgAYAAVduAAAELgAJtwAuAAARVi4AAwvG7kADAAQPlm4AABFWLgAAi8buQACAAg+WbsAJAADACEABCu4AAwQuQATAAP0QQsACAATABgAEwAoABMAOAATAEgAEwAFXbgAAhC5AB0AA/RBCwAHAB0AFwAdACcAHQA3AB0ARwAdAAVdMDElBiMiLgI1ND4CMzIWFwcuASMiDgIVFB4CMzI2NzUjNSECxIKjUoljODhjiVJRjTldImE2N1lAIyNAWTcwVSGRAQ80RjVhiFNVi2I1JjNeISQnRVw1OWBGKBITp3IAAAAAAQBPAAAClgLEAAsAjbgADC+4AAQvuAAMELgAANC4AAAvuQABAAb0uAAEELkABQAG9LgABBC4AAfQuAABELgACdC4AAUQuAAN3AC4AABFWLgAAC8buQAAABA+WbgAAEVYuAAELxu5AAQAED5ZuAAARVi4AAYvG7kABgAIPlm4AABFWLgACi8buQAKAAg+WbsAAwADAAgABCswMRMzESERMxEjESERI09+AUt+fv61fgLE/uYBGv08ATj+yAABAEwAAADKAsQAAwAvuwABAAYAAAAEKwC4AABFWLgAAC8buQAAABA+WbgAAEVYuAACLxu5AAIACD5ZMDETMxEjTH5+AsT9PAABAAX/7gGqAsQAEQBOuwAAAAYADwAEKwC4AABFWLgAEC8buQAQABA+WbgAAEVYuAAFLxu5AAUACD5ZuQAMAAP0QQsABwAMABcADAAnAAwANwAMAEcADAAFXTAxJRQOAiMiJic3HgEzMjY1ETMBqhs1UDVVahF2Bi0hNid+xCpOOyNOVRwjKklAAdsAAAEATwAAArgCxAAMAGO7AAEABgAAAAQruAABELgACtAAuAAARVi4AAAvG7kAAAAQPlm4AABFWLgABC8buQAEABA+WbgAAEVYuAAHLxu5AAcACD5ZuAAARVi4AAsvG7kACwAIPlm7AAMAAgAJAAQrMDETMxEzATMJASMBIxEjT34GASWq/rUBYbH+zQd+AsT+1AEs/rn+gwFc/qQAAAEATwAAAfoCxAAFADW7AAEABgAAAAQrALgAAEVYuAAALxu5AAAAED5ZuAAARVi4AAQvG7kABAAIPlm5AAIAA/QwMRMzESEVIU9+AS3+VQLE/a5yAAEAUgAAA0wCxAAOALy4AA8vuAAGL7gADxC4AADQuAAAL7gABhC5AAUABvS6AAIAAAAFERI5uAAGELgACNC4AAgvuAAAELkADAAG9LgABRC4ABDcALgAAEVYuAAALxu5AAAAED5ZuAAARVi4AAMvG7kAAwAQPlm4AABFWLgABS8buQAFAAg+WbgAAEVYuAAJLxu5AAkACD5ZuAAARVi4AA0vG7kADQAIPlm6AAIABQAAERI5ugAIAAUAABESOboADAAFAAAREjkwMRMzGwEzESMRIwMjAyMRI1LAvb++eALXWNcCeALE/hAB8P08Akz9tAJM/bQAAAAAAQBPAAACzQLEAAsAi7gADC+4AAMvuAAMELgAANC4AAAvuAADELkABgAG9LgAABC5AAkABvS4AAYQuAAN3AC4AABFWLgAAC8buQAAABA+WbgAAEVYuAAELxu5AAQAED5ZuAAARVi4AAYvG7kABgAIPlm4AABFWLgACi8buQAKAAg+WboAAwAGAAAREjm6AAkABgAAERI5MDETMwEzETMRIwEjESNPpwFXAn6g/qICfgLE/fICDv08Ah/94QACACn/7gMYAtYAEwAnAMm4ACgvuAAeL7gAKBC4AADQuAAAL0ELAAkAHgAZAB4AKQAeADkAHgBJAB4ABV24AB4QuQAKAAb0uAAAELkAFAAG9EELAAYAFAAWABQAJgAUADYAFABGABQABV24AAoQuAAp3AC4AABFWLgABS8buQAFABA+WbgAAEVYuAAP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//8ALP/0AhICxAImAEgAAAAHAEMAnQAA//8ALP/0AhICxAImAEgAAAAHANYAnQAA//8ALP/0AhICxAImAEgAAAAHAI4AnQAA//8ARgAAATMCxAImANUAAAAGAI31AAAA////0gAAAL4CxAImANUAAAAGAEMMAAAA////zAAAATgCxAImANUAAAAGANYAAAAA////zgAAATYCxAImANUAAAAGAI4AAAAA//8ARAAAAfoCvAImAFEAAAAHANcAnQAA//8ALP/0AjYCxAImAFIAAAAHAI0ArwAA//8ALP/0AjYCxAImAFIAAAAHAEMArwAA//8ALP/0AjYCxAImAFIAAAAHANYArwAA//8ALP/0AjYCxAImAFIAAAAHAI4ArwAA//8ALP/0AjYCvAImAFIAAAAHANcArwAA//8ARP/0AfoCxAImAFgAAAAHAI0AnQAA//8ARP/0AfoCxAImAFgAAAAHAEMAnQAA//8ARP/0AfoCxAImAFgAAAAHANYAnQAA//8ARP/0AfoCxAImAFgAAAAHAI4AnQAAAAEAKf+CAigCxAALAEi7AAQABQAFAAQruAAEELgAANC4AAUQuAAJ0AC4AABFWLgACi8buQAKABA+WbsAAQACAAIABCu4AAIQuAAG0LgAARC4AAjQMDEBMxUjESMRIzUzNTMBYcfHcsbGcgH5YP3pAhdgywAAAgAoAZABaALQABMAHwDNuAAgL7gAGi+4ACAQuAAA0LgAAC9BCwAJABoAGQAaACkAGgA5ABoASQAaAAVduAAaELkACgAH9LgAABC5ABQAB/RBCwAGABQAFgAUACYAFAA2ABQARgAUAAVduAAKELgAIdwAuAAARVi4ABcvG7kAFwAOPlm4AABFWLgABS8buQAFABA+WbgAFxC5AA8AAvRBCwAIAA8AGAAPACgADwA4AA8ASAAPAAVduAAFELkAHQAC9EELAAgAHQAYAB0AKAAdADgAHQBIAB0ABV0wMRM0PgIzMh4CFRQOAiMiLgI3FBYzMjY1NCYjIgYoGSw6ISE6LBkZLDohITosGU4wIiIwMCIiMAIwITosGRksOiEhOiwZGSw6ISIwMCIiMDAAAgBO/6wCDAIvABsAIgC8uwAfAAUAFgAEK7sADwAHABAABCu4AA8QuAAA0LgADxC4AAbQuAAQELgAGdC4ABAQuAAc0EELAAYAHwAW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AQs0KwwgESEp5rkSDhAcB1N5ckQQDA4OtgM/Ow4RKyA8NBMTGRRz/agQCz0IFAAA//8AAAAAAuYC+wImAh0AAAAHAckBAgAA////4gAAATgC+wImAXcAAAAGAck3AAAA////4gAAAYoC+wImAXgAAAAGAckyAAAA//8AAgAAA4UC+wImAh4AAAAHAckBAAAA//8AAP7HAuYBjgImAh0AAAAHAisBCgAA////4v7HAUEBjgImAXcAAAAGAis7AAAA////4v7HAYoBjgImAXgAAAAGAitKAAAA//8AAv7HA4UBjgImAh4AAAAHAisA+wAA//8AAP60AfsBtAImAScAAABHAisA1wAVLNoskv///+L+xwHAAbQCJgEoAAAABgIraQAAAP///+L+xwH4AbQCJgEpAAAABgIragAAAP//AAD+tAIyAbQCJgEqAAAARwIrANYAFSzNLKL//wAlAAABqQL7AiYBLwAAAAYByVQAAAD//wAmAAACOgL7AiYBMAAAAAYByVIAAAD////x/zoBTQL7AiYBMwAAAAYByUwAAAD////y/zoBnwL7AiYBNAAAAAYByUgAAAD////x/zoBXQLkAiYBMwAAAAYCJhgAAAD////y/zoBnwLkAiYBNAAAAAYCJhIAAAD//wAAAAADXALkAiYCHwAAAAcCJgHqAAD////iAAAB/QLkAiYCIAAAAAcCJgCCAAD////iAAACdQLkAiYCIQAAAAYCJnkAAAD//wAAAAAD1ALkAiYCIgAAAAcCJgHoAAAAAQAAAAAC5wLTACAAf7gAIS+4AAEvuAAhELgAGNC4ABgvuAABELkAEQAF9LoACwAYABEREjm4ABgQuQAbAAX0uAARELgAItwAuAAARVi4AAkvG7kACQAQPlm4AABFWLgAEi8buQASAAg+WbsACwAEAAYABCu4ABIQuQAAAAP0uAAGELgAGdC4ABkvMDElNTQuAisBNRMXBzMyHgIdASEiLgI9ATMVFB4CMwJ2EyArGHrCXpgKKEs6Iv2nJzYiD3IGCQ0GdF8kKRUFZQE0P+sSLlA93BgoNh2plREVCgMAAP///+IAAAGjAtMCBgFgAAD////iAAACOQLTAgYBYQAAAAEAAgAAA4MC1AAzAMW4ADQvuAADL0ELAAkAAwAZAAMAKQADADkAAwBJAAMABV24ADQQuAAr0LgAKy+4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AAkAAgAKAAQruwATAAIAAgAEK7gACRC4AAzQMDEXJiMiBhUUFjsBFSM1My4BNTQ2MzIWFz0SEg8UGx0fqS0IDiwtDBsLjQUREQ8aNTULGhEdLAQDAAH/8gMhABUDzgADAB26AAEAAAADK7gAARC4AAXcALsAAQABAAIABCswMQMzFSMOIyMDzq0AAAAAAf/y/rkAFf9mAAMAHboAAQAAAAMruAABELgABdwAuwABAAEAAgAEKzAxBzMVIw4jI5qtAAH/qAKXAE4DOQAZARq4ABovuAAJL7gAGhC4ABbQuAAWL7gAA9xBGwAGAAMAFgADACYAAwA2AAMARgADAFYAAwBmAAMAdgADAIYAAwCWAAMApgADALYAAwDGAAMADV1BBQDVAAMA5QADAAJdQQUA2gAJAOoACQACXUEbAAkACQAZAAkAKQAJADkACQBJAAkAWQAJAGkACQB5AAkAiQAJAJkACQCpAAkAuQAJAMkACQANXbgACRC4AA3QuAANL7gACRC4ABDcuAAb3AC4AABFWLgABi8buQAGABA+WbgAE9xBBQDZABMA6QATAAJdQRsACAATABgAEwAoABMAOAATAEgAEwBYABMAaAATAHgAEwCIABMAmAATAKgAEwC4ABMAyAATAA1dMDEDDgEVFBYzMjY1NCYnNx4BFRQGIyImNTQ2Nx4KEBwZGxgJCBAOES0lKioZEQMtChkTFB8fEw8XCwwLKBQkMS8gGisOAAAC//sB+AEBAvsADAAUAGq4ABUvuAANL7gAFRC4AAHQuAABL7gAE9y4AAPQuAANELgACty6AAQAAQAKERI5uAAW3AC4AABFWLgAAi8buQACABI+WbsAFAACAAsABCu6AAcAEAADK7gAFBC4AADQugAEABAABxESOTAxAzM1MxU+ATMyFh0BITc0JiMiBgczBSYxDysZKzH++tYbFhovBX8CKNOBFxQ0Kk9HIBcpJQAA////ZgMfAJAExgImAcEAAAAHAbwAHgD2////cQMOAJAE7wInAcEAAAEtAAYBuwAA////cQMfAJAE9AImAcEAAAAHAbv//gEH////cgMfAJEEiwImAcEBAAAHAb7/9gEE////cQMfAJAEvQImAcEAAAAHAb8ACQDw////cQMOAJAEaQImAb4AAAAHAcEAAACn////cQMfAJAErQImAcEAAAAHAcYAAADf////mgMgAG0E5wImAcQAAAAHAbsAAAD6////mwMgAG4EgQImAcQAAAAHAb4AAQD6////SAMgAGMEygImAcQAAAAHAbwAAAD6////fgMgAG0EuQImAcQAAAAHAb8AAwDs////pAMgAFgEtAImAcQAAAAHAcIAAAFG////mv4gAG3/rAImAcUAAAAHAcAAAP7/////mv3BAG3/rAImAcUAAAAHAb0AAP8HAAEAHQAAAk4CzAAJAFu4AAovuAAIL7kAAQAF9LgAChC4AATQuAAEL7kABwAF9LgAARC4AAvcALgAAEVYuAAALxu5AAAAED5ZuAAARVi4AAEvG7kAAQAIPlm5AAMAA/S4AAfQuAAI0DAxAREhNTMRMxEzEQJO/c/NcoACzP00dAGd/mMCWAAAAAABAB4AAALmAswAHgCIuAAfL7gAEC+5ABMABfS6AAMAEAATERI5uAAfELgACdC4AAkvuQAMAAX0uAATELgAINwAuAAARVi4ABEvG7kAEQAQPlm4AABFWLgAAC8buQAAAAg+WbgAAEVYuAAGLxu5AAYACD5ZuQAIAAP0ugADAAYACBESObgADNC4AA3QuAAW0LgAF9AwMSEiJicOASMhNTMRMxEzMjY1ETMRFBY7ATIWHQEUBiMCpSg3EBFCJv5hznJaFw5zJTIjEAwNDyoZIiF0AZ3+YxwYAiT+BCg0EAs9CBQAAP//AB0AAAJOAtQCJgHYAAAABwHDAPz/UP//AB4AAALmAtQCJgHZAAAABwHDAQf/UP//AB0AAAJOA0sCJgHYAAAABwHEASj/d///AB4AAALmA0sCJgHZAAAABwHEAST/d///AB3++AJOAswCJgHYAAAABwHFASQAAP//AB7++ALmAswCJgHZAAAABwHFASsAAAADAB0AAAJOAvUACwATAB0A9rsAGwAFABgABCu7ABUABQAcAAQrugAJAAwAAyu6ABIAGAAbERI5uAAVELgAH9wAuAAARVi4AAYvG7kABgASPlm4AABFWLgAAi8buQACABA+WbgAAEVYuAAVLxu5ABUACD5ZuAAGELgAD9xBBQDZAA8A6QAPAAJdQRsACAAPABgADwAoAA8AOAAPAEgADwBYAA8AaAAPAHgADwCIAA8AmAAPAKgADwC4AA8AyAAPAA1duAAU0LgAFC+4AB3QuAAdL7kACgAC9LgAE9y4AADQ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DV26AJcApwCZERI5ugCbAD0AABESObgAmRC4AJ3QugCgAKcAmRESObgAlBC4AKHQugC0AMgArRESObgAwBC4ALXQQRsABgC7ABYAuwAmALsANgC7AEYAuwBWALsAZgC7AHYAuwCGALsAlgC7AKYAuwC2ALsAxgC7AA1dQQUA1QC7AOUAuwACXboAwgDIAK0REjm4AMgQuADD0LoAxgA9AAAREjm4AI0QuADN0LgAzS+6AM8AiQCNERI5uACJELgA0dC4ANEvugDTAD0AABESOboA1ADIAK0REjm6ANkApwCZERI5ugDcAIkAzBESOQC4AABFWLgAWS8buQBZABI+WbgAAEVYuABCLxu5AEIADD5ZuAAARVi4AEQvG7kARAAMPlm4AABFWLgAci8buQByAAw+WbgAAEVYuACJLxu5AIkADD5ZuAAARVi4AI0vG7kAjQAMPlm4AABFWLgAQC8buQBAAAw+WbgAAEVYuABwLxu5AHAADD5ZugDdACoAAyu6AE4AegADK7sAsAACAM0ABCu6AKIAAgADK7sAyQACAMMABCu6AJgAnQADK7gAsBC4AArQuAAKL7gAKhC4ABPQuAATL7gAKhC4ACbQuAAmL7gAsBC4ADHQuACJELkARwAC9EELAAgARwAYAEcAKABHADgARwBIAEcABV24AE4QuABT0LgAUy+4AE4QuABj0LgAYy+4AEcQuABt0LgAbS+6AIEAQABZERI5uAB6ELgAhtC4AIYvugCMAEAAWRESOboAjwCJAEcREjm4AMkQuACU0LgAlC+6AJUAiQBHERI5uADJELgAl9C4AJcvuACiELgAntC4AJ4vuACZ3LoAmwDDAMkREjm4AMMQuACf0LgAny+6AKAAogCeERI5ugChAM0AsBESObgAbRC4AKrQugC0AMkAlBESOboAtQCJAEcREjm4AKIQuAC/0LoAwADNALAREjm4AKIQuADC0LgAwi+4AJ0QuADE0LgAxC+6AMYAwwDJERI5uACZELgAyNC4AMgvugDLAM0AsBESObgAzRC4ANDQuADdELgA1NC4ANQvMDEBFAcVFCMiLwEmIyIVFB8BFhUULwEGFRQXHgEXFhUUIyInJicuAScHIyI1ND8BNjU0IyIPAQYjIj0BJicmNTQ3NTQzMh8BFjMyNTQvASY1NDMyHwE2NzY3NjMyFRQHBgcGFRQX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AHkAegB7AHwAfQB+AH8AgACBAIIAgwCEAIUAhgCHAIgAiQCKAIsAjACNAI4AjwCQAJEAkgCTAJQAlQCWAQMAmACZAJoAmwCcAJ0AngEEAKAAoQCiAKMApAClAKYApwEFAKkAqgCrAK0ArgCvALAAsQCyALMAtAC1ALYAtwC4ALkAugC7ALwBBgC+AL8AwADBAMIBBwDEAMUAxgDHAMgAyQDKAMsAzADNAM4AzwDQANEA0wDUANUA1gDXANgA2QEIANsA3ADdAN4A3wDgAOEA4gDkAOsA5gDpAO0A4wDlAOwA5wDqAO4A6AC9APEA8gDzAPUA9AD2AO8A8AEJAQoBCwEMAQ0BDgEPARABEQESARMBFAEVARYBFwEYARkBGgEbARwBHQEeAR8BIAEhASIBIwEkASUBJgEnASgBKQEqASsBLAEtAS4BLwEwATEBMgEzATQBNQE2ATcBOAE5AToBOwE8AT0BPgE/AUABQQFCAUMBRAFFAUYBRwFIAUkBSgFLAUwBTQFOAU8BUAFRAVIBUwFUAVUBVgFXAVgBWQFaAVsBXAFdAV4BXwFgAWEBYgFjAWQBZQFmAWcBaAFpAWoBawFsAW0BbgFvAXABcQFyAXMBdAF1AXYBdwF4AXkBegF7AXwBfQF+AX8BgAGBAYIBgwGEAYUBhgGHAYgBiQGKAYsBjAGNAY4BjwGQAZEBkgGTAZQBlQGWAZcBmAGZAZoBmwGcAZ0BngGfAaABoQGiAaMBpAGlAaYBpwGoAakBqgGrAawBrQGuAa8BsAGxAbIBswG0AbUBtgG3AbgBuQG6AbsBvAG9Ab4BvwHAAcEBwgHDAcQBxQHGAccByAHJAcoBywHMAc0BzgHPAdAB0QHSAdMB1AHVAdYB1wHYAdkB2gHbAdwB3QHeAd8B4AHhAeIB4wHkAeUB5gHnAegB6QHqAesB7AHtAe4B7wHwAfEB8gHzAfQB9QH2AfcB+AH5AfoB+wH8Af0B/gH/AgACAQICAgMCBAIFAgYCBwIIAgkCCgILAgwCDQIOAg8CEAIRAhICEwIUAhUCFgIXAhgCGQIaAhsCHAIdAh4CHwIgAiECIgIjAiQCJQImAicCKAIpAioCKwIsAi0CLgIvAjACMQIyAjMCNAI1AjYCNwI4AjkCOgI7AjwCPQI+Aj8CQAUubnVsbAd1bmkwMEI1B3VuaTIxMjYHdW5pMjIwNgRFdXJvDnBlcmlvZGNlbnRlcmVkBm1hY3Jvbgllc3RpbWF0ZWQJYWZpaTYxMjg5B3VuaTI1Q0MHdW5pMjAwQwd1bmkyMDBEB3VuaTIwMEUHdW5pMjAwRgd1bmkyMDJBB3VuaTIwMkIHdW5pMjAyQwd1bmkyMDJEB3VuaTIwMkUHdW5pMjAwMgd1bmkyMDAzB3VuaTIwMDkHdW5pMjAwQQd1bmkwNjIxB3VuaTA2MjIHdW5pRkU4Mgd1bmkwNjIzB3VuaUZFODQHdW5pMDYyNAd1bmlGRTg2B3VuaTA2MjUHdW5pRkU4OAd1bmkwNjI2B3VuaUZFOEIHdW5pRkU4Qwd1bmlGRThBB3VuaTA2MjcHdW5pRkU4RQd1bmkwNjI4B3VuaUZFOTEHdW5pRkU5Mgd1bmlGRTkwB3VuaTA2MjkHdW5pRkU5NAd1bmkwNjJBB3VuaUZFOTcHdW5pRkU5OAd1bmlGRTk2B3VuaTA2MkIHdW5pRkU5Qgd1bmlGRTlDB3VuaUZFOUEHdW5pMDYyQwd1bmlGRTlGB3VuaUZFQTAHdW5pRkU5RQd1bmkwNjJEB3VuaUZFQTMHdW5pRkVBNAd1bmlGRUEyB3VuaTA2MkUHdW5pRkVBNwd1bmlGRUE4B3VuaUZFQTYHdW5pMDYyRgd1bmlGRUFBB3VuaTA2MzAHdW5pRkVBQwd1bmkwNjMxB3VuaUZFQUUHdW5pMDYzMgd1bmlGRUIwB3VuaTA2MzMHdW5pRkVCMwd1bmlGRUI0B3VuaUZFQjIHdW5pMDYzNAd1bmlGRUI3B3VuaUZFQjgHdW5pRkVCNgd1bmkwNjM1B3VuaUZFQkIHdW5pRkVCQwd1bmlGRUJBB3VuaTA2MzYHdW5pRkVCRgd1bmlGRUMwB3VuaUZFQkUHdW5pMDYzNwd1bmlGRUMzB3VuaUZFQzQHdW5pRkVDMgd1bmkwNjM4B3VuaUZFQzcHdW5pRkVDOAd1bmlGRUM2B3VuaTA2MzkHdW5pRkVDQgd1bmlGRUNDB3VuaUZFQ0EHdW5pMDYzQQd1bmlGRUNGB3VuaUZFRDAHdW5pRkVDRQd1bmkwNjQxB3VuaUZFRDMHdW5pRkVENAd1bmlGRUQyB3VuaTA2NDIHdW5pRkVENwd1bmlGRUQ4B3VuaUZFRDYHdW5pMDY0Mwd1bmlGRURCB3VuaUZFREMHdW5pRkVEQQd1bmkwNjQ0B3VuaUZFREYHdW5pRkVFMAd1bmlGRURFB3VuaTA2NDUHdW5pRkVFMwd1bmlGRUU0B3VuaUZFRTIHdW5pMDY0Ngd1bmlGRUU3B3VuaUZFRTgHdW5pRkVFNgd1bmkwNjQ3B3VuaUZFRTkHdW5pRkVFQgd1bmlGRUVDB3VuaUZFRUEHdW5pMDY0OAd1bmlGRUVFB3VuaTA2NDkHdW5pRkJFOAd1bmlGQkU5B3VuaUZFRjAHdW5pMDY0QQd1bmlGRUYzB3VuaUZFRjQHdW5pRkVGMgd1bmkwNjcxB3VuaUZCNTEHdW5pMDY3OQd1bmlGQjY4B3VuaUZCNjkHdW5pRkI2Nwd1bmkwNjdFB3VuaUZCNTgHdW5pRkI1OQd1bmlGQjU3B3VuaTA2ODYHdW5pRkI3Qwd1bmlGQjdEB3VuaUZCN0IHdW5pMDY4OAd1bmlGQjg5B3VuaTA2OTEHdW5pRkI4RAd1bmkwNjk4B3VuaUZCOEIHdW5pMDZBNAd1bmlGQjZDB3VuaUZCNkQHdW5pRkI2Qgd1bmkwNkE5B3VuaUZCOTAHdW5pRkI5MQd1bmlGQjhGB3VuaTA2QUYHdW5pRkI5NAd1bmlGQjk1B3VuaUZCOTMHdW5pMDZCQQd1bmlGQjlGB3VuaTA2QkUHdW5pRkJBQwd1bmlGQkFEB3VuaUZCQUIHdW5pMDZDMAd1bmlGQkE1B3VuaTA2QzEHdW5pRkJBOAd1bmlGQkE5B3VuaUZCQTcHdW5pMDZDMgx1bmkwNkMyLmZpbmEHdW5pMDZDMwx1bmkwNkMzLmZpbmEHdW5pMDZDQwd1bmlGQkZFB3VuaUZCRkYHdW5pRkJGRAd1bmkwNkQyB3VuaUZCQUYHdW5pMDZEMwd1bmlGQkIxB3VuaTA2RDUMdW5pMDZENS5maW5hB3VuaTA2NDAOdW5pMDY0MC5uYXJyb3cMdW5pMDY0MC5sb25nB3VuaTA2NEIHdW5pMDY0Qwd1bmkwNjREB3VuaTA2NEUHdW5pMDY0Rgd1bmkwNjUwB3VuaTA2NTEHdW5pMDY1Mgd1bmkwNjUzB3VuaTA2NTQHdW5pMDY1NQd1bmkwNjcwB3VuaTA2NTYHdW5pMDY1OAd1bmkwNjE1C3VuaTA2NEMwNjUxC3VuaTA2NEQwNjUxC3VuaTA2NEIwNjUxC3VuaTA2NEUwNjUxC3VuaTA2NEYwNjUxC3VuaTA2NTAwNjUxC3VuaTA2NTEwNjcwC3VuaTA2NTQwNjUxC3VuaTA2NTQwNjRFC3VuaTA2NTQwNjRDC3VuaTA2NTQwNjRGC3VuaTA2NTQwNjUyC3VuaTA2NTUwNjUwC3VuaTA2NTUwNjREB3VuaUZFRkIHdW5pRkVGQwd1bmlGRUY1B3VuaUZFRjYHdW5pRkVGNwd1bmlGRUY4B3VuaUZFRjkHdW5pRkVGQQt1bmkwNjQ0MDY3MRB1bmkwNjQ0MDY3MS5maW5hB3VuaUZERjIPdW5pMDY0NDA2NDQwNjQ3B3VuaUZERkENdW5pRkRGQS5GYXJzaQd1bmkwNjYwB3VuaTA2NjEHdW5pMDY2Mgd1bmkwNjYzB3VuaTA2NjQHdW5pMDY2NQd1bmkwNjY2B3VuaTA2NjcHdW5pMDY2OAd1bmkwNjY5DHVuaTA2NjAucG51bQx1bmkwNjYxLnBudW0MdW5pMDY2Mi5wbnVtDHVuaTA2NjMucG51bQx1bmkwNjY0LnBudW0MdW5pMDY2NS5wbnVtDHVuaTA2NjYucG51bQx1bmkwNjY3LnBudW0MdW5pMDY2OC5wbnVtDHVuaTA2NjkucG51bQd1bmkwNkYwB3VuaTA2RjEHdW5pMDZGMgd1bmkwNkYzB3VuaTA2RjQHdW5pMDZGNQd1bmkwNkY2B3VuaTA2RjcHdW5pMDZGOAd1bmkwNkY5DHVuaTA2RjAucG51bQx1bmkwNkYxLnBudW0MdW5pMDZGMi5wbnVtDHVuaTA2RjMucG51bQx1bmkwNkY0LnBudW0MdW5pMDZGNS5wbnVtDHVuaTA2RjYucG51bQx1bmkwNkY3LnBudW0MdW5pMDZGOC5wbnVtDHVuaTA2RjkucG51bQx1bmkwNkY0LlVyZHUMdW5pMDZGNy5VcmR1EHVuaTA2RjQuVXJkdXBudW0QdW5pMDZGNy5VcmR1cG51bQd1bmkwNjZBB3VuaTA2NkIHdW5pMDY2Qwd1bmkwNjBDB3VuaTA2MUIHdW5pMDYxRgd1bmlGRDNFB3VuaUZEM0YHdW5pMDZENAd1bmkwNjZEB3VuaTI3NEEGeHguYmVoC3h4LmJlaC5maW5hBnh4LmZlaAt4eC5mZWguaW5pdAt4eC5mZWgubWVkaQt4eC5mZWguZmluYQZ4eC5x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ADwACABJAEkACQBVAFUACgBZAFoACwBcAFwADQC1ALYADgHwAfAAEAHyAfMAEQH1AfUAEwH3AfgAFAABA1wDZgACAAwAggAdAAAF+gAABfoAAQX6AAAF+gAABfoAAQX6AAAF+gAABfoAAAX6AAAF+gABBfoAAAX6AAEF+gAABfoAAAX6AAAF+gAABfoAAAX6AAAF+gAABfoAAAX6AAAF+gAABfoAAAX6AAAF+gAABfoAAAX6AAEF+gABBfoAtgawBwoGtgdYBrwHXga8B14GvAdeBrwHXgbCBrYGwga2BsgHZAbIB2QGzga2Bg4GDgYOBg4Gzga2BsgHXgbIB14F8AcEBeQF5AXkBeQF8AcEBg4GDgYOBg4F9gcKBg4GDgYOBg4F9gcKBfYHCgYOBg4GDgYOBfYHCgXkB2oF5AXkBeQF5AXkB2oF5AdqBeQGDgXkBg4F5AdqBg4HagYOBg4GDgYOBg4HagXkBwoF5AcKBg4HCgYOBwoF5AdwBeQHcAYOB3AGDgd2BtQG4AbaBuYG2gbmBtQG4AbgBuAG5gbmBuYG5gbgBuAG1AbgBuwG8gbsBvIG1AbgBuAG4AbyBvIG8gbyBuAG4Ab4BvIG+AbyBvgG8gb4BvIG+AbyBvgG8gb4BvIG/gbyBwQHfAcEBwoHBAXqBwQHfAcKB3wHCgcKBwoHggcKB3wHEAcKBeoF6gXqBeoHEAcKBvIHiAXqBeoF6gXqBvIHiAb4BwoGDgYOBg4GDgb4BwoF9geOBg4GDgYOBg4F9geOBxAHlAcWBfYHFgX2BxAHlAcWB44GDgYOBg4GDgcWB5oF5AYOBeQGDgcQB6AHFgemBeQGDgcWBrYHFga2BwQGtgXkB6wF5AYOBwQGtgcEB3wF5AXkBeQF5AcEB3wGvAdeBrwHXgccBwoHIgYOByIGDgccBwoF8AeyBeQHuAXkB7gF8AeyBeQHagXkB3AF5AdwBeQHagciBwoHIgcKByIHcAciB3AGDgdwBg4HcAcoBwoF6gXqBeoF6gcoBwoHLgcKBg4GDgYOBg4HLgcKBwoHCgYOBg4GDgYOBwoHCgcEB74HBAfEBxAHoAcQB6AHFgfKBzQH0AYOBg4GDgYOBeQGDgXkBeQHOgfWBeQGDgYOBg4F5AYOBg4GDgYOBg4HBAa2BeQF5AXkBeQHBAa2BeQHCgXkBrYHQAcKBeQGtgXkBg4F5AYOB0YH3AdMB+IHUgdeAAIAAQG7AdcAAAACAAIA+AD4AAABBgG6AAEAAQEgASoAAgAMAIIAHQAAAoQAAAKEAAEChAAAAoQAAAKEAAEChAAAAoQAAAKEAAAChAAAAoQAAQKEAAAChAABAoQAAAKEAAAChAAAAoQAAAKEAAAChAAAAoQAAAKEAAAChAAAAoQAAAKEAAAChAAAAoQAAAKEAAAChAABAoQAAQKEAAwAGgAkAC4AOABCAEwAVgBgAGoAdAB+AJAAAgIkAiQCKgJaAAICGgIaAiACUAACAhACEAIcAkYAAgIGAgYCEgI8AAIB/AH8Ag4CMgACAfIB8gIEAigAAgHoAegB7gIkAAIB3gHeAeQCGgACAdQB1AHsAhYAAgHKAcoB4gIMAAQB3gIIAeQCDgHqAhQB8AIaAAMB0gH8AdgCAgHeAggAAgABAbsB1wAAAAIAAQHYAeMAAAABAJoAvAABAAwAagAXAAABUAAAAeAAAAFQAAAB5gAAAVAAAAHgAAAB7AAAAfIAAAH4AAAB4AAAAewAAAFQAAABUAAAAVAAAAFQAAABUAAAAVAAAAFQAAAB8gAAAfIAAAHyAAAB8gAAAfIAFwGgAaYBrAGyAbgBvgHEAbIBygG+AdAB1gHcAeIB6AHuAfQB+gIAAgYCDAISAhgAAgAFAbsBvAAAAb4BvwACAcEBxAAEAcYBxgAIAcgB1QAJAAIABQG7AbwAAAG+Ab8AAgHBAcQABAHGAcYACAHIAdUACQABADQAVgABAAwAJgAGAAAAcgAAAHIAAAB4AAAAfgAAAHgAAAB4AAYAUgBqAHAAdgB8AIIAAgAFAb0BvQAAAcABwAABAcUBxQACAccBxwADAdYB1wAEAAIABQG9Ab0AAAHAAcAAAQHFAcUAAgHHAccAAwHWAdcABAABAAD/BgABAAAAAAABAAAAQQABAAAALQABAAD/mwABAA//UgABAAD/UgABAA/+7QABAA/+lwABAiYAAAABAQ7/dAABAQ4AMgABARgAZAABARgAMgABBKAAAAABA7YAAAABAooAAAABAJb/OAABAPoAAAABASz/OAABASwAAAABBJ8AAAABA4UAAAABAlYAAAABAJYAAAABAAD/8QABAAD/+wABAAD/4gABABH/6gABAAD/9gABAAAA+gABAAAA3QABAAAAZQABAAAA3AABAAAApQABAAAAzgABAAAAoQABAAAAzQABAAABAgABAAABfQABAAABbQABAAABYAABAAABAAABAAABfAABAAABIgABAAABcgABAAABlwABAAABQQABAAABtAABAAABswABAAABqgABALf+9wABAMj/BgABAHgAyAABAPoAMgABAHgAMgABAH3/nAABAu7/OAABAfT/OAABAu4AAAABAfQAAAABAZD/OAABAZAAAAABAV4AAAABALUAOQABAMj/OAABAMgAAAABAV7/OAABAPr/OAABASwAZAABAJYAZAABAV7/agABAMj/agABAUH/OAABAOv/OAABAJb/nAABAEf/OAABADL/OAABAGT/OAABALkAAAABAHgAAAABAHj/BgABAJb+ogABAJb/BgABAJX/BgABAMj+ogABAQQAAAABASz+1AABAPr/BgABAVgAAAABAQ3/JAABAUYAAAABAPj+1AABAI4AAAABAGQAAAABAJb+1AABAQj/BgABAQ3/BgABARv+1AABATb+1AABAOD/BgABAEsAAAABACsAAAABAAAACgCiApIAAmFyYWIADmxhdG4AjAAyAANBUkEgABZGQVIgAEpVUkQgAGQAAP//AAsAAAAIABAABAAVABkAGgAdACEAJQAMAAD//wAJAAEACQARAAUAFgAeACIAJgANAAD//wAKAAIACgASAAYAFwAbAB8AIwAnAA4AAP//AAoAAwALABMABwAYABwAIAAkACgADwAEAAAAAP//AAEAFAApY2FsdAD4Y2FsdAEAY2FsdAEGY2FsdAEMY2NtcAESY2NtcAEYY2NtcAEeY2NtcAEkZGxpZwEqZGxpZwEwZGxpZwE2ZGxpZwE8ZmluYQFCZmluYQFIZmluYQFOZmluYQFUZnJhYwFaZnJhYwFgZnJhYwFmZnJhYwFsZnJhYwFyaW5pdAF4aW5pdAF+aW5pdAGEaW5pdAGKaXNvbAGQbG9jbAGWbG9jbAGcbG9jbAGibWVkaQGobWVkaQGubWVkaQG0bWVkaQG6cG51bQHAcG51bQHGcG51bQHMcG51bQHScmxpZwHYcmxpZwHecmxpZwHkcmxpZwHqAAAAAgAMAA0AAAABAA0AAAABAA0AAAABAA0AAAABAAMAAAABAAMAAAABAAMAAAABAAMAAAABAAkAAAABAAkAAAABAAkAAAABAAkAAAABAAQAAAABAAQAAAABAAQAAAABAAQAAAABAAoAAAABAAoAAAABAAoAAAABAAoAAAABAAoAAAABAAYAAAABAAYAAAABAAYAAAABAAYAAAABAAcAAAABAAAAAAABAAEAAAABAAIAAAABAAUAAAABAAUAAAABAAUAAAABAAUAAAABAAsAAAABAAsAAAABAAsAAAABAAsAAAABAAgAAAABAAgAAAABAAgAAAABAAgAEQAkACwANAA8AEQATABUAFwAZABsAHQAfACEAIwAmACgAKgAAQABAAEAjAABAAEAAQCSAAEAAQABAJgABAABAAEAtAABAAEAAQHOAAEAAQABA4oAAQABAAEElgAGAAEAAQWiAAQACQABBogABAABAAEG5gAEAAAAAQcKAAEAAQABB1QABgABAAEHlAAGAQEAAwh6CIwIoAABAAEAAQraAAEAAQABCuAAAQEBAAEK5gACAAgAAQFwAAEAAQFvAAIACAABAeUAAQABAeQAAgAOAAQB5QIOAewCDwACAAMB5AHkAAAB/gH+AAECAAIBAAIAAQESAAsAHAAuAEAAUgBkAHYAiADCAMwA9gEIAAIABgAMAcwAAgHBAdEAAgHEAAIABgAMAcoAAgHBAdMAAgHEAAIABgAMAcsAAgHBAdcAAgHFAAIABgAMAc0AAgHBAdIAAgHEAAIABgAMAc4AAgHBAdQAAgHEAAIABgAMAc8AAgHBAdYAAgHFAAcAEAAWABwAIgAoAC4ANAHKAAIBvAHLAAIBvQHMAAIBuwHNAAIBvgHOAAIBvwHPAAIBwAHQAAIBxgABAAQB1QACAcQABQAMABIAGAAeACQB0QACAbsB0gACAb4B0wACAbwB1AACAb8B1QACAcIAAgAGAAwB1gACAcAB1wACAb0AAQAEAdAAAgHBAAIAAgG7AcIAAAHEAcYACAACAHYAOAEIAQoBDAEOARIBFAEYARoBHgEiASYBKgEuATABMgE0ATYBOgE+AUIBRgFKAU4BUgFWAVoBXgFiAWYBagFuAXMBcwF1AXkBfQF/AYMBhwGLAY0BjwGRAZUBmQGdAZ8BowGlAakBqwGtAbEBswG1AbcAAgA3AQcBBwAAAQkBCQABAQsBCwACAQ0BDQADAQ8BDwAEARMBEwAFARUBFQAGARkBGQAHARsBGwAIAR8BHwAJASMBIwAKAScBJwALASsBKwAMAS8BLwANATEBMQAOATMBMwAPATUBNQAQATcBNwARATsBOwASAT8BPwATAUMBQwAUAUcBRwAVAUsBSwAWAU8BTwAXAVMBUwAYAVcBVwAZAVsBWwAaAV8BXwAbAWMBYwAcAWcBZwAdAWsBawAeAW8BcAAfAXQBdAAhAXYBdgAiAXoBegAjAX4BfgAkAYABgAAlAYQBhAAmAYgBiAAnAYwBjAAoAY4BjgApAZABkAAqAZIBkgArAZYBlgAsAZoBmgAtAZ4BngAuAaABoAAvAaQBpAAwAaYBpgAxAaoBqgAyAawBrAAzAa4BrgA0AbIBsgA1AbQBtAA2AbYBtgA3AAIASgAiAREBFwEdASEBJQEpAS0BOQE9AUEBRQFJAU0BUQFVAVkBXQFhAWUBaQFtAXIBcgF4AXwBggGGAYoBlAGYAZwBogGoAbAAAgAhAQ8BDwAAARUBFQABARsBGwACAR8BHwADASMBIwAEAScBJwAFASsBKwAGATcBNwAHATsBOwAIAT8BPwAJAUMBQwAKAUcBRwALAUsBSwAMAU8BTwANAVMBUwAOAVcBVwAPAVsBWwAQAV8BXwARAWMBYwASAWcBZwATAWsBawAUAW8BcAAVAXYBdgAXAXoBegAYAYABgAAZAYQBhAAaAYgBiAAbAZIBkgAcAZYBlgAdAZoBmgAeAaABoAAfAaYBpgAgAa4BrgAhAAIASgAiARABFgEcASABJAEoASwBOAE8AUABRAFIAUwBUAFUAVgBXAFgAWQBaAFsAXEBcQF3AXsBgQGFAYkBkwGXAZsBoQGnAa8AAgAhAQ8BDwAAARUBFQABARsBGwACAR8BHwADASMBIwAEAScBJwAFASsBKwAGATcBNwAHATsBOwAIAT8BPwAJAUMBQwAKAUcBRwALAUsBSwAMAU8BTwANAVMBUwAOAVcBVwAPAVsBWwAQAV8BXwARAWMBYwASAWcBZwATAWsBawAUAW8BcAAVAXYBdgAXAXoBegAYAYABgAAZAYQBhAAaAYgBiAAbAZIBkgAcAZYBlgAdAZoBmgAeAaABoAAfAaYBpgAgAa4BrgAhAAMAAQAYAAEAEgAAAAEAAAAOAAEAAQFwAAIAIwEGAQ8AAAESARUACgEYARsADgEeAR8AEgEiASMAFAEmAScAFgEqASsAGAEuATcAGgE6ATsAJAE+AT8AJgFCAUMAKAFG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" ,
};

/*!
 Buttons for DataTables 1.6.5
 ©2016-2020 SpryMedia Ltd - datatables.net/license
*/
(function(e){"function"===typeof define&&define.amd?define(["jquery","datatables.net"],function(q){return e(q,window,document)}):"object"===typeof exports?module.exports=function(q,r){q||(q=window);if(!r||!r.fn.dataTable)r=require("datatables.net")(q,r).$;return e(r,q,q.document)}:e(jQuery,window,document)})(function(e,q,r,m){function w(a,b,c){e.fn.animate?a.stop().fadeIn(b,c):(a.css("display","block"),c&&c.call(a))}function x(a,b,c){e.fn.animate?a.stop().fadeOut(b,c):(a.css("display","none"),c&&
c.call(a))}function z(a,b){var c=new i.Api(a),d=b?b:c.init().buttons||i.defaults.buttons;return(new p(c,d)).container()}var i=e.fn.dataTable,C=0,D=0,l=i.ext.buttons,p=function(a,b){if(!(this instanceof p))return function(b){return(new p(b,a)).container()};"undefined"===typeof b&&(b={});!0===b&&(b={});Array.isArray(b)&&(b={buttons:b});this.c=e.extend(!0,{},p.defaults,b);b.buttons&&(this.c.buttons=b.buttons);this.s={dt:new i.Api(a),buttons:[],listenKeys:"",namespace:"dtb"+C++};this.dom={container:e("<"+
this.c.dom.container.tag+"/>").addClass(this.c.dom.container.className)};this._constructor()};e.extend(p.prototype,{action:function(a,b){var c=this._nodeToButton(a);if(b===m)return c.conf.action;c.conf.action=b;return this},active:function(a,b){var c=this._nodeToButton(a),d=this.c.dom.button.active,c=e(c.node);if(b===m)return c.hasClass(d);c.toggleClass(d,b===m?!0:b);return this},add:function(a,b){var c=this.s.buttons;if("string"===typeof b){for(var d=b.split("-"),e=this.s,c=0,f=d.length-1;c<f;c++)e=
e.buttons[1*d[c]];c=e.buttons;b=1*d[d.length-1]}this._expandButton(c,a,e!==m,b);this._draw();return this},container:function(){return this.dom.container},disable:function(a){a=this._nodeToButton(a);e(a.node).addClass(this.c.dom.button.disabled).attr("disabled",!0);return this},destroy:function(){e("body").off("keyup."+this.s.namespace);var a=this.s.buttons.slice(),b,c;b=0;for(c=a.length;b<c;b++)this.remove(a[b].node);this.dom.container.remove();a=this.s.dt.settings()[0];b=0;for(c=a.length;b<c;b++)if(a.inst===
this){a.splice(b,1);break}return this},enable:function(a,b){if(!1===b)return this.disable(a);var c=this._nodeToButton(a);e(c.node).removeClass(this.c.dom.button.disabled).removeAttr("disabled");return this},name:function(){return this.c.name},node:function(a){if(!a)return this.dom.container;a=this._nodeToButton(a);return e(a.node)},processing:function(a,b){var c=this.s.dt,d=this._nodeToButton(a);if(b===m)return e(d.node).hasClass("processing");e(d.node).toggleClass("processing",b);e(c.table().node()).triggerHandler("buttons-processing.dt",
[b,c.button(a),c,e(a),d.conf]);return this},remove:function(a){var b=this._nodeToButton(a),c=this._nodeToHost(a),d=this.s.dt;if(b.buttons.length)for(var g=b.buttons.length-1;0<=g;g--)this.remove(b.buttons[g].node);b.conf.destroy&&b.conf.destroy.call(d.button(a),d,e(a),b.conf);this._removeKey(b.conf);e(b.node).remove();a=e.inArray(b,c);c.splice(a,1);return this},text:function(a,b){var c=this._nodeToButton(a),d=this.c.dom.collection.buttonLiner,d=c.inCollection&&d&&d.tag?d.tag:this.c.dom.buttonLiner.tag,
g=this.s.dt,f=e(c.node),h=function(a){return"function"===typeof a?a(g,f,c.conf):a};if(b===m)return h(c.conf.text);c.conf.text=b;d?f.children(d).html(h(b)):f.html(h(b));return this},_constructor:function(){var a=this,b=this.s.dt,c=b.settings()[0],d=this.c.buttons;c._buttons||(c._buttons=[]);c._buttons.push({inst:this,name:this.c.name});for(var g=0,f=d.length;g<f;g++)this.add(d[g]);b.on("destroy",function(b,d){d===c&&a.destroy()});e("body").on("keyup."+this.s.namespace,function(b){if(!r.activeElement||
r.activeElement===r.body){var c=String.fromCharCode(b.keyCode).toLowerCase();a.s.listenKeys.toLowerCase().indexOf(c)!==-1&&a._keypress(c,b)}})},_addKey:function(a){a.key&&(this.s.listenKeys+=e.isPlainObject(a.key)?a.key.key:a.key)},_draw:function(a,b){a||(a=this.dom.container,b=this.s.buttons);a.children().detach();for(var c=0,d=b.length;c<d;c++)a.append(b[c].inserter),a.append(" "),b[c].buttons&&b[c].buttons.length&&this._draw(b[c].collection,b[c].buttons)},_expandButton:function(a,b,c,d){for(var g=
this.s.dt,f=0,b=!Array.isArray(b)?[b]:b,h=0,k=b.length;h<k;h++){var n=this._resolveExtends(b[h]);if(n)if(Array.isArray(n))this._expandButton(a,n,c,d);else{var j=this._buildButton(n,c);j&&(d!==m&&null!==d?(a.splice(d,0,j),d++):a.push(j),j.conf.buttons&&(j.collection=e("<"+this.c.dom.collection.tag+"/>"),j.conf._collection=j.collection,this._expandButton(j.buttons,j.conf.buttons,!0,d)),n.init&&n.init.call(g.button(j.node),g,e(j.node),n),f++)}}},_buildButton:function(a,b){var c=this.c.dom.button,d=this.c.dom.buttonLiner,
g=this.c.dom.collection,f=this.s.dt,h=function(b){return"function"===typeof b?b(f,j,a):b};b&&g.button&&(c=g.button);b&&g.buttonLiner&&(d=g.buttonLiner);if(a.available&&!a.available(f,a))return!1;var k=function(a,b,c,d){d.action.call(b.button(c),a,b,c,d);e(b.table().node()).triggerHandler("buttons-action.dt",[b.button(c),b,c,d])},g=a.tag||c.tag,n=a.clickBlurs===m?!0:a.clickBlurs,j=e("<"+g+"/>").addClass(c.className).attr("tabindex",this.s.dt.settings()[0].iTabIndex).attr("aria-controls",this.s.dt.table().node().id).on("click.dtb",
function(b){b.preventDefault();!j.hasClass(c.disabled)&&a.action&&k(b,f,j,a);n&&j.trigger("blur")}).on("keyup.dtb",function(b){b.keyCode===13&&!j.hasClass(c.disabled)&&a.action&&k(b,f,j,a)});"a"===g.toLowerCase()&&j.attr("href","#");"button"===g.toLowerCase()&&j.attr("type","button");d.tag?(g=e("<"+d.tag+"/>").html(h(a.text)).addClass(d.className),"a"===d.tag.toLowerCase()&&g.attr("href","#"),j.append(g)):j.html(h(a.text));!1===a.enabled&&j.addClass(c.disabled);a.className&&j.addClass(a.className);
a.titleAttr&&j.attr("title",h(a.titleAttr));a.attr&&j.attr(a.attr);a.namespace||(a.namespace=".dt-button-"+D++);d=(d=this.c.dom.buttonContainer)&&d.tag?e("<"+d.tag+"/>").addClass(d.className).append(j):j;this._addKey(a);this.c.buttonCreated&&(d=this.c.buttonCreated(a,d));return{conf:a,node:j.get(0),inserter:d,buttons:[],inCollection:b,collection:null}},_nodeToButton:function(a,b){b||(b=this.s.buttons);for(var c=0,d=b.length;c<d;c++){if(b[c].node===a)return b[c];if(b[c].buttons.length){var e=this._nodeToButton(a,
b[c].buttons);if(e)return e}}},_nodeToHost:function(a,b){b||(b=this.s.buttons);for(var c=0,d=b.length;c<d;c++){if(b[c].node===a)return b;if(b[c].buttons.length){var e=this._nodeToHost(a,b[c].buttons);if(e)return e}}},_keypress:function(a,b){if(!b._buttonsHandled){var c=function(d){for(var g=0,f=d.length;g<f;g++){var h=d[g].conf,k=d[g].node;if(h.key)if(h.key===a)b._buttonsHandled=!0,e(k).click();else if(e.isPlainObject(h.key)&&h.key.key===a&&(!h.key.shiftKey||b.shiftKey))if(!h.key.altKey||b.altKey)if(!h.key.ctrlKey||
b.ctrlKey)if(!h.key.metaKey||b.metaKey)b._buttonsHandled=!0,e(k).click();d[g].buttons.length&&c(d[g].buttons)}};c(this.s.buttons)}},_removeKey:function(a){if(a.key){var b=e.isPlainObject(a.key)?a.key.key:a.key,a=this.s.listenKeys.split(""),b=e.inArray(b,a);a.splice(b,1);this.s.listenKeys=a.join("")}},_resolveExtends:function(a){for(var b=this.s.dt,c,d,g=function(c){for(var d=0;!e.isPlainObject(c)&&!Array.isArray(c);){if(c===m)return;if("function"===typeof c){if(c=c(b,a),!c)return!1}else if("string"===
p;e.fn.DataTable.Buttons=p;e(r).on("init.dt plugin-init.dt",function(a,b){if("dt"===a.namespace){var c=b.oInit.buttons||i.defaults.buttons;c&&!b._buttons&&(new p(b,c)).container()}});i.ext.feature.push({fnInit:z,cFeature:"B"});i.ext.features&&i.ext.features.register("buttons",z);return p});

/*!
*/

/*!
 */

		// AMD
		} );