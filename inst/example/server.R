shinyServer(function(input, output, session) {

  output$testoutput <- renderText({
    current <- input$mspage
    if ( is.null(current) ) return( "" )
    else return(current )
  })
})