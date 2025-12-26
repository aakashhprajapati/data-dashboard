import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const RelevanceChart = ({ data, width = 600, height = 300 }) => {
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
            .domain([0, d3.max(data, d => d.avgRelevance || 0)])
            .range([innerHeight, 0])
            .nice();

        // Create axes
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        g.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(xAxis)
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        g.append("g")
            .attr("class", "y-axis")
            .call(yAxis);

        // Add Y axis label
        g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (innerHeight / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Average Relevance");

        // Create gradient for bars
        const gradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", "relevance-gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%");

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#4CAF50")
            .attr("stop-opacity", 1);

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#2E7D32")
            .attr("stop-opacity", 1);

        // Create bars
        g.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d._id || 'Unknown'))
            .attr("y", d => yScale(d.avgRelevance || 0))
            .attr("width", xScale.bandwidth())
            .attr("height", d => innerHeight - yScale(d.avgRelevance || 0))
            .attr("fill", "url(#relevance-gradient)")
            .on("mouseover", function(event, d) {
                d3.select(this).attr("fill", "#FF9800");
                
                // Add tooltip
                g.append("text")
                    .attr("class", "tooltip")
                    .attr("x", xScale(d._id || 'Unknown') + xScale.bandwidth() / 2)
                    .attr("y", yScale(d.avgRelevance || 0) - 10)
                    .attr("text-anchor", "middle")
                    .text(`Relevance: ${d.avgRelevance ? d.avgRelevance.toFixed(2) : 0}`)
                    .style("font-weight", "bold")
                    .style("fill", "#333");
            })
            .on("mouseout", function(event, d) {
                d3.select(this).attr("fill", "url(#relevance-gradient)");
                g.selectAll(".tooltip").remove();
            });

        // Add value labels on top of bars
        g.selectAll(".value-label")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "value-label")
            .attr("x", d => xScale(d._id || 'Unknown') + xScale.bandwidth() / 2)
            .attr("y", d => yScale(d.avgRelevance || 0) - 5)
            .attr("text-anchor", "middle")
            .text(d => d.avgRelevance ? d.avgRelevance.toFixed(1) : "0")
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .style("fill", "#333");

        // Add title
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text("Average Relevance by Category");

    }, [data, width, height]);

    return (
        <div style={{ marginBottom: '20px' }}>
            <svg ref={svgRef} width={width} height={height}></svg>
        </div>
    );
};

export default RelevanceChart;