/*!
 * jQuery Ajax Library v1.0.0.0
 * Copyright (c) 2015 Tarun Mangukiya
 * Project repository: https://github.com/tarunmangukiya/ajax-library
 * Licensed under the GPL license
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Ajax Library\'s JavaScript requires jQuery')
}

+function ($) {
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {
    throw new Error('Ajax Library\'s JavaScript requires jQuery version 1.9.1 or higher')
  }
}(jQuery);

// Logging Function if enabled in debug case
function log() {
    if (!$.fn.ajaxLib.debug) {
        return;
    }
    if (window.console && window.log) {
        window.console.log('[Ajax Library] ', arguments);
    }
    else if (window.opera && window.opera.postError) {
        window.opera.postError('[Ajax Library] ', arguments);
    }
}

/* Usage
 * Call this method to make the form AjaxForm
 *		$("#form").ajaxForm(options);
 *
 * options = {
			validatorType: null|jQueryValidation|BootstrapValidator,
			action: '/',
			type: 'POST',
			message: {
				pre: '<div class="alert alert-info" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>',
				post: '</div>'
			},
			error : {
				pre: '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>',
				post: '</div>'
			}
 		}
 * The submit method will be binded to the form according to the form validator if used.
 *
 * You can call	the submit method manually.
 *     	$("#form").ajaxSubmit();
 * The form will be submitted using ajax.
 *
 * The Server side response is required to be in JSON format for the Ajax Libarary to work properly.
 * Sample JSON is :
 * 	{
		"status" : "success|error", 				// (required) - shows the form is submitted successfully
		"redirect" : "http://mysite.com/page2/", 	// (optional) - in case of success, the page is redirected to this url
		"message" : "Form Submitted, or has Error"	// (optional) - Shows the custom message/error on top of the form
 	}
 *
 * Sometimes in case of success, you can update the parts of the page
 * rather than refreshing the whole page (most of us use this only).
 * For this you have to add this elements in response.
 *	{
		"status" : "success",				// Status must be 'success'
		"updateExtra" : true,				// Shows that we need to update a part of web page
		"affectedElement" : ".selector",	// CSS Selector of the element to be updated
		"content" : "<h1>Updated</h1>"		// New Content in HTML Format
 	}
 * By using this the 'content' html will be replaced in '.selector' element.
 */
