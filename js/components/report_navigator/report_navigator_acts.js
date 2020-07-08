m.report_navigator.acts({
  go_to_next_page(_$, args) {
    _$.act.go_to_anchor({ anchor: _$.act.get_middle_three_anchors_for_current_url().next });
  },

  go_to_previous_page(_$, args) {
    _$.act.go_to_anchor({ anchor: _$.act.get_middle_three_anchors_for_current_url().previous });
  },

  priv: {
    go_to_anchor(_$, args) {
      const url_without_anchor = document.URL.split("#")[0];

      return document.location = `${url_without_anchor}#${args.anchor}`;
    },

    get_anchor(_$, args) {
      const url = args ? args["url"] : document.URL;
      return (url.split('#').length > 1) ? url.split('#')[1] : null;
    },

    report_anchors(_$, args) {
      return Array.from(document.querySelectorAll(".vaccine-tracker .report")).map(report => report.id);
    },

    get_middle_three_anchors_for_current_url(_$, args) {
      const current_anchor = this.get_anchor(),
            report_anchors = this.report_anchors(),
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
  }
});
