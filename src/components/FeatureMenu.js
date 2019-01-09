import React from 'react';
import Modals from './Modals';
import ToolbarItem from './ToolbarItem';
import ToolbarSubmenu from './ToolbarSubmenu';
import ToolbarDropdown from './ToolbarDropdown';
import LayerActions from '../actions/LayerActions';
import LayerStore from '../stores/LayerStore';
import vectorTools from '../utils/vectorTools';

class Area extends React.Component {
  onClick = () => {
    vectorTools.area(LayerStore.getAllSelected());
  };

  render() {
    let active = this.props.config.numPolys > 0;
    return <ToolbarItem text={'Area'} onClick={this.onClick} active={active} />;
  }
}

class Bearing extends React.Component {
  onClick = () => {
    vectorTools.bearing(LayerStore.getAllSelected());
  };

  render() {
    let active = this.props.config.numPoints == 2;
    return <ToolbarItem text={'Bearing'} onClick={this.onClick} active={active} />;
  }
}

class Distance extends React.Component {
  onClick = () => {
    vectorTools.distance(LayerStore.getAllSelected());
  };

  render() {
    let active = this.props.config.numPoints == 2;
    return <ToolbarItem text={'Distance'} onClick={this.onClick} active={active} />;
  }
}

class Length extends React.Component {
  onClick = () => {
    vectorTools.lineLength(LayerStore.getAllSelected());
  };

  render() {
    let active = this.props.config.numLines > 0;
    return <ToolbarItem text={'Line Length'} onClick={this.onClick} active={active} />;
  }
}

class Delete extends React.Component {
  onClick = () => {
    vectorTools.deleteFeature(LayerStore.getAllSelected());
  };

  render() {
    let active = this.props.config.oneFeature || this.props.config.multiFeature;
    return <ToolbarItem text={'Delete'} onClick={this.onClick} active={active} />;
  }
}

class Simplify extends React.Component {
  onClick = () => {
    vectorTools.simplify(LayerStore.getAllSelected());
  };

  render() {
    let active = this.props.config.line || this.props.config.poly;
    return (
      <ToolbarItem
        text={'Simplify'}
        img={'img/tools/simplify.png'}
        onClick={this.onClick}
        active={active}
      />
    );
  }
}

class Buffer extends React.Component {
  onClick = () => {
    vectorTools.buffer(LayerStore.getAllSelected());
  };

  render() {
    let active = this.props.config.oneFeature || this.props.config.multiFeature;
    return (
      <ToolbarItem
        text={'Buffer'}
        img={'img/tools/buffer.png'}
        onClick={this.onClick}
        active={active}
      />
    );
  }
}

class Flip extends React.Component {
  onClick = () => {
    vectorTools.flip(LayerStore.getAllSelected());
  };

  render() {
    let active = this.props.config.oneFeature || this.props.config.multiFeature;
    return <ToolbarItem text={'Flip'} onClick={this.onClick} active={active} />;
  }
}

class Kinks extends React.Component {
  onClick = () => {
    vectorTools.kinks(LayerStore.getAllSelected());
  };

  render() {
    let active = this.props.config.oneFeature || this.props.config.multiFeature;
    return <ToolbarItem text={'Kinks'} onClick={this.onClick} active={active} />;
  }
}

class Explode extends React.Component {
  onClick = () => {
    vectorTools.explode(LayerStore.getAllSelected());
  };

  render() {
    let active = this.props.config.oneFeature || this.props.config.multiFeature;
    return <ToolbarItem text={'Explode'} onClick={this.onClick} active={active} />;
  }
}

class Combine extends React.Component {
  onClick = () => {
    vectorTools.combine(LayerStore.getAllSelected());
  };

  render() {
    let active = this.props.config.oneFeature || this.props.config.multiFeature;
    return <ToolbarItem text={'Combine'} onClick={this.onClick} active={active} />;
  }
}

class Merge extends React.Component {
  onClick = () => {
    vectorTools.merge(LayerStore.getAllSelected());
  };

  render() {
    let active = this.props.config.multiFeature && this.props.config.oneLayer;
    return (
      <ToolbarItem
        text={'Merge'}
        img={'img/tools/dissolve.png'}
        onClick={this.onClick}
        active={active}
      />
    );
  }
}

class Erase extends React.Component {
  onClick = () => {
    vectorTools.erase(LayerStore.getAllSelected());
  };

  render() {
    let active = this.props.config.numPolys === 2;
    return (
      <ToolbarItem
        text={'Erase'}
        img={'img/tools/difference.png'}
        onClick={this.onClick}
        active={active}
      />
    );
  }
}

class Intersect extends React.Component {
  onClick = () => {
    vectorTools.intersect(LayerStore.getAllSelected());
  };

  render() {
    let active = this.props.config.numPolys === 2;
    return (
      <ToolbarItem
        text={'Intersect'}
        img={'img/tools/intersect.png'}
        onClick={this.onClick}
        active={active}
      />
    );
  }
}

