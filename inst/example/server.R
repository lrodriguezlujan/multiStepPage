shinyServer(function(input, output, session) {

  observe({
    current <- input$mspage
    if (!is.null(current))
      updateNumericInput(session,"step",value = current)
  })

  observe({
    allowfwd <- input$fwd
    if (!is.null(allowfwd))
      switchStepForward(session,"mspage",allowfwd)
  })

  observe({
    allowback <- input$back
    if (!is.null(allowback))
      switchStepBack(session,"mspage",allowback)
  })

  observe({
    step <- input$step
    if (!is.null(step))
      changeStep(session,"mspage",step)
  })

})