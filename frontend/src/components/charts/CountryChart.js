import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const CountryChart = ({ data, width = 600, height = 400 }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data || data.length === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const margin = { top: 40, right: 20, bottom: 60, left: 80 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Sort data by count
        const sortedData = [...data].sort((a, b) => b.count - a.count).slice(0, 10);

        // Create scales
        const yScale = d3.scaleBand()
            .domain(sortedData.map(d => d._id || 'Unknown'))
            .range([0, innerHeight])
            .padding(0.2);

        const xScale = d3.scaleLinear()
            .domain([0, d3.max(sortedData, d => d.count || 0)])
            .range([0, innerWidth])
            .nice();

        // Create color scale
        const colorScale = d3.scaleSequential(d3.interpolateBlues)
            .domain([0, d3.max(sortedData, d => d.count || 0)]);

        // Create axes
        g.append("g")
            .call(d3.axisLeft(yScale));

        g.append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale));

        // Create bars
        g.selectAll(".bar")
            .data(sortedData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("y", d => yScale(d._id || 'Unknown'))
            .attr("x", 0)
            .attr("height", yScale.bandwidth())
            .attr("width", d => xScale(d.count || 0))
            .attr("fill", d => colorScale(d.count || 0))
            .on("mouseover", function(event, d) {
                d3.select(this).attr("opacity", 0.8);
                
                // Add tooltip
                g.append("text")
                    .attr("class", "tooltip")
                    .attr("x", xScale(d.count || 0) + 5)
                    .attr("y", yScale(d._id || 'Unknown') + yScale.bandwidth() / 2)
                    .attr("dy", "0.35em")
                    .text(`Count: ${d.count}`)
                    .style("font-weight", "bold")
                    .style("fill", "#333");
            })
            .on("mouseout", function() {
                d3.select(this).attr("opacity", 1);
                g.selectAll(".tooltip").remove();
            });

        // Add value labels
        g.selectAll(".label")
            .data(sortedData)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("x", d => xScale(d.count || 0) - 5)
            .attr("y", d => yScale(d._id || 'Unknown') + yScale.bandwidth() / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .text(d => d.count)
            .style("fill", "white")
            .style("font-weight", "bold");

        // Add title
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", 25)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text("Top 10 Countries by Record Count");

    }, [data, width, height]);

    return (
        <div style={{ marginBottom: '20px' }}>
            <svg ref={svgRef} width={width} height={height}></svg>
        </div>
    );
};

export default CountryChart;