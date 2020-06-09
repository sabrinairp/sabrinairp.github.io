/**
 * PFA Ifrim G. Daniel
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the EULA
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://innovo.ro/LICENSE-PFPJ.txt
 * 
 * @category   PfpjRom
 * @package    Js
 * @copyright  Copyright (c) 2014 PFA Ifrim G. Daniel (http://www.innovo.ro)
 * @license    http://innovo.ro/LICENSE-PFPJ.txt
 */

if(!PfpjRom) var PfpjRom = {};

PfpjRom.AddressTippersBehaviour = Class.create({
    initialize : function(tippers_value, state, config, other_elements_paths, params) {
    	// is_tippers_required, enable_obj, primary_billing_id, primary_shipping_id, is_default_billing, is_default_shipping, allow_billing_save, allow_shipping_save, billing_save_id, shipping_save_id
    	this.enableObj = (params.enable_obj == true || params.enable_obj == null ? true : false);
    	
    	this.configWebsites = config || {};
    	this.configWebsites.tippers_value = tippers_value;
    	this.configWebsites.state = state;
    	this.configWebsites.other_elements_paths = other_elements_paths;
    	this.configWebsites.is_tippers_required = (params.is_tippers_required ? params.is_tippers_required : false);
    	this.configWebsites.enable_obj = (params.enable_obj == true || params.enable_obj == null ? true : false);
    	this.configWebsites.primary_billing_id = (params.primary_billing_id ? params.primary_billing_id : null);
    	this.configWebsites.primary_shipping_id = (params.primary_shipping_id ? params.primary_shipping_id : null);
    	this.configWebsites.is_default_billing = (params.is_default_billing ? params.is_default_billing : false);
    	this.configWebsites.is_default_shipping = (params.is_default_shipping ? params.is_default_shipping : false);
    	this.configWebsites.allow_billing_save = (params.allow_billing_save ? params.allow_billing_save : null);
    	this.configWebsites.allow_shipping_save = (params.allow_shipping_save ? params.allow_shipping_save : null);
    	this.configWebsites.billing_save_id = (params.billing_save_id ? params.billing_save_id : null);
    	this.configWebsites.shipping_save_id = (params.shipping_save_id ? params.shipping_save_id : null);
    	
    	this.websiteId = this.configWebsites.enablers.website_id;
		this.initConfig(this);
    	this.cacheHandlers = {};
    	
    	this.enableObject(this, this.enableObj);
    },
    initConfig : function (addr) {
    	if (addr.websiteId > 0)
    		addr.config = addr.configWebsites[addr.websiteId];
    	else
    		addr.config = addr.configWebsites["0"]; // admin website
    	addr.config.enablers = addr.configWebsites.enablers;
    	
    	addr.configWebsites.is_tippers_required = (addr.configWebsites.is_tippers_required == true || addr.configWebsites.enable_obj == null ? true : false);
    	addr.triggerBaseId = (addr.config.trigger || null);
    	addr.optionsConfig = (addr.config.options || {});
    	addr.fieldsConfig = (addr.config.fields || {});
    	addr.requiredClass = (addr.config.required_class || "required-entry");
    	addr.state = addr.configWebsites.state; // billing, shipping or all

    	addr.primaryBilling = (addr.configWebsites.primary_billing_id != null && $(addr.configWebsites.primary_billing_id) != undefined ? $(addr.configWebsites.primary_billing_id) : null);
    	addr.primaryShipping = (addr.configWebsites.primary_shipping_id != null && $(addr.configWebsites.primary_shipping_id) != undefined ? $(addr.configWebsites.primary_shipping_id) : null);

    	addr.isDefaultBilling = (addr.configWebsites.is_default_billing == true ? true : false);
    	addr.isDefaultShipping = (addr.configWebsites.is_default_shipping == true ? true : false);

    	if (!addr.configWebsites.is_tippers_required) {
    		for(var fieldName in addr.fieldsConfig) {
    			if (fieldName.indexOf('pfpj_tip_pers') != -1) {
    				for(var fieldOption in addr.fieldsConfig[fieldName]) {
    					if (addr.state == 'all' || addr.state == 'billing')
    						addr.fieldsConfig[fieldName][fieldOption]['billing'].required = false;
    					if (addr.state == 'all' || addr.state == 'shipping')
    						addr.fieldsConfig[fieldName][fieldOption]['shipping'].required = false;
    				}
    				break;
    			}
    		}
    	}

    	addr.tippersValue = (!(addr.configWebsites.tippers_value == "" || addr.configWebsites.tippers_value == undefined) ? addr.configWebsites.tippers_value : addr.config.default_option);
    	if (addr.configWebsites.other_elements_paths == undefined) {
    		addr.configWebsites.other_elements_paths = {
    			levels_to_parent: 1,
    			label_rel_path: null,
    			label_required_class: null,
    			label_inner_html_tag: null,
    			label_inner_html_text: null,
    			label_inner_html_tag_class: null,
    			levels_to_parent_ancestor: false
    		};
    	}
    	addr.levelsToParet = (addr.configWebsites.other_elements_paths.levels_to_parent != undefined ? addr.configWebsites.other_elements_paths.levels_to_parent : 1);
    	addr.labelRelativePath = (addr.configWebsites.other_elements_paths.label_rel_path != undefined ? addr.configWebsites.other_elements_paths.label_rel_path : null);
    	addr.labelRequiredClass = (addr.configWebsites.other_elements_paths.label_required_class != undefined ? addr.configWebsites.other_elements_paths.label_required_class : null);
    	addr.labelInnerHtmlTag = (addr.configWebsites.other_elements_paths.label_inner_html_tag != undefined ? addr.configWebsites.other_elements_paths.label_inner_html_tag : null);
    	addr.labelInnerHtmlText = (addr.configWebsites.other_elements_paths.label_inner_html_text != undefined ? addr.configWebsites.other_elements_paths.label_inner_html_text : null);
    	addr.labelInnerHtmlTagClass = (addr.configWebsites.other_elements_paths.label_inner_html_tag_class != undefined ? addr.configWebsites.other_elements_paths.label_inner_html_tag_class : null);
    	addr.levelsToParentAncestor = (addr.configWebsites.other_elements_paths.levels_to_parent_ancestor != undefined ? addr.configWebsites.other_elements_paths.levels_to_parent_ancestor : false);
    	
    	addr.isRoFieldName = "";
    	if (addr.config.is_ro_field != "") {
    		addr.isRoFieldName = addr.config.is_ro_field;
    	}
    	
    	addr.countryCheck = false;
    	if (addr.config.country_check != "") {
    		addr.countryCheck = (addr.config.country_check == false ? false : true);
    	}
    	addr.countryIdFieldName = "";
    	if (addr.config.country_id_field != "") {
    		addr.countryIdFieldName = addr.config.country_id_field;
    	}
    	addr.allowCountries = [];
    	if (addr.config.allow_countries != "") {
    		addr.allowCountries = addr.config.allow_countries;
    	}
    },
    enableObject : function(addr, enableObj, initObj) {
    	if (!enableObj) {
    		addr.enableObj = false;
    		return false;
    	}
    	if (initObj == undefined || initObj == null) {
    		initObj = true;
    	}
    	
    	addr.enableObj = enableObj;
    	addr.fields = {};
    	addr.fieldsSimulated = {};
    	for(var fieldName in addr.fieldsConfig) {
    		if ($(fieldName)) {
    			addr.fields[fieldName] = $(fieldName);
    			var skey = "";
    			if (fieldName.indexOf('pfpj_for_billing') != -1)
    				skey = 'pfpj_for_billing';
    			if (fieldName.indexOf('pfpj_for_shipping') != -1)
    				skey = 'pfpj_for_shipping';
    			
    			if (skey != "") {
    				var simFieldName;
					simFieldName = fieldName.replace(skey, skey + '_simulation');
					simFieldName = simFieldName.replace('_simulation_simulation', '_simulation');
					addr.fieldsSimulated[simFieldName] = $(simFieldName);
    			}
    		}
    	}

    	addr.options = {};
    	for(var optionValue in addr.optionsConfig) {
    		if ($(addr.triggerBaseId + optionValue)) {
    			addr.options[optionValue] = $(addr.triggerBaseId + optionValue);
    		}
    	}

    	for(var option in addr.options) {
    		addr.cacheHandlers[option+"option"] = {
    			'element': addr.options[option],
    			'event':   'click',
    			'handler': addr.eventListenerTippers.bindAsEventListener(addr, addr)
    		};
    		Event.observe(addr.options[option],'click',addr.cacheHandlers[option+"option"]["handler"]);
    	}

    	if (addr.state == 'all' || addr.state == 'billing') {
    		addr.cacheHandlers["statefields_billing"] = {
    			'element': addr.fields[addr.getFieldName(addr, 'pfpj_for_billing')],
    			'event':   'change',
    			'handler': addr.eventListenerStateFields.bindAsEventListener(addr, addr)
    		}
    		Event.observe(addr.fields[addr.getFieldName(addr, 'pfpj_for_billing')],'change', addr.cacheHandlers["statefields_billing"]["handler"]);
    	}

    	if (addr.state == 'all' || addr.state == 'shipping') {
    		addr.cacheHandlers["statefields_shipping"] = {
    			'element': addr.fields[addr.getFieldName(addr, 'pfpj_for_shipping')],
    			'event':   'change',
    			'handler': addr.eventListenerStateFields.bindAsEventListener(addr, addr)
    		}
    		Event.observe(addr.fields[addr.getFieldName(addr, 'pfpj_for_shipping')],'change',addr.cacheHandlers["statefields_shipping"]["handler"]);
    	}

    	if (addr.primaryBilling != null) {
    		addr.cacheHandlers["primary_billing"] = {
    			'element': addr.primaryBilling,
    			'event':   'change',
    			'handler': addr.eventListenerPrimaryBilling.bindAsEventListener(addr, addr)
    		}
    		Event.observe(addr.primaryBilling,'change',addr.cacheHandlers["primary_billing"]["handler"]);
    	}
    	if (addr.primaryShipping != null) {
    		addr.cacheHandlers["primary_shipping"] = {
    			'element': addr.primaryShipping,
    			'event':   'change',
    			'handler': addr.eventListenerPrimaryShipping.bindAsEventListener(addr, addr)
    		}
    		Event.observe(addr.primaryShipping,'change',addr.cacheHandlers["primary_shipping"]["handler"]);
    	}
    	
    	addr.registerSaveAllowed(addr);

    	if (initObj) {
    		addr.initObject(addr);
    	}

    	return true;
    },
    initObject : function(addr) {
    	addr.switchOptions(addr);
    },
    setTippersValue : function (addr, v) {
    	addr.tippersValue = v;
    },
    setStateDefaultValue : function(addr, name, state) {
    	var _name = addr.getFieldName(addr, name);
    	if (addr.isDefaultBilling && _name == 'pfpj_for_billing') {
    		addr.fields[_name].checked = true;
    		addr.fields[_name].value = 1;
    		addr.fieldsSimulated[addr.getSimulatedFieldName(addr, _name)].value = addr.fields[_name].value;
    	} else if (addr.isDefaultShipping && _name == 'pfpj_for_shipping') {
    		addr.fields[_name].checked = true;
    		addr.fields[_name].value = 1;
    		addr.fieldsSimulated[addr.getSimulatedFieldName(addr, _name)].value = addr.fields[_name].value;
    	} else {
    		addr.fields[_name].value = addr.getDefaultValue(addr, _name, addr.tippersValue, state);
    		addr.fields[_name].checked = (addr.fields[_name].value == 1 ? true : false);
    		addr.fieldsSimulated[addr.getSimulatedFieldName(addr, _name)].value = addr.fields[_name].value;
    	}
    },
    eventListenerTippers : function(e, addr) {
    	addr.setTippersValue(addr, Event.element(e).value);
    	if (addr.state == 'all' || addr.state == 'billing')
    		addr.setStateDefaultValue(addr, 'pfpj_for_billing', addr.state);
    	if (addr.state == 'all' || addr.state == 'shipping')
    		addr.setStateDefaultValue(addr, 'pfpj_for_shipping', addr.state);
    	addr.switchOptions(addr);
    },
    eventListenerStateFields : function(e, addr) {
    	var el = Event.element(e);
    	if (el.id == addr.getFieldName(addr, 'pfpj_for_billing'))
    		addr.fieldsSimulated[addr.getSimulatedFieldName(addr, 'pfpj_for_billing')].value = (el.checked == true ? 1 : 0);
    	if (el.id == addr.getFieldName(addr, 'pfpj_for_shipping'))
    		addr.fieldsSimulated[addr.getSimulatedFieldName(addr, 'pfpj_for_shipping')].value = (el.checked == true ? 1 : 0);
    	for(var optionValue in addr.options) {
			if (addr.options[optionValue].checked == true) {
				addr.setTippersValue(addr, optionValue);
			}
		}

		addr.setStateFieldsByPrimary(addr, el);
    	addr.switchOptions(addr);
    },
    setStateFieldsByPrimary : function (addr, el) {
    	if (el.id == addr.getFieldName(addr, 'pfpj_for_billing')) {
			if (addr.primaryBilling !== null) {
				if (addr.primaryBilling.checked)
					addr.isDefaultBilling = true;
				else
					addr.isDefaultBilling = false;
			}
    		if (addr.isDefaultBilling) {
				el.checked = true;
    			el.value = 1;
    			addr.fieldsSimulated[addr.getSimulatedFieldName(addr, 'pfpj_for_billing')].value = el.value;
    		}
		}
		if (el.id == addr.getFieldName(addr, 'pfpj_for_billing') && addr.primaryBilling != null) {
			el.value = (el.checked ? 1 : 0);
			addr.fieldsSimulated[addr.getSimulatedFieldName(addr, 'pfpj_for_billing')].value = el.value;
			if (!el.checked && addr.primaryBilling.checked)
				addr.primaryBilling.checked = false;
		}

		if (el.id == addr.getFieldName(addr, 'pfpj_for_shipping')) {
			if (addr.primaryShipping !== null) {
				if (addr.primaryShipping.checked) {
					addr.isDefaultShipping = true;
				} else {
					addr.isDefaultShipping = false;
				}
			}
			if (addr.isDefaultShipping) {
    			el.checked = true;
    			el.value = 1;
    			addr.fieldsSimulated[addr.getSimulatedFieldName(addr, 'pfpj_for_shipping')].value = el.value;
			}
		}
		if (el.id == addr.getFieldName(addr, 'pfpj_for_shipping') && addr.primaryShipping != null) {
			el.value = (el.checked ? 1 : 0);
			addr.fieldsSimulated[addr.getSimulatedFieldName(addr, 'pfpj_for_shipping')].value = el.value;
			if (!el.checked && addr.primaryShipping.checked)
				addr.primaryShipping.checked = false;
		}
    },
    eventListenerPrimaryBilling : function(e, addr) {
    	if (Event.element(e).checked) {
    		var billingName = addr.getFieldName(addr, 'pfpj_for_billing');
    		addr.fields[billingName].checked = true;
    		addr.fields[billingName].value = 1;
    		addr.fieldsSimulated[addr.getSimulatedFieldName(addr, 'pfpj_for_billing')].value = addr.fields[billingName].value;
    		addr.isDefaultBilling = true;
    	} else {
    		addr.isDefaultBilling = false;
    	}
    	addr.eventListenerStateFields(e, addr);
    },
    eventListenerPrimaryShipping : function(e, addr) {
    	if (Event.element(e).checked) {
    		var shippingName = addr.getFieldName(addr, 'pfpj_for_shipping');
    		addr.fields[shippingName].checked = true;
    		addr.fields[shippingName].value = 1;
    		addr.fieldsSimulated[addr.getSimulatedFieldName(addr, 'pfpj_for_shipping')].value = addr.fields[shippingName].value;
    		addr.isDefaultShipping = true;
    	} else {
    		addr.isDefaultShipping = false;
    	}
    	addr.eventListenerStateFields(e, addr);
    },
    getFieldName : function (addr, name) {
    	for(var fieldName in addr.fields) {
    		if (fieldName.indexOf(name) != -1)
    			return fieldName;
    	}
    	return null;
    },
    getSimulatedFieldName : function (addr, name) {
    	for(var simFieldName in addr.fieldsSimulated) {
    		if (simFieldName.indexOf(name) != -1)
    			return simFieldName;
    	}
    	return null;
    },
    getIsForBilling : function (addr) {
    	var billingEl = addr.fields[addr.getFieldName(addr, 'pfpj_for_billing')];
//if (billingEl.checked == true)
		if (billingEl.value == 1) {
			billingEl.checked = true;
    		return true;
		}
    	return false;
    },
    getIsForShipping : function (addr) {
    	var shippingEl = addr.fields[addr.getFieldName(addr, 'pfpj_for_shipping')];
//if (shippingEl.checked == true)
    	if (shippingEl.value == 1) {
    		shippingEl.checked = true;
    		return true;
    	}
    	return false;
    },
    isShowField : function (addr, fieldName, tippers_value, state, check_state_field) {
    	var ret;
    	if (state == 'billing') {
    		ret = ((check_state_field && addr.getIsForBilling(addr)) || !check_state_field) && addr.fieldsConfig[fieldName][tippers_value][state].show;
    	} else if (state == 'shipping') {
    		ret = ((check_state_field && addr.getIsForShipping(addr)) || !check_state_field) && addr.fieldsConfig[fieldName][tippers_value][state].show;
    	} else {
    		ret = ((check_state_field && addr.getIsForBilling(addr)) || !check_state_field) && addr.fieldsConfig[fieldName][tippers_value]['billing'].show;
    		ret = ret || (((check_state_field && addr.getIsForShipping(addr)) || !check_state_field) && addr.fieldsConfig[fieldName][tippers_value]['shipping'].show);
    	}
    	return ret;
    },
    isRequiredField : function (addr, fieldName, tippers_value, state, check_state_field) {
    	var ret;
    	if (state == 'billing') {
    		ret = ((check_state_field && addr.getIsForBilling(addr)) || !check_state_field) && addr.fieldsConfig[fieldName][tippers_value][state].required;
    	} else if (state == 'shipping') {
    		ret = ((check_state_field && addr.getIsForShipping(addr)) || !check_state_field) && addr.fieldsConfig[fieldName][tippers_value][state].required;
    	} else {
    		ret = ((check_state_field && addr.getIsForBilling(addr)) || !check_state_field) && addr.fieldsConfig[fieldName][tippers_value]['billing'].required;
    		ret = ret || (((check_state_field && addr.getIsForShipping(addr)) || !check_state_field) && addr.fieldsConfig[fieldName][tippers_value]['shipping'].required);
    	}
    	return ret;
    },
    isValidationSectionField : function (addr, fieldName, tippers_value, state, check_state_field) {
    	var ret;
    	if (state == 'billing') {
    		ret = ((check_state_field && addr.getIsForBilling(addr)) || !check_state_field) && (addr.fieldsConfig[fieldName][tippers_value][state].validation_section && addr.fieldsConfig[fieldName][tippers_value][state].validation_class != "");
    	} else if (state == 'shipping') {
    		ret = ((check_state_field && addr.getIsForShipping(addr)) || !check_state_field) && (addr.fieldsConfig[fieldName][tippers_value][state].validation_section && addr.fieldsConfig[fieldName][tippers_value][state].validation_class != "");
    	} else {
    		ret = ((check_state_field && addr.getIsForBilling(addr)) || !check_state_field) && (addr.fieldsConfig[fieldName][tippers_value]['billing'].validation_section && addr.fieldsConfig[fieldName][tippers_value]['billing'].validation_class != "");
    		ret = ret || (((check_state_field && addr.getIsForShipping(addr)) || !check_state_field) && (addr.fieldsConfig[fieldName][tippers_value]['shipping'].validation_section && addr.fieldsConfig[fieldName][tippers_value]['shipping'].validation_class != ""));
    	}
    	return ret;
    },
    getValidationClass : function (addr, fieldName, tippers_value, state) {
    	
    	if (state == 'all') {
    		if (addr.fieldsConfig[fieldName][tippers_value]['billing'].validation_class != "") {
    			return addr.fieldsConfig[fieldName][tippers_value]['billing'].validation_class;
    		} else if (addr.fieldsConfig[fieldName][tippers_value]['shipping'].validation_class != "") {
    			return addr.fieldsConfig[fieldName][tippers_value]['shipping'].validation_class;
    		}
    	} else if (addr.fieldsConfig[fieldName][tippers_value][state].validation_class) {
    		return addr.fieldsConfig[fieldName][tippers_value][state].validation_class;
    	}
    	return "";
    },
    getAllValidationClassesByField : function (addr, fieldName) {
    	var ret;
    	ret = {};
    	for(var fieldOption in addr.fieldsConfig[fieldName]) {
    		for(var state in addr.fieldsConfig[fieldName][fieldOption]) {
    			if (addr.fieldsConfig[fieldName][fieldOption][state].validation_class) {
    				ret[fieldOption + "_" + state] = addr.fieldsConfig[fieldName][fieldOption][state].validation_class;
    			}
    		}
    	}
    	return ret;
    },
    getDefaultValue : function(addr, fieldName, tippers_value, state) {
    	var defaultValue;
    	if (state != 'all') {
    		defaultValue = addr.fieldsConfig[fieldName][tippers_value][state].defaultValue;
    	} else {
    		defaultValue = (addr.fieldsConfig[fieldName][tippers_value]['billing'].defaultValue == 1 ||
    						addr.fieldsConfig[fieldName][tippers_value]['shipping'].defaultValue == 1 ? 1 : 0);
    	}
    	return defaultValue;
    },
    switchOptions : function(addr) {
    	for(var optionValue in addr.options) {
			if (addr.options[optionValue].checked == true) {
				addr.setTippersValue(addr, optionValue);
			}
		}
		
    	var billingName = addr.getFieldName(addr, 'pfpj_for_billing');
    	var shippingName = addr.getFieldName(addr, 'pfpj_for_shipping');

    	if (addr.state == 'all' || addr.state == 'billing')
    		addr.setStateFieldsByPrimary(addr, addr.fields[billingName]);
    	if (addr.state == 'all' || addr.state == 'shipping')
			addr.setStateFieldsByPrimary(addr, addr.fields[shippingName]);

    	var ancestorsEls = {};
		for(var fieldName in addr.fields) {
			if (billingName != fieldName && shippingName != fieldName) {
				if (addr.isShowField(addr, fieldName, addr.tippersValue, addr.state, true)) {
					addr.upParent(addr.fields[fieldName], addr.levelsToParet).show();
					if (addr.levelsToParentAncestor) {
						var parentEl;
						parentEl = addr.upParent(addr.fields[fieldName], addr.levelsToParentAncestor + addr.levelsToParet);
						if (ancestorsEls[parentEl.identify()] == undefined) {
							ancestorsEls[parentEl.identify()] = {"element" : parentEl, "show": true};
						} else {
							ancestorsEls[parentEl.identify()]["show"] = ancestorsEls[parentEl.identify()]["show"] || true;
						}
					}
				} else {
					addr.upParent(addr.fields[fieldName], addr.levelsToParet).hide();
					if (addr.levelsToParentAncestor) {
						var parentEl;
						parentEl = addr.upParent(addr.fields[fieldName], addr.levelsToParentAncestor + addr.levelsToParet);
						if (ancestorsEls[parentEl.identify()] == undefined) {
							ancestorsEls[parentEl.identify()] = {"element" : parentEl, "show": false};
						} else {
							ancestorsEls[parentEl.identify()]["show"] = ancestorsEls[parentEl.identify()]["show"] || false;
						}
					}
					addr.fields[fieldName].value = "";
				}
			}
		}
		
		for(var i in ancestorsEls) {
			if (ancestorsEls[i]["show"]) {
				ancestorsEls[i]["element"].show();
			} else {
				ancestorsEls[i]["element"].hide();
			}
		}

    	if (addr.state == 'all' || addr.state == 'billing') {
	    	if (addr.isShowField(addr, billingName, addr.tippersValue, addr.state, false)) {
	    		addr.upParent(addr.fields[billingName], addr.levelsToParet).show();
	    		if (addr.levelsToParentAncestor) {
    				addr.upParent(addr.fields[billingName], addr.levelsToParentAncestor + addr.levelsToParet).show();
    			}
	    	} else {
	    		addr.upParent(addr.fields[billingName], addr.levelsToParet).hide();
	    		if (addr.levelsToParentAncestor) {
    				addr.upParent(addr.fields[billingName], addr.levelsToParentAncestor + addr.levelsToParet).hide();
    			}
	    		addr.setStateDefaultValue(addr, 'pfpj_for_billing', addr.state);
	    	}
    	}

    	if (addr.state == 'all' || addr.state == 'shipping') {
	    	if (addr.isShowField(addr, shippingName, addr.tippersValue, addr.state, false)) {
	    		addr.upParent(addr.fields[shippingName], addr.levelsToParet).show();
	    		if (addr.levelsToParentAncestor) {
    				addr.upParent(addr.fields[shippingName], addr.levelsToParentAncestor + addr.levelsToParet).show();
    			}
	    	} else {
	    		addr.upParent(addr.fields[shippingName], addr.levelsToParet).hide();
	    		if (addr.levelsToParentAncestor) {
    				addr.upParent(addr.fields[shippingName], addr.levelsToParentAncestor + addr.levelsToParet).hide();
    			}
	    		addr.setStateDefaultValue(addr, 'pfpj_for_shipping', addr.state);
	    	}
    	}

    	for(var fieldName in addr.fields) {
    		if (billingName != fieldName && shippingName != fieldName) {
	    		if (addr.isRequiredField(addr, fieldName, addr.tippersValue, addr.state, true)) {
	    			addr.fields[fieldName].removeClassName(addr.requiredClass);
	    			addr.fields[fieldName].addClassName(addr.requiredClass);
	    			addr.removeLabelRequired(addr, addr.fields[fieldName]);
	    			addr.addLabelRequired(addr, addr.fields[fieldName]);
	    		} else {
	    			addr.fields[fieldName].removeClassName(addr.requiredClass);
	    			addr.removeLabelRequired(addr, addr.fields[fieldName]);
	    		}
	    		
	    		if (addr.isValidationSectionField(addr, fieldName, addr.tippersValue, addr.state, true)) {
	    			var validationClasses;
	    			validationClasses = addr.getAllValidationClassesByField(addr, fieldName);
	    			for (var i in validationClasses) {
	    				addr.fields[fieldName].removeClassName(validationClasses[i]);
	    			}
	    			addr.fields[fieldName].addClassName(addr.getValidationClass(addr, fieldName, addr.tippersValue, addr.state));
	    		} else {
	    			var validationClasses;
	    			validationClasses = addr.getAllValidationClassesByField(addr, fieldName);
	    			for (var i in validationClasses) {
	    				addr.fields[fieldName].removeClassName(validationClasses[i]);
	    			}
	    		}
    		}
    	}
    },
    mutateFieldsNames : function(addr, prefix_new, prefix_old, suffix_new, suffix_old) {
    	
    	if (addr.registerFieldsMutate == undefined)
    		addr.registerFieldsMutate = {};
    	addr.registerFieldsMutate.prefix_new = prefix_new;
    	addr.registerFieldsMutate.prefix_old = prefix_old;
    	addr.registerFieldsMutate.suffix_new = suffix_new;
    	addr.registerFieldsMutate.suffix_old = suffix_old;
    		
    	var newFieldsConfig = {};
    	for(var fieldName in addr.fieldsConfig) {
    		var newFieldName = addr._mutateName(fieldName, prefix_new, prefix_old, suffix_new, suffix_old);
    		newFieldsConfig[newFieldName] = addr.fieldsConfig[fieldName];
    	}

    	addr.fieldsConfig = newFieldsConfig;
    	addr.triggerBaseId = addr._mutateName(addr.triggerBaseId, prefix_new, prefix_old, suffix_new, suffix_old);
    	
    	if (addr.isRoFieldName != "") {
    		addr.isRoFieldName = addr._mutateName(addr.isRoFieldName, prefix_new, prefix_old, suffix_new, suffix_old);
    	}
    	
    	if (addr.countryIdFieldName != "") {
    		addr.countryIdFieldName = addr._mutateName(addr.countryIdFieldName, prefix_new, prefix_old, suffix_new, suffix_old);
    	}
    },
    mutatePrimaryNames : function(addr, prefix_new, prefix_old, suffix_new, suffix_old) {
    	
    	if (addr.registerPrimaryMutate == undefined)
    		addr.registerPrimaryMutate = {};
    	addr.registerPrimaryMutate.prefix_new = prefix_new;
    	addr.registerPrimaryMutate.prefix_old = prefix_old;
    	addr.registerPrimaryMutate.suffix_new = suffix_new;
    	addr.registerPrimaryMutate.suffix_old = suffix_old;
    	
    	var primary_billing_id;
		var primary_shipping_id;

		if (addr.primaryBilling != null) {
			primary_billing_id = addr._mutateName(addr.primaryBilling.id, prefix_new, prefix_old, suffix_new, suffix_old);
			addr.primaryBilling = ($(primary_billing_id) != undefined ? $(primary_billing_id) : null);
		}

		if (addr.primaryShipping != null) {
			primary_shipping_id = addr._mutateName(addr.primaryShipping.id, prefix_new, prefix_old, suffix_new, suffix_old);
			addr.primaryShipping = ($(primary_shipping_id) != undefined ? $(primary_shipping_id) : null);
		}
    },
    _mutateName : function (fieldName, prefix_new, prefix_old, suffix_new, suffix_old) {
    	var newFieldName = fieldName;
    	if (!((prefix_new == "" || prefix_new == null) && (prefix_old == "" || prefix_old == null))) {
    		if (!(prefix_old == "" || prefix_old == null)) {
    			if (newFieldName.indexOf(prefix_old) == 0) {
    				newFieldName = prefix_new + newFieldName.substr(prefix_old.length);
    			}
    		} else {
    			newFieldName = prefix_new + newFieldName;
    		}
		}

		if (!((suffix_new == "" || suffix_new == null) && (suffix_old == "" || suffix_old == null))) {
    		if (!(suffix_old == "" || suffix_old == null)) {
    			if (newFieldName.indexOf(suffix_old) > -1 && newFieldName.indexOf(suffix_old) == newFieldName.length - suffix_old.length) {
    				newFieldName = newFieldName.substr(0, newFieldName.indexOf(suffix_old)) + suffix_new;
    			}
    		} else {
    			newFieldName = newFieldName + suffix_new;
    		}
		}

    	return newFieldName;
    },
    setFieldsValues : function (addr, addr_source, prefix_source, prefix_target, suffix_source, sufix_target, is_switch) {
    	for(fieldName in addr.fields) {
    		var field_source;
    		if(addr.fields[fieldName]) {
    			field_source = $(addr._mutateName(fieldName, prefix_source, prefix_target, suffix_source, sufix_target));
    			if (field_source)
    				addr.fields[fieldName].value = field_source.value;
    		}
    	}
		for(var optionValue in addr.options) {
			addr.options[optionValue].checked = addr_source.options[optionValue].checked;
			if (addr.options[optionValue].checked == true) {
				addr.setTippersValue(addr, optionValue);
			}
		}

		if (is_switch === true) {
			addr.switchOptions(addr);
		}
    },
    getAllowedByCountry : function (addr) {
    	if (!addr.countryCheck) {
    		return true;
    	}
    	// no country, allow all countries
    	if (!(typeof addr.allowCountries == "object" && addr.allowCountries.length > 0)) {
    		return true;
    	}
    	
    	var countryEl;
    	countryEl = addr.getCountryEl(addr);
    	if (countryEl == false) {
    		return true;
    	}

    	var allow = false;
    	var country_id;
    	if (countryEl.type == "select-one") {
    		country_id = countryEl.options[countryEl.selectedIndex].value;
    	} else if (countryEl.type == "hidden" || countryEl.type == "text") {
    		country_id = countryEl.value;
    	} else {
    		return true;
    	}
    	
    	for (var i in addr.allowCountries) {
    		if (addr.allowCountries[i] == country_id) {
    			allow = true;
    		}
    	}

    	return allow;
    },
    getCountryEl : function (addr) {
    	if (!addr.countryCheck) {
    		return false;
    	}
    	var countryEl;
    	if (!(addr.countryIdFieldName != "" && (countryEl = $(addr.countryIdFieldName)) != undefined)) {
    		return false;
    	}
    	return countryEl;
    },
    eventListenerSetFieldsValues : function (e, addr, addr_source, prefix_source, prefix_target, suffix_source, sufix_target, is_switch) {
    	var trigger_el;
    	trigger_el = Event.element(e);
		if (trigger_el.checked) {
	    	addr.setFieldsValues(addr, addr_source, prefix_source, prefix_target, suffix_source, sufix_target, is_switch);
		}
    },
    syncWithBilling : function (addr, addr_source, trigger, prefix_source, prefix_target, suffix_source, sufix_target, is_switch) {
    	if ($(trigger)) {
    		addr.triggerSyncWithBilling = $(trigger);
    		addr.cacheHandlers["sync_billing"] = {
    			'element': addr.triggerSyncWithBilling,
    			'event':   'click',
    			'handler': addr.eventListenerSetFieldsValues.bindAsEventListener(addr, addr, addr_source, prefix_source, prefix_target, suffix_source, sufix_target, is_switch)
    		}
    		Event.observe(addr.triggerSyncWithBilling,'click', addr.cacheHandlers["sync_billing"]["handler"]);
    	}
    },
    eventListenerCheckFieldState : function(e, addr) {
    	var el = Event.element(e);
    	el.checked = true;
    	el.value = 1;
    },
    registerSaveAllowed : function(addr) {
    	/*@todo Remove hardcoded address_id ids. */
    	if (addr.cacheHandlers["allow_save_billing"] != undefined) {
			Event.stopObserving(addr.cacheHandlers["allow_save_billing"]["element"], addr.cacheHandlers["allow_save_billing"]["event"], addr.cacheHandlers["allow_save_billing"]["handler"]);
		}
		if (addr.cacheHandlers["allow_save_shipping"] != undefined) {
			Event.stopObserving(addr.cacheHandlers["allow_save_shipping"]["element"], addr.cacheHandlers["allow_save_shipping"]["event"], addr.cacheHandlers["allow_save_shipping"]["handler"]);
		}
    	
    	if (addr.configWebsites.allow_billing_save != null && !addr.configWebsites.allow_billing_save && addr.configWebsites.billing_save_id != null) {
    		var el = $(addr.configWebsites.billing_save_id);
    		if (el != undefined && addr.isRoFieldName != "" && $(addr.isRoFieldName).value == 1 && addr.getAllowedByCountry(addr) && el.checked && $('order-billing_address_customer_address_id') != undefined && $('order-billing_address_customer_address_id').value > 0) {
    			el.checked = false;
    		}
    		if (el != undefined) {
    			addr.cacheHandlers["allow_save_billing"] = {
	    			'element': el,
	    			'event':   'click',
	    			'handler': addr.eventListenerAllowSave.bindAsEventListener(addr, addr)
	    		}
	    		Event.observe(el, addr.cacheHandlers["allow_save_billing"]["event"], addr.cacheHandlers["allow_save_billing"]["handler"]);
    		}
    	}
    	if (addr.configWebsites.allow_shipping_save != null && !addr.configWebsites.allow_shipping_save && addr.configWebsites.shipping_save_id != null) {
    		var el = $(addr.configWebsites.shipping_save_id);
    		if (el != undefined && addr.isRoFieldName != "" && $(addr.isRoFieldName).value == 1 && addr.getAllowedByCountry(addr) && el.checked && $('order-shipping_address_customer_address_id') != undefined && $('order-shipping_address_customer_address_id').value > 0) {
    			el.checked = false;
    		}
    		if (el != undefined) {
    			addr.cacheHandlers["allow_save_shipping"] = {
	    			'element': el,
	    			'event':   'click',
	    			'handler': addr.eventListenerAllowSave.bindAsEventListener(addr, addr)
	    		}
	    		Event.observe(el, addr.cacheHandlers["allow_save_shipping"]["event"], addr.cacheHandlers["allow_save_shipping"]["handler"]);
    		}
    	}
    },
    eventListenerAllowSave : function(e, addr) {
    	var el = Event.element(e);
    	if (addr.isRoFieldName != "" && $(addr.isRoFieldName).value == 1 && addr.getAllowedByCountry(addr) && el.checked && $('order-'+addr.state+'_address_customer_address_id') != undefined  && $('order-'+addr.state+'_address_customer_address_id').value > 0) {
    		var tt = el.checked;
			el.checked = false;
			if (tt) {
				alert("Address save is not allowed here. Please use instead Customer Edit Address page.");
			}
		}
    },
    removeLabelRequired : function (addr, el) {
    	if (addr.labelRelativePath == null) return;

    	var parentEl;
    	var labelEl;
    	parentEl = addr.upParent(el, addr.levelsToParet);
    	if (parentEl == undefined) return;
    	if (addr.labelRelativePath == null) return;
    	labelEl = parentEl.down(addr.labelRelativePath);
    	if (labelEl == undefined) return;
    	
    	if (addr.labelRequiredClass != null) {
    		if (labelEl.hasClassName(addr.labelRequiredClass)) {
    			labelEl.removeClassName(addr.labelRequiredClass);
    		}
    	}
    	
    	if (addr.labelInnerHtmlTag == null) return;
    	var innerEl;
    	innerEl = labelEl.down(addr.labelInnerHtmlTag);
    	if (innerEl != undefined) {
    		innerEl.remove();
    	}
    },
	addLabelRequired : function (addr, el) {
		if (addr.labelRelativePath == null) return;

    	var parentEl;
    	var labelEl;
    	parentEl = addr.upParent(el, addr.levelsToParet);
    	if (parentEl == undefined) return;
    	if (addr.labelRelativePath == null) return;
    	labelEl = parentEl.down(addr.labelRelativePath);
    	if (labelEl == undefined) return;
    	
    	if (addr.labelRequiredClass != null) {
    		if (!labelEl.hasClassName(addr.labelRequiredClass)) {
    			labelEl.addClassName(addr.labelRequiredClass);
    		}
    	}
    	
    	if (addr.labelInnerHtmlTag == null) return;
    	var innerEl;
    	var tag_insert;
    	tag_insert = false;
    	innerEl = labelEl.down(addr.labelInnerHtmlTag);
    	if (innerEl == undefined) {
    		innerEl = new Element(addr.labelInnerHtmlTag);
    		tag_insert = true;
    	}
    	if (addr.labelInnerHtmlTagClass != null && !innerEl.hasClassName(addr.labelInnerHtmlTagClass)) {
			innerEl.addClassName(addr.labelInnerHtmlTagClass);
		}
		if (addr.labelInnerHtmlText != null) {
			innerEl.update(addr.labelInnerHtmlText);
		}
		if (tag_insert) {
			labelEl.insert(innerEl);
		}
	},
	upParent : function (el, levels) {
		var p;
		p = undefined;
		var s;
		s = true;
		for (var i = 0; i < levels; i++) {
			if (i == 0)
				p = el;
			if (p.up() != undefined) {
				p = p.up();
			} else {
				s = false;
				break;
			}
		}
		if (!s)
			p = undefined;
		return p;
	}
});

