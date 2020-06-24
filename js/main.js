// ELEMENTS
const expander        = document.getElementById("expander"),
      vaccine_tracker = document.getElementById("vaccine-tracker"),
      categories      = document.querySelectorAll(".vaccine-tracker .drawer-navigation > ul > li > a"),
      manufacturers   = Array.from(document.querySelectorAll(".vaccine-tracker .drawer-navigation > ul > li > ul > li > a")),
      reports         = Array.from(document.querySelectorAll(".vaccine-tracker .report")),
      fixed_progress_bar = document.getElementById("fixed_progress_bar"),
      nav_previous    = document.getElementById("nav_previous"),
      nav_next        = document.getElementById("nav_next"),
      report_anchors  = reports.map(report => report.id);

let   current_page    = reports[0].id;

// STRINGS
const EXPANDED_CLASS  = "expanded",
      FOCUSED_CLASS   = "focused";

// UTILITY FUNCTIONS
let debounce, debounceQueue;

debounceQueue = {};

debounce = function(fn, id, delay, args, that) {
  delay = delay || 1000;
  that = that || this;
  args = args || new Array();
  if (typeof debounceQueue[id] !== "object") {
    debounceQueue[id] = new Object();
  }
  if (typeof debounceQueue[id].debounceTimer !== "undefined") {
    clearTimeout(debounceQueue[id].debounceTimer);
  }
  return debounceQueue[id] = {
    fn: fn,
    id: id,
    delay: delay,
    args: args,
    debounceTimer: setTimeout(function() {
      debounceQueue[id].fn.apply(that, debounceQueue[id].args);
      return debounceQueue[id] = void 0;
    }, delay)
  };
};

const getAnchor = (url = document.URL) => {
  return (url.split('#').length > 1) ? url.split('#')[1] : null;
}

function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY
  };
}

const getMiddleThreeAnchorsForCurrentURL = () => {
  const current_anchor = getAnchor(),
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
  const url_without_anchor = document.URL.split("#")[0];
        // base = url_without_anchor.split("?")[0];

  return document.location = `${url_without_anchor}#${anchor}`;
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

const set_current_page = (anchor) => {
  const manufacturer_element = manufacturers.find(m => getAnchor(m.href) === anchor);

  current_page = anchor;

  if (manufacturer_element) {
    const manufacturer_progress = manufacturer_element.querySelector("progress");
    set_value_of_fixed_progress_bar(manufacturer_progress.value)
  }

  console.log(current_page);
}

const detect_current_page = () => {
  const anchor_positions = reports.map(report => {
    return [report.id, getOffset(report).top];
  });
  const vh_half = document.documentElement.clientHeight/2;

  anchor_positions.forEach(position => {
    const top_zone    = window.scrollY - vh_half,
          bottom_zone = window.scrollY + vh_half;

    if (position[1] < bottom_zone && position[1] > top_zone) {
      set_current_page(position[0]);
    }
  });
}

const set_value_of_fixed_progress_bar = (value) => {
  fixed_progress_bar.value = value;
}

window.addEventListener("scroll", e => {
  debounce(detect_current_page, "scrollspy", 250, this);
});
