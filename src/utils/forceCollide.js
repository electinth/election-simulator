import d3 from 'd3';

export default function forceCollide() {
  const alpha = 0.4; // fixed for greater rigidity!
  const padding1 = 2; // separation between same-color nodes
  const padding2 = 30; // separation between different-color nodes
  let nodes;
  let maxRadius;

  function force() {
    const quadtree = d3.quadtree(nodes, d => d.x, d => d.y);
    for (const d of nodes) {
      const r = d.r + maxRadius;
      const nx1 = d.x - r;
      const ny1 = d.y - r;
      const nx2 = d.x + r;
      const ny2 = d.y + r;
      quadtree.visit((q, x1, y1, x2, y2) => {
        if (!q.length)
          do {
            if (q.data !== d) {
              const r = d.r + q.data.r + (d.data.group === q.data.data.group ? padding1 : padding2);
              let x = d.x - q.data.x;
              let y = d.y - q.data.y;
              let l = Math.hypot(x, y);
              if (l < r) {
                l = ((l - r) / l) * alpha;
                (d.x -= x *= l), (d.y -= y *= l);
                (q.data.x += x), (q.data.y += y);
              }
            }
          } while ((q = q.next));

        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    }
  }

  force.initialize = _ =>
    (maxRadius = d3.max((nodes = _), d => d.r) + Math.max(padding1, padding2));

  return force;
}
