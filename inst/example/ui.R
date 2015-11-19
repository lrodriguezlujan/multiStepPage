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
                      stepPage("Summon a cat army", "Cats everywhere"),
                      stepPage("Eat a sandwich", "Nam!", br(), ":)"),
                      stepPage("Conquer the world", "B4 dinner"),
                      title = "Masterplan", topButtons = T, bottomButons = T)
      )
    )
  )
)