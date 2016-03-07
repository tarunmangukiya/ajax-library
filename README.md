# jQuery Ajax Library

A light-weight jQuery Library to enhance the existing ajax tasks. It provides different libraries such as Ajax Form, Ajax File Upload, Ajax Link, etc. It uses both client and server side to successfully submit and manipulate the existing forms.

Contains the following Library for advanced ajax support
  - AjaxForm
  - VirtualAjaxForm (Documentation writing is pending, you can have a look at example on how to use it)

##AjaxForm
AjaxForm modifies existing html form into a advanced AjaxHelper AjaxForm. Using AjaxForm you can not only make the form ajax but also add the advanced functionalities like displaying errors, information messages, update the parts of page in case of success, redirect between pages, etc.

AjaxForm supports [jQuery Validation Plugin](http://jqueryvalidation.org/) and Bootstrap Validator for validation. You can even define error messages from server side and the messages will be displayed in the your respective validation format.

###Use
####Client Side
```javascript
$(function(){
  $("#form").ajaxForm(options);
});
```
####Server Side Response
```php
{
    "status" : "success|error",
	"message" : "Form Submitted Successfully."
}
```
###Options - Client Side
Here the options may have the following options:
```javascript
options = {
	validatorType: 'null|jQueryValidation|BootstrapValidator',
	action: '/',
	type: 'POST',
	loadingClass: 'ajax-loading',
	message: {
		pre: '<div class="alert alert-info" role="alert">',
		post: '</div>'
	},
	error : {
		pre: '<div class="alert alert-danger" role="alert">',
		post: '</div>'
	}
	beforeSubmit: function(element) { },
	afterSubmit: function(response|jqXHR, element) { },
	errorPlacement: function(error, element) { },
	messagePlacement: function(message, element) { },
	onSuccess: function(response, element) { },
	onError: function(response, element) { },
	onFail: function(jqXHR, element) { }
 }
```
#####validatorType:
Validator that you have used in the form `[null|jQueryValidation|BootstrapValidator]`

#####action:
URL to which Form has to be submitted

#####type:
type of request `[GET|POST]`

#####loadingClass:
Name of Class that will be assigned to form element when the form ajax is processing. Can be used to put a loading indicator in the form.

#####message/error:
**pre**: Pre HTML that will be prepended before the message/error text `<div class="alert alert-info" role="alert">`

**post**: Post HTML that will be prepended before the message/error text `</div>`
#####beforeSubmit:
Define the function that will be called before the ajax request is sent. You can assign return value `false` to stop the form to be submitted.
#####afterSubmit:
Define the function that will be called after the ajax request completes.
Arguments of the request will be jqXHR or response and element respectively.
#####errorPlacement:
Function that will handle the error placement for the form.
This function will be executed when the response `status` from server is `error`.
Arguments of the request will be response and element respectively.
#####messagePlacement:
Function that will handle the message placement for the form.
This function will be executed when the response `status` from server is `success`.
Arguments of the request will be response and element respectively.
#####messagePlacement:
Define the function that will be called on successful submission of form (Server Side: `"status":"success"`).
#####onError:
Define the function that will be called on error in submission of form. (Server Side: `"status":"error"`).
#####onFail:
Define the function that will be called on server error. (No Response or invalid response from server)

###Response From Server Side
#####Display error messages
Display error messages for each inputs (works only in case of validator)
```json
{
    "status":"error",
    "elements" : {
        "user_name":"User name already exists. Please select another user name."
    }
}
```
Here, `elements` will contain the object of each field (name attribute in html) with error message.

Example (in case of **Laravel** users using Validator):
```php
return \Response::json(['status' => 'error', 'elements' => $validator->errors()]);
```
Example (in case of **CodeIgniter** users using Validator):
```php
return \Response::json(['status' => 'error', 'elements' => $this->form_validation->error_array()]);
```
Or, you can manually provide the response in json format.

#####Redirect Page to another page on success
Sometimes we need to redirect the page on successful submit. Thus we can define `redirect` variable in response. Thus the page will be redirected to the specified url (or refreshed in case of blank url).
```javascript
 {
	"status" : "success|error", 				// (required) - shows the form is submitted successfully
	"redirect" : "http://mysite.com/page2/", 	// (optional) - in case of success, the page is redirected to this url
	"message" : "Form Submitted, or has Error"	// (optional) - Shows the custom message/error on top of the form
 }
```
#####Update the Elements of a page
Sometimes in case of success, you can update the parts of the page rather than refreshing the whole page (most of us use this only).
For this you have to add this variables `updateExtra`, `affectedElement`, `content` in response.
```javascript
{
	"status" : "success",				// Status must be 'success'
	"updateExtra" : true,				// Shows that we need to update a part of web page
	"affectedElement" : ".selector",	// CSS Selector of the element to be updated
	"content" : "<h1>Updated</h1>"		// New Content in HTML Format
 }
```
By using this the `'content'` html will be replaced in `'.selector'` element.

### Contact
You can tweet me at [@tarunmangukiya](https://twitter.com/TarunMangukiya) for additional information.


**Enjoy guys, don't forget to provide your suggestions and reviews for continious improvements.**