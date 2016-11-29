#' Adds the content of www to multisteppage/
#'
#' @importFrom shiny addResourcePath
#'
#' @noRd
#'
.onAttach <- function(...) {
  addResourcePath('multisteppage', system.file('www', package = 'multiStepPage'))
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
multiStepPage <- function(id , ... , title = NULL, prePage = NULL, postPage = NULL,
                          topButtons = FALSE, bottomButtons = TRUE){

  butEl <- div(class = "static-controls",
               div( class = "control back", "Previous"),
               div( class = "control fwd", "Next" ))

  if (topButtons)
    topButtonEl <- butEl
  else
    topButtonEl <- NULL

  if (bottomButtons)
    botButtonEl <- butEl
  else
    botButtonEl <- NULL

  # Create track boxes
  tracker <- createProgressTracker(title, pageOffset = ifelse(is.null(prePage),0,1), ...)
  pages <- createPageContainer(id, prePage, postPage, ...)

  # Create pages

  # Create tag List
  return(
    tagList(
      singleton(tags$head(
        tags$script(src = "multisteppage/js/multiStepPage.js"),
        tags$script(src = "multisteppage/js/multiStepPage-binding.js"),
        tags$link(rel = "stylesheet", type = "text/css", href = "multisteppage/css/multiStepPage.css")
      )),
      div( id = id, class = "multiStepPage-container pt-perspective",
        tracker,
        hr(),
        topButtonEl,
        pages,
        botButtonEl
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

#' Changes current step
#'
#' Changes current step to the one given
#'
#' @param session
#' @param id
#' @param page
#'
#'@export
changeStep <- function(session, id, page){
  session$sendInputMessage(id,list(action = "goto", value = (page - 1) ) )
}

#' Allows/disallows progression
#'
#'
#' @param session
#' @param id
#' @param status (T/F)
#'
#'@export
switchStepForward <- function(session, id, status){
  session$sendInputMessage(id,list(action = "fwd", value = status))
}

#' Allows/disallows going back
#'
#'
#' @param session
#' @param id
#' @param status (T/F)
#'
#'@export
switchStepBack <- function(session, id, status){
  session$sendInputMessage(id,list(action = "back", value = status))
}

#' Force page heigth update (for environments liketabpages)
#'
#' @param session
#' @param id
#'
#' @export
multiStepPageUpdateHeight <- function(session ,id ){
  session$sendInputMessage(id,list(action = "updateHeight"))
}

createProgressTracker <- function(title, pageOffset = 0, ...){

  # Get elements (each one created by stepPage)
  elements <- list(...)

  # Create container div
  container <- div( class = "progresstrack-container")

  # Create the box for each step
  boxes <- lapply(seq_along(elements), function(i,x){
    return( div( class = "progresstrack-box clickable", 'step-num' = (i - 1 + pageOffset),
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

  return(container)
}

createPageContainer <- function(id, prePage, postPage, ...){

  # Get elements (each one created by stepPage)
  elements <- list(...)

  # Pre and post pages
  if (!is.null(prePage)) preEl <- list(content = prePage )
  else preEl <- NULL

  if (!is.null(postPage)) postEl <- list(content = postPage )
  else postEl <- NULL

  elements <- c(list(preEl), elements, list(postEl) )

  # Create container div
  container <- div( class = "pt-page-container")

  # Create the box for each step
  pages <- lapply(seq_along(elements), function(i,x){
    return( div( class = "pt-page", id = paste(id,"page",i,sep = "-"), x[[i]]$content ) )
  },elements)



  # Add boxes
  container <- tagAppendChildren(container,list = pages)

  return(container)
}

# AS input binding
shiny::registerInputHandler("shiny.multiStepPage", function(data, ...) {
  return(data)
}, force = TRUE)