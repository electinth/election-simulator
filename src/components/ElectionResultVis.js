// https://beta.observablehq.com/@mbostock/clustered-bubbles-2

import { SvgChart, helper } from 'd3kit';

class ElectionResultVis extends SvgChart {
  static getDefaultOptions() {
    return helper.deepExtend(super.getDefaultOptions(), {});
  }

  static getCustomEventNames() {
    return [];
  }

  constructor(element, options) {
    super(element, options);

    // this.layers.create([]);

    this.visualize = this.visualize.bind(this);
    this.on('data', this.visualize);
    this.on('options', this.visualize);
    this.on('resize', this.visualize);
  }

  visualize() {
    if (!this.hasData() || !this.hasNonZeroArea()) return;

    const electionResult = this.data();
  }
}

export default ElectionResultVis;
