shinyUI(
  fluidPage(
  tags$h2("Multi step page example"),
    multiStepPage("mspage",
                  stepPage("Summon a cat army", "Cats everywhere"),
                  stepPage("Eat a sandwich", "Nam!", br(), ":)"),
                  stepPage("Conquer the world", "B4 dinner"),
                  title = "Masterplan", topButtons = T, bottomButons = T),
  hr(),
  fluidRow( div(h3("Current page: "), textOutput("testoutput", inline = T )))
  )
)