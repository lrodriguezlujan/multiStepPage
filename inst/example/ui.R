shinyUI(
  fluidPage(
    titlePanel("Multi step page example"),
    sidebarLayout(
      sidebarPanel(
        numericInput("step","Current step", 0, min = 0, max = 3),
        checkboxInput("fwd", "Allow forward", value = T),
        checkboxInput("back", "Allow back", value = T)
      ),
      mainPanel(
        multiStepPage("mspage",
                      stepPage("Step 1 description", "This is the first page"),
                      stepPage("Step 2 description", "This ", br(), " is ",br()," the ", br(), " second ", br(), " page "),
                      stepPage("Step 3 description", "This is the third page "),
                      prePage = div("PRE PAGE "),
                      postPage = div("POST PAGE"),
                      title = "Masterplan", topButtons = T, bottomButtons = T)
      )
    )
  )
)