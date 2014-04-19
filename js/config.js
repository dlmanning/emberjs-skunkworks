define({
	app_name: "MyExampleApp", 
	shim : {
		'ember' : {
			deps: ['handlebars', 'jquery'],
			exports: 'Ember'
		},
    'DS' : {
      deps: ['ember'],
      exports: 'DS'
    }
	},
	paths : {
		'App': 'app',
		'models': 'models',
		'views': 'views',
		'controllers': 'controllers',
    'templates': 'templates',
		/*libs*/
		'jquery': 'libs/jquery-1.10.2',
		'handlebars': 'libs/handlebars-1.1.2',
		'ember': 'libs/ember-1.5.0',
    'DS': 'libs/ember-data',
		/*requirejs-plugins*/
		'text': 'libs/text/text',
		'hbs': 'libs/hbs/hbs',
		'domReady': 'libs/domReady'
	},
	/*hbs plugin options*/
	hbs: {
		disableI18n: true,
		templateExtension: "html"
	}

}); 