/**
 * Adds logic to enablers, customer pfpj_is_ro, country.
*/
PfpjRom.FrontendAddressTippersBehaviour = Class.create(PfpjRom.AddressTippersBehaviour, {
	initialize: function($super, tippers_value, state, config, other_elements_paths, params) {
		this.cacheEnablersHandlers = {};
		$super(tippers_value, state, config, other_elements_paths, params);
		
		this.setModelEnabled(this);
		this.isRo = false;
	},
	setModelEnabled : function (addr) {
		addr.modelEnabled = true; // if false will nullify RO fields and behaviour
		if (addr.countryCheck) {
			if (!addr.getAllowedByCountry(addr)) {
				addr.modelEnabled = false;
				addr.isRo = false;
				if (addr.isRoField != undefined) {
					addr.isRoField.value = 0;
				}
			}
		}
	},
	disableAllFields : function (addr) {
		for(var optionValue in addr.options) {
			addr.options[optionValue].disabled = true;
			addr.upParent(addr.options[optionValue], addr.levelsToParet).hide();
			if (addr.levelsToParentAncestor) {
				addr.upParent(addr.options[optionValue], addr.levelsToParentAncestor + addr.levelsToParet).hide();
			}
		}
		for(var fieldName in addr.fields) {
			if (addr.fields[fieldName] != undefined) {
				if (!(fieldName.indexOf('company') != -1 || fieldName.indexOf('vat_id') != -1)) {
					addr.fields[fieldName].disabled = true;
					addr.upParent(addr.fields[fieldName], addr.levelsToParet).hide();
					addr.fields[fieldName].removeClassName(addr.requiredClass);
					var validationClasses;
					validationClasses = addr.getAllValidationClassesByField(addr, fieldName);
	    			for (var i in validationClasses) {
	    				addr.fields[fieldName].removeClassName(validationClasses[i]);
	    			}
					if (addr.levelsToParentAncestor) {
						addr.upParent(addr.fields[fieldName], addr.levelsToParentAncestor + addr.levelsToParet).hide();
					}
				}
			}
		}
		for(var fieldName in addr.fields) {
			if (addr.fields[fieldName] != undefined) {
				if (fieldName.indexOf('company') != -1 || fieldName.indexOf('vat_id') != -1) {
					// revert to default
					addr.fields[fieldName].disabled = false;
					addr.upParent(addr.fields[fieldName], addr.levelsToParet).show();
					addr.fields[fieldName].removeClassName(addr.requiredClass);
					addr.removeLabelRequired(addr, addr.fields[fieldName]);
					var validationClasses;
					validationClasses = addr.getAllValidationClassesByField(addr, fieldName);
	    			for (var i in validationClasses) {
	    				addr.fields[fieldName].removeClassName(validationClasses[i]);
	    			}
					if (addr.levelsToParentAncestor) {
						addr.upParent(addr.fields[fieldName], addr.levelsToParentAncestor + addr.levelsToParet).show();
					}
				}
			}
		}
		for(var fieldName in addr.fieldsSimulated) {
			if (addr.fields[fieldName] != undefined) {
				addr.fields[fieldName].disabled = true;
			}
		}
	},
	disableIsRoField : function (addr) {
		if (addr.isRoField != undefined) {
			addr.isRoField.disabled = true;
			addr.upParent(addr.isRoField, addr.levelsToParet).hide();
			if (addr.levelsToParentAncestor) {
				addr.upParent(addr.isRoField, addr.levelsToParentAncestor + addr.levelsToParet).hide();
			}
		}
	},
	unregEvents : function (addr) {
		for (var cn in addr.cacheHandlers) {
			Event.stopObserving(addr.cacheHandlers[cn]["element"], addr.cacheHandlers[cn]["event"], addr.cacheHandlers[cn]["handler"]);
		}
	},
	enableAllFields : function (addr) {
		for(var optionValue in addr.options) {
			addr.options[optionValue].disabled = false;
			addr.upParent(addr.options[optionValue], addr.levelsToParet).show();
			if (addr.levelsToParentAncestor) {
				addr.upParent(addr.options[optionValue], addr.levelsToParentAncestor + addr.levelsToParet).show();
			}
		}
		for(var fieldName in addr.fields) {
			if (addr.fields[fieldName] != undefined) {
				addr.fields[fieldName].disabled = false;
			}
		}
		for(var fieldName in addr.fieldsSimulated) {
			if (addr.fields[fieldName] != undefined) {
				addr.fields[fieldName].disabled = false;
			}
		}
	},
	enableIsRoField : function (addr) {
		if (addr.isRoField != undefined) {
			addr.isRoField.disabled = false;
			addr.upParent(addr.isRoField, addr.levelsToParet).show();
			if (addr.levelsToParentAncestor) {
				addr.upParent(addr.isRoField, addr.levelsToParentAncestor + addr.levelsToParet).show();
			}
		}
	},
	eventListenerCountryChange : function(e, addr, enableObj) {
		addr.initConfig(addr);
		addr.afterInitConfig(addr);
		addr.setModelEnabled(addr);
		addr.enableObject(addr, enableObj);
    },
    afterInitConfig : function (addr) {
    	if (addr.registerFieldsMutate != undefined) {
			addr.mutateFieldsNames(
				addr,
				addr.registerFieldsMutate.prefix_new,
		    	addr.registerFieldsMutate.prefix_old,
		    	addr.registerFieldsMutate.suffix_new,
		    	addr.registerFieldsMutate.suffix_old
			);
		}
		if (addr.registerPrimaryMutate != undefined) {
			addr.mutatePrimaryNames(
				addr,
				addr.registerPrimaryMutate.prefix_new,
		    	addr.registerPrimaryMutate.prefix_old,
		    	addr.registerPrimaryMutate.suffix_new,
		    	addr.registerPrimaryMutate.suffix_old
			);
		}
    },
    setIsRoByCountry : function (addr, isRoEl) {
    	if (addr.countryCheck) {
	    	if (addr.getAllowedByCountry(addr)) {
				addr.isRo = true;
				isRoEl.value = 1;
	    	} else {
				addr.isRo = false;
				isRoEl.value = 0;
	    	}
    	}
    }
});

