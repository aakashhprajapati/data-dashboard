import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LikelihoodChart = ({ data, width = 600, height = 300 }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data || data.length === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const margin = { top: 20, right: 30, bottom: 40, left: 50 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Create scales
        const xScale = d3.scaleBand()
            .domain(data.map(d => d._id || 'Unknown'))
            .range([0, innerWidth])
            .padding(0.2);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.avgLikelihood || 0)])
            .range([innerHeight, 0])
            .nice();

        // Create axes
        g.append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        g.append("g")
            .call(d3.axisLeft(yScale));

        // Add line
        const line = d3.line()
            .x(d => xScale(d._id || 'Unknown') + xScale.bandwidth() / 2)
            .y(d => yScale(d.avgLikelihood || 0))
            .curve(d3.curveMonotoneX);

        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#ff6b6b")
            .attr("stroke-width", 3)
            .attr("d", line);

        // Add circles
        g.selectAll(".circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d._id || 'Unknown') + xScale.bandwidth() / 2)
            .attr("cy", d => yScale(d.avgLikelihood || 0))
            .attr("r", 5)
            .attr("fill", "#ff6b6b")
            .attr("stroke", "white")
            .attr("stroke-width", 2);

        // Add title
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text("Average Likelihood Trend");

    }, [data, width, height]);

    return (
        <div style={{ marginBottom: '20px' }}>
            <svg ref={svgRef} width={width} height={height}></svg>
        </div>
    );
};

export default LikelihoodChart;