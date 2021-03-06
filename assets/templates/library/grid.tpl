<% include ../shared/header.tpl %>
<scroller id="Library-Grid">
     <header>
        <simpleHeader>
            <title><%= __n("library" + (type ? "." + type : ""), items.length) %></title>
        </simpleHeader>
    </header>        
    <items>
        <grid id="Library-Grid-<%- parentId %>" columnCount="5">
            <items>
            <% items.forEach(function(item, index){ %>
                <moviePoster id="<%- index %>" accessibilityLabel="<%= item.Name %>" 
                    onSelect="atvutils.loadURL('<%=: ['library', item.CollectionType.toLowerCase(), item.Id] | buildUrl %>');"
                    onPlay="atvutils.loadURL('<%=: ['library', item.CollectionType.toLowerCase(), item.Id] | buildUrl %>');">
                    <title><%= item.Name %></title>
                    <subtitle>&#x00AD;</subtitle>
                    <image><%=: item.Id | imageUrl:'Primary',384 %></image>
                    <defaultImage>resource://16x9.png</defaultImage>
                </moviePoster>
            <% }); %>
            </items>
        </grid>
    </items>
</scroller>
<% include ../shared/footer.tpl %>