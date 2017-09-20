<% include header.tpl %>
<scroller id="Library-Grid">
    <items>
        <grid id="Library-Grid-<%- params.libId %>" columnCount="8">
            <items>
            <% items.forEach(function(item, index) { %>
                <<%=: item | posterType %> id="item_<%- index %>" showOutline="false" alwaysShowTitles="true"
                    onSelect="atvutils.loadURL('<%=: [params.serverId, params.libType, params.libId, item.Type.toLowerCase(), item.Id] | buildUrl %>');"
                    onPlay="atvutils.loadURL('<%=: [params.serverId, params.libType, params.libId, item.Type.toLowerCase(), item.Id] | buildUrl %>');"
                    onHoldSelect="atvutils.popUpMenu('<%=: [params.serverId, params.libType, params.libId, item.Type.toLowerCase(), item.Id] | buildUrl %>')">
                    <title><%= item.Name %></title>
                    <subtitle>&#x00AD;</subtitle>
                    <image><%=: item.Id | imageUrl:'Primary',384 %></image>
                    <defaultImage>resource://Poster.png</defaultImage>
                </<%=: item | posterType %>>
            <% }); %>
            </items>
        </grid>
    </items>
</scroller>
<% include footer.tpl %>