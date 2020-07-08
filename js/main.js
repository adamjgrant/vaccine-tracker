class Component extends Mozart {};
const m = Component.index,
      components = [
        "report_navigator"
      ];

components.forEach(component => new Component(component));
