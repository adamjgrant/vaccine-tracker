// ELEMENTS
const expander        = document.getElementById("expander"),
      vaccine_tracker = document.getElementById("vaccine-tracker"),
      categories      = document.querySelectorAll(".vaccine-tracker .drawer-navigation > ul > li > a"),
      manufacturers   = document.querySelectorAll(".vaccine-tracker .drawer-navigation > ul > li > ul > li > a"),
      reports         = Array.from(document.querySelectorAll(".vaccine-tracker .report")),
      nav_previous    = document.getElementById("nav_previous"),
      nav_next        = document.getElementById("nav_next");

// STRINGS
const EXPANDED_CLASS  = "expanded",
      FOCUSED_CLASS   = "focused";

// UTILITY FUNCTIONS
const getAnchor = () => {
  return (document.URL.split('#').length > 1) ? document.URL.split('#')[1] : null;
}

const getMiddleThreeAnchorsForCurrentURL = () => {
  const report_anchors = reports.map(report => report.id),
        current_anchor = getAnchor(),
        index_of_current_anchor = report_anchors.indexOf(current_anchor);

  let anchors = {
    previous: report_anchors[index_of_current_anchor - 1],
    current: current_anchor,
    next: report_anchors[index_of_current_anchor + 1]
  }

  if (index_of_current_anchor === 0) anchors.previous = report_anchors[report_anchors.length - 1];
  if (index_of_current_anchor >= report_anchors.length) anchors.previous = report_anchors[0];

  // Preventing undefined values
  for (key in anchors) {
    if (anchors[key] === undefined) anchors[key] = report_anchors[0];
  }

  return anchors;
}

const go_to_anchor = (anchor) => {
  const url_without_anchor = document.URL.split("#")[0],
        base = url_without_anchor.split("?")[0];

  return document.location = `${base}#${anchor}`;
}

// INTERACTIVE FUNCTIONS
expander.addEventListener("click", (e) => {
  vaccine_tracker.classList.toggle(EXPANDED_CLASS);
})

manufacturers.forEach(manufacturer => {
  (manufacturer => {
    manufacturer.addEventListener("click", (e) => {
      vaccine_tracker.classList.toggle(EXPANDED_CLASS);
    });
  })(manufacturer);
});

categories.forEach(category => {
  (category => {
    category.addEventListener("click", (e) => {
      e.stopPropagation();

      // Functions we'll use later
      const get_parent_ul = (el) => {
        if (el.parentNode.tagName === "UL") return el.parentNode
        else return get_parent_ul(el.parentNode);
      }

      const get_category_li = (el) => {
        if (el.tagName === "LI") return el;
        else return get_category_li(el.parentNode);
      }

      // Relative elements
      const parent_ul   = get_parent_ul(e.target),
            category_li = get_category_li(e.target);

      // Focus on a particular category
      parent_ul.classList.toggle(FOCUSED_CLASS);
      categories.forEach(category => {
        const this_category_li = get_category_li(category);
        this_category_li.classList.remove(FOCUSED_CLASS);
      });
      category_li.classList.toggle(FOCUSED_CLASS);
    });
  })(category);
});

nav_previous.addEventListener("click", (e) => {
  go_to_anchor(getMiddleThreeAnchorsForCurrentURL().previous);
});

nav_next.addEventListener("click", (e) => {
  go_to_anchor(getMiddleThreeAnchorsForCurrentURL().next);
});
