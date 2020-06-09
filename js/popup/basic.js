/*
 * SimpleModal Basic Modal Dialog
 * http://www.ericmmartin.com/projects/simplemodal/
 * http://code.google.com/p/simplemodal/
 *
 * Copyright (c) 2010 Eric Martin - http://ericmmartin.com
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Revision: $Id: basic.js 254 2010-07-23 05:14:44Z emartin24 $
 */
/** This script is part of the Popup project **/
/** septsite.pl | szokart.eu **/


function getCookie(name){
  var str = '; '+ document.cookie +';';
  var index = str.indexOf('; '+ escape(name) +'=');
  if (index != -1) {
    index += name.length+3;
    var value = str.slice(index, str.indexOf(';', index));
    return unescape(value);
  }
};
 
var idcookie = getCookie("popup");

if(idcookie == 1){

}else{

jQuery(function ($) {


		 setTimeout(function(){
                    $('#basic-modal-content').modal();
                  },30000) // 3 seconds.
		 return false;
	  
}); 

}


jQuery.noConflict();	
