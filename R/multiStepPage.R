#' Adds the content of www to multisteppage/
#'
#' @importFrom shiny addResourcePath
#'
#' @noRd
#'
.onAttach <- function(...) {
  addResourcePath('multisteppage', system.file('www', package = 'shinyStepPage'))
}

#' MultiStepPage element
#'
#' Creates a multistep page element for shiny
#'
#' @param id
#' @param \dots
#' @param title
#' @param topButtons
#' @param bottomButtons
#' @param width
#' @param height
#'
#'
#' @return A multistep page container (div)
#'
#' @export
multiStepPage <- function(id , ... , title = NULL,
                          topButtons = FALSE, bottomButons = TRUE, width = "100%" , height = "100%"){

  # Convert units and validate. Create style string
  style <- sprintf("width: %s; height: %s;",
                   validateCssUnit(width), validateCssUnit(height))

  # TODO:
  topButtonElement = NULL
  botButtonElement = NULL

  # Create track boxes
  tracker <- createProgressTracker(title, ...)
  pages <- createPageContainer(id,...)

  # Create pages

  # Create tag List
  return(
    tagList(
      singleton(tags$head(
        tags$script(src = "multisteppage/js/multiStepPage.js"),
        tags$link(rel = "stylesheet", type = "text/css", href = "multisteppage/css/multiStepPage.css")
      )),
      div( id = id, class = "multiStepPage-container", style = style,
        tracker,
        topButtonElement,
        pages,
        botButtonElement
      )
    )
  )
}

#' Create a page for a multStepPage element
#'
#' Creates a single page for a multistep element. \code{\link{multiStepPage}}. By default shiny doesnt render hidden outputs
#' (kind of lazy web-evaluation). To ensure that all animations work propperly use \code{\link{outputOptions}} with
#' the \code{suspendWhenHidden} option over all outputs inside a step page
#'
#' @param description A short description of the page for the tracking box
#' @param ... Page content
#'
#' @export
stepPage <- function(description, ... ){
  return(list(description = description, content = tagList(...)))
}

createProgressTracker <- function(title, ...){

  # Get elements (each one created by stepPage)
  elements <- list(...)

  # Create container div
  container <- div( class = "progresstrack-container")

  # Create the box for each step
  boxes <- lapply(seq_along(elements), function(i,x){
    return( div( class = "progresstrack-box clickable", 'step-num' = (i - 1),
                 div( class = "progresstrack-icon" ),
                 div( class = "progresstrack-text",
                      div( class = "progresstrack-step", sprintf("Step %d:", i )),
                      div( class = "progresstrack-description", x[[i]]$description )
                    )
    ))
  },elements)

  # Add title element if it is not null
  if (!is.null(title)) {
    container <- tagAppendChild(container, div( title, class = "progresstrack-box progresstrack-init"))
  }

  # Add boxes
  container <- tagAppendChildren(container,list = boxes)

  # hr sep.
  container <- tagAppendChild(container, tags$hr )

  return(container)
}

createPageContainer <- function(id, ...){

  # Get elements (each one created by stepPage)
  elements <- list(...)

  # Create container div
  container <- div( class = "pt-page-container")

  # Create the box for each step
  pages <- lapply(seq_along(elements), function(i,x){
    return( div( class = "pt-page", id = paste(id,"page",i,sep = "-"), x[[i]]$content ) )
  },elements)

}