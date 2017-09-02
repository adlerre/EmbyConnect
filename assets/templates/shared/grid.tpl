<% include ../header.tpl %>
<scroller id="Library-Grid">
    <items>
        <grid id="Library-Grid-<%- params.libId %>" columnCount="8">
            <items>
            <% items.forEach(function(item, index) { %>
                <moviePoster id="item_<%- index %>" showOutline="false" alwaysShowTitles="true"
                    onSelect="atv.loadURL('<%=: [params.serverId, params.libType, params.libId, item.Type.toLowerCase(), item.Id] | buildUrl %>');"
                    onPlay="atv.loadURL('<%=: [params.serverId, params.libType, params.libId, item.Type.toLowerCase(), item.Id] | buildUrl %>');">
                    <title><%= item.Name %></title>
                    <subtitle>&#x00AD;</subtitle>
                    <image><%=: item.Id | imageUrl:'Primary',384 %></image>
                    <defaultImage>resource://Poster.png</defaultImage>
                </moviePoster>
            <% }); %>
            </items>
        </grid>
    </items>
</scroller>
<% include ../footer.tpl %>