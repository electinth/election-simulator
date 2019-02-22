import d3 from 'd3';
import centroid from './centroid';

export default function forceCluster() {
  const strength = 0.2;
  let nodes;

  function force(alpha) {
    const centroids = d3.rollup(nodes, centroid, d => d.data.group);
    const l = alpha * strength;
    for (const d of nodes) {
      const {
        x: cx,
        y: cy
      } = centroids.get(d.data.group);
      d.vx -= (d.x - cx) * l;
      d.vy -= (d.y - cy) * l;
    }
  }

  force.initialize = _ => (nodes = _);

  return force;
}