class HexGrid extends React.Component {
  onClick = () => {
    vectorTools.hexgrid(LayerStore.getAllSelected());
  };

  render() {
    let active = this.props.config.oneLayer || this.props.config.multiLayer;
    return <ToolbarItem text={'Hex Grid'} onClick={this.onClick} active={active} />;
  }
}

class HexagonalGrid extends React.Component {
  onClick = () => {
    vectorTools.grid(LayerStore.getSelected(), 'hex');
  };

  render() {
    let active = this.props.config.oneLayer;
    return <ToolbarItem text={'Hexagonal'} onClick={this.onClick} active={active} />;
  }
}

class Quantile extends React.Component {
  onClick = () => {
    vectorTools.quantile(LayerStore.getAllSelected());
  };

  render() {
    let active = this.props.config.oneFeature || this.props.config.multiFeature;
    return <ToolbarItem text={'Quantile'} onClick={this.onClick} active={active} />;
  }
}

class RandomPoints extends React.Component {
  onClick = () => {
    vectorTools.random(LayerStore.getSelected(), 'points');
  };

  render() {
    let active = this.props.config.oneLayer;
    return <ToolbarItem text={'Random Points'} onClick={this.onClick} active={active} />;
  }
}

class RandomPolys extends React.Component {
  onClick = () => {
    vectorTools.random(LayerStore.getSelected(), 'polygons');
  };

  render() {
    let active = this.props.config.oneLayer;
    return <ToolbarItem text={'Random Polys'} onClick={this.onClick} active={active} />;
  }
}

class PointGrid extends React.Component {
  onClick = () => {
    vectorTools.grid(LayerStore.getSelected(), 'point');
  };

  render() {
    let active = this.props.config.oneLayer;
    return <ToolbarItem text={'Point'} onClick={this.onClick} active={active} />;
  }
}

class SquareGrid extends React.Component {
  onClick = () => {
    vectorTools.grid(LayerStore.getSelected(), 'square');
  };

  render() {
    let active = this.props.config.oneLayer;
    return <ToolbarItem text={'Squares'} onClick={this.onClick} active={active} />;
  }
}

class TriangleGrid extends React.Component {
  onClick = () => {
    vectorTools.grid(LayerStore.getSelected(), 'triangle');
  };

  render() {
    let active = this.props.config.oneLayer;
    return <ToolbarItem text={'Triangles'} onClick={this.onClick} active={active} />;
  }
}

class Grids extends React.Component {
  render() {
    let active = true;
    let submenu = [
      <HexGrid {...this.props} key={'HexGrid'} />,
      <PointGrid {...this.props} key={'PointGrid'} />,
      <SquareGrid {...this.props} key={'SquareGrid'} />,
      <TriangleGrid {...this.props} key={'TriangleGrid'} />,
    ];
    return <ToolbarSubmenu text={'Grids'} submenu={submenu} active={active} />;
  }
}

class Transformation extends React.Component {
  render() {
    let active = true;
    let submenu = [
      <Simplify {...this.props} key={'simplify'} />,
      <Buffer {...this.props} key={'buffer'} />,
      <Merge {...this.props} key={'merge'} />,
      <Erase {...this.props} key={'erase'} />,
      <Intersect {...this.props} key={'intersect'} />,
    ];
    return <ToolbarSubmenu text={'Transformation'} submenu={submenu} active={active} />;
  }
}

class Measurement extends React.Component {
  render() {
    let active = true;
    let submenu = [
      <Area {...this.props} key={'area'} />,
      <Distance {...this.props} key={'distance'} />,
      <Bearing {...this.props} key={'bearing'} />,
      <Length {...this.props} key={'lineLength'} />,
    ];
    return <ToolbarSubmenu text={'Measurement'} submenu={submenu} active={active} />;
  }
}

class Misc extends React.Component {
  render() {
    let active = true;
    let submenu = [
      <Flip {...this.props} key={'flip'} />,
      <Explode {...this.props} key={'explode'} />,
    ];
    return <ToolbarSubmenu text={'Misc'} submenu={submenu} active={active} />;
  }
}

class Create extends React.Component {
  render() {
    let active = true;
    let submenu = [
      <RandomPoints {...this.props} key={'RandomPoints'} />,
      <RandomPolys {...this.props} key={'RandomPolys'} />,
    ];
    return <ToolbarSubmenu text={'Create'} submenu={submenu} active={active} />;
  }
}

class FeatureMenu extends React.Component {
  render() {
    let active = true;
    let submenu = [
      <Delete {...this.props} key={'deleteFeature'} />,
      <Create {...this.props} key={'create'} />,
      <Grids {...this.props} key={'grids'} />,
      <Measurement {...this.props} key={'Measurement'} />,
      <Transformation {...this.props} key={'Transformation'} />,
      <Misc {...this.props} key={'Misc='} />,
    ];
    return <ToolbarDropdown text={'Feature'} submenu={submenu} active={active} />;
  }
}

export default FeatureMenu;