PfpjRom.FrontendAddressTippersBehaviour.addMethods({
	enableObject : function($super, addr, enableObj, initObj) {
		if (!enableObj) {
    		addr.enableObj = false;
    		return false;
    	}
    	
    	if (initObj == undefined || initObj == null) {
    		initObj = true;
    	}
    	
    	if (addr.isRoField == undefined && addr.isRoFieldName != "") {
    		addr.isRoField = $(addr.isRoFieldName);
    	}
    	
    	if (addr.countryCheck) {
	    	var countryEl;
	    	countryEl = addr.getCountryEl(addr);
	    	if (countryEl != false) {
		    	if (addr.cacheEnablersHandlers["triggerer_country"] != undefined) {
					Event.stopObserving(addr.cacheEnablersHandlers["triggerer_country"]["element"], addr.cacheEnablersHandlers["triggerer_country"]["event"], addr.cacheEnablersHandlers["triggerer_country"]["handler"]);
				}
				addr.cacheEnablersHandlers["triggerer_country"] = {
					'element': countryEl,
					'event':   'change',
					'handler': addr.eventListenerCountryChange.bindAsEventListener(addr, addr, enableObj)
				};
				Event.observe(countryEl,'change',addr.cacheEnablersHandlers["triggerer_country"]["handler"]);
	    	}
	    	
	    	if (addr.modelEnabled) {
	    		addr.setIsRoByCountry(addr, addr.isRoField);
	    	}
    	}

		if (!addr.modelEnabled || !addr.isRo) {
			$super(addr, enableObj, false);
			
    		addr.disableAllFields(addr);
    		if (!addr.modelEnabled)
    			addr.disableIsRoField(addr);
    		addr.unregEvents(addr);
		} else {
			$super(addr, enableObj, initObj);
			
			addr.enableAllFields(addr);
    		addr.enableIsRoField(addr);
		}
		
		return true;
	},
	setFieldsValues : function ($super, addr, addr_source, prefix_source, prefix_target, suffix_source, sufix_target, is_switch) {
    	addr.initConfig(addr);
		addr.afterInitConfig(addr);
		addr.setModelEnabled(addr);
		addr.enableObject(addr, true);
		
		if (addr.modelEnabled && addr.isRo) {
			$super(addr, addr_source, prefix_source, prefix_target, suffix_source, sufix_target, is_switch);
		}
    }
});

