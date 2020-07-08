m.report_navigator.events(_$ => {
  _$(".next").addEventListener("click", _$.act.go_to_next_page);
  _$(".previous").addEventListener("click", _$.act.go_to_previous_page);
});
