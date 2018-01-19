/**
    Smoothly scroll element to the given target (element.scrollLeft)
    for the given duration

    Returns a promise that's fulfilled when done, or rejected if
    interrupted
 */
exports.ScrollTo = (element, target, duration) => {
  console.log("This is a message from the demo package");
  target = Math.round(target)
  duration = Math.round(duration)
  if (duration < 0) {
    return Promise.reject(new Error('bad duration'))
  }
  if (duration === 0) {
    element.scrollLeft = target
    return Promise.resolve()
  }

  var startTime = Date.now()
  var endTime = startTime + duration

  var startLeft = element.scrollLeft
  var distance = target - startLeft

  // based on http://en.wikipedia.org/wiki/Smoothstep
  var smoothStep = (start, end, point) => {
    if (point <= start) { return 0 }
    if (point >= end) { return 1 }
    var x = (point - start) / (end - start) // interpolation
    return x * x * (3 - 2 * x)
  }

  return new Promise((resolve, reject) => {
    // This is to keep track of where the element's scrollLeft is
    // supposed to be, based on what we're doing
    var previousLeft = element.scrollLeft

    // This is like a think function from a game loop
    var scrollFrame = () => {
      if (element.scrollLeft !== previousLeft) {
        reject(new Error('interrupted'))
        return
      }

      // set the scrollLeft for this frame
      var now = Date.now()
      var point = smoothStep(startTime, endTime, now)
      var frameLeft = Math.round(startLeft + (distance * point))
      element.scrollLeft = frameLeft

      // check if we're done!
      if (now >= endTime) {
        resolve()
        return
      }

      // If we were supposed to scroll but didn't, then we
      // probably hit the limit, so consider it done not
      // interrupted.
      if (element.scrollLeft === previousLeft && element.scrollLeft !== frameLeft) {
        resolve()
        return
      }
      previousLeft = element.scrollLeft

      // schedule next frame for execution
      setTimeout(scrollFrame, 0)
    }

    // boostrap the animation process
    setTimeout(scrollFrame, 0)
  })
}