PfpjRom.DefaultAddress = Class.create({
    initialize : function(config) {
    	config = config || {};
    	this.allowedCountries = (config.allowed_countries ? config.allowed_countries : []);
    	this.tipPersValues = (config.tip_pers_values ? config.tip_pers_values : {natural: "1", legal: "2"});
    	this.prefixId = (config.prefix_id ? config.prefix_id : "");
    	this.idCountry = (config.id_country ? config.id_country : "country_id");
    	
    	if ($(this.prefixId+'company') != undefined && $(this.prefixId+'pfpj_tip_pers1') != undefined) {
    		Event.observe($(this.prefixId+'company'), 'change', this.eventListenerCompany.bindAsEventListener(this, this));
    	}
    	if ($(this.prefixId+this.idCountry) != undefined && $(this.prefixId+'pfpj_is_ro') != undefined) {
    		Event.observe($(this.prefixId+this.idCountry), 'change', this.eventListenerCountry.bindAsEventListener(this, this));
    	}
    },
	eventListenerCompany : function (e, def_addr) {
		var el_company;
		el_company = Event.element(e);
		if ($(this.prefixId+'pfpj_tip_pers1') != undefined) {
			if (el_company.value != "") {
				$(this.prefixId+'pfpj_tip_pers1').value = this.tipPersValues.legal;
			} else {
				$(this.prefixId+'pfpj_tip_pers1').value = this.tipPersValues.natural;
			}
		}
	},
	eventListenerCountry : function (e, def_addr) {
		var pfpj_is_ro = false;
		var el_country_id;
		el_country_id = Event.element(e);
		def_addr.allowedCountries.each(function(val) {
			if (el_country_id.options[el_country_id.selectedIndex].value == val) {
				pfpj_is_ro = true;
			}
		});
		if (pfpj_is_ro) {
			$(this.prefixId+'pfpj_is_ro').value = 1;
		} else {
			$(this.prefixId+'pfpj_is_ro').value = 0;
		}
	}
});

