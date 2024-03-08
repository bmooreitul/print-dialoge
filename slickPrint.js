/*
    Example:
    <a href="//example.com" class="print-url">Print</a>

    Events (In chronological order):
    'it.slickPrint.loading'     Fired before the content to print is loaded
    'it.slickPrint.loaded'      Fired when the content to print is loaded
    'it.slickPrint.opening'     Fired before the print dialog box is shown
    'it.slickPrint.opened'      Fired after the print dialog box is shown
    'it.slickPrint.closing'     Fired before the print dialog box closes
    'it.slickPrint.closed'      Fired after the print dialog box closed
*/

//LISTEN FOR PRINT URL ITEMS TO BE CLICKED
$(document).off('click.it.slickPrint.PrintUrl').on('click.it.slickPrint.PrintUrl', '.print-url', function(e){

    //PREVENT OTHER CLICK EVENTS FROM PROPAGATING
    e.preventDefault();

    //TRY TO ASK THE URL TO TRIGGER A PRINT DIALOGUE BOX
    printUrl($(this).attr('href'), $(this));
});

//TRIGGER A PRINT DIALOGE BOX FROM A URL
function printUrl(url, ele = null) {   

    var slickPrintTriggerData = [url, ele];

    $(document).trigger('it.slickPrint.loading', slickPrintTriggerData);

    //CREATE A HIDDEN IFRAME AND APPEND IT TO THE BODY THEN WAIT FOR IT TO LOAD
    $('<iframe src="'+url+'"></iframe>').hide().appendTo('body').on('load', function(){

        $(this).trigger('it.slickPrint.loaded', slickPrintTriggerData);
        
        var oldTitle    = $(document).attr('title');                //GET THE ORIGINAL DOCUMENT TITLE
        var that        = $(this);                                  //STORE THIS IFRAME AS A VARIABLE           
        var title       = $(that).contents().find('title').text();  //GET THE IFRAME TITLE
        $(that).focus();                                            //CALL THE IFRAME INTO FOCUS (FOR OLDER BROWSERS)   

        //SET THE DOCUMENT TITLE FROM THE IFRAME (THIS NAMES THE DOWNLOADED FILE)
        if(title && title.length) $(document).attr('title', title);

        $(this).trigger('it.slickPrint.opening', slickPrintTriggerData);
        
        //TRIGGER THE IFRAME TO CALL THE PRINT
        $(that)[0].contentWindow.print();

        $(this).trigger('it.slickPrint.opened', slickPrintTriggerData);

        //LISTEN FOR THE PRINT DIALOGUE BOX TO CLOSE
        $(window).off('focus.it.slickPrint.PrintUrl').on('focus.it.slickPrint.PrintUrl', function(e){
            e.stopPropagation();                                                    //PREVENT OTHER WINDOW FOCUS EVENTS FROM RUNNING    
            $(that).trigger('it.slickPrint.closing', slickPrintTriggerData);       
            $(that).remove();                                                       //GET RID OF THE IFRAME
            if(title && title.length) $(document).attr('title', oldTitle);          //RESET THE PAGE TITLE
            $(window).off('focus.it.slickPrint.PrintUrl');                          //STOP LISTENING FOR WINDOW FOCUS
            $(document).trigger('it.slickPrint.closed', slickPrintTriggerData);
        });
    });    
};
