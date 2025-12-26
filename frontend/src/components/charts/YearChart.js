import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const YearChart = ({ data, width = 600, height = 300 }) => {
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

        // Filter out null/undefined years and sort
        const filteredData = data
            .filter(d => d._id && d._id !== 'null' && d._id !== 'undefined')
            .sort((a, b) => a._id - b._id);

        if (filteredData.length === 0) {
            // Display message if no year data
            g.append("text")
                .attr("x", innerWidth / 2)
                .attr("y", innerHeight / 2)
                .attr("text-anchor", "middle")
                .text("No year data available");
            return;
        }

        // Create scales
        const xScale = d3.scaleBand()
            .domain(filteredData.map(d => d._id))
            .range([0, innerWidth])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(filteredData, d => d.count || 0)])
            .range([innerHeight, 0])
            .nice();

        // Create line generator
        const line = d3.line()
            .x(d => xScale(d._id) + xScale.bandwidth() / 2)
            .y(d => yScale(d.count || 0))
            .curve(d3.curveMonotoneX);

        // Create area generator
        const area = d3.area()
            .x(d => xScale(d._id) + xScale.bandwidth() / 2)
            .y0(innerHeight)
            .y1(d => yScale(d.count || 0))
            .curve(d3.curveMonotoneX);

        // Create axes
        g.append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale));

        g.append("g")
            .call(d3.axisLeft(yScale));

        // Add area
        g.append("path")
            .datum(filteredData)
            .attr("fill", "rgba(135, 206, 235, 0.3)")
            .attr("d", area);

        // Add line
        g.append("path")
            .datum(filteredData)
            .attr("fill", "none")
            .attr("stroke", "#1e88e5")
            .attr("stroke-width", 2)
            .attr("d", line);

        // Add circles
        g.selectAll(".circle")
            .data(filteredData)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d._id) + xScale.bandwidth() / 2)
            .attr("cy", d => yScale(d.count || 0))
            .attr("r", 4)
            .attr("fill", "#1e88e5")
            .attr("stroke", "white")
            .attr("stroke-width", 2)
            .on("mouseover", function(event, d) {
                d3.select(this).attr("r", 6);
                
                // Add tooltip
                g.append("text")
                    .attr("class", "tooltip")
                    .attr("x", xScale(d._id) + xScale.bandwidth() / 2)
                    .attr("y", yScale(d.count || 0) - 10)
                    .attr("text-anchor", "middle")
                    .text(`Year ${d._id}: ${d.count} records`)
                    .style("font-weight", "bold")
                    .style("fill", "#333");
            })
            .on("mouseout", function() {
                d3.select(this).attr("r", 4);
                g.selectAll(".tooltip").remove();
            });

        // Add title
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text("Records by Year");

    }, [data, width, height]);

    return (
        <div style={{ marginBottom: '20px' }}>
            <svg ref={svgRef} width={width} height={height}></svg>
        </div>
    );
};

export default YearChart;