if(Validation) {

/**
 * Romanian CNP (Personal Identification Code | Cod Numeric Personal) validator:
 *  - the input must have 13 digits;
 *  - format: SYYMMDDRROOOC - S=sex(1-9) YY=year(00-99) MM=month(01-12) DD=day(01-31) OOO=ord number for the person(001-999) C=CRC number(0-9)
 *
 * Info about CNP:
 *
 * RO law: http://www.cdep.ro/pls/legis/legis_pck.htp_act_text?idt=4095
 * wiki: http://ro.wikipedia.org/wiki/Cod_numeric_personal
 * description of algorithm: http://www.validari.ro/cnp
 *
 */
Validation.add('validate-pfpj-cnp', 'CNP invalid.', function(v, elm) {
	if(Validation.get('IsEmpty').test(v)) return true;

	if (v.length != 13)
	    return false;

	var regex = /^([0-9])([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{3})([0-9])$/;
	var patt = new RegExp(regex);
	var matches = patt.exec(v);
	if(!matches)
	    return false;

	var sex = matches[1];
	var year = matches[2];
	var month = matches[3];
	var day = matches[4];
	var regionCode = matches[5];
	var ord = matches[6];
	var crc = matches[7];

	if (sex <= 0)
		return false;

	var validateDate = true;
	var yPrefix = "";
	if (sex == 1 || sex == 2)
		yPrefix = "19";
	else if (sex == 3 || sex == 4)
		yPrefix = "18";
	else if (sex == 5 || sex == 6)
		yPrefix = "20";
	else if (sex == 7 || sex == 8 || sex == 9)
		validateDate = false;

	if (month <= 0 || month > 12)
		return false;

	if (day <= 0 || day > 31)
		return false;

	if (validateDate) {
		var testDate = new Date(parseInt(yPrefix + year, 10), parseInt(month, 10) - 1, parseInt(day, 10), 0, 0, 0);

		if ((testDate.getFullYear() != parseInt(yPrefix + year, 10)) || (testDate.getMonth() + 1 != parseInt(month, 10)) || (testDate.getDate() != parseInt(day, 10))) {
			return false;
		} else {
			var today = new Date();
			if (today < testDate) {
				return false;
			}
		}
	}

	var regionsCodes = {
		'01':	'Alba',	'02': 'Arad', '03': 'Argeş', '04': 'Bacău', '05': 'Bihor', '06': 'Bistriţa-Năsăud', '07': 'Botoşani', '08': 'Braşov', '09': 'Brăila',
		'10': 'Buzău', '11': 'Caraş-Severin', '12': 'Cluj', '13': 'Constanţa', '14': 'Covasna', '15': 'Dâmboviţa', '16': 'Dolj', '17': 'Galaţi', '18': 'Gorj',
		'19': 'Harghita', '20': 'Hunedoara', '21': 'Ialomiţa', '22': 'Iaşi', '23': 'Ilfov', '24': 'Maramureş', '25': 'Mehedinţi', '26': 'Mureş', '27': 'Neamţ',
		'28': 'Olt', '29': 'Prahova', '30': 'Satu Mare', '31': 'Sălaj', '32': 'Sibiu', '33': 'Suceava', '34': 'Teleorman', '35': 'Timiş', '36': 'Tulcea',
		'37': 'Vaslui', '38': 'Vâlcea', '39': 'Vrancea', '40': 'Bucureşti', '41': 'Bucureşti S.1', '42': 'Bucureşti S.2', '43': 'Bucureşti S.3', '44': 'Bucureşti S.4',
		'45': 'Bucureşti S.5', '46': 'Bucureşti S.6', '51': 'Călăraşi', '52': 'Giurgiu'
	};

	if (regionsCodes[regionCode] == undefined)
		return false;

	if (ord <= 0)
		return false;

	var tk = '279146358279';
	var s = 0;
	for (var i = 0; i < 12; i++)
		s += v.charAt(i) * tk.charAt(i);
	var c = s % 11;
	if (!(c < 10))
		c = 1;

	if (crc != c) {
		return false;
	}

	return true;
});

/**
 * Romanian CIF (Tax Identification Number | Cod de Identificare Fiscala) validator:
 *  - the input must have 13 digits;
 *  - format: can have as prefix 'RO' or 'RO ' if the fiscal entity pays TVA(VAT) tax.
 *  - format: ZZZZZZZZZC - ZZZZZZZZZ=code digits(max 9 digits in length) C=CRC number(0-9)
 *
 * Info about CIF:
 *
 * http://ro.wikipedia.org/wiki/Cod_fiscal
 * http://ro.wikipedia.org/wiki/Cod_de_identificare_fiscal%C4%83
 * description of algorithm: http://www.validari.ro/cif
 *
 */
Validation.add('validate-pfpj-cif', 'CIF invalid.', function(v, elm) {
	if(Validation.get('IsEmpty').test(v)) return true;

	var prefix = "";
	if (v.toLowerCase().indexOf("ro") == 0) {
    	prefix = "RO";
    	v = v.replace(/ro\s*/i, "");
    }

	if (v.length > 10)
	    return false;

	var regex = /^([0-9]{1,9})([0-9])$/;
	var patt = new RegExp(regex);
	var matches = patt.exec(v);
	if(!matches)
	    return false;

	var code = matches[1];
	var crc = matches[2];

	v = v.split("").reverse().join("").substr(1);
	var tk = "753217532".split("").reverse().join("");
	var s = 0;
	for (var i = 0; i < v.length; i++)
		s += v.charAt(i) * tk.charAt(i);
	var c = s * 10 % 11;
	if (!(c < 10))
		c = 0;

	if (crc != c) {
		return false;
	}

	return true;
});

}