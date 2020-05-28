/*
cruise through links, if ya spot and pdfs, 
convert em to use the hypothes.is proxy.

let us hasten the coming of public peer review
and the next era of scientific publishing ;)

-sneakers
*/

var rxiv_pdf = new RegExp(/\/pdf\/\d*\.\d*/)

function hypothesize(){

	let links = document.getElementsByTagName('a');

	for(let count=0; count<links.length; count++) {
	    let link = links[count];
	    let url = link.getAttribute('href');
	    if (url && url.startsWith('https://via.hypothes.is/')){
	    	// don't prepend multiple times
	    } else if(url && url.endsWith('.pdf')) {
	    	// prepend proxy, rebuilding in case this is url is relative to the domain
	    	let new_url = 'https://via.hypothes.is/' + link.protocol+"//"+link.host+link.pathname;
	    	link.setAttribute('href', new_url);
	    } else if(url && link.host == 'arxiv.org' && rxiv_pdf.test(url)){
	    	// arxiv doesn't link to the pdfs directly, 
	    	// but we know their secrets
	    	let new_url = 'https://via.hypothes.is/' + link.protocol+"//"+link.host+link.pathname+'.pdf';
	    	link.setAttribute('href', new_url);
	    }

	}
};


// ---------
// init
// set up a mutation observer to watch for changes
// call the hypothes.is bookmarklet
// ---------
(function(win) {
    'use strict';
    
    // use a mutation observer to change links whenever new links are added
    doc = win.document, 
    MutationObserver = win.MutationObserver || win.WebKitMutationObserver,
    observer;

    if (!observer) {
        // Watch for changes in the document
        observer = new MutationObserver(hypothesize);
        observer.observe(doc.documentElement, {
            childList: true,
            subtree: true
        });
    }
    // Convert any links we already have
    hypothesize();

    // call bookmarklet
    window.hypothesisConfig = function() { 
    	return { 
    		showHighlights: true, 
    		appType: 'bookmarklet' 
    	}; 
    };

    var s = document.createElement('script');
    s.setAttribute('src', 'https://hypothes.is/embed.js');
    document.body.appendChild(s);
})(this);
