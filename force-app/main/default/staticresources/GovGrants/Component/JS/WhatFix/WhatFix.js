var whatFixFunction = function(d,s,i){  
    var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s);
    j.language='javascript';
    j.type='text/javascript';
    j.async=true;
    j.src=i;
    f.parentNode.insertBefore(j,f);    
};