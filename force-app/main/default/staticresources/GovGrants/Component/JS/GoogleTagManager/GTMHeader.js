var gtmFunction = function(w,d,s,l,i){
    w[l]=w[l]||[];
    w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});
    var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
    j.async=true;
    f.parentNode.insertBefore(j,f);    
};
