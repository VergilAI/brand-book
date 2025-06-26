# Data Files Documentation

## Overview

This directory contains data files used throughout the Vergil Design System, primarily for graph visualizations and demonstrations.

## Structure

```
data/
├── graph/                    # Graph visualization data
│   ├── basic/               # Basic graph structures
│   │   └── graph.json      # Simple node-edge relationships
│   │
│   ├── animated/            # Animated graph data
│   │   ├── graph-animated.json     # Basic animations
│   │   └── constellation-demo.json # Demo constellation
│   │
│   └── staged/              # Staged animation data
│       ├── graph-staged.json       # Multi-stage animations
│       └── carousel-graph-staged.json # Carousel demo
│
└── CLAUDE.md               # This file
```

## Graph Data Format

### Basic Structure
```json
{
  "nodes": [
    {
      "id": "unique_id",
      "label": "Display Name",
      "type": "node_type",
      "properties": {},
      "position": { "x": null, "y": null, "fixed": false }
    }
  ],
  "relationships": [
    {
      "id": "rel_id",
      "source": "source_node_id",
      "target": "target_node_id",
      "type": "relationship_type",
      "properties": {}
    }
  ]
}
```

### Animation Properties
For animated graphs, nodes and relationships can include:
- `animationStage`: Which stage (0, 1, 2...) the element appears
- `animationOrder`: Order within the stage
- `animationDelay`: Additional delay in milliseconds

### Usage

1. **Basic Graphs** - Simple visualizations without animation
2. **Animated Graphs** - Graphs with entrance animations
3. **Staged Graphs** - Complex multi-stage reveal animations

## Components Using This Data

- `GraphConstellation` - Uses basic and animated data
- `GraphConstellationPersistent` - Uses staged data for complex animations
- Brand book graph demos - Various visualization examples

## Adding New Data

When adding new graph data:
1. Place in appropriate subdirectory
2. Follow the established format
3. Include meaningful node labels
4. Test with relevant components
5. Document any special properties