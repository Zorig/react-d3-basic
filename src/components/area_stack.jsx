"use strict";

import {
  default as React,
  Component,
  PropTypes,
} from 'react';

export default class AreaStack extends Component {
  constructor (props) {
    super(props);
    this.state = {
      xDomainSet: this.props.xDomain,
      dataSet: this.props.data
    }
  }

  static defaultProps = {
    areaClass: 'react-d3-basics__area_stack',
    interpolate: null,
    areaOpacity: 1,
    duration: 500
  }

  componentDidMount () {
    this._mkStack();
  }

  componentWillReceiveProps(nextProps) {
    const {
      xDomain,
      dataSet
    } = nextProps;

    if(this.state.xDomain !== xDomain) {
      this.setState({
        xDomainSet: xDomain
      })
      this._mkStack();
    }else if(!Object.is(this.state.dataSet, dataSet)) {
      this.setState({
        dataSet: dataSet
      })
      this._mkStack();
    }
  }

  _mkStack() {
    const {
      dataset,
      areaClassName,
      areaOpacity,
      showBrush,
      showZoom,
      duration
    } = this.props;

    const _setStack = this._setStack();
    const _setAxis = this._setAxes();

    // make areas
    var chart = d3.select(React.findDOMNode(this.refs.areaGroup))
      .selectAll(`${areaClassName}`)
      .data(_setStack(dataset))
    .enter().append("g")
      .attr("class", `${areaClassName} area-group`)

    chart.append("path")
      .attr("class", "area")
      .style("fill", (d) => { return d.color} )
      .style("fill-opacity", areaOpacity)
    .transition()
      .duration(duration)
      .ease("linear")
      .attr("d", (d) => { return _setAxis(d.data) })

    if(showBrush)
      chart.selectAll("path")
        .style('clip-path', 'url(#react-d3-basic__brush_focus__clip)');

    if(showZoom)
      chart.selectAll("path")
        .style('clip-path', 'url(#react-d3-basic__zoom_focus__clip)');


  }

  _setStack () {
    return d3.layout.stack()
      .values((d) => { return d.data; });
  }

  _setAxes () {
    const {
      height,
      margins,
      x,
      y,
      xScaleSet,
      yScaleSet,
      interpolate
    } = this.props;

    return d3.svg.area()
      .interpolate(interpolate)
      .x((d) => { return xScaleSet(d.x) })
      .y0((d) => { return yScaleSet(d.y0) })
      .y1((d) => { return yScaleSet(d.y0 + d.y) });
  }

  render() {

    return (
      <g
        ref= "areaGroup"
        >

      </g>
    )
  }
}