+function ($) {
	$.extend($.fn, {
		ajaxLib: {
			debug: true
		},
		ajaxForm: function (options) {
			if (!this.length) {
				if (options && options.debug && window.console) {
					console.warn("Can't create Ajax Form." );
				}
				return;
			}

			// check if ajaxForm is already applied
			var ajaxfrm = $.data(this[0], "ajaxForm");
			if (ajaxfrm) {
				return ajaxfrm;
			}

			ajaxfrm = new $.ajaxForm(options, this[0]);
			$.data(this[0], "ajaxForm", ajaxfrm);

			return this;
		},
		ajaxSubmit: function (e) {
			var frm = $.data(this[0], "ajaxForm");
			frm.submit({data:this});
		}
	});

	$.ajaxForm = function(options, form){
		this.formSubmitting = $(form);
		this.settings = $.extend(true, {}, $.ajaxForm.defaults, options);
		this.init();
	};

	$.extend($.ajaxForm, {
		defaults: {
			validatorType: null,
			action: '/',
			type: 'POST',
			message: {
				pre: '<div class="alert alert-info" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>',
				post: '</div>'
			},
			error : {
				pre: '<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>',
				post: '</div>'
			}
		},
		settings: {},
		submitButtons: 'input[type=submit], button[type=submit]'
	});

	$.extend($.ajaxForm.prototype, {
		init: function () {
			//Check the validator type and bind the respected submit event
			this.action = (typeof this.formSubmitting.attr("action") === "undefined")?$.ajaxForm.defaults.action:this.formSubmitting.attr("action");
			this.type = (typeof this.formSubmitting.attr("method") === "undefined")?$.ajaxForm.defaults.type:this.formSubmitting.attr("method");

			if(this.settings.validatorType == "BootstrapValidator"){
				this.formSubmitting.on("success.form.bv", this, this.submit);
			}
			else{
				this.formSubmitting.on("submit", this, this.submit);
			}
			log("Binded", this);				
		},
		showElementErrors: function(ele){
			if(this.settings.validatorType == "BootstrapValidator"){
				for (var i = 0; i < ele.length; i++) {
					var err = $(this.formSubmitting.find('[data-bv-for="' + ele[i].name + '"]')[0]);
					var erricon = this.formSubmitting.find('[data-bv-icon-for="' + ele[i].name + '"]');
					err.show().parents(".form-group").removeClass("has-success").addClass("has-error");
					if(typeof erricon!=="undefined") erricon.show().removeClass("glyphicon-ok").addClass("glyphicon-remove");
					if(typeof ele[i].msg!=="undefined"){
						err.text(ele[i].msg);
					}
				}
			}
			else if(this.settings.validatorType == "jQueryValidation"){
				var validator = $(this.formSubmitting).validate();
				validator.showErrors(ele);
			}
		},
		showCustomMessage: function(str){
			if(typeof str !== "undefined"){
				var alert = $.ajaxForm.defaults.message.pre + str.toString() + $.ajaxForm.defaults.message.post;
				this.formSubmitting.prepend(alert);
			}
		},
		showCustomError: function(str){
			if(typeof str !== "undefined"){
				var alert = $.ajaxForm.defaults.error.pre + str.toString() + $.ajaxForm.defaults.error.post;
				this.formSubmitting.prepend(alert);
			}
		},
		handleRedirect: function(url){
			if(typeof url !== "undefined"){
				if(url == ""){
					location.reload();
				}
				else{
					window.location.href = url;
				}
			}
		},
		beforeSubmit: function(){
			this.formSubmitting.find($.ajaxForm.submitButtons).attr("disabled", "disabled");
		},
		afterSubmit: function(){
			this.formSubmitting.find("input[type=submit], button[type=submit]").removeAttr("disabled");
		},
		submit: function (e) {
			if(typeof e.preventDefault !== "undefined") e.preventDefault();
			that = e.data;
			//Check if the validation is valid for jQuery Validator
			if(that.settings.validatorType == "jQueryValidation"){
				log("Checking jQueryValidation");
				var $frm = $(that.formSubmitting);
				if(!$frm.valid()){
					log("jQueryValidation Not Validated Form");
					return false;
				}
			}
			log("Submitting Ajax Form", that.formSubmitting);

			//Create Form Data Object
			that.data = new FormData(that.formSubmitting[0]);

			//Starting submitting the request, thus disable the submit button 
			that.beforeSubmit();
			//Create Ajax and submit form
			$.ajax({
				url:that.action,
				type:that.type,
				data:that.data,
				cache:false,
				contentType: false,
	            processData: false
			}).done(function (data) {
				//If the server responded with data
				var jsonData = data;

				if(typeof data === "string"){
					try{
						jsonData = JSON.parse(data);
					}
					catch(err){
						/* In case of no JSON Server Data the onSuccess method will be called,
						 * the response will be handled by the method itself
						 */
						log("Error in Parsing the server side data as JSON");
						if(typeof that.settings.onSuccess !== "undefined") that.settings.onSuccess(data);
						that.afterSubmit();
						return false;
					}
				}
				
				if(jsonData.status == "success"){
					/* Redirects to the Page if variable is set from server side
					 * Example : jsonData.redirect = "http://google.com"
					 */
					that.handleRedirect(jsonData.redirect);

					/* Updates a specific part of page
					 * Example : jsonData.updateExtra = true,
					 *			affectedElement = ".admin-table tr.active", content = new html data
					 */
					if(jsonData.updateExtra){
						$(jsonData.affectedElement).html(jsonData.content);
					}

					/* Add Extra Message From Server side
					 * Example : jsonData.message = "This message is from server side"
					 */
					that.showCustomMessage(jsonData.message);

					if(typeof that.settings.onSuccess !== "undefined") that.settings.onSuccess(jsonData);
				}
				else if(jsonData.status == "error"){
					var ele = jsonData.elements;
					//Shows the elements with error
					that.showElementErrors(ele);
	
					/* Add Extra Message From Server side
					 * Example : jsonData.message = "This message is from server side"
					 */
					that.showCustomError(jsonData.message);

					if(that.settings.onError != null) that.settings.onError(jsonData);
				}
				that.afterSubmit();
			}).fail(function(e) {
				/* If Ajax Fails due to some reason,
				 * The ResponseText or StatusText will be shown as error
				 */
				log("ajax fail", e);
				var message = ($.fn.ajaxLib.debug)?e.responseText:e.statusText;
				that.showCustomError(message);

				that.afterSubmit();
				if(that.settings.onFail != null) that.settings.onFail(e);
			});

			return false;
		}
	});
}(jQuery